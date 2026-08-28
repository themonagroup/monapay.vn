---
title: "Webhook là gì? Giải thích bằng ví dụ tiền vào tài khoản ACB"
description: "Webhook là cách máy chủ tự báo sang máy chủ khác ngay khi có sự kiện, ví dụ tiền vào tài khoản ACB. Tụi em giải thích bằng gói tin thật, chữ ký HMAC, gửi lại."
date: 29/08/2026
keyword: "webhook là gì"
category: kien-thuc
h1: "Webhook là gì? Hiểu bằng ví dụ tiền vào tài khoản ngân hàng"
ogImage: /img/blog/webhook-la-gi.jpg
---

Webhook là cách một hệ thống tự gửi thông báo sang hệ thống khác ngay khi có sự kiện, bằng một yêu cầu HTTP POST tới địa chỉ do anh chị khai sẵn. Khách đến MONA làm web hay hỏi tụi em webhook là gì, và ví dụ tụi em hay dùng nhất là tiền vào tài khoản ACB: ngân hàng báo, MONA Pay lập tức POST một gói JSON về website của anh chị trong vòng 10 giây, đơn hàng tự đổi trạng thái, không ai phải mở app ngân hàng.

## Webhook khác gì cách "hỏi đi hỏi lại" mà nhiều phần mềm đang làm?

Trước khi có webhook, cách phổ biến để biết một việc đã xảy ra chưa là hỏi liên tục, dân kỹ thuật gọi là polling. Phần mềm cứ mỗi 30 giây lại gọi sang hỏi "có giao dịch mới không", 2.880 lần một ngày, đa số lần trả về là không có gì. Tốn tài nguyên, mà tin vẫn chậm tới 30 giây. Webhook đảo chiều. Bên có sự kiện chủ động gọi sang bên cần biết, đúng lúc sự kiện xảy ra, và chỉ gọi khi có chuyện, nên máy chủ hai bên rảnh gần như cả ngày mà tin vẫn tới trong vài giây.

Ở MONA, hệ thống nhận tiền chạy hơn 4 năm cho chính tụi em và hơn 6.000 khách hàng MONA từ 2022 đi theo đúng nguyên tắc này. Tiền vào tài khoản ảo ACB, ACB báo cho MONA Pay, MONA Pay POST về phần mềm thu phí hosting của [Mona.Host](https://mona.host), hoá đơn tự chuyển sang đã thanh toán và dịch vụ tự gia hạn. Cả chuỗi tính bằng giây, và không có ai ngồi bấm F5 trang sao kê, kể cả khi khách gia hạn lúc 2 giờ sáng.

Điểm khác biệt quan trọng thứ hai là hướng kết nối. Với polling, website của anh chị phải biết cách gọi API ngân hàng, giữ token, xử lý giới hạn số lần gọi. Với webhook, website chỉ cần mở một địa chỉ nhận, ví dụ `https://shop.vn/webhook/monapay`, phần còn lại là việc của bên gửi. Việc nhẹ đi rất nhiều, và đó là lý do webhook thành cách chuẩn để nối thanh toán, vận chuyển, chat, gần như mọi dịch vụ có sự kiện.

## Một webhook thật trông ra sao: payload MONA Pay gửi về

Tụi em lấy đúng gói tin MONA Pay đang gửi cho khách, kiểm ngày 28/08/2026, để anh chị nhìn thay vì tưởng tượng. Khi có tiền vào, MONA Pay POST một chuỗi JSON gồm 7 trường:

```json
{"amount":2500000,"description":"DH10234 NGUYEN VAN A","transfer_date":"10:30:00 28/08/2026","transaction_code":"FT26240001234","account_number":"1234567890","bank_name":"ACB","type":"income"}
```

Bảy trường, đủ dùng. Mỗi trường có một việc riêng và phần mềm chỉ cần đọc đúng trường mình cần. `amount` là số tiền, `description` là nội dung khách gõ khi chuyển, `transaction_code` là mã giao dịch phía ngân hàng, `account_number` là số tài khoản ảo nhận tiền. Phần mềm của anh chị đọc `description`, thấy DH10234, tìm đơn DH10234, thấy số tiền 2.500.000 đồng khớp, đánh dấu đã thanh toán, cả vòng chưa tới 10 giây kể từ lúc ACB báo.

Một chi tiết mà khách MONA hay bỏ qua rồi sau này hối: `transaction_code` không đổi qua mọi lần gửi lại. Nghĩa là nếu cùng một giao dịch được gửi hai lần, phần mềm phải dùng mã này làm khoá để không ghi nhận tiền hai lần. Tụi em từng thấy web bán hàng cộng đôi doanh thu chỉ vì thiếu một dòng kiểm tra trùng, và phải ngồi đối chiếu lại cả tháng để tìm ra 3 đơn bị tính 2 lần. Thiếu là cộng đôi.

## Làm sao biết webhook thật là của MONA Pay, không phải ai đó giả mạo?

Đây là câu tụi em thấy dân kỹ thuật hỏi ngay sau khi hiểu webhook là gì, và hỏi là đúng, vì địa chỉ nhận webhook nằm trên internet, ai cũng gọi được. Nếu phần mềm tin mọi gói tin POST tới, kẻ xấu chỉ cần gửi một JSON giả với `amount` 50.000.000 đồng là đơn được mở khoá.

MONA Pay ký mỗi gói tin bằng HMAC-SHA256. Trong header có `X-Mona-Timestamp` là mốc thời gian, và `X-Mona-Signature` là chữ ký tính từ khoá bí mật của anh chị cộng với chuỗi "mốc thời gian.nội dung gói tin". Phần mềm nhận tính lại chữ ký bằng cùng khoá, khớp thì tin. Sai thì bỏ. Kèm theo đó là luật chống phát lại: gói tin có mốc thời gian lệch quá 5 phút so với giờ máy nhận thì từ chối, dù chữ ký đúng. Công thức chữ ký công bố đầy đủ trong [trang bảo mật webhook](/docs/webhooks/bao-mat), anh chị tự kiểm lại được bằng lệnh cURL.

Khoá bí mật đó anh chị tự đặt trong dashboard khi khai webhook, không ai khác biết, kể cả tụi em cũng chỉ lưu bản đã băm. Giữ nó như giữ mật khẩu ngân hàng, và đổi khoá ngay nếu nghi ngờ đã lộ, MONA Pay cho đổi trong 1 phút không cần khai lại địa chỉ.

> Muốn nhìn một webhook thật chạy trên chính website của mình, anh chị tạo tài khoản [MONA Pay](https://my.monapay.vn/auth?mode=register), khai địa chỉ nhận, bấm gửi thử trong dashboard. Gói tin mẫu bay về trong vài giây, miễn phí hoàn toàn, không giới hạn giao dịch, không cần chờ ai duyệt.

## Webhook gửi tới mà website không nhận được thì sao?

Đây là phần tách người làm thật với người chỉ đọc định nghĩa. Webhook là một yêu cầu HTTP, và HTTP thì có lúc hỏng: máy chủ của anh chị đang khởi động lại, chứng chỉ SSL hết hạn, tên miền trỏ sai, hay code xử lý bị lỗi trả về 500. Sự kiện đã xảy ra mà bên nhận không biết, tiền vào mà đơn không mở.

MONA Pay xử lý chuyện này bằng ba lớp. Lớp một là luật thành công rõ ràng: máy nhận phải trả mã 200, 201 hoặc 202 trong vòng 10 giây, khác đi là tính thất bại. Lớp hai là lịch sử từng lần gửi trong dashboard, mỗi dòng ghi mã HTTP, thời gian phản hồi và nhãn lỗi thuộc loại nào: TIMEOUT, SSL, DNS, CONNECTION, HTTP_4XX hay HTTP_5XX. Nhìn nhãn là biết sửa ở đâu. Lớp ba là gửi lại: anh chị bấm gửi lại từ dashboard, còn phần gửi lại tự động tối đa 7 lần tụi em đang triển khai, công bố tại [trang gửi lại và xử lý lỗi](/docs/webhooks/gui-lai-va-xu-ly-loi) khi lên.

Kinh nghiệm tụi em rút ra sau nhiều lần nối cho khách: trả 200 ngay khi nhận, rồi mới xử lý đơn. Nếu code xử lý đơn chạy 15 giây mới trả, MONA Pay đã tính thất bại ở giây thứ 10 dù đơn vẫn được mở, và lịch sử gửi sẽ đầy lỗi giả. Nhận trước rồi làm sau, đó là luật tụi em áp cho mọi endpoint.

## Tự viết phần nhận webhook có khó không, mất bao lâu?

Không khó, dev quen PHP hay Node làm trong khoảng 2 giờ là chạy. Một endpoint nhận webhook đúng chuẩn gồm 4 việc: đọc nguyên văn nội dung gói tin, kiểm chữ ký HMAC và mốc thời gian, trả 200 ngay, rồi đọc JSON để xử lý đơn. Với PHP hay Node, tụi em viết mẫu sẵn khoảng 30 dòng trong [tài liệu tích hợp webhook](/docs/webhooks/tich-hop-webhook), có cả lệnh cURL để giả lập MONA Pay bắn vào máy của anh chị mà chưa cần chuyển tiền thật.

Web làm tại MONA thì phần này tụi em cài luôn khi giao, khách chỉ việc nối tài khoản ACB theo 4 bước trong dashboard. Anh chị không phải thuê thêm ai cho phần này. Web do đội khác làm thì dev của anh chị đọc tài liệu, khoảng 2 giờ là xong, thử bằng lệnh cURL trong 5 phút, hoặc nếu dùng WooCommerce thì xem thẳng [trang cổng thanh toán WooCommerce](/cong-thanh-toan-woocommerce). Còn AI agent như Claude Code, Codex đọc được tài liệu dạng máy tại [llms.txt](/llms.txt) và tự viết phần nhận, tụi em thiết kế tài liệu cho đúng việc đó.

Tụi em không khuyên ráp webhook nhận tiền bằng công cụ kéo thả kiểu Zapier, Make, n8n. Với việc đếm like thì được, với tiền thì một lần dịch vụ trung gian chập chờn là mất đơn, mà anh chị không biết mất lúc nào. Tiền phải đi thẳng vào phần mềm.

## Câu hỏi thường gặp

### Webhook và API khác nhau chỗ nào?
API là cửa để anh chị chủ động gọi sang hỏi hoặc ra lệnh, còn webhook là bên kia chủ động gọi sang báo khi có sự kiện. MONA Pay có cả hai: API để tạo tài khoản ảo, tạo mã QR, tra giao dịch tối đa 100 dòng mỗi trang, và webhook để báo tiền vào ngay khi ACB thông báo. Hai cửa bổ nhau.

### Webhook có cần máy chủ riêng không?
Cần một địa chỉ HTTPS nhận được yêu cầu POST, tức website hay phần mềm của anh chị đang chạy trên máy chủ. Web WordPress đang chạy trên hosting thường là đủ điều kiện. Máy chạy trong mạng nội bộ không có địa chỉ công khai thì MONA Pay không gọi tới được, khi đó dùng Telegram để nhận báo tiền vào là cách đơn giản hơn. Đường Telegram thì không cần máy chủ hay địa chỉ công khai nào.

### Nhận webhook thì có phải trả lời gì không?
Phải trả mã HTTP 200, 201 hoặc 202 trong 10 giây để MONA Pay ghi nhận là thành công. Không cần nội dung gì đặc biệt trong phản hồi, nhưng trả ngay rồi xử lý đơn sau. Trả mã trước rồi mới xử lý đơn phía sau, đơn nặng thì đẩy vào hàng đợi.

### Một giao dịch có bị gửi hai lần không?
Có khi anh chị bấm gửi lại hoặc khi hai cấu hình webhook cùng trỏ một địa chỉ. `transaction_code` giữ nguyên qua các lần gửi, phần mềm dùng nó làm khoá duy nhất để không ghi nhận tiền hai lần. Một khoá duy nhất cho một giao dịch, ghi một lần.

### Webhook của MONA Pay có mất phí không?
Không. MONA Pay miễn phí hoàn toàn, không giới hạn số giao dịch lẫn số webhook, tiền vào thẳng tài khoản ACB của anh chị, tụi em chỉ đọc thông báo rồi báo lại, không thu phần trăm trên số tiền. Chi tiết từng dòng ở [bảng giá](/bang-gia).

## Nối webhook đầu tiên trong 5 phút, không cần chờ duyệt

Tạo tài khoản tại [my.monapay.vn/auth?mode=register](https://my.monapay.vn/auth?mode=register), đăng ký xong dùng ngay. Nối tài khoản ACB theo 4 bước, khai địa chỉ nhận webhook và khoá HMAC, bấm gửi thử. Rồi chuyển 10.000 đồng vào mã QR của chính mình để thấy gói tin thật bay về trong vài giây. Kẹt chỗ nào, gọi 1900 636 648 giờ hành chính, kỹ sư MONA ngồi cùng anh chị tới khi gói tin đầu tiên hiện trong lịch sử gửi.
