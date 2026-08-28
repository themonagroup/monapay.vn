---
title: "Tài khoản ngân hàng ảo là gì? Virtual account khớp tiền từng đơn"
description: "Tài khoản ngân hàng ảo (virtual account) là số phụ ngân hàng cấp theo đầu số, tiền vẫn về tài khoản chính nhưng biết ngay của đơn nào. Tụi em kể cách ACB cấp."
date: 29/08/2026
keyword: "tài khoản ngân hàng ảo"
category: kien-thuc
h1: "Tài khoản ngân hàng ảo là gì? Vì sao mỗi đơn một số thì tiền tự khớp"
ogImage: /img/blog/tai-khoan-ngan-hang-ao-la-gi.jpg
---

Tài khoản ngân hàng ảo, tiếng Anh là virtual account, viết tắt VA, là số tài khoản phụ do ngân hàng cấp theo một đầu số gắn với tài khoản chính của anh chị: tiền chuyển vào số phụ nào cũng về tài khoản chính, nhưng thông báo ghi rõ số phụ đó. Khách đến MONA làm phần mềm hỏi tụi em tài khoản ảo là gì, tụi em trả lời bằng cách tụi em thu học phí: mỗi học viên một số, tiền vào là biết của ai.

## Tài khoản ảo khác tài khoản phụ thông thường chỗ nào?

Tài khoản phụ thông thường là một tài khoản thật thứ hai, có số dư riêng, mở tại quầy, số lượng vài cái. Tài khoản ảo không có số dư riêng. Nó là một "nhãn" ngân hàng gắn lên dòng tiền vào: ACB cấp cho anh chị một đầu số, ví dụ tiền tố MONA, rồi mỗi số ảo là đầu số cộng phần đuôi do phần mềm đặt. Tiền chuyển vào số ảo chạy thẳng về tài khoản chính, không nằm ở đâu khác, chỉ khác là thông báo giao dịch có kèm số ảo vừa nhận.

Vì không có số dư riêng nên tài khoản ảo tạo được nhiều, tạo bằng API, tạo trong vài giây. Ở [Khánh Hùng Academy](https://khanhhung.academy) với 40.000 học viên, mỗi học viên một số ảo, tiền vào là khoá mở, chạy hơn 4 năm nay. Không ai ngồi đọc nội dung chuyển khoản. Nội dung khách gõ sao cũng được.

Tụi em hay ví với khách: tài khoản chính là cái két, tài khoản ảo là các ngăn thư có tên trên mặt két. Tiền rơi vào ngăn nào, biết ngay của ai, nhưng cuối cùng vẫn nằm trong một cái két.

## Vì sao tài khoản ảo giải được bài "hai khách chuyển cùng số tiền"?

Cách khớp tiền phổ biến là đọc nội dung chuyển khoản: khách gõ DH10234, phần mềm tìm đơn DH10234. Cách này gãy ở hai chỗ tụi em gặp hoài trong 14.000+ dự án. Một, khách gõ sai hoặc gõ "chuyen tien" cho gọn. Hai, hai khách cùng chuyển 500.000 đồng trong cùng buổi, nội dung đều trống, người bán ngồi đoán.

Tài khoản ảo bỏ luôn việc đọc nội dung. Đơn DH10234 được cấp số ảo riêng, tiền vào số đó là của đơn đó, khách gõ gì cũng không sao. Hai khách cùng 500.000 đồng chuyển vào hai số khác nhau, không đoán. Với trung tâm thu học phí theo kỳ, mỗi học viên giữ cố định một số ảo suốt 12 tháng của khoá, phụ huynh chuyển tháng nào cũng đúng em đó. Với chủ nhà trọ, mỗi phòng một số, tiền phòng tháng 9 của phòng 302 không lẫn với phòng 305.

Đây là lý do tụi em xếp tài khoản ảo là nền của tự động xác nhận, còn mã QR động là lớp tiện cho khách bên trên. Có VA rồi thì mã QR động chỉ là cách đóng gói số ảo cộng số tiền thành ô vuông cho khách quét. Hai thứ đi cùng nhau.

## ACB cấp tài khoản ảo cho anh chị theo trình tự nào?

Tụi em kể đúng trình tự MONA Pay đang làm với ACB, kiểm ngày 28/08/2026. Bước một, trong dashboard my.monapay.vn, anh chị nhập số tài khoản ACB đứng tên mình, số điện thoại đã đăng ký với ACB và loại khách hàng cá nhân hay doanh nghiệp. Bước hai, ACB gửi OTP về số điện thoại đó để xác thực việc đăng ký đầu số tài khoản ảo. Bước ba, đăng ký dịch vụ nhận thông báo giao dịch, ACB gửi OTP lần hai. Bước bốn, xong, từ đây tiền vào số ảo nào là MONA Pay nhận thông báo và báo lại cho anh chị.

Bước ba là bước tụi em từng bỏ sót. Ngày 28/08/2026 khi test 50.000 đồng tiền thật, tụi em tạo tài khoản ảo xong mà chưa đăng ký nhận thông báo, tiền vào ACB đúng nhưng hệ thống im lặng. Tìm ra rồi mới hiểu ACB tách hai dịch vụ và cần hai lần OTP. Tụi em sửa wizard thành 4 bước liền mạch ngay hôm đó để không khách nào vấp lại. Vấp một lần là đủ.

Với dân kỹ thuật, toàn bộ trình tự có API tương ứng ở [tài liệu tài khoản ảo](/docs/api/tai-khoan-ao-va): đăng ký VA, xác thực OTP, đăng ký thông báo, xác thực OTP lần hai, tra danh sách VA, huỷ VA.

> Anh chị có tài khoản ACB thì nối thử hôm nay: tạo tài khoản [MONA Pay](https://my.monapay.vn/auth?mode=register), đi 4 bước với 2 lần OTP, tạo một số ảo, chuyển 10.000 đồng vào và xem thông báo về trong vài giây. Miễn phí hoàn toàn, không giới hạn số tài khoản ảo lẫn số giao dịch.

## Tiền vào tài khoản ảo rồi thì phần mềm nhận tin bằng cách nào?

ACB báo cho MONA Pay, MONA Pay báo cho anh chị theo ba đường. Webhook: một gói JSON gồm số tiền, nội dung, mã giao dịch, số tài khoản ảo bay về website hoặc phần mềm, ký HMAC-SHA256, website trả mã 200 trong 10 giây là xong; phần mềm đọc số tài khoản ảo là biết đơn nào, không cần đọc nội dung. Telegram: tin vào nhóm công ty gồm tên ngân hàng, số tài khoản, số tiền, thời gian, nội dung, cấu hình được theo từng số ảo hay mọi tài khoản. Tiền không rời ACB. Dashboard: danh sách giao dịch, lọc, tra tối đa 100 dòng mỗi trang để đối soát.

Ở [Mona.Host](https://mona.host), tụi em dùng webhook: mỗi hoá đơn hosting một số ảo, kể cả gói 12 tháng hay 1 tháng, tiền vào là hoá đơn chuyển sang đã thanh toán và dịch vụ tự gia hạn, chạy hơn 4 năm. Ở khách bán hàng, tụi em thường bật thêm Telegram cho thu ngân nhìn. Tiền lúc nào cũng nằm ở ACB, MONA Pay không giữ đồng nào, nên không có phí. Cổng quốc tế kiểu PayPal thì ngược lại, tiền vào ví của họ trước, thu 4,40% cộng phí cố định cho giao dịch từ nước ngoài, rút về ngân hàng Việt Nam 60.000 đồng mỗi lần, theo biểu phí tụi em kiểm 28/08/2026.

## Giới hạn và những điều tụi em nói trước

Tài khoản ảo chỉ nhận tiền vào, không dùng để chuyển tiền ra, không có số dư riêng, không rút được từ số ảo. Số ảo phụ thuộc ngân hàng cấp: hiện ACB đang hoạt động (cần tài khoản ACB đứng tên anh chị), các ngân hàng khác đang trong quá trình đăng ký kết nối, xem bảng trạng thái ở [ngân hàng hỗ trợ](/ngan-hang). Phí phía ngân hàng cho dịch vụ tài khoản ảo, nếu có, theo biểu phí ACB, tụi em không nói thay. Hỏi ACB cho chắc.

Còn phía MONA Pay: không thu phần trăm, không phí mở, không giới hạn số tài khoản ảo. Một shop 10.000 đơn một tháng tạo 10.000 số ảo cũng như một shop 10 đơn. Chi tiết ở [bảng giá](/bang-gia) và [trang nối ACB](/acb).

## Câu hỏi thường gặp

### Tài khoản ngân hàng ảo có phải là tài khoản giả không?
Không. Đây là dịch vụ chính thức của ngân hàng, số ảo do ACB cấp theo đầu số đăng ký sau 2 lần OTP, tiền về tài khoản thật của anh chị trong vài giây, sao kê ngân hàng ghi đầy đủ.

### Một tài khoản chính tạo được bao nhiêu tài khoản ảo?
MONA Pay không giới hạn, 10 đơn hay 10.000 đơn một tháng đều tạo được. Anh chị tạo theo đơn, theo khách, theo phòng, theo học viên, tuỳ cách khớp tiền của mình.

### Khách chuyển vào tài khoản ảo có mất thêm phí không?
Với khách là chuyển khoản bình thường qua Napas 247 tới một số tài khoản ACB, phí theo ngân hàng của khách như mọi lần chuyển khác.

### Tài khoản ảo và mã QR động dùng cái nào?
Dùng cả hai: số ảo là nền để khớp tiền, mã QR động đóng gói số ảo cộng số tiền cho khách quét khỏi gõ. Tạo mã tại [tài liệu QR thanh toán](/docs/api/qr-thanh-toan) hoặc màn Tạo QR trong dashboard.

### Huỷ tài khoản ảo có ảnh hưởng tiền đã nhận không?
Không. Tiền đã về tài khoản chính từ lúc chuyển, huỷ số ảo chỉ để khách không chuyển nhầm vào đơn cũ. Tiền đã về rồi.

## Tạo tài khoản ảo đầu tiên trong 5 phút, tụi em ngồi cùng nếu kẹt OTP

Đăng ký tại [my.monapay.vn/auth?mode=register](https://my.monapay.vn/auth?mode=register), dùng ngay không chờ duyệt. Vào Ngân hàng và VA, đi 4 bước với 2 lần OTP từ ACB, tạo số ảo cho đơn đầu tiên, chuyển thử 10.000 đồng. Kẹt ở OTP lần hai hay bước nào, gọi 1900 636 648 giờ hành chính, kỹ sư MONA làm cùng anh chị tới khi thông báo đầu tiên về.
