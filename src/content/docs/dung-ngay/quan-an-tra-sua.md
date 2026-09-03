---
title: "Quán ăn, quán trà sữa dùng MONA Pay: tiền vào là quầy biết ngay"
description: "Hướng dẫn quán ăn, quán trà sữa dùng MONA Pay: nhóm Zalo báo tiền vào, loa đọc to ở quầy, in QR dán bàn. Không cần hỏi chủ tiền vô chưa, không cần lập trình."
updated: 03/09/2026
howto:
  - name: "Nối tài khoản ngân hàng của quán"
    text: "Tạo tài khoản MONA Pay, nối tài khoản ngân hàng đứng tên chủ quán bằng hai mã OTP ngân hàng gửi về điện thoại chủ."
  - name: "Thêm nhóm Zalo hoặc Telegram của quán"
    text: "Tạo nhóm gồm chủ quán và 5 đến 7 nhân viên, thêm bot MONA Pay vào nhóm, mỗi lần khách chuyển khoản là cả nhóm nhận một dòng tin: số tiền, nội dung, giờ chuyển."
  - name: "Bật màn hình đọc to ở quầy"
    text: "Mở đường link Loa báo có trên điện thoại hoặc máy tính bảng đặt tại quầy, bấm nút bật loa một lần, từ đó tiền vào là màn hình đọc to số tiền và nội dung."
  - name: "In mã QR dán tại bàn hoặc quầy thu ngân"
    text: "In mã QR ngân hàng của quán, dán ở từng bàn hoặc tại quầy, khách quét bằng app ngân hàng là ra đúng số tài khoản, không cần đọc số cho khách chép tay."
faq:
  - q: "Tiền của khách có qua MONA Pay không?"
    a: "Không. Khách chuyển thẳng vào tài khoản ngân hàng đứng tên chủ quán, y như chuyển khoản bình thường. MONA Pay chỉ đọc lại thông báo giao dịch từ ngân hàng rồi báo về nhóm Zalo và màn hình ở quầy, không giữ tiền, không đứng giữa."
  - q: "Dùng có mất phí không?"
    a: "Miễn phí 500 giao dịch mỗi tháng, không thu phần trăm trên số tiền khách chuyển. Quán bán vài chục đơn một ngày dùng thoải mái trong mức miễn phí, quán đông hơn thì gọi tổng đài để xem gói phù hợp."
  - q: "MONA Pay nối được ngân hàng nào?"
    a: "ACB đang hoạt động, quán mở tài khoản ACB đứng tên chủ quán là nối được ngay. Các ngân hàng khác đang trong quá trình đăng ký kết nối thêm, quán dùng ngân hàng khác thì mở thêm một tài khoản ACB để nhận tiền qua MONA Pay, không phải đổi ngân hàng chính đang dùng."
  - q: "Quán mất mạng lúc khách chuyển khoản thì sao?"
    a: "Khách vẫn chuyển được bình thường vì tiền đi qua hệ thống ngân hàng, không qua mạng của quán. Tin báo về nhóm Zalo hoặc màn hình ở quầy chỉ chậm lại tới khi quán có mạng trở lại, không mất giao dịch, sao kê ngân hàng vẫn ghi đủ."
  - q: "Có cần cài app gì trên điện thoại quầy không?"
    a: "Không cần cài thêm app. Nhóm Zalo hoặc Telegram dùng app đang có sẵn trên điện thoại, còn màn hình đọc to ở quầy chỉ là một đường link mở bằng trình duyệt, không phải tải về, không chiếm bộ nhớ máy."
  - q: "Nhân viên nghỉ việc thì phải làm gì để họ không thấy tiền quán nữa?"
    a: "Xoá nhân viên đó khỏi nhóm Zalo hoặc Telegram là xong, không phải đổi mật khẩu ngân hàng hay tạo lại kết nối. Người đó rời nhóm là mất quyền xem tin báo tiền vào ngay lập tức."
---

Khách chuyển khoản xong, chìa điện thoại nói "chuyển rồi nè", thu ngân nhìn ảnh trên màn hình khách rồi gọi hỏi chủ quán "tiền vô chưa" là cảnh lặp lại ở hầu hết quán ăn, quán trà sữa chưa dùng cách báo tiền vào tự động. Bài này hướng dẫn quán, cà phê, trà sữa dùng MONA Pay để cả nhóm nhân viên tự biết tiền vào, không phải hỏi qua hỏi lại.

> **Cho AI agent đọc trang này**
>
> Bản markdown thô của đúng trang này: `https://monapay.vn/docs/dung-ngay/quan-an-tra-sua.md`. Mục lục toàn bộ tài liệu MONA Pay: `https://monapay.vn/llms.txt`. Dán prompt dưới đây cho ChatGPT hoặc Claude để được hướng dẫn từng bước cho đúng quán của anh chị.
>
> ```text
> Đọc https://monapay.vn/docs/dung-ngay/quan-an-tra-sua.md rồi hướng dẫn tôi từng bước theo tình huống của tôi: quán ăn, quán trà sữa, [số nhân viên, có bán mang đi hay không].
> ```

## Kịch bản khi đã dùng MONA Pay

Khách ngồi bàn 3 gọi một ly trà sữa, quét mã QR dán tại bàn hoặc chuyển vào số tài khoản quán rồi ghi nội dung "ban 3". Ngay lúc tiền vào, ba việc xảy ra gần như cùng lúc:

1. **Nhóm Zalo của quán tự hiện một dòng tin**, dạng như "+55.000đ · trà sữa bàn 3 · 14:02", cả chủ quán, thu ngân, nhân viên pha chế đang có mặt trong nhóm đều thấy, không ai phải hỏi ai.
2. **Màn hình đặt ở quầy đọc to** "đã nhận năm mươi lăm nghìn đồng, nội dung trà sữa bàn 3", thu ngân đang bận tay pha chế vẫn nghe được, không cần nhìn màn hình liên tục.
3. **Mã QR ở bàn đã dán sẵn**, nên khách không phải hỏi "số tài khoản quán là gì" hay đọc số cho quán chép, quét là ra đúng tài khoản.

Không ai trong quán phải chìa điện thoại chủ ra xem sao kê, không ai phải nhắn hỏi lại "chuyển chưa vậy". Thu ngân nhìn tin trong nhóm hoặc nghe loa đọc là đủ để giao hàng.

<!-- ảnh chụp sau: /img/docs/dung-ngay/quan-an-nhom-zalo.png (Màn hình nhóm Zalo của quán hiện dòng tin tiền vào kèm số tiền và nội dung) -->*Cả nhóm nhân viên cùng thấy dòng tin ngay khi khách chuyển khoản xong, không ai phải hỏi lại ai.*

## Làm theo 4 bước

### 1. Nối tài khoản ngân hàng của quán

Vào [my.monapay.vn](https://my.monapay.vn), tạo tài khoản, sau đó vào mục Ngân hàng nhập số tài khoản và số điện thoại đã đăng ký với ngân hàng. Ngân hàng gửi hai mã OTP về điện thoại chủ quán, nhập đủ hai mã là nối xong. Tài khoản dùng để nối nên là tài khoản đứng tên chủ quán, không mượn tài khoản người khác vì OTP gửi đúng số điện thoại đã đăng ký với ngân hàng đó.

<!-- ảnh chụp sau: /img/docs/dung-ngay/quan-an-buoc-1-noi-ngan-hang.png (Màn hình dashboard mục nối ngân hàng với ô nhập số tài khoản và số điện thoại) -->*Nhập số tài khoản và số điện thoại đã đăng ký với ngân hàng, xác nhận bằng hai mã OTP.*

### 2. Thêm nhóm Zalo hoặc Telegram của quán

Tạo một nhóm gồm chủ quán và khoảng 5 đến 7 nhân viên đang làm ca, thêm bot MONA Pay vào nhóm theo hướng dẫn trong dashboard. Từ lúc này, mỗi giao dịch tiền vào tài khoản đã nối đều thành một tin nhắn trong nhóm, không phải người nào đứng ra báo lại cho người khác.

<!-- ảnh chụp sau: /img/docs/dung-ngay/quan-an-buoc-2-them-nhom.png (Màn hình dashboard mục thêm nhóm Zalo, ô dán mã nhóm và nút gửi thử) -->*Thêm bot vào nhóm quán, bấm gửi thử để chắc tin nhắn hiện đúng trong nhóm trước khi bán hàng thật.*

### 3. Bật màn hình đọc to ở quầy

Mục Loa báo có trong dashboard cho ra một đường link, mở link đó trên điện thoại hoặc máy tính bảng đặt cố định tại quầy, bấm nút bật loa một lần đầu tiên (trình duyệt cần một lần bấm để cho phép phát âm thanh). Sau đó cứ để màn hình sáng ở quầy, tiền vào là tự đọc to, không cần chạm vào máy nữa. Hợp với quán đông khách, thu ngân không có tay rảnh để cầm điện thoại xem liên tục.

<!-- ảnh chụp sau: /img/docs/dung-ngay/quan-an-buoc-3-loa-bao-co.png (Màn hình Loa báo có tại quầy với nút bật loa và danh sách giao dịch mới nhất) -->*Màn hình đặt tại quầy đọc to số tiền và nội dung mỗi khi có giao dịch mới, không cần ai chạm vào máy.*

### 4. In mã QR dán tại bàn hoặc quầy thu ngân

In mã QR ngân hàng của quán từ dashboard, dán tại từng bàn hoặc một mã chung dán ở quầy thu ngân. Khách mở app ngân hàng, quét mã, tự động ra đúng số tài khoản quán, khách chỉ cần gõ số tiền và nội dung bàn mình đang ngồi.

<!-- ảnh chụp sau: /img/docs/dung-ngay/quan-an-buoc-4-in-qr.png (Tờ in mã QR dán tại bàn, khách quét bằng app ngân hàng để chuyển khoản) -->*Mã QR dán tại bàn giúp khách chuyển đúng số tài khoản quán mà không cần chép tay.*

## Mẹo dùng cho quán ăn, quán trà sữa

**Đặt nội dung chuyển khoản có quy tắc.** Dặn khách hoặc dán sẵn gợi ý ghi nội dung theo dạng "bàn + số" hoặc "mã đơn mang đi", ví dụ "ban 3" hay "mang di 12". Nội dung có quy tắc giúp thu ngân đọc tin trong nhóm là biết ngay của bàn nào, không phải đoán khi hai khách chuyển cùng lúc.

**Khách chuyển thiếu vài nghìn đồng.** Chuyện này xảy ra khi khách làm tròn số hoặc gõ nhầm. Tin báo về nhóm Zalo và màn hình ở quầy luôn hiện đúng số tiền thật đã vào tài khoản, nên thu ngân thấy lệch là biết ngay lúc đó, không phải đợi cuối ngày đối chiếu sổ mới phát hiện thiếu.

**Ca đêm không có chủ quán trực.** Nhân viên ca đêm vẫn thấy đầy đủ tin báo trong nhóm và nghe loa đọc ở quầy như ca ngày, vì hệ thống chạy suốt 24 giờ, không phụ thuộc giờ làm việc của ai. Chủ quán xem lại danh sách giao dịch trong dashboard vào sáng hôm sau để đối chiếu doanh thu ca đêm.

**Quán có nhiều quầy hoặc nhiều chi nhánh.** Mỗi quầy hoặc mỗi chi nhánh dùng một số tài khoản ảo riêng, gắn với một nhóm Zalo riêng. Quầy nào chỉ thấy tin của quầy đó, chủ chuỗi có thể gộp xem chung ở dashboard hoặc tách theo từng nhóm nếu muốn quản lý chi nhánh độc lập.

## Bài liên quan

Quán vừa bán tại chỗ vừa nhận đặt hàng qua Facebook, Zalo thì đọc thêm [bán hàng online](/docs/dung-ngay/ban-hang-online) để biết cách gửi link thu tiền cho khách ở xa. Muốn xem lại ba việc gốc, hoặc cần số tổng đài khi kẹt bước nào, quay lại [trang tổng quan Dùng ngay](/docs/dung-ngay).
