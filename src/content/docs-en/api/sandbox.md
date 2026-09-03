---
title: "MONA Pay sandbox: test transactions and checkout without moving money"
description: "Create fake incoming transactions and test webhooks, Telegram, email and hosted checkout before linking a bank; the SBX virtual account uses no real money and no plan quota."
updated: 03/09/2026
---

The sandbox exercises the complete payment-confirmation flow without a real bank transfer. Call `POST /api/v1/sandbox/transactions`; MONA Pay records a fake incoming transaction and sends it through webhooks, Telegram, email and the hosted-checkout matcher just like a real one.

> You can test before linking a bank. MONA Pay creates a dedicated sandbox VA for your account, with a number beginning `SBX…`. If you already have a real VA, you can pass that number instead; the transaction still has `is_sandbox: true` and never moves bank funds.

## POST /api/v1/sandbox/transactions

The request needs a Bearer token and `X-Client-Secret`:

```bash
curl -X POST https://api.monapay.vn/api/v1/sandbox/transactions \
  -H "Authorization: Bearer $MONA_TOKEN" \
  -H "X-Client-Secret: $MONA_SECRET" \
  -H 'Content-Type: application/json' \
  -d '{"amount":250000,"description":"Payment for ORDER10234"}'
```

When no account number is passed, MONA Pay creates or reuses your `SBX…` sandbox VA. To test against a linked real VA, add `virtual_account_number`:

```json
{
  "virtual_account_number": "LOCHOA000123456",
  "amount": 250000,
  "description": "Payment for ORDER10234",
  "transaction_code": "SANDBOX-ORDER10234-01"
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `virtual_account_number` | string, up to 50 characters | no | A real VA or an `SBX…` VA; omit it to let MONA Pay provide a sandbox VA |
| `account_number` | string, up to 50 characters | no | A linked real account; only one account reference is needed when you want to select a receiver |
| `amount` | integer | yes | Fake amount, greater than 0 and no more than 1,000,000,000 VND |
| `description` | string, 1–255 characters | yes | Fake transfer note; include an order code to test matching |
| `transaction_code` | string, 1–100 characters | no | Set one to test deduplication; otherwise MONA Pay generates a `SANDBOX-…` code |

Response 200:

```json
{
  "success": true,
  "message": "Sandbox transaction accepted",
  "data": {
    "transaction_code": "SANDBOX-ORDER10234-01",
    "virtual_account_number": "SBX000123456",
    "account_number": "SBX000123456",
    "amount": 250000,
    "is_sandbox": true
  }
}
```

The event goes through the same processing and notification channels as a real transfer. Use `transaction_code` as the deduplication key and `is_sandbox` to identify test data during reconciliation.

## Test hosted checkout

Add `"sandbox": true` when creating a checkout. The test session uses an `SBX…` VA and returns a `checkout_url`, displayable QR data and `sandbox: true`; the hosted page shows a **TEST SESSION — do not transfer real money** banner.

```bash
curl -X POST https://api.monapay.vn/api/v1/checkouts \
  -H "Authorization: Bearer $MONA_TOKEN" \
  -H "X-Client-Secret: $MONA_SECRET" \
  -H "Idempotency-Key: sandbox-ORDER10234" \
  -H 'Content-Type: application/json' \
  -d '{"amount":250000,"order_code":"ORDER10234","return_url":"https://shop.example/payment/return","sandbox":true}'
```

Take `data.bank.account_number`, or the VA number in the checkout response, and pass it as `virtual_account_number` to `/sandbox/transactions`. Once the sandbox total reaches `amount`, the checkout becomes `paid` and emits `CHECKOUT_PAID`. See [Hosted checkout](/en/docs/api/trang-thanh-toan) for the remaining fields.

## Three tests to run before going live

1. **Exact amount:** create a 250,000 VND checkout and send one 250,000 VND sandbox transaction. Wait for `CHECKOUT_PAID`, verify the signature, confirm `paid`, and ensure fulfilment runs once.
2. **Underpayment:** create a 250,000 VND checkout and send 200,000 VND. It must stay `pending` with `partial_amount`; do not fulfil it.
3. **Redelivery:** repeat the same `transaction_code` or retry the webhook. Your system must ignore the duplicate through a UNIQUE constraint on `transaction_code`.

## Sandbox limits

- No real money is sent or received; never scan a sandbox QR to make a transfer.
- Sandbox transactions do not count against the plan transaction quota.
- `SBX…` VAs, QR codes and sandbox checkouts are test-only and must not be given to real payers.
- The sandbox tests MONA Pay and your integration; it does not replace a final small real transfer after the bank is linked.

See [Webhook payload format](/en/docs/webhooks/dinh-dang-payload), [Webhook security](/en/docs/webhooks/bao-mat) and [Transaction reconciliation](/en/docs/api/giao-dich).
