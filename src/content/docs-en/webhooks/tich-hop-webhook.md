---
title: "Payment webhook integration: receive incoming ACB transfers in 5 minutes"
description: How to register a webhook URL, write the endpoint that receives incoming ACB transfers, the 200/201/202-within-10-seconds success rule, and deduplication by transaction_code.
updated: 29/08/2026
---

A MONA Pay webhook is an HTTP POST sent to your URL every time money arrives in a linked ACB account. To integrate, register the URL in the dashboard or through the API, write an endpoint that receives JSON, verify the signature, answer HTTP 200 within 10 seconds, then process the order. It is about 30 lines of code; the PHP and Node samples below are paste-ready.

## Life of a webhook

1. Money arrives in the ACB account (through a VA, a VietQR code or a plain transfer).
2. ACB notifies MONA Pay; MONA Pay stores the transaction on the dashboard.
3. MONA Pay finds matching webhook configurations: "all accounts" configurations always fire; a configuration bound to one VA fires only when the transaction belongs to that VA.
4. For each configuration, MONA Pay POSTs the payload to the URL, signed if HMAC is enabled, and waits at most 10 seconds.
5. Your server answers HTTP 200, 201 or 202: logged as success. Any other code, or more than 10 seconds: logged as failed with an error label; you can resend from the dashboard.

## Registering the webhook URL

### In the dashboard

Open Webhooks, click Add webhook and fill in:

| Field | Meaning |
|---|---|
| Name | Something memorable, e.g. "Online store", "Tuition software" |
| URL | The HTTPS address on your server that receives the webhook |
| Auth type | `HMAC_SHA256` (recommended), `API_KEY` or `NONE` |
| Secret | The secret used to sign (HMAC) or sent in a header (API key) |
| Payload format | `application/json` (default), `application/x-www-form-urlencoded`, `multipart/form-data` |
| Accounts | All accounts, or one specific VA |

### Through the API

```bash
curl -X POST https://api.monapay.vn/api/v1/client-webhooks \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Client-Secret: $CLIENT_SECRET" \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Online store",
    "webhook_url": "https://your-domain.com/webhook/monapay",
    "auth_type": "HMAC_SHA256",
    "secret_key": "your_hmac_secret",
    "payload_format": "application/json",
    "virtual_account_id": null
  }'
```

Related calls: `GET /api/v1/client-webhooks` lists configurations, `PUT /api/v1/client-webhooks/{config_id}` updates, `DELETE /api/v1/client-webhooks/{config_id}` removes, `POST /api/v1/client-webhooks/test` sends a sample payload. Parameters are documented in [Webhook configuration API](/en/docs/api/webhook-configs).

## The payload MONA Pay sends

```json
{
  "amount": 2500000,
  "description": "noi dung chuyen khoan",
  "transfer_date": "10:30:00 28/08/2026",
  "transaction_code": "FT26240001234",
  "account_number": "1234567890",
  "bank_name": "ACB",
  "type": "income"
}
```

`transaction_code` stays the same across every resend; use it as your deduplication key. `account_number` is the VA number or the receiving account number. Each field is explained in [Payload format](/en/docs/webhooks/dinh-dang-payload).

## Writing the receiving endpoint

A good endpoint does exactly 3 things in order: verify the signature, answer 200 immediately, process afterwards. Heavy work (updating orders, sending emails, calling other APIs) goes to a queue or runs after the response, so you never hit the 10-second limit.

```bash
# Simulate MONA Pay firing a webhook at your endpoint for a local test
SECRET='your_hmac_secret'   # the HMAC secret you set in the dashboard
URL='https://your-domain.com/webhook/monapay'
TS=$(date +%s)
BODY='{"amount":2500000,"description":"noi dung ck","transfer_date":"10:30:00 28/08/2026","transaction_code":"FT26240001234","account_number":"1234567890","bank_name":"ACB","type":"income"}'

# Signature = HMAC-SHA256(secret, "<timestamp>.<raw_body>"); printf avoids a trailing newline
SIG=$(printf '%s.%s' "$TS" "$BODY" | openssl dgst -sha256 -hmac "$SECRET" | awk '{print $2}')

curl -X POST "$URL" \
  -H 'Content-Type: application/json' \
  -H "X-Mona-Timestamp: $TS" \
  -H "X-Mona-Signature: sha256=$SIG" \
  --data "$BODY"
```

```php
<?php
// webhook-monapay.php: endpoint that receives incoming-payment events from MONA Pay
$secret = getenv('MONA_WEBHOOK_SECRET'); // the HMAC secret you set when enabling HMAC

$raw       = file_get_contents('php://input');
$timestamp = $_SERVER['HTTP_X_MONA_TIMESTAMP'] ?? '';
$signature = $_SERVER['HTTP_X_MONA_SIGNATURE'] ?? ''; // "sha256=<hex>"

// 1. Block replays: reject if the timestamp is more than 5 minutes off
if (abs(time() - (int) $timestamp) > 300) {
    http_response_code(400);
    exit('timestamp expired');
}

// 2. Verify the signature: HMAC-SHA256(secret, "<timestamp>.<raw_body>")
$expected = 'sha256=' . hash_hmac('sha256', $timestamp . '.' . $raw, $secret);
if (!hash_equals($expected, $signature)) { // hash_equals prevents timing attacks
    http_response_code(401);
    exit('bad signature');
}

// 3. Answer 200 right away, push heavy work to a queue/cron
http_response_code(200);
echo 'OK';
if (function_exists('fastcgi_finish_request')) fastcgi_finish_request();

$data = json_decode($raw, true);

// 4. Deduplicate: transaction_code is the unique key
$pdo = new PDO(getenv('DB_DSN'), getenv('DB_USER'), getenv('DB_PASS'));
$stmt = $pdo->prepare(
    'INSERT IGNORE INTO transactions (transaction_code, amount, description, transfer_date, account_number)
     VALUES (?, ?, ?, ?, ?)'
);
$stmt->execute([$data['transaction_code'], $data['amount'], $data['description'], $data['transfer_date'], $data['account_number']]);
if ($stmt->rowCount() === 0) exit; // already processed, this is a resend

// TODO: match the order by account_number (VA) or description, update the order status
```

```js
// webhook-monapay.js: receive MONA Pay webhooks with Express
const express = require('express');
const crypto  = require('crypto');

const app    = express();
const SECRET = process.env.MONA_WEBHOOK_SECRET; // the HMAC secret you set when enabling HMAC

// Read the raw body or the signature will not match (do not use express.json() on this route)
app.post('/webhook/monapay', express.raw({ type: 'application/json' }), async (req, res) => {
  const timestamp = req.header('X-Mona-Timestamp') || '';
  const signature = req.header('X-Mona-Signature') || ''; // "sha256=<hex>"
  const rawBody   = req.body.toString('utf8');

  // 1. Block replays: reject if the timestamp is more than 5 minutes off
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) {
    return res.status(400).send('timestamp expired');
  }

  // 2. Verify the signature: HMAC-SHA256(secret, "<timestamp>.<raw_body>")
  const expected = 'sha256=' + crypto
    .createHmac('sha256', SECRET)
    .update(timestamp + '.' + rawBody)
    .digest('hex');
  const valid =
    signature.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  if (!valid) return res.status(401).send('bad signature');

  // 3. Answer 200 right away, process the order asynchronously
  res.status(200).send('OK');

  const data = JSON.parse(rawBody);

  // 4. Deduplicate: transaction_code is the unique key (e.g. a table with UNIQUE(transaction_code))
  // const inserted = await db.insertIgnore('transactions', { transaction_code: data.transaction_code, ... });
  // if (!inserted) return; // resend, already processed

  // TODO: match the order by data.account_number (VA) or data.description, update the order status
});

app.listen(3000, () => console.log('MONA Pay webhook listening on port 3000'));
```

## Deduplicating transactions

The same transaction can reach your endpoint more than once: a manual resend from the dashboard, two webhook configurations pointing at the same URL, or your server erroring and the delivery being retried. The standard fix is a `transaction_code` column with a UNIQUE constraint in your transactions table, inserted with `INSERT IGNORE` (MySQL) or `ON CONFLICT DO NOTHING` (PostgreSQL). Anything that fails to insert was already processed; skip it. Do not rely on amount + time: two customers paying the same amount in the same minute is normal.

## Pre-production checklist

- The endpoint runs over HTTPS with a valid certificate. Self-signed or expired certificates produce the `SSL` error label.
- The firewall allows IP `103.168.55.14` (see [IP addresses](/en/docs/dia-chi-ip)).
- No redirect on the webhook URL (for example `http` to `https`, or adding a trailing `/`). Redirects produce the `HTTP_3XX` label and count as failed.
- Click Send test in the dashboard; Delivery history should show 200 with a response time under 1 second.
- Transfer a small amount into a VA to run the real flow.

## Common problems

**The webhook arrives but the signature does not match.** The framework (Laravel, Express, Next.js) parsed the JSON and used the re-serialised body for signing. Use the untouched raw body. Per-framework instructions are in [Webhook security](/en/docs/webhooks/bao-mat).

**TIMEOUT label although the endpoint works.** The endpoint finishes processing the order before answering and exceeds 10 seconds under load. Answer 200 first, process afterwards.

**HTTP_4XX with 404 or 405.** Wrong path, or the route only accepts GET. Webhooks are always POST.

**The same transaction arrives twice.** Normal. Deduplicate with `transaction_code` as described above.

**Nothing arrives although the money is in.** The webhook configuration is bound to one VA but the customer paid into the main account or another VA. Add an "all accounts" configuration so nothing is missed, or check Delivery history in the dashboard to see whether MONA Pay sent anything.
