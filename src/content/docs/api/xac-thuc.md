---
title: "Xác thực API ngân hàng MONA Pay: Bearer token và X-Client-Secret"
description: "Đăng nhập lấy Bearer token (hạn 24 giờ), kèm X-Client-Secret cho POST/PUT/DELETE. Envelope success/message/data, mã lỗi 401/422 và code mẫu cURL, PHP, Node."
updated: 28/08/2026
---

Mọi lệnh gọi API MONA Pay cần header `Authorization: Bearer <access_token>`. Token lấy từ `POST /api/v1/client/login` bằng username và mật khẩu của tài khoản my.monapay.vn, hạn dùng 86.400 giây (24 giờ). Các lệnh ghi dữ liệu (POST, PUT, DELETE) gửi thêm header `X-Client-Secret` với secret sinh ở mục [API keys](/docs/api/api-keys). Mọi response đều bọc trong một khung chung `{"success": true, "message": "...", "data": ...}`.

## Base URL

| Môi trường | URL |
|---|---|
| Production | `https://api.monapay.vn` |
| Alias cũ (vẫn chạy, cho tích hợp trước 2026) | `https://ipn.mona.host` |

Tài khoản đăng ký xong dùng được ngay: đăng nhập, tạo API key, không cần ai duyệt. Sandbox tách riêng (dữ liệu giả lập, không đụng ngân hàng thật) đang triển khai.

## Khung response chung

Mọi endpoint trả về cùng một khung, kể cả khi lỗi:

```json
{
  "success": true,
  "message": "Success",
  "data": { }
}
```

| Trường | Kiểu | Ý nghĩa |
|---|---|---|
| `success` | boolean | `true` khi xử lý xong, `false` khi lỗi nghiệp vụ |
| `message` | string | Thông điệp ngắn để log |
| `data` | object / array / null | Dữ liệu trả về, `null` nếu không có |

Lỗi validate (thiếu trường, sai kiểu) trả HTTP 422 theo chuẩn FastAPI với `detail[]` liệt kê từng trường sai.

## Hai lớp xác thực

| Lớp | Header | Dùng khi | Lấy ở đâu |
|---|---|---|---|
| Bearer token | `Authorization: Bearer <access_token>` | Mọi request (trừ đăng ký, đăng nhập) | `POST /api/v1/client/login` |
| Client secret | `X-Client-Secret: <client_secret>` | POST, PUT, DELETE | `POST /api/v1/client-keys/generate` |

Giữ token và secret ở biến môi trường, không ghi cứng trong code, không commit lên git.

## POST /api/v1/client/register-client

Tạo tài khoản mới. Không cần xác thực. Tài khoản tạo xong dùng được ngay, đăng nhập liền không cần duyệt. Đăng ký qua form tại [my.monapay.vn/auth](https://my.monapay.vn/auth) (tab Đăng ký) cũng đi qua đúng endpoint này.

| Trường | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| `username` | string (1-255) | có | Tên đăng nhập, dùng để login |
| `password` | string (1-255) | có | Mật khẩu |
| `name` | string (1-255) | có | Tên doanh nghiệp / tên hiển thị |

```bash
curl -X POST https://api.monapay.vn/api/v1/client/register-client \
  -H 'Content-Type: application/json' \
  -d '{"username":"shopabc","password":"MatKhauManh#2026","name":"Shop ABC"}'
```

Response 200/201:

```json
{ "success": true, "message": "Client registered successfully", "data": {} }
```

## POST /api/v1/client/login

Đổi username + mật khẩu lấy `access_token`. Không cần xác thực.

| Trường | Kiểu | Bắt buộc |
|---|---|---|
| `username` | string | có |
| `password` | string | có |

Response 200:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "access_token": "Zx9...64-ky-tu-url-safe",
    "expires_in": 86400,
    "token_type": "Bearer"
  }
}
```

`expires_in` tính bằng giây. Hết hạn thì gọi login lại, không có refresh token. Nếu tài khoản bật 2FA trong dashboard, bước đăng nhập trên web sẽ hỏi thêm mã OTP; gọi API trực tiếp thì dùng tài khoản chưa bật 2FA hoặc liên hệ tụi em.

**cURL**

```bash
curl -X POST https://api.monapay.vn/api/v1/client/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"shopabc","password":"MatKhauManh#2026"}'
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
    throw new RuntimeException('Đăng nhập MONA Pay thất bại: ' . ($res['message'] ?? 'không rõ'));
}
$accessToken = $res['data']['access_token']; // lưu lại, dùng 24 giờ
```

**Node**

```js
const res = await fetch('https://api.monapay.vn/api/v1/client/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: process.env.MONA_USER, password: process.env.MONA_PASS }),
});
const json = await res.json();
if (!json.success) throw new Error('Đăng nhập MONA Pay thất bại: ' + json.message);
const accessToken = json.data.access_token; // lưu lại, dùng 24 giờ
```

## GET /api/v1/client/me

Thông tin tài khoản đang đăng nhập. Cần Bearer.

```bash
curl https://api.monapay.vn/api/v1/client/me \
  -H "Authorization: Bearer $MONA_TOKEN"
```

Response: `data` gồm thông tin client (id, username, name, trạng thái kích hoạt, thời điểm tạo).

## PUT /api/v1/client/change-password

Đổi mật khẩu của chính mình. Cần Bearer + `X-Client-Secret`.

| Trường | Kiểu | Bắt buộc |
|---|---|---|
| `old_password` | string | có |
| `new_password` | string | có |

```bash
curl -X PUT https://api.monapay.vn/api/v1/client/change-password \
  -H "Authorization: Bearer $MONA_TOKEN" \
  -H "X-Client-Secret: $MONA_SECRET" \
  -H 'Content-Type: application/json' \
  -d '{"old_password":"MatKhauManh#2026","new_password":"MatKhauMoi#2026"}'
```

<div class="callout warn">

**Trạng thái ép buộc (kiểm 28/08/2026):** máy chủ production hiện chưa từ chối lệnh ghi thiếu `X-Client-Secret`; bản cập nhật ép buộc đã viết xong, đang chờ đưa lên. Anh chị gửi header này ngay từ bây giờ để khi bật lên không phải sửa gì.

</div>

Đổi mật khẩu xong thì token cũ vẫn dùng được tới khi hết hạn; muốn cắt ngay thì đăng nhập lại và thu hồi key ở mục API keys.

## Lỗi thường gặp

| HTTP | Nguyên nhân | Cách xử lý |
|---|---|---|
| 401 | Sai username/mật khẩu hoặc token hết hạn | Kiểm tra lại thông tin (tài khoản mới đăng nhập được ngay, không có bước chờ duyệt); token hết hạn thì login lại |
| 401 `Authorization scheme must be Bearer` | Header sai định dạng | Đúng dạng `Authorization: Bearer <token>`, có khoảng trắng sau chữ Bearer |
| 422 | Thiếu trường bắt buộc hoặc sai kiểu | Đọc `detail[]` trong body, sửa đúng tên trường |
| 500 | Lỗi phía MONA Pay | Thử lại sau vài giây; lặp lại thì báo tụi em kèm `message` |

## Bước tiếp theo

1. [Tạo API key](/docs/api/api-keys) để có `X-Client-Secret`.
2. [Nối tài khoản ACB, tạo tài khoản ảo](/docs/api/tai-khoan-ao-va).
3. [Cấu hình webhook](/docs/api/webhook-configs) để nhận thông báo tiền vào.
