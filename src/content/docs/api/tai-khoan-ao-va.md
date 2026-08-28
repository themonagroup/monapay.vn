---
title: "Tài khoản ngân hàng ảo (virtual account) ACB: tạo VA qua API"
description: "Đăng ký VA ACB 4 bước qua API: gửi yêu cầu, xác thực OTP, đăng ký nhận thông báo, xác thực OTP lần 2. Kèm truy vấn, hủy VA và code mẫu cURL, PHP, Node."
updated: 28/08/2026
---

Tài khoản ảo (VA) là số tài khoản phụ do ACB cấp dưới tài khoản thật của anh chị, theo đầu số (prefix) đã đăng ký. Tiền chuyển vào VA vẫn nằm trong tài khoản ACB thật, nhưng mỗi VA gắn được với 1 đơn hàng hoặc 1 khách nên MONA Pay khớp tiền tự động, không cần đọc nội dung chuyển khoản. Tạo VA qua API gồm 4 bước: gửi yêu cầu đăng ký, nhập OTP ACB gửi về số điện thoại, đăng ký nhận thông báo giao dịch, nhập OTP lần 2. Điều kiện: tài khoản ACB đứng tên anh chị và số điện thoại đang đăng ký với ACB.

Anh chị không muốn gọi API thì dashboard my.monapay.vn có sẵn wizard 4 bước y hệt, tại mục Ngân hàng & VA.

## Luồng 4 bước

| Bước | Endpoint | Ai làm gì |
|---|---|---|
| 1 | `POST /api/v1/acb/virtual-account/registration` | Gửi số tài khoản, số điện thoại, đầu số VA. ACB nhận yêu cầu, gửi OTP về điện thoại |
| 2 | `POST /api/v1/acb/{acb_request_id}/virtual-account/verification` | Nhập OTP. ACB tạo VA, trả số VA |
| 3 | `POST /api/v1/acb/{virtual_account_id}/notification/registration` | Đăng ký nhận thông báo giao dịch tức thì. ACB gửi OTP lần 2 |
| 4 | `POST /api/v1/acb/{acb_request_id}/notification/verification` | Nhập OTP lần 2. Từ đây tiền vào là có thông báo về MONA Pay |

Bỏ bước 3 và 4 thì VA có tồn tại nhưng ACB không báo giao dịch về, webhook và Telegram sẽ im lặng. Đây là lỗi tụi em gặp nhiều nhất khi khách tự làm.

Mọi request dưới đây cần `Authorization: Bearer` và `X-Client-Secret` (xem [Xác thực](/docs/api/xac-thuc)).

## Bước 1: POST /api/v1/acb/virtual-account/registration

| Trường | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| `bank_account_id` | uuid | không | Dùng khi tài khoản ACB đã nối trước đó (lấy từ `GET /api/v1/client/bank-accounts`). Có trường này thì bỏ `account_number`, `phone_number` |
| `customer_type` | string | không | Loại khách hàng theo mã ACB, ví dụ `PERS` cho cá nhân |
| `account_number` | integer | không | Số tài khoản thanh toán ACB (số thật) |
| `phone_number` | string | không | Số điện thoại đăng ký với ACB, nhận OTP |
| `virtual_account_info.virtual_account_prefix_code` | string | có | Đầu số VA đã đăng ký với ACB |
| `virtual_account_info.virtual_account_content` | string | không | Nội dung định danh gắn với VA (mã đơn, mã khách) |
| `virtual_account_info.virtual_account_explain` | string | không | Diễn giải khi đăng ký |
| `virtual_account_info.beneficiary_name_rule` | integer | không | Cách hiển thị tên đơn vị hưởng theo quy ước ACB |
| `user_agreement` | boolean | không | Khách đồng ý điều khoản dịch vụ, nên gửi `true` |

Body mẫu (lần đầu, chưa có bank_account_id):

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

Response 200: `data` là tài khoản ngân hàng vừa ghi nhận, kèm `acb_request` chứa `id` cần cho bước 2.

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

## Bước 2: POST /api/v1/acb/{acb_request_id}/virtual-account/verification

| Trường | Kiểu | Bắt buộc |
|---|---|---|
| `code` | string | có, là OTP ACB gửi về điện thoại |

```bash
curl -X POST https://api.monapay.vn/api/v1/acb/0190b0c2-.../virtual-account/verification \
  -H "Authorization: Bearer $MONA_TOKEN" -H "X-Client-Secret: $MONA_SECRET" \
  -H 'Content-Type: application/json' -d '{"code":"123456"}'
```

Response 200: `data` là VA vừa tạo.

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

`virtual_account_number` là số anh chị đưa cho khách chuyển tiền (hoặc đưa vào QR). `id` dùng cho bước 3.

## Bước 3: POST /api/v1/acb/{virtual_account_id}/notification/registration

| Trường | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| `receive_noti_realtime` | boolean | có | `true` = báo ngay từng giao dịch (cần cho webhook). `false` = ACB gộp báo cuối ngày |
| `username` | string (≤50) | không | Thông tin đăng nhập theo yêu cầu ACB, để trống nếu không được ACB yêu cầu |

```bash
curl -X POST https://api.monapay.vn/api/v1/acb/0190b0c3-.../notification/registration \
  -H "Authorization: Bearer $MONA_TOKEN" -H "X-Client-Secret: $MONA_SECRET" \
  -H 'Content-Type: application/json' -d '{"receive_noti_realtime":true}'
```

Response 200/201: `data` chứa `acb_request.id` cho bước 4.

## Bước 4: POST /api/v1/acb/{acb_request_id}/notification/verification

Body `{"code": "<OTP lần 2>"}`, giống bước 2. Thành công là xong: từ giao dịch kế tiếp, ACB báo về MONA Pay, MONA Pay bắn [webhook](/docs/webhooks/tich-hop-webhook) hoặc [Telegram](/docs/telegram) theo cấu hình của anh chị.

## Ví dụ PHP: chạy trọn bước 1 và 2

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
    if (empty($res['success'])) throw new RuntimeException($res['message'] ?? 'Lỗi không rõ');
    return $res['data'];
}

// Bước 1: gửi yêu cầu, ACB gửi OTP về điện thoại
$reg = call("$base/api/v1/acb/virtual-account/registration", $headers, [
    'customer_type' => 'PERS', 'account_number' => 123456789, 'phone_number' => '0901234567',
    'virtual_account_info' => ['virtual_account_prefix_code' => 'MONA', 'virtual_account_content' => 'DH10234'],
    'user_agreement' => true,
]);
$requestId = $reg['acb_request']['id'];

// Bước 2: nhập OTP (đọc từ form của anh chị)
$va = call("$base/api/v1/acb/$requestId/virtual-account/verification", $headers, ['code' => $_POST['otp']]);
echo 'Số VA: ' . $va['virtual_account_number'];
```

## Ví dụ Node: bước 3 và 4

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

// Bước 3: đăng ký nhận thông báo tức thì, ACB gửi OTP lần 2
const noti = await call(`/api/v1/acb/${vaId}/notification/registration`, { receive_noti_realtime: true });
// Bước 4: xác thực OTP lần 2
await call(`/api/v1/acb/${noti.acb_request.id}/notification/verification`, { code: otpLan2 });
```

## Truy vấn và quản lý

| Endpoint | Việc |
|---|---|
| `GET /api/v1/client/bank-accounts?page=1&limit=10` | Danh sách tài khoản ACB đã nối (lấy `bank_account_id`) |
| `GET /api/v1/acb/{bank_account_id}/virtual-account/retrieve?virtual_account_number=&page=1&limit=10` | Danh sách VA của một tài khoản, lọc theo số VA, `limit` tối đa 100 |
| `GET /api/v1/acb/{virtual_account_id}/notification/details` | Xem đăng ký thông báo của VA |
| `POST /api/v1/acb/{acb_notification_id}/notification/modification` | Đổi kiểu nhận thông báo (body như bước 3), cần OTP xác thực lại qua bước 4 |
| `POST /api/v1/acb/{acb_notification_id}/notification/delete` | Hủy nhận thông báo |
| `POST /api/v1/acb/{virtual_account_id}/virtual-account/delete` | Hủy VA, không có body. ACB có thể yêu cầu OTP xác thực qua endpoint verification |

## Lỗi thường gặp

| Tình huống | Nguyên nhân | Cách xử lý |
|---|---|---|
| 400 sau bước 1 | Số tài khoản không phải ACB, sai số điện thoại đăng ký với ACB, hoặc đầu số VA chưa được ACB cấp | Kiểm tra lại với ACB; đầu số VA cần đăng ký trước với ACB |
| 400 `code` sai ở bước 2/4 | OTP nhập sai hoặc hết hạn | Làm lại bước trước để ACB gửi OTP mới |
| VA tạo xong nhưng không thấy giao dịch | Chưa làm bước 3 và 4 | Gọi `notification/registration` rồi xác thực OTP lần 2 |
| 401 | Token hết hạn hoặc thiếu X-Client-Secret | Login lại, kiểm tra header |
| 422 | Thiếu `virtual_account_info.virtual_account_prefix_code` | Trường này bắt buộc |
