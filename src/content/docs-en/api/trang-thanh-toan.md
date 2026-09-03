---
title: "Hosted checkout: create a link and get paid"
description: "Create a MONA Pay hosted checkout, send or redirect to the link, receive CHECKOUT_PAID and verify the signed return redirect."
updated: 03/09/2026
---

To collect a payment, call `POST /api/v1/checkouts`, take the returned `checkout_url`, then send it to the payer or redirect their browser to it. The payer scans VietQR and the money goes directly to your bank account. MONA Pay confirms the transfer, sends a `CHECKOUT_PAID` webhook and returns the payer to your `return_url`.

> The webhook or `GET /checkouts/{id}` is the source of truth before fulfilment. The return redirect is only a user-experience signal.

## The five-step integration flow

1. **Set up the payment profile once.** Call `PUT /payment-profile` with the shop identity, default bank account or VA and the QR fields. The API returns `return_signature_secret` only once, when the profile is created or the secret is rotated.
2. **Create a checkout for each order.** Call `POST /checkouts` with the amount, order code and `return_url`. Send `X-Client-Secret` and `Idempotency-Key` so a retry cannot create a duplicate.
3. **Open the hosted payment page.** Redirect the browser or send `checkout_url` over Zalo, Facebook or email. The link is `https://pay.monapay.vn/c/<token>` and needs no login.
4. **Confirm only after `CHECKOUT_PAID`.** Verify the webhook HMAC against the raw body, deduplicate by `transaction_code`, and compare the order code and amount. You can call `GET /checkouts/{id}` for server-side reconciliation.
5. **Verify the return redirect.** Check `sig` with `return_signature_secret`, validate `ts`, then call `GET /checkouts/{id}` again. Never fulfil from the `status=paid` query string alone.

A checkout expires after 900 seconds by default. MONA Pay marks it `paid` only when the matched total is at least the checkout amount. An underpayment is recorded as `partial_amount` while the checkout remains `pending`.

## Endpoints

Base API: `https://api.monapay.vn/api/v1`.

### Payment profile

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| `GET` | `/payment-profile` | Bearer | Read the profile and default receiving account |
| `PUT` | `/payment-profile` | Bearer + `X-Client-Secret` | Create or update the profile; the return secret is shown once |
| `POST` | `/payment-profile/reveal-return-secret` | Bearer + `X-Client-Secret` | Reveal `return_signature_secret` after password or 2FA confirmation |
| `POST` | `/payment-profile/rotate-return-secret` | Bearer + `X-Client-Secret` | Rotate `return_signature_secret` |

If the profile is missing, checkout creation returns HTTP 422 with `detail: "payment_profile_missing"`. Set it under **Settings → Hosted checkout** or call `monapay_set_payment_profile` through MCP.

### Lost `return_signature_secret`?

Call `POST /api/v1/payment-profile/reveal-return-secret` with `password` or `totp_code` to confirm the account owner and reveal it again. If confirmation is unavailable or the secret may be compromised, call `/payment-profile/rotate-return-secret`; store the new value immediately and update the environment before verifying the next redirect.

### Merchant checkout endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/checkouts` | Create a checkout with `Idempotency-Key`, returns HTTP 201 |
| `GET` | `/checkouts?status&order_code&from_date&to_date&page&limit` | Filter and paginate checkouts |
| `GET` | `/checkouts/{id}` | Get one checkout by ID |
| `POST` | `/checkouts/{id}/cancel` | Cancel a `pending` checkout |
| `POST` | `/checkouts/{id}/expire-now` | Expire immediately, for admin or testing only |

`amount` is an integer from 1,000 to 1,000,000,000 VND. `order_code` is 1 to 50 characters using letters, numbers, `_` or `-`, and must be unique among pending checkouts. `return_url` and `cancel_url` must use HTTPS. `expires_in` accepts 60 to 86,400 seconds and defaults to 900. `metadata` is limited to 2 KB.

To test before linking a bank or without moving real money, add `sandbox: true`; see [Sandbox](/en/docs/api/sandbox) for exact-payment, underpayment and redelivery cases.

### Public hosted-page endpoints

These endpoints need no auth. They accept only the random 32-character token and never expose the client ID, internal checkout ID or payer email.

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/checkouts/public/{token}` | Data displayed by the hosted page |
| `GET` | `/checkouts/public/{token}/status` | Poll `status`, `paid_at`, `expires_at`, `seconds_left` |
| `GET` | `/checkouts/public/{token}/qr.png?size=512` | QR as PNG, cached for five minutes |
| `POST` | `/checkouts/public/{token}/cancel` | Cancel a pending checkout and return to `cancel_url` |
| `GET` | `/qr/{qr_id}/image.png?size=512` | PNG image for any generated QR |

Public responses use `Cache-Control: no-store`, except QR images, and are limited to 60 requests per minute per IP.

## cURL: create a checkout

This example assumes `$TOKEN` contains a Bearer token and `$MONAPAY_CLIENT_SECRET` contains the API client secret:

```bash
curl -s -X POST https://api.monapay.vn/api/v1/checkouts \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Client-Secret: $MONAPAY_CLIENT_SECRET" \
  -H "Idempotency-Key: checkout-ORDER10234" \
  -H 'Content-Type: application/json' \
  -d '{"amount":250000,"order_code":"ORDER10234","description":"Payment for ORDER10234","return_url":"https://shop.example/payment/return","cancel_url":"https://shop.example/checkout","payer_email":"payer@example.com","expires_in":900}' \
  | jq '.data | {id, checkout_url, status, expires_at}'
```

## Node.js: create, handle `CHECKOUT_PAID`, verify the redirect

```js
import { createHmac, timingSafeEqual } from 'node:crypto';
import { MonaPay, verifyWebhook } from '@monapay/node';

const mona = MonaPay.fromEnv();
const checkout = await mona.checkouts.create({
  amount: 250000,
  order_code: 'ORDER10234',
  description: 'Payment for ORDER10234',
  return_url: 'https://shop.example/payment/return',
  cancel_url: 'https://shop.example/checkout',
});
console.log(checkout.checkout_url);

const verified = verifyWebhook({ rawBody, headers, secret: process.env.MONA_WEBHOOK_SECRET });
if (!verified.ok) throw new Error(verified.reason);
const event = verified.payload.event || verified.payload.event_type;
if (event === 'CHECKOUT_PAID') {
  await saveOnce(verified.payload.transaction_code, verified.payload);
  const current = await mona.checkouts.get(verified.payload.id);
  if (current.status === 'paid') await markOrderPaid(current.order_code);
}

const message = `${query.monapay_checkout}|${query.order_code}|paid|${query.ts}`;
const expected = createHmac('sha256', process.env.MONAPAY_RETURN_SECRET).update(message).digest('hex');
const supplied = String(query.sig || '');
const validSig = supplied.length === expected.length && timingSafeEqual(Buffer.from(supplied), Buffer.from(expected));
if (!validSig || Math.abs(Date.now() / 1000 - Number(query.ts)) > 300) throw new Error('Invalid redirect');
const current = await mona.checkouts.get(query.monapay_checkout);
if (current.status !== 'paid') throw new Error('Checkout is not paid');
```

`MONA_WEBHOOK_SECRET` belongs to the webhook configuration. `MONAPAY_RETURN_SECRET` is the payment profile's `return_signature_secret`. They are separate secrets.

## Python: create, handle `CHECKOUT_PAID`, verify the redirect

```python
import hashlib
import hmac
import os
import time
from monapay import MonaPay, verify_webhook

mona = MonaPay.from_env()
checkout = mona.checkouts.create({
    "amount": 250000,
    "order_code": "ORDER10234",
    "description": "Payment for ORDER10234",
    "return_url": "https://shop.example/payment/return",
    "cancel_url": "https://shop.example/checkout",
})
print(checkout["checkout_url"])

verified = verify_webhook(raw_body, headers, os.environ["MONA_WEBHOOK_SECRET"])
if not verified.ok:
    raise ValueError(verified.reason)
event = verified.payload.get("event") or verified.payload.get("event_type")
if event == "CHECKOUT_PAID":
    save_once(verified.payload["transaction_code"], verified.payload)
    current = mona.checkouts.get(verified.payload["id"])
    if current["status"] == "paid":
        mark_order_paid(current["order_code"])

message = "{}|{}|paid|{}".format(query["monapay_checkout"], query["order_code"], query["ts"])
expected = hmac.new(os.environ["MONAPAY_RETURN_SECRET"].encode(), message.encode(), hashlib.sha256).hexdigest()
if not hmac.compare_digest(expected, query.get("sig", "")) or abs(time.time() - int(query["ts"])) > 300:
    raise ValueError("Invalid redirect")
current = mona.checkouts.get(query["monapay_checkout"])
if current["status"] != "paid":
    raise ValueError("Checkout is not paid")
```

## `CHECKOUT_PAID` payload

The event uses the existing `X-Mona-Signature` and `X-Mona-Timestamp` webhook signature. Its payload contains a compact checkout, including `order_code`, `amount`, `paid_amount`, `paid_at` and `transaction_code`. Store `transaction_code` with a unique constraint so webhook retries cannot fulfil twice.

## Return redirect

After the checkout becomes `paid`, the hosted page waits about three seconds and appends these fields to `return_url`:

```text
?monapay_checkout=<id>&order_code=<order_code>&status=paid&ts=<unix>&sig=<hex>
```

The signature is an HMAC-SHA256 hex digest over `<id>|<order_code>|paid|<ts>`. A cancellation returns to `cancel_url?monapay_checkout=<id>&status=cancelled` without a signature.

## FAQ

### Does money pass through MONA Pay?

No. Money moves directly from the payer's bank account to your bank account. MONA Pay creates the QR, receives the bank notification and confirms the transfer; it never holds the money.

### What happens when a checkout expires?

It expires after 15 minutes by default and no replacement QR is created. If the payer transfers later, MONA Pay still records the transaction and marks the checkout `paid` with `paid_late=true`; the merchant decides whether to accept or refund it.

### What if the payer underpays?

The checkout remains `pending`. MONA Pay records `partial_amount` and raises a warning. It becomes `paid` only when the matched total is at least `amount`.

### Can I create a payment link without a website?

Yes. Create it in the dashboard or with `monapay_create_checkout`, then send `checkout_url` over Zalo, Facebook or email. The payer opens the link and scans the QR without a MONA Pay account.
