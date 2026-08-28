---
title: Reconciling transactions with the MONA Pay API
description: Pull the transaction list page by page (up to 100 per page) through the API, compare with your books by transaction_code, with a suggested hourly or daily cron schedule.
updated: 29/08/2026
---

Reconciliation compares the transactions MONA Pay recorded with the transactions table in your own system, to fill in anything the webhook did not deliver (server maintenance, network outage, a code bug). You call `GET /api/v1/acb/virtual-account/transactions` page by page, at most 100 transactions per page, and compare by `transaction_code`. Run it hourly, or at least daily.

## Why reconcile when you already have webhooks

Webhooks are the real-time channel, but they depend on your server being alive the moment money arrives. A 2-minute deploy, an expired SSL certificate, a locked database, and a payment is missed. MONA Pay currently resends by hand (automatic retries are in progress, see [Retries and error handling](/en/docs/webhooks/gui-lai-va-xu-ly-loi)), so periodic reconciliation is the safety net you want from day one.

## The transaction list API

```text
GET https://api.monapay.vn/api/v1/acb/virtual-account/transactions
```

| Query parameter | Required | Meaning |
|---|---|---|
| `virtual_account_number` | yes | The VA whose transactions you want |
| `page` | no | Page number, starting at 1 |
| `limit` | no | Transactions per page, at most 100 |

It is a GET, so only `Authorization: Bearer <access_token>` is needed, no `X-Client-Secret`.

```bash
curl "https://api.monapay.vn/api/v1/acb/virtual-account/transactions?virtual_account_number=1234567890&page=1&limit=100" \
  -H "Authorization: Bearer $TOKEN"
```

The response uses the common envelope `{"success": true, "message": "...", "data": {...}}`, where `data` is a pagination block (verified in the backend code on 28/08/2026): `data.data` is the array of transactions, alongside `current_page`, `per_page`, `total` and `last_page`. Each transaction in `data.data` carries the same information as the webhook payload: transaction code, amount, time, reference, receiving account number. Stop looping when `current_page >= last_page`. Field details are in `https://monapay.vn/openapi.json` (section `/api/v1/acb/virtual-account/transactions`).

The API does not yet have a `since_id` parameter or date-range filter. The working approach is to pull page by page from page 1 (newest first) and stop when you hit a `transaction_code` already in your table and the page contains no new codes.

## Reconciliation algorithm

1. For each VA in use, call page 1 with `limit=100`.
2. For each transaction, check whether `transaction_code` already exists in your table.
3. Not there: insert it and run exactly the same processing as when a webhook arrives (update the order, send email...). Use the same function so the order is updated identically whichever way the transaction came in.
4. If the whole page already exists, stop. If there were new codes, call the next page.
5. Record the run time and the number of transactions added, so you know whether webhooks are being missed.

```bash
# Quick shell reconciliation: list transaction_code on page 1 for an eyeball check
curl -s "https://api.monapay.vn/api/v1/acb/virtual-account/transactions?virtual_account_number=1234567890&page=1&limit=100" \
  -H "Authorization: Bearer $TOKEN" | python3 -c '
import sys, json
d = json.load(sys.stdin)["data"]
items = d if isinstance(d, list) else d.get("data") or []   # data.data = array of transactions
for t in items:
    print(t.get("transaction_code"), t.get("amount"), t.get("transaction_date") or t.get("transfer_date"))
'
```

```php
<?php
// reconcile.php: run hourly from cron. Adds transactions the webhook did not deliver.
$token = getenv('MONA_ACCESS_TOKEN');
$va    = '1234567890';
$pdo   = new PDO(getenv('DB_DSN'), getenv('DB_USER'), getenv('DB_PASS'));
$check = $pdo->prepare('SELECT 1 FROM transactions WHERE transaction_code = ?');

for ($page = 1; $page <= 50; $page++) {
    $url = "https://api.monapay.vn/api/v1/acb/virtual-account/transactions?virtual_account_number=$va&page=$page&limit=100";
    $ch  = curl_init($url);
    curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true, CURLOPT_HTTPHEADER => ["Authorization: Bearer $token"]]);
    $res = json_decode(curl_exec($ch), true);
    curl_close($ch);

    $items = $res['data']['data'] ?? [];   // data.data = array of transactions, with current_page/last_page
    if (!$items) break;

    $added = 0;
    foreach ($items as $t) {
        $check->execute([$t['transaction_code']]);
        if ($check->fetch()) continue;      // already there, the webhook arrived
        processTransaction($t);             // same function as the webhook handler, UNIQUE prevents duplicates
        $added++;
    }
    if ($added === 0) break;                // whole page already known, stop
}
```

```js
// reconcile.js: run hourly from cron (node reconcile.js)
const TOKEN = process.env.MONA_ACCESS_TOKEN;
const VA = '1234567890';

async function reconcile() {
  for (let page = 1; page <= 50; page++) {
    const url = `https://api.monapay.vn/api/v1/acb/virtual-account/transactions?virtual_account_number=${VA}&page=${page}&limit=100`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } });
    const body = await res.json();
    let items = body.data?.data ?? [];   // data.data = array of transactions, with current_page/last_page
    if (items.length === 0) break;

    let added = 0;
    for (const t of items) {
      const exists = await db.exists('transactions', { transaction_code: t.transaction_code });
      if (exists) continue;
      await processTransaction(t); // same function as the webhook handler
      added++;
    }
    if (added === 0) break;
  }
}

reconcile().catch((e) => { console.error(e); process.exit(1); });
```

Note that the `access_token` expires (`expires_in` at login). Cron scripts should log in again on 401; see [Authentication](/en/docs/api/xac-thuc).

## Suggested schedule

| System type | Frequency | Why |
|---|---|---|
| Instant-delivery stores, ticket sales, courses unlocked immediately | Every 15 minutes | Customers are waiting right after paying |
| Management software, tuition, service fees | Hourly | Fast enough, low resource use |
| End-of-day accounting | 23:30 daily | Closing the books, printing reports |

Combine both: a quick page-1 reconciliation every hour, and a full pass through every page at the end of the day.

## Reconciling from the dashboard

No code needed: open Transactions in the dashboard, filter by VA and date range, export CSV and compare with your books in Excel. The `transaction_code` column is the key; use VLOOKUP or Power Query. This suits accountants closing weekly or monthly.

## Common problems

**The API returns 401.** The token expired. Log in again for a new token.

**Page 1 is empty although there are transactions.** Wrong `virtual_account_number`, or the money went to the main account rather than that VA. Check the VA number in the dashboard under Banks & VA.

**Reconciliation inserts duplicates.** The table has no UNIQUE constraint on `transaction_code`, or the webhook handler and the reconciliation job write to two different tables. Use one function and one table.

**The script runs too long.** It pulls every page every time. Stop as soon as a page has no new codes, as in the algorithm above.
