---
title: "Balance notifications via Telegram: configuring the MONA Pay bot"
description: "Get incoming ACB transfers as messages in your company's Telegram group: add the bot, find the group_id, edit the template with {{amount}}, {{transaction_content}}; API /telegram-configs."
updated: 04/09/2026
---

The MONA Pay Telegram channel posts one message to your Telegram group every time your ACB account (or a selected VA) receives money, with no code at all. Setup in the dashboard under Telegram takes 3 actions: add the MONA Pay bot to the group, paste the group's `group_id` (plus `topic_id` if the group uses topics), and click "Send test" to see the first message. The template is editable with variables such as `{{amount}}` and `{{transaction_content}}`. Accountants, shop owners and delivery staff all see the money arrive at the same time, instead of one person watching a banking app and relaying it to everyone.

## Dashboard setup (no code)

1. **Create a Telegram group** (or use your company's existing one). Add the MONA Pay bot with permission to send messages; the bot's name is shown in the dashboard under Telegram.
2. **Get the `group_id`**: open the group on web.telegram.org; the group ID is the number in the address (groups usually start with a minus sign, e.g. `-1001234567890`), or use any ID bot. If the group has Topics enabled, also take the `topic_id` (the number at the end of the topic's link) so messages land in the right topic.
3. **Create the configuration** in the dashboard: give it a name, paste the `group_id` (+ `topic_id`), choose all accounts or a single VA, keep the default template or edit it.
4. **Send a test**: the "Send test" button has 2 modes, a connection-check message and a simulated transaction rendered with your template. Seeing the message in the group means you are done.

One account can have many configurations: the accounting group receives every transaction, the sales group only the VA of that store.

<figure class="photo">
  <picture>
    <source srcset="/img/dashboard/telegram.avif" type="image/avif" />
    <source srcset="/img/dashboard/telegram.webp" type="image/webp" />
    <img src="/img/dashboard/telegram.png" width="1280" height="860" loading="lazy" decoding="async" alt="MONA Pay dashboard Telegram Bot setup screen with the start setup action" />
  </picture>
  <figcaption>The Telegram Bot screen is where a group connection and test message begin, captured from the my.monapay.vn dashboard.</figcaption>
</figure>

## Message template

Default template (Telegram renders `<b>` as bold):

```
💰 <b>Biến động số dư</b>

Tên ngân hàng: {{bank_name}}
STK: {{account_number}}
Loại giao dịch: tiền {{vao_hay_ra}}
Số tiền: {{cong_hay_tru}}{{amount}}đ
Thời gian: {{transaction_date}}
Nội dung: {{transaction_content}}
```

| Variable | Value when sent |
|---|---|
| `{{bank_name}}` | `ACB` |
| `{{account_number}}` | The VA matched to the transaction, or the receiving account number |
| `{{vao_hay_ra}}` | `VÀO` (in) for incoming money, `RA` (out) for outgoing |
| `{{cong_hay_tru}}` | `+` or `-` |
| `{{amount}}` | Amount formatted with dot separators, e.g. `2.500.000` |
| `{{transaction_date}}` | Transaction time |
| `{{transaction_content}}` | Transfer reference |
| `{{accumulated}}` | Balance after the transaction, when the bank includes it |

A compact template for a sales group:

```
✅ +{{amount}}đ vào {{account_number}}
{{transaction_content}} · {{transaction_date}}
```

## API /api/v1/telegram-configs

Every request needs `Authorization: Bearer`; POST/PUT/DELETE also need `X-Client-Secret` (see [Authentication](/en/docs/api/xac-thuc)).

| Endpoint | Purpose |
|---|---|
| `GET /api/v1/telegram-configs` | List configurations |
| `POST /api/v1/telegram-configs` | Create a configuration |
| `PUT /api/v1/telegram-configs/{config_id}` | Update (send only the fields to change; `is_active` pauses it) |
| `DELETE /api/v1/telegram-configs/{config_id}` | Delete |
| `POST /api/v1/telegram-configs/test` | Send a test message to the group |

Fields on create:

| Field | Type | Required | Notes |
|---|---|---|---|
| `group_id` | string | yes | Telegram group ID |
| `friendly_name` | string | yes | A name you will recognise |
| `message_template` | string | yes | Template using the variables above |
| `virtual_account_id` | uuid | no | Only this VA's transactions; empty = all accounts |
| `topic_id` | string | no | Topic inside the group |

**cURL: create a configuration**

```bash
curl -X POST https://api.monapay.vn/api/v1/telegram-configs \
  -H "Authorization: Bearer $MONA_TOKEN" -H "X-Client-Secret: $MONA_SECRET" \
  -H 'Content-Type: application/json' \
  -d '{"group_id":"-1001234567890","friendly_name":"Accounting group","message_template":"✅ +{{amount}}đ vào {{account_number}}\n{{transaction_content}} · {{transaction_date}}"}'
```

**cURL: send a simulated transaction**

```bash
curl -X POST https://api.monapay.vn/api/v1/telegram-configs/test \
  -H "Authorization: Bearer $MONA_TOKEN" -H "X-Client-Secret: $MONA_SECRET" \
  -H 'Content-Type: application/json' \
  -d '{"group_id":"-1001234567890","is_dummy":true}'
```

`is_dummy: false` sends a "connected" message to confirm the bot is in the group; `true` sends a fake transaction rendered with `message_template` (the default template if omitted).

**PHP**

```php
<?php
$body = [
    'group_id' => '-1001234567890',
    'friendly_name' => 'Accounting group',
    'message_template' => "✅ +{{amount}}đ vào {{account_number}}\n{{transaction_content}} · {{transaction_date}}",
];
$ch = curl_init('https://api.monapay.vn/api/v1/telegram-configs');
curl_setopt_array($ch, [
    CURLOPT_POST => true, CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => ['Content-Type: application/json', 'Authorization: Bearer ' . getenv('MONA_TOKEN'), 'X-Client-Secret: ' . getenv('MONA_SECRET')],
    CURLOPT_POSTFIELDS => json_encode($body, JSON_UNESCAPED_UNICODE),
]);
$res = json_decode(curl_exec($ch), true);
curl_close($ch);
if (empty($res['success'])) throw new RuntimeException($res['message'] ?? 'Failed to create Telegram configuration');
```

**Node**

```js
const r = await fetch('https://api.monapay.vn/api/v1/telegram-configs', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.MONA_TOKEN}`, 'X-Client-Secret': process.env.MONA_SECRET },
  body: JSON.stringify({
    group_id: '-1001234567890',
    friendly_name: 'Accounting group',
    message_template: '✅ +{{amount}}đ vào {{account_number}}\n{{transaction_content}} · {{transaction_date}}',
  }),
});
const { success, message } = await r.json();
if (!success) throw new Error(message);
```

## Resending a transaction

If a message did not arrive (the group ID changed, the bot was kicked and re-added), resend from the dashboard under Transactions, or call `POST /api/v1/acb/virtual-account/transactions/{transaction_id}/retry` with `{"target_type":"TELEGRAM"}` (see [Transactions](/en/docs/api/giao-dich)).

## Common problems

| Symptom | Cause | Fix |
|---|---|---|
| Test fails, no message | The bot is not in the group, or `group_id` is wrong (missing minus sign or the leading `100`) | Add the bot to the group, copy the ID again from web.telegram.org |
| Message lands in "General" instead of the intended topic | Missing `topic_id` | Add `topic_id` to the configuration |
| Webhook arrives but no Telegram message | The configuration is bound to another VA, or `is_active` is off | Check the VA and the configuration status |
| Raw `<b>` tags appear in the message | The template uses tags Telegram does not support | Use only `<b>`, `<i>`, `<code>` |
