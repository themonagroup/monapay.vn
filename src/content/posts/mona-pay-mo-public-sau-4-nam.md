---
title: "MONA Pay mở public sau 4 năm phục vụ 6.000+ khách hàng MONA"
description: "Chuyện thật từ MONA: hệ thống nhận tiền chuyển khoản tự xây để thu hosting, học phí, phần mềm, rồi từ 2022 hơn 6.000 khách hàng MONA dùng; 2026 mở public tại monapay.vn, miễn phí."
date: 29/08/2026
keyword: "MONA Pay"
category: chuyen-mona
h1: "MONA Pay mở cho mọi doanh nghiệp sau 4 năm phục vụ hơn 6.000 khách hàng MONA"
ogImage: /img/blog/mona-pay-mo-public-sau-4-nam.jpg
---

MONA Pay là hệ thống nhận và xác nhận tiền chuyển khoản mà tụi em tự xây từ hơn 4 năm trước, ban đầu để thu phí hosting, học phí và tiền phần mềm của chính MONA, rồi từ năm 2022 tới nay đã thu tiền cho hơn 6.000 khách hàng mới của MONA qua web bán hàng, phần mềm tụi em giao. Tháng 8 năm 2026 tụi em mở nó ra cho mọi doanh nghiệp tại [monapay.vn](/), đăng ký xong dùng ngay, miễn phí 500 giao dịch mỗi tháng, trên đó gói cố định theo số giao dịch. Bài này kể vì sao có nó, vì sao giờ mới mở, và mở ra thì anh chị được gì. Kể thật, không tô.

## Hơn 4 năm, MONA Pay chỉ đến tay một nhóm: chính tụi em và hơn 6.000 khách làm web, phần mềm tại MONA

Cái tên MONA Pay mới có gần đây, nhưng hệ thống bên dưới thì đã chạy âm thầm ở địa chỉ ipn.mona.host từ hơn 4 năm trước. Nó sinh ra vì một nhu cầu rất đời thường của chính tụi em: mỗi tháng Mona.Host thu phí hosting, VPS, tên miền của hàng nghìn tài khoản, Khánh Hùng Academy thu học phí của 40.000 học viên trong đó có 760 học viên PRO, còn Mona.Software thu tiền đợt cho từng đơn phần mềm. Toàn bộ số tiền đó đi bằng chuyển khoản ngân hàng. Khách chuyển xong thì ai xác nhận? Trước đây là người.

Tụi em viết hệ thống này để máy làm phần đó thay người. Tiền vào tài khoản ngân hàng, ngân hàng báo, hệ thống khớp với đơn rồi tự mở hosting, tự kích hoạt khoá học, tự đổi trạng thái hoá đơn phần mềm. Chạy ổn cho việc của mình thì từ năm 2022 tụi em nhúng luôn vào các web bán hàng và phần mềm quản lý giao cho khách, vì khách làm web tại MONA gặp đúng một bài toán y hệt: khách của họ chuyển khoản xong rồi ngồi chờ ai đó xác nhận đơn. Từ năm 2016 tới giờ MONA làm hơn 14.000 dự án và giữ chân 85% khách quay lại, phần lớn là web bán hàng và phần mềm nghiệp vụ, nên tính tới nay đã có hơn 6.000 khách hàng mới của MONA thu tiền qua hệ thống này, nhiều hơn tụi em tưởng khi bắt đầu.

Suốt thời gian đó nó không có trang web riêng, không có bảng giá, không có tài liệu công khai, và muốn dùng thì phải là khách MONA. Anh chị đọc thêm ở trang [khách hàng và ca dùng thật](/khach-hang).

## Trước khi có nó, tụi em cũng ngồi canh app ngân hàng như mọi người

Kể thật cho anh chị nghe cảnh hồi chưa có hệ thống. Chị kế toán bên Mona.Host mở app ngân hàng trên điện thoại gần như cả ngày, cứ vài phút lại kéo màn hình xuống xem có tiền vào chưa, thấy một khoản 2.500.000 đồng thì đi lục xem đơn nào khớp. Khách chuyển lúc 11 giờ đêm thì sáng hôm sau mới có người xác nhận. Khách chuyển cuối tuần thì chờ tới thứ hai. Có hôm hai khách chuyển cùng một số tiền, cùng nội dung sai chính tả, kế toán phải nhắn hỏi từng người mới dám gán đơn.

Không ai sai ở đây. Mọi cửa hàng ở Việt Nam vẫn đang làm vậy, và tụi em từng làm y hệt. Nhưng khi số khoản thu mỗi ngày tăng lên cùng số dự án, cách đó gãy. Người canh app mệt, khách chờ lâu thì khó chịu, còn chủ thì không dám giao app ngân hàng cho nhân viên vì trong đó là toàn bộ tiền của công ty.

Bài toán hoá ra có ba mảnh phải giải cùng lúc: biết tiền vào ngay lúc nó vào, biết khoản đó của đơn nào, và báo cho đúng người mà không cần đưa app ngân hàng cho họ. Tụi em giải mảnh thứ nhất bằng dịch vụ thông báo giao dịch của ngân hàng, mảnh thứ hai bằng tài khoản ảo riêng cho từng đơn, mảnh thứ ba bằng webhook và Telegram. Ba mảnh đó hiện là ba tính năng lõi của MONA Pay, anh chị xem chi tiết ở trang [nhận tiền ACB theo thời gian thực](/acb).

## Vì sao năm 2026 tụi em mới mở ra cho tất cả

Có hai lý do. Một ở ngoài, một ở trong.

Lý do bên ngoài là chính sách ngân hàng mở ở Việt Nam đã thoáng hơn nhiều so với hồi tụi em bắt đầu. Các ngân hàng lần lượt có bộ API dành cho đối tác, cho phép doanh nghiệp đăng ký tài khoản ảo và nhận thông báo giao dịch qua kênh chính thức thay vì đọc tin nhắn SMS hay đăng nhập app. Hơn 4 năm trước làm việc này rất cực, giờ thì con đường đã có sẵn. ACB là ngân hàng tụi em nối xong trước; MB, BIDV, VietinBank, OCB, MSB, KienlongBank, TPBank đang trong quá trình đăng ký kết nối, anh chị xem bảng trạng thái ở [ngân hàng hỗ trợ](/ngan-hang).

Lý do bên trong là tầm nhìn của tụi em đổi. Trước đây MONA làm phần mềm chủ yếu cho doanh nghiệp có quy mô, hợp đồng hàng trăm triệu, dự án kéo dài nhiều tháng. Nhưng thứ tụi em thấy sau 14.000 dự án là bài toán "khách chuyển khoản xong ai xác nhận" không phân biệt lớn nhỏ. Một tiệm bán online 20 đơn mỗi ngày, một hộ kinh doanh, một lập trình viên tự làm phần mềm bán ra thị trường đều kẹt đúng chỗ đó, và họ không có ngân sách thuê MONA viết riêng. Vậy thì mở cái đã có sẵn ra cho họ dùng. Tụi em quyết định như vậy, và quyết luôn là không thu tiền, vì thứ đã chạy sẵn cho mình thì cho người khác dùng chung không tốn thêm bao nhiêu.

Anh chị đang phân vân có nên thử? Tạo tài khoản tại [my.monapay.vn](https://my.monapay.vn/auth?mode=register) mất chưa tới 1 phút, không cần chờ ai duyệt, không mất phí gì. Nối ACB xong là tiền vào thấy liền.

## Mở ra thì khác gì bản 6.000 khách MONA đang dùng

Khác ở ba chỗ, và cả ba đều là thứ hồi chỉ giao cho khách MONA tụi em không cần.

Thứ nhất là tự phục vụ. Hồi trước muốn thêm một web mới vào hệ thống thì kỹ sư MONA làm tay. Giờ anh chị đăng ký tài khoản, đăng nhập lấy mã truy cập có hạn 24 giờ, tự tạo khoá API, tự nối tài khoản ACB qua 4 bước có OTP, tự khai địa chỉ nhận webhook. Không có bước chờ duyệt, không có ai phải kích hoạt tay.

Thứ hai là tài liệu viết cho cả máy đọc. Tụi em để nguyên bản markdown của từng trang tài liệu, thêm tệp llms.txt và openapi.json ngay trên tên miền chính, để một AI agent như Claude Code hay Codex đọc là tự viết được đoạn nhận webhook cho anh chị. Chi tiết ở trang [dành cho AI agent](/ai-agent). Đây là thứ tụi em làm thêm khi mở public, vì khách mới không có kỹ sư MONA ngồi cạnh.

Thứ ba là giá. Miễn phí 500 giao dịch mỗi tháng, trên đó tính theo số giao dịch, không thu phần trăm trên số tiền, xem [bảng giá](/bang-gia). Tiền chưa bao giờ đi qua MONA Pay, nó vào thẳng tài khoản ACB của anh chị, tụi em chỉ đọc thông báo từ ngân hàng rồi báo về web hoặc nhóm Telegram. Không cầm tiền thì không có phí giữ tiền, không có phí rút. Còn phần kỹ thuật thì giữ nguyên như bản nội bộ: webhook ký HMAC-SHA256, từ chối gói tin lệch giờ quá 5 phút, máy nhận của anh chị trả lời trong 10 giây là tính thành công, mỗi lần gửi đều có lịch sử để xem lại.

## Trước khi mở cửa, tụi em đi lại đúng đường của một khách mới

Trước khi mở cho người ngoài, tụi em muốn đi lại toàn bộ đường của một khách mới, bằng tài khoản mới và tiền thật. Một tài khoản đăng ký từ đầu như khách, nối ACB, tạo tài khoản ảo, khai webhook về một máy nhận bên ngoài, rồi chuyển khoản vào tài khoản ảo đó từ một tài khoản khác. ACB báo, hệ thống ghi nhận, webhook bắn về máy nhận, chữ ký HMAC khớp đúng công thức đã công bố trong tài liệu. Toàn bộ đúng như thiết kế.

Nhưng lần chạy đó cũng lòi ra một cái hố mà bản giao cho khách MONA chưa từng gặp, vì hồi đó kỹ sư MONA làm tay bước nối ngân hàng nên không ai vấp. Tạo tài khoản ảo xong, ACB yêu cầu thêm một lần OTP nữa để đăng ký nhận thông báo giao dịch cho tài khoản ảo đó. Bản đầu của trình hướng dẫn bỏ sót bước này. Kết quả là tài khoản ảo có rồi, tiền chuyển vào rồi, mà hệ thống không nhận được thông báo nào. Tụi em ngồi soi mất một buổi mới ra.

Giờ trình hướng dẫn nối ACB gộp thành 4 bước liền mạch với 2 lần OTP về số điện thoại của chủ tài khoản, và tài liệu ghi rõ chuyện này để anh chị không vấp lại. Anh chị xem từng bước ở [bắt đầu nhanh](/docs/bat-dau-nhanh). Tụi em kể chuyện cái hố này không phải để khoe, mà vì nó là lý do tụi em tin vào việc tự đi lại đường của khách trước khi mở cửa.

## Cái gì tụi em chưa làm được, nói luôn cho rõ

Hiện ACB đang hoạt động; MB, BIDV, VietinBank, OCB, MSB, KienlongBank, TPBank đang trong quá trình đăng ký kết nối, bảng trạng thái cập nhật tại [ngân hàng hỗ trợ](/ngan-hang). Webhook, Telegram, API của anh chị dùng chung cho mọi ngân hàng, payload có `bank_name`, nối thêm ngân hàng không phải sửa gì. Tụi em không hứa ngày cho từng ngân hàng. Có là báo ngay. Trong lúc chờ, cách tụi em hay khuyên khách là mở thêm một tài khoản ACB đứng tên mình để nhận tiền bán hàng, vì mở tài khoản ngân hàng giờ làm trên điện thoại được.

Gửi lại webhook tự động theo lịch cũng đang triển khai. Hiện tại nếu máy nhận của anh chị lỗi, anh chị bấm gửi lại từ bảng điều khiển, và bản tự gửi lại tối đa 7 lần sẽ lên trong thời gian tới. Tụi em ghi rõ trạng thái này trong tài liệu thay vì viết như đã có.

MONA Pay cũng không phải cổng thẻ quốc tế. Anh chị bán ra nước ngoài, khách trả bằng thẻ hay ví ngoại thì vẫn cần PayPal hoặc cổng tương tự, chấp nhận mức phí 4,40% cộng phí cố định cho mỗi giao dịch thương mại từ ngoài Việt Nam và 60.000 đồng mỗi lần rút về ngân hàng trong nước theo biểu phí PayPal tụi em kiểm ngày 28/08/2026. Với thu tiền trong nước thì chuyển khoản qua VietQR gần như là chuẩn, và đó đúng là việc MONA Pay sinh ra để làm. Tụi em viết kỹ chuyện này ở bài [cổng thanh toán quốc tế](/cong-thanh-toan-quoc-te).

## Anh chị muốn thử thì làm gì trong 5 phút tới

Nếu anh chị đang là người mở app ngân hàng mỗi ngày để canh tiền, hoặc đang trả nhân viên chỉ để xác nhận chuyển khoản, thì cái hệ thống hơn 6.000 khách MONA đang dùng hơn 4 năm nay đã sẵn cho anh chị. Vào [my.monapay.vn](https://my.monapay.vn/auth?mode=register), đăng ký tài khoản, đi 4 bước nối ACB với 2 lần OTP, rồi khai nhóm Telegram hoặc địa chỉ webhook. Chuyển thử 10.000 đồng vào tài khoản ảo vừa tạo. Tin báo có tới liền. Kẹt ở bước nào, gọi 1900 636 648 trong giờ hành chính, có người MONA ngồi cùng anh chị tới khi tin đầu tiên về. Web hay phần mềm làm tại MONA thì tụi em cài luôn.

## Câu hỏi thường gặp

### MONA Pay có phải sản phẩm mới ra không?

Không. Hệ thống bên dưới đã chạy hơn 4 năm để thu phí hosting, học phí và tiền phần mềm cho chính MONA, rồi từ 2022 thu tiền cho hơn 6.000 khách hàng mới của MONA qua web và phần mềm tụi em giao, nên phần lõi đã được thử qua tiền thật từ lâu. Cái mới là trang monapay.vn, việc tự đăng ký dùng ngay và tài liệu công khai.

### Tiền có đi qua MONA Pay không?

Không. Tiền vào thẳng tài khoản ACB của anh chị, MONA Pay chỉ nhận thông báo giao dịch từ ngân hàng rồi báo về website, phần mềm hoặc nhóm Telegram của anh chị, nên không có phí giữ tiền hay phí rút.

### Miễn phí tới bao giờ?

Miễn phí 500 giao dịch mỗi tháng, trên đó tính theo số giao dịch, chỉ có giới hạn chống lạm dụng. MONA sống bằng làm web, hosting và phần mềm từ năm 2016. Phí thanh toán không phải nguồn thu của tụi em.

### Đăng ký xong có phải chờ MONA duyệt không?

Không, đăng ký xong đăng nhập được ngay, tự tạo khoá API và nối ACB, chỉ có 2 lần OTP từ ACB là cần người cầm số điện thoại của chủ tài khoản.

### Tôi không dùng ACB thì sao?

ACB đang hoạt động; MB, BIDV, VietinBank, OCB, MSB, KienlongBank, TPBank đang đăng ký kết nối, trạng thái cập nhật ở [ngân hàng hỗ trợ](/ngan-hang). Cách nhanh nhất lúc này là mở một tài khoản ACB để nhận tiền bán hàng, nối thêm ngân hàng sau không phải sửa webhook hay Telegram.
