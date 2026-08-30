---
title: Bắt đầu nhanh với MONA Pay trong 5 phút
description: Từ đăng ký tài khoản tới nhận webhook đầu tiên bằng tiền thật. 6 bước, có code cURL, PHP, Node để dán vào dùng ngay.
updated: 28/08/2026
---

Để nhận thông báo tiền vào tài khoản ACB theo thời gian thực, anh chị cần 6 bước: đăng ký tài khoản (dùng ngay, không cần duyệt), đăng nhập lấy token, tạo API key, nối tài khoản ACB bằng OTP, khai báo URL webhook, rồi chuyển một khoản nhỏ để kiểm tra. Nếu đã có tài khoản ACB và một máy chủ nhận webhook, phần thao tác mất khoảng 5 phút.

## Chuẩn bị

- Tài khoản ngân hàng ACB đứng tên anh chị hoặc doanh nghiệp, kèm số điện thoại đã đăng ký với ACB (để nhận OTP).
- Một URL HTTPS trên máy chủ của anh chị để nhận webhook, ví dụ `https://ten-mien-cua-anh-chi.vn/webhook/monapay`. Chưa có máy chủ thì vẫn dùng được thông báo Telegram, xem trang [Telegram](/docs/telegram).
- Công cụ gọi API: cURL, Postman, hoặc để AI agent gọi giùm theo [prompt có sẵn](/docs/ai-agent).

## Bước 1. Đăng ký tài khoản

Vào `https://my.monapay.vn/auth`, chọn tab Đăng ký, điền tên đăng nhập, mật khẩu, tên và email. Anh chị cũng gọi được API:

```bash
curl -X POST https://api.monapay.vn/api/v1/client/register-client \
  -H 'Content-Type: application/json' \
  -d '{"username":"shop-cua-toi","password":"mat-khau-manh","name":"Shop của tôi"}'
```

Tài khoản tạo xong dùng được ngay: đăng nhập liền ở bước 2, không cần ai duyệt. MONA Pay miễn phí 500 giao dịch mỗi tháng, gói trả phí tính theo số giao dịch (xem [bảng giá](/bang-gia)).

## Bước 2. Đăng nhập lấy token

```bash
curl -X POST https://api.monapay.vn/api/v1/client/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"shop-cua-toi","password":"mat-khau-manh"}'
```

Kết quả trả về theo khung chung của mọi API:

```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "data": { "access_token": "eyJhbGciOi...", "expires_in": 86400 }
}
```

Từ đây mọi lệnh gọi API đều gửi kèm `Authorization: Bearer <access_token>`. Chi tiết ở trang [Xác thực](/docs/api/xac-thuc).

## Bước 3. Tạo API key

Các request POST, PUT, DELETE cần thêm header `X-Client-Secret`. Tạo khoá trong dashboard mục API Keys, hoặc:

```bash
curl -X POST https://api.monapay.vn/api/v1/client-keys/generate \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"name":"may-chu-production"}'
```

`client_secret` chỉ hiện đúng 1 lần trong response. Lưu vào biến môi trường ngay, mất thì tạo khoá mới và thu hồi khoá cũ. Xem [API keys](/docs/api/api-keys).

## Bước 4. Nối tài khoản ACB (4 bước, có OTP)

Làm trong dashboard, mục Ngân hàng & VA, nút Thêm tài khoản:

1. Nhập số tài khoản ACB, số điện thoại đăng ký với ACB, loại khách hàng (cá nhân hoặc doanh nghiệp).
2. ACB gửi OTP về điện thoại. Nhập OTP để xác thực và tạo tài khoản ảo (VA) đầu tiên.
3. Đăng ký nhận thông báo giao dịch. ACB gửi OTP lần 2, nhập tiếp.
4. Xong. Từ lúc này tiền vào VA hoặc tài khoản là MONA Pay nhận được thông báo.

Nếu muốn làm bằng API thay vì dashboard, xem [Tài khoản ảo (VA)](/docs/api/tai-khoan-ao-va), luồng cũng đúng 4 lệnh gọi này.

## Bước 5. Khai báo URL webhook

Vào dashboard mục Webhooks, bấm Thêm webhook, điền URL, chọn kiểu xác thực HMAC_SHA256 và đặt secret. Hoặc gọi API:

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
    "payload_format": "application/json"
  }'
```

Không truyền `virtual_account_id` thì webhook nhận mọi giao dịch của mọi tài khoản. Truyền id của một VA thì chỉ nhận giao dịch của VA đó.

Phía máy chủ của anh chị, endpoint chỉ cần làm 3 việc: kiểm chữ ký, trả HTTP 200 ngay, rồi xử lý đơn sau. Code mẫu dán vào dùng được:

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
// $data['amount'], $data['description'], $data['transaction_code'], ...
// TODO: ghi nhận giao dịch + xử lý đơn hàng của anh chị tại đây
```

```js
// webhook-monapay.js: nhận webhook MONA Pay bằng Express
const express = require('express');
const crypto  = require('crypto');

const app    = express();
const SECRET = process.env.MONA_WEBHOOK_SECRET; // secret HMAC đặt khi bật HMAC

// Phải đọc raw body thì chữ ký mới khớp (đừng dùng express.json() ở route này)
app.post('/webhook/monapay', express.raw({ type: 'application/json' }), (req, res) => {
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
  // data.amount, data.description, data.transaction_code, ...
  // TODO: ghi nhận giao dịch + xử lý đơn hàng của anh chị tại đây
});

app.listen(3000, () => console.log('Webhook MONA Pay chạy ở cổng 3000'));
```

## Bước 6. Gửi thử rồi chuyển tiền thật

Trước hết bấm Gửi thử trong dashboard (mục Webhooks) hoặc gọi `POST /api/v1/client-webhooks/test`. MONA Pay bắn một gói mẫu tới URL của anh chị, kết quả hiện ngay trong Lịch sử gửi kèm mã HTTP và thời gian phản hồi.

Muốn kiểm tra tại chỗ không cần chờ MONA Pay, anh chị giả lập chính xác gói MONA Pay gửi bằng cURL:

```bash
# Giả lập MONA Pay bắn webhook vào endpoint của anh chị để test tại chỗ
SECRET='secret_hmac_cua_anh_chi'   # secret HMAC đặt khi bật HMAC trong dashboard
URL='https://ten-mien-cua-anh-chi.vn/webhook/monapay'
TS=$(date +%s)
BODY='{"amount":2500000,"description":"noi dung ck","transfer_date":"10:30:00 28/08/2026","transaction_code":"FT26240001234","account_number":"1234567890","bank_name":"ACB","type":"income"}'

# Chữ ký = HMAC-SHA256(secret, "<timestamp>.<raw_body>"), dùng printf để không dính ký tự xuống dòng
SIG=$(printf '%s.%s' "$TS" "$BODY" | openssl dgst -sha256 -hmac "$SECRET" | awk '{print $2}')

curl -X POST "$URL" \
  -H 'Content-Type: application/json' \
  -H "X-Mona-Timestamp: $TS" \
  -H "X-Mona-Signature: sha256=$SIG" \
  --data "$BODY"
```

Cuối cùng chuyển một khoản nhỏ vào số VA vừa tạo, ví dụ 10.000đ, từ app ngân hàng bất kỳ. Trong vài giây anh chị sẽ thấy giao dịch trong dashboard và webhook về máy chủ.

## Sau khi chạy được

- Đọc [Định dạng payload](/docs/webhooks/dinh-dang-payload) để biết từng trường dữ liệu và dùng `transaction_code` làm khoá chống trùng.
- Đọc [Gửi lại và xử lý lỗi](/docs/webhooks/gui-lai-va-xu-ly-loi) để hiểu log, nhãn lỗi và cách gửi lại.
- Mở tường lửa cho IP `103.168.55.14` nếu máy chủ của anh chị chặn kết nối lạ, xem [Địa chỉ IP](/docs/dia-chi-ip).
- Muốn tạo mã QR có sẵn số tiền cho từng đơn: [QR thanh toán](/docs/api/qr-thanh-toan).

## Lỗi thường gặp

**Đăng nhập báo sai tài khoản dù mật khẩu đúng.** Kiểm tra lại username (phân biệt hoa thường) và mật khẩu. Tài khoản mới đăng ký là đăng nhập được ngay, không có bước chờ kích hoạt; vẫn kẹt thì gọi 1900 636 648.

**Gọi POST bị từ chối dù đã có Bearer token.** Thiếu header `X-Client-Secret`. Mọi POST, PUT, DELETE nên gửi kèm khoá này (GET thì không); bản máy chủ ép buộc đang chờ đưa lên, gửi sẵn từ giờ thì không phải sửa sau.

**Gửi thử báo TIMEOUT.** Máy chủ của anh chị không trả lời trong 10 giây. Trả HTTP 200 trước, xử lý đơn sau như code mẫu ở trên.

**Chữ ký không khớp.** Thường do framework đã parse JSON rồi mới ký lại. Phải ký trên raw body đúng từng byte MONA Pay gửi, xem [Bảo mật webhook](/docs/webhooks/bao-mat).

**Chuyển tiền rồi mà không thấy giao dịch.** Kiểm tra bước 4 đã hoàn tất cả 2 lần OTP chưa. Thiếu OTP lần 2 (đăng ký nhận thông báo) thì ACB không báo giao dịch sang MONA Pay.
