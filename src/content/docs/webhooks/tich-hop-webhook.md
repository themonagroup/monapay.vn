---
title: "Tích hợp webhook thanh toán: nhận tiền vào ACB trong 5 phút"
description: Cách khai báo URL webhook, viết endpoint nhận thông báo tiền vào ACB, điều kiện thành công 200/201/202 trong 10 giây, chống trùng bằng transaction_code.
updated: 28/08/2026
---

Webhook MONA Pay là một request HTTP POST gửi tới URL của anh chị mỗi khi có tiền vào tài khoản ACB đã nối. Để tích hợp, anh chị khai báo URL trong dashboard hoặc qua API, viết một endpoint nhận JSON, kiểm chữ ký, trả HTTP 200 trong 10 giây rồi xử lý đơn hàng. Phần này mất khoảng 30 dòng code, có mẫu PHP và Node dán vào dùng ngay.

## Luồng một webhook

1. Tiền vào tài khoản ACB (qua VA, VietQR hoặc chuyển khoản thường).
2. ACB báo giao dịch cho MONA Pay, MONA Pay lưu vào dashboard.
3. MONA Pay tìm các cấu hình webhook khớp: cấu hình "mọi tài khoản" luôn được gửi, cấu hình gắn một VA chỉ gửi khi giao dịch thuộc VA đó.
4. Với mỗi cấu hình, MONA Pay POST payload tới URL, kèm chữ ký nếu bật HMAC, chờ tối đa 10 giây.
5. Máy chủ của anh chị trả HTTP 200, 201 hoặc 202: ghi log thành công. Mã khác hoặc quá 10 giây: ghi log thất bại kèm nhãn lỗi, anh chị gửi lại từ dashboard.

## Khai báo URL webhook

### Trong dashboard

Vào mục Webhooks, bấm Thêm webhook, điền:

| Trường | Ý nghĩa |
|---|---|
| Tên | Đặt cho dễ nhớ, ví dụ "Web bán hàng", "Phần mềm học phí" |
| URL | Địa chỉ HTTPS nhận webhook trên máy chủ của anh chị |
| Kiểu xác thực | `HMAC_SHA256` (khuyên dùng), `API_KEY` hoặc `NONE` |
| Secret | Chuỗi bí mật dùng để ký (HMAC) hoặc gửi kèm header (API key) |
| Định dạng gửi | `application/json` (mặc định), `application/x-www-form-urlencoded`, `multipart/form-data` |
| Tài khoản áp dụng | Mọi tài khoản, hoặc chọn một VA cụ thể |

### Qua API

```bash
curl -X POST https://api.monapay.vn/api/v1/client-webhooks \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Client-Secret: $CLIENT_SECRET" \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Web bán hàng",
    "webhook_url": "https://ten-mien-cua-anh-chi.vn/webhook/monapay",
    "auth_type": "HMAC_SHA256",
    "secret_key": "secret_hmac_cua_anh_chi",
    "payload_format": "application/json",
    "virtual_account_id": null
  }'
```

Các lệnh liên quan: `GET /api/v1/client-webhooks` xem danh sách, `PUT /api/v1/client-webhooks/{config_id}` sửa, `DELETE /api/v1/client-webhooks/{config_id}` xoá, `POST /api/v1/client-webhooks/test` gửi gói mẫu. Chi tiết tham số ở [Cấu hình webhook qua API](/docs/api/webhook-configs).

## Payload MONA Pay gửi

```json
{
  "amount": 2500000,
  "description": "noi dung chuyen khoan",
  "transfer_date": "2026-08-28 10:30:00",
  "transaction_code": "FT26240001234",
  "account_number": "1234567890",
  "bank_name": "ACB",
  "type": "income"
}
```

`transaction_code` giữ nguyên qua mọi lần gửi lại, dùng làm khoá chống trùng. `account_number` là số VA hoặc số tài khoản nhận tiền. Từng trường giải thích ở [Định dạng payload](/docs/webhooks/dinh-dang-payload).

## Viết endpoint nhận webhook

Endpoint tốt làm đúng 3 việc theo thứ tự: kiểm chữ ký, trả 200 ngay, xử lý sau. Việc nặng (cập nhật đơn, gửi email, gọi API khác) đẩy vào hàng đợi hoặc làm sau khi đã trả lời, để không bao giờ chạm mốc 10 giây.

```bash
# Giả lập MONA Pay bắn webhook vào endpoint của anh chị để test tại chỗ
SECRET='secret_hmac_cua_anh_chi'   # secret HMAC đặt khi bật HMAC trong dashboard
URL='https://ten-mien-cua-anh-chi.vn/webhook/monapay'
TS=$(date +%s)
BODY='{"amount":2500000,"description":"noi dung ck","transfer_date":"2026-08-28 10:30:00","transaction_code":"FT26240001234","account_number":"1234567890","bank_name":"ACB","type":"income"}'

# Chữ ký = HMAC-SHA256(secret, "<timestamp>.<raw_body>"), dùng printf để không dính ký tự xuống dòng
SIG=$(printf '%s.%s' "$TS" "$BODY" | openssl dgst -sha256 -hmac "$SECRET" | awk '{print $2}')

curl -X POST "$URL" \
  -H 'Content-Type: application/json' \
  -H "X-Mona-Timestamp: $TS" \
  -H "X-Mona-Signature: sha256=$SIG" \
  --data "$BODY"
```

```php
<?php
// webhook-monapay.php: endpoint nhận thông báo tiền vào từ MONA Pay
$secret = getenv('MONA_WEBHOOK_SECRET'); // secret HMAC đặt khi bật HMAC

$raw       = file_get_contents('php://input');
$timestamp = $_SERVER['HTTP_X_MONA_TIMESTAMP'] ?? '';
$signature = $_SERVER['HTTP_X_MONA_SIGNATURE'] ?? ''; // dạng "sha256=<hex>"

// 1. Chặn replay: timestamp lệch quá 5 phút thì từ chối
if (abs(time() - (int) $timestamp) > 300) {
    http_response_code(400);
    exit('timestamp qua han');
}

// 2. Verify chữ ký: HMAC-SHA256(secret, "<timestamp>.<raw_body>")
$expected = 'sha256=' . hash_hmac('sha256', $timestamp . '.' . $raw, $secret);
if (!hash_equals($expected, $signature)) { // hash_equals chống timing attack
    http_response_code(401);
    exit('sai chu ky');
}

// 3. Trả 200 ngay, việc nặng đẩy sang xử lý sau (queue/cron)
http_response_code(200);
echo 'OK';
if (function_exists('fastcgi_finish_request')) fastcgi_finish_request();

$data = json_decode($raw, true);

// 4. Chống trùng: transaction_code là khoá duy nhất
$pdo = new PDO(getenv('DB_DSN'), getenv('DB_USER'), getenv('DB_PASS'));
$stmt = $pdo->prepare(
    'INSERT IGNORE INTO giao_dich (transaction_code, amount, description, transfer_date, account_number)
     VALUES (?, ?, ?, ?, ?)'
);
$stmt->execute([$data['transaction_code'], $data['amount'], $data['description'], $data['transfer_date'], $data['account_number']]);
if ($stmt->rowCount() === 0) exit; // đã xử lý rồi, gói này là gửi lại

// TODO: khớp đơn hàng theo account_number (VA) hoặc description, đổi trạng thái đơn
```

```js
// webhook-monapay.js: nhận webhook MONA Pay bằng Express
const express = require('express');
const crypto  = require('crypto');

const app    = express();
const SECRET = process.env.MONA_WEBHOOK_SECRET; // secret HMAC đặt khi bật HMAC

// Phải đọc raw body thì chữ ký mới khớp (đừng dùng express.json() ở route này)
app.post('/webhook/monapay', express.raw({ type: 'application/json' }), async (req, res) => {
  const timestamp = req.header('X-Mona-Timestamp') || '';
  const signature = req.header('X-Mona-Signature') || ''; // "sha256=<hex>"
  const rawBody   = req.body.toString('utf8');

  // 1. Chặn replay: timestamp lệch quá 5 phút thì từ chối
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) {
    return res.status(400).send('timestamp qua han');
  }

  // 2. Verify chữ ký: HMAC-SHA256(secret, "<timestamp>.<raw_body>")
  const expected = 'sha256=' + crypto
    .createHmac('sha256', SECRET)
    .update(timestamp + '.' + rawBody)
    .digest('hex');
  const hopLe =
    signature.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  if (!hopLe) return res.status(401).send('sai chu ky');

  // 3. Trả 200 ngay, xử lý đơn hàng async sau đó
  res.status(200).send('OK');

  const data = JSON.parse(rawBody);

  // 4. Chống trùng: transaction_code là khoá duy nhất (ví dụ với bảng có UNIQUE(transaction_code))
  // const inserted = await db.insertIgnore('giao_dich', { transaction_code: data.transaction_code, ... });
  // if (!inserted) return; // gói gửi lại, đã xử lý trước đó

  // TODO: khớp đơn hàng theo data.account_number (VA) hoặc data.description, đổi trạng thái đơn
});

app.listen(3000, () => console.log('Webhook MONA Pay chạy ở cổng 3000'));
```

## Chống trùng giao dịch

Cùng một giao dịch có thể tới endpoint của anh chị nhiều lần: gửi lại thủ công từ dashboard, hai cấu hình webhook cùng trỏ một URL, hoặc máy chủ trả lỗi rồi được gửi lại. Cách xử lý chuẩn là tạo cột `transaction_code` có ràng buộc UNIQUE trong bảng giao dịch và dùng `INSERT IGNORE` (MySQL) hoặc `ON CONFLICT DO NOTHING` (PostgreSQL). Gói nào chèn không vào là gói đã xử lý, bỏ qua. Đừng dựa vào cặp số tiền + thời gian, hai khách chuyển cùng số tiền trong cùng phút là chuyện bình thường.

## Kiểm tra trước khi lên production

- Endpoint chạy HTTPS với chứng chỉ hợp lệ. Chứng chỉ tự ký hoặc hết hạn sẽ ra nhãn lỗi `SSL`.
- Tường lửa cho phép IP `103.168.55.14` (xem [Địa chỉ IP](/docs/dia-chi-ip)).
- Không có redirect ở URL webhook (ví dụ từ `http` sang `https` hoặc thêm dấu `/` cuối). Redirect ra nhãn `HTTP_3XX` và tính là thất bại.
- Bấm Gửi thử trong dashboard, xem Lịch sử gửi có mã 200 và thời gian phản hồi dưới 1 giây.
- Chuyển thử một khoản nhỏ vào VA để chạy luồng thật.

## Lỗi thường gặp

**Webhook về nhưng chữ ký không khớp.** Framework (Laravel, Express, Next.js) đã parse JSON rồi mới lấy body để ký. Phải lấy raw body nguyên bản. Xem cách lấy raw body từng framework ở [Bảo mật webhook](/docs/webhooks/bao-mat).

**Nhãn TIMEOUT dù endpoint chạy được.** Endpoint xử lý đơn xong mới trả lời, vượt 10 giây khi hệ thống bận. Trả 200 trước, xử lý sau.

**Nhãn HTTP_4XX với mã 404 hoặc 405.** Sai đường dẫn, hoặc route chỉ nhận GET. Webhook luôn là POST.

**Nhận được 2 lần cùng một giao dịch.** Bình thường. Chống trùng bằng `transaction_code` như mục trên.

**Không nhận được gì dù tiền đã vào.** Cấu hình webhook đang gắn một VA nhưng khách chuyển vào tài khoản chính hoặc VA khác. Tạo thêm một cấu hình "mọi tài khoản" để không sót, hoặc kiểm tra Lịch sử gửi trong dashboard xem MONA Pay có gửi không.
