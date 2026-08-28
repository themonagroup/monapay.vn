---
title: "Cấu hình webhook qua API"
description: "Tạo, sửa, xoá cấu hình webhook qua /api/v1/client-webhooks, gửi thử payload giả lập, đọc lịch sử gửi và thống kê tỷ lệ thành công, P95 qua /webhook-logs."
updated: 28/08/2026
---

Mọi thứ làm được ở dashboard mục Webhooks đều có API tương ứng: `POST /api/v1/client-webhooks` tạo cấu hình (URL nhận, kiểu xác thực HMAC_SHA256 / API_KEY / NONE, định dạng payload, gắn theo 1 VA hoặc mọi tài khoản), `PUT` và `DELETE /api/v1/client-webhooks/{config_id}` để sửa, xoá, `POST /api/v1/client-webhooks/test` bắn 1 payload giả lập 500.000đ để thử endpoint trước khi có tiền thật. Lịch sử từng lần gửi (mã HTTP, thời gian phản hồi `duration_ms`, nhãn lỗi) đọc ở `GET /api/v1/webhook-logs`, thống kê 7-30 ngày ở `GET /api/v1/webhook-logs/stats`.

Cách MONA Pay ký và gửi payload xem ở [Tích hợp webhook](/docs/webhooks/tich-hop-webhook) và [Bảo mật](/docs/webhooks/bao-mat); trang này là tham chiếu API.

## Đối tượng cấu hình webhook

| Trường | Kiểu | Bắt buộc khi tạo | Ghi chú |
|---|---|---|---|
| `name` | string | có | Tên gợi nhớ ("Web bán hàng", "Phần mềm kế toán") |
| `webhook_url` | string | có | URL HTTPS nhận POST của anh chị |
| `auth_type` | `NONE` / `API_KEY` / `HMAC_SHA256` | không, mặc định `NONE` | Nên dùng `HMAC_SHA256` |
| `secret_key` | string | cần khi `auth_type` khác `NONE` | Secret để ký HMAC hoặc gửi trong header API key |
| `api_key_name` | string | không, mặc định `X-Webhook-Secret` | Tên header mang secret khi `auth_type` = `API_KEY` |
| `payload_format` | `application/json` / `application/x-www-form-urlencoded` / `multipart/form-data` | không, mặc định `application/json` | Kiểu body MONA Pay gửi |
| `virtual_account_id` | uuid | không | Gắn cấu hình với 1 VA. Bỏ trống = mọi tài khoản, mọi VA |
| `is_active` | boolean | chỉ khi PUT | Tắt tạm không cần xoá |

Mỗi giao dịch tiền vào sẽ bắn tới mọi cấu hình đang bật khớp điều kiện: cấu hình "mọi tài khoản" luôn nhận, cấu hình gắn VA chỉ nhận giao dịch của VA đó. Giữ số cấu hình gọn (dưới 20) để dễ theo dõi log.

## GET /api/v1/client-webhooks

Danh sách cấu hình của tài khoản. Cần Bearer.

```bash
curl https://api.monapay.vn/api/v1/client-webhooks -H "Authorization: Bearer $MONA_TOKEN"
```

```json
{
  "success": true,
  "message": "Success",
  "data": [
    { "id": "0190e0f1-...", "name": "Web ban hang", "webhook_url": "https://shop.vn/webhook/monapay", "auth_type": "HMAC_SHA256", "api_key_name": "X-Webhook-Secret", "payload_format": "application/json", "virtual_account_id": null, "is_active": true, "max_retries": 7, "created_at": "2026-08-28T11:00:00" }
  ]
}
```

`secret_key` không trả về trong danh sách. `max_retries` là số lần gửi lại tối đa dành cho cơ chế gửi lại tự động đang triển khai; hiện chưa có tác dụng.

## POST /api/v1/client-webhooks

Cần Bearer + `X-Client-Secret`.

**cURL**

```bash
curl -X POST https://api.monapay.vn/api/v1/client-webhooks \
  -H "Authorization: Bearer $MONA_TOKEN" -H "X-Client-Secret: $MONA_SECRET" \
  -H 'Content-Type: application/json' \
  -d '{"name":"Web ban hang","webhook_url":"https://shop.vn/webhook/monapay","auth_type":"HMAC_SHA256","secret_key":"hmac-secret-dai-va-ngau-nhien","payload_format":"application/json"}'
```

**PHP**

```php
<?php
$ch = curl_init('https://api.monapay.vn/api/v1/client-webhooks');
curl_setopt_array($ch, [
    CURLOPT_POST => true, CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => ['Content-Type: application/json', 'Authorization: Bearer ' . getenv('MONA_TOKEN'), 'X-Client-Secret: ' . getenv('MONA_SECRET')],
    CURLOPT_POSTFIELDS => json_encode([
        'name' => 'Web ban hang',
        'webhook_url' => 'https://shop.vn/webhook/monapay',
        'auth_type' => 'HMAC_SHA256',
        'secret_key' => getenv('MONA_WEBHOOK_SECRET'), // cùng secret server nhận webhook dùng để verify
    ]),
]);
$res = json_decode(curl_exec($ch), true);
curl_close($ch);
if (empty($res['success'])) throw new RuntimeException($res['message'] ?? 'Tạo webhook thất bại');
$configId = $res['data']['id'];
```

**Node**

```js
const r = await fetch('https://api.monapay.vn/api/v1/client-webhooks', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.MONA_TOKEN}`, 'X-Client-Secret': process.env.MONA_SECRET },
  body: JSON.stringify({
    name: 'Web ban hang',
    webhook_url: 'https://shop.vn/webhook/monapay',
    auth_type: 'HMAC_SHA256',
    secret_key: process.env.MONA_WEBHOOK_SECRET, // cùng secret server nhận webhook dùng để verify
  }),
});
const { success, data, message } = await r.json();
if (!success) throw new Error(message);
console.log('config id', data.id);
```

## PUT /api/v1/client-webhooks/{config_id}

Sửa một phần, chỉ gửi trường cần đổi. Cần Bearer + `X-Client-Secret`.

```bash
curl -X PUT https://api.monapay.vn/api/v1/client-webhooks/0190e0f1-... \
  -H "Authorization: Bearer $MONA_TOKEN" -H "X-Client-Secret: $MONA_SECRET" \
  -H 'Content-Type: application/json' -d '{"is_active":false}'
```

## DELETE /api/v1/client-webhooks/{config_id}

Xoá cấu hình. Log cũ vẫn giữ để tra cứu.

```bash
curl -X DELETE https://api.monapay.vn/api/v1/client-webhooks/0190e0f1-... \
  -H "Authorization: Bearer $MONA_TOKEN" -H "X-Client-Secret: $MONA_SECRET"
```

## POST /api/v1/client-webhooks/test

Bắn 1 payload giả lập tới URL bất kỳ, không cần tạo cấu hình trước. Dùng để thử endpoint và code verify HMAC. Cần Bearer + `X-Client-Secret`.

| Trường | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| `webhook_url` | string | có | URL cần thử |
| `auth_type` | string | không, mặc định `NONE` | Thử đúng kiểu anh chị sẽ dùng |
| `secret_key` | string | khi auth khác NONE | |
| `api_key_name` | string | không | |
| `payload_format` | string | không | |
| `is_dummy` | boolean | không | Gửi payload giao dịch giả lập (nên đặt `true`) |

Payload giả lập MONA Pay gửi:

```json
{"amount":500000,"description":"DUMMY TRANSACTION MONAPAY","transfer_date":"11:05:00 28/08/2026","transaction_code":"DUMMY123","account_number":"1900636648","bank_name":"ACB","type":"income"}
```

Server anh chị nên nhận ra `transaction_code` = `DUMMY123` để không tạo đơn thật.

```bash
curl -X POST https://api.monapay.vn/api/v1/client-webhooks/test \
  -H "Authorization: Bearer $MONA_TOKEN" -H "X-Client-Secret: $MONA_SECRET" \
  -H 'Content-Type: application/json' \
  -d '{"webhook_url":"https://shop.vn/webhook/monapay","auth_type":"HMAC_SHA256","secret_key":"hmac-secret-dai-va-ngau-nhien","is_dummy":true}'
```

Response: `success` là `true` khi server anh chị trả 200/201/202 trong 10 giây; `false` kèm `message` mô tả lỗi (timeout, SSL, 4xx/5xx).

## GET /api/v1/webhook-logs

Lịch sử từng lần gửi, mới nhất trước. Cần Bearer.

| Tham số (query) | Kiểu | Ghi chú |
|---|---|---|
| `page` | integer ≥1 | mặc định 1 |
| `limit` | integer 1-100 | mặc định 20 |
| `status` | `success` / `failed` | `success` = mã 2xx |
| `from_date`, `to_date` | `YYYY-MM-DD` | Lọc theo ngày tạo (UTC) |

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
        "endpoint_url": "https://shop.vn/webhook/monapay",
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

`error_label` nhận một trong: `OK`, `HTTP_3XX`, `HTTP_4XX`, `HTTP_5XX`, `TIMEOUT`, `SSL`, `DNS`, `CONNECTION`, `ERROR`. `event_type` là `webhook` cho giao dịch thật, `test` cho lần gửi thử. Ý nghĩa từng nhãn và cách sửa ở [Gửi lại và xử lý lỗi](/docs/webhooks/gui-lai-va-xu-ly-loi).

## GET /api/v1/webhook-logs/stats

Thống kê theo số ngày gần nhất (tham số `days`, ví dụ 7 hoặc 30). Cần Bearer.

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

`p95_duration_ms` là thời gian server anh chị phản hồi ở phân vị 95; con số này vượt 5.000 là nên xem lại endpoint, vì MONA Pay cắt ở 10.000 ms.

## Lỗi thường gặp

| HTTP | Nguyên nhân | Cách xử lý |
|---|---|---|
| 401 | Token hết hạn hoặc thiếu `X-Client-Secret` ở POST/PUT/DELETE | Login lại, thêm header |
| 422 `auth_type` | Giá trị ngoài `NONE` / `API_KEY` / `HMAC_SHA256` | Viết hoa đúng |
| 422 `payload_format` | Ngoài 3 giá trị cho phép | Dùng `application/json` |
| `test` trả `success: false` | Server anh chị không phản hồi 2xx trong 10 giây, hoặc SSL/DNS lỗi | Đọc `message`, thử `curl` chính URL đó từ máy khác |
