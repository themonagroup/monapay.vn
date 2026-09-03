---
title: "Incoming-payment email notifications: configuration, recipient verification and logs"
description: "Configure MONA Pay email notifications, verify recipients with a six-digit code, send a test, inspect delivery logs and manage suppressed addresses through the API, MCP or dashboard."
updated: 03/09/2026
---

MONA Pay sends email when money reaches your account or VA, a webhook delivery fails, or a VA is created. Each configuration accepts up to 10 recipients and becomes active only after every recipient enters a six-digit verification code. You can configure it through the API, MCP or dashboard, send a test, then inspect metadata-only logs; MONA Pay never stores the email body.

## Choose a configuration method

Use these methods in this order when you are integrating with code or an AI agent.

1. **API:** the complete route for creating, verifying, testing and inspecting configurations programmatically.
2. **MCP for Claude Code or Codex:** the agent calls MONA Pay tools, pauses to ask for the six-digit inbox code, then completes the flow.
3. **Dashboard:** use `my.monapay.vn` for manual, no-code setup.

One client can create multiple configurations. Each has a name, up to 10 recipients, an event list and an optional `virtual_account_id` filter. An address verified once can be reused by another configuration belonging to the same client.

## 1. Configure through the API

The base URL is `https://api.monapay.vn/api/v1`. Every request needs `Authorization: Bearer <token>`. POST, PUT and DELETE requests also need `X-Client-Secret`; POST supports an `Idempotency-Key` with a 24-hour TTL.

| Method | Endpoint | Body or query | Result |
|---|---|---|---|
| GET | `/api/v1/email-configs` | None | List of `EmailConfig` objects |
| POST | `/api/v1/email-configs` | `{name, recipients, events?, virtual_account_id?}` | Creates a configuration and sends codes to unverified addresses |
| GET | `/api/v1/email-configs/{id}` | None | One `EmailConfig` |
| PUT | `/api/v1/email-configs/{id}` | `{name?, recipients?, events?, virtual_account_id?, is_active?}` | Updates it; activation with unverified recipients returns 422 |
| DELETE | `/api/v1/email-configs/{id}` | None | Deletes the configuration |
| POST | `/api/v1/email-configs/{id}/verify` | `{email, code}` | Verifies an address; activates automatically when all are verified |
| POST | `/api/v1/email-configs/{id}/resend-verification` | `{email}` | Sends a new verification code |
| POST | `/api/v1/email-configs/{id}/test` | `{}` | Sends a sample email to verified recipients |
| GET | `/api/v1/email-logs` | `config_id?`, `status?`, `event_type?`, `from_date?`, `to_date?`, `page?`, `limit?` | Paginated logs |
| GET | `/api/v1/email-logs/stats` | `from_date?`, `to_date?` | Counts, success rate, p95 and error labels |
| GET | `/api/v1/email-suppressions` | None | Suppressed addresses for the client |
| DELETE | `/api/v1/email-suppressions/{email}` | None | Removes a suppression after the cause is fixed |

### cURL: create → verify → test → read logs

```bash
BASE=https://api.monapay.vn/api/v1
TOKEN="$MONA_TOKEN"
SECRET="$MONA_SECRET"

# 1. Create the configuration; keep its id and inspect pending_verification
CONFIG_ID=$(curl -s -X POST "$BASE/email-configs" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Client-Secret: $SECRET" \
  -H "Idempotency-Key: accounting-email-20260903" \
  -H 'Content-Type: application/json' \
  -d '{"name":"Accounting","recipients":["accounting@example.com"],"events":["TRANSACTION_IN","WEBHOOK_FAILED"]}' \
  | jq -r '.data.id')

# 2. Ask the recipient for the six-digit inbox code; never guess it
read -r -p 'Email verification code: ' VERIFY_CODE
curl -s -X POST "$BASE/email-configs/$CONFIG_ID/verify" \
  -H "Authorization: Bearer $TOKEN" -H "X-Client-Secret: $SECRET" \
  -H 'Content-Type: application/json' \
  -d "{\"email\":\"accounting@example.com\",\"code\":\"$VERIFY_CODE\"}"

# 3. Send a sample TRANSACTION_IN email
curl -s -X POST "$BASE/email-configs/$CONFIG_ID/test" \
  -H "Authorization: Bearer $TOKEN" -H "X-Client-Secret: $SECRET" \
  -H 'Content-Type: application/json' -d '{}'

# 4. Read the newest logs for this configuration
curl -s "$BASE/email-logs?config_id=$CONFIG_ID&page=1&limit=20" \
  -H "Authorization: Bearer $TOKEN" | jq '.data.items'
```

A verification code expires after 15 minutes. After five incorrect attempts, call `POST /email-configs/{id}/resend-verification` and use the new code.

### Node.js

```js
const base = 'https://api.monapay.vn/api/v1';
const writeHeaders = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${process.env.MONA_TOKEN}`,
  'X-Client-Secret': process.env.MONA_SECRET,
};

async function request(path, options = {}) {
  const response = await fetch(base + path, options);
  const body = await response.json();
  if (!response.ok || !body.success) throw new Error(`${body.detail || response.status}: ${body.message}`);
  return body.data;
}

const config = await request('/email-configs', {
  method: 'POST',
  headers: { ...writeHeaders, 'Idempotency-Key': crypto.randomUUID() },
  body: JSON.stringify({ name: 'Accounting', recipients: ['accounting@example.com'], events: ['TRANSACTION_IN'] }),
});

const code = process.env.MONA_EMAIL_VERIFY_CODE; // ask the user, then pass it through the environment
await request(`/email-configs/${config.id}/verify`, {
  method: 'POST', headers: writeHeaders,
  body: JSON.stringify({ email: 'accounting@example.com', code }),
});
await request(`/email-configs/${config.id}/test`, { method: 'POST', headers: writeHeaders, body: '{}' });
const logs = await request(`/email-logs?config_id=${config.id}&page=1&limit=20`, {
  headers: { Authorization: `Bearer ${process.env.MONA_TOKEN}` },
});
console.log(logs.items);
```

### Python

```python
import os
import uuid
import requests

base = "https://api.monapay.vn/api/v1"
token = os.environ["MONA_TOKEN"]
headers = {
    "Authorization": f"Bearer {token}",
    "X-Client-Secret": os.environ["MONA_SECRET"],
    "Content-Type": "application/json",
}

created = requests.post(
    f"{base}/email-configs",
    headers={**headers, "Idempotency-Key": str(uuid.uuid4())},
    json={"name": "Accounting", "recipients": ["accounting@example.com"], "events": ["TRANSACTION_IN"]},
    timeout=10,
)
created.raise_for_status()
config = created.json()["data"]

code = os.environ["MONA_EMAIL_VERIFY_CODE"]  # ask the user; never guess
verified = requests.post(
    f"{base}/email-configs/{config['id']}/verify",
    headers=headers,
    json={"email": "accounting@example.com", "code": code},
    timeout=10,
)
verified.raise_for_status()
requests.post(f"{base}/email-configs/{config['id']}/test", headers=headers, json={}, timeout=10).raise_for_status()
logs = requests.get(
    f"{base}/email-logs",
    headers={"Authorization": f"Bearer {token}"},
    params={"config_id": config["id"], "page": 1, "limit": 20},
    timeout=10,
)
logs.raise_for_status()
print(logs.json()["data"]["items"])
```

## 2. Configure through MCP for Claude Code or Codex

The zero-dashboard agent flow is:

1. Call `monapay_create_email_config` with `name`, `recipients`, `events` and an optional `virtual_account_id`.
2. Read `pending_verification`, tell the user to open each inbox and ask for the six-digit code. The agent must pause and never guess.
3. Call `monapay_verify_email` for each address and its matching code.
4. Call `monapay_test_email` after the configuration changes to `is_active: true`.
5. Call `monapay_email_logs` and confirm a log has `status: "sent"`.

Example prompt for the agent:

```text
Create an email configuration named "Accounting" for accounting@example.com with TRANSACTION_IN and WEBHOOK_FAILED.
After creation, ask me for the six-digit inbox code before calling monapay_verify_email.
Then call monapay_test_email and monapay_email_logs; finish only when the log status is sent.
```

## 3. Configure in the dashboard

Open `my.monapay.vn` → **Email** → **Create configuration**, enter a name, add up to 10 addresses, select events and optionally a VA. Each recipient opens the verification message and enters the six-digit code. MONA Pay activates the configuration when every address is verified; click **Send test**, then open **Email logs** to confirm delivery.

## Supported events

| Event | When it is sent | Notes |
|---|---|---|
| `TRANSACTION_IN` | Money reaches the matching account or VA | Required and selected by default |
| `WEBHOOK_FAILED` | A webhook delivery attempt fails after retry | Helps operators react quickly |
| `VA_CREATED` | A new VA has been created | A configuration may target one VA |

## Incoming-payment email example

Example subject:

```text
Có tiền vào +320.000đ · MONA0000010234 · DH10234 NGUYEN VAN A
```

The message shows the amount, VA or account number, transfer reference, time, transaction code and bank, plus a **View on dashboard** button. The footer identifies MONA Pay as part of The MONA Group, with 14,000+ projects, and explains where to disable the message or change recipients.

## Logs, suppressions and bounces

`GET /email-logs` returns the recipient, subject, `message_id`, status, SMTP code, duration, error label and attempt number. MONA Pay **does not store the email body**. Statuses are `sent`, `failed`, `suppressed`, `skipped`; error labels are `OK`, `SMTP_4XX`, `SMTP_5XX`, `TIMEOUT`, `CONNECTION`, `SUPPRESSED`, `RATE_LIMITED`, `TEMPLATE`, `UNVERIFIED`.

A hard bounce with a 5.x.x code adds the address to suppressions with reason `hard_bounce`; complaints and manual blocks may suppress it too. MONA Pay stops sending and records `SUPPRESSED`. After correcting the address or resolving the cause, inspect `GET /email-suppressions`, then call `DELETE /email-suppressions/{email}` to remove the block at your own responsibility. A 4.x.x delayed bounce is logged only.

## Rate limits and retries

| Type | Limit |
|---|---|
| `TRANSACTION_IN` | 600 emails per client per hour; excess is logged as `RATE_LIMITED` and not sent |
| Test email | 20 per client per hour |
| Verification code | 5 per address per hour and 30 per client per hour |

SMTP 4xx, timeout and connection errors are retried up to three times after 1, 5 and 25 seconds. SMTP 5xx fails immediately. Suppressed addresses are never retried.

## Security and privacy

- Every recipient must be verified before a configuration becomes active; adding an address may return it to pending verification.
- MONA Pay stores delivery metadata only and never logs the email body.
- Messages come from `MONA Pay <noreply@monapay.vn>` with `Reply-To: info@themona.global`, `Message-ID: <uuid@monapay.vn>`, `X-Mona-Mail-Id` and `Auto-Submitted: auto-generated`.
- Notification and receipt messages include `List-Unsubscribe: <mailto:bounce@monapay.vn?subject=unsubscribe>, <https://my.monapay.vn/email-config>` and `List-Unsubscribe-Post: List-Unsubscribe=One-Click`; verification-code messages do not need those headers.
- Keep secrets and tokens in environment variables. Never write verification codes, Bearer tokens or `X-Client-Secret` values to application logs.

## FAQ

**Why is `is_active` still `false` after creation?** At least one address remains in `pending_verification`. Enter the correct six-digit code for every recipient; MONA Pay activates the configuration after the final one.

**What if the verification code does not arrive?** Check spam and the address, then call the resend endpoint. Codes expire after 15 minutes; resends are limited to five per address per hour.

**Why does a test return `skipped`, or a log show `SUPPRESSED`?** The address is unverified or blocked after a hard bounce, complaint or manual action. Inspect suppressions, fix the cause, then remove the block.

**Does email replace webhooks or Telegram?** It does not have to. You can use all three channels together: webhooks for software, Telegram for groups and email for people who work from their inbox.
