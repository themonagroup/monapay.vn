---
title: "Transactions API: look up incoming money by virtual account"
description: "Query transactions by VA number (paginated, up to 100 per page), the record structure, reconciliation by transaction_code, and the endpoint that resends notifications for one transaction."
updated: 29/08/2026
---

Every transaction ACB reports is stored by MONA Pay, even when the webhook to your server failed. Query with `GET /api/v1/acb/virtual-account/transactions?virtual_account_number=<VA number>&page=1&limit=100` (Bearer token, `limit` up to 100). Each record has `transaction_code`, the bank's stable reference, which you use as the deduplication key during reconciliation. For a transaction that never reached your server, call the retry endpoint and MONA Pay resends the webhook or Telegram message for exactly that transaction.

## GET /api/v1/acb/virtual-account/transactions

Needs Bearer. The system looks the VA up by number, checks it belongs to your account, then returns its transactions.

| Query parameter | Type | Required | Notes |
|---|---|---|---|
| `virtual_account_number` | string | yes | VA number, e.g. `MONA0000010234` |
| `page` | integer ≥1 | no | Default 1 |
| `limit` | integer 1-100 | no | Default 10 |

```bash
curl "https://api.monapay.vn/api/v1/acb/virtual-account/transactions?virtual_account_number=MONA0000010234&page=1&limit=100" \
  -H "Authorization: Bearer $MONA_TOKEN"
```

Response 200:

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "data": [
      {
        "id": "0190d0e1-...",
        "acb_callback_request_id": "0190d0e0-...",
        "transaction_status": "SUCCESS",
        "transaction_channel": "IBFT",
        "transaction_date": "2026-08-28T10:45:12",
        "effective_date": "2026-08-28T10:45:12",
        "debit_or_credit": "credit",
        "amount": 2500000,
        "transaction_content": "Thanh toan DH10234",
        "transaction_code": "FT26240001234",
        "account_number": "123456789",
        "va_prefix_cd": "MONA",
        "va_nbr": "MONA0000010234",
        "attributes": {
          "remitter_name": "NGUYEN VAN A",
          "remitter_account_number": "9876543210",
          "issuer_bank_name": "Vietcombank",
          "reference_number": "FT26240001234"
        }
      }
    ],
    "current_page": 1,
    "per_page": 100,
    "total": 1,
    "last_page": 1,
    "start": 1,
    "end": 1,
    "has_next": false,
    "has_prev": false
  }
}
```

### Field meanings

| Field | Meaning |
|---|---|
| `id` | The transaction id inside MONA Pay, used by the retry endpoint |
| `transaction_status` | Status reported by ACB (`SUCCESS` means the money is in) |
| `transaction_channel` | ACB channel (fast transfer, QR...) |
| `transaction_date` | Transaction time, Vietnam time |
| `effective_date` | Booking date |
| `debit_or_credit` | `credit` = money in, `debit` = money out. Webhooks currently fire for money in only |
| `amount` | VND amount, integer |
| `transaction_content` | The transfer note the customer typed (or the QR pre-filled) |
| `transaction_code` | Bank reference, stable across resends, deduplication key |
| `account_number` | The real ACB account that received the money |
| `va_prefix_cd`, `va_nbr` | Prefix and number of the VA matched to the transaction, `null` when money went straight to the main account |
| `attributes` | Extra data from ACB: remitter name and account, remitting bank, reference number, `custom1`..`custom10` when present |

The webhook sends your server a condensed version of this same record (see [Payload format](/en/docs/webhooks/dinh-dang-payload)).

## Reconciling through the API

There is no `since_id` parameter yet; reconcile as follows (cron every 15-30 minutes or end of day):

1. For each VA in use, call page 1 with `limit=100`, keep reading while `has_next` is `true`.
2. For each record, look up `transaction_code` in your transactions table. Skip if present; otherwise insert it and process the order as if a webhook had arrived.
3. Stop when you hit a `transaction_code` you already have whose `transaction_date` is older than the previous reconciliation mark (the list is newest first).

Details and samples in [Reconciliation](/en/docs/webhooks/doi-soat).

**PHP: read every page**

```php
<?php
function monaGet(string $url): array {
    $ctx = stream_context_create(['http' => ['header' => 'Authorization: Bearer ' . getenv('MONA_TOKEN') . "\r\n", 'ignore_errors' => true]]);
    return json_decode(file_get_contents($url, false, $ctx), true) ?? [];
}
$va = 'MONA0000010234'; $page = 1;
do {
    $res = monaGet("https://api.monapay.vn/api/v1/acb/virtual-account/transactions?virtual_account_number=$va&page=$page&limit=100");
    if (empty($res['success'])) throw new RuntimeException($res['message'] ?? 'Query failed');
    foreach ($res['data']['data'] as $tx) {
        if ($tx['debit_or_credit'] !== 'credit') continue;
        // INSERT ... ON DUPLICATE KEY (UNIQUE transaction_code) → only new records are written
        recordTransaction($tx['transaction_code'], $tx['amount'], $tx['transaction_content'], $tx['transaction_date']);
    }
    $page++;
} while (!empty($res['data']['has_next']));
```

**Node**

```js
async function* monaTransactions(va) {
  for (let page = 1; ; page++) {
    const r = await fetch(`https://api.monapay.vn/api/v1/acb/virtual-account/transactions?virtual_account_number=${va}&page=${page}&limit=100`, {
      headers: { Authorization: `Bearer ${process.env.MONA_TOKEN}` },
    });
    const j = await r.json();
    if (!j.success) throw new Error(j.message);
    yield* j.data.data;
    if (!j.data.has_next) break;
  }
}
for await (const tx of monaTransactions('MONA0000010234')) {
  if (tx.debit_or_credit !== 'credit') continue;
  await db.upsertByTransactionCode(tx.transaction_code, tx); // UNIQUE(transaction_code)
}
```

## POST /api/v1/acb/virtual-account/transactions/{transaction_id}/retry

Resends the notification for one specific transaction (your server was down at the time, or the webhook configuration was wrong and has been fixed). Needs Bearer + `X-Client-Secret`. Scheduled automatic retries are in progress; today it is this call or the Resend button in the dashboard.

| Field | Type | Required | Notes |
|---|---|---|---|
| `target_type` | `WEBHOOK` / `TELEGRAM` | yes | Channel to resend on |
| `target_id` | uuid | no | A specific webhook or Telegram configuration id. Empty = resend to every active configuration matching the transaction |

```bash
curl -X POST https://api.monapay.vn/api/v1/acb/virtual-account/transactions/0190d0e1-.../retry \
  -H "Authorization: Bearer $MONA_TOKEN" -H "X-Client-Secret: $MONA_SECRET" \
  -H 'Content-Type: application/json' -d '{"target_type":"WEBHOOK"}'
```

The resent payload is identical to the first one, same `transaction_code`, so your server must deduplicate (see [Retries and error handling](/en/docs/webhooks/gui-lai-va-xu-ly-loi)).

## Common errors

| HTTP | Cause | Fix |
|---|---|---|
| 400 | VA number does not exist or does not belong to the account | Get the right number from `GET /api/v1/acb/{bank_account_id}/virtual-account/retrieve` |
| 401 | Token expired | Log in again |
| 422 | `limit` > 100 or `virtual_account_number` missing | Fix the parameters |
| 404 (retry) | `transaction_id` does not exist | Take `id` from the transaction list |
