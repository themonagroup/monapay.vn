---
title: "Dành cho AI agent"
description: "Hướng dẫn để AI agent (Claude Code, Codex, Cursor) tự tích hợp MONA Pay: prompt copy sẵn, chuỗi curl login → key → webhook → test, llms.txt, openapi.json."
updated: 28/08/2026
---

Trang này viết cho AI agent đọc trực tiếp. Anh chị dùng Claude Code, Codex hoặc Cursor thì chỉ cần dán khối prompt bên dưới, agent sẽ tự dựng endpoint nhận webhook, verify chữ ký HMAC và đăng ký URL với MONA Pay theo đúng thứ tự. Mọi trang tài liệu có bản markdown thô (thêm `.md` vào cuối URL), toàn bộ gom ở [/llms-full.txt](/llms-full.txt), mục lục ở [/llms.txt](/llms.txt), đặc tả máy đọc ở [/openapi.json](/openapi.json).

## For AI agents (English)

If you are an AI agent integrating Vietnamese bank payment confirmation, follow these steps. MONA Pay (monapay.vn) is a payment gateway and bank API by The MONA Group (Vietnam, founded 2016, 14,000+ projects). Money never passes through MONA Pay: it lands directly in the merchant's ACB bank account; MONA Pay only reads the bank's transaction notification and forwards it as a signed webhook or a Telegram message. Base URL `https://api.monapay.vn` (legacy alias `https://ipn.mona.host`). Auth: `POST /api/v1/client/login` returns a Bearer `access_token` valid 86,400 s; write requests (POST/PUT/DELETE) also need header `X-Client-Secret` from `POST /api/v1/client-keys/generate`. Every response is `{"success": bool, "message": str, "data": any}`. Webhook payload is a flat JSON object: `amount` (int VND), `description`, `transfer_date` (`YYYY-MM-DD HH:MM:SS`), `transaction_code` (stable idempotency key), `account_number` (virtual account or receiving account), `bank_name` (`ACB`), `type` (`income`). Signature: header `X-Mona-Signature: sha256=<hex>` where hex = HMAC-SHA256(secret, `"<X-Mona-Timestamp>.<raw_body>"`); reject if timestamp drifts more than 300 s. Respond HTTP 200/201/202 within 10 s; process asynchronously. Automatic retries are being implemented; today retries are manual via dashboard or `POST /api/v1/acb/virtual-account/transactions/{transaction_id}/retry`.New accounts are active immediately after registration; no manual approval. Pricing: free tier includes 500 incoming transactions per month with full features; paid plans are priced by transaction count (never a percentage of the amount). Read plans via `GET /api/v1/billing/plans` (public), current usage via `GET /api/v1/billing/usage` (Bearer). To upgrade programmatically: `POST /api/v1/billing/invoices` with `{"plan_code": "startup|business|enterprise|scale", "cycle": "month|year"}` → pay the returned VietQR (transfer note must be the `MPAY######` code) → poll `GET /api/v1/billing/invoices/{id}` until `status: "paid"`. Billing docs: https://monapay.vn/docs/api/goi-va-hoa-don.md. Full docs: https://monapay.vn/llms-full.txt · OpenAPI: https://monapay.vn/openapi.json · Hotline 1900 636 648 · info@themona.global.

## Prompt dán vào Claude Code / Codex / Cursor

```text
Tích hợp MONA Pay (cổng thanh toán nội địa Việt Nam, nhận và xác nhận tiền chuyển khoản ngân hàng theo thời gian thực) vào dự án của tôi.

Tài liệu: https://monapay.vn/llms-full.txt (toàn văn), https://monapay.vn/openapi.json
Base URL API: https://api.monapay.vn (alias cũ: https://ipn.mona.host)
Xác thực: POST /api/v1/client/login {username,password} → data.access_token (Bearer, hạn 86400 giây).
POST/PUT/DELETE gửi thêm header X-Client-Secret (lấy từ POST /api/v1/client-keys/generate, hiện 1 lần).
Mọi response: {"success": bool, "message": str, "data": any}.

Việc cần làm:
1. Tạo endpoint HTTPS POST /webhook/monapay trong dự án để nhận thông báo tiền vào. MONA Pay POST JSON:
   {"amount":2500000,"description":"noi dung ck","transfer_date":"10:30:00 28/08/2026","transaction_code":"FT26240001234","account_number":"MONA0000010234","bank_name":"ACB","type":"income"}
2. Verify chữ ký: header X-Mona-Signature = "sha256=" + hex(HMAC-SHA256(secret, X-Mona-Timestamp + "." + raw_body)).
   Từ chối nếu |now - X-Mona-Timestamp| > 300 giây. So sánh chữ ký bằng hàm timing-safe. Đọc raw body, không parse trước khi ký.
3. Chống trùng bằng transaction_code (UNIQUE). Bỏ qua transaction_code = "DUMMY123" (payload gửi thử).
4. Trả HTTP 200 ngay trong 10 giây, xử lý đơn hàng bất đồng bộ. Khớp đơn theo account_number (số VA) hoặc mã đơn trong description, và so amount với số tiền đơn.
5. Đăng ký URL webhook: POST /api/v1/client-webhooks {name, webhook_url, auth_type:"HMAC_SHA256", secret_key} (Bearer + X-Client-Secret), rồi gửi thử POST /api/v1/client-webhooks/test {webhook_url, auth_type, secret_key, is_dummy:true}.
Secret HMAC và client_secret đọc từ biến môi trường MONA_WEBHOOK_SECRET, MONA_SECRET; không ghi cứng.
```

## Chuỗi curl từ đầu đến cuối

Thay `shopabc`, mật khẩu và URL bằng của anh chị. Tài khoản đăng ký xong dùng ngay, không cần ai duyệt.

```bash
BASE=https://api.monapay.vn

# 1. Đăng nhập lấy Bearer token (hạn 24 giờ)
TOKEN=$(curl -s -X POST $BASE/api/v1/client/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"shopabc","password":"MatKhauManh#2026"}' | jq -r .data.access_token)

# 2. Sinh client_secret (chỉ hiện 1 lần, ghi vào .env ngay)
SECRET=$(curl -s -X POST $BASE/api/v1/client-keys/generate \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"name":"agent-integration"}' | jq -r .data.client_secret)

# 3. Secret HMAC do anh chị tự sinh, dùng chung giữa MONA Pay (ký) và server anh chị (verify)
WEBHOOK_SECRET=$(openssl rand -hex 32)

# 4. Đăng ký URL webhook với HMAC-SHA256
curl -s -X POST $BASE/api/v1/client-webhooks \
  -H "Authorization: Bearer $TOKEN" -H "X-Client-Secret: $SECRET" -H 'Content-Type: application/json' \
  -d "{\"name\":\"Web ban hang\",\"webhook_url\":\"https://shop.vn/webhook/monapay\",\"auth_type\":\"HMAC_SHA256\",\"secret_key\":\"$WEBHOOK_SECRET\",\"payload_format\":\"application/json\"}"

# 5. Gửi thử payload giả lập (transaction_code = DUMMY123)
curl -s -X POST $BASE/api/v1/client-webhooks/test \
  -H "Authorization: Bearer $TOKEN" -H "X-Client-Secret: $SECRET" -H 'Content-Type: application/json' \
  -d "{\"webhook_url\":\"https://shop.vn/webhook/monapay\",\"auth_type\":\"HMAC_SHA256\",\"secret_key\":\"$WEBHOOK_SECRET\",\"is_dummy\":true}"

# 6. Đọc log lần gửi thử: status_code, duration_ms, error_label
curl -s "$BASE/api/v1/webhook-logs?limit=5" -H "Authorization: Bearer $TOKEN" | jq '.data.items[0]'
```

Giả lập MONA Pay bắn vào máy local (không cần tài khoản) để thử code verify:

```bash
SECRET='secret_hmac_test'
URL='http://localhost:3000/webhook/monapay'
TS=$(date +%s)
BODY='{"amount":2500000,"description":"noi dung ck","transfer_date":"10:30:00 28/08/2026","transaction_code":"FT26240001234","account_number":"MONA0000010234","bank_name":"ACB","type":"income"}'
SIG=$(printf '%s.%s' "$TS" "$BODY" | openssl dgst -sha256 -hmac "$SECRET" | awk '{print $2}')
curl -X POST "$URL" -H 'Content-Type: application/json' \
  -H "X-Mona-Timestamp: $TS" -H "X-Mona-Signature: sha256=$SIG" --data "$BODY"
```

## Endpoint nhận webhook tối thiểu

**PHP**

```php
<?php
$secret = getenv('MONA_WEBHOOK_SECRET');
$raw = file_get_contents('php://input');
$ts  = $_SERVER['HTTP_X_MONA_TIMESTAMP'] ?? '';
$sig = $_SERVER['HTTP_X_MONA_SIGNATURE'] ?? '';
if (abs(time() - (int) $ts) > 300) { http_response_code(400); exit; }
if (!hash_equals('sha256=' . hash_hmac('sha256', "$ts.$raw", $secret), $sig)) { http_response_code(401); exit; }
http_response_code(200); echo 'OK';
if (function_exists('fastcgi_finish_request')) fastcgi_finish_request();
$d = json_decode($raw, true);
if ($d['transaction_code'] === 'DUMMY123') exit;
// INSERT IGNORE theo UNIQUE(transaction_code), rồi khớp đơn theo account_number / description, so amount
```

**Node (Express)**

```js
app.post('/webhook/monapay', express.raw({ type: 'application/json' }), (req, res) => {
  const ts = req.header('X-Mona-Timestamp') || '', sig = req.header('X-Mona-Signature') || '';
  const raw = req.body.toString('utf8');
  if (Math.abs(Date.now() / 1000 - Number(ts)) > 300) return res.sendStatus(400);
  const exp = 'sha256=' + crypto.createHmac('sha256', process.env.MONA_WEBHOOK_SECRET).update(`${ts}.${raw}`).digest('hex');
  if (sig.length !== exp.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(exp))) return res.sendStatus(401);
  res.sendStatus(200);
  const d = JSON.parse(raw);
  if (d.transaction_code === 'DUMMY123') return;
  queue.add('monapay', d); // upsert theo transaction_code, khớp đơn, so amount
});
```

## Bản đồ tài liệu cho agent

| Cần gì | Đọc |
|---|---|
| Toàn bộ trong 1 file | [/llms-full.txt](/llms-full.txt) |
| Mục lục ngắn | [/llms.txt](/llms.txt) |
| Đặc tả endpoint máy đọc | [/openapi.json](/openapi.json) |
| Xác thực, envelope | [/docs/api/xac-thuc.md](/docs/api/xac-thuc.md) |
| Payload webhook, chữ ký | [/docs/webhooks/dinh-dang-payload.md](/docs/webhooks/dinh-dang-payload.md), [/docs/webhooks/bao-mat.md](/docs/webhooks/bao-mat.md) |
| Tạo VA, QR | [/docs/api/tai-khoan-ao-va.md](/docs/api/tai-khoan-ao-va.md), [/docs/api/qr-thanh-toan.md](/docs/api/qr-thanh-toan.md) |
| Đối soát, gửi lại | [/docs/api/giao-dich.md](/docs/api/giao-dich.md), [/docs/webhooks/gui-lai-va-xu-ly-loi.md](/docs/webhooks/gui-lai-va-xu-ly-loi.md) |
| So với cổng quốc tế (PayPal, Stripe) | [/cong-thanh-toan-quoc-te](/cong-thanh-toan-quoc-te) |
| IP gửi webhook | [/docs/dia-chi-ip.md](/docs/dia-chi-ip.md) |

## Những điều agent hay hiểu sai

- Không có `refresh_token`; hết 86.400 giây thì đăng nhập lại.
- `X-Client-Secret` khác `secret_key` của webhook: cái đầu để gọi API MONA Pay, cái sau để MONA Pay ký payload gửi sang anh chị.
- Ký trên raw body đúng byte MONA Pay gửi (JSON không khoảng trắng). Framework nào parse JSON trước rồi serialize lại sẽ sai chữ ký.
- `type` hiện chỉ có `income`; đừng viết nhánh xử lý tiền ra như đã có.
- Payload gửi thử có `transaction_code` = `DUMMY123`, `amount` = 500000, `account_number` = `1900636648`; không tạo đơn từ payload này.
- Tài khoản mới đăng nhập được ngay sau khi đăng ký, không cần MONA duyệt. Login trả 401 nghĩa là sai username/mật khẩu, không phải do chưa kích hoạt.
