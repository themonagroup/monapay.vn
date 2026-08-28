---
title: Định dạng payload webhook MONA Pay
description: "7 trường trong gói JSON MONA Pay gửi khi có tiền vào, 3 kiểu Content-Type, header kèm theo, gói gửi thử và định dạng tương thích đang triển khai."
updated: 28/08/2026
---

Mỗi webhook MONA Pay gửi là một gói JSON 7 trường: số tiền, nội dung, thời gian, mã giao dịch, số tài khoản nhận, tên ngân hàng và loại giao dịch. Anh chị chọn được 1 trong 3 kiểu đóng gói (JSON, form-urlencoded, multipart). MONA Pay đang triển khai thêm tuỳ chọn định dạng tương thích các cổng phổ biến tại Việt Nam, xem mục cuối trang.

## Payload định dạng `monapay` (mặc định)

```json
{
  "amount": 2500000,
  "description": "noi dung chuyen khoan",
  "transfer_date": "10:30:00 28/08/2026",
  "transaction_code": "FT26240001234",
  "account_number": "1234567890",
  "bank_name": "ACB",
  "type": "income"
}
```

| Trường | Kiểu | Ý nghĩa | Ghi chú |
|---|---|---|---|
| `amount` | số nguyên | Số tiền giao dịch, đơn vị VND | Không có phần thập phân. 2.500.000đ gửi là `2500000` |
| `description` | chuỗi | Nội dung chuyển khoản khách gõ hoặc nội dung trong mã QR | Dùng để khớp đơn khi không dùng VA |
| `transfer_date` | chuỗi | Thời điểm giao dịch, định dạng `YYYY-MM-DD HH:MM:SS`, giờ Việt Nam | Lấy từ thông báo của ACB |
| `transaction_code` | chuỗi | Mã giao dịch phía ngân hàng | Giữ nguyên qua mọi lần gửi lại. Dùng làm khoá chống trùng |
| `account_number` | chuỗi | Số VA hoặc số tài khoản nhận tiền | Khớp đơn theo VA thì so trường này |
| `bank_name` | chuỗi | Tên ngân hàng | Hiện luôn là `ACB` |
| `type` | chuỗi | Loại giao dịch | Hiện chỉ có `income` (tiền vào) |

Ba điều nên biết khi dùng:

- **`transaction_code` là khoá duy nhất.** Gửi lại 10 lần thì cả 10 gói cùng một `transaction_code`. Bảng giao dịch của anh chị nên có ràng buộc UNIQUE trên cột này.
- **`account_number` cho biết tiền vào VA nào.** Nếu anh chị gắn mỗi đơn một VA, chỉ cần so trường này là biết đơn nào đã trả, không cần đọc `description`.
- **Trường sẽ được thêm, không bị đổi tên.** Khi MONA Pay mở thêm ngân hàng hoặc loại giao dịch, tụi em thêm giá trị mới (ví dụ `bank_name` khác `ACB`, `type` khác `income`) chứ không đổi tên 7 trường này. Code của anh chị nên bỏ qua trường lạ thay vì báo lỗi.

## Ba kiểu Content-Type

Chọn trong dashboard hoặc qua trường `payload_format` khi tạo cấu hình:

| `payload_format` | MONA Pay gửi thế nào | Dùng khi |
|---|---|---|
| `application/json` | Body là chuỗi JSON như trên, không khoảng trắng thừa | Mặc định. Mọi framework hiện đại đều nhận được |
| `application/x-www-form-urlencoded` | Body dạng `amount=2500000&description=...` như form HTML | Hệ thống cũ chỉ đọc `$_POST` |
| `multipart/form-data` | Từng trường là một phần của form nhiều phần | Hệ thống chỉ nhận multipart |

Với HMAC, chuỗi được ký là raw body đúng như MONA Pay gửi: JSON không khoảng trắng với kiểu JSON, chuỗi urlencoded với kiểu form. Chi tiết ở [Bảo mật webhook](/docs/webhooks/bao-mat).

## Header đi kèm

| Header | Khi nào có | Giá trị |
|---|---|---|
| `Content-Type` | Luôn | Theo `payload_format` đã chọn |
| `X-Mona-Timestamp` | Kiểu xác thực `HMAC_SHA256` | Unix giây lúc gửi |
| `X-Mona-Signature` | Kiểu xác thực `HMAC_SHA256` | `sha256=<hex>` |
| Header tên tuỳ chọn (mặc định `X-Webhook-Secret`) | Kiểu xác thực `API_KEY` | Secret anh chị đặt |

## Định dạng tương thích (đang triển khai)

MONA Pay đang triển khai thêm tuỳ chọn định dạng payload tương thích với các cổng phổ biến tại Việt Nam để đổi nhà cung cấp không phải sửa code; công bố tại trang này khi lên. Trong lúc chờ, 7 trường ở trên đủ để anh chị viết một lớp chuyển đổi khoảng 10 dòng ở đầu nhận: đổi tên trường theo cấu trúc code cũ, giữ `transaction_code` làm khoá chống trùng, rồi gọi lại hàm xử lý sẵn có.

## Gói gửi thử

Khi bấm Gửi thử trong dashboard hoặc gọi `POST /api/v1/client-webhooks/test`, MONA Pay gửi một gói có đúng 7 trường này với dữ liệu mẫu. Endpoint của anh chị nên phân biệt gói thử với giao dịch thật bằng cách kiểm tra `transaction_code` có tồn tại trong danh sách giao dịch (qua [API đối soát](/docs/webhooks/doi-soat)) trước khi đổi trạng thái đơn quan trọng, hoặc đơn giản là chỉ gửi thử vào môi trường staging.

## Câu hỏi nhanh

**Số tiền có bao giờ là số thập phân không?** Không. VND không có phần lẻ, `amount` luôn là số nguyên.

**Múi giờ của `transfer_date`?** Giờ Việt Nam (UTC+7), đúng như ACB báo.

**Có gửi giao dịch tiền ra không?** Hiện chưa. `type` luôn là `income`. Khi có thêm loại khác tụi em giữ nguyên tên trường.

**Tôi nhận webhook bằng Google Apps Script hoặc n8n được không?** Được, miễn URL nhận POST và trả 200 trong 10 giây. Với chữ ký HMAC, cần lấy raw body để tính lại, xem [Bảo mật webhook](/docs/webhooks/bao-mat).


## Lưu ý định dạng `transfer_date`

`transfer_date` là chuỗi `HH:MM:SS dd/mm/YYYY` theo giờ Việt Nam (UTC+7), ví dụ `10:30:00 28/08/2026`. Không phải ISO 8601, nên đừng `new Date()` thẳng; tách theo khoảng trắng rồi ghép lại, hoặc lưu nguyên chuỗi để đối soát.
