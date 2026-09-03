---
title: "ACB virtual accounts (VA): creating a VA through the API"
description: "Register an ACB VA in 4 API steps: submit the request, verify the OTP, register for notifications, verify the second OTP. Plus querying, cancelling, and cURL, PHP, Node samples."
updated: 03/09/2026
---

A virtual account (VA) is a secondary account number ACB issues under your real account. Money sent to a VA still sits in your real ACB account, but each VA can be attached to one order or one customer, so MONA Pay matches payments automatically without parsing the transfer note. Creating a VA through the API takes 4 steps: submit the registration, enter the OTP ACB sends to your phone, register for transaction notifications, enter the second OTP. Requirements: an ACB account in your name and the phone number currently registered with ACB.

If you would rather not call the API, the my.monapay.vn dashboard has the same 4-step wizard under Banks & VA.

## You choose the VA prefix

`virtual_account_prefix_code` is not a code that ACB or MONA Pay has to issue in advance. Choose it while creating the VA: use uppercase letters and digits, and keep it short and recognisable, for example `HOA` or `SHOP`. There is no branch visit and no prefix pre-registration.

ACB prepends the partner code to your chosen prefix, then appends the numeric identifier. If you choose `HOA`, a complete VA number returned by ACB may look like `LOCHOA000123456`. Always use the complete `virtual_account_number` from the response for QR creation, transaction matching or customer instructions; do not build it yourself. If MONA Pay rejects a prefix, choose another short prefix and submit the request again.

## The 4-step flow

| Step | Endpoint | What happens |
|---|---|---|
| 1 | `POST /api/v1/acb/virtual-account/registration` | Send the account number, phone number and VA prefix. ACB receives the request and sends an OTP to the phone |
| 2 | `POST /api/v1/acb/{acb_request_id}/virtual-account/verification` | Enter the OTP. ACB creates the VA and returns its number |
| 3 | `POST /api/v1/acb/{virtual_account_id}/notification/registration` | Register for real-time transaction notifications. ACB sends a second OTP |
| 4 | `POST /api/v1/acb/{acb_request_id}/notification/verification` | Enter the second OTP. From here on, incoming money is reported to MONA Pay |

Skip steps 3 and 4 and the VA exists but ACB never reports transactions for it; webhooks and Telegram stay silent. This is the mistake we see most often when customers set things up themselves.

Every request below needs `Authorization: Bearer` and `X-Client-Secret` (see [Authentication](/en/docs/api/xac-thuc)).

## Step 1: POST /api/v1/acb/virtual-account/registration

| Field | Type | Required | Notes |
|---|---|---|---|
| `bank_account_id` | uuid | no | Use when the ACB account was linked before (from `GET /api/v1/client/bank-accounts`). When present, omit `account_number` and `phone_number` |
| `customer_type` | string | no | ACB customer type code, e.g. `PERS` for personal |
| `account_number` | integer | no | The real ACB current account number |
| `phone_number` | string | no | The phone number registered with ACB, receives the OTP |
| `virtual_account_info.virtual_account_prefix_code` | string | yes | You choose it during VA creation; use a short uppercase-letter/digit value such as `HOA` or `SHOP`; no pre-registration |
| `virtual_account_info.virtual_account_content` | string | no | Identifier attached to the VA (order code, customer code) |
| `virtual_account_info.virtual_account_explain` | string | no | Description at registration |
| `virtual_account_info.beneficiary_name_rule` | integer | no | How the beneficiary name is displayed, per ACB convention |
| `user_agreement` | boolean | no | Customer accepts the service terms; send `true` |

Sample body (first time, no bank_account_id yet):

```json
{
  "customer_type": "PERS",
  "account_number": 123456789,
  "phone_number": "0901234567",
  "virtual_account_info": {
    "virtual_account_prefix_code": "MONA",
    "virtual_account_content": "DH10234",
    "virtual_account_explain": "Don hang 10234"
  },
  "user_agreement": true
}
```

Response 200: `data` is the bank account just recorded, with `acb_request` containing the `id` needed in step 2.

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": "0190b0c1-...",
    "account_number": "123456789",
    "acb_request": { "id": "0190b0c2-...", "status": "PENDING", "created_at": "2026-08-28T10:31:00" }
  }
}
```

**cURL**

```bash
curl -X POST https://api.monapay.vn/api/v1/acb/virtual-account/registration \
  -H "Authorization: Bearer $MONA_TOKEN" -H "X-Client-Secret: $MONA_SECRET" \
  -H 'Content-Type: application/json' \
  -d '{"customer_type":"PERS","account_number":123456789,"phone_number":"0901234567","virtual_account_info":{"virtual_account_prefix_code":"MONA","virtual_account_content":"DH10234"},"user_agreement":true}'
```

## Step 2: POST /api/v1/acb/{acb_request_id}/virtual-account/verification

| Field | Type | Required |
|---|---|---|
| `code` | string | yes, the OTP ACB sent to the phone |

```bash
curl -X POST https://api.monapay.vn/api/v1/acb/0190b0c2-.../virtual-account/verification \
  -H "Authorization: Bearer $MONA_TOKEN" -H "X-Client-Secret: $MONA_SECRET" \
  -H 'Content-Type: application/json' -d '{"code":"123456"}'
```

Response 200: `data` is the VA just created.

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": "0190b0c3-...",
    "bank_account_id": "0190b0c1-...",
    "prefix_code": "MONA",
    "content": "DH10234",
    "explain": "Don hang 10234",
    "beneficiary_name_rule": null,
    "virtual_account_number": "MONA0000010234",
    "created_at": "2026-08-28T10:32:00",
    "updated_at": null
  }
}
```

`virtual_account_number` is the number you give the customer to pay into (or embed in a QR). `id` is used in step 3.

## Step 3: POST /api/v1/acb/{virtual_account_id}/notification/registration

| Field | Type | Required | Notes |
|---|---|---|---|
| `receive_noti_realtime` | boolean | yes | `true` = report each transaction immediately (required for webhooks). `false` = ACB batches an end-of-day report |
| `username` | string (≤50) | no | Login information when ACB requires it; leave empty otherwise |

```bash
curl -X POST https://api.monapay.vn/api/v1/acb/0190b0c3-.../notification/registration \
  -H "Authorization: Bearer $MONA_TOKEN" -H "X-Client-Secret: $MONA_SECRET" \
  -H 'Content-Type: application/json' -d '{"receive_noti_realtime":true}'
```

Response 200/201: `data` contains `acb_request.id` for step 4.

## Step 4: POST /api/v1/acb/{acb_request_id}/notification/verification

Body `{"code": "<second OTP>"}`, same as step 2. On success you are done: from the next transaction on, ACB reports to MONA Pay and MONA Pay fires the [webhook](/en/docs/webhooks/tich-hop-webhook) or [Telegram](/en/docs/telegram) message according to your configuration.

## PHP example: steps 1 and 2 end to end

```php
<?php
$base = 'https://api.monapay.vn';
$headers = [
    'Content-Type: application/json',
    'Authorization: Bearer ' . getenv('MONA_TOKEN'),
    'X-Client-Secret: ' . getenv('MONA_SECRET'),
];
function call(string $url, array $headers, array $body): array {
    $ch = curl_init($url);
    curl_setopt_array($ch, [CURLOPT_POST => true, CURLOPT_HTTPHEADER => $headers, CURLOPT_POSTFIELDS => json_encode($body), CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 30]);
    $res = json_decode(curl_exec($ch), true) ?? [];
    curl_close($ch);
    if (empty($res['success'])) throw new RuntimeException($res['message'] ?? 'Unknown error');
    return $res['data'];
}

// Step 1: submit the request, ACB sends an OTP to the phone
$reg = call("$base/api/v1/acb/virtual-account/registration", $headers, [
    'customer_type' => 'PERS', 'account_number' => 123456789, 'phone_number' => '0901234567',
    'virtual_account_info' => ['virtual_account_prefix_code' => 'MONA', 'virtual_account_content' => 'DH10234'],
    'user_agreement' => true,
]);
$requestId = $reg['acb_request']['id'];

// Step 2: enter the OTP (read from your form)
$va = call("$base/api/v1/acb/$requestId/virtual-account/verification", $headers, ['code' => $_POST['otp']]);
echo 'VA number: ' . $va['virtual_account_number'];
```

## Node example: steps 3 and 4

```js
const base = 'https://api.monapay.vn';
const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${process.env.MONA_TOKEN}`,
  'X-Client-Secret': process.env.MONA_SECRET,
};
async function call(path, body) {
  const r = await fetch(base + path, { method: 'POST', headers, body: JSON.stringify(body) });
  const j = await r.json();
  if (!j.success) throw new Error(j.message);
  return j.data;
}

// Step 3: register for real-time notifications, ACB sends the second OTP
const noti = await call(`/api/v1/acb/${vaId}/notification/registration`, { receive_noti_realtime: true });
// Step 4: verify the second OTP
await call(`/api/v1/acb/${noti.acb_request.id}/notification/verification`, { code: secondOtp });
```

## Querying and managing

| Endpoint | Purpose |
|---|---|
| `GET /api/v1/client/bank-accounts?page=1&limit=10` | Linked ACB accounts (to get `bank_account_id`) |
| `GET /api/v1/acb/{bank_account_id}/virtual-account/retrieve?virtual_account_number=&page=1&limit=10` | VAs of one account, filterable by VA number, `limit` up to 100 |
| `GET /api/v1/acb/{virtual_account_id}/notification/details` | View a VA's notification registration |
| `POST /api/v1/acb/{acb_notification_id}/notification/modification` | Change the notification mode (body as in step 3), needs OTP re-verification through step 4 |
| `POST /api/v1/acb/{acb_notification_id}/notification/delete` | Cancel notifications |
| `POST /api/v1/acb/{virtual_account_id}/virtual-account/delete` | Cancel the VA, no body. ACB may require an OTP through the verification endpoint |

## Common problems

| Symptom | Cause | Fix |
|---|---|---|
| 400 after step 1 | The account is not an ACB account, the phone number does not match ACB's records, or the VA prefix is rejected | Check the account and phone; if the prefix caused the error, choose another short prefix and retry, with no branch registration |
| 400 wrong `code` in step 2/4 | OTP mistyped or expired | Repeat the previous step so ACB sends a new OTP |
| VA created but no transactions show up | Steps 3 and 4 not done | Call `notification/registration` and verify the second OTP |
| 401 | Token expired or `X-Client-Secret` missing | Log in again, check headers |
| 422 | Missing `virtual_account_info.virtual_account_prefix_code` | This field is required |
