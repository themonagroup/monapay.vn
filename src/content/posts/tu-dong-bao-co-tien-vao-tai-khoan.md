---
title: "Báo có tự động: tiền vào tài khoản ACB là cả công ty biết ngay"
description: "Báo có tự động khác gì tin nhắn biến động số dư, bật trong 4 bước để tiền vào tài khoản ACB là nhóm Telegram của công ty thấy ngay. Kể từ cách MONA thu học phí."
date: 29/08/2026
keyword: "báo có tự động"
category: huong-dan
h1: "Báo có tự động: tiền vào tài khoản là cả công ty biết, tụi em làm sao"
ogImage: /img/blog/tu-dong-bao-co-tien-vao-tai-khoan.jpg
---

Khách đến MONA làm phần mềm quản lý, mười người thì tám người đang "báo có" bằng cách chụp màn hình app ngân hàng gửi vào nhóm chat. Báo có tự động là bỏ cái thao tác đó: tiền vào tài khoản ACB, ngân hàng báo cho MONA Pay, MONA Pay đẩy một tin có số tiền, nội dung, thời gian vào đúng nhóm Telegram của bộ phận cần biết, trong vài giây. Tụi em dùng cách này để thu học phí và phí hosting hơn 4 năm, chạy thật lại toàn bộ với 50.000 đồng ngày 28/08/2026 trước khi mở cho mọi doanh nghiệp. Không tốn tiền, bật trong 4 bước.

## Chủ doanh nghiệp đến MONA thường đang báo có bằng cách nào?

Tụi em hỏi câu này với gần như mọi khách làm phần mềm, và câu trả lời quanh đi quẩn lại có ba kiểu. Kiểu một, chủ giữ app ngân hàng, tiền vào là chụp màn hình gửi cho nhân viên. Kiểu hai, đưa luôn tài khoản app ngân hàng cho nhân viên kế toán hoặc người quản lý cửa hàng, ai cũng thấy hơi sợ nhưng vẫn làm vì không còn cách nào. Kiểu ba, không báo gì cả, cuối ngày kế toán tải sao kê về đối chiếu, khách chuyển buổi sáng thì chiều mới biết.

Ở MONA thời chưa có hệ thống riêng, tụi em ở kiểu một. Anh phụ trách thu phí hosting cầm điện thoại cả ngày, tiền vào là chụp gửi vào nhóm kỹ thuật để mở dịch vụ cho khách. Khách chuyển 10 giờ đêm thì anh ấy cũng phải thức. Khách chuyển sáng chủ nhật thì chờ. Cái phiền nhất là ba người cùng chuyển 1.200.000 đồng phí hosting trong một buổi, nội dung chuyển khoản mỗi người gõ một kiểu, phải nhắn hỏi lại từng người xem ai là ai.

Kể chuyện này để anh chị thấy cái mất của "báo có bằng tay" là mất người thật và mất giờ thật, chứ tiền thì vẫn vào đủ. Với chuỗi vài cửa hàng hoặc trung tâm nhiều lớp, mất mát này nhân lên theo số điểm bán. Người giữ app ngân hàng thành nút thắt của cả công ty. Ai cũng phải chờ một người, và người đó thì không thể thức cả đêm lẫn cuối tuần.

## Báo có tự động khác gì tin nhắn biến động số dư của ngân hàng?

Nhiều anh chị hỏi tụi em: tôi đã đăng ký tin nhắn biến động số dư rồi, cần gì thêm. Tin nhắn đó chỉ về máy của chủ tài khoản. Nó không chia được cho ai, và nó không biết tiền đó thuộc đơn nào, khách nào, nên nhận xong vẫn phải có người đọc rồi chuyển tiếp.

Báo có tự động của MONA Pay khác ở ba điểm. Thứ nhất, tin về nhóm Telegram chứ không về một cái điện thoại, nên bộ phận gói hàng, bộ phận kỹ thuật, kế toán cùng thấy một lúc, không ai phải chuyển tiếp cho ai. Thứ hai, tin được gắn với tài khoản ảo: mỗi đơn hàng, mỗi cửa hàng, mỗi lớp học có một số tài khoản ảo ACB riêng, chuỗi 3 chi nhánh là 3 số khác nhau, tiền vào số nào là biết ngay của ai, khách gõ nội dung sai cũng không sao. Thứ ba, cùng lúc với tin Telegram, MONA Pay gửi được cả webhook về phần mềm để phần mềm tự xử lý, tụi em nói kỹ ở [bài xác nhận thanh toán tự động](/blog/xac-nhan-thanh-toan-tu-dong).

Tụi em chọn Telegram thay vì tự làm một app thông báo riêng vì một lý do rất đời: ai cũng đã có Telegram trong máy, nhóm tạo trong 30 giây, thêm bot vào là xong, không phải bắt nhân viên cài thêm gì. Tiền không đi qua MONA Pay. Nó vào thẳng tài khoản ACB của anh chị, MONA Pay chỉ nhận thông báo từ ACB rồi báo lại.

## Mẫu tin báo có tụi em đang dùng ở MONA trông thế nào?

Một tin báo có chuẩn của MONA Pay có 5 dòng: tên ngân hàng, số tài khoản nhận, số tiền, thời gian và nội dung chuyển khoản. Ví dụ tin tụi em nhận khi khách đóng phí hosting trông như dưới đây.

> Tên ngân hàng: ACB · Số tài khoản: số tài khoản ảo của đơn · Số tiền: 2.500.000 VNĐ · Thời gian: 28/08/2026 10:30 · Nội dung: DH10234 NGUYEN VAN A.

Năm dòng là đủ dùng. Nhân viên kỹ thuật đọc xong mở dịch vụ luôn mà không cần hỏi lại ai. Anh chị sửa được mẫu tin trong dashboard, thêm bớt dòng, đổi cách gọi, ví dụ trung tâm dạy học của khách MONA đổi "Nội dung" thành "Học viên" cho dễ đọc. Số tiền luôn hiển thị định dạng có dấu chấm ngăn hàng nghìn kèm VNĐ, tụi em cố ý làm vậy vì đọc 2.500.000 nhanh hơn 2500000 rất nhiều khi tin đến dồn dập.

## Bật báo có tự động trong 4 bước

Toàn bộ làm trong dashboard [my.monapay.vn](https://my.monapay.vn), không cần người kỹ thuật, tài liệu chi tiết từng ô ở [hướng dẫn Telegram](/docs/telegram) và tổng quan tính năng ở [trang báo biến động số dư qua Telegram](/chia-se-bien-dong-so-du-telegram).

Bước 1, tạo tài khoản MONA Pay và nối tài khoản ACB. Đăng ký xong dùng ngay, không chờ duyệt. Vào mục Ngân hàng và VA, nhập số tài khoản ACB đứng tên anh chị và số điện thoại đăng ký với ACB, nhận OTP tạo tài khoản ảo, rồi nhận OTP lần hai để đăng ký nhận thông báo giao dịch. Hai lần OTP, thiếu lần hai là tiền vào không có tin, chi tiết ở [trang nối ACB](/acb).

Bước 2, tạo nhóm Telegram cho bộ phận cần nhận tin, mở thông tin nhóm, thêm bot của MONA Pay vào nhóm, tên bot hiển thị ngay trong mục Telegram của dashboard.

Bước 3, vào mục Telegram trong dashboard, bấm thêm cấu hình, dán mã nhóm vào ô group_id. Nhóm có chia chủ đề thì dán thêm topic_id để tin rơi đúng chủ đề. Đặt tên gợi nhớ, chọn nhận tin cho mọi tài khoản hay chỉ một tài khoản ảo, sửa mẫu tin nếu muốn.

Bước 4, bấm gửi thử. Tin mẫu về nhóm là cấu hình đúng. Sau đó chuyển thật 10.000 đồng vào tài khoản ảo để thấy trọn vòng: tiền vào, ACB báo, tin về nhóm. Tụi em luôn kêu khách làm bước chuyển thật này, vì gửi thử chỉ chứng minh Telegram nối đúng, còn tiền thật mới chứng minh ngân hàng đã bật thông báo.

Anh chị muốn thử trước khi quyết định gì thì cứ làm đủ 4 bước với một nhóm nhỏ hai ba người. Miễn phí, không giới hạn số tin, không giới hạn số nhóm. Thấy hợp thì mở rộng ra từng bộ phận, không hợp thì xoá cấu hình, không mất gì.

## Nhiều cửa hàng, nhiều bộ phận thì chia nhóm báo có ra sao?

Đây là phần khách MONA hay hỏi nhất khi đã chạy được nhóm đầu tiên. Cách tụi em chia cho một chuỗi 5 chi nhánh: mỗi chi nhánh 1 tài khoản ảo ACB riêng, mỗi tài khoản ảo gắn với 1 nhóm Telegram của chi nhánh đó, tổng cộng 5 nhóm nhỏ và 1 nhóm chung cho chủ. Tiền vào tài khoản ảo của chi nhánh quận 1 thì chỉ nhóm quận 1 thấy, chi nhánh khác không thấy tiền của nhau, còn chủ vào nhóm tổng nhận tin của mọi tài khoản. Cấu hình 1 lần cho mỗi chi nhánh, sau đó không phải đụng lại.

Cách chia này giải quyết được chuyện tế nhị nhất: không phải đưa app ngân hàng cho bất kỳ nhân viên nào, vì nhân viên chỉ thấy tin "tiền vào bao nhiêu, nội dung gì", không thấy số dư, không chuyển tiền được, không đăng nhập được vào đâu. Chủ giữ app như cũ. Không ai khác cần tới nó, và cũng không ai phải xin.

Với trung tâm dạy học của khách MONA, tụi em chia theo lớp hoặc theo khoá: tài khoản ảo của khoá nào thì nhóm giáo vụ khoá đó nhận tin, kế toán nhận tất cả. Với công ty phần mềm bán theo gói thì chia theo sản phẩm, mỗi gói 1 tài khoản ảo. Nguyên tắc chung chỉ có một: ai cần biết tiền của việc gì thì nhận đúng tin của việc đó, không hơn, không kém.

## Có báo có tự động rồi, kế toán đối chiếu thế nào?

Kế toán không cần ngồi canh tin nữa, nhưng vẫn cần đối chiếu, và tụi em làm phần này trong dashboard. Mục Giao dịch liệt kê mọi giao dịch tiền vào, lọc theo tài khoản ảo, theo ngày, hiển thị tối đa 100 giao dịch trên 1 trang, mỗi dòng có mã giao dịch của ngân hàng để so với sao kê.

Kế toán của MONA làm việc này 1 lần mỗi tuần thay vì mỗi ngày như trước: mở dashboard, lọc 7 ngày vừa rồi, so tổng với sao kê ACB. Khớp thì thôi. Với công ty có phần mềm riêng, dev gọi API tra giao dịch để tự đối chiếu, tài liệu ở [hướng dẫn đối soát](/docs/webhooks/doi-soat). Tin Telegram là để người biết ngay, dashboard và API là để sổ sách khớp, hai thứ bổ cho nhau.

## Tin không về nhóm thì kiểm ở đâu?

Kiểm đúng ba chỗ. Theo thứ tự tụi em vẫn kiểm cho khách. Một, bấm gửi thử trong mục Telegram: tin mẫu không về nghĩa là bot chưa được thêm vào nhóm hoặc mã nhóm sai, dán lại mã là xong. Hai, tin mẫu về mà tiền thật không về, gần như chắc chắn là chưa làm OTP lần hai để đăng ký nhận thông báo với ACB. Ngày 28/08/2026 chính tụi em dính lỗi này khi chạy thử 50.000 đồng: tiền vào, hệ thống im, kiểm lại mới thấy thiếu bước đăng ký thông báo, làm xong OTP lần hai thì tin về ngay. Ba, mở lịch sử gửi trong dashboard: mỗi lần gửi có trạng thái và nhãn lỗi, có nút gửi lại từng tin.

Ngoài ba chỗ đó mà vẫn kẹt thì gọi tụi em qua 1900 636 648, không mất phí, kỹ sư kiểm cùng anh chị trong vài phút.

## Báo có tự động bằng MONA Pay tốn bao nhiêu?

Không đồng nào. MONA Pay miễn phí hoàn toàn, không giới hạn số giao dịch, không giới hạn số nhóm Telegram, không thu phần trăm trên số tiền. Tụi em để miễn phí được vì hệ thống đã chạy sẵn hơn 4 năm cho chính MONA và cho hơn 6.000 khách hàng mới của MONA từ 2022, tiền không đi qua MONA Pay nên không có phí trung gian, và MONA sống bằng làm web, hosting, phần mềm chứ không sống bằng phí thu tiền của anh chị. Phí phía ngân hàng, nếu có, theo biểu phí của ACB, anh chị hỏi ACB khi mở tài khoản.

Nếu hôm nay anh chị vẫn đang chụp màn hình app ngân hàng gửi vào nhóm, hoặc đang đưa app ngân hàng cho nhân viên vì không còn cách nào khác, thì thử ngay chiều nay: tạo tài khoản tại [my.monapay.vn/auth?mode=register](https://my.monapay.vn/auth?mode=register), nối ACB với 2 lần OTP, thêm bot vào một nhóm nhỏ, chuyển thử 10.000 đồng. Tin về là anh chị cất được cái điện thoại xuống. Kẹt bước nào gọi 1900 636 648 giờ hành chính, kỹ sư MONA ngồi cùng anh chị tới khi tin đầu tiên chạy về. Khách làm phần mềm tại [Mona.Software](https://mona.software) thì tụi em cấu hình luôn trong lúc bàn giao.

## Câu hỏi thường gặp

### Nhân viên trong nhóm có thấy số dư tài khoản không?

Không, vì tin chỉ có số tiền vào, nội dung, thời gian và số tài khoản nhận, không có số dư, không có quyền gì với tài khoản ngân hàng của anh chị, app ngân hàng vẫn chỉ mình anh chị giữ.

### Tin báo có về chậm không?

ACB báo là MONA Pay đẩy tin ngay, thường tính bằng giây. Lần tụi em chuyển 50.000 đồng ngày 28/08/2026 để kiểm tra toàn bộ luồng, tin Telegram về gần như cùng lúc với thông báo của ngân hàng, và webhook về phần mềm cũng trong cùng khoảng đó.

### Một nhóm nhận tin của nhiều tài khoản ảo được không?

Được. Chọn "mọi tài khoản" khi tạo cấu hình. Ngược lại, một tài khoản ảo cũng gửi được vào nhiều nhóm bằng cách tạo nhiều cấu hình, mỗi cấu hình 1 nhóm. Tụi em hay làm vậy cho nhóm kế toán và nhóm bán hàng cùng nhận một nguồn tin.

### Tiền ra khỏi tài khoản có báo không?

Hiện tại thì chưa. MONA Pay đang báo giao dịch tiền vào, phần tiền ra tụi em đang làm, có là ghi trên trang tài liệu.

### Tôi dùng ngân hàng khác ACB thì sao?

Hiện ACB đang hoạt động; MB, BIDV, VietinBank, OCB, MSB, KienlongBank, TPBank đang trong quá trình đăng ký kết nối, bảng trạng thái cập nhật tại [ngân hàng hỗ trợ](/ngan-hang). Webhook, Telegram, API của anh chị dùng chung cho mọi ngân hàng, payload có `bank_name`, nối thêm ngân hàng không phải sửa gì.
