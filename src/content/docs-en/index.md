---
title: "MONA Pay webhook and bank API documentation"
description: MONA Pay reports incoming ACB transfers in real time through webhooks, Telegram and an API. How it works, what each feature does, and where to read next.
updated: 29/08/2026
---

MONA Pay reads the transaction notification ACB sends the moment money lands in your account, then POSTs a webhook to your server or sends a message to your Telegram group. Money never passes through MONA Pay; it goes straight into your bank account as usual. A basic integration takes about 5 minutes if you already have an ACB account and a URL that can receive webhooks.

> MONA Pay is the payment gateway and bank API of The MONA Group that lets Vietnamese businesses receive and confirm bank transfers in real time via virtual accounts (VA), VietQR, webhooks and Telegram — built so both developers and AI agents can integrate in minutes.

## How MONA Pay works

The whole flow has 4 steps. Nothing changes on the bank side except registering for transaction notifications (done once, with an OTP from ACB).

```text
[1] Customer transfers        [2] ACB notifies             [3] MONA Pay records        [4] Your system
    into an ACB account  ───▶     MONA Pay              ───▶   and sends the event   ───▶   confirms the order
    (VA or VietQR scan)           (real time)                    webhook / Telegram         (nobody watches the app)
```

1. **The customer transfers.** They pay into the virtual account (VA) attached to the order, or scan a VietQR code that already carries the amount and reference.
2. **ACB notifies MONA Pay.** As soon as the money arrives, ACB pushes the transaction to MONA Pay. This is an official connection you register once from the dashboard with an OTP sent to your phone.
3. **MONA Pay records and forwards.** The transaction appears on the dashboard, then MONA Pay POSTs a JSON payload to your webhook URL (signed with HMAC-SHA256 if enabled) and sends a Telegram message if configured.
4. **Your system handles it.** Your store, back-office software or even a Google Sheet receives the webhook and flips the order to "paid". Nobody opens a banking app to match transfers by hand.

Your server only has to answer HTTP 200, 201 or 202 within 10 seconds for MONA Pay to count the delivery as successful. Every attempt is logged so you can inspect it later.

## Features and where they are documented

| Feature | When to use it | Documentation |
|---|---|---|
| Virtual accounts (VA) | Give each order or customer its own account number so payments match automatically | [Virtual accounts (VA)](/en/docs/api/tai-khoan-ao-va) |
| Dynamic VietQR | Generate a QR code with the amount and reference pre-filled; the customer scans and pays exactly | [QR payments](/en/docs/api/qr-thanh-toan) |
| Webhooks | Your server receives incoming payments in real time | [Webhook integration](/en/docs/webhooks/tich-hop-webhook) |
| HMAC signature | Verify a webhook really came from MONA Pay, block forgeries and replays | [Webhook security](/en/docs/webhooks/bao-mat) |
| Retries and logs | See every delivery attempt, error labels, resend by hand | [Retries and error handling](/en/docs/webhooks/gui-lai-va-xu-ly-loi) |
| Reconciliation | Pull the transaction list page by page to compare with your books | [Reconciliation](/en/docs/webhooks/doi-soat) |
| Telegram | Accountants and shop owners get an instant message on their phone | [Telegram](/en/docs/telegram) |
| API keys | Create and revoke keys for server-to-server calls | [API keys](/en/docs/api/api-keys) |
| API authentication | Log in for a Bearer token, send X-Client-Secret | [Authentication](/en/docs/api/xac-thuc) |
| IP addresses | Open your firewall for the MONA Pay webhook server | [IP addresses](/en/docs/dia-chi-ip) |
| AI agents | A prompt and checklist so Claude Code, Codex or Cursor can integrate on their own | [For AI agents](/en/docs/ai-agent) |

## Where to start

- No account yet: read [Quick start (5 minutes)](/en/docs/bat-dau-nhanh). It walks from sign-up to your first webhook.
- New to VA, VietQR, webhooks or HMAC: read [Concepts](/en/docs/khai-niem) first; it is written for non-technical readers too.
- You are an AI agent, or you want to hand the job to one: open [For AI agents](/en/docs/ai-agent), or load `https://monapay.vn/llms-full.txt` directly.

## Machine-readable docs

Every docs page has a raw markdown version: append `.md` to the URL (for example `https://monapay.vn/en/docs/webhooks/tich-hop-webhook.md`). There is also `https://monapay.vn/llms.txt` (index), `https://monapay.vn/llms-full.txt` (full text) and `https://monapay.vn/openapi.json` (API v1 spec). Loading any of them gives an agent enough context to write the integration.

## System facts

| Item | Value |
|---|---|
| API base URL | `https://api.monapay.vn` (legacy alias `https://ipn.mona.host` still works) |
| Dashboard | `https://my.monapay.vn` |
| Supported banks | ACB is live; MB, BIDV, VietinBank, OCB, MSB, KienlongBank and TPBank are in the partner-registration process. Status table at [/ngan-hang](/ngan-hang) |
| Successful webhook | HTTP 200, 201 or 202 within 10 seconds |
| Webhook signature | HMAC-SHA256, headers `X-Mona-Signature` and `X-Mona-Timestamp`, 5-minute replay window |
| Webhook source IP | `103.168.55.14` (checked 28/08/2026) |
| Support | Hotline 1900 636 648, email info@themona.global |

MONA Pay is a product of The MONA Group, founded in 2016, with 14,000+ web and software projects delivered. We built this system to collect our own payments first; since 2022 more than 6,000 new MONA customers have collected payments through it inside the websites and software MONA delivered. In 2026 it opened to every business.

## Quick answers

**Does money pass through MONA Pay?** No. Money goes straight into your ACB account. MONA Pay only receives the bank's transaction notification and forwards it to you.

**Do I need to code?** Not necessarily. If you only need to know when money arrives, turn on Telegram notifications in the dashboard. Webhooks and the API are for stores and software that confirm orders automatically.

**Can a new account be used right away?** Yes. Sign up, log in immediately, create your own API key; nobody has to approve you. Only the ACB linking step needs an OTP sent to the phone number registered with the bank. MONA Pay is completely free with no transaction limit (see [pricing](/bang-gia)).

**Are banks other than ACB supported?** ACB is live; MB, BIDV, VietinBank, OCB, MSB, KienlongBank and TPBank are in the partner-registration process, with status updated at [supported banks](/ngan-hang). Webhooks, Telegram and the API are shared across banks and the payload carries `bank_name`, so adding a bank does not change your integration.
