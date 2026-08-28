---
title: "API keys: tạo, liệt kê, thu hồi X-Client-Secret"
description: "Sinh client_secret (hiện 1 lần duy nhất), liệt kê và thu hồi key. Secret gửi qua header X-Client-Secret cho mọi POST/PUT/DELETE."
updated: 28/08/2026
---

API key của MONA Pay là chuỗi `client_secret` sinh bằng `POST /api/v1/client-keys/generate`. Hệ thống chỉ hiện secret đúng 1 lần lúc tạo, sau đó lưu dạng băm nên không xem lại được. Anh chị gửi secret qua header `X-Client-Secret` ở mọi request POST, PUT, DELETE (kèm Bearer token). Mất secret thì tạo key mới rồi thu hồi key cũ, mỗi tài khoản tạo được nhiều key.

## Khi nào cần key

| Việc | Cần Bearer | Cần X-Client-Secret |
|---|---|---|
| Đăng ký, đăng nhập | không | không |
| Đọc dữ liệu (GET): giao dịch, VA, log webhook | có | không |
| Ghi dữ liệu (POST, PUT, DELETE): tạo VA, tạo QR, cấu hình webhook/Telegram, đổi mật khẩu | có | có |

Cách làm sạch: mỗi hệ thống tích hợp (web bán hàng, phần mềm kế toán, bot) dùng 1 key riêng, đặt tên theo hệ thống đó. Hệ thống nào bị lộ thì thu hồi đúng key đó, hệ thống khác không ảnh hưởng.

## POST /api/v1/client-keys/generate

Cần Bearer.

| Trường | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| `name` | string | không | Tên gợi nhớ, mặc định `Default Key` |

Response 200:

```json
{
  "success": true,
  "message": "Key generated successfully",
  "data": {
    "id": "0190a1b2-...",
    "client_id": "0190a0f0-...",
    "client_secret": "mps_...chuoi-bi-mat-chi-hien-1-lan",
    "name": "Web ban hang",
    "is_active": true,
    "created_at": "2026-08-28T10:30:00"
  }
}
```

Lưu `client_secret` ngay vào biến môi trường (`MONA_SECRET`). Đóng màn hình là không lấy lại được.

**cURL**

```bash
curl -X POST https://api.monapay.vn/api/v1/client-keys/generate \
  -H "Authorization: Bearer $MONA_TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"name":"Web ban hang"}'
```

**PHP**

```php
<?php
function monaPost(string $path, array $body, string $token, ?string $secret = null): array {
    $headers = "Content-Type: application/json\r\nAuthorization: Bearer $token\r\n";
    if ($secret) $headers .= "X-Client-Secret: $secret\r\n";
    $raw = file_get_contents('https://api.monapay.vn' . $path, false, stream_context_create([
        'http' => ['method' => 'POST', 'header' => $headers, 'content' => json_encode($body), 'ignore_errors' => true],
    ]));
    return json_decode($raw, true) ?? ['success' => false, 'message' => 'Không đọc được response'];
}

$res = monaPost('/api/v1/client-keys/generate', ['name' => 'Web ban hang'], getenv('MONA_TOKEN'));
$clientSecret = $res['data']['client_secret'] ?? null; // ghi vào .env, chỉ hiện 1 lần
```

**Node**

```js
const res = await fetch('https://api.monapay.vn/api/v1/client-keys/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.MONA_TOKEN}` },
  body: JSON.stringify({ name: 'Web ban hang' }),
});
const { success, data, message } = await res.json();
if (!success) throw new Error(message);
console.log('Ghi vào .env:', data.client_secret); // chỉ hiện 1 lần
```

## GET /api/v1/client-keys/list

Danh sách key của tài khoản, không kèm secret. Cần Bearer.

```bash
curl https://api.monapay.vn/api/v1/client-keys/list \
  -H "Authorization: Bearer $MONA_TOKEN"
```

```json
{
  "success": true,
  "message": "Keys retrieved",
  "data": [
    { "id": "0190a1b2-...", "client_id": "0190a0f0-...", "name": "Web ban hang", "is_active": true, "created_at": "2026-08-28T10:30:00" }
  ]
}
```

## DELETE /api/v1/client-keys/destroy/{key_id}

Thu hồi key. Cần Bearer. Request đang dùng secret của key này sẽ bị từ chối ngay sau khi thu hồi.

```bash
curl -X DELETE https://api.monapay.vn/api/v1/client-keys/destroy/0190a1b2-... \
  -H "Authorization: Bearer $MONA_TOKEN"
```

Response: `{"success": true, "message": "Key destroyed", "data": null}`. Key không tồn tại hoặc không thuộc tài khoản trả 404.

## Dùng secret trong request ghi

```bash
curl -X POST https://api.monapay.vn/api/v1/client-webhooks \
  -H "Authorization: Bearer $MONA_TOKEN" \
  -H "X-Client-Secret: $MONA_SECRET" \
  -H 'Content-Type: application/json' \
  -d '{"name":"Web ban hang","webhook_url":"https://shop.vn/webhook/monapay","auth_type":"HMAC_SHA256","secret_key":"hmac-cua-anh-chi"}'
```

Lưu ý phân biệt 2 loại secret: `client_secret` (X-Client-Secret) là để anh chị gọi API MONA Pay; `secret_key` trong cấu hình webhook là để MONA Pay ký payload gửi sang server anh chị (xem [Bảo mật webhook](/docs/webhooks/bao-mat)). Hai chuỗi này nên khác nhau.

<div class="callout warn">

**Trạng thái ép buộc (kiểm 28/08/2026):** máy chủ production hiện chưa từ chối lệnh ghi thiếu `X-Client-Secret`; bản cập nhật ép buộc đã viết xong, đang chờ đưa lên. Anh chị gửi header này ngay từ bây giờ để khi bật lên không phải sửa gì.

</div>

## Lỗi thường gặp

| HTTP | Nguyên nhân | Cách xử lý |
|---|---|---|
| 401 | Thiếu hoặc sai Bearer token | Login lại lấy token mới |
| 404 | `key_id` không tồn tại hoặc không thuộc tài khoản | Gọi `/client-keys/list` lấy đúng id |
| 422 | `key_id` không đúng định dạng UUID | Copy nguyên id từ danh sách |

Thao tác tạo và thu hồi key cũng làm được trên dashboard tại mục API Keys, có sẵn khối "copy prompt cho AI agent" để dán vào Claude Code, Codex hoặc Cursor.
