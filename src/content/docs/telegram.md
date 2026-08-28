---
title: "Thông báo biến động số dư qua Telegram: cấu hình bot MONA Pay"
description: "Nhận tin tiền vào ACB trong nhóm Telegram của công ty: thêm bot, lấy group_id, sửa mẫu tin với biến {{amount}}, {{transaction_content}}; API /telegram-configs."
updated: 28/08/2026
---

Kênh Telegram của MONA Pay gửi 1 tin nhắn vào nhóm Telegram của anh chị mỗi khi tài khoản ACB (hoặc VA đã chọn) có tiền vào, không cần viết dòng code nào. Thiết lập trong dashboard mục Telegram gồm 3 việc: thêm bot MONA Pay vào nhóm, dán `group_id` của nhóm (thêm `topic_id` nếu nhóm chia chủ đề), bấm "Gửi thử" để thấy tin đầu tiên. Mẫu tin sửa được bằng các biến như `{{amount}}`, `{{transaction_content}}`. Kế toán, chủ shop, nhân viên giao hàng đều thấy tiền về cùng lúc, thay cho việc một người ôm điện thoại canh app ngân hàng rồi nhắn lại cho cả nhóm.

## Thiết lập trong dashboard (không cần code)

1. **Tạo nhóm Telegram** (hoặc dùng nhóm sẵn có của công ty). Thêm bot MONA Pay vào nhóm với quyền gửi tin nhắn; tên bot hiển thị ngay trong dashboard, mục Telegram.
2. **Lấy `group_id`**: mở nhóm trên web.telegram.org, ID nhóm là dãy số trong địa chỉ (nhóm thường bắt đầu bằng dấu trừ, ví dụ `-1001234567890`); hoặc dùng một bot lấy ID bất kỳ. Nhóm bật "Chủ đề" thì lấy thêm `topic_id` (số ở cuối đường dẫn của chủ đề) để tin rơi đúng chủ đề.
3. **Tạo cấu hình** trong dashboard: đặt tên, dán `group_id` (+ `topic_id`), chọn nhận cho mọi tài khoản hay chỉ 1 VA, giữ mẫu tin mặc định hoặc sửa.
4. **Gửi thử**: nút "Gửi thử" có 2 kiểu, tin xác nhận kết nối và tin giao dịch giả lập theo đúng mẫu đã đặt. Thấy tin trong nhóm là xong.

Một tài khoản tạo được nhiều cấu hình: nhóm kế toán nhận mọi giao dịch, nhóm bán hàng chỉ nhận VA của cửa hàng đó.

## Mẫu tin nhắn

Mẫu mặc định (Telegram hiểu thẻ `<b>` in đậm):

```
💰 <b>Biến động số dư</b>

Tên ngân hàng: {{bank_name}}
STK: {{account_number}}
Loại giao dịch: tiền {{vao_hay_ra}}
Số tiền: {{cong_hay_tru}}{{amount}}đ
Thời gian: {{transaction_date}}
Nội dung: {{transaction_content}}
```

| Biến | Giá trị khi gửi |
|---|---|
| `{{bank_name}}` | `ACB` |
| `{{account_number}}` | Số VA khớp giao dịch, hoặc số tài khoản nhận |
| `{{vao_hay_ra}}` | `VÀO` với tiền vào, `RA` với tiền ra |
| `{{cong_hay_tru}}` | `+` hoặc `-` |
| `{{amount}}` | Số tiền định dạng có dấu chấm, ví dụ `2.500.000` |
| `{{transaction_date}}` | Thời điểm giao dịch |
| `{{transaction_content}}` | Nội dung chuyển khoản |
| `{{accumulated}}` | Số dư sau giao dịch nếu ngân hàng gửi kèm |

Mẫu gọn cho nhóm bán hàng:

```
✅ +{{amount}}đ vào {{account_number}}
{{transaction_content}} · {{transaction_date}}
```

## API /api/v1/telegram-configs

Mọi request cần `Authorization: Bearer`; POST/PUT/DELETE thêm `X-Client-Secret` (xem [Xác thực](/docs/api/xac-thuc)).

| Endpoint | Việc |
|---|---|
| `GET /api/v1/telegram-configs` | Danh sách cấu hình |
| `POST /api/v1/telegram-configs` | Tạo cấu hình |
| `PUT /api/v1/telegram-configs/{config_id}` | Sửa (gửi trường cần đổi, có `is_active` để tắt tạm) |
| `DELETE /api/v1/telegram-configs/{config_id}` | Xoá |
| `POST /api/v1/telegram-configs/test` | Gửi thử vào nhóm |

Trường khi tạo:

| Trường | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| `group_id` | string | có | ID nhóm Telegram |
| `friendly_name` | string | có | Tên gợi nhớ |
| `message_template` | string | có | Mẫu tin, dùng biến ở bảng trên |
| `virtual_account_id` | uuid | không | Chỉ nhận giao dịch của VA này; bỏ trống = mọi tài khoản |
| `topic_id` | string | không | Chủ đề trong nhóm |

**cURL: tạo cấu hình**

```bash
curl -X POST https://api.monapay.vn/api/v1/telegram-configs \
  -H "Authorization: Bearer $MONA_TOKEN" -H "X-Client-Secret: $MONA_SECRET" \
  -H 'Content-Type: application/json' \
  -d '{"group_id":"-1001234567890","friendly_name":"Nhom ke toan","message_template":"✅ +{{amount}}đ vào {{account_number}}\n{{transaction_content}} · {{transaction_date}}"}'
```

**cURL: gửi thử giao dịch giả lập**

```bash
curl -X POST https://api.monapay.vn/api/v1/telegram-configs/test \
  -H "Authorization: Bearer $MONA_TOKEN" -H "X-Client-Secret: $MONA_SECRET" \
  -H 'Content-Type: application/json' \
  -d '{"group_id":"-1001234567890","is_dummy":true}'
```

`is_dummy: false` gửi tin "Kết nối thành công" để kiểm tra bot đã vào nhóm; `true` gửi tin giao dịch giả theo `message_template` (bỏ trống thì dùng mẫu mặc định).

**PHP**

```php
<?php
$body = [
    'group_id' => '-1001234567890',
    'friendly_name' => 'Nhom ke toan',
    'message_template' => "✅ +{{amount}}đ vào {{account_number}}\n{{transaction_content}} · {{transaction_date}}",
];
$ch = curl_init('https://api.monapay.vn/api/v1/telegram-configs');
curl_setopt_array($ch, [
    CURLOPT_POST => true, CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => ['Content-Type: application/json', 'Authorization: Bearer ' . getenv('MONA_TOKEN'), 'X-Client-Secret: ' . getenv('MONA_SECRET')],
    CURLOPT_POSTFIELDS => json_encode($body, JSON_UNESCAPED_UNICODE),
]);
$res = json_decode(curl_exec($ch), true);
curl_close($ch);
if (empty($res['success'])) throw new RuntimeException($res['message'] ?? 'Tạo cấu hình Telegram thất bại');
```

**Node**

```js
const r = await fetch('https://api.monapay.vn/api/v1/telegram-configs', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.MONA_TOKEN}`, 'X-Client-Secret': process.env.MONA_SECRET },
  body: JSON.stringify({
    group_id: '-1001234567890',
    friendly_name: 'Nhom ke toan',
    message_template: '✅ +{{amount}}đ vào {{account_number}}\n{{transaction_content}} · {{transaction_date}}',
  }),
});
const { success, message } = await r.json();
if (!success) throw new Error(message);
```

## Gửi lại một giao dịch

Tin không tới (nhóm đổi ID, bot bị kick rồi thêm lại) thì gửi lại từ dashboard mục Giao dịch, hoặc gọi `POST /api/v1/acb/virtual-account/transactions/{transaction_id}/retry` với `{"target_type":"TELEGRAM"}` (xem [Giao dịch](/docs/api/giao-dich)).

## Lỗi thường gặp

| Tình huống | Nguyên nhân | Cách xử lý |
|---|---|---|
| Gửi thử báo lỗi, không có tin | Bot chưa được thêm vào nhóm, hoặc `group_id` sai (thiếu dấu trừ, thiếu `100` đầu) | Thêm bot vào nhóm, copy lại ID từ web.telegram.org |
| Tin rơi vào chủ đề "General" thay vì chủ đề mong muốn | Thiếu `topic_id` | Thêm `topic_id` vào cấu hình |
| Có webhook nhưng không có tin Telegram | Cấu hình gắn VA khác, hoặc `is_active` đang tắt | Kiểm tra lại VA và trạng thái cấu hình |
| Tin hiện thẻ `<b>` thô | Mẫu dùng thẻ Telegram không hỗ trợ | Chỉ dùng `<b>`, `<i>`, `<code>` |
