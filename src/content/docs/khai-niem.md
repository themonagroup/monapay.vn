---
title: "Webhook là gì, VietQR là gì, tài khoản ảo là gì (giải thích dễ hiểu)"
description: Giải thích 7 khái niệm gặp trong MONA Pay bằng ngôn ngữ người không làm kỹ thuật, kèm phần dành cho lập trình viên ở mỗi mục.
updated: 28/08/2026
---

Khi dùng MONA Pay anh chị sẽ gặp 7 từ: tài khoản ảo (VA), VietQR, webhook, Telegram, HMAC, API key và đối soát. Trang này giải thích từng từ theo cách chủ shop hay kế toán đọc là hiểu, mỗi mục có thêm vài dòng cho lập trình viên. Đọc xong trang này, anh chị đủ hiểu để cấu hình dashboard mà không cần hỏi dev.

## Tài khoản ảo (VA)

**Cho người dùng.** Tài khoản ảo là một số tài khoản phụ do ACB cấp, tiền chuyển vào đó vẫn về tài khoản chính của anh chị. Điểm hay là anh chị tạo được nhiều số ảo khác nhau, mỗi số gắn cho một đơn hàng hoặc một khách. Khách chuyển vào số nào, hệ thống biết ngay tiền của đơn nào, không cần khách gõ đúng nội dung chuyển khoản. Ví dụ đơn hàng số 1052 được gắn VA `MONA1052...`, khách chuyển vào đó là đơn 1052 tự đổi sang đã thanh toán.

**Cho lập trình viên.** VA được tạo theo đầu số (prefix) anh chị đăng ký với ACB, quản lý trong dashboard mục Ngân hàng & VA hoặc qua API `POST /api/v1/acb/virtual-account/registration`. Webhook cấu hình được theo từng VA, nên anh chị tách luồng tiền học phí, tiền hosting, tiền đơn lẻ vào các endpoint khác nhau. Chi tiết ở [Tài khoản ảo (VA)](/docs/api/tai-khoan-ao-va).

## VietQR

**Cho người dùng.** VietQR là mã QR chuyển khoản chuẩn của các ngân hàng Việt Nam, app ngân hàng nào cũng quét được. MONA Pay tạo mã QR "động": trong mã đã có sẵn số tài khoản, số tiền và nội dung. Khách quét là màn hình chuyển khoản hiện đủ thông tin, chỉ bấm xác nhận, không gõ sai được. Đơn 350.000đ thì QR ghi đúng 350.000đ.

**Cho lập trình viên.** Gọi `POST /api/v1/acb/qr-payment/generate` với `orderId`, `amount` (số nguyên VND, tối đa 1.000.000.000), `description` (tối đa 255 ký tự) và thông tin tài khoản. Khách quét và chuyển xong, ACB báo về, MONA Pay bắn webhook y như giao dịch qua VA. Hủy mã bằng `DELETE /api/v1/acb/qr-payment/{qr_code_id}/cancellation`. Xem [QR thanh toán](/docs/api/qr-thanh-toan).

## Webhook

**Cho người dùng.** Webhook là cách MONA Pay "gọi điện" cho phần mềm của anh chị mỗi khi có tiền vào. Anh chị cho MONA Pay một địa chỉ web (URL), có giao dịch là MONA Pay gửi một gói thông tin tới địa chỉ đó: số tiền, nội dung, thời gian, mã giao dịch. Phần mềm nhận được thì tự làm việc tiếp, ví dụ đổi trạng thái đơn, gửi email cho khách, mở khoá khoá học.

**Cho lập trình viên.** MONA Pay POST JSON tới URL của anh chị, mặc định `Content-Type: application/json`. Endpoint trả HTTP 200, 201 hoặc 202 trong 10 giây là thành công. Payload 7 trường, khoá chống trùng là `transaction_code`. Xem [Tích hợp webhook](/docs/webhooks/tich-hop-webhook) và [Định dạng payload](/docs/webhooks/dinh-dang-payload).

## Telegram

**Cho người dùng.** Nếu anh chị chỉ cần biết tiền vào, không cần phần mềm xử lý gì, thì thông báo Telegram là đủ. Thêm bot MONA Pay vào nhóm Telegram của công ty, mỗi lần tiền vào là cả nhóm nhận một tin: ngân hàng, số tài khoản, số tiền, thời gian, nội dung. Kế toán ngồi đâu cũng thấy, không phải đăng nhập app ngân hàng.

**Cho lập trình viên.** Cấu hình trong dashboard mục Telegram: nhập `group_id` (và `topic_id` nếu nhóm chia chủ đề), chọn VA hoặc mọi tài khoản, sửa mẫu tin nhắn, có nút gửi thử. API tại `/api/v1/telegram-configs`. Xem [Telegram](/docs/telegram).

## HMAC (chữ ký webhook)

**Cho người dùng.** Webhook là một địa chỉ web công khai, về lý thuyết ai biết địa chỉ cũng gửi được một gói giả "có tiền vào". HMAC là chữ ký chống giả: anh chị và MONA Pay giữ chung một mật khẩu bí mật (secret), mỗi gói MONA Pay gửi đều kèm một chữ ký tính từ secret đó. Phần mềm của anh chị tính lại chữ ký, khớp thì tin, không khớp thì bỏ. Kẻ gian không có secret nên không làm giả được.

**Cho lập trình viên.** Header `X-Mona-Signature: sha256=<hex>` với hex = HMAC-SHA256(secret, `"<X-Mona-Timestamp>.<raw_body>"`). Timestamp là unix giây, lệch quá 5 phút thì từ chối để chặn gửi lại gói cũ (replay). Phải ký trên raw body đúng từng byte. Xem [Bảo mật webhook](/docs/webhooks/bao-mat).

## API key và Bearer token

**Cho người dùng.** API key là chìa khoá để phần mềm của anh chị gọi vào MONA Pay (tạo VA, tạo QR, xem giao dịch). Tạo trong dashboard mục API Keys, mỗi khoá đặt một tên để biết khoá nào đang dùng ở đâu, lộ khoá nào thì thu hồi khoá đó mà không ảnh hưởng chỗ khác.

**Cho lập trình viên.** Hai lớp: đăng nhập `POST /api/v1/client/login` lấy `access_token` gửi dạng Bearer cho mọi request; các request POST, PUT, DELETE thêm header `X-Client-Secret` là `client_secret` sinh từ `POST /api/v1/client-keys/generate`. `client_secret` chỉ hiện 1 lần. Mọi response chung khung `{"success": true, "message": "...", "data": {...}}`. Xem [Xác thực](/docs/api/xac-thuc) và [API keys](/docs/api/api-keys).

## Đối soát

**Cho người dùng.** Đối soát là việc so sổ của anh chị với danh sách giao dịch ngân hàng để chắc không sót khoản nào. Webhook lo phần thời gian thực, nhưng máy chủ của anh chị có lúc bảo trì hay mất mạng đúng lúc tiền vào. Đối soát định kỳ (mỗi giờ hoặc cuối ngày) là lưới đỡ cho những lúc đó.

**Cho lập trình viên.** Kéo danh sách bằng `GET /api/v1/acb/virtual-account/transactions?virtual_account_number=...&page=1&limit=100`, tối đa 100 giao dịch mỗi trang, so `transaction_code` với bảng giao dịch của anh chị và bổ sung bản ghi thiếu. Xem [Đối soát giao dịch](/docs/webhooks/doi-soat).

## Ghép các khái niệm lại

Một web bán hàng điển hình dùng như sau: mỗi đơn tạo một mã VietQR động (hoặc gắn một VA), khách quét và chuyển. ACB báo cho MONA Pay, MONA Pay bắn webhook có chữ ký HMAC tới web, web kiểm chữ ký rồi đổi đơn sang đã thanh toán. Nhóm Telegram của kế toán nhận tin cùng lúc. Cuối ngày một cron gọi API đối soát để chắc không sót. Toàn bộ chuỗi này không có người nào phải mở app ngân hàng.

## Câu hỏi nhanh

**Tiền có nằm ở MONA Pay lúc nào không?** Không. VA là số phụ của chính tài khoản ACB của anh chị, tiền vào là nằm trong tài khoản ngân hàng của anh chị ngay. MONA Pay chỉ nhận thông báo.

**Không có VA thì webhook có chạy không?** Có. Sau khi nối tài khoản ACB và đăng ký nhận thông báo (2 lần OTP), mọi giao dịch vào tài khoản đều báo về. VA chỉ giúp khớp đơn tự động.

**Nên dùng VA hay VietQR?** Dùng cả hai. VietQR động là cách khách thanh toán tiện nhất, còn VA là cách hệ thống phân biệt tiền của đơn nào. Mã QR động của MONA Pay đã gắn sẵn số tiền và nội dung nên khớp đơn rất chắc.

**HMAC có bắt buộc không?** Không bắt buộc nhưng tụi em khuyên bật luôn từ đầu. Chỉ tốn khoảng 10 dòng code ở đầu nhận, đổi lại không ai giả được thông báo tiền vào.
