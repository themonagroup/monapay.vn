---
title: "VietQR là gì? Cách mã QR ngân hàng điền sẵn tiền và nội dung"
description: "VietQR là chuẩn mã QR chuyển khoản chung của ngân hàng Việt Nam, app nào quét cũng ra đúng tài khoản, số tiền, nội dung. Tụi em giải thích mã tĩnh, mã động."
date: 29/08/2026
keyword: "vietqr là gì"
category: kien-thuc
h1: "VietQR là gì? Mã QR ngân hàng điền sẵn số tiền và nội dung hoạt động ra sao"
ogImage: /img/blog/vietqr-la-gi.jpg
---

VietQR là chuẩn mã QR chuyển khoản dùng chung cho các ngân hàng Việt Nam, xây trên định dạng EMVCo: trong mã có mã ngân hàng, số tài khoản, số tiền và nội dung, app ngân hàng nào quét cũng điền sẵn lệnh chuyển qua Napas 247. Khách đến MONA làm web bán hàng hỏi tụi em VietQR là gì thì tụi em trả lời gọn vậy, rồi chỉ luôn vì sao mã động theo từng đơn mới là thứ giúp tiền tự khớp.

## Trong một mã VietQR có gì mà app nào quét cũng hiểu?

Mã VietQR thực chất là một chuỗi ký tự được vẽ thành ô vuông. Chuỗi đó viết theo định dạng EMVCo, mỗi mục có mã số, độ dài và giá trị nối đuôi nhau. Mục quan trọng nhất ghi mã BIN của ngân hàng nhận, 6 chữ số, ví dụ ACB là 970416, Vietcombank là 970436, kèm số tài khoản nhận, tụi em kiểm danh sách BIN ngày 28/08/2026. Sau đó là mã tiền tệ 704 tức đồng Việt Nam, số tiền nếu có, nội dung chuyển khoản nếu có, và cuối cùng là 4 ký tự kiểm tra CRC để app biết mã không bị hỏng.

Chuẩn chung, app nào cũng đọc. Vì là chuẩn chung do Napas ban hành nên app của 36 ngân hàng trong danh sách tụi em hỗ trợ đều đọc được, khách dùng app nào cũng vậy. Đây là điểm khác với mã QR của từng ví điện tử, chỉ app ví đó mới quét được. Khách không cần cài thêm gì, có app ngân hàng là đủ, và tụi em thấy đó là lý do lớn nhất khiến chuyển khoản QR thắng ví điện tử ở khâu thanh toán đơn hàng trong nước: không ai phải hỏi khách có ví X hay không.

Tụi em tự viết bộ tạo mã chạy trên trình duyệt tại [công cụ tạo mã QR ngân hàng](/tao-ma-qr-ngan-hang), và trước khi công bố đã kiểm bằng cách giải mã ngược: mã tạo ra được đọc lại đúng chuỗi, 4 ký tự CRC khớp, thử 3 trường hợp gồm mã tĩnh, mã có số tiền 2.500.000 đồng và mã có nội dung 10 ký tự. Số tài khoản không rời khỏi trình duyệt của anh chị, tạo xong trong 1 giây, tải PNG in được từ 4 cm mỗi cạnh.

## Mã VietQR tĩnh và mã động khác nhau ở chỗ nào?

Mã tĩnh chỉ chứa ngân hàng và số tài khoản. Khách quét xong tự gõ số tiền, tự gõ nội dung. Đây là mã dán ở quầy, in trên biển, mã của rất nhiều quán hiện nay. Rẻ, dễ, nhưng khách gõ sai là chuyện thường. Sai một số là lệch đơn. Tụi em từng thấy khách chuyển 250.000 đồng thay vì 2.500.000 đồng, hoặc gõ nội dung "chuyen tien" thay vì mã đơn, người bán ngồi dò sao kê không biết của ai.

Mã động sinh riêng cho từng đơn, điền sẵn số tiền và nội dung, ví dụ 2.500.000 đồng với nội dung DH10234. Khách chỉ bấm xác nhận, mất chừng 5 giây. Vì nội dung là mã đơn nên khi tiền vào, phần mềm đọc thông báo là khớp được ngay đơn nào, không cần người dò. Ở MONA, học phí [Khánh Hùng Academy](https://khanhhung.academy) với 40.000 học viên thu theo cách này hơn 4 năm nay: mỗi học viên một mã, tiền vào là khoá mở.

Bảng dưới là cách tụi em hay giải thích cho khách chọn:

| Tình huống | Mã tĩnh | Mã động từng đơn |
|---|---|---|
| Quán nhỏ, vài đơn mỗi ngày | Đủ dùng | Chưa cần |
| Shop online 50 đơn mỗi ngày | Dò sao kê mệt | Tự khớp đơn |
| Khách gõ sai số tiền | Xảy ra thường | Không xảy ra |
| Cần phần mềm tự xác nhận | Không làm được | Làm được |

## Mã VietQR động ai sinh ra, sinh lúc nào?

Câu này quyết định tự động hoá có thật hay không. Sinh mã động bằng tay từng đơn thì vẫn là người làm, chỉ đổi từ gõ số tiền sang gõ mã. MONA Pay sinh mã tự động qua API ngay khi đơn được tạo: phần mềm của anh chị gọi một lệnh với mã đơn, số tiền, nội dung, MONA Pay trả về mã QR động gắn với tài khoản ảo ACB, phần mềm hiện mã cho khách. Tất cả trong 1 giây.

Đường đi cụ thể tụi em ghi ở [tài liệu QR thanh toán](/docs/api/qr-thanh-toan): gọi POST tạo mã với `orderId`, `amount` tối đa 1.000.000.000 đồng, `description` tối đa 255 ký tự; huỷ mã khi đơn bị huỷ. Với web làm tại MONA, phần này tụi em cài sẵn khi giao, khách chỉ nối tài khoản ACB theo 4 bước với 2 lần OTP, mất chừng 5 phút. Dashboard my.monapay.vn cũng có màn Tạo QR để anh chị sinh tay khi cần, ví dụ đơn đặt qua điện thoại.

> Anh chị muốn thấy mã động chạy thật: tạo tài khoản [MONA Pay](https://my.monapay.vn/auth?mode=register), nối ACB 4 bước, vào màn Tạo QR sinh một mã 10.000 đồng rồi tự quét bằng app ngân hàng của mình. Tiền vào, tin Telegram báo, webhook bay về. Miễn phí 500 giao dịch mỗi tháng, trên đó tính theo số giao dịch.

## Quét VietQR xong, tiền đi đâu và ai xác nhận?

Tiền đi thẳng từ tài khoản của khách sang tài khoản ngân hàng của anh chị qua Napas 247, không qua ví nào, không qua MONA Pay. Đây là lý do VietQR gần như không có phí cho người nhận, khác hẳn cổng thanh toán quốc tế: PayPal thu 4,40% cộng phí cố định cho giao dịch thương mại từ nước ngoài và 60.000 đồng mỗi lần rút về ngân hàng Việt Nam, theo biểu phí tụi em kiểm ngày 28/08/2026. Tiền vào thẳng tài khoản, không mất phần trăm nào.

Phần xác nhận mới là chỗ khác nhau giữa quán dùng mã tĩnh và shop dùng MONA Pay. Với mã tĩnh, anh chị mở app ngân hàng xem. Với tài khoản ảo ACB nối vào MONA Pay, ACB báo có giao dịch, MONA Pay đọc thông báo, bắn webhook về website và gửi tin vào nhóm Telegram gồm tên ngân hàng, số tài khoản, số tiền, thời gian, nội dung. Thu ngân thấy tin là giao hàng. Kế toán cuối ngày mở dashboard, thay vì mở sao kê.

Tụi em nói rõ giới hạn: tới 28/08/2026 MONA Pay mới nối ACB, phần tự xác nhận cần tài khoản ACB đứng tên anh chị. Các ngân hàng khác đang trong quá trình đăng ký kết nối, bảng trạng thái ở [ngân hàng hỗ trợ](/ngan-hang). Mã VietQR cho ngân hàng khác thì tool tạo được bình thường, chỉ phần tự báo là chưa.

## Những lỗi tụi em gặp khi khách tự làm VietQR

Lỗi thứ nhất là nội dung có dấu tiếng Việt hoặc ký tự lạ. Nhiều app ngân hàng cắt hoặc từ chối nội dung như vậy, khách chuyển được nhưng nội dung về trống, phần mềm không khớp đơn. Tụi em giới hạn nội dung 25 ký tự không dấu trong tool, và trong API thì phần mềm nên sinh mã đơn dạng DH10234.

Lỗi thứ hai là dùng mã tĩnh rồi kỳ vọng tự động. Không có mã đơn trong nội dung thì không có cách nào khớp, dù phần mềm giỏi tới đâu. Lỗi thứ ba là tạo tài khoản ảo xong mà quên đăng ký nhận thông báo giao dịch, một bước cần OTP lần hai từ ACB, tiền vào mà hệ thống im lặng. Chính tụi em từng vấp lỗi này khi triển khai, và sửa wizard nối ngân hàng thành 4 bước liền mạch với 2 lần OTP, thiếu 1 lần là tiền vào không báo. Vấp rồi mới hiểu. Anh chị đi sau thì đỡ vấp đúng chỗ tụi em đã vấp.

## Câu hỏi thường gặp

### VietQR có phải là ví điện tử không?
Không. VietQR chỉ là cách đóng gói thông tin chuyển khoản vào mã QR, và tiền đi thẳng từ tài khoản ngân hàng của khách sang tài khoản ngân hàng của anh chị, không nằm trong ví trung gian nào.

### Tạo mã VietQR có mất phí không?
Không. Tool tại monapay.vn tạo miễn phí, chạy trên trình duyệt, không lưu số tài khoản, tạo bao nhiêu mã cũng được. Không cần đăng ký. Phí chuyển khoản nếu có là phí phía ngân hàng của người chuyển theo biểu phí ngân hàng đó.

### Mã VietQR có hạn dùng không?
Mã tĩnh dùng vô thời hạn chừng nào số tài khoản còn hoạt động. Mã động do MONA Pay sinh gắn với một đơn, anh chị huỷ mã qua API hoặc dashboard khi đơn bị huỷ để tránh khách chuyển nhầm cho đơn cũ.

### Khách ở nước ngoài quét VietQR được không?
Không, VietQR chỉ chạy giữa các ngân hàng Việt Nam qua Napas 247. Khách nước ngoài trả bằng thẻ hay PayPal, tụi em phân tích ở [bài cổng thanh toán quốc tế](/cong-thanh-toan-quoc-te).

### Làm sao để mã VietQR tự xác nhận tiền vào?
Nối tài khoản ACB vào MONA Pay theo 4 bước với 2 lần OTP, dùng tài khoản ảo và mã động theo đơn, rồi nhận webhook hoặc Telegram trong vài giây. Hướng dẫn tại [trang nối ACB](/acb).

## Từ mã QR trên biển tới mã tự khớp đơn, chỉ cách nhau một lần nối ACB

Anh chị đang dán mã tĩnh ở quầy thì cứ giữ, nó vẫn chạy. Còn muốn đơn tự xác nhận thì tạo tài khoản tại [my.monapay.vn/auth?mode=register](https://my.monapay.vn/auth?mode=register), nối ACB 4 bước với 2 lần OTP, sinh mã động cho đơn đầu tiên. Mất khoảng 5 phút. Kẹt ở bước nào, gọi 1900 636 648 giờ hành chính, tụi em làm cùng tới khi tin đầu tiên báo về.
