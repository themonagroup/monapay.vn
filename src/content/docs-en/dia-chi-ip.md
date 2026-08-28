---
title: "MONA Pay IP addresses"
description: "The MONA Pay webhook server sends from 103.168.55.14 (checked 28/08/2026). How to whitelist it in nginx, ufw and Cloudflare, and why you still verify the HMAC signature."
updated: 29/08/2026
---

MONA Pay webhooks originate from IP `103.168.55.14` (the `api.monapay.vn` server, alias `ipn.mona.host`), checked on 28/08/2026. If your firewall only allows certain IPs to reach the webhook endpoint, add this address to the allow list. If it ever changes we update this page first and notify the account email in advance; re-read this page or its [dia-chi-ip.md](/en/docs/dia-chi-ip.md) version whenever webhook logs show the `CONNECTION` label.

## IP list

| Purpose | IP | Notes |
|---|---|---|
| Sending webhooks to your server | `103.168.55.14` | IPv4, both real webhooks and test deliveries |
| API `api.monapay.vn` (you call in) | `103.168.55.14` | No outbound whitelist needed unless your server blocks outbound traffic |

## Whitelisting still needs signature verification

Filtering by IP reduces noise but does not replace authentication: anyone behind a proxy or spoofing `X-Forwarded-For` can slip through if your server trusts that header. Always enable `HMAC_SHA256` and check `X-Mona-Signature` + `X-Mona-Timestamp` as described in [Webhook security](/en/docs/webhooks/bao-mat). The IP whitelist is a second layer, never the only one.

## Sample configurations

**nginx**: only let the MONA Pay IP reach the webhook path

```nginx
location = /webhook/monapay {
    allow 103.168.55.14;
    deny all;
    proxy_pass http://127.0.0.1:3000;
}
```

**ufw** (open the port to MONA Pay only; port 443 usually also serves your website, so this is rarely used — prefer the nginx rule above):

```bash
sudo ufw allow from 103.168.55.14 to any port 443 proto tcp
```

**Cloudflare WAF**: if your site sits behind Cloudflare, create a rule "URI Path equals /webhook/monapay AND IP Source Address is not in {103.168.55.14} → Block". Disable challenges (JS challenge, Bot Fight Mode) for the webhook path: MONA Pay is a machine caller and cannot pass a browser challenge; the log will show `HTTP_4XX` or `HTTP_5XX` if you forget.

**PHP**: check the IP at the application layer (when you cannot edit nginx)

```php
<?php
$allowed = ['103.168.55.14'];
$ip = $_SERVER['REMOTE_ADDR'] ?? '';
// Behind a trusted proxy (Cloudflare), read CF-Connecting-IP instead of X-Forwarded-For
if (!in_array($ip, $allowed, true)) {
    http_response_code(403);
    exit('IP not allowed');
}
```

**Node (Express)**

```js
const ALLOWED = new Set(['103.168.55.14']);
app.post('/webhook/monapay', (req, res, next) => {
  const ip = req.ip.replace('::ffff:', ''); // app.set('trust proxy', ...) when behind Cloudflare/nginx
  if (!ALLOWED.has(ip)) return res.status(403).send('IP not allowed');
  next();
});
```

## Quick check

See where the MONA Pay hostnames currently resolve:

```bash
dig +short api.monapay.vn
dig +short ipn.mona.host
```

Both returning `103.168.55.14` means you are on the current version. Send a test with `POST /api/v1/client-webhooks/test`, then read `request_headers` and `status_code` in `GET /api/v1/webhook-logs` to confirm the firewall is open.

## Common problems

| Log label | IP-related cause | Fix |
|---|---|---|
| `CONNECTION` | Your firewall blocks connections from `103.168.55.14` | Add the IP to the allow list, check `ufw status` and security groups |
| `HTTP_4XX` (403) | An allow/deny rule or WAF blocks it | Review the rule, disable challenges for the webhook path |
| `TIMEOUT` | The firewall drops packets instead of rejecting | Change the rule to allow; MONA Pay waits at most 10 seconds |
