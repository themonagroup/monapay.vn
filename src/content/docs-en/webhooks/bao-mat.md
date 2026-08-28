---
title: "Webhook security: HMAC-SHA256 signatures and replay protection"
description: The 3 MONA Pay webhook auth types (HMAC_SHA256, API_KEY, NONE), how to compute and verify X-Mona-Signature, the 5-minute replay window, with cURL, PHP and Node samples.
updated: 29/08/2026
---

MONA Pay webhooks support 3 auth types: `HMAC_SHA256` (each payload signed with a shared secret, recommended), `API_KEY` (the secret sent in a header) and `NONE` (no authentication). With HMAC, every payload carries `X-Mona-Timestamp` and `X-Mona-Signature`; you recompute the signature from the raw body, accept on match, and reject payloads whose timestamp is more than 5 minutes off.

## Why authenticate

A webhook URL is public. Anyone who guesses it can send a fake JSON payload saying "50,000,000 VND arrived". If the endpoint trusts it blindly, an order gets marked paid without a single dong. Authentication makes the endpoint trust only payloads MONA Pay sent. Of the 3 types, HMAC is the strongest because the secret never travels over the wire, only a signature derived from it.

## Type 1: `HMAC_SHA256` (recommended)

### How MONA Pay signs

1. `timestamp` = unix seconds at send time.
2. `raw_body` = the body string exactly as it will be sent: compact JSON (type `application/json`) or the urlencoded string (form type).
3. `signature = HMAC-SHA256(secret, timestamp + "." + raw_body)`, output as lowercase hex.
4. Send 2 headers:

```text
X-Mona-Timestamp: 1756355400
X-Mona-Signature: sha256=3f2a9c...e71b
```

The secret is the string you set when creating the webhook configuration (the Secret field in the dashboard or `secret_key` via the API). Use at least 32 random characters and a different secret per configuration.

### How you verify

1. Read the untouched raw body (before parsing).
2. Check `|now - timestamp| <= 300` seconds. More than 5 minutes off: answer 400 and drop it. This is replay protection: an attacker who captures a valid payload cannot reuse it after 5 minutes.
3. Recompute `sha256=` + HMAC-SHA256(secret, `timestamp + "." + raw_body`).
4. Compare with `X-Mona-Signature` using a constant-time function (`hash_equals`, `crypto.timingSafeEqual`). Match: process. Otherwise answer 401.

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
// $data['amount'], $data['description'], $data['transaction_code'], ...
// TODO: record the transaction and update your order here
```

```js
// webhook-monapay.js: receive MONA Pay webhooks with Express
const express = require('express');
const crypto  = require('crypto');

const app    = express();
const SECRET = process.env.MONA_WEBHOOK_SECRET; // the HMAC secret you set when enabling HMAC

// Read the raw body or the signature will not match (do not use express.json() on this route)
app.post('/webhook/monapay', express.raw({ type: 'application/json' }), (req, res) => {
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
  // data.amount, data.description, data.transaction_code, ...
  // TODO: record the transaction and update your order here
});

app.listen(3000, () => console.log('MONA Pay webhook listening on port 3000'));
```

### Getting the raw body in each framework

The signature is computed over every byte of the body. Any framework that parses JSON and re-encodes it breaks verification, because key order, whitespace or unicode escaping may differ. How to get the raw body:

| Framework | Raw body |
|---|---|
| Plain PHP, WordPress | `file_get_contents('php://input')` |
| Laravel | `$request->getContent()` |
| Express | `express.raw({ type: 'application/json' })` on the webhook route, then `req.body.toString('utf8')` |
| Next.js (App Router) | `await request.text()` instead of `request.json()` |
| Django | `request.body` (bytes) |
| FastAPI | `await request.body()` |
| Google Apps Script | `e.postData.contents` |

In WordPress, register the route with `register_rest_route` using `methods => 'POST'` and read `$request->get_body()`.

## Type 2: `API_KEY`

MONA Pay sends the secret verbatim in one header. You choose the header name when creating the configuration (`api_key_name`), default `X-Webhook-Secret`. The endpoint compares the header with the stored secret and accepts on match.

```php
<?php
$secret = getenv('MONA_WEBHOOK_SECRET');
$header = $_SERVER['HTTP_X_WEBHOOK_SECRET'] ?? '';
if (!hash_equals($secret, $header)) {
    http_response_code(401);
    exit('bad key');
}
http_response_code(200);
echo 'OK';
```

Simpler than HMAC, but the secret travels over the wire on every delivery and there is no replay protection. Use it only when your system cannot compute HMAC (some no-code platforms can only compare headers).

## Type 3: `NONE`

No authentication header at all. Only for internal testing. If you must use it in production, at least filter by IP: accept requests only from `103.168.55.14` (see [IP addresses](/en/docs/dia-chi-ip)) and re-verify the transaction through the [reconciliation API](/en/docs/webhooks/doi-soat) before shipping.

## Security checklist

- The endpoint runs over HTTPS. MONA Pay can deliver to plain HTTP, but the payload then crosses the network in the clear.
- Enable `HMAC_SHA256`, use a secret of at least 32 random characters stored in an environment variable, never hard-coded.
- Reject timestamps more than 5 minutes off. Keep server time in sync with NTP; clock drift is the most common reason valid payloads get rejected.
- Compare signatures with a constant-time function.
- Deduplicate with a UNIQUE `transaction_code`.
- For high-value transactions, re-verify through the reconciliation API before shipping even when the signature matches.
- Rotate the secret periodically or immediately on suspicion of a leak: create a new webhook configuration with the new secret, switch your code, then delete the old one.

## Common problems

**The signature is always wrong although the secret is right.** The framework parsed and re-encoded the body, or some middleware added whitespace. Get the raw body as in the table above.

**The signature matches with cURL but fails on real deliveries.** During your test you signed JSON with whitespace, while MONA Pay sends compact JSON. Do not rebuild the JSON; sign exactly the string you received.

**Valid payloads rejected with "timestamp expired".** Your server clock is more than 5 minutes off. Enable NTP synchronisation.

**Using `API_KEY` but the header never arrives.** Some servers (Apache with PHP-FPM) drop headers containing underscores or rename them. Use only letters and hyphens in the header name, e.g. `X-Webhook-Secret`, and inspect with `getallheaders()`.
