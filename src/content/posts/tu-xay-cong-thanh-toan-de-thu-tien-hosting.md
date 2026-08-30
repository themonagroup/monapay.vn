---
title: "Tự động xác nhận thanh toán hosting: chuyện tụi em tự xây"
description: "MONA kể cách tự xây hệ thống tự động xác nhận thanh toán hosting, học phí, phần mềm hơn 4 năm trước: tài khoản ảo, webhook ký HMAC, rồi nhúng vào web khách."
date: 29/08/2026
keyword: "tự động xác nhận thanh toán hosting"
category: chuyen-mona
h1: "Tự động xác nhận thanh toán hosting: chuyện tụi em tự xây hệ thống thu tiền cho mình"
ogImage: /img/blog/tu-xay-cong-thanh-toan-de-thu-tien-hosting.jpg
---

Tự động xác nhận thanh toán hosting ở MONA nghĩa là khách chuyển khoản xong, hệ thống nhận thông báo từ ngân hàng, khớp đúng hoá đơn rồi tự gia hạn gói mà không cần người bấm gì. Tụi em xây cơ chế này hơn 4 năm trước cho chính Mona.Host, sau đó dùng luôn cho học phí Khánh Hùng Academy và tiền phần mềm Mona.Software, rồi từ năm 2022 nhúng vào web, phần mềm giao khách, tới nay hơn 6.000 khách hàng mới của MONA thu tiền qua đó. Sau 14.000 dự án tụi em thấy chủ web nào cũng kẹt đúng chỗ này, nên bài này kể cụ thể tụi em vấp cái gì, học được gì, và vì sao giờ nó thành [MONA Pay](/) cho mọi doanh nghiệp. Kể thật, không tô màu.

## Khách gia hạn hosting lúc 11 giờ đêm và cái web phải chờ tới sáng

Hosting có một đặc điểm khiến khâu thu tiền khó hơn bán hàng thường: hết hạn là web tắt. Khách của Mona.Host nhớ ra gia hạn thường vào lúc web đã ngừng chạy, nhiều khi là 11 giờ đêm hay sáng chủ nhật. Họ chuyển khoản ngay, chụp màn hình gửi vào Zalo, rồi ngồi chờ. Hồi chưa có hệ thống, người mở lại web cho họ là kỹ thuật viên trực, và người xác nhận khoản tiền là kế toán, hai người đó không ngồi cùng nhau lúc 11 giờ đêm.

Kế toán bên tụi em hồi đó mở app ngân hàng gần như cả ngày. Mỗi khoản tiền vào phải dò xem của tài khoản hosting nào, vì nội dung chuyển khoản khách gõ đủ kiểu: sai tên miền, thiếu mã hoá đơn, có người ghi mỗi chữ "gia hạn". Có ngày hai khách chuyển cùng 1.200.000 đồng cho hai gói giống nhau, kế toán phải nhắn hỏi từng người mới dám gán. Chỗ đó tốn người nhất, vì việc lặp đi lặp lại cả ngày mà lại không được phép sai một khoản nào. Mệt mà không thấy.

Tụi em từng thử cách mọi người vẫn thử: bật SMS biến động số dư về điện thoại kế toán rồi chuyển tiếp vào nhóm. Chạy được một thời gian thì thấy hai lỗ hổng, một là tin nhắn không có mã đơn nên vẫn phải dò tay, hai là đưa tin biến động số dư của toàn công ty cho nhiều người xem là chuyện chủ doanh nghiệp nào cũng ngại.

## Bài học một: mỗi hoá đơn cần một tài khoản ảo riêng thì máy mới khớp được

Cái gỡ được bài toán dò tay là tài khoản ảo. Ngân hàng cấp cho tụi em một đầu số, từ đó sinh ra mỗi hoá đơn hosting một số tài khoản ảo riêng, tiền chuyển vào số nào thì tài khoản chính vẫn nhận, nhưng thông báo giao dịch có kèm số ảo đó. Khách gõ nội dung gì cũng được, thậm chí để trống. Máy nhìn số ảo là biết đơn.

Từ lúc chuyển sang cách này, chuyện hai khách chuyển cùng 1.200.000 đồng không còn là vấn đề, vì mỗi khoản đi vào một số khác nhau. Mã VietQR in trên hoá đơn cũng điền sẵn số tài khoản ảo và số tiền, khách quét là xong, không cần gõ. Đây là thứ tụi em thấy sau nhiều năm thu tiền: đừng bắt khách gõ đúng nội dung, hãy làm cho nội dung không còn quan trọng.

Hiện MONA Pay làm đúng việc này với ACB (các ngân hàng khác đang đăng ký kết nối, xem [ngân hàng hỗ trợ](/ngan-hang)), anh chị xem cách đăng ký tài khoản ảo ở trang [nhận tiền ACB theo thời gian thực](/acb). Đăng ký cần 2 lần OTP về số điện thoại chủ tài khoản, lần đầu để tạo tài khoản ảo, lần hai để đăng ký nhận thông báo giao dịch cho nó.

## Bài học hai: web phải nhận tin từ máy chủ bằng webhook có chữ ký, không phải từ người

Khớp được hoá đơn rồi thì phải làm gì đó với kết quả, và tụi em muốn máy làm. Cách tụi em chọn là webhook: hệ thống thu tiền gửi một gói tin tới phần mềm quản lý hosting, phần mềm tự gia hạn, tự gửi email cho khách. Với Khánh Hùng Academy thì gói tin đó mở khoá học cho học viên vừa đóng tiền, với Mona.Software thì đổi trạng thái đợt thanh toán của hợp đồng.

Ngay tuần đầu tụi em học được bài đắt. Không chữ ký, ai gọi cũng được. Một gói tin giả "đã nhận 5.000.000 đồng" có thể mở hosting cho người chưa trả tiền. Nên từ đó mọi gói tin đều ký HMAC-SHA256 bằng khoá bí mật riêng của từng nơi nhận, kèm dấu thời gian, và nơi nhận từ chối gói tin lệch giờ quá 5 phút để chặn kẻ phát lại gói cũ. Cơ chế đó giữ nguyên tới bản MONA Pay hôm nay, công thức ký công bố trong tài liệu [bảo mật webhook](/docs/webhooks/bao-mat), có sẵn mẫu PHP và Node để anh chị dán vào.

Còn phần thông báo cho người, tụi em đưa vào Telegram. Mỗi khoản tiền vào là một tin nhắn trong nhóm có tên ngân hàng, số tài khoản, số tiền, thời gian, nội dung. Kế toán, kỹ thuật trực, chủ đều thấy cùng lúc mà không ai phải cầm app ngân hàng. Anh chị xem cách cấu hình ở trang [báo biến động số dư qua Telegram](/chia-se-bien-dong-so-du-telegram).

Anh chị đang tự thu tiền cho phần mềm hay dịch vụ định kỳ của mình? Tạo tài khoản ở [my.monapay.vn](https://my.monapay.vn/auth?mode=register), nối ACB, khai địa chỉ webhook của phần mềm, và chuyển thử 10.000 đồng để xem gói tin về. Miễn phí 500 giao dịch mỗi tháng, trên đó tính theo số giao dịch.

## Bài học ba: máy nhận sẽ có lúc chết, nên phải có lịch sử và nút gửi lại

Cái tụi em không lường lúc đầu là máy nhận webhook cũng hỏng. Máy chủ web bảo trì, chứng chỉ SSL hết hạn, đổi tên miền quên đổi địa chỉ nhận, hoặc đơn giản là phần mềm phía nhận trả lời chậm quá. Lần đầu gặp, một loạt hoá đơn hosting đã có tiền mà không được gia hạn, và tụi em chỉ biết khi khách gọi. Đau ở chỗ đó.

Từ đó hệ thống ghi lại từng lần gửi: gửi lúc nào, máy nhận trả mã gì, mất bao nhiêu mili giây, lỗi thuộc loại nào trong nhóm hết giờ chờ, lỗi SSL, lỗi tên miền, lỗi kết nối hay lỗi phía máy nhận. Nơi nhận trả lời 200, 201 hoặc 202 trong 10 giây thì tính thành công, còn lại tính thất bại và hiện đỏ trên bảng. Người trực nhìn bảng là biết đường ống gãy ở đâu, bấm gửi lại là gói tin đi lại với đúng mã giao dịch cũ, phần mềm nhận nhìn mã là biết đã xử lý hay chưa, không gia hạn hai lần.

Phần gửi lại tự động theo lịch tối đa 7 lần tụi em đang triển khai cho bản public, hiện vẫn là bấm tay. Tụi em ghi rõ trong tài liệu [gửi lại và xử lý lỗi](/docs/webhooks/gui-lai-va-xu-ly-loi) thay vì viết như đã có.

## Từ thu tiền cho mình sang thu tiền cho web của khách

Khi cơ chế chạy ổn cho hosting, học phí và phần mềm, tụi em nhìn lại các web bán hàng đang giao cho khách và thấy chúng đều kẹt đúng chỗ tụi em từng kẹt. Khách của chủ shop chuyển khoản, chụp màn hình, nhắn Zalo, rồi chờ. Chủ shop hoặc nhân viên mở app ngân hàng đối chiếu, rồi vào trang quản trị đổi trạng thái đơn bằng tay. Tụi em mang nguyên cơ chế tài khoản ảo và webhook nhúng vào web WooCommerce và phần mềm quản lý giao khách, đơn tự sang đã thanh toán khi tiền về.

Hệ MONA từ năm 2016 tới giờ có hơn 14.000 dự án, phần lớn là web bán hàng và phần mềm nghiệp vụ, nên số nơi chạy cơ chế này lớn dần theo từng dự án bàn giao. Từ năm 2022 tới nay hơn 6.000 khách hàng mới của MONA đã dùng, nhưng suốt thời gian đó nó vẫn là thứ chỉ khách MONA có. Người ngoài không đăng ký được. Tới tháng 8 năm 2026 tụi em mở ra thành MONA Pay để ai cũng tự đăng ký được, vì bài toán này không phân biệt công ty lớn hay tiệm nhỏ. Anh chị đọc chuyện mở public ở bài [MONA Pay mở cho mọi doanh nghiệp](/blog/mona-pay-mo-public-sau-4-nam).

Điều tụi em muốn nói với chủ web hay chủ phần mềm đang tự thu tiền: đừng bắt đầu bằng cách canh app ngân hàng rồi tính tự động hoá sau. Bắt đầu bằng tài khoản ảo riêng cho từng đơn và một địa chỉ nhận webhook có chữ ký. Hai thứ đó tụi em mất hơn 4 năm để làm cho chắc, và giờ anh chị lấy dùng miễn phí.

## Anh chị thu tiền định kỳ thì làm ngay hôm nay

Nếu anh chị bán hosting, khoá học, phần mềm, hội viên hay bất cứ thứ gì thu tiền lặp lại, và vẫn có người ngồi đối chiếu chuyển khoản mỗi ngày, thì đây là việc đáng làm trong tuần này. Tạo tài khoản tại [my.monapay.vn](https://my.monapay.vn/auth?mode=register), nối ACB qua 4 bước với 2 lần OTP, khai webhook về phần mềm của anh chị hoặc nhóm Telegram, chuyển thử 10.000 đồng. Kẹt ở bước nào gọi 1900 636 648 trong giờ hành chính, tụi em ngồi cùng tới khi gói tin đầu tiên về đúng chỗ. Web hay phần mềm làm tại MONA thì tụi em cài luôn. Không tính thêm.

## Câu hỏi thường gặp

### Tự động xác nhận thanh toán hosting cần những gì?

Một tài khoản ACB đứng tên anh chị, số điện thoại nhận OTP, và phần mềm quản lý hosting có một địa chỉ nhận webhook. MONA Pay cấp tài khoản ảo riêng cho từng hoá đơn, tiền vào là gửi gói tin về địa chỉ đó để phần mềm tự gia hạn, còn tiền vẫn nằm nguyên trong tài khoản ngân hàng của anh chị.

### Khách gõ sai nội dung chuyển khoản thì có khớp được không?

Được. Máy khớp bằng số tài khoản ảo riêng của từng hoá đơn, không dựa vào nội dung khách gõ, nên khách để trống nội dung vẫn khớp trong vài giây.

### Webhook về phần mềm có an toàn không?

Mỗi gói tin ký HMAC-SHA256 bằng khoá riêng của anh chị, kèm dấu thời gian, phần mềm nhận từ chối gói lệch giờ quá 5 phút và phải trả lời trong 10 giây. Mã giao dịch không đổi qua các lần gửi lại. Không xử lý trùng.

### Tôi bán khoá học hay phần mềm chứ không phải hosting thì dùng được không?

Được. Cùng cơ chế đó tụi em dùng cho học phí Khánh Hùng Academy và tiền phần mềm Mona.Software.

### Có mất phí không?

Không. MONA Pay miễn phí 500 giao dịch mỗi tháng, trên đó tính theo số giao dịch, xem [bảng giá](/bang-gia).
