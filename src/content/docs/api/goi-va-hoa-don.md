---
title: "Gói và hoá đơn (billing)"
description: "API billing MONA Pay: xem 5 gói, đọc mức dùng tháng hiện tại, tạo hoá đơn nâng gói trả bằng VietQR mã MPAY, poll trạng thái, chuyện vượt hạn mức free và trả phí."
updated: 02/09/2026
---

MONA Pay miễn phí 500 giao dịch tiền vào mỗi tháng, đủ mọi tính năng. Bán nhiều hơn thì nâng gói trả phí tính theo số giao dịch, không thu phần trăm trên số tiền. Trang này dành cho lập trình viên và AI agent cần đọc gói, đọc mức dùng và nâng gói bằng API thay vì bấm dashboard. Giá niêm yết ở [trang bảng giá](/bang-gia).

## Cách đếm giao dịch

Giao dịch = 1 khoản tiền **vào** (credit) ghi nhận trên mọi tài khoản và tài khoản ảo đã nối, cắt tháng theo **giờ Việt Nam (UTC+7)**. Tiền ra, giao dịch sandbox và webhook gửi lại **không tính**.

Vượt hạn mức thì sao:

- **Gói Miễn phí**: tháng đầu tiên vượt vẫn báo đủ (du di). Từ tháng vượt kế tiếp, giao dịch vượt mức vẫn ghi nhận trong dashboard nhưng **ngưng gửi webhook và Telegram** cho tới khi nâng gói. Không mất giao dịch. Nếu client có cấu hình webhook, mỗi giao dịch bị chặn ghi một dòng `webhook_log` với lỗi `QUOTA_EXCEEDED` để đối chiếu.
- **Gói trả phí**: không khoá, phần vượt tính phụ trội theo từng giao dịch (niêm yết theo gói), gom vào hoá đơn cuối tháng.
- Hệ nhắc qua Telegram đúng một lần ở mốc 80% và 100% hạn mức trong tháng.

## Các endpoint

Base URL `https://api.monapay.vn` (alias cũ `https://ipn.mona.host`). Xác thực Bearer như mọi API khác, xem [Xác thực](/docs/api/xac-thuc). Request ghi (POST) cần thêm header `X-Client-Secret`.

| Method | Đường dẫn | Quyền | Dùng để |
|---|---|---|---|
| GET | `/api/v1/billing/plans` | Public | Đọc 5 gói: `code`, `price_month`, `price_year` (trả năm = 10 tháng), `tx_limit`, `overage_per_tx`, `features` |
| GET | `/api/v1/billing/usage` | Bearer | Mức dùng tháng hiện tại: `plan_code`, `tx_used`, `tx_limit`, `overage_tx`, `overage_amount`, `plan_expires_at` |
| GET | `/api/v1/billing/invoices` | Bearer | Danh sách hoá đơn, lọc `?status=`, phân trang `?page=&limit=`, trả `{ data, total }` |
| POST | `/api/v1/billing/invoices` | Bearer + secret | Tạo hoá đơn nâng gói, trả 201 |
| GET | `/api/v1/billing/invoices/{id}` | Bearer | Chi tiết một hoá đơn, dùng để poll trạng thái |
| POST | `/api/v1/billing/invoices/{id}/cancel` | Bearer + secret | Huỷ hoá đơn còn pending |

## Nâng gói bằng API, từng bước

1. Tạo hoá đơn:

```bash
curl -X POST https://api.monapay.vn/api/v1/billing/invoices \
  -H "Authorization: Bearer $TOKEN" -H "X-Client-Secret: $SECRET" \
  -H "Content-Type: application/json" \
  -d '{"plan_code": "startup", "cycle": "month"}'
```

`plan_code` nhận `startup`, `business`, `enterprise`, `scale`; `cycle` nhận `month` hoặc `year` (năm chỉ tính 10 tháng tiền).

2. Response 201 trả hoá đơn `status: "pending"` với **mã chuyển khoản dạng `MPAY` + 6 số**, hạn thanh toán 48 giờ, kèm khối `payment`: link ảnh VietQR và payload EMVCo để tự dựng QR. Cho khách quét QR hoặc chuyển khoản **đúng số tiền, nội dung ghi đúng mã MPAY** vào tài khoản ghi trên hoá đơn.

3. Tiền vào là hệ tự khớp trong vài giây (đọc thông báo giao dịch từ ngân hàng, so mã + số tiền). Poll `GET /api/v1/billing/invoices/{id}` tới khi `status` thành `paid`; gói kích hoạt ngay lúc đó. Cùng gói còn hạn thì cộng dồn từ ngày hết hạn cũ, đổi gói khác thì tính lại từ thời điểm thanh toán.

4. Tạo nhầm thì `POST /api/v1/billing/invoices/{id}/cancel` khi còn pending; quá 48 giờ chưa trả, hoá đơn tự chuyển `expired`, không phát sinh gì.

Không muốn đụng API: dashboard [my.monapay.vn](https://my.monapay.vn) → Gói và thanh toán, cùng một luồng, có sẵn panel QR tự đổi trạng thái khi nhận tiền.

## Câu hỏi thường gặp

**Đang gói Miễn phí, chưa từng vượt, có bị trừ gì không?** Không. Không phí mở tài khoản, không phí duy trì, không thu phần trăm trên số tiền. Chỉ khi bán vượt 500 giao dịch/tháng mới cần cân nhắc nâng gói.

**Hoá đơn phụ trội tính lúc nào?** Đầu tháng kế tiếp, hệ chốt kỳ tháng trước: gói trả phí có phần vượt sẽ nhận một hoá đơn phụ trội (mỗi kỳ đúng một hoá đơn). Gói trả phí quá hạn 7 ngày chưa gia hạn thì hạ về Miễn phí, dữ liệu giữ nguyên.

**Webhook có đổi gì khi nâng gói không?** Không. Payload, chữ ký HMAC, cấu hình webhook giữ nguyên; gói chỉ quyết định hạn mức số giao dịch được fan-out mỗi tháng.
