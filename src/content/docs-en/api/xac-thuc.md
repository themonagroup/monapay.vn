---
title: "MONA Pay API authentication: Bearer token and X-Client-Secret"
description: "Log in for a Bearer token (valid 24 hours), add X-Client-Secret on POST/PUT/DELETE. The success/message/data envelope, 401/422 errors, and cURL, PHP, Node samples."
updated: 29/08/2026
---

Every MONA Pay API call needs the header `Authorization: Bearer <access_token>`. The token comes from `POST /api/v1/client/login` using the username and password of your my.monapay.vn account and is valid for 86,400 seconds (24 hours). Write calls (POST, PUT, DELETE) add the header `X-Client-Secret` with a secret generated under [API keys](/en/docs/api/api-keys). Every response is wrapped in the same envelope `{"success": true, "message": "...", "data": ...}`.

## Base URL

| Environment | URL |
|---|---|
| Production | `https://api.monapay.vn` |
| Legacy alias (still running, for pre-2026 integrations) | `https://ipn.mona.host` |

Accounts are usable immediately after sign-up: log in, create an API key, no approval step. A separate sandbox (simulated data, no real bank) is in progress.

## Common response envelope

Every endpoint returns the same envelope, including on errors:

```json
{
  "success": true,
  "message": "Success",
  "data": { }
}
```

| Field | Type | Meaning |
|---|---|---|
| `success` | boolean | `true` when processed, `false` on a business error |
| `message` | string | Short message for logging |
| `data` | object / array / null | Returned data, `null` if none |

Validation errors (missing field, wrong type) return HTTP 422 in the FastAPI style with a `detail[]` list of the offending fields.

## Two layers of authentication

| Layer | Header | Used for | Where to get it |
|---|---|---|---|
| Bearer token | `Authorization: Bearer <access_token>` | Every request (except sign-up and login) | `POST /api/v1/client/login` |
| Client secret | `X-Client-Secret: <client_secret>` | POST, PUT, DELETE | `POST /api/v1/client-keys/generate` |

Keep the token and the secret in environment variables, never hard-coded, never committed to git.

## POST /api/v1/client/register-client

Creates a new account. No authentication. The account is usable immediately; log in right away, no approval. The sign-up form at [my.monapay.vn/auth](https://my.monapay.vn/auth) (Sign up tab) calls this same endpoint.

| Field | Type | Required | Notes |
|---|---|---|---|
| `username` | string (1-255) | yes | Login name |
| `password` | string (1-255) | yes | Password |
| `name` | string (1-255) | yes | Business name / display name |

```bash
curl -X POST https://api.monapay.vn/api/v1/client/register-client \
  -H 'Content-Type: application/json' \
  -d '{"username":"shopabc","password":"StrongPassword#2026","name":"Shop ABC"}'
```

Response 200/201:

```json
{ "success": true, "message": "Client registered successfully", "data": {} }
```

## POST /api/v1/client/login

Exchanges username + password for an `access_token`. No authentication.

| Field | Type | Required |
|---|---|---|
| `username` | string | yes |
| `password` | string | yes |

Response 200:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "access_token": "Zx9...64-url-safe-characters",
    "expires_in": 86400,
    "token_type": "Bearer"
  }
}
```

`expires_in` is in seconds. When it expires, log in again; there is no refresh token. If the account has 2FA enabled in the dashboard, web login asks for an OTP as well; for direct API calls use an account without 2FA or contact us.

**cURL**

```bash
curl -X POST https://api.monapay.vn/api/v1/client/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"shopabc","password":"StrongPassword#2026"}'
```

**PHP**

```php
<?php
$res = json_decode(file_get_contents('https://api.monapay.vn/api/v1/client/login', false, stream_context_create([
    'http' => [
        'method'  => 'POST',
        'header'  => "Content-Type: application/json\r\n",
        'content' => json_encode(['username' => getenv('MONA_USER'), 'password' => getenv('MONA_PASS')]),
    ],
])), true);

if (empty($res['success'])) {
    throw new RuntimeException('MONA Pay login failed: ' . ($res['message'] ?? 'unknown'));
}
$accessToken = $res['data']['access_token']; // keep it, valid for 24 hours
```

**Node**

```js
const res = await fetch('https://api.monapay.vn/api/v1/client/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: process.env.MONA_USER, password: process.env.MONA_PASS }),
});
const json = await res.json();
if (!json.success) throw new Error('MONA Pay login failed: ' + json.message);
const accessToken = json.data.access_token; // keep it, valid for 24 hours
```

## GET /api/v1/client/me

Information about the logged-in account. Needs Bearer.

```bash
curl https://api.monapay.vn/api/v1/client/me \
  -H "Authorization: Bearer $MONA_TOKEN"
```

Response: `data` contains the client record (id, username, name, active status, creation time).

## PUT /api/v1/client/change-password

Changes your own password. Needs Bearer + `X-Client-Secret`.

| Field | Type | Required |
|---|---|---|
| `old_password` | string | yes |
| `new_password` | string | yes |

```bash
curl -X PUT https://api.monapay.vn/api/v1/client/change-password \
  -H "Authorization: Bearer $MONA_TOKEN" \
  -H "X-Client-Secret: $MONA_SECRET" \
  -H 'Content-Type: application/json' \
  -d '{"old_password":"StrongPassword#2026","new_password":"NewPassword#2026"}'
```

<div class="callout warn">

**Enforcement status (checked 28/08/2026):** the production server does not yet reject write calls that lack `X-Client-Secret`; the enforcing update is written and waiting to be deployed. Send the header now so nothing changes for you when it is switched on.

</div>

After changing the password the old token keeps working until it expires; to cut it off immediately, log in again and revoke the key under API keys.

## Common errors

| HTTP | Cause | Fix |
|---|---|---|
| 401 | Wrong username/password or expired token | Check the credentials (new accounts can log in immediately, there is no approval queue); log in again if the token expired |
| 401 `Authorization scheme must be Bearer` | Malformed header | Use `Authorization: Bearer <token>` with a space after Bearer |
| 422 | Missing required field or wrong type | Read `detail[]` in the body and fix the field names |
| 500 | MONA Pay-side error | Retry after a few seconds; if it repeats, report it to us with the `message` |

## Next steps

1. [Create an API key](/en/docs/api/api-keys) to get `X-Client-Secret`.
2. [Link an ACB account and create virtual accounts](/en/docs/api/tai-khoan-ao-va).
3. [Configure webhooks](/en/docs/api/webhook-configs) to receive incoming payments.
