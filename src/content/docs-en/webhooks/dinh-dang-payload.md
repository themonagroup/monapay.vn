---
title: MONA Pay webhook payload format
description: "The 7 fields in the JSON MONA Pay sends when money arrives, the 3 Content-Type options, accompanying headers, the test payload and the compatible format in progress."
updated: 29/08/2026
---

Every MONA Pay webhook is a 7-field JSON payload: amount, reference, time, transaction code, receiving account number, bank name and transaction type. You can choose 1 of 3 encodings (JSON, form-urlencoded, multipart). MONA Pay is also rolling out an optional payload format compatible with popular Vietnamese gateways; see the last section.

## The `monapay` payload format (default)

```json
{
  "amount": 2500000,
  "description": "noi dung chuyen khoan",
  "transfer_date": "2026-08-28 10:30:00",
  "transaction_code": "FT26240001234",
  "account_number": "1234567890",
  "bank_name": "ACB",
  "type": "income"
}
```

| Field | Type | Meaning | Notes |
|---|---|---|---|
| `amount` | integer | Transaction amount in VND | No decimals. 2,500,000 VND is sent as `2500000` |
| `description` | string | The transfer note the customer typed, or the note embedded in the QR code | Used to match orders when not using VAs |
| `transfer_date` | string | Transaction time, format `YYYY-MM-DD HH:MM:SS`, Vietnam time | Taken from the ACB notification |
| `transaction_code` | string | The bank's transaction code | Identical across every resend. Use it as the deduplication key |
| `account_number` | string | The VA number or the receiving account number | Compare this field when matching by VA |
| `bank_name` | string | Bank name | Currently always `ACB` |
| `type` | string | Transaction type | Currently only `income` (money in) |

Three things worth knowing:

- **`transaction_code` is the unique key.** Resend 10 times and all 10 payloads carry the same `transaction_code`. Put a UNIQUE constraint on that column in your transactions table.
- **`account_number` tells you which VA received the money.** If each order has its own VA, comparing this field is enough to know which order was paid; you do not need to parse `description`.
- **Fields get added, never renamed.** When MONA Pay adds banks or transaction types, we add new values (a `bank_name` other than `ACB`, a `type` other than `income`) rather than renaming these 7 fields. Your code should ignore unknown fields instead of failing.

## The three Content-Types

Choose in the dashboard or through the `payload_format` field when creating a configuration:

| `payload_format` | What MONA Pay sends | Use when |
|---|---|---|
| `application/json` | The body is the JSON string above with no extra whitespace | Default. Every modern framework handles it |
| `application/x-www-form-urlencoded` | Body like `amount=2500000&description=...`, as an HTML form | Legacy systems that only read `$_POST` |
| `multipart/form-data` | Each field is one part of a multipart form | Systems that only accept multipart |

With HMAC, the signed string is the raw body exactly as sent: compact JSON for the JSON type, the urlencoded string for the form type. Details in [Webhook security](/en/docs/webhooks/bao-mat).

## Accompanying headers

| Header | Present when | Value |
|---|---|---|
| `Content-Type` | Always | Matches the chosen `payload_format` |
| `X-Mona-Timestamp` | Auth type `HMAC_SHA256` | Unix seconds at send time |
| `X-Mona-Signature` | Auth type `HMAC_SHA256` | `sha256=<hex>` |
| Custom header name (default `X-Webhook-Secret`) | Auth type `API_KEY` | The secret you set |

## Compatible format (in progress)

MONA Pay is adding an optional payload format compatible with popular Vietnamese gateways so switching providers does not require code changes; it will be announced on this page when it ships. Meanwhile the 7 fields above are enough for a 10-line adapter at the top of your handler: rename fields to match your existing structure, keep `transaction_code` as the deduplication key, then call your existing processing function.

## The test payload

When you click Send test in the dashboard or call `POST /api/v1/client-webhooks/test`, MONA Pay sends a payload with exactly these 7 fields and sample data. Your endpoint should tell test payloads from real transactions by checking that `transaction_code` exists in the transaction list (through the [reconciliation API](/en/docs/webhooks/doi-soat)) before changing important order states, or simply send tests to a staging environment only.

## Quick answers

**Can the amount ever be a decimal?** No. VND has no fractional unit; `amount` is always an integer.

**Timezone of `transfer_date`?** Vietnam time (UTC+7), exactly as reported by ACB.

**Are outgoing transactions sent?** Not yet. `type` is always `income`. When more types are added, field names stay the same.

**Can I receive webhooks with Google Apps Script or n8n?** Yes, as long as the URL accepts POST and answers 200 within 10 seconds. For the HMAC signature you need the raw body to recompute it; see [Webhook security](/en/docs/webhooks/bao-mat).
