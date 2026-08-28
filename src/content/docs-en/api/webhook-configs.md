---
title: "Webhook configuration API"
description: "Create, update and delete webhook configurations via /api/v1/client-webhooks, send a simulated test payload, read delivery history and success-rate / P95 statistics via /webhook-logs."
updated: 29/08/2026
---

Everything you can do in the dashboard's Webhooks section has an API: `POST /api/v1/client-webhooks` creates a configuration (receiving URL, auth type HMAC_SHA256 / API_KEY / NONE, payload format, bound to one VA or all accounts), `PUT` and `DELETE /api/v1/client-webhooks/{config_id}` update and delete, `POST /api/v1/client-webhooks/test` fires a simulated 500,000 VND payload to try your endpoint before real money arrives. Per-delivery history (HTTP code, `duration_ms`, error label) is at `GET /api/v1/webhook-logs`, 7-30 day statistics at `GET /api/v1/webhook-logs/stats`.

How MONA Pay signs and sends payloads is covered in [Webhook integration](/en/docs/webhooks/tich-hop-webhook) and [Security](/en/docs/webhooks/bao-mat); this page is the API reference.

## The webhook configuration object

| Field | Type | Required on create | Notes |
|---|---|---|---|
| `name` | string | yes | A memorable name ("Online store", "Accounting software") |
| `webhook_url` | string | yes | Your HTTPS URL that accepts POST |
| `auth_type` | `NONE` / `API_KEY` / `HMAC_SHA256` | no, default `NONE` | Use `HMAC_SHA256` |
| `secret_key` | string | required when `auth_type` is not `NONE` | Secret for HMAC signing or for the API-key header |
| `api_key_name` | string | no, default `X-Webhook-Secret` | Header name carrying the secret when `auth_type` = `API_KEY` |
| `payload_format` | `application/json` / `application/x-www-form-urlencoded` / `multipart/form-data` | no, default `application/json` | Body encoding MONA Pay sends |
| `virtual_account_id` | uuid | no | Bind the configuration to one VA. Empty = every account, every VA |
| `is_active` | boolean | PUT only | Pause without deleting |

Each incoming transaction fires to every active configuration that matches: "all accounts" configurations always receive it; a configuration bound to a VA receives only that VA's transactions. Keep the number of configurations small (under 20) so logs stay readable.

## GET /api/v1/client-webhooks

Lists the account's configurations. Needs Bearer.

```bash
curl https://api.monapay.vn/api/v1/client-webhooks -H "Authorization: Bearer $MONA_TOKEN"
```

```json
{
  "success": true,
  "message": "Success",
  "data": [
    { "id": "0190e0f1-...", "name": "Online store", "webhook_url": "https://shop.example.com/webhook/monapay", "auth_type": "HMAC_SHA256", "api_key_name": "X-Webhook-Secret", "payload_format": "application/json", "virtual_account_id": null, "is_active": true, "max_retries": 7, "created_at": "2026-08-28T11:00:00" }
  ]
}
```

`secret_key` is not returned in the list. `max_retries` is the maximum retry count reserved for the automatic retry mechanism in progress; it has no effect yet.

## POST /api/v1/client-webhooks

Needs Bearer + `X-Client-Secret`.

**cURL**

```bash
curl -X POST https://api.monapay.vn/api/v1/client-webhooks \
  -H "Authorization: Bearer $MONA_TOKEN" -H "X-Client-Secret: $MONA_SECRET" \
  -H 'Content-Type: application/json' \
  -d '{"name":"Online store","webhook_url":"https://shop.example.com/webhook/monapay","auth_type":"HMAC_SHA256","secret_key":"long-random-hmac-secret","payload_format":"application/json"}'
```

**PHP**

```php
<?php
$ch = curl_init('https://api.monapay.vn/api/v1/client-webhooks');
curl_setopt_array($ch, [
    CURLOPT_POST => true, CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => ['Content-Type: application/json', 'Authorization: Bearer ' . getenv('MONA_TOKEN'), 'X-Client-Secret: ' . getenv('MONA_SECRET')],
    CURLOPT_POSTFIELDS => json_encode([
        'name' => 'Online store',
        'webhook_url' => 'https://shop.example.com/webhook/monapay',
        'auth_type' => 'HMAC_SHA256',
        'secret_key' => getenv('MONA_WEBHOOK_SECRET'), // the same secret your receiving server uses to verify
    ]),
]);
$res = json_decode(curl_exec($ch), true);
curl_close($ch);
if (empty($res['success'])) throw new RuntimeException($res['message'] ?? 'Webhook creation failed');
$configId = $res['data']['id'];
```

**Node**

```js
const r = await fetch('https://api.monapay.vn/api/v1/client-webhooks', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.MONA_TOKEN}`, 'X-Client-Secret': process.env.MONA_SECRET },
  body: JSON.stringify({
    name: 'Online store',
    webhook_url: 'https://shop.example.com/webhook/monapay',
    auth_type: 'HMAC_SHA256',
    secret_key: process.env.MONA_WEBHOOK_SECRET, // the same secret your receiving server uses to verify
  }),
});
const { success, data, message } = await r.json();
if (!success) throw new Error(message);
console.log('config id', data.id);
```

## PUT /api/v1/client-webhooks/{config_id}

Partial update; send only the fields to change. Needs Bearer + `X-Client-Secret`.

```bash
curl -X PUT https://api.monapay.vn/api/v1/client-webhooks/0190e0f1-... \
  -H "Authorization: Bearer $MONA_TOKEN" -H "X-Client-Secret: $MONA_SECRET" \
  -H 'Content-Type: application/json' -d '{"is_active":false}'
```

## DELETE /api/v1/client-webhooks/{config_id}

Deletes the configuration. Old logs are kept for reference.

```bash
curl -X DELETE https://api.monapay.vn/api/v1/client-webhooks/0190e0f1-... \
  -H "Authorization: Bearer $MONA_TOKEN" -H "X-Client-Secret: $MONA_SECRET"
```

## POST /api/v1/client-webhooks/test

Fires one simulated payload at any URL, no configuration needed. Use it to try your endpoint and HMAC verification code. Needs Bearer + `X-Client-Secret`.

| Field | Type | Required | Notes |
|---|---|---|---|
| `webhook_url` | string | yes | URL to test |
| `auth_type` | string | no, default `NONE` | Test with the type you will actually use |
| `secret_key` | string | when auth is not NONE | |
| `api_key_name` | string | no | |
| `payload_format` | string | no | |
| `is_dummy` | boolean | no | Send a simulated transaction payload (set `true`) |

The simulated payload MONA Pay sends:

```json
{"amount":500000,"description":"DUMMY TRANSACTION MONAPAY","transfer_date":"11:05:00 28/08/2026","transaction_code":"DUMMY123","account_number":"1900636648","bank_name":"ACB","type":"income"}
```

Your server should recognise `transaction_code` = `DUMMY123` and not create a real order.

```bash
curl -X POST https://api.monapay.vn/api/v1/client-webhooks/test \
  -H "Authorization: Bearer $MONA_TOKEN" -H "X-Client-Secret: $MONA_SECRET" \
  -H 'Content-Type: application/json' \
  -d '{"webhook_url":"https://shop.example.com/webhook/monapay","auth_type":"HMAC_SHA256","secret_key":"long-random-hmac-secret","is_dummy":true}'
```

Response: `success` is `true` when your server returned 200/201/202 within 10 seconds; `false` with a `message` describing the error (timeout, SSL, 4xx/5xx).

## GET /api/v1/webhook-logs

Per-delivery history, newest first. Needs Bearer.

| Query parameter | Type | Notes |
|---|---|---|
| `page` | integer ≥1 | default 1 |
| `limit` | integer 1-100 | default 20 |
| `status` | `success` / `failed` | `success` = 2xx |
| `from_date`, `to_date` | `YYYY-MM-DD` | Filter by creation date (UTC) |

```bash
curl "https://api.monapay.vn/api/v1/webhook-logs?status=failed&from_date=2026-08-01&limit=50" \
  -H "Authorization: Bearer $MONA_TOKEN"
```

```json
{
  "success": true,
  "message": "Webhook logs retrieved successfully",
  "data": {
    "items": [
      {
        "id": "0190f0a1-...",
        "client_id": "0190a0f0-...",
        "event_type": "webhook",
        "endpoint_url": "https://shop.example.com/webhook/monapay",
        "request_payload": "{\"amount\":2500000,...}",
        "request_headers": "{\"X-Mona-Timestamp\":\"1756350312\",\"X-Mona-Signature\":\"sha256=...\"}",
        "status_code": 500,
        "response_text": "Internal Server Error",
        "duration_ms": 842,
        "error_label": "HTTP_5XX",
        "created_at": "2026-08-28T10:45:13+00:00"
      }
    ],
    "total": 3,
    "page": 1,
    "limit": 50
  }
}
```

`error_label` is one of `OK`, `HTTP_3XX`, `HTTP_4XX`, `HTTP_5XX`, `TIMEOUT`, `SSL`, `DNS`, `CONNECTION`, `ERROR`. `event_type` is `webhook` for real transactions, `test` for test deliveries. Label meanings and fixes are in [Retries and error handling](/en/docs/webhooks/gui-lai-va-xu-ly-loi).

## GET /api/v1/webhook-logs/stats

Statistics over the last N days (`days` parameter, e.g. 7 or 30). Needs Bearer.

```bash
curl "https://api.monapay.vn/api/v1/webhook-logs/stats?days=7" -H "Authorization: Bearer $MONA_TOKEN"
```

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "days": 7,
    "total": 412,
    "success": 409,
    "failed": 3,
    "success_rate": 99.27,
    "p95_duration_ms": 610,
    "daily": [ { "date": "2026-08-22", "total": 58, "failed": 0 } ],
    "errors": [ { "label": "HTTP_5XX", "count": 2 }, { "label": "TIMEOUT", "count": 1 } ]
  }
}
```

`p95_duration_ms` is your server's response time at the 95th percentile; above 5,000 it is worth reviewing the endpoint, since MONA Pay cuts off at 10,000 ms.

## Common errors

| HTTP | Cause | Fix |
|---|---|---|
| 401 | Token expired or `X-Client-Secret` missing on POST/PUT/DELETE | Log in again, add the header |
| 422 `auth_type` | Value outside `NONE` / `API_KEY` / `HMAC_SHA256` | Use the exact uppercase value |
| 422 `payload_format` | Outside the 3 allowed values | Use `application/json` |
| `test` returns `success: false` | Your server did not answer 2xx within 10 seconds, or SSL/DNS failed | Read `message`, `curl` the URL from another machine |
