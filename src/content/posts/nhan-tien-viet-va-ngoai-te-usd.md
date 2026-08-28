---
title: "Nhận thanh toán từ nước ngoài và thu tiền Việt: cách MONA sắp xếp"
description: "Nhận thanh toán từ nước ngoài qua PayPal tốn 4,40% cộng phí cố định, rút về ngân hàng 60.000đ/lần; thu tiền Việt bằng VietQR thì 0 đồng. Cách chạy song song hai đường."
date: 29/08/2026
keyword: "nhận thanh toán từ nước ngoài"
category: kien-thuc
h1: "Nhận thanh toán từ nước ngoài và thu tiền Việt: hai đường tiền, hai cách làm"
ogImage: /img/blog/nhan-tien-viet-va-ngoai-te-usd.jpg
---

<div class="answer-first">

Khách đến MONA làm web bán hàng, sau 14.000+ dự án, tụi em thấy tiền về chia đúng hai đường: tiền Việt từ khách trong nước thì đi bằng chuyển khoản và mã VietQR, tiền đô từ khách nước ngoài thì đi qua PayPal hoặc một cổng quốc tế. Hai đường này khác nhau về phí, về thời gian tiền về tài khoản và về cách xác nhận đơn, nên đừng cố ép chung một cổng. Hai đường, hai luật chơi. Bài này nói rõ từng đường, có số tụi em kiểm ngày 28/08/2026.

</div>

## Tiền Việt từ khách trong nước: chuyển khoản VietQR là đường chính

Ở MONA, tiền hosting của Mona.Host, học phí Khánh Hùng Academy với 40.000 học viên và 760 học viên PRO, đơn phần mềm của Mona.Software đều thu bằng chuyển khoản. Không phải vì tụi em không biết ví điện tử hay cổng thẻ, mà vì khách Việt cầm điện thoại lên là mở app ngân hàng, quét mã QR, gõ đúng số tiền rồi bấm chuyển. Xong trong 15 giây. Không ai phải cài thêm ví, không ai phải đăng ký tài khoản mới, và cũng không ai phải nhớ mật khẩu của một dịch vụ thứ ba chỉ để trả một đơn 300.000đ. Thói quen này tụi em thấy ở mọi nhóm khách, từ chủ shop online tới phòng kế toán công ty lớn, nên đường chuyển khoản luôn được dựng trước.

Cái vướng nằm ở phía người bán. Khách chuyển xong thì ai xác nhận? Trước khi có hệ thống riêng, nhân viên MONA phải mở app ngân hàng canh tiền vào, khách chuyển tối hay cuối tuần thì chờ tới giờ làm việc, và có lúc hai khách chuyển cùng 500.000đ trong một buổi sáng là nhầm đơn. Tụi em vấp cái này nhiều năm, rồi tự viết một hệ thống nhận thông báo từ ngân hàng để phần mềm tự khớp đơn, và hệ thống đó chạy cho chính MONA hơn 4 năm trước khi mở ra thành [MONA Pay](/gioi-thieu).

Cơ chế thu tiền Việt tự động chỉ có ba mảnh ghép. Một, mỗi đơn hàng có một tài khoản ảo ACB riêng hoặc một mã VietQR động điền sẵn số tiền và nội dung. Hai, khách chuyển vào, ACB gửi thông báo giao dịch tới MONA Pay. Ba, MONA Pay bắn webhook có chữ ký HMAC-SHA256 về website hay phần mềm của anh chị trong vòng 10 giây, và gửi thêm một tin vào nhóm Telegram nếu anh chị muốn. Tiền không đi qua tụi em. Nó nằm trong tài khoản ACB của anh chị từ giây đầu tiên, MONA Pay chỉ đọc thông báo rồi báo lại.

Phí của đường này là 0 đồng. Không phần trăm trên số tiền, không phí rút, không phí mở tài khoản, không giới hạn số giao dịch. Anh chị xem chi tiết ở [bảng giá](/bang-gia) và cách nối ngân hàng ở trang [nhận tiền ACB](/acb).

## Tiền đô từ khách nước ngoài: PayPal lấy 4,40% cộng phí cố định

Khi khách ở Mỹ, Úc hay châu Âu trả tiền cho một dịch vụ Việt Nam, họ gần như không có app ngân hàng Việt để quét VietQR. Họ trả bằng thẻ hoặc bằng ví PayPal. Đây là chỗ cổng quốc tế làm đúng việc của nó, và tụi em không khuyên anh chị bỏ.

Chỉ cần nhìn kỹ phí. Theo biểu phí PayPal Việt Nam công bố, tụi em kiểm ngày 28/08/2026, giao dịch thương mại nhận từ ngoài lãnh thổ Việt Nam chịu 4,40% cộng một khoản phí cố định theo tiền tệ: 0,30 USD nếu nhận đô Mỹ, 0,35 EUR nếu nhận euro, 0,30 AUD nếu nhận đô Úc. Khoản thanh toán vi mô quốc tế còn cao hơn, 6,00% cộng phí cố định. Muốn tiền từ ví PayPal về tài khoản ngân hàng mở tại Việt Nam, mỗi lần rút mất 60.000đ khi không phải quy đổi tiền tệ, còn rút lỗi vì sai thông tin tài khoản thì bị tính 70.000đ. Nếu có quy đổi tiền tệ, PayPal cộng thêm một khoản phí tính trên tỷ giá cơ sở.

Làm một phép tính cho dễ hình dung. Khách Mỹ trả 100 USD cho một gói thiết kế. PayPal giữ lại 4,40 USD cộng 0,30 USD, anh chị còn 95,30 USD trong ví. Rút về ngân hàng Việt Nam thêm 60.000đ mỗi lần rút, nên nếu rút lắt nhắt mỗi đơn một lần thì khoản 60.000đ đó ăn thêm khoảng 2,3% nữa với đơn 100 USD. Gom năm đơn rút một lần thì phí rút chia đều ra, còn khoảng 0,5% mỗi đơn. Tụi em hay khuyên khách gom rút theo tuần vì lý do này.

Với khách nước ngoài, 4,40% là cái giá của việc họ được trả bằng thẻ họ quen. Chấp nhận được. Vấn đề chỉ xuất hiện khi anh chị đem đúng cổng đó thu khách Việt: khách phải có PayPal, phí 4,40% đè lên đơn 300.000đ, và tiền nằm trong ví chờ rút thay vì vào thẳng tài khoản.

## Stripe thì sao? Tính tới 28/08/2026 chưa mở cho doanh nghiệp Việt Nam

Nhiều anh chị làm phần mềm hỏi tụi em về Stripe vì tài liệu của họ đẹp và dân lập trình quen tay. Tụi em kiểm trang danh sách quốc gia của Stripe ngày 28/08/2026: có Singapore, Thái Lan, Malaysia, Indonesia, không có Việt Nam. Nghĩa là doanh nghiệp đăng ký tại Việt Nam chưa mở tài khoản Stripe trực tiếp được. Tụi em kiểm kỹ rồi.

Cách một số công ty vẫn dùng Stripe là lập pháp nhân ở nước Stripe hỗ trợ, ví dụ Singapore hay Mỹ, rồi đăng ký bằng pháp nhân đó. Tụi em nêu để anh chị biết là có con đường này, không hướng dẫn lách. Đi đường đó là chuyện thuế, chuyện dòng tiền giữa hai pháp nhân, và chuyện chi phí duy trì công ty nước ngoài, phải hỏi kế toán và luật sư trước. Tụi em từng thấy khách hỏi xong con số duy trì hằng năm rồi quyết định giữ nguyên PayPal, vì lượng đơn nước ngoài mỗi tháng chưa đủ để gánh một pháp nhân riêng. Với phần lớn khách MONA bán chủ yếu trong nước, tụi em nói thẳng: chưa cần. Đọc thêm ở bài [Stripe tại Việt Nam](/stripe-viet-nam).

> Anh chị bán chủ yếu trong nước mà đang tính mở PayPal chỉ để "cho chuyên nghiệp" thì thử đường chuyển khoản tự xác nhận trước. Tạo tài khoản [MONA Pay](https://my.monapay.vn/auth?mode=register) miễn phí hoàn toàn, nối ACB trong 4 bước, chuyển thử 10.000đ vào là thấy đơn tự khớp. Chưa tốn đồng nào đã biết mình có cần cổng quốc tế hay không.

## Chạy song song hai đường tiền: cách tụi em sắp xếp cho khách MONA

Khách MONA có cả khách trong nước lẫn khách nước ngoài thường được tụi em sắp xếp như sau, và nó chạy ổn qua nhiều năm.

Trên trang thanh toán, đơn bằng tiền Việt hiện mã VietQR động đúng số tiền, khách quét app ngân hàng và chuyển. ACB báo tiền vào, MONA Pay bắn webhook, đơn trên WooCommerce hay phần mềm tự đổi trạng thái đã thanh toán. Đơn bằng ngoại tệ thì hiện nút trả qua PayPal, và PayPal có cơ chế thông báo riêng của họ để phần mềm khớp đơn. Hai luồng chạy độc lập, kế toán nhìn hai báo cáo, không trộn lẫn. Hai luồng, hai sổ.

Ba điểm tụi em dặn khách trước khi bật hai luồng. Thứ nhất, ghi rõ trên trang thanh toán đơn nào trả bằng gì, đừng để khách Việt bấm nhầm sang PayPal rồi mất 4,40%. Thứ hai, với luồng chuyển khoản, mỗi đơn một mã QR riêng hoặc một tài khoản ảo riêng để phần mềm khớp bằng số tài khoản nhận, khỏi phải bắt khách gõ đúng nội dung chuyển khoản. Thứ ba, bật thêm thông báo Telegram vào nhóm kế toán để có người nhìn thấy mọi khoản tiền vào, dù webhook đã tự xử lý. Cách bật tin Telegram nằm ở trang [báo biến động số dư qua Telegram](/chia-se-bien-dong-so-du-telegram).

Một chi tiết nhỏ mà tụi em từng vấp khi triển khai: tạo tài khoản ảo ACB xong mà chưa làm bước đăng ký nhận thông báo giao dịch thì tiền vào vẫn im lặng. ACB đòi thêm một lần OTP nữa cho riêng phần thông báo. Tụi em sửa wizard thành 4 bước liền mạch, OTP 2 lần, và ghi lại ở đây để anh chị không mất một buổi đi tìm lý do như tụi em.

## Ba việc cần hỏi kế toán và ngân hàng trước khi nhận ngoại tệ

Tụi em làm phần mềm và hạ tầng, không tư vấn pháp lý, nên phần này chỉ là danh sách câu hỏi để anh chị mang đi hỏi đúng người.

Một, hỏi kế toán xem doanh thu nhận qua PayPal được hạch toán và xuất hoá đơn thế nào, vì tiền về ví trước rồi mới về ngân hàng, mốc ghi nhận doanh thu cần thống nhất từ đầu. Ví dụ khoản 100 USD về ví hôm nay, năm ngày sau mới rút về ngân hàng còn 95,30 USD trừ thêm 60.000đ phí rút, kế toán ghi nhận số nào, ngày nào, câu đó phải có đáp án trước khi nhận đơn đầu tiên. Hỏi trước, đỡ rối sau. Hai, hỏi ngân hàng nơi anh chị mở tài khoản về việc nhận ngoại tệ và quy đổi, vì mỗi ngân hàng có quy trình riêng cho tiền từ nước ngoài về. Ba, nếu tính chuyện lập pháp nhân nước ngoài để dùng Stripe, hỏi luật sư về nghĩa vụ thuế ở cả hai đầu trước khi nộp bất kỳ hồ sơ nào, vì chi phí duy trì một công ty ở Singapore hay Mỹ tính theo năm, còn phí 4,40% của PayPal chỉ tính theo đơn, hai kiểu chi phí này khác nhau hoàn toàn khi doanh số chưa lớn.

Còn đường tiền Việt thì đơn giản hơn nhiều. Tiền vào thẳng tài khoản ACB của anh chị, ngân hàng ghi nhận như một khoản chuyển khoản bình thường, không có bên trung gian giữ tiền, kế toán đối soát bằng mã giao dịch mà MONA Pay gửi kèm trong mỗi webhook.

## Câu hỏi thường gặp

### Nhận thanh toán từ nước ngoài có bắt buộc dùng PayPal không?

Không bắt buộc, nhưng với khách lẻ ở Mỹ, Úc, châu Âu thì PayPal là cổng họ quen nhất. Khách quen gì, dùng đó. Phí 4,40% cộng phí cố định theo biểu phí tụi em kiểm ngày 28/08/2026. Với khách doanh nghiệp lớn thì tụi em thấy họ hay chọn chuyển khoản quốc tế qua ngân hàng vì kế toán bên họ quen làm chứng từ kiểu đó hơn là qua ví. Khách doanh nghiệp nước ngoài đôi khi chuyển khoản quốc tế thẳng vào tài khoản ngân hàng, phí do hai ngân hàng thu.

### Thu tiền Việt bằng MONA Pay có mất phí gì không?

Không. MONA Pay miễn phí hoàn toàn, không giới hạn giao dịch, không thu phần trăm trên số tiền. Tiền vào thẳng tài khoản ACB của anh chị. Chỉ có giới hạn fair-use để chặn lạm dụng như bắn API dồn dập. Anh chị dùng thật bao nhiêu đơn một tháng cũng không chạm tới ngưỡng đó, vì nó được đặt cho máy chứ không đặt cho người bán hàng.

### Khách Việt trả bằng thẻ quốc tế thì sao?

Một phần nhỏ khách Việt vẫn trả bằng thẻ Visa hay Mastercard, và khi đó một cổng thẻ có ích. Tụi em thấy phần lớn đơn trong nước đi bằng chuyển khoản vì nhanh và không mất phí, nên khuyên anh chị mở đường chuyển khoản trước, đo tỷ lệ vài tháng rồi mới quyết có thêm cổng thẻ hay không.

### Tiền về ví PayPal rồi rút về ngân hàng mất bao lâu?

Thời gian rút do PayPal và ngân hàng nhận quyết định, tụi em không cam kết thay họ, vì cùng một lệnh rút có khi về trong ngày, có khi phải chờ ngân hàng nhận xử lý xong phần kiểm tra nguồn tiền từ nước ngoài. Điều tụi em kiểm được là phí: 60.000đ mỗi lần rút về ngân hàng mở tại Việt Nam khi không quy đổi tiền tệ.

### MONA Pay có nhận được tiền từ ngân hàng khác ACB không?

Tính tới 28/08/2026 MONA Pay chạy thật với ACB; MB, BIDV, VietinBank, OCB, MSB, KienlongBank, TPBank đang trong quá trình đăng ký kết nối, trạng thái từng ngân hàng cập nhật ở [ngân hàng hỗ trợ](/ngan-hang). Trong lúc chờ, nhiều khách mở thêm một tài khoản ACB chỉ để nhận tiền tự động, số dư vẫn chuyển về tài khoản chính bất cứ lúc nào; webhook và Telegram đã cấu hình dùng lại nguyên khi nối thêm ngân hàng.

## Bắt đầu từ đường tiền Việt, đo rồi mới mở đường thứ hai

Nếu anh chị đang thu tiền trong nước mà vẫn phải canh app ngân hàng để xác nhận từng đơn, đó là chỗ tụi em đã đứng nhiều năm trước khi tự viết hệ thống này. Tạo tài khoản MONA Pay tại [my.monapay.vn](https://my.monapay.vn/auth?mode=register), đăng ký xong dùng ngay không cần duyệt, nối ACB theo 4 bước với 2 lần OTP, rồi chuyển thử một khoản nhỏ. Kẹt ở bước nào, gọi 1900 636 648 trong giờ hành chính, kỹ sư MONA ngồi cùng anh chị tới khi tin đầu tiên về nhóm Telegram. Khi nào có khách nước ngoài thật sự, lúc đó mở PayPal thêm, phí 4,40% trả cho đúng khách cần trả. Thử trước, mở sau.
