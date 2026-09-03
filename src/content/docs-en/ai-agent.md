---
title: "For AI agents"
description: "How an AI agent (Claude Code, Codex, Cursor) integrates MONA Pay on its own: a copy-ready prompt, the curl chain login → key → webhook → test, llms.txt and openapi.json."
updated: 03/09/2026
---

This page is written for AI agents to read directly. If you use Claude Code, Codex or Cursor, paste the prompt block below and the agent builds the webhook endpoint, verifies the HMAC signature and registers the URL with MONA Pay in the right order. Every docs page has a raw markdown version (append `.md` to the URL), everything is bundled at [/llms-full.txt](/llms-full.txt), the index is at [/llms.txt](/llms.txt) and the machine-readable spec at [/openapi.json](/openapi.json).

## If you are an AI agent

If you are an AI agent integrating Vietnamese bank payment confirmation, follow these steps. MONA Pay (monapay.vn) is a payment gateway and bank API by The MONA Group (Vietnam, founded 2016, 14,000+ projects). Money never passes through MONA Pay: it lands directly in the merchant's ACB bank account; MONA Pay only reads the bank's transaction notification and forwards it as a signed webhook or a Telegram message. Base URL `https://api.monapay.vn` (legacy alias `https://ipn.mona.host`). Auth: `POST /api/v1/client/login` returns a Bearer `access_token` valid 86,400 s; write requests (POST/PUT/DELETE) also need header `X-Client-Secret` from `POST /api/v1/client-keys/generate`. Every response is `{"success": bool, "message": str, "data": any}`. Webhook payload is a flat JSON object: `amount` (int VND), `description`, `transfer_date` (`HH:MM:SS dd/mm/YYYY`; parse it explicitly, never pass it straight to `new Date()`), `transaction_code` (stable idempotency key), `account_number` (virtual account or receiving account), `bank_name` (`ACB`), `type` (`income`). Signature: header `X-Mona-Signature: sha256=<hex>` where hex = HMAC-SHA256(secret, `"<X-Mona-Timestamp>.<raw_body>"`); reject if timestamp drifts more than 300 s. Respond HTTP 200/201/202 within 10 s; process asynchronously. Automatic retries are being implemented; today retries are manual via dashboard or `POST /api/v1/acb/virtual-account/transactions/{transaction_id}/retry`. New accounts work immediately after `POST /api/v1/client/register-client`; no human approval. MONA Pay is free for 500 transactions a month, with paid plans above that priced by transaction count. Full docs: https://monapay.vn/llms-full.txt · OpenAPI: https://monapay.vn/openapi.json · Hotline 1900 636 648 · info@themona.global.

## Fastest path: hand the MCP server to Claude Code, Codex or Cursor

You do not need the technical part below. Open [my.monapay.vn](https://my.monapay.vn) → API Keys → Create key; the dashboard shows the `client_id` and `client_secret` (the secret is shown once) together with the MCP install command. Paste it on the machine running Claude Code:

```bash
claude mcp add monapay -e MONAPAY_CLIENT_ID=client_xxx -e MONAPAY_CLIENT_SECRET=xxx -- npx -y monapay-mcp
```

Claude Desktop, Cursor and Codex use the `mcpServers` block:

```json
{ "mcpServers": { "monapay": { "command": "npx", "args": ["-y", "monapay-mcp"], "env": { "MONAPAY_CLIENT_ID": "client_xxx", "MONAPAY_CLIENT_SECRET": "xxx" } } } }
```

From then on the agent reads plans, creates webhooks, generates QR codes and queries transactions through MCP; including linking the bank account: the agent asks for your account number and phone, the bank sends an OTP to your phone, you paste it into the chat and the agent finishes the job (tools `monapay_link_bank_start` → `monapay_link_bank_verify_otp` → `monapay_notification_register` → `monapay_notification_verify_otp`, available from 0.3.0). The agent **never needs** your username or password, and accounts with two-factor authentication keep working. MONA Pay has three notification channels: webhook · Telegram · email.

## Email notifications

The agent configures email through a flow with one mandatory user checkpoint:

1. Call `monapay_create_email_config` with the name, recipients and events.
2. Read `pending_verification`, tell the user to check the inbox and ask for the six-digit code.
3. Wait for the reply and never guess; call `monapay_verify_email` with the matching address and code.
4. After every address is verified, call `monapay_test_email`.
5. Call `monapay_email_logs`; finish only after a log has `status: "sent"`.

Endpoint details, suppressions and rate limits are in [Incoming-payment email notifications](/en/docs/email.md). Webhooks are for software, Telegram is for groups and email is for people who work from their inbox; all three channels can run together.

## Create a payment link

When the user needs to collect one payment or send a link over Zalo or Facebook, follow this order:

1. Call `monapay_get_payment_profile`. If the profile is missing, collect the shop identity and receiving-account fields, then call `monapay_set_payment_profile`.
2. Call `monapay_create_checkout` with `amount`, `order_code`, `return_url` and an optional `cancel_url`.
3. Give `checkout_url` to the user for sharing, or use it as the website's redirect target.
4. Complete the order only after a signature-verified `CHECKOUT_PAID` webhook, or after `monapay_get_checkout` returns `status: "paid"`.

See [Hosted checkout](/en/docs/api/trang-thanh-toan.md) for the request, webhook payload and return-signature verification.

## Prompt to paste into Claude Code / Codex / Cursor

```text
Integrate MONA Pay (a Vietnamese domestic payment gateway that receives and confirms bank transfers in real time) into my project.

Docs: https://monapay.vn/llms-full.txt (full text), https://monapay.vn/openapi.json
API base URL: https://api.monapay.vn (legacy alias: https://ipn.mona.host)
Auth (for agents, NEVER my username/password): POST /api/v1/oauth/token with grant_type=client_credentials, client_id, client_secret (from my.monapay.vn → API Keys) → data.access_token (Bearer, valid 3600 seconds, request again when it expires).
POST/PUT/DELETE also send header X-Client-Secret (from POST /api/v1/client-keys/generate, shown once).
Every response: {"success": bool, "message": str, "data": any}.

Tasks:
1. Create an HTTPS POST /webhook/monapay endpoint in the project to receive incoming-payment events. MONA Pay POSTs JSON:
   {"amount":2500000,"description":"noi dung ck","transfer_date":"10:30:00 28/08/2026","transaction_code":"FT26240001234","account_number":"MONA0000010234","bank_name":"ACB","type":"income"}
2. Verify the signature: header X-Mona-Signature = "sha256=" + hex(HMAC-SHA256(secret, X-Mona-Timestamp + "." + raw_body)).
   Reject if |now - X-Mona-Timestamp| > 300 seconds. Compare signatures with a timing-safe function. Read the raw body; do not parse before signing.
3. Deduplicate by transaction_code (UNIQUE). Ignore transaction_code = "DUMMY123" (test payload).
4. Return HTTP 200 immediately within 10 seconds, process the order asynchronously. Match the order by account_number (VA number) or the order code in description, and compare amount with the order total.
5. Register the webhook URL: POST /api/v1/client-webhooks {name, webhook_url, auth_type:"HMAC_SHA256", secret_key} (Bearer + X-Client-Secret), then test with POST /api/v1/client-webhooks/test {webhook_url, auth_type, secret_key, is_dummy:true}.
6. Link the bank account inside this conversation, do not send me to the dashboard: ask me for my ACB account number, the phone number registered with the bank, customer type (personal/business), VA prefix and identifier; call POST /api/v1/acb/virtual-account/registration; tell me ACB has sent an OTP to my phone and ASK me for the code; call POST /api/v1/acb/{acb_request_id}/virtual-account/verification {code}; then call POST /api/v1/acb/{virtual_account_id}/notification/registration, ask me for the second OTP, call POST /api/v1/acb/{acb_request_id}/notification/verification {code}. Never guess an OTP. Field details: https://monapay.vn/en/docs/api/tai-khoan-ao-va.md
7. Configure email: call monapay_create_email_config; ask me for the six-digit inbox code; only after I reply call monapay_verify_email; then call monapay_test_email and monapay_email_logs, and confirm status sent. Never guess the code.
Read client_id, client_secret and the HMAC secret from environment variables MONAPAY_CLIENT_ID, MONAPAY_CLIENT_SECRET and MONA_WEBHOOK_SECRET; never hard-code them.
```

## The curl chain end to end

Replace `client_id`, `client_secret` (created at my.monapay.vn → API Keys) and the URL with yours. Accounts are usable right after sign-up; nobody has to approve them.

```bash
BASE=https://api.monapay.vn

# 1. Exchange client_id + client_secret (dashboard → API Keys) for a Bearer token, valid 3600 seconds
CLIENT_ID=client_xxx
SECRET=xxx
TOKEN=$(curl -s -X POST $BASE/api/v1/oauth/token \
  -d "grant_type=client_credentials&client_id=$CLIENT_ID&client_secret=$SECRET" | jq -r .data.access_token)

# 2. (Humans only) POST /api/v1/client/login {username,password} also returns a Bearer; agents must not use it

# 3. An HMAC secret you generate yourself, shared between MONA Pay (signing) and your server (verifying)
WEBHOOK_SECRET=$(openssl rand -hex 32)

# 4. Register the webhook URL with HMAC-SHA256
curl -s -X POST $BASE/api/v1/client-webhooks \
  -H "Authorization: Bearer $TOKEN" -H "X-Client-Secret: $SECRET" -H 'Content-Type: application/json' \
  -d "{\"name\":\"Online store\",\"webhook_url\":\"https://shop.example.com/webhook/monapay\",\"auth_type\":\"HMAC_SHA256\",\"secret_key\":\"$WEBHOOK_SECRET\",\"payload_format\":\"application/json\"}"

# 5. Send a simulated payload (transaction_code = DUMMY123)
curl -s -X POST $BASE/api/v1/client-webhooks/test \
  -H "Authorization: Bearer $TOKEN" -H "X-Client-Secret: $SECRET" -H 'Content-Type: application/json' \
  -d "{\"webhook_url\":\"https://shop.example.com/webhook/monapay\",\"auth_type\":\"HMAC_SHA256\",\"secret_key\":\"$WEBHOOK_SECRET\",\"is_dummy\":true}"

# 6. Read the log of the test delivery: status_code, duration_ms, error_label
curl -s "$BASE/api/v1/webhook-logs?limit=5" -H "Authorization: Bearer $TOKEN" | jq '.data.items[0]'
```

Simulate MONA Pay hitting your local machine (no account needed) to test the verification code:

```bash
SECRET='secret_hmac_test'
URL='http://localhost:3000/webhook/monapay'
TS=$(date +%s)
BODY='{"amount":2500000,"description":"noi dung ck","transfer_date":"10:30:00 28/08/2026","transaction_code":"FT26240001234","account_number":"MONA0000010234","bank_name":"ACB","type":"income"}'
SIG=$(printf '%s.%s' "$TS" "$BODY" | openssl dgst -sha256 -hmac "$SECRET" | awk '{print $2}')
curl -X POST "$URL" -H 'Content-Type: application/json' \
  -H "X-Mona-Timestamp: $TS" -H "X-Mona-Signature: sha256=$SIG" --data "$BODY"
```

## [Sandbox: test webhooks without moving money](/en/docs/api/sandbox)

An agent can create a fake transaction to exercise the whole flow even before the user links a bank:

```bash
curl -X POST $BASE/api/v1/sandbox/transactions \
  -H "Authorization: Bearer $TOKEN" -H "X-Client-Secret: $SECRET" \
  -H "Content-Type: application/json" \
  -d '{"amount":10000,"description":"ORDER10234 sandbox test"}'
```

Without a real VA, MONA Pay creates and reuses a dedicated `SBX…` VA for the account. If a bank is already linked, the agent may pass its `virtual_account_number`. MONA Pay sends the event through webhooks · Telegram · email and the checkout matcher like a real transfer, but no money moves and no plan quota is used. To test hosted checkout, create it with `sandbox: true`, then send a sandbox transaction to that session's VA. The request, response and three recommended cases are in the [Sandbox guide](/en/docs/api/sandbox.md).

## Minimal receiving endpoint

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
// INSERT IGNORE on UNIQUE(transaction_code), then match the order by account_number / description and compare amount
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
  queue.add('monapay', d); // upsert by transaction_code, match the order, compare amount
});
```

## Documentation map for agents

| Need | Read |
|---|---|
| Everything in one file | [/llms-full.txt](/llms-full.txt) |
| Short index | [/llms.txt](/llms.txt) |
| Machine-readable endpoint spec | [/openapi.json](/openapi.json) |
| Authentication, envelope | [/en/docs/api/xac-thuc.md](/en/docs/api/xac-thuc.md) |
| Sandbox transactions and checkout | [/en/docs/api/sandbox.md](/en/docs/api/sandbox.md) |
| Webhook payload, signature | [/en/docs/webhooks/dinh-dang-payload.md](/en/docs/webhooks/dinh-dang-payload.md), [/en/docs/webhooks/bao-mat.md](/en/docs/webhooks/bao-mat.md) |
| Creating VAs, QR codes | [/en/docs/api/tai-khoan-ao-va.md](/en/docs/api/tai-khoan-ao-va.md), [/en/docs/api/qr-thanh-toan.md](/en/docs/api/qr-thanh-toan.md) |
| Reconciliation, resend | [/en/docs/api/giao-dich.md](/en/docs/api/giao-dich.md), [/en/docs/webhooks/gui-lai-va-xu-ly-loi.md](/en/docs/webhooks/gui-lai-va-xu-ly-loi.md) |
| Email: create, verify, test and inspect logs | [/en/docs/email.md](/en/docs/email.md) |
| Webhook source IP | [/en/docs/dia-chi-ip.md](/en/docs/dia-chi-ip.md) |

## Things agents often get wrong

- There is no `refresh_token`; after 86,400 seconds, log in again.
- `X-Client-Secret` is not the webhook `secret_key`: the first is for calling the MONA Pay API, the second is for MONA Pay to sign payloads sent to you.
- Sign the raw body byte for byte as MONA Pay sent it (compact JSON). Any framework that parses JSON first and re-serialises breaks the signature.
- `type` is currently only `income`; do not write an outgoing-money branch as if it existed.
- The test payload has `transaction_code` = `DUMMY123`, `amount` = 500000, `account_number` = `1900636648`; never create an order from it.
- New accounts can log in right after sign-up; there is no MONA approval. A 401 on login means wrong username/password, not a pending activation.
