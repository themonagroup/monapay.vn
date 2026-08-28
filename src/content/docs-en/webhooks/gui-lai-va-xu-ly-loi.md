---
title: Webhook retries and error handling
description: What counts as a successful webhook (200/201/202 within 10 seconds), the 9 error labels in the log and how to fix them, manual resend from the dashboard, success-rate and P95 statistics.
updated: 29/08/2026
---

MONA Pay counts a webhook delivery as successful when your server answers HTTP 200, 201 or 202 within 10 seconds. Every delivery is logged with the HTTP code, response time and an error label. Failed deliveries can be resent by hand from the dashboard; scheduled automatic retries (up to 7) are being rolled out.

## What counts as success

| Condition | Value |
|---|---|
| Accepted HTTP codes | 200, 201, 202 |
| Maximum wait | 10 seconds from the moment MONA Pay starts sending |
| Response body | Optional, MONA Pay does not read it |
| Redirects | Not followed. 301/302 count as failed |

So your endpoint only needs to return `200 OK` with an empty body. Do not return 204 (not in the list) and do not put a redirect in front of the webhook URL.

## Per-delivery log

Every delivery MONA Pay makes, including tests and resends, is one row in the dashboard under Webhooks, tab Delivery history. The same data is available at `GET /api/v1/webhook-logs`.

| Log field | Meaning |
|---|---|
| Sent at | When MONA Pay started the request |
| HTTP code | The code your server returned, empty if no connection |
| `duration_ms` | Time from sending to receiving the response, in milliseconds |
| `error_label` | Result classification, see the table below |
| Payload | The payload that was sent, for your reference |
| Response | The first few hundred characters of your server's response body, handy for debugging |

## The 9 error labels and how to fix them

| `error_label` | Meaning | Common cause | Fix |
|---|---|---|---|
| `OK` | Success | Server answered 200/201/202 within 10 seconds | Nothing to do |
| `HTTP_3XX` | Server returned a redirect | URL missing `https`, missing or extra trailing `/`, www redirect | Register the final URL, no redirects |
| `HTTP_4XX` | Server rejected | 401/403 wrong secret or an application firewall; 404 wrong path; 405 route does not accept POST; 422 endpoint expects fields that are absent | Check secret, path and method. For WAFs (Cloudflare, ModSecurity) allow IP `103.168.55.14` |
| `HTTP_5XX` | Server error | Code threw an exception, out of memory, database unreachable | Check your server logs around the `duration_ms` timestamp |
| `TIMEOUT` | No response within 10 seconds | Endpoint processes the order before answering, or the server is overloaded | Answer 200 first, process afterwards |
| `SSL` | TLS handshake failed | Expired or self-signed certificate, wrong hostname, missing intermediate chain | Check with `openssl s_client -connect your-domain:443`, install the full chain |
| `DNS` | Hostname does not resolve | Typo in the domain, expired domain, DNS not propagated | Check `dig your-domain` from an outside machine |
| `CONNECTION` | Could not open a connection | Firewall blocks port 443, server down, wrong port | Open port 443 for IP `103.168.55.14`, check the server is running |
| `ERROR` | Other error | Anything that does not fit the labels above | Read the response in the log; call 1900 636 648 if unclear |

## Manual resend

In Delivery history every failed row has a Resend button. Clicking it makes MONA Pay send the exact same payload to the same URL immediately and adds a new log row. `transaction_code` does not change, so your endpoint can tell it is an old payload. You can also resend through the API: `POST /api/v1/acb/virtual-account/transactions/{transaction_id}/retry` with body `{"target_type": "WEBHOOK"}` (or `"TELEGRAM"`, plus `target_id` for the configuration to resend to), with `Authorization: Bearer` + `X-Client-Secret` like every write call. See [Webhook configuration API](/en/docs/api/webhook-configs).

Two situations where resending helps:

- **After fixing a server bug.** For example the endpoint returned 500 because a table was missing; create the table, then resend each failed row.
- **Testing after a code change.** Resend an old transaction to see whether the new code handles it correctly, instead of transferring real money.

## Automatic retries (in progress)

Webhook configurations have a `max_retries` field, default 7, reserved for scheduled retries with increasing delays when your server errors. This mechanism is being rolled out and is not yet live in production; today every resend is triggered by you. When it ships, the exact schedule will be published on this page. Meanwhile run [periodic reconciliation](/en/docs/webhooks/doi-soat) so nothing is missed while your server has trouble.

## Success rate and P95 statistics

The Webhooks section of the dashboard has a statistics tab fed by `GET /api/v1/webhook-logs/stats`: total deliveries, success rate, average and P95 response time (95% of deliveries are faster than this), and the distribution of error labels. Some reference points:

- Success rate below 99% in a day: something is wrong on your server; look at the error label distribution.
- P95 above 3,000 ms: the endpoint does heavy work before answering and will eventually hit `TIMEOUT` under load.
- A sudden rise in `HTTP_4XX` after a deploy: usually the secret or the path changed without updating the configuration.

```bash
curl "https://api.monapay.vn/api/v1/webhook-logs/stats" \
  -H "Authorization: Bearer $TOKEN"
```

## Handling on your side

Three rules so the endpoint never fails under load:

1. **Answer first, work later.** As soon as the signature checks out, return 200. Push order updates, emails and third-party API calls to a queue (Redis, database, cron). The PHP sample uses `fastcgi_finish_request()`, the Node sample calls `res.send()` before continuing; see [Webhook integration](/en/docs/webhooks/tich-hop-webhook).
2. **Deduplicate with `transaction_code`.** Manual resends, two configurations on the same URL, and future automatic retries all produce duplicates. A UNIQUE constraint on `transaction_code` is enough.
3. **Keep your own log.** Store the raw body and headers of every payload for at least 30 days. When you need to compare with MONA Pay's log, both sides look at the same `transaction_code`.

## Common problems

**Log says `OK` but the order status did not change.** The endpoint returned 200 and the processing afterwards failed. Check your application log; MONA Pay only sees the HTTP code.

**Resend produces the same error label.** The server-side bug is not fixed yet. Reproduce with the cURL simulation on the [Webhook security](/en/docs/webhooks/bao-mat) page from another machine.

**`TIMEOUT` only at peak hours.** The server is overloaded and processes synchronously. Switch to answering 200 first.

**Every webhook shows `CONNECTION` from a certain moment.** Usually a firewall or server change. Re-open port 443 for IP `103.168.55.14`.
