---
title: "Trang thanh toán: tạo link là thu tiền"
description: "Tạo hosted checkout MONA Pay, gửi link cho khách hoặc chuyển hướng từ website, nhận CHECKOUT_PAID và xác minh chữ ký khi khách quay lại."
updated: 03/09/2026
---

Muốn thu một khoản tiền, anh chị gọi `POST /api/v1/checkouts`, lấy `checkout_url` rồi gửi link cho khách hoặc chuyển hướng trình duyệt sang link đó. Khách quét VietQR, tiền vào thẳng tài khoản ngân hàng của anh chị. MONA Pay xác nhận giao dịch, gửi webhook `CHECKOUT_PAID` và đưa khách về `return_url`.

> Webhook hoặc `GET /checkouts/{id}` là nguồn sự thật trước khi giao hàng. Redirect về website chỉ phục vụ trải nghiệm người dùng.

## Luồng tích hợp 5 bước

1. **Thiết lập hồ sơ thanh toán một lần.** Gọi `PUT /payment-profile` với tên shop, tài khoản ngân hàng hoặc VA mặc định và bộ thông tin tạo QR. API trả `return_signature_secret` đúng một lần khi tạo hoặc xoay secret.
2. **Tạo phiên cho từng đơn.** Gọi `POST /checkouts` với số tiền, mã đơn và `return_url`. Gửi cả `X-Client-Secret` và `Idempotency-Key` để tránh tạo trùng khi request được thử lại.
3. **Đưa khách sang trang thanh toán.** Chuyển hướng trình duyệt hoặc gửi `checkout_url` qua Zalo, Facebook, email. Link có dạng `https://pay.monapay.vn/c/<token>` và không yêu cầu đăng nhập.
4. **Chỉ xác nhận đơn khi nhận `CHECKOUT_PAID`.** Kiểm chữ ký HMAC webhook trên raw body, chống trùng bằng `transaction_code`, so lại mã đơn và số tiền. Có thể gọi `GET /checkouts/{id}` để đối soát server-side.
5. **Xác minh redirect khi khách quay lại.** Kiểm `sig` bằng `return_signature_secret`, kiểm thời gian `ts`, rồi gọi lại `GET /checkouts/{id}`. Không giao hàng chỉ dựa vào query string `status=paid`.

Phiên mặc định hết hạn sau 900 giây. MONA Pay chỉ đánh dấu `paid` khi tổng tiền khớp lớn hơn hoặc bằng số tiền của checkout. Khoản chuyển thiếu được ghi vào `partial_amount` nhưng phiên vẫn `pending`.

## Endpoint

Base API: `https://api.monapay.vn/api/v1`.

### Hồ sơ thanh toán

| Method | Endpoint | Auth | Dùng để |
|---|---|---|---|
| `GET` | `/payment-profile` | Bearer | Đọc hồ sơ và tài khoản nhận tiền mặc định |
| `PUT` | `/payment-profile` | Bearer + `X-Client-Secret` | Tạo hoặc cập nhật hồ sơ; secret redirect chỉ hiện một lần |
| `POST` | `/payment-profile/reveal-return-secret` | Bearer + `X-Client-Secret` | Xem lại `return_signature_secret` sau khi xác nhận mật khẩu hoặc 2FA |
| `POST` | `/payment-profile/rotate-return-secret` | Bearer + `X-Client-Secret` | Xoay `return_signature_secret` |

Nếu chưa có hồ sơ, tạo checkout trả HTTP 422 với `detail: "payment_profile_missing"`. Anh chị thiết lập ở dashboard, mục **Cài đặt → Trang thanh toán**, hoặc gọi MCP tool `monapay_set_payment_profile`.

### Mất `return_signature_secret`?

Gọi `POST /api/v1/payment-profile/reveal-return-secret` với `password` hoặc `totp_code` để xác nhận đúng chủ tài khoản rồi xem lại secret. Nếu không thể xác nhận hoặc nghi secret đã lộ, gọi `/payment-profile/rotate-return-secret` để xoay; lưu secret mới ngay và cập nhật biến môi trường trước khi xác minh redirect tiếp theo.

### Phiên thanh toán của merchant

| Method | Endpoint | Dùng để |
|---|---|---|
| `POST` | `/checkouts` | Tạo checkout, cần `Idempotency-Key`, trả HTTP 201 |
| `GET` | `/checkouts?status&order_code&from_date&to_date&page&limit` | Lọc và phân trang checkout |
| `GET` | `/checkouts/{id}` | Đọc một checkout theo ID |
| `POST` | `/checkouts/{id}/cancel` | Huỷ phiên đang `pending` |
| `POST` | `/checkouts/{id}/expire-now` | Hết hạn ngay, chỉ dành cho admin hoặc test |

`amount` là số nguyên VND từ 1.000 đến 1.000.000.000. `order_code` dài 1 đến 50 ký tự, chỉ gồm chữ, số, `_`, `-`, và không trùng trong các phiên đang chờ. `return_url` và `cancel_url` phải dùng HTTPS. `expires_in` nhận 60 đến 86.400 giây, mặc định 900 giây. `metadata` tối đa 2 KB.

Muốn thử mà chưa nối ngân hàng hoặc không chuyển tiền thật, thêm `sandbox: true`; xem [Sandbox](/docs/api/sandbox) để tạo giao dịch đủ tiền, thiếu tiền và gửi lại.

### Endpoint public cho trang checkout

Các endpoint sau không cần auth, chỉ nhận token ngẫu nhiên 32 ký tự. Response không lộ client ID, ID nội bộ hoặc email người trả.

| Method | Endpoint | Dùng để |
|---|---|---|
| `GET` | `/checkouts/public/{token}` | Dữ liệu hiển thị trang thanh toán |
| `GET` | `/checkouts/public/{token}/status` | Poll trạng thái, `paid_at`, `expires_at`, `seconds_left` |
| `GET` | `/checkouts/public/{token}/qr.png?size=512` | Ảnh QR PNG, cache 5 phút |
| `POST` | `/checkouts/public/{token}/cancel` | Huỷ phiên đang chờ và về `cancel_url` |
| `GET` | `/qr/{qr_id}/image.png?size=512` | Ảnh PNG cho mọi QR đã tạo |

Public API có `Cache-Control: no-store`, trừ ảnh QR, và giới hạn 60 request mỗi phút trên mỗi IP.

## cURL: tạo phiên thanh toán

Ví dụ đã có Bearer token trong `$TOKEN` và client secret trong `$MONAPAY_CLIENT_SECRET`:

```bash
curl -s -X POST https://api.monapay.vn/api/v1/checkouts \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Client-Secret: $MONAPAY_CLIENT_SECRET" \
  -H "Idempotency-Key: checkout-DH10234" \
  -H 'Content-Type: application/json' \
  -d '{"amount":250000,"order_code":"DH10234","description":"Thanh toan DH10234","return_url":"https://shop.vn/payment/return","cancel_url":"https://shop.vn/checkout","payer_email":"khach@example.com","expires_in":900}' \
  | jq '.data | {id, checkout_url, status, expires_at}'
```

## Node.js: tạo phiên, xử lý `CHECKOUT_PAID`, kiểm redirect

```js
import { createHmac, timingSafeEqual } from 'node:crypto';
import { MonaPay, verifyWebhook } from '@monapay/node';

const mona = MonaPay.fromEnv();
const checkout = await mona.checkouts.create({
  amount: 250000,
  order_code: 'DH10234',
  description: 'Thanh toan DH10234',
  return_url: 'https://shop.vn/payment/return',
  cancel_url: 'https://shop.vn/checkout',
});
console.log(checkout.checkout_url);

// Route webhook phải giữ rawBody đúng byte MONA Pay gửi.
const verified = verifyWebhook({ rawBody, headers, secret: process.env.MONA_WEBHOOK_SECRET });
if (!verified.ok) throw new Error(verified.reason);
const event = verified.payload.event || verified.payload.event_type;
if (event === 'CHECKOUT_PAID') {
  await saveOnce(verified.payload.transaction_code, verified.payload);
  const current = await mona.checkouts.get(verified.payload.id);
  if (current.status === 'paid') await markOrderPaid(current.order_code);
}

// Route return: sig = HMAC-SHA256(secret, "<id>|<order_code>|paid|<ts>").
const message = `${query.monapay_checkout}|${query.order_code}|paid|${query.ts}`;
const expected = createHmac('sha256', process.env.MONAPAY_RETURN_SECRET).update(message).digest('hex');
const supplied = String(query.sig || '');
const validSig = supplied.length === expected.length && timingSafeEqual(Buffer.from(supplied), Buffer.from(expected));
if (!validSig || Math.abs(Date.now() / 1000 - Number(query.ts)) > 300) throw new Error('Redirect không hợp lệ');
const current = await mona.checkouts.get(query.monapay_checkout);
if (current.status !== 'paid') throw new Error('Checkout chưa thanh toán');
```

`MONA_WEBHOOK_SECRET` là secret của cấu hình webhook. `MONAPAY_RETURN_SECRET` là `return_signature_secret` của hồ sơ thanh toán. Đây là hai secret khác nhau.

## Python: tạo phiên, xử lý `CHECKOUT_PAID`, kiểm redirect

```python
import hashlib
import hmac
import os
import time
from monapay import MonaPay, verify_webhook

mona = MonaPay.from_env()
checkout = mona.checkouts.create({
    "amount": 250000,
    "order_code": "DH10234",
    "description": "Thanh toan DH10234",
    "return_url": "https://shop.vn/payment/return",
    "cancel_url": "https://shop.vn/checkout",
})
print(checkout["checkout_url"])

# Route webhook: raw_body phải là bytes nguyên bản.
verified = verify_webhook(raw_body, headers, os.environ["MONA_WEBHOOK_SECRET"])
if not verified.ok:
    raise ValueError(verified.reason)
event = verified.payload.get("event") or verified.payload.get("event_type")
if event == "CHECKOUT_PAID":
    save_once(verified.payload["transaction_code"], verified.payload)
    current = mona.checkouts.get(verified.payload["id"])
    if current["status"] == "paid":
        mark_order_paid(current["order_code"])

# Route return: luôn gọi API kiểm trạng thái sau khi sig hợp lệ.
message = "{}|{}|paid|{}".format(query["monapay_checkout"], query["order_code"], query["ts"])
expected = hmac.new(os.environ["MONAPAY_RETURN_SECRET"].encode(), message.encode(), hashlib.sha256).hexdigest()
if not hmac.compare_digest(expected, query.get("sig", "")) or abs(time.time() - int(query["ts"])) > 300:
    raise ValueError("Redirect không hợp lệ")
current = mona.checkouts.get(query["monapay_checkout"])
if current["status"] != "paid":
    raise ValueError("Checkout chưa thanh toán")
```

## Payload `CHECKOUT_PAID`

Event dùng cùng chữ ký `X-Mona-Signature` và `X-Mona-Timestamp` như webhook giao dịch hiện có. Payload chứa dữ liệu checkout rút gọn, `order_code`, `amount`, `paid_amount`, `paid_at` và `transaction_code`. Lưu `transaction_code` bằng unique constraint để việc gửi lại webhook không xử lý đơn hai lần.

## Redirect về website

Sau khi checkout chuyển sang `paid`, trang thanh toán đợi khoảng 3 giây rồi nối các tham số sau vào `return_url`:

```text
?monapay_checkout=<id>&order_code=<order_code>&status=paid&ts=<unix>&sig=<hex>
```

Chữ ký là HMAC-SHA256 dạng hex với message `<id>|<order_code>|paid|<ts>`. Khi khách huỷ, MONA Pay về `cancel_url?monapay_checkout=<id>&status=cancelled`; redirect huỷ không có chữ ký.

## Câu hỏi thường gặp

### Tiền có đi qua MONA Pay không?

Không. Tiền đi thẳng từ tài khoản ngân hàng của khách vào tài khoản ngân hàng của anh chị. MONA Pay tạo QR, nhận báo có và xác nhận giao dịch, không giữ tiền.

### Checkout hết hạn thì sao?

Phiên mặc định hết hạn sau 15 phút và không tạo QR mới. Nếu khách chuyển sau hạn, MONA Pay vẫn ghi nhận giao dịch, đổi phiên sang `paid` với `paid_late=true`; merchant tự quyết định nhận đơn hay hoàn tiền.

### Khách chuyển thiếu tiền thì sao?

Checkout vẫn ở trạng thái `pending`. MONA Pay ghi `partial_amount` và cảnh báo để anh chị xử lý. Chỉ khi tổng tiền khớp lớn hơn hoặc bằng `amount`, phiên mới chuyển sang `paid`.

### Không có website vẫn tạo link thu tiền được không?

Được. Anh chị tạo link trong dashboard hoặc dùng `monapay_create_checkout`, rồi gửi `checkout_url` qua Zalo, Facebook hoặc email. Khách mở link, quét QR và thanh toán, không cần tài khoản MONA Pay.
