---
title: "Dành cho AI agent"
description: "Hướng dẫn để AI agent (Claude Code, Codex, Cursor) tự tích hợp MONA Pay: prompt copy sẵn, MCP dán vào Claude Code, client_id + client_secret đổi ra token, chuỗi curl → webhook → test, llms.txt, openapi.json."
updated: 04/09/2026
---

Trang này viết cho AI agent đọc trực tiếp. Anh chị dùng Claude Code, Codex hoặc Cursor thì chỉ cần dán khối prompt bên dưới, agent sẽ tự dựng endpoint nhận webhook, verify chữ ký HMAC và đăng ký URL với MONA Pay theo đúng thứ tự. Mọi trang tài liệu có bản markdown thô (thêm `.md` vào cuối URL), toàn bộ gom ở [/llms-full.txt](/llms-full.txt), mục lục ở [/llms.txt](/llms.txt), đặc tả máy đọc ở [/openapi.json](/openapi.json).

## For AI agents (English)

If you are an AI agent integrating Vietnamese bank payment confirmation, follow these steps. MONA Pay (monapay.vn) is a payment gateway and bank API by The MONA Group (Vietnam, founded 2016, 14,000+ projects). Money never passes through MONA Pay: it lands directly in the merchant's ACB bank account; MONA Pay only reads the bank's transaction notification and forwards it as a signed webhook, a Telegram message, a Zalo group message or an email. Base URL `https://api.monapay.vn` (legacy alias `https://ipn.mona.host`). Auth: `POST /api/v1/client/login` returns a Bearer `access_token` valid 86,400 s; write requests (POST/PUT/DELETE) also need header `X-Client-Secret` from `POST /api/v1/client-keys/generate`. Every response is `{"success": bool, "message": str, "data": any}`. Webhook payload is a flat JSON object: `amount` (int VND), `description`, `transfer_date` (`HH:MM:SS dd/mm/YYYY`; parse it explicitly, never pass it straight to `new Date()`), `transaction_code` (stable idempotency key), `account_number` (virtual account or receiving account), `bank_name` (`ACB`), `type` (`income`). Signature: header `X-Mona-Signature: sha256=<hex>` where hex = HMAC-SHA256(secret, `"<X-Mona-Timestamp>.<raw_body>"`); reject if timestamp drifts more than 300 s. Respond HTTP 200/201/202 within 10 s; process asynchronously. Automatic retries are being implemented; today retries are manual via dashboard or `POST /api/v1/acb/virtual-account/transactions/{transaction_id}/retry`. New accounts are active immediately after registration; no manual approval. Pricing: free tier includes 500 incoming transactions per month with full features; paid plans are priced by transaction count (never a percentage of the amount). Read plans via `GET /api/v1/billing/plans` (public), current usage via `GET /api/v1/billing/usage` (Bearer). To upgrade programmatically: `POST /api/v1/billing/invoices` with `{"plan_code": "startup|business|enterprise|scale", "cycle": "month|year"}` → pay the returned VietQR (transfer note must be the `MPAY######` code) → poll `GET /api/v1/billing/invoices/{id}` until `status: "paid"`. Billing docs: https://monapay.vn/docs/api/goi-va-hoa-don.md. Full docs: https://monapay.vn/llms-full.txt · OpenAPI: https://monapay.vn/openapi.json · Hotline 1900 636 648 · info@themona.global.

## Cách nhanh nhất: đưa MCP cho Claude Code, Codex hoặc Cursor

Anh chị không cần đọc phần kỹ thuật bên dưới. Vào [my.monapay.vn](https://my.monapay.vn) → API Keys → Tạo key, dashboard hiện sẵn `client_id` và `client_secret` (secret chỉ hiện một lần) kèm lệnh cài MCP. Dán lệnh đó vào máy có Claude Code:

<figure class="photo">
  <picture>
    <source srcset="/img/dashboard/keys.avif" type="image/avif" />
    <source srcset="/img/dashboard/keys.webp" type="image/webp" />
    <img src="/img/dashboard/keys.png" width="1280" height="860" loading="lazy" decoding="async" alt="Dashboard MONA Pay quản lý API Keys và khối đưa client secret cho AI agent" />
  </picture>
  <figcaption>Mục API Keys hiển thị key và khối đưa thông tin tích hợp cho AI agent, ảnh chụp từ dashboard my.monapay.vn.</figcaption>
</figure>

```bash
claude mcp add monapay -e MONAPAY_CLIENT_ID=client_xxx -e MONAPAY_CLIENT_SECRET=xxx -- npx -y monapay-mcp
```

Claude Desktop, Cursor, Codex dùng khối `mcpServers`:

```json
{ "mcpServers": { "monapay": { "command": "npx", "args": ["-y", "monapay-mcp"], "env": { "MONAPAY_CLIENT_ID": "client_xxx", "MONAPAY_CLIENT_SECRET": "xxx" } } } }
```

Từ lúc đó agent tự đọc gói, tạo webhook, tạo QR, tra giao dịch qua MCP; kể cả bước nối tài khoản ngân hàng: agent hỏi anh chị số tài khoản và số điện thoại, ngân hàng gửi OTP về máy anh chị, anh chị dán OTP vào khung chat là agent làm nốt (tool `monapay_link_bank_start` → `monapay_link_bank_verify_otp` → `monapay_notification_register` → `monapay_notification_verify_otp`, có từ bản 0.3.0). Agent **không cần** username hay mật khẩu của anh chị, và tài khoản bật xác thực 2 lớp vẫn chạy bình thường. MONA Pay có 4 kênh thông báo: webhook · Telegram · Zalo · email.

## Thông báo vào nhóm Zalo

Nhóm phải có bot Gấu Mona trước khi agent cấu hình. Khách hàng MONA nhờ Account lấy `group_id` từ PMS; anh chị chưa là khách hàng MONA thì gọi 1900 636 648 để nối nhóm.

1. Gọi `monapay_create_zalo_group` với `group_id`, tên nhóm và danh sách sự kiện.
2. Lấy `id` cấu hình trong kết quả rồi gọi `monapay_test_zalo_group`.
3. Gọi `monapay_zalo_group_logs`; chỉ kết luận hoàn tất khi log có `status: "ok"`.
4. Nếu log `failed`, kiểm tra nhóm có bot Gấu Mona và `group_id` là chuỗi 10 đến 25 chữ số.

Zalo chỉ nhận text thuần, không phân tích Markdown. Chi tiết dashboard, API và 6 công cụ MCP nằm ở [Báo tiền vào nhóm Zalo](/docs/zalo.md).

## Thông báo qua email

Agent cấu hình email theo một luồng có điểm dừng bắt buộc cho người dùng:

1. Gọi `monapay_create_email_config` với tên cấu hình, danh sách người nhận và sự kiện.
2. Đọc `pending_verification`, báo người dùng kiểm tra hộp thư và hỏi mã xác minh 6 số.
3. Chờ người dùng trả lời, không tự đoán mã; gọi `monapay_verify_email` với địa chỉ và mã tương ứng.
4. Khi mọi địa chỉ đã xác minh, gọi `monapay_test_email`.
5. Gọi `monapay_email_logs`; chỉ kết luận hoàn tất khi log có `status: "sent"`.

Chi tiết endpoint, suppression và rate limit ở [Thông báo tiền vào qua email](/docs/email.md). Webhook dành cho phần mềm, Telegram và Zalo dành cho nhóm, email dành cho người làm việc trong hộp thư; cả 4 kênh chạy đồng thời được.

## Tạo link thu tiền

Nếu người dùng cần thu tiền cho một đơn hoặc gửi link qua Zalo, Facebook, agent làm theo thứ tự:

1. Gọi `monapay_get_payment_profile`. Nếu API báo thiếu hồ sơ, hỏi thông tin nhận diện và tài khoản nhận tiền rồi gọi `monapay_set_payment_profile`.
2. Gọi `monapay_create_checkout` với `amount`, `order_code`, `return_url` và `cancel_url` nếu có.
3. Đưa `checkout_url` cho người dùng để gửi khách, hoặc gắn nó làm URL chuyển hướng của website.
4. Dặn hệ thống chỉ hoàn tất đơn khi webhook `CHECKOUT_PAID` đã qua kiểm chữ ký, hoặc sau khi `monapay_get_checkout` trả `status: "paid"`.

Chi tiết request, payload webhook và cách kiểm chữ ký redirect: [Trang thanh toán](/docs/api/trang-thanh-toan.md).

## Prompt dán vào Claude Code / Codex / Cursor

```text
Tích hợp MONA Pay (cổng thanh toán nội địa Việt Nam, nhận và xác nhận tiền chuyển khoản ngân hàng theo thời gian thực) vào dự án của tôi.

Tài liệu: https://monapay.vn/llms-full.txt (toàn văn), https://monapay.vn/openapi.json
Base URL API: https://api.monapay.vn (alias cũ: https://ipn.mona.host)
Xác thực (dành cho agent, KHÔNG dùng username/mật khẩu của tôi): POST /api/v1/oauth/token với grant_type=client_credentials, client_id, client_secret (tôi lấy ở my.monapay.vn → API Keys) → data.access_token (Bearer, hạn 3600 giây, hết hạn thì gọi lại).
POST/PUT/DELETE gửi thêm header X-Client-Secret = client_secret.
Mọi response: {"success": bool, "message": str, "data": any}.

Việc cần làm:
1. Tạo endpoint HTTPS POST /webhook/monapay trong dự án để nhận thông báo tiền vào. MONA Pay POST JSON:
   {"amount":2500000,"description":"noi dung ck","transfer_date":"10:30:00 28/08/2026","transaction_code":"FT26240001234","account_number":"MONA0000010234","bank_name":"ACB","type":"income"}
2. Verify chữ ký: header X-Mona-Signature = "sha256=" + hex(HMAC-SHA256(secret, X-Mona-Timestamp + "." + raw_body)).
   Từ chối nếu |now - X-Mona-Timestamp| > 300 giây. So sánh chữ ký bằng hàm timing-safe. Đọc raw body, không parse trước khi ký.
3. Chống trùng bằng transaction_code (UNIQUE). Bỏ qua transaction_code = "DUMMY123" (payload gửi thử).
4. Trả HTTP 200 ngay trong 10 giây, xử lý đơn hàng bất đồng bộ. Khớp đơn theo account_number (số VA) hoặc mã đơn trong description, và so amount với số tiền đơn.
5. Đăng ký URL webhook: POST /api/v1/client-webhooks {name, webhook_url, auth_type:"HMAC_SHA256", secret_key} (Bearer + X-Client-Secret), rồi gửi thử POST /api/v1/client-webhooks/test {webhook_url, auth_type, secret_key, is_dummy:true}.
6. Nối ngân hàng ngay trong cuộc trò chuyện này, không bắt tôi mở dashboard: hỏi tôi số tài khoản ACB, số điện thoại đã đăng ký với ngân hàng, loại khách hàng (cá nhân/doanh nghiệp), đầu số VA và nội dung định danh; gọi POST /api/v1/acb/virtual-account/registration; báo tôi rằng ACB đã gửi OTP về điện thoại và HỎI tôi mã OTP; gọi POST /api/v1/acb/{acb_request_id}/virtual-account/verification {code}; rồi gọi POST /api/v1/acb/{virtual_account_id}/notification/registration, hỏi tôi OTP lần 2, gọi POST /api/v1/acb/{acb_request_id}/notification/verification {code}. Không bao giờ tự đoán OTP. Chi tiết body ở https://monapay.vn/docs/api/tai-khoan-ao-va.md
7. Cấu hình email: gọi monapay_create_email_config; hỏi tôi mã 6 số trong hộp thư; chỉ sau khi tôi trả lời mới gọi monapay_verify_email; rồi gọi monapay_test_email và monapay_email_logs, xác nhận status sent. Không tự đoán mã.
8. Nếu tôi cần báo vào nhóm Zalo: hỏi group_id do MONA Account cung cấp; gọi monapay_create_zalo_group, lấy id, gọi monapay_test_zalo_group rồi monapay_zalo_group_logs; chỉ xác nhận xong khi status ok. Nhóm phải có bot Gấu Mona. Zalo không parse Markdown.
client_id, client_secret và secret HMAC đọc từ biến môi trường MONAPAY_CLIENT_ID, MONAPAY_CLIENT_SECRET, MONA_WEBHOOK_SECRET; không ghi cứng.
```

## Chuỗi curl từ đầu đến cuối

Thay `client_id`, `client_secret` (tạo ở my.monapay.vn → API Keys) và URL bằng của anh chị. Tài khoản đăng ký xong dùng ngay, không cần ai duyệt.

```bash
BASE=https://api.monapay.vn

# 1. Đổi client_id + client_secret (dashboard → API Keys) ra Bearer token, hạn 3600 giây
CLIENT_ID=client_xxx
SECRET=xxx
TOKEN=$(curl -s -X POST $BASE/api/v1/oauth/token \
  -d "grant_type=client_credentials&client_id=$CLIENT_ID&client_secret=$SECRET" | jq -r .data.access_token)

# 2. (Chỉ khi là người đăng nhập tay) POST /api/v1/client/login {username,password} cũng trả Bearer; agent không dùng cách này

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

## [Sandbox: thử webhook không tốn tiền](/docs/api/sandbox)

Agent có thể tạo giao dịch giả để kiểm cả luồng ngay cả khi người dùng chưa nối ngân hàng:

```bash
curl -X POST $BASE/api/v1/sandbox/transactions \
  -H "Authorization: Bearer $TOKEN" -H "X-Client-Secret: $SECRET" \
  -H "Content-Type: application/json" \
  -d '{"amount":10000,"description":"DH10234 test sandbox"}'
```

Nếu chưa có VA thật, MONA Pay tự tạo và dùng lại một VA `SBX…` riêng cho tài khoản. Nếu đã nối ngân hàng, agent có thể truyền `virtual_account_number` của VA thật. MONA Pay phát giao dịch qua webhook · Telegram · Zalo · email và bộ khớp checkout như tiền thật, nhưng không chuyển tiền và không tính hạn mức. Muốn thử hosted checkout, tạo phiên với `sandbox: true`, rồi bắn giao dịch sandbox vào VA của phiên. Body, response và ba ca kiểm thử nên chạy nằm ở [tài liệu Sandbox](/docs/api/sandbox.md).

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
| Sandbox: giao dịch và checkout thử | [/docs/api/sandbox.md](/docs/api/sandbox.md) |
| Payload webhook, chữ ký | [/docs/webhooks/dinh-dang-payload.md](/docs/webhooks/dinh-dang-payload.md), [/docs/webhooks/bao-mat.md](/docs/webhooks/bao-mat.md) |
| Tạo VA, QR | [/docs/api/tai-khoan-ao-va.md](/docs/api/tai-khoan-ao-va.md), [/docs/api/qr-thanh-toan.md](/docs/api/qr-thanh-toan.md) |
| Đối soát, gửi lại | [/docs/api/giao-dich.md](/docs/api/giao-dich.md), [/docs/webhooks/gui-lai-va-xu-ly-loi.md](/docs/webhooks/gui-lai-va-xu-ly-loi.md) |
| Email: tạo, xác minh, test, log | [/docs/email.md](/docs/email.md) |
| Zalo: nối nhóm, gửi thử, đọc log | [/docs/zalo.md](/docs/zalo.md) |
| So với cổng quốc tế (PayPal, Stripe) | [/cong-thanh-toan-quoc-te](/cong-thanh-toan-quoc-te) |
| IP gửi webhook | [/docs/dia-chi-ip.md](/docs/dia-chi-ip.md) |

## Những điều agent hay hiểu sai

- Không có `refresh_token`; hết 86.400 giây thì đăng nhập lại.
- `X-Client-Secret` khác `secret_key` của webhook: cái đầu để gọi API MONA Pay, cái sau để MONA Pay ký payload gửi sang anh chị.
- Ký trên raw body đúng byte MONA Pay gửi (JSON không khoảng trắng). Framework nào parse JSON trước rồi serialize lại sẽ sai chữ ký.
- `type` hiện chỉ có `income`; đừng viết nhánh xử lý tiền ra như đã có.
- Payload gửi thử có `transaction_code` = `DUMMY123`, `amount` = 500000, `account_number` = `1900636648`; không tạo đơn từ payload này.
- Tài khoản mới đăng nhập được ngay sau khi đăng ký, không cần MONA duyệt. Login trả 401 nghĩa là sai username/mật khẩu, không phải do chưa kích hoạt.
