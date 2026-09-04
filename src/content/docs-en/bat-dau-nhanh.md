---
title: Quick start with MONA Pay in 5 minutes
description: From sign-up to your first webhook. 6 steps with cURL, PHP and Node samples you can paste and run.
updated: 04/09/2026
---

To receive real-time notifications for money arriving in an ACB account you need 6 steps: sign up (usable immediately, no approval), log in for a token, create an API key, link your ACB account with an OTP, register a webhook URL, then send a small transfer to check. If you already have an ACB account and a server that can receive webhooks, the hands-on part takes about 5 minutes.

<figure class="photo">
  <picture>
    <source srcset="/img/dashboard/overview.avif" type="image/avif" />
    <source srcset="/img/dashboard/overview.webp" type="image/webp" />
    <img src="/img/dashboard/overview.png" width="1280" height="860" loading="lazy" decoding="async" alt="MONA Pay dashboard overview with API keys, account activation and virtual account setup" />
  </picture>
  <figcaption>The Overview screen gathers the tasks required before the first transaction arrives, captured from the my.monapay.vn dashboard.</figcaption>
</figure>

## Before you start

- An ACB bank account in your name or your company's name, plus the phone number registered with ACB (to receive the OTP).
- An HTTPS URL on your server to receive webhooks, for example `https://your-domain.com/webhook/monapay`. No server yet? Telegram notifications still work, see [Telegram](/en/docs/telegram).
- A way to call the API: cURL, Postman, or let an AI agent do it with the [ready-made prompt](/en/docs/ai-agent).

<figure class="photo">
  <picture>
    <source srcset="/img/dashboard/integrations.avif" type="image/avif" />
    <source srcset="/img/dashboard/integrations.webp" type="image/webp" />
    <img src="/img/dashboard/integrations.png" width="1280" height="860" loading="lazy" decoding="async" alt="MONA Pay dashboard integration guide for WooCommerce, Shopify, webhooks and AI agents" />
  </picture>
  <figcaption>The Integration guide routes each platform, custom website or AI agent into the right setup flow, captured from the my.monapay.vn dashboard.</figcaption>
</figure>

## Using WooCommerce: install the plugin

Download the [latest MONA Pay for WooCommerce plugin](https://github.com/themonagroup/woocommerce-monapay/releases/latest), upload the zip under **Plugins → Add New Plugin → Upload Plugin**, then open **WooCommerce → Settings → Payments → MONA Pay VietQR** and enter the Client ID and Client Secret.

The bank connection can wait while testing. Turn on **Test mode (sandbox)** in the plugin settings, save, then place an order and select MONA Pay at checkout to run the complete test flow.

<div class="doc-shot-pair">
  <figure class="doc-phone-shot">
    <picture>
      <source srcset="/img/woo/woo-settings.avif" type="image/avif" />
      <source srcset="/img/woo/woo-settings.webp" type="image/webp" />
      <img src="/img/woo/woo-settings.png" width="1265" height="2616" loading="lazy" decoding="async" alt="Ảnh cài đặt plugin WooCommerce MONA Pay với Client ID, Client Secret và chế độ thử sandbox" />
    </picture>
    <figcaption>The key fields and sandbox setting; captured on a WooCommerce 11.1 demo store in test mode.</figcaption>
  </figure>
  <figure class="doc-phone-shot">
    <picture>
      <source srcset="/img/woo/woo-checkout.avif" type="image/avif" />
      <source srcset="/img/woo/woo-checkout.webp" type="image/webp" />
      <img src="/img/woo/woo-checkout.png" width="1265" height="1978" loading="lazy" decoding="async" alt="Ảnh plugin WooCommerce MONA Pay được chọn tại trang checkout của đơn hàng 900.000 đồng" />
    </picture>
    <figcaption>MONA Pay selected at checkout; captured on a WooCommerce 11.1 demo store in test mode.</figcaption>
  </figure>
</div>

## Using OpenCart: install the module

Download the [MONA Pay module for OpenCart](https://github.com/themonagroup/monapay-connectors/tree/main/modules/opencart-monapay), upload it under **Extensions → Installer**, then open **Extensions → Extensions → Payments → MONA Pay**. Enter the Client ID and Client Secret from my.monapay.vn → API Keys and turn on **Sandbox** for a test order. Once checkout, the payment page, the success page and the admin order all match, turn Sandbox off before taking real payments. See the [five-step flow captured on OpenCart 4.1](/cong-thanh-toan-opencart) (Vietnamese page).

## Using PrestaShop: install the module

Download the [MONA Pay module for PrestaShop](https://github.com/themonagroup/monapay-connectors/tree/main/modules/prestashop-monapay), open **Modules → Module Manager → Upload a module**, then select **Configure** and enter the Client ID, Client Secret and signature secrets. Turn on **Sandbox mode** for a test order and turn it off before taking real payments. The module only appears when the cart uses VND. See the [four-step flow captured on PrestaShop 8.2](/cong-thanh-toan-prestashop) (Vietnamese page).

## Step 1. Sign up

Go to `https://my.monapay.vn/auth`, open the Sign up tab and fill in a username, password, name and email. You can also call the API:

```bash
curl -X POST https://api.monapay.vn/api/v1/client/register-client \
  -H 'Content-Type: application/json' \
  -d '{"username":"my-shop","password":"a-strong-password","name":"My Shop"}'
```

The account is usable immediately: log in at step 2, nobody has to approve it. MONA Pay is free for 500 transactions a month, with paid plans above that priced by transaction count (see [pricing](/bang-gia)).

## Step 2. Log in for a token

If an AI agent or a server does this for you, skip password login: create an API key on the dashboard and exchange `client_id` + `client_secret` for a token via `POST /api/v1/oauth/token`, see [Authentication](/en/docs/api/xac-thuc).

```bash
curl -X POST https://api.monapay.vn/api/v1/client/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"my-shop","password":"a-strong-password"}'
```

Every API returns the same envelope:

```json
{
  "success": true,
  "message": "Login successful",
  "data": { "access_token": "eyJhbGciOi...", "expires_in": 86400 }
}
```

From here every call carries `Authorization: Bearer <access_token>`. Details in [Authentication](/en/docs/api/xac-thuc).

## Step 3. Create an API key

With the password-login Bearer token from step 2, POST, PUT, PATCH and DELETE requests must include `X-Client-Secret`. A token from `oauth/token` does not require the header again, but the official SDKs and MCP server still send it and MONA Pay recommends always sending it. Create a key in the dashboard under API Keys, or:

```bash
curl -X POST https://api.monapay.vn/api/v1/client-keys/generate \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"name":"production-server"}'
```

`client_secret` is shown exactly once in the response. Store it in an environment variable right away; if you lose it, create a new key and revoke the old one. See [API keys](/en/docs/api/api-keys).

## Step 4. Link your ACB account (4 steps, with OTP)

In the dashboard, open Banks & VA and click Add account:

1. Enter the ACB account number, the phone number registered with ACB, the customer type (personal or business), and choose a short VA prefix made of uppercase letters or digits, such as `HOA` or `SHOP`. No branch visit or prefix pre-registration is needed; if MONA Pay rejects it, choose another prefix.
2. ACB sends an OTP to the phone. Enter it to verify and create your first virtual account (VA).
3. Register for transaction notifications. ACB sends a second OTP; enter it too.
4. Done. From now on, money arriving in the VA or the account reaches MONA Pay as a notification.

To do this through the API instead of the dashboard, see [Virtual accounts (VA)](/en/docs/api/tai-khoan-ao-va); the flow is the same 4 calls.

ACB prepends its partner code to your chosen prefix. For example, `HOA` may produce a complete VA number such as `LOCHOA000123456`; use the complete value MONA Pay returns rather than building it yourself.

## Step 5. Register your webhook URL

In the dashboard open Webhooks, click Add webhook, enter the URL, pick HMAC_SHA256 as the auth type and set a secret. Or call the API:

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
    "payload_format": "application/json"
  }'
```

Without `virtual_account_id` the webhook receives every transaction on every account. Pass the id of one VA to receive only that VA's transactions.

### Running webhooks from localhost
Webhooks need a public HTTPS URL; MONA Pay cannot call `localhost` directly.
```bash
cloudflared tunnel --url http://localhost:4400
```
Paste the HTTPS URL issued by the tunnel into `webhook_url`; ngrok works too.
If no public URL is available yet, poll `GET /api/v1/checkouts/{checkout_id}` every few seconds while testing.
The [IP addresses](/en/docs/dia-chi-ip) page applies when the system goes to production.

On your side the endpoint does 3 things: verify the signature, answer HTTP 200 immediately, then process the order. Paste-ready samples:

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

## Step 6. Send a test, then a real transfer

First click Send test in the dashboard (Webhooks) or call `POST /api/v1/client-webhooks/test`. MONA Pay fires a sample payload at your URL; the result shows up immediately in Delivery history with the HTTP code and response time.

To test locally without waiting for MONA Pay, replay exactly what MONA Pay sends with cURL:

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

Finally transfer a small amount, say 10,000 VND, into the VA you just created from any banking app. Within seconds the transaction appears on the dashboard and the webhook reaches your server.

## After it works

- Read [Payload format](/en/docs/webhooks/dinh-dang-payload) to learn every field and use `transaction_code` as your deduplication key.
- Read [Retries and error handling](/en/docs/webhooks/gui-lai-va-xu-ly-loi) to understand logs, error labels and resending.
- Whitelist IP `103.168.55.14` if your server blocks unknown connections, see [IP addresses](/en/docs/dia-chi-ip).
- Want a QR code with the amount pre-filled for each order: [QR payments](/en/docs/api/qr-thanh-toan).

## Common problems

**Login says wrong credentials although the password is right.** Check the username (case-sensitive) and the password. New accounts can log in immediately; there is no activation queue. Still stuck: call 1900 636 648.

**POST is rejected even with a valid Bearer token.** If the token came from `client/login`, the request is missing `X-Client-Secret`; every POST, PUT, PATCH and DELETE write must carry it. A token from `oauth/token` does not require the header, but MONA Pay still recommends sending it.

**Test delivery shows TIMEOUT.** Your server did not answer within 10 seconds. Return HTTP 200 first and process the order afterwards, as in the samples above.

**Signature mismatch.** Usually the framework parsed the JSON and re-serialised it before signing. Sign the raw body exactly as MONA Pay sent it, byte for byte; see [Webhook security](/en/docs/webhooks/bao-mat).

**Transferred money but no transaction shows up.** Check that step 4 completed both OTPs. Without the second OTP (notification registration) ACB does not push transactions to MONA Pay.
