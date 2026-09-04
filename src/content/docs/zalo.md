---
title: "Báo tiền vào nhóm Zalo"
description: "Đội bán hàng nhận tin tiền vào ngay trong nhóm Zalo qua bot Gấu Mona, không cần Zalo OA, ứng dụng ngân hàng hay viết code."
updated: 04/09/2026
---

Chủ shop không cần mở ứng dụng ngân hàng rồi báo lại cho từng người. Khi tài khoản hoặc VA đã chọn có tiền vào, MONA Pay gửi ngay 1 tin vào nhóm Zalo để đội bán hàng, thu ngân và kế toán cùng thấy. Cách này không cần Zalo OA, không cần cài thêm ứng dụng và không cần viết code.

MONA Pay gửi tin qua **bot Gấu Mona của MONA** đang có mặt trong nhóm. Vì vậy, nhóm muốn nhận tin phải có bot Gấu Mona trước khi anh chị tạo cấu hình.

## Điều kiện trước khi kết nối

- **Anh chị là khách hàng MONA:** nhờ Account phụ trách thêm bot Gấu Mona vào nhóm. Account lấy `group_id` trong PMS tại dự án → kết nối Zalo → `chatId`, hoặc nhờ đội MONA tra theo tên nhóm.
- **Anh chị chưa là khách hàng MONA:** hiện chưa thể tự thêm bot. Gọi **1900 636 648** để MONA nối nhóm Zalo và cung cấp `group_id`.
- `group_id` phải là chuỗi từ 10 đến 25 chữ số, ví dụ `7119000000000000000`.

Không gửi mã đăng nhập, OTP ngân hàng hoặc mật khẩu vào nhóm Zalo.

## Thiết lập trên dashboard trong 3 bước

1. Vào [my.monapay.vn](https://my.monapay.vn), mở mục **Zalo** rồi chọn **Thêm nhóm**.
2. Đặt tên gợi nhớ, dán `group_id`, chọn VA và sự kiện nếu cần, sau đó lưu cấu hình.
3. Bấm **Gửi thử**. Nhóm nhận tin “🐼 MONA Pay đã nối nhóm này…” là kết nối đã chạy.

Anh chị có thể nối nhiều nhóm. Ví dụ, nhóm bán hàng chỉ nhận tiền vào một VA, còn nhóm kế toán nhận mọi giao dịch.

<figure class="photo">
  <picture>
    <source srcset="/img/dashboard/zalo.avif" type="image/avif" />
    <source srcset="/img/dashboard/zalo.webp" type="image/webp" />
    <img src="/img/dashboard/zalo.png" width="1280" height="860" loading="lazy" decoding="async" alt="Dashboard MONA Pay thêm nhóm Zalo test monapay và chọn sự kiện Tiền vào, Checkout, Webhook lỗi" />
  </picture>
  <figcaption>Nhóm Zalo test monapay đã được nối và chọn ba sự kiện cần báo, ảnh chụp từ dashboard my.monapay.vn.</figcaption>
</figure>

## Mẫu tin và biến

Tin mặc định cho một giao dịch tiền vào có dạng:

```text
💰 +2.500.000đ vào TK 123456789
ND: THANH TOAN DH10234
Mã GD: FT26240001234
10:30:00 03/09/2026
- MONA Pay
```

Khi sửa mẫu tin, anh chị dùng được dạng `{amount}` hoặc `{{amount}}`. Các biến được hỗ trợ:

| Biến | Nội dung |
|---|---|
| `{amount}` | Số tiền giao dịch |
| `{description}` | Nội dung chuyển khoản |
| `{virtual_account_number}` | Số tài khoản ảo nhận tiền |
| `{transaction_code}` | Mã giao dịch dùng để đối soát |
| `{transfer_date}` | Thời điểm giao dịch |

Ví dụ mẫu gọn cho nhóm bán hàng:

```text
💰 Đã nhận {amount}đ
VA: {virtual_account_number}
Nội dung: {description}
Mã giao dịch: {transaction_code}
Thời gian: {transfer_date}
```

## Sự kiện có thể nhận

| Sự kiện | Khi nào MONA Pay gửi |
|---|---|
| `TRANSACTION_IN` | VA thật hoặc VA sandbox có tiền vào; giao dịch sandbox có tiền tố `[THỬ]` |
| `CHECKOUT_PAID` | Một phiên trang thanh toán đã được trả đủ |
| `WEBHOOK_FAILED` | Webhook gửi thất bại |
| `VA_CREATED` | Một tài khoản ảo mới được tạo |

Nếu không truyền `events` khi gọi API, cấu hình nhận `TRANSACTION_IN` theo hợp đồng API.

## Giới hạn cần biết

- Zalo không phân tích Markdown. Dấu `**`, thẻ HTML và cú pháp tạo liên kết sẽ hiện như text thường.
- Kênh này chỉ gửi vào nhóm đã có bot Gấu Mona, không gửi tin nhắn riêng cho tài khoản Zalo.
- MONA Pay gửi tối đa 1 tin cho mỗi giao dịch trên mỗi cấu hình và chống gửi trùng theo mã giao dịch.
- Không dùng kênh để quảng cáo, gửi hàng loạt hoặc spam thành viên trong nhóm.

## API nhóm Zalo

Mọi request cần `Authorization: Bearer <token>`. Lệnh ghi bằng token dashboard cần thêm `X-Client-Secret`. Response dùng envelope chung `{"success":true,"message":"...","data":...}`.

| Endpoint | Việc |
|---|---|
| `GET /api/v1/zalo-groups` | Liệt kê cấu hình nhóm |
| `POST /api/v1/zalo-groups` | Tạo cấu hình; `group_id` phải có 10 đến 25 chữ số |
| `PUT /api/v1/zalo-groups/{id}` | Cập nhật cấu hình theo ID cấu hình |
| `DELETE /api/v1/zalo-groups/{id}` | Xoá cấu hình |
| `POST /api/v1/zalo-groups/{id}/test` | Gửi tin xác nhận kết nối |
| `GET /api/v1/zalo-groups/logs?limit=20&status=ok|failed` | Xem log gửi và lọc theo trạng thái |

`POST` trả `503 Kênh Zalo chưa mở` nếu máy chủ chưa bật relay. `group_id` sai định dạng trả 422. Gửi thử thất bại thường có lý do kèm nhắc nhóm phải có bot Gấu Mona.

**cURL: tạo cấu hình**

```bash
curl -X POST https://api.monapay.vn/api/v1/zalo-groups \
  -H "Authorization: Bearer $MONA_TOKEN" \
  -H "X-Client-Secret: $MONA_SECRET" \
  -H 'Content-Type: application/json' \
  -d '{"group_id":"7119000000000000000","friendly_name":"Nhom ban hang","events":["TRANSACTION_IN"],"is_active":true}'
```

Lấy `data.id` trong response rồi dùng ID đó để gửi thử:

```bash
curl -X POST https://api.monapay.vn/api/v1/zalo-groups/CONFIG_ID/test \
  -H "Authorization: Bearer $MONA_TOKEN" \
  -H "X-Client-Secret: $MONA_SECRET"
```

## 6 công cụ MCP cho nhóm Zalo

Sau khi cài `monapay-mcp`, agent có thể quản lý trọn luồng bằng 6 công cụ:

| Công cụ | Việc |
|---|---|
| `monapay_list_zalo_groups` | Liệt kê nhóm đã nối |
| `monapay_create_zalo_group` | Tạo cấu hình nhóm |
| `monapay_update_zalo_group` | Sửa tên, nhóm, VA, mẫu tin, sự kiện hoặc trạng thái |
| `monapay_delete_zalo_group` | Xoá cấu hình |
| `monapay_test_zalo_group` | Gửi tin thử |
| `monapay_zalo_group_logs` | Đọc log `ok` hoặc `failed` |

Prompt mẫu, thay phần `7119…` bằng `group_id` thật do MONA cung cấp:

```text
Nối nhóm Zalo group_id 7119… cho MONA Pay và gửi tin thử.
```

Agent nên gọi công cụ tạo nhóm, lấy `id`, gọi công cụ gửi thử rồi đọc log. Nếu gửi thất bại, kiểm tra bot Gấu Mona và `group_id` trước khi kết luận.

## Câu hỏi thường gặp

### Có cần đăng ký Zalo OA không?

Không. MONA Pay gửi qua bot Gấu Mona của MONA nằm trong nhóm, nên anh chị không phải tạo hoặc duy trì Zalo OA riêng.

### Lấy `group_id` ở đâu?

Khách hàng MONA nhờ Account lấy trong PMS tại dự án → kết nối Zalo → `chatId`, hoặc nhờ đội MONA tra theo tên nhóm. `group_id` là chuỗi 10 đến 25 chữ số.

### Chưa là khách hàng MONA có tự thêm bot được không?

Hiện chưa. Anh chị gọi 1900 636 648 để MONA hỗ trợ nối bot vào nhóm và cung cấp `group_id`.

### Vì sao bấm Gửi thử nhưng nhóm không có tin?

Nguyên nhân thường gặp là nhóm chưa có bot Gấu Mona hoặc `group_id` không đúng. Kiểm tra lại với Account MONA, gửi thử lần nữa rồi xem log `failed` để đọc lý do từ relay.
