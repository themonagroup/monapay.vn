---
title: "API ngân hàng là gì? Doanh nghiệp nhận tiền tự động ra sao"
description: "API ngân hàng là cửa để phần mềm nói chuyện thẳng với ngân hàng: cấp tài khoản ảo, báo giao dịch, sinh mã QR. Tụi em kể cách MONA dùng API ACB thu tiền tự động."
date: 29/08/2026
keyword: "api ngân hàng là gì"
category: kien-thuc
h1: "API ngân hàng là gì? Phần mềm nói chuyện với ngân hàng bằng cách nào"
ogImage: /img/blog/api-ngan-hang-la-gi.jpg
---

API ngân hàng là bộ cửa giao tiếp do ngân hàng mở ra để phần mềm bên ngoài gọi vào: xin cấp tài khoản ảo, nhận thông báo mỗi khi có giao dịch, sinh mã QR thanh toán, tra cứu lịch sử tiền vào. Khách đến MONA làm phần mềm hỏi tụi em API ngân hàng là gì, tụi em trả lời bằng chính hệ thống thu tiền hosting và học phí tụi em chạy hơn 4 năm trên API của ACB.

## Không có API ngân hàng thì phần mềm biết tiền vào bằng cách nào?

Bằng mắt người. Đó là câu trả lời thật ở rất nhiều doanh nghiệp tụi em gặp trong 14.000+ dự án: nhân viên mở app ngân hàng, thấy dòng tiền vào, mở phần mềm bán hàng, tìm đơn, bấm đã thanh toán. Khách chuyển 9 giờ tối thì sáng mai mới được xác nhận. Hai khách cùng chuyển 500.000 đồng thì đoán. Chính MONA từng làm y như vậy trước khi tự xây hệ thống.

API ngân hàng cắt bỏ cặp mắt đó. Ngân hàng cấp cho phần mềm một đường gọi có xác thực, mỗi khi có giao dịch ngân hàng chủ động gửi thông báo sang, phần mềm đọc số tiền, nội dung, mã giao dịch rồi tự xử lý. Tin tới trong vài giây, kể cả 2 giờ sáng, và không ai phải canh app.

Tụi em hay nói với khách: API ngân hàng không phải thứ để "hiện đại hoá", nó là thứ bỏ đi một công việc cụ thể đang tốn một người. Bỏ một việc, giữ một người.

## Ngân hàng cấp những API gì cho doanh nghiệp?

Mỗi ngân hàng có bộ API khác nhau, nhưng với việc nhận tiền, tụi em thấy 4 cửa quan trọng, và ACB có đủ cả 4, tụi em đang dùng thật. Bốn cửa, đủ nhận tiền.

Cửa thứ nhất là tài khoản ảo, gọi tắt là VA. Ngân hàng cấp cho anh chị nhiều số tài khoản phụ theo một đầu số, tiền chuyển vào số nào cũng về tài khoản chính, nhưng thông báo ghi rõ số nào. Mỗi đơn, mỗi khách một số thì khớp tiền không cần đọc nội dung. Cửa thứ hai là thông báo giao dịch: ngân hàng gửi sang phần mềm ngay khi có tiền vào, kèm số tiền, nội dung, mã giao dịch. Cửa thứ ba là sinh mã QR thanh toán, mã VietQR động có sẵn số tiền và nội dung theo đơn. Cửa thứ tư là tra cứu giao dịch để đối soát, MONA Pay cho tra tối đa 100 giao dịch mỗi trang.

Điều kiện để mở các cửa này là tài khoản ngân hàng đứng tên anh chị và số điện thoại đã đăng ký với ngân hàng để nhận OTP, vì mỗi bước đăng ký tài khoản ảo hay đăng ký nhận thông báo đều cần ngân hàng xác nhận chủ tài khoản đồng ý. Với ACB là 2 lần OTP, không có cách nào bỏ qua bước này, và tụi em thấy đó là điều tốt: không ai gắn được thông báo vào tài khoản của anh chị mà anh chị không biết.

## Tự xin API từng ngân hàng hay đi qua một lớp trung gian?

Câu này quyết định anh chị mất bao nhiêu tháng. Xin API trực tiếp từ ngân hàng cần pháp nhân, hồ sơ, ký kết, môi trường thử, đội kỹ thuật đọc tài liệu của từng ngân hàng, mỗi ngân hàng một kiểu. Doanh nghiệp lớn có phòng công nghệ thì làm được. Shop online 3 người thì không.

MONA Pay là lớp đứng giữa: tụi em đã nối API của ACB, xử lý phần đăng ký tài khoản ảo, nhận thông báo, sinh mã QR, rồi mở ra cho anh chị một bộ API gọn hơn nhiều và một dashboard cho người không code. Anh chị đăng ký tại my.monapay.vn, dùng ngay không cần duyệt, nối tài khoản ACB theo 4 bước, xong. Với dân kỹ thuật, bộ API đó có tài liệu ở [monapay.vn/docs](/docs), có bản đọc máy tại [llms.txt](/llms.txt) và openapi.json để AI agent tự tích hợp.

Có một thứ MONA Pay không làm: giữ tiền. Tiền vào thẳng tài khoản ACB của anh chị, tụi em chỉ đọc thông báo rồi báo lại. Vì không giữ tiền nên không có phí trung gian, MONA Pay miễn phí hoàn toàn, không giới hạn giao dịch. Còn cổng thanh toán quốc tế kiểu PayPal thì tiền vào ví của họ trước, thu 4,40% cộng phí cố định cho giao dịch từ nước ngoài, rút về ngân hàng Việt Nam 60.000 đồng mỗi lần, theo biểu phí tụi em kiểm ngày 28/08/2026. Hai mô hình khác nhau từ gốc, một bên giữ tiền rồi thu phí, một bên chỉ đọc thông báo.

> Anh chị đang có tài khoản ACB và một website hoặc phần mềm cần biết tiền vào, thì thử luôn hôm nay: tạo tài khoản [MONA Pay](https://my.monapay.vn/auth?mode=register), nối ACB, chuyển 10.000 đồng vào mã QR của chính mình và xem thông báo về trong vài giây. Không cần ký gì, không mất phí.

## API ngân hàng vào phần mềm của anh chị theo đường nào?

Sau khi nối, thông báo tiền vào đến phần mềm theo hai đường tụi em thấy khách dùng nhiều nhất. Đường webhook: MONA Pay POST một gói JSON gồm số tiền, nội dung, mã giao dịch, số tài khoản ảo về địa chỉ do anh chị khai, ký bằng HMAC-SHA256, từ chối gói tin lệch quá 5 phút để chặn giả mạo; phần mềm trả mã 200 trong 10 giây là xong. Đường Telegram: tin nhắn vào nhóm công ty gồm tên ngân hàng, số tài khoản, số tiền, thời gian, nội dung, cho thu ngân và kế toán nhìn, không cần code.

Ở [Mona.Host](https://mona.host), tụi em dùng đường webhook: tiền vào là hoá đơn hosting chuyển sang đã thanh toán, dịch vụ tự gia hạn, chạy như vậy hơn 4 năm, và từ 2022 hơn 6.000 khách hàng mới của MONA thu tiền qua đúng đường này. Chưa lỡ đơn nào. Ở nhiều khách bán hàng, tụi em bật cả hai, webhook cho website mở đơn, Telegram cho nhân viên nhìn. Chi tiết từng đường ở [tích hợp webhook](/docs/webhooks/tich-hop-webhook) và [thông báo Telegram](/docs/telegram).

Tụi em không khuyên nối API ngân hàng qua công cụ kéo thả kiểu Zapier, Make, n8n. Với tiền, một lần dịch vụ trung gian chập chờn là mất đơn mà không ai biết. Nối thẳng vào phần mềm, hoặc để MONA nối cho.

## Ai nên dùng API ngân hàng, ai chưa cần?

Nên là ai đang có người canh app ngân hàng: shop online từ 30 đơn mỗi ngày, trung tâm thu học phí theo kỳ, phần mềm bán gói thuê bao, chủ nhà trọ thu tiền phòng hàng tháng, công ty phần mềm cần cổng nhận tiền cho khách của mình. Với những ca này, phần tiết kiệm lớn nhất tụi em thấy là một người không còn phải ngồi dò sao kê mỗi ngày, và khách không còn chờ xác nhận, kể cả đơn chuyển lúc 11 giờ đêm. Người đó đi làm việc khác.

Chưa cần là quán nhỏ vài đơn mỗi ngày, mã QR tĩnh dán quầy đã đủ, tụi em có [tool tạo mã QR miễn phí](/tao-ma-qr-ngan-hang) cho việc đó. Chưa cần cũng là ai bán chủ yếu cho khách nước ngoài trả thẻ, cổng quốc tế đúng việc hơn dù phí cao. Và tới 28/08/2026, MONA Pay chạy thật với ACB; ai dùng ngân hàng khác thì xem bảng trạng thái ở [ngân hàng hỗ trợ](/ngan-hang), MB, BIDV, VietinBank, OCB, MSB, KienlongBank, TPBank đang đăng ký kết nối, nói thẳng để anh chị khỏi mất công.

## Câu hỏi thường gặp

### API ngân hàng có an toàn không, phần mềm có rút được tiền không?
Các API MONA Pay dùng chỉ theo chiều đọc: nhận thông báo tiền vào, cấp tài khoản ảo, sinh mã QR, tra cứu. Không có lệnh chuyển tiền ra. Mọi thao tác đăng ký đều cần OTP từ ngân hàng gửi về số điện thoại chủ tài khoản.

### Cá nhân có dùng được API ngân hàng qua MONA Pay không?
Được, cần tài khoản ACB đứng tên mình và số điện thoại đăng ký với ACB để nhận 2 lần OTP, nối trong 5 phút. Hộ kinh doanh, solo founder là nhóm tụi em nhắm tới khi mở public năm 2026.

### Kết nối API là gì, có phải thuê lập trình không?
Kết nối API là cho hai phần mềm gọi được nhau qua địa chỉ và khoá xác thực. Với MONA Pay, phần nối ngân hàng tụi em đã làm, anh chị chỉ nối tài khoản ACB trong dashboard. Muốn tiền vào tự mở đơn trên website riêng thì cần dev viết phần nhận webhook, tài liệu có mẫu PHP và Node khoảng 30 dòng.

### API ngân hàng của MONA Pay có mất phí không?
Không. Miễn phí hoàn toàn, không giới hạn giao dịch, không thu phần trăm trên số tiền, và tụi em giữ vậy vì tiền không đi qua MONA Pay nên không có chi phí trung gian nào để thu lại từ anh chị. Phí phía ngân hàng nếu có theo biểu phí ACB, anh chị hỏi ACB.

### Tài liệu API ở đâu cho dev và AI agent?
Tại [monapay.vn/docs](/docs), mỗi trang có bản .md, thêm llms.txt và openapi.json để Claude Code, Codex đọc thẳng và tự viết code tích hợp.

## Nối API ngân hàng lần đầu hôm nay, tụi em ngồi cùng nếu kẹt

Tạo tài khoản tại [my.monapay.vn/auth?mode=register](https://my.monapay.vn/auth?mode=register), đăng ký xong dùng ngay, rồi nối ACB theo 4 bước với 2 lần OTP, bật Telegram hoặc khai webhook, và chuyển thử 10.000 đồng vào mã QR của chính mình để thấy thông báo về trong vài giây. Khoảng 5 phút. Kẹt ở bước nào, gọi 1900 636 648 giờ hành chính, kỹ sư MONA làm cùng anh chị tới khi thông báo đầu tiên về.
