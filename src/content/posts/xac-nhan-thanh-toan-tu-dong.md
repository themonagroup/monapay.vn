---
title: "Xác nhận thanh toán tự động khi khách chuyển khoản: cách MONA làm"
description: "Xác nhận thanh toán tự động chạy bằng cơ chế nào, làm trong 4 bước với tài khoản ACB, lỗi hay gặp. MONA kể từ chuyện tự thu tiền hosting, học phí hơn 4 năm."
date: 29/08/2026
keyword: "xác nhận thanh toán tự động"
category: huong-dan
h1: "Xác nhận thanh toán tự động khi khách chuyển khoản, tụi em làm thế nào"
ogImage: /img/blog/xac-nhan-thanh-toan-tu-dong.jpg
---

Khách đến MONA làm web bán hàng hay phần mềm quản lý, sau 14.000+ dự án tụi em thấy gần như ai cũng kẹt đúng một khâu: khách chuyển khoản xong, phải có người mở app ngân hàng lên coi rồi mới dám giao hàng. Xác nhận thanh toán tự động là cách bỏ hẳn người đó ra khỏi quy trình. Tiền vào tài khoản ACB, ngân hàng báo, phần mềm tự đổi trạng thái đơn trong vài giây. Không ai phải canh. Tụi em tự xây hệ thống này để thu tiền cho chính mình hơn 4 năm, chạy thật lại toàn bộ với 50.000 đồng ngày 28/08/2026, giờ mở cho mọi doanh nghiệp, [miễn phí hoàn toàn](/bang-gia).

## Vì sao khách đến MONA làm web đều kẹt ở khâu xác nhận chuyển khoản?

Ở chính MONA, trước khi có hệ thống này, tụi em thu phí hosting, thu học phí, thu tiền phần mềm bằng đúng cái cách mà đa số chủ shop đang làm: một nhân viên kế toán mở app ngân hàng, đối chiếu số tiền với nội dung chuyển khoản, rồi nhắn cho bộ phận kỹ thuật mở dịch vụ. Nghe đơn giản. Làm mỗi ngày mới thấy mệt.

Khách chuyển lúc 10 giờ tối thì sáng hôm sau mới được xác nhận, vì không ai trực app ngân hàng ban đêm. Khách chuyển thứ bảy, chủ nhật thì chờ tới thứ hai. Hai khách cùng chuyển 500.000 đồng trong một buổi chiều, nội dung một người gõ đúng mã đơn, một người gõ mỗi tên mình, thế là phải gọi điện hỏi lại từng người. Cái mất lớn nhất là chỗ này, chứ tiền thì vẫn vào tài khoản đầy đủ, chỉ có người bị giữ chân.

Khách của MONA làm web bán hàng cũng kể y hệt. Chủ shop quần áo đêm nào cũng cầm điện thoại chụp màn hình app ngân hàng gửi vào nhóm để nhân viên gói hàng. Trung tâm dạy học có hai nhân viên hành chính chỉ để đối chiếu học phí cuối tháng. Đây là chỗ mà một khâu tưởng nhỏ lại ăn mất người thật, giờ thật, và mất luôn cả những đơn khách đợi lâu quá rồi thôi.

## Xác nhận thanh toán tự động chạy bằng cơ chế gì?

Có ba mảnh ghép, và tụi em dùng đủ cả ba cho khách MONA. Mảnh thứ nhất là tài khoản ảo, gọi tắt là VA: ACB cấp cho anh chị một dãy số tài khoản phụ theo đầu số đăng ký, mỗi đơn hàng hoặc mỗi khách gắn một số riêng, tiền chuyển vào số đó vẫn về tài khoản chính của anh chị. Khách chuyển đúng số là hệ thống biết tiền của đơn nào, không cần khách gõ đúng nội dung.

Mảnh thứ hai là mã VietQR động. Thay vì bắt khách gõ số tài khoản, số tiền và nội dung, anh chị đưa ra một mã QR đã điền sẵn tất cả, khách quét bằng app ngân hàng nào cũng được. Sai số tiền, sai nội dung gần như không còn.

Mảnh thứ ba là thông báo từ ngân hàng và webhook. Khi tiền vào, ACB gửi thông báo giao dịch tới MONA Pay theo bộ API dành cho đối tác của ACB, MONA Pay khớp giao dịch với đơn rồi gửi một gói tin HTTP về website hoặc phần mềm của anh chị. Gói tin đó tụi em ký bằng HMAC-SHA256, kèm dấu thời gian, phía anh chị từ chối nếu lệch quá 5 phút, nên không ai giả mạo được thông báo tiền vào. Máy chủ của anh chị trả mã 200, 201 hoặc 202 trong 10 giây là xong một vòng. Tiền không đi qua MONA Pay. Nó vào thẳng tài khoản ACB của anh chị, MONA Pay chỉ đọc thông báo rồi báo lại, đây là điểm tụi em nói đi nói lại với mọi khách vì ai cũng hỏi.

## Trước khi có hệ thống riêng, tụi em đã thử cách nào và vì sao bỏ?

Tụi em từng thử cách mà nhiều anh chị đang tính: ráp bằng công cụ tự động không cần lập trình, đọc email thông báo của ngân hàng rồi bắn sang bảng tính. Chạy được vài tuần. Rồi ngân hàng đổi mẫu email, luồng gãy, không ai canh, ba ngày sau mới phát hiện có hai chục giao dịch chưa được xác nhận. Đó là lý do tụi em không khuyến khích đưa mấy luồng tự ráp kiểu này vào việc thu tiền thật của doanh nghiệp: không phải vì công cụ dở, mà vì bảo trì tốn người hơn cái nó tiết kiệm được, và một lỗi là mất đơn ngay.

Cách thứ hai là thuê thêm người trực. Cách này chạy, nhưng chỉ chạy trong giờ hành chính. Khách của tụi em thì mua hosting lúc nửa đêm, đóng học phí cuối tuần.

Nên tụi em viết phần mềm riêng, nối thẳng vào ngân hàng, để thông báo tiền vào chạy thẳng vào phần mềm quản lý chứ không đi vòng qua email hay bảng tính. Chạy hơn 4 năm, thu tiền cho [Mona.Host](https://mona.host), cho Khánh Hùng Academy với 40.000 học viên, cho đơn phần mềm của Mona.Software, rồi từ 2022 nhúng vào web bán hàng và phần mềm giao cho khách, tới nay hơn 6.000 khách hàng mới của MONA dùng. Năm 2026 tụi em mở nó ra thành [MONA Pay](/gioi-thieu) cho mọi doanh nghiệp.

## Làm xác nhận thanh toán tự động với MONA Pay trong 4 bước

Tụi em đã rút quy trình xuống còn 4 bước trong dashboard, người không rành kỹ thuật vẫn tự đi được, chỉ khâu nối website là cần người làm web.

Bước 1, tạo tài khoản tại [my.monapay.vn](https://my.monapay.vn/auth?mode=register). Đăng ký xong dùng ngay, không có ai duyệt, không chờ giờ làm việc. Cần đúng ba thứ: tên đăng nhập, mật khẩu, tên doanh nghiệp.

Bước 2, nối tài khoản ACB. Vào mục Ngân hàng và VA, bấm nối tài khoản, nhập số tài khoản ACB đứng tên anh chị, số điện thoại đã đăng ký với ACB và loại khách hàng. ACB gửi OTP về điện thoại, nhập mã để tạo tài khoản ảo. Rồi ACB gửi OTP lần thứ hai để đăng ký nhận thông báo giao dịch. Hai lần OTP là bắt buộc, thiếu lần hai thì tiền vào không có thông báo, tụi em nói kỹ ở phần dưới vì chính tụi em từng dính.

Bước 3, chọn cách nhận thông báo. Muốn cả công ty thấy tiền vào thì vào mục Telegram, thêm bot vào nhóm, dán mã nhóm, bấm gửi thử. Muốn website hay phần mềm tự xử lý đơn thì vào mục Webhooks, dán địa chỉ nhận của anh chị, chọn ký HMAC-SHA256, đặt khoá bí mật, bấm gửi thử để thấy gói tin mẫu chạy về.

Bước 4, chuyển thử một khoản tiền thật. Tụi em luôn kêu khách làm bước này, đừng tin màn hình gửi thử, phải thấy tiền thật đi trọn một vòng. Nếu website của anh chị chạy WooCommerce hay WordPress, phần nhận webhook có mã mẫu sẵn ở [trang WooCommerce](/cong-thanh-toan-woocommerce) và [trang WordPress](/cong-thanh-toan-wordpress), dev dán vào là chạy.

Anh chị chưa muốn đụng tới code, chỉ muốn thử xem tiền vào có báo không, thì cứ làm bước 1 tới bước 3 với Telegram trước. Không mất tiền, không giới hạn số giao dịch, cả nhóm thấy thông báo là biết hệ thống hợp với mình hay không, rồi hãy tính chuyện nối website sau.

## Hố tụi em vấp ngày 28/08/2026: tạo tài khoản ảo xong mà tiền vào không báo

Kể chuyện này vì nó sẽ tiết kiệm cho anh chị một buổi chiều. Ngày 28/08/2026, tụi em chạy thật toàn bộ luồng bằng tiền thật: chuyển 50.000 đồng vào tài khoản ảo, chờ ACB báo, xem MONA Pay ghi nhận, xem webhook bắn về máy nhận và kiểm chữ ký. Lần đầu chuyển, tiền vào tài khoản mà hệ thống im re. Thiếu một cái OTP.

Nguyên nhân nằm ở phía ngân hàng, và hoàn toàn hợp lý: tạo tài khoản ảo là một dịch vụ, nhận thông báo giao dịch là một dịch vụ khác, ACB yêu cầu xác thực OTP riêng cho từng dịch vụ. Bản cũ của tụi em chỉ làm OTP lần đầu. Sửa xong, wizard nối ngân hàng đi liền 4 bước với 2 lần OTP, chuyển lại 50.000 đồng, thông báo về, webhook về, chữ ký khớp đúng công thức tụi em công bố trong [tài liệu bảo mật](/docs/webhooks/bao-mat). Từ hôm đó đến giờ quy trình là vậy, anh chị cứ làm đủ hai lần OTP là yên tâm.

Bài học rút ra là đừng tin cái gì chưa chạy tiền thật. Mọi thứ trên màn hình có thể xanh hết mà tiền vẫn không báo, chỉ vì thiếu một cái OTP.

## Website và phần mềm nhận được tín hiệu rồi làm gì tiếp?

Gói tin webhook của MONA Pay chỉ có 7 trường: số tiền, nội dung chuyển khoản, thời gian, mã giao dịch, số tài khoản nhận, tên ngân hàng và loại giao dịch. Phần mềm của anh chị đọc mã giao dịch, so với đơn, đổi trạng thái sang đã thanh toán, rồi làm việc tiếp theo của riêng mình: mở khoá học, kích hoạt hosting, in phiếu gói hàng, gửi hoá đơn.

Với khách làm web tại MONA, tụi em nhúng sẵn phần này. Với web làm ở nơi khác, dev của anh chị đọc [hướng dẫn tích hợp webhook](/docs/webhooks/tich-hop-webhook), có mã mẫu cURL, PHP và Node, dán vào là chạy trong buổi sáng. Có một chi tiết tụi em luôn dặn: dùng mã giao dịch làm khoá chống trùng trong cơ sở dữ liệu, vì cùng một giao dịch có thể được gửi lại nhiều lần khi anh chị bấm gửi lại từ dashboard.

Gửi thất bại thì sao? Mỗi lần gửi đều có lịch sử trong dashboard: mã HTTP, thời gian phản hồi và nhãn lỗi rõ ràng như TIMEOUT, SSL, DNS, HTTP_5XX. Máy chủ anh chị sập lúc 2 giờ sáng, sáng ra mở lịch sử, bấm gửi lại từng dòng là đơn được xác nhận đủ, không mất giao dịch nào vì tiền vẫn nằm ở ngân hàng, MONA Pay giữ bản ghi. Gửi lại tự động theo lịch tối đa 7 lần tụi em đang triển khai, có là công bố tại trang tài liệu.

## Xác nhận thanh toán tự động tốn bao nhiêu tiền?

Với MONA Pay là 0 đồng. Miễn phí hoàn toàn, không giới hạn số giao dịch, không thu phần trăm trên số tiền, không phí mở tài khoản, không phí nối ngân hàng. Giới hạn duy nhất là fair-use chống lạm dụng, ai dùng bình thường không chạm tới.

Tụi em để miễn phí được vì ba lẽ. Hạ tầng này đã chạy sẵn hơn 4 năm cho chính MONA và cho hơn 6.000 khách hàng MONA từ 2022, mở thêm người dùng gần như không tốn thêm. Tiền không đi qua MONA Pay nên không có phí trung gian để thu. Và MONA sống bằng làm web, hosting, phần mềm, cổng thanh toán tự động chỉ làm mấy thứ đó chạy trọn vẹn hơn.

Để anh chị dễ hình dung, cổng thanh toán quốc tế như PayPal thu 4,40% cộng phí cố định cho mỗi giao dịch thương mại từ ngoài Việt Nam, rút tiền về ngân hàng Việt Nam thêm 60.000 đồng mỗi lần, theo biểu phí PayPal công bố mà tụi em kiểm ngày 28/08/2026. Một đơn 10 triệu đồng mất hơn 440.000 đồng phí. Với khách trong nước chuyển khoản, khoản đó bằng 0. Bài so sánh đầy đủ ở [trang cổng thanh toán quốc tế](/cong-thanh-toan-quoc-te).

Nếu anh chị đang trả người ngồi canh app ngân hàng, hoặc đang mất đơn vì khách chờ xác nhận quá lâu, thì thử ngay hôm nay: tạo tài khoản tại [my.monapay.vn/auth?mode=register](https://my.monapay.vn/auth?mode=register), nối ACB theo 4 bước với 2 lần OTP, chuyển thử 10.000 đồng rồi xem thông báo về Telegram. Kẹt bước nào, gọi 1900 636 648 giờ hành chính, kỹ sư MONA ngồi cùng anh chị tới khi tin đầu tiên chạy về. Web làm tại MONA thì tụi em cài luôn phần nối website, anh chị không phải chạm code.

## Câu hỏi thường gặp

### Xác nhận thanh toán tự động có cần khách cài app gì không?

Không. Khách chuyển khoản bằng app ngân hàng bất kỳ, quét mã VietQR hoặc chuyển vào số tài khoản ảo. Phía tự động nằm ở anh chị, khách không thấy khác gì so với chuyển khoản bình thường.

### Tiền có đi qua MONA Pay không?

Không. Tiền vào thẳng tài khoản ACB của anh chị, còn MONA Pay chỉ nhận thông báo giao dịch từ ACB theo bộ API dành cho đối tác rồi báo lại cho website, phần mềm hoặc nhóm Telegram của anh chị trong vài giây. Tụi em không giữ tiền.

### Mất bao lâu để tiền vào được xác nhận?

Ngân hàng báo là hệ thống báo ngay, thường tính bằng giây. Phía website của anh chị trả lời trong 10 giây là hoàn tất một vòng. Lần tụi em chuyển 50.000 đồng ngày 28/08/2026, thông báo Telegram và webhook về gần như cùng lúc.

### Tôi chưa có tài khoản ACB thì sao?

Hiện ACB đang hoạt động, anh chị mở tài khoản tại ACB rồi nối vào. MB, BIDV, VietinBank, OCB, MSB, KienlongBank, TPBank đang đăng ký kết nối, bảng trạng thái ở [ngân hàng hỗ trợ](/ngan-hang); webhook, Telegram dùng chung mọi ngân hàng nên nối thêm sau không phải sửa gì.

### Có mất phí gì không?

Không. MONA Pay miễn phí hoàn toàn, không giới hạn giao dịch. Phí phía ngân hàng theo biểu phí của ACB, anh chị hỏi ACB khi mở tài khoản.
