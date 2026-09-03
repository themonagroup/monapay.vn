---
title: "Plans and billing"
description: "MONA Pay billing API: read the 5 plans, check this month's usage, create an upgrade invoice paid by VietQR with an MPAY code, poll its status, and what happens when you exceed the free or paid quota."
updated: 03/09/2026
---

MONA Pay is free for 500 incoming transactions per month with every feature included. Sell more and you upgrade to a paid plan priced by transaction count, never a percentage of the money. This page is for developers and AI agents that need to read plans, read usage and upgrade through the API instead of clicking the dashboard. List prices are on the [pricing page](/bang-gia).

## MONA customers: completely free

If you already use web, software or hosting services from The MONA Group, you get a dedicated `mona` plan: completely free, no transaction limit, for as long as you remain a MONA customer. This plan cannot be bought through the API; the MONA team assigns it at project hand-over, or call 1900 636 648. Once assigned, `GET /api/v1/billing/usage` returns `plan_code: "mona"` and everything below about quotas no longer applies to you.

## How transactions are counted

A transaction is one **incoming** (credit) payment recorded on any linked account or virtual account, with the month cut at **Vietnam time (UTC+7)**. Outgoing payments, sandbox transactions and webhook retries are **not counted**.

When you exceed the quota:

- **Free plan**: the first month you exceed, everything still gets delivered (grace). From the next month you exceed, transactions above the limit are still recorded in the dashboard but **webhook and Telegram delivery pauses** until you upgrade. No transaction is lost. If the client has a webhook configured, each blocked transaction writes a `webhook_log` row with the error `QUOTA_EXCEEDED` for reconciliation.
- **Paid plans**: nothing is blocked; transactions above the limit are charged as overage per transaction (listed per plan) and collected on the end-of-month invoice.
- The system sends exactly one Telegram reminder at 80% and one at 100% of the monthly quota.

## Endpoints

Base URL `https://api.monapay.vn` (legacy alias `https://ipn.mona.host`). Bearer authentication like every other API, see [Authentication](/en/docs/api/xac-thuc). Write requests (POST) also need the `X-Client-Secret` header.

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/api/v1/billing/plans` | Public | Read the 5 plans: `code`, `price_month`, `price_year` (yearly = 10 months), `tx_limit`, `overage_per_tx`, `features` |
| GET | `/api/v1/billing/usage` | Bearer | Current month usage: `plan_code`, `tx_used`, `tx_limit`, `overage_tx`, `overage_amount`, `plan_expires_at` |
| GET | `/api/v1/billing/invoices` | Bearer | List invoices, filter `?status=`, paginate `?page=&limit=`, returns `{ data, total }` |
| POST | `/api/v1/billing/invoices` | Bearer + secret | Create an upgrade invoice, returns 201 |
| GET | `/api/v1/billing/invoices/{id}` | Bearer | One invoice, used to poll its status |
| POST | `/api/v1/billing/invoices/{id}/cancel` | Bearer + secret | Cancel an invoice that is still pending |

## Upgrading through the API, step by step

1. Create the invoice:

```bash
curl -X POST https://api.monapay.vn/api/v1/billing/invoices \
  -H "Authorization: Bearer $TOKEN" -H "X-Client-Secret: $SECRET" \
  -H "Content-Type: application/json" \
  -d '{"plan_code": "startup", "cycle": "month"}'
```

`plan_code` accepts `startup`, `business`, `enterprise`, `scale`; `cycle` accepts `month` or `year` (a year is billed as 10 months).

2. The 201 response returns the invoice with `status: "pending"`, a **transfer code in the form `MPAY` + 6 digits**, a 48-hour payment deadline, and a `payment` block with a VietQR image link and the EMVCo payload so you can render your own QR. Have the payer scan the QR or transfer **the exact amount with the MPAY code as the transfer note** to the account printed on the invoice.

3. When the money arrives, the system matches it within seconds (it reads the bank's transaction notification and compares code plus amount). Poll `GET /api/v1/billing/invoices/{id}` until `status` becomes `paid`; the plan activates at that moment. Renewing the same plan extends from the previous expiry date; switching to a different plan restarts from the payment time.

4. Created the wrong invoice? `POST /api/v1/billing/invoices/{id}/cancel` while it is still pending. After 48 hours unpaid, the invoice moves to `expired` on its own with no charge.

Prefer not to touch the API: the dashboard [my.monapay.vn](https://my.monapay.vn) → Plans and billing runs the same flow, with a QR panel that flips to paid as soon as the money lands.

## Frequently asked questions

**I am on the Free plan and never exceeded it. Am I charged anything?** No. No setup fee, no maintenance fee, no percentage of the money. Only when you sell more than 500 transactions a month does upgrading become a question.

**When is the overage invoice issued?** At the start of the next month the previous period is closed: a paid plan with overage receives one overage invoice (exactly one per period). A paid plan more than 7 days past expiry without renewal drops back to Free, with all data kept.

**Do webhooks change when I upgrade?** No. Payload, HMAC signature and webhook configuration stay the same; the plan only decides how many transactions are fanned out each month.
