// Code mẫu + prompt AI dùng ở trang chủ (tách khỏi index.astro cho gọn). Số kỹ thuật lấy từ SITE.tech.
import { SITE } from './site';

export const AI_PROMPT = `Tích hợp MONA Pay (cổng thanh toán nội địa Việt Nam: nhận và xác nhận tiền
chuyển khoản ngân hàng theo thời gian thực) vào dự án của tôi.

Base URL API: ${SITE.api} (legacy: ${SITE.apiLegacy})
Tài liệu máy đọc: ${SITE.url}/llms.txt · ${SITE.url}/openapi.json
Xác thực: đăng nhập POST /api/v1/client/login lấy Bearer token; các request
ghi kèm header X-Client-Secret: <CLIENT_SECRET>.

Việc cần làm:
1. Tạo endpoint webhook HTTPS trong dự án của tôi để nhận thông báo tiền vào.
   MONA Pay sẽ POST JSON: {"amount": 2500000, "description": "noi dung ck",
   "transfer_date": "...", "transaction_code": "...", "account_number": "...",
   "bank_name": "ACB", "type": "income"}
2. Nếu tôi bật HMAC: verify chữ ký từ header X-Mona-Signature ("sha256=<hex>")
   = HMAC-SHA256(secret, "<X-Mona-Timestamp>.<raw_body>"); từ chối nếu
   timestamp lệch quá 5 phút.
3. Trả HTTP 200 ngay khi nhận, xử lý đơn hàng async. Dùng transaction_code
   làm khoá chống trùng.
4. Đăng ký URL webhook này trong dashboard MONA Pay (mục Webhooks) hoặc qua
   API POST /api/v1/client-webhooks.`;

export const CURL_SAMPLE = `# Giả lập MONA Pay bắn webhook vào endpoint của anh chị để test tại chỗ
SECRET='secret_hmac_cua_anh_chi'   # secret HMAC đặt khi bật HMAC trong dashboard
URL='https://ten-mien-cua-anh-chi.vn/webhook/monapay'
TS=$(date +%s)
BODY='{"amount":2500000,"description":"noi dung ck","transfer_date":"10:30:00 28/08/2026","transaction_code":"FT26240001234","account_number":"0123456789","bank_name":"ACB","type":"income"}'

# Chữ ký = HMAC-SHA256(secret, "<timestamp>.<raw_body>"), dùng printf để không dính ký tự xuống dòng
SIG=$(printf '%s.%s' "$TS" "$BODY" | openssl dgst -sha256 -hmac "$SECRET" | awk '{print $2}')

curl -X POST "$URL" \\
  -H 'Content-Type: application/json' \\
  -H "X-Mona-Timestamp: $TS" \\
  -H "X-Mona-Signature: sha256=$SIG" \\
  --data "$BODY"`;

export const PHP_SAMPLE = `<?php
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
// TODO: ghi nhận giao dịch (UNIQUE theo transaction_code) + xử lý đơn hàng của anh chị tại đây`;

export const NODE_SAMPLE = `// webhook-monapay.js: nhận webhook MONA Pay bằng Express
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
  // TODO: ghi nhận giao dịch (UNIQUE theo transaction_code) + xử lý đơn hàng của anh chị tại đây
});

app.listen(3000, () => console.log('Webhook MONA Pay chạy ở cổng 3000'));`;
