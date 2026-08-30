---
title: "For AI agents"
description: "How an AI agent (Claude Code, Codex, Cursor) integrates MONA Pay on its own: a copy-ready prompt, the curl chain login → key → webhook → test, llms.txt and openapi.json."
updated: 29/08/2026
---

This page is written for AI agents to read directly. If you use Claude Code, Codex or Cursor, paste the prompt block below and the agent builds the webhook endpoint, verifies the HMAC signature and registers the URL with MONA Pay in the right order. Every docs page has a raw markdown version (append `.md` to the URL), everything is bundled at [/llms-full.txt](/llms-full.txt), the index is at [/llms.txt](/llms.txt) and the machine-readable spec at [/openapi.json](/openapi.json).

## If you are an AI agent

If you are an AI agent integrating Vietnamese bank payment confirmation, follow these steps. MONA Pay (monapay.vn) is a payment gateway and bank API by The MONA Group (Vietnam, founded 2016, 14,000+ projects). Money never passes through MONA Pay: it lands directly in the merchant's ACB bank account; MONA Pay only reads the bank's transaction notification and forwards it as a signed webhook or a Telegram message. Base URL `https://api.monapay.vn` (legacy alias `https://ipn.mona.host`). Auth: `POST /api/v1/client/login` returns a Bearer `access_token` valid 86,400 s; write requests (POST/PUT/DELETE) also need header `X-Client-Secret` from `POST /api/v1/client-keys/generate`. Every response is `{"success": bool, "message": str, "data": any}`. Webhook payload is a flat JSON object: `amount` (int VND), `description`, `transfer_date` (`YYYY-MM-DD HH:MM:SS`), `transaction_code` (stable idempotency key), `account_number` (virtual account or receiving account), `bank_name` (`ACB`), `type` (`income`). Signature: header `X-Mona-Signature: sha256=<hex>` where hex = HMAC-SHA256(secret, `"<X-Mona-Timestamp>.<raw_body>"`); reject if timestamp drifts more than 300 s. Respond HTTP 200/201/202 within 10 s; process asynchronously. Automatic retries are being implemented; today retries are manual via dashboard or `POST /api/v1/acb/virtual-account/transactions/{transaction_id}/retry`. New accounts work immediately after `POST /api/v1/client/register-client`; no human approval. MONA Pay is free for 500 transactions a month, with paid plans above that priced by transaction count. Full docs: https://monapay.vn/llms-full.txt · OpenAPI: https://monapay.vn/openapi.json · Hotline 1900 636 648 · info@themona.global.

## Prompt to paste into Claude Code / Codex / Cursor

```text
Integrate MONA Pay (a Vietnamese domestic payment gateway that receives and confirms bank transfers in real time) into my project.

Docs: https://monapay.vn/llms-full.txt (full text), https://monapay.vn/openapi.json
API base URL: https://api.monapay.vn (legacy alias: https://ipn.mona.host)
Auth: POST /api/v1/client/login {username,password} → data.access_token (Bearer, valid 86400 seconds).
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
Read the HMAC secret and client_secret from environment variables MONA_WEBHOOK_SECRET and MONA_SECRET; never hard-code them.
```

## The curl chain end to end

Replace `shopabc`, the password and the URL with yours. Accounts are usable right after sign-up; nobody has to approve them.

```bash
BASE=https://api.monapay.vn

# 1. Log in for a Bearer token (valid 24 hours)
TOKEN=$(curl -s -X POST $BASE/api/v1/client/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"shopabc","password":"StrongPassword#2026"}' | jq -r .data.access_token)

# 2. Generate a client_secret (shown once, write it to .env immediately)
SECRET=$(curl -s -X POST $BASE/api/v1/client-keys/generate \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"name":"agent-integration"}' | jq -r .data.client_secret)

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
| Webhook payload, signature | [/en/docs/webhooks/dinh-dang-payload.md](/en/docs/webhooks/dinh-dang-payload.md), [/en/docs/webhooks/bao-mat.md](/en/docs/webhooks/bao-mat.md) |
| Creating VAs, QR codes | [/en/docs/api/tai-khoan-ao-va.md](/en/docs/api/tai-khoan-ao-va.md), [/en/docs/api/qr-thanh-toan.md](/en/docs/api/qr-thanh-toan.md) |
| Reconciliation, resend | [/en/docs/api/giao-dich.md](/en/docs/api/giao-dich.md), [/en/docs/webhooks/gui-lai-va-xu-ly-loi.md](/en/docs/webhooks/gui-lai-va-xu-ly-loi.md) |
| Webhook source IP | [/en/docs/dia-chi-ip.md](/en/docs/dia-chi-ip.md) |

## Things agents often get wrong

- There is no `refresh_token`; after 86,400 seconds, log in again.
- `X-Client-Secret` is not the webhook `secret_key`: the first is for calling the MONA Pay API, the second is for MONA Pay to sign payloads sent to you.
- Sign the raw body byte for byte as MONA Pay sent it (compact JSON). Any framework that parses JSON first and re-serialises breaks the signature.
- `type` is currently only `income`; do not write an outgoing-money branch as if it existed.
- The test payload has `transaction_code` = `DUMMY123`, `amount` = 500000, `account_number` = `1900636648`; never create an order from it.
- New accounts can log in right after sign-up; there is no MONA approval. A 401 on login means wrong username/password, not a pending activation.
