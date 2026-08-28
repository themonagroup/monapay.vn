---
title: Gửi lại webhook và xử lý lỗi
description: Điều kiện webhook thành công (200/201/202 trong 10 giây), 9 nhãn lỗi trong log và cách sửa, gửi lại thủ công từ dashboard, thống kê tỷ lệ thành công và P95.
updated: 28/08/2026
---

MONA Pay tính một lần gửi webhook là thành công khi máy chủ của anh chị trả HTTP 200, 201 hoặc 202 trong vòng 10 giây. Mọi lần gửi đều ghi log với mã HTTP, thời gian phản hồi và một nhãn lỗi. Lần gửi thất bại được gửi lại thủ công từ dashboard; gửi lại tự động theo lịch (tối đa 7 lần) đang được triển khai.

## Thế nào là thành công

| Điều kiện | Giá trị |
|---|---|
| Mã HTTP chấp nhận | 200, 201, 202 |
| Thời gian chờ tối đa | 10 giây tính từ lúc MONA Pay bắt đầu gửi |
| Body phản hồi | Không bắt buộc, MONA Pay không đọc nội dung |
| Redirect | Không đi theo. 301/302 tính là thất bại |

Điều này nghĩa là endpoint của anh chị chỉ cần trả `200 OK` với body rỗng. Đừng trả 204 (không nằm trong danh sách) và đừng để URL webhook có redirect.

## Log từng lần gửi

Mỗi lần MONA Pay gửi, kể cả gửi thử và gửi lại, đều có một dòng trong dashboard mục Webhooks, tab Lịch sử gửi. Cùng dữ liệu có ở API `GET /api/v1/webhook-logs`.

| Trường log | Ý nghĩa |
|---|---|
| Thời điểm gửi | Lúc MONA Pay bắt đầu request |
| Mã HTTP | Mã máy chủ của anh chị trả, trống nếu không kết nối được |
| `duration_ms` | Thời gian từ lúc gửi tới lúc nhận phản hồi, mili giây |
| `error_label` | Nhãn phân loại kết quả, xem bảng dưới |
| Payload | Gói đã gửi, để anh chị đối chiếu |
| Phản hồi | Vài trăm ký tự đầu body máy chủ trả về, tiện tìm lỗi |

## 9 nhãn lỗi và cách sửa

| `error_label` | Nghĩa | Nguyên nhân hay gặp | Cách sửa |
|---|---|---|---|
| `OK` | Thành công | Máy chủ trả 200/201/202 trong 10 giây | Không cần làm gì |
| `HTTP_3XX` | Máy chủ trả redirect | URL thiếu `https`, thiếu hoặc thừa dấu `/` cuối, chuyển hướng www | Khai URL đích cuối cùng, không qua redirect |
| `HTTP_4XX` | Máy chủ từ chối | 401/403 sai secret hoặc tường lửa ứng dụng chặn; 404 sai đường dẫn; 405 route không nhận POST; 422 endpoint đòi trường không có | Kiểm secret, đường dẫn, method. Với WAF (Cloudflare, ModSecurity) cho phép IP `103.168.55.14` |
| `HTTP_5XX` | Máy chủ lỗi | Code ném exception, hết bộ nhớ, database không kết nối được | Xem log máy chủ của anh chị đúng thời điểm `duration_ms` |
| `TIMEOUT` | Quá 10 giây không phản hồi | Endpoint xử lý xong đơn mới trả lời, hoặc máy chủ quá tải | Trả 200 trước, xử lý sau |
| `SSL` | Bắt tay TLS thất bại | Chứng chỉ hết hạn, tự ký, sai tên miền, thiếu chuỗi trung gian | Kiểm bằng `openssl s_client -connect ten-mien:443`, cài lại chứng chỉ đầy đủ |
| `DNS` | Không phân giải được tên miền | Gõ sai tên miền, tên miền hết hạn, bản ghi DNS chưa lan | Kiểm `dig ten-mien` từ máy ngoài |
| `CONNECTION` | Không mở được kết nối | Tường lửa chặn cổng 443, máy chủ tắt, cổng sai | Mở cổng 443 cho IP `103.168.55.14`, kiểm máy chủ đang chạy |
| `ERROR` | Lỗi khác | Trường hợp không xếp được vào các nhãn trên | Xem phản hồi trong log, gọi 1900 636 648 nếu không rõ |

## Gửi lại thủ công

Trong Lịch sử gửi, mỗi dòng thất bại có nút Gửi lại. Bấm là MONA Pay gửi lại đúng payload đó tới đúng URL đó, ngay lập tức, và ghi thêm một dòng log mới. `transaction_code` không đổi nên endpoint của anh chị phân biệt được đây là gói cũ. Anh chị cũng gửi lại bằng API: `POST /api/v1/acb/virtual-account/transactions/{transaction_id}/retry` với body `{"target_type": "WEBHOOK"}` (hoặc `"TELEGRAM"`, kèm `target_id` là id cấu hình muốn gửi lại), header `Authorization: Bearer` + `X-Client-Secret` như mọi lệnh ghi. Xem thêm [Cấu hình webhook qua API](/docs/api/webhook-configs).

Gửi lại có 2 tình huống dùng:

- **Sửa xong lỗi ở máy chủ.** Ví dụ endpoint bị 500 vì thiếu bảng, tạo bảng xong bấm gửi lại từng dòng thất bại.
- **Kiểm tra sau khi đổi code.** Gửi lại một giao dịch cũ để xem code mới xử lý đúng không, thay vì phải chuyển tiền thật.

## Gửi lại tự động (đang triển khai)

Cấu hình webhook có trường `max_retries` mặc định 7, dành cho cơ chế gửi lại tự động theo lịch giãn dần khi máy chủ của anh chị trả lỗi. Cơ chế này đang được triển khai và chưa chạy trên production; hiện tại mọi lần gửi lại đều do anh chị bấm. Khi lên, tụi em công bố lịch cụ thể tại trang này. Trong lúc chờ, anh chị nên chạy [đối soát định kỳ](/docs/webhooks/doi-soat) để không sót giao dịch nào lúc máy chủ gặp sự cố.

## Thống kê tỷ lệ thành công và P95

Dashboard mục Webhooks có tab thống kê, dữ liệu lấy từ `GET /api/v1/webhook-logs/stats`: tổng số lần gửi, tỷ lệ thành công, thời gian phản hồi trung bình và P95 (95% lần gửi nhanh hơn mốc này), phân bố theo nhãn lỗi. Vài mốc tham khảo:

- Tỷ lệ thành công dưới 99% trong ngày: có gì đó không ổn ở máy chủ, xem phân bố nhãn lỗi.
- P95 trên 3.000 ms: endpoint đang làm việc nặng trước khi trả lời, sớm muộn sẽ dính `TIMEOUT` khi tải tăng.
- Nhãn `HTTP_4XX` tăng đột ngột sau khi deploy: thường là đổi secret hoặc đổi đường dẫn mà quên cập nhật cấu hình.

```bash
curl "https://api.monapay.vn/api/v1/webhook-logs/stats" \
  -H "Authorization: Bearer $TOKEN"
```

## Xử lý phía máy chủ của anh chị

Ba nguyên tắc để endpoint không bao giờ lỗi vì tải:

1. **Trả lời trước, làm việc sau.** Kiểm chữ ký xong là trả 200 ngay. Việc cập nhật đơn, gửi email, gọi API bên thứ ba đẩy vào hàng đợi (Redis, database, cron). Mẫu PHP dùng `fastcgi_finish_request()`, mẫu Node gọi `res.send()` trước rồi xử lý tiếp, xem [Tích hợp webhook](/docs/webhooks/tich-hop-webhook).
2. **Chống trùng bằng `transaction_code`.** Gửi lại tay, hai cấu hình cùng URL, hoặc gửi lại tự động sau này đều sinh gói trùng. UNIQUE trên `transaction_code` là đủ.
3. **Ghi log ở phía anh chị.** Lưu raw body và header của mọi gói nhận được, ít nhất 30 ngày. Khi cần đối chiếu với log MONA Pay, hai bên cùng nhìn một `transaction_code`.

## Lỗi thường gặp

**Log báo `OK` nhưng đơn không đổi trạng thái.** Endpoint trả 200 rồi phần xử lý sau đó lỗi. Xem log ứng dụng của anh chị, vì MONA Pay chỉ biết mã HTTP.

**Bấm gửi lại vẫn ra cùng nhãn lỗi.** Lỗi chưa được sửa ở máy chủ. Thử gói giả lập bằng cURL ở trang [Bảo mật webhook](/docs/webhooks/bao-mat) từ máy khác để tái hiện.

**`TIMEOUT` chỉ xảy ra vào giờ cao điểm.** Máy chủ quá tải, xử lý đồng bộ. Chuyển sang trả 200 trước.

**Tất cả webhook ra `CONNECTION` từ một thời điểm.** Thường do đổi tường lửa hoặc đổi máy chủ. Mở lại cổng 443 cho IP `103.168.55.14`.
