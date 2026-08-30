---
title: "Open banking là gì? Ngân hàng mở API thì doanh nghiệp được gì"
description: "Open banking là việc ngân hàng mở API cho bên thứ ba để đọc giao dịch, cấp tài khoản ảo, sinh mã QR. Tụi em kể vì sao MONA Pay mở cho mọi doanh nghiệp năm 2026."
date: 29/08/2026
keyword: "open banking là gì"
category: kien-thuc
h1: "Open banking là gì? Ngân hàng mở API thì doanh nghiệp nhỏ được gì"
ogImage: /img/blog/open-banking-la-gi.jpg
---

Open banking là mô hình ngân hàng mở các cửa API cho bên thứ ba được phép kết nối, để phần mềm bên ngoài đọc được giao dịch, cấp tài khoản ảo, sinh mã QR hay khởi tạo dịch vụ thay cho khách hàng, thay vì mọi thứ phải làm trong app của ngân hàng. Khách đến MONA hỏi tụi em open banking là gì, tụi em kể bằng chuyện thật: nhờ ngân hàng thoáng hơn mà hệ thống thu tiền tụi em dùng nội bộ hơn 4 năm mới mở ra được cho mọi doanh nghiệp. Bài này nói phần nhận tiền.

## Trước open banking, phần mềm đứng ngoài cửa ngân hàng

Tụi em làm phần mềm từ năm 2016, và trong nhiều năm, ngân hàng với phần mềm là hai thế giới không chạm nhau. Phần mềm bán hàng biết đơn, ngân hàng biết tiền, hai bên không nói chuyện. Người đứng giữa là nhân viên: mở app ngân hàng, nhìn tiền vào, quay sang phần mềm bấm đã thanh toán. Khách chuyển 9 giờ tối thì chờ tới 8 giờ sáng hôm sau. Chính MONA cũng từng có người làm việc này, mỗi ngày mở app vài chục lần.

Cách duy nhất để phần mềm biết tiền vào khi đó là những mẹo không chính thức, đọc tin nhắn SMS biến động số dư hay đăng nhập giả lập vào internet banking. Chập chờn, ngân hàng đổi giao diện là gãy, và về bản chất là dùng tài khoản theo cách ngân hàng không cho phép. Tụi em không đi đường đó cho khách, vì một lần ngân hàng khoá tài khoản do đăng nhập bất thường là tiền thu cả tháng kẹt lại, không đáng để đổi lấy vài giây tiện.

Open banking đổi cách đặt vấn đề: ngân hàng chủ động mở cửa, có xác thực, có hợp đồng, có tài liệu, và phần mềm được phép đứng trong nhà thay vì rình ngoài cửa sổ. Khác nhau ở chỗ được phép. Được phép thì có tài liệu để đọc, có người để hỏi, và có chỗ để khiếu nại khi sai.

## Ngân hàng mở gì, và mở cho ai?

Ở Việt Nam, những gì tụi em thấy đã mở và đang dùng thật với ACB gồm 4 việc: cấp tài khoản ảo theo đầu số cho từng đơn hay từng khách, gửi thông báo mỗi giao dịch về phần mềm ngay khi tiền vào, sinh mã VietQR động điền sẵn số tiền và nội dung, tra cứu giao dịch để đối soát. Đó là mặt "nhận tiền" của open banking, phần tụi em quan tâm nhất vì nó bỏ được việc canh app. Bốn việc, một mục đích. Mặt thanh toán chủ động hay cho vay tụi em không làm nên không bàn ở đây.

Cửa mở cho đối tác kỹ thuật, không mở cho từng khách lẻ. Nghĩa là một shop online không tự xin API ngân hàng, mà dùng qua một lớp như MONA Pay đã nối sẵn. Chủ tài khoản vẫn giữ quyền cuối cùng: mọi lần đăng ký tài khoản ảo hay bật nhận thông báo đều cần OTP ngân hàng gửi về số điện thoại của chủ tài khoản, với ACB là 2 lần. Không có OTP thì không ai gắn được gì vào tài khoản của anh chị. Chủ tài khoản giữ chìa.

Tới 28/08/2026 MONA Pay chạy thật với ACB; MB, BIDV, VietinBank, OCB, MSB, KienlongBank, TPBank đang trong quá trình đăng ký kết nối API đối tác, tụi em cập nhật trạng thái từng ngân hàng ở [ngân hàng hỗ trợ](/ngan-hang) thay vì hứa ngày. Có là nói, chưa có thì không hứa, vì khách MONA đã hỏi tên ngân hàng khác nhiều lần và tụi em thà trả lời chậm còn hơn trả lời sai.

## Vì sao open banking là lý do MONA Pay mở public năm 2026

Hệ thống này sinh ra để thu tiền cho chính MONA, chưa từng có ý bán: phí hosting của [Mona.Host](https://mona.host), học phí Khánh Hùng Academy với 40.000 học viên và 760 học viên PRO, đơn phần mềm của Mona.Software. Rồi từ năm 2022 tụi em nhúng vào web bán hàng, phần mềm giao cho khách: tới nay hơn 6.000 khách hàng mới của MONA thu tiền qua nó. Hơn 4 năm đó tụi em vá nó bằng tiền thật của chính mình và của khách MONA trước khi mở cho người ngoài.

Năm 2026 tụi em mở ra vì hai lý do. Một, ngân hàng đã thoáng hơn hẳn, API đối tác có tài liệu, có quy trình, không còn là cửa hẹp chỉ dành cho vài công ty lớn. Hai, tụi em muốn phục vụ không chỉ doanh nghiệp lớn mà cả SME, hộ kinh doanh, người làm phần mềm một mình. Với nhóm này, một cổng nhận tiền tự động trước đây là thứ xa xỉ. Giờ thì đăng ký xong dùng ngay, miễn phí 500 giao dịch mỗi tháng, trên đó tính theo số giao dịch, chi tiết ở [bảng giá](/bang-gia). Chuyện tụi em kể kỹ ở [trang giới thiệu](/gioi-thieu).

> Anh chị muốn nếm open banking bằng tiền thật thay vì đọc: tạo tài khoản [MONA Pay](https://my.monapay.vn/auth?mode=register), nối ACB 4 bước, chuyển 10.000 đồng vào mã QR của mình, xem thông báo về Telegram trong vài giây. Không ký hợp đồng, không mất phí.

## Doanh nghiệp nhỏ được gì cụ thể, đo bằng gì?

Tụi em đo bằng việc đã biến mất. Việc thứ nhất là canh app ngân hàng: thông báo tiền vào tự bay về phần mềm hoặc nhóm Telegram gồm tên ngân hàng, số tài khoản, số tiền, thời gian, nội dung. Việc thứ hai là dò sao kê cuối ngày: mỗi đơn một tài khoản ảo hoặc một mã QR động, tiền vào là khớp đúng đơn, không đoán. Việc thứ ba là chờ giờ hành chính: khách chuyển 11 giờ đêm, đơn mở 11 giờ đêm. Không ai thức.

Có một thứ open banking kiểu này không làm: giữ tiền. Tiền đi thẳng từ khách sang tài khoản ngân hàng của anh chị, MONA Pay chỉ đọc thông báo. Vì vậy không có phí trung gian, khác hẳn cổng quốc tế kiểu PayPal thu 4,40% cộng phí cố định cho giao dịch từ nước ngoài và 60.000 đồng mỗi lần rút về ngân hàng Việt Nam theo biểu phí tụi em kiểm ngày 28/08/2026. Với thu tiền trong nước, tụi em thấy không có lý do gì để trả phần trăm, vì đường đi thẳng ngân hàng sang ngân hàng vốn đã có sẵn và gần như không tốn gì.

Ở khách MONA làm web bán hàng, kết quả tụi em thấy lặp lại: người từng ngồi xác nhận đơn chuyển sang làm việc khác, khách hết hỏi "shop nhận được tiền chưa". Tụi em không gán số giờ tiết kiệm vì không đo từng khách, nhưng cái người đó thôi làm thì thấy rõ, và thường sau 1 tháng chủ shop quên luôn mình từng có việc này. Quên là dấu hiệu tốt, tụi em mong thấy ở mọi khách.

## Open banking có rủi ro gì, tụi em phòng thế nào?

Rủi ro thật nằm ở phần thông báo đi ra ngoài ngân hàng. Khi thông báo tiền vào được bắn tới website của anh chị, kẻ xấu có thể giả một gói tin "tiền đã vào" để lừa mở đơn. MONA Pay ký mọi gói tin bằng HMAC-SHA256 kèm mốc thời gian, website kiểm chữ ký rồi mới tin, gói tin lệch quá 5 phút bị từ chối. Công thức chữ ký công bố tại [trang bảo mật webhook](/docs/webhooks/bao-mat), anh chị tự kiểm lại được bằng lệnh cURL.

Rủi ro thứ hai là bỏ sót: website đang khởi động lại đúng lúc thông báo tới. Lịch sử từng lần gửi trong dashboard ghi mã HTTP và nhãn lỗi, anh chị bấm gửi lại, và phần gửi lại tự động tối đa 7 lần tụi em đang triển khai. Rủi ro thứ ba là lỗi cấu hình phía người dùng, ví dụ tạo tài khoản ảo xong quên bật nhận thông báo, chính tụi em từng vấp rồi sửa wizard thành 4 bước liền mạch. Vấp thật, sửa thật, cùng ngày.

## Câu hỏi thường gặp

### Open banking có nghĩa là ai cũng xem được tài khoản của tôi?
Không. Chỉ đối tác được ngân hàng cấp phép mới gọi được API, và mọi kết nối vào tài khoản của anh chị đều phải có OTP do ngân hàng gửi về số điện thoại chủ tài khoản, với ACB là 2 lần. Không có OTP là không nối được. Chủ tài khoản luôn là người giữ chìa khoá cuối cùng. Tụi em cũng không nối hộ được nếu anh chị không bấm OTP.

### Open banking ở Việt Nam đã dùng được chưa?
Đã dùng được với ngân hàng đã mở API đối tác. MONA Pay đang chạy thật trên API của ACB từ hơn 4 năm với chính MONA và hơn 6.000 khách hàng MONA, tới 28/08/2026 mở cho mọi doanh nghiệp. Đăng ký xong là dùng ngay, không có bước chờ duyệt.

### Doanh nghiệp nhỏ có tự xin API ngân hàng được không?
Thường không, vì cần pháp nhân, hồ sơ và đội kỹ thuật. Cách thực tế là dùng qua lớp trung gian đã nối sẵn như MONA Pay, tự đăng ký tại my.monapay.vn và nối tài khoản ACB trong 4 bước. Cả việc mất khoảng 5 phút kể cả 2 lần OTP. Không cần dev.

### Open banking có làm tiền đi qua bên thứ ba không?
Với MONA Pay thì không, tiền không ghé qua tụi em. Tiền vào thẳng tài khoản ACB của anh chị, tụi em chỉ đọc thông báo giao dịch và báo lại qua webhook, Telegram, dashboard. Không giữ đồng nào.

### Ngoài nhận tiền, open banking còn dùng làm gì?
Còn nhiều việc như kiểm tra danh tính, cho vay, thanh toán chủ động, nhưng tụi em chỉ làm phần nhận tiền và nói về phần đó, vì đó là thứ tụi em chạy thật hơn 4 năm và dám đứng tên. Chi tiết kỹ thuật ở [tài liệu MONA Pay](/docs).

## Thử open banking bằng tài khoản ACB của anh chị trong 5 phút

Đăng ký tại [my.monapay.vn/auth?mode=register](https://my.monapay.vn/auth?mode=register), dùng ngay không chờ duyệt, nối ACB 4 bước với 2 lần OTP, bật Telegram, rồi chuyển thử 10.000 đồng vào mã QR của mình để thấy thông báo về trong vài giây. Cả việc mất chừng 5 phút, tính cả 2 lần OTP. Kẹt ở bước OTP hay bước nào, gọi 1900 636 648 giờ hành chính, kỹ sư MONA làm cùng anh chị tới khi tin đầu tiên báo về.
