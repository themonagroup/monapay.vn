---
title: "Bảo mật webhook: chữ ký HMAC-SHA256 và chống replay"
description: 3 kiểu xác thực webhook MONA Pay (HMAC_SHA256, API_KEY, NONE), cách tính và kiểm chữ ký X-Mona-Signature, cửa sổ 5 phút chống replay, code cURL, PHP, Node.
updated: 28/08/2026
---

Webhook MONA Pay có 3 kiểu xác thực: `HMAC_SHA256` (ký từng gói bằng secret chung, khuyên dùng), `API_KEY` (gửi secret trong một header) và `NONE` (không xác thực). Với HMAC, mỗi gói kèm header `X-Mona-Timestamp` và `X-Mona-Signature`; anh chị tính lại chữ ký từ raw body, khớp thì nhận, và từ chối gói có timestamp lệch quá 5 phút.

## Vì sao phải xác thực

URL webhook là địa chỉ công khai. Ai đoán được địa chỉ đó đều gửi được một gói JSON giả "có 50.000.000đ vào tài khoản". Nếu endpoint tin ngay, đơn hàng được đánh dấu đã trả dù không có đồng nào. Xác thực giúp endpoint chỉ tin gói do MONA Pay gửi. Trong 3 kiểu, HMAC mạnh nhất vì secret không bao giờ đi trên đường truyền, chỉ có chữ ký tính từ secret.

## Kiểu 1: `HMAC_SHA256` (khuyên dùng)

### MONA Pay ký thế nào

1. Lấy `timestamp` = unix giây lúc gửi.
2. Lấy `raw_body` = chuỗi body đúng như sẽ gửi: JSON không khoảng trắng thừa (kiểu `application/json`) hoặc chuỗi urlencoded (kiểu form).
3. Tính `signature = HMAC-SHA256(secret, timestamp + "." + raw_body)`, xuất hex chữ thường.
4. Gửi kèm 2 header:

```text
X-Mona-Timestamp: 1756355400
X-Mona-Signature: sha256=3f2a9c...e71b
```

Secret là chuỗi anh chị đặt khi tạo cấu hình webhook (trường Secret trong dashboard hoặc `secret_key` qua API). Đặt dài ít nhất 32 ký tự ngẫu nhiên, mỗi cấu hình một secret riêng.

### Anh chị kiểm thế nào

1. Đọc raw body nguyên bản (chưa parse).
2. Kiểm `|now - timestamp| <= 300` giây. Lệch hơn 5 phút thì trả 400 và bỏ, đây là chống replay: kẻ gian bắt được một gói hợp lệ cũng không dùng lại được sau 5 phút.
3. Tính lại `sha256=` + HMAC-SHA256(secret, `timestamp + "." + raw_body`).
4. So với `X-Mona-Signature` bằng hàm so sánh thời gian cố định (`hash_equals`, `crypto.timingSafeEqual`). Khớp thì xử lý, không thì trả 401.

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

### Lấy raw body ở từng framework

Chữ ký tính trên từng byte của body. Framework nào parse JSON rồi `json_encode` lại là hỏng, vì thứ tự khoá, khoảng trắng hay escape unicode có thể khác. Cách lấy raw body:

| Framework | Cách lấy raw body |
|---|---|
| PHP thuần, WordPress | `file_get_contents('php://input')` |
| Laravel | `$request->getContent()` |
| Express | `express.raw({ type: 'application/json' })` ở route webhook, rồi `req.body.toString('utf8')` |
| Next.js (App Router) | `await request.text()` thay vì `request.json()` |
| Django | `request.body` (bytes) |
| FastAPI | `await request.body()` |
| Google Apps Script | `e.postData.contents` |

Trong WordPress, đăng ký route qua `register_rest_route` với `methods => 'POST'` và đọc `$request->get_body()`.

## Kiểu 2: `API_KEY`

MONA Pay gửi secret nguyên văn trong một header. Tên header anh chị đặt khi tạo cấu hình (`api_key_name`), mặc định `X-Webhook-Secret`. Endpoint so header với secret đã lưu, khớp thì nhận.

```php
<?php
$secret = getenv('MONA_WEBHOOK_SECRET');
$header = $_SERVER['HTTP_X_WEBHOOK_SECRET'] ?? '';
if (!hash_equals($secret, $header)) {
    http_response_code(401);
    exit('sai khoa');
}
http_response_code(200);
echo 'OK';
```

Kiểu này đơn giản hơn HMAC nhưng secret đi trên đường truyền mỗi lần gửi và không có chống replay. Chỉ dùng khi hệ thống của anh chị không tính được HMAC (một số nền tảng no-code chỉ cho so header).

## Kiểu 3: `NONE`

Không header xác thực nào. Chỉ nên dùng ở môi trường thử nghiệm nội bộ. Nếu buộc phải dùng trên production, ít nhất hãy chặn IP: chỉ nhận request từ `103.168.55.14` (xem [Địa chỉ IP](/docs/dia-chi-ip)) và xác minh lại giao dịch qua [API đối soát](/docs/webhooks/doi-soat) trước khi giao hàng.

## Danh sách kiểm tra bảo mật

- Endpoint chạy HTTPS. MONA Pay gửi tới URL HTTP thường vẫn được, nhưng payload sẽ đi qua mạng dạng rõ.
- Bật `HMAC_SHA256`, secret ít nhất 32 ký tự ngẫu nhiên, lưu ở biến môi trường, không hard-code.
- Từ chối timestamp lệch quá 5 phút. Đồng bộ giờ máy chủ bằng NTP, lệch giờ máy chủ là nguyên nhân hay gặp nhất khiến gói hợp lệ bị từ chối.
- So chữ ký bằng hàm thời gian cố định.
- Chống trùng bằng `transaction_code` UNIQUE.
- Với giao dịch giá trị lớn, xác minh lại qua API đối soát trước khi giao hàng, dù chữ ký đã khớp.
- Đổi secret định kỳ hoặc ngay khi nghi lộ: tạo cấu hình webhook mới với secret mới, chuyển code sang, rồi xoá cấu hình cũ.

## Lỗi thường gặp

**Chữ ký luôn sai dù secret đúng.** Body bị framework parse rồi encode lại, hoặc middleware nào đó thêm khoảng trắng. Lấy raw body theo bảng trên.

**Chữ ký khớp lúc thử bằng cURL nhưng sai khi MONA Pay gửi thật.** Lúc thử anh chị ký bằng JSON có khoảng trắng, còn MONA Pay gửi JSON không khoảng trắng. Không cần tự tạo lại JSON, chỉ cần ký đúng chuỗi nhận được.

**Gói hợp lệ bị từ chối "timestamp qua han".** Giờ máy chủ của anh chị lệch hơn 5 phút. Bật đồng bộ NTP.

**Dùng `API_KEY` mà header không thấy.** Một số máy chủ (Apache với PHP-FPM) bỏ header có dấu gạch dưới hoặc đổi tên header. Đặt tên header chỉ dùng chữ và dấu gạch ngang, ví dụ `X-Webhook-Secret`, và kiểm bằng `getallheaders()`.
