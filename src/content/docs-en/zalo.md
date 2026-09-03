---
title: "Incoming-payment alerts in a Zalo group"
description: "Let sales, cashier and accounting teams see incoming payments in a Zalo group through MONA's Gấu Mona bot, with no Zalo OA or code."
updated: 03/09/2026
---

A shop owner no longer has to watch a banking app and relay each payment to the team. When money reaches the selected account or VA, MONA Pay posts one message to a Zalo group so sales, cashier and accounting staff see it immediately. There is no Zalo OA to register, no extra app to install and no code to write.

Messages are delivered through **MONA's Gấu Mona bot** inside the group. The bot must therefore be a member before the group can receive MONA Pay notifications.

## Requirements before setup

- **Existing MONA customers:** ask the MONA Account in charge to add Gấu Mona to the group. The Account can obtain `group_id` from PMS under project → Zalo connection → `chatId`, or ask the MONA team to look up the group name.
- **Not yet a MONA customer:** self-service bot installation is not available yet. Call **1900 636 648** so MONA can connect the Zalo group and provide its `group_id`.
- `group_id` must contain 10 to 25 digits, for example `7119000000000000000`.

Never post login credentials, bank OTPs or passwords in the Zalo group.

## Set it up on the dashboard in 3 steps

1. Open [my.monapay.vn](https://my.monapay.vn), go to **Zalo** and select **Add group**.
2. Enter a recognisable name, paste `group_id`, optionally select a VA and events, then save the configuration.
3. Select **Send test**. The connection works when the group receives “🐼 MONA Pay đã nối nhóm này…”.

An account can connect several groups. For example, the sales group may receive one VA only while accounting receives every transaction.

## Message template and variables

The default incoming-payment message looks like this after rendering:

```text
💰 +2.500.000đ vào TK 123456789
ND: THANH TOAN DH10234
Mã GD: FT26240001234
10:30:00 03/09/2026
- MONA Pay
```

Custom templates accept either `{amount}` or `{{amount}}` syntax. These variables are supported:

| Variable | Value |
|---|---|
| `{amount}` | Transaction amount |
| `{description}` | Bank-transfer reference |
| `{virtual_account_number}` | Receiving virtual account number |
| `{transaction_code}` | Transaction code for reconciliation |
| `{transfer_date}` | Transaction time |

A compact sales-group template:

```text
💰 Received {amount} VND
VA: {virtual_account_number}
Reference: {description}
Transaction: {transaction_code}
Time: {transfer_date}
```

## Available events

| Event | When MONA Pay sends it |
|---|---|
| `TRANSACTION_IN` | Money reaches a real or sandbox VA; sandbox messages start with `[THỬ]` |
| `CHECKOUT_PAID` | A hosted checkout is fully paid |
| `WEBHOOK_FAILED` | A webhook delivery fails |
| `VA_CREATED` | A new virtual account is created |

When `events` is omitted from an API request, the contract defaults it to `TRANSACTION_IN`.

## Limits to know

- Zalo does not parse Markdown. Asterisks, HTML tags and link syntax appear as plain text.
- This channel posts only to groups that contain Gấu Mona. It does not send direct messages to individual Zalo accounts.
- MONA Pay sends at most one message per transaction per configuration and deduplicates by transaction code.
- Do not use the channel for advertising, bulk messaging or spam.

## Zalo group API

Every request needs `Authorization: Bearer <token>`. Write requests made with a dashboard token also need `X-Client-Secret`. Responses use the common `{"success":true,"message":"...","data":...}` envelope.

| Endpoint | Purpose |
|---|---|
| `GET /api/v1/zalo-groups` | List group configurations |
| `POST /api/v1/zalo-groups` | Create a configuration; `group_id` must contain 10 to 25 digits |
| `PUT /api/v1/zalo-groups/{id}` | Update a configuration by configuration ID |
| `DELETE /api/v1/zalo-groups/{id}` | Delete a configuration |
| `POST /api/v1/zalo-groups/{id}/test` | Send the connection test message |
| `GET /api/v1/zalo-groups/logs?limit=20&status=ok|failed` | Read delivery logs and filter by status |

`POST` returns `503 Kênh Zalo chưa mở` when the relay is not enabled on the server. An invalid `group_id` returns 422. A failed test normally includes the relay reason and a reminder that the group must contain Gấu Mona.

**cURL: create a configuration**

```bash
curl -X POST https://api.monapay.vn/api/v1/zalo-groups \
  -H "Authorization: Bearer $MONA_TOKEN" \
  -H "X-Client-Secret: $MONA_SECRET" \
  -H 'Content-Type: application/json' \
  -d '{"group_id":"7119000000000000000","friendly_name":"Sales group","events":["TRANSACTION_IN"],"is_active":true}'
```

Take `data.id` from the response and use that configuration ID for the test:

```bash
curl -X POST https://api.monapay.vn/api/v1/zalo-groups/CONFIG_ID/test \
  -H "Authorization: Bearer $MONA_TOKEN" \
  -H "X-Client-Secret: $MONA_SECRET"
```

## 6 MCP tools for Zalo groups

After installing `monapay-mcp`, an agent can manage the complete flow with 6 tools:

| Tool | Purpose |
|---|---|
| `monapay_list_zalo_groups` | List connected groups |
| `monapay_create_zalo_group` | Create a group configuration |
| `monapay_update_zalo_group` | Change its name, group, VA, template, events or status |
| `monapay_delete_zalo_group` | Delete a configuration |
| `monapay_test_zalo_group` | Send the test message |
| `monapay_zalo_group_logs` | Read `ok` or `failed` logs |

Example prompt, replacing `7119…` with the real `group_id` supplied by MONA:

```text
Connect Zalo group_id 7119… to MONA Pay and send a test message.
```

The agent should create the group, take its `id`, run the test and inspect the logs. If delivery fails, verify Gấu Mona membership and `group_id` before completing the task.

## Frequently asked questions

### Do I need a Zalo OA?

No. MONA Pay uses MONA's Gấu Mona bot inside the group, so there is no separate Zalo OA to register or maintain.

### Where do I get `group_id`?

MONA customers can ask their Account to retrieve it from PMS under project → Zalo connection → `chatId`, or ask the MONA team to look up the group by name. It is a 10 to 25 digit string.

### Can a non-MONA customer add the bot without help?

Not yet. Call 1900 636 648 so MONA can add the bot and provide `group_id`.

### Why did Send test produce no message?

The group usually does not contain Gấu Mona or `group_id` is incorrect. Confirm both with the MONA Account, retry, then inspect the `failed` log for the relay's reason.
