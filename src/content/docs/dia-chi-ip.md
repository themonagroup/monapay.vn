---
title: "Địa chỉ IP của MONA Pay"
description: "IP máy chủ MONA Pay gửi webhook là 103.168.55.14 (kiểm 28/08/2026). Cách whitelist trên nginx, ufw, Cloudflare và vì sao vẫn phải verify chữ ký HMAC."
updated: 28/08/2026
---

Webhook của MONA Pay đi ra từ địa chỉ IP `103.168.55.14` (máy chủ `api.monapay.vn`, alias `ipn.mona.host`), kiểm ngày 28/08/2026. Nếu firewall của anh chị chỉ cho một số IP gọi vào endpoint webhook, thêm địa chỉ này vào danh sách cho phép. Có thay đổi, tụi em cập nhật tại chính trang này và báo trước qua email tài khoản; nên đọc lại trang này hoặc bản [dia-chi-ip.md](/docs/dia-chi-ip.md) mỗi khi log webhook hiện nhãn `CONNECTION`.

## Danh sách IP

| Mục đích | IP | Ghi chú |
|---|---|---|
| Gửi webhook tới server anh chị | `103.168.55.14` | IPv4, cả webhook thật lẫn gửi thử |
| API `api.monapay.vn` (anh chị gọi vào) | `103.168.55.14` | Không cần whitelist chiều ra trừ khi server anh chị chặn outbound |

## Whitelist vẫn phải kèm verify chữ ký

Chặn theo IP giúp giảm rác nhưng không thay được xác thực: ai đứng sau proxy hoặc giả header `X-Forwarded-For` vẫn có thể lọt nếu server anh chị tin header đó. Luôn bật `HMAC_SHA256` và kiểm `X-Mona-Signature` + `X-Mona-Timestamp` theo [Bảo mật webhook](/docs/webhooks/bao-mat). Whitelist IP là lớp thứ hai, không phải lớp duy nhất.

## Cấu hình mẫu

**nginx**: chỉ cho IP MONA Pay vào đường dẫn webhook

```nginx
location = /webhook/monapay {
    allow 103.168.55.14;
    deny all;
    proxy_pass http://127.0.0.1:3000;
}
```

**ufw** (server chỉ mở webhook cho MONA Pay, nhưng cổng 443 thường phục vụ cả website nên cách này ít dùng; ưu tiên chặn ở nginx như trên):

```bash
sudo ufw allow from 103.168.55.14 to any port 443 proto tcp
```

**Cloudflare WAF**: nếu website đi qua Cloudflare, tạo rule "URI Path equals /webhook/monapay AND IP Source Address is not in {103.168.55.14} → Block". Nhớ tắt các tính năng thử thách (JS challenge, Bot Fight Mode) cho đường dẫn webhook, vì MONA Pay là máy gọi, không vượt được thử thách trình duyệt; log sẽ hiện `HTTP_4XX` hoặc `HTTP_5XX` nếu quên.

**PHP**: kiểm IP ở tầng ứng dụng (khi không sửa được nginx)

```php
<?php
$allowed = ['103.168.55.14'];
$ip = $_SERVER['REMOTE_ADDR'] ?? '';
// Nếu server đứng sau proxy tin cậy (Cloudflare), đọc CF-Connecting-IP thay vì X-Forwarded-For
if (!in_array($ip, $allowed, true)) {
    http_response_code(403);
    exit('IP khong duoc phep');
}
```

**Node (Express)**

```js
const ALLOWED = new Set(['103.168.55.14']);
app.post('/webhook/monapay', (req, res, next) => {
  const ip = req.ip.replace('::ffff:', ''); // app.set('trust proxy', ...) nếu sau Cloudflare/nginx
  if (!ALLOWED.has(ip)) return res.status(403).send('IP khong duoc phep');
  next();
});
```

## Kiểm tra nhanh

Xem địa chỉ MONA Pay đang phân giải về đâu:

```bash
dig +short api.monapay.vn
dig +short ipn.mona.host
```

Cả hai trả `103.168.55.14` là đúng bản hiện hành. Gửi thử bằng `POST /api/v1/client-webhooks/test` rồi đọc `request_headers`, `status_code` trong `GET /api/v1/webhook-logs` để chắc firewall đã mở.

## Lỗi thường gặp

| Nhãn trong log | Nguyên nhân liên quan IP | Cách xử lý |
|---|---|---|
| `CONNECTION` | Firewall server anh chị chặn kết nối từ `103.168.55.14` | Thêm IP vào allowlist, kiểm `ufw status`, security group |
| `HTTP_4XX` (403) | Rule allow/deny hoặc WAF chặn | Kiểm lại rule, tắt challenge cho đường dẫn webhook |
| `TIMEOUT` | Firewall drop gói thay vì từ chối | Sửa rule thành cho phép; MONA Pay chờ tối đa 10 giây |
