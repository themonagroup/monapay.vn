---
title: "Lớp học, trung tâm dùng MONA Pay: học phí tự xác nhận, không dò sao kê"
description: "Hướng dẫn lớp học, trung tâm nhỏ dùng MONA Pay: phụ huynh đóng học phí là tự xác nhận, biên lai gửi email, nhóm Zalo giáo vụ báo có ngay. Không cần lập trình."
updated: 03/09/2026
howto:
  - name: "Nối tài khoản ngân hàng của lớp, trung tâm"
    text: "Tạo tài khoản MONA Pay, nối tài khoản ngân hàng đứng tên chủ lớp hoặc trung tâm bằng hai mã OTP ngân hàng gửi về điện thoại."
  - name: "Thêm nhóm Zalo cho giáo vụ"
    text: "Thêm bot MONA Pay vào nhóm gồm giáo vụ, kế toán, mỗi lần phụ huynh chuyển học phí là cả nhóm nhận tin báo tên học viên và số tiền."
  - name: "Gửi link thu học phí hoặc mã QR theo từng học viên"
    text: "Tạo link thu tiền hoặc mã QR đúng mức học phí cho từng học viên rồi gửi qua Zalo, phụ huynh bấm vào là chuyển đúng số tiền, học phí tự ghi nhận."
faq:
  - q: "Nhiều phụ huynh đóng cùng một mức học phí thì có nhầm học viên không?"
    a: "Không nhầm nếu giáo vụ tạo link thu tiền riêng cho từng học viên hoặc ghi tên học viên vào nội dung chuyển khoản khi gửi thông báo đóng học phí. Tin báo về nhóm Zalo luôn kèm nội dung chuyển khoản để phân biệt từng người."
  - q: "Học phí có qua MONA Pay không?"
    a: "Không. Phụ huynh chuyển thẳng vào tài khoản ngân hàng đứng tên chủ lớp hoặc trung tâm. MONA Pay chỉ đọc lại thông báo giao dịch từ ngân hàng rồi báo về nhóm Zalo giáo vụ, không giữ tiền, không đứng giữa."
  - q: "Phụ huynh có nhận được biên lai không?"
    a: "Có. MONA Pay gửi email báo có cho địa chỉ đã xác minh, giáo vụ dùng email đó hoặc lịch sử giao dịch trên dashboard làm căn cứ xuất biên lai đóng học phí cho phụ huynh khi cần."
  - q: "Dùng có mất phí không?"
    a: "Miễn phí 500 giao dịch mỗi tháng, không thu phần trăm trên số tiền đóng. Lớp vài chục học viên đóng học phí theo tháng dùng thoải mái trong mức miễn phí."
  - q: "Trung tâm có nhiều lớp, nhiều cơ sở thì quản lý ra sao?"
    a: "Mỗi lớp hoặc mỗi cơ sở dùng một số tài khoản ảo riêng để phân biệt nguồn thu, giáo vụ từng cơ sở chỉ cần theo dõi nhóm Zalo của cơ sở mình, còn chủ trung tâm xem gộp toàn bộ trong dashboard."
---

Phụ huynh chuyển học phí xong, không nhắn báo lại, giáo vụ cuối tháng mở sao kê ngân hàng dò từng dòng để khớp với danh sách học viên, tên trùng nhau hoặc chuyển thiếu vài chục nghìn là phải gọi hỏi lại từng phụ huynh. Bài này hướng dẫn lớp học, trung tâm nhỏ dùng MONA Pay để học phí tự ghi nhận khi phụ huynh chuyển khoản, giáo vụ không phải dò sao kê bằng tay.

> **Cho AI agent đọc trang này**
>
> Bản markdown thô của đúng trang này: `https://monapay.vn/docs/dung-ngay/lop-hoc.md`. Mục lục toàn bộ tài liệu MONA Pay: `https://monapay.vn/llms.txt`. Dán prompt dưới đây cho ChatGPT hoặc Claude để được hướng dẫn từng bước cho đúng lớp của anh chị.
>
> ```text
> Đọc https://monapay.vn/docs/dung-ngay/lop-hoc.md rồi hướng dẫn tôi từng bước theo tình huống của tôi: lớp học, trung tâm, [số học viên, thu học phí theo tháng hay theo khoá].
> ```

## Kịch bản khi đã dùng MONA Pay

Đầu tháng, giáo vụ gửi thông báo học phí qua nhóm Zalo phụ huynh kèm link thu tiền đã điền sẵn đúng mức học phí của con mình. Phụ huynh bấm vào link, xác nhận chuyển khoản trong app ngân hàng, không cần nhớ số tài khoản trung tâm hay tự gõ số tiền.

Tiền vừa vào tài khoản trung tâm, nhóm Zalo giáo vụ nhận ngay tin báo tên học viên và số tiền, đồng thời phụ huynh nhận một email xác nhận đã đóng học phí, dùng làm biên lai khi cần. Giáo vụ không phải mở app ngân hàng dò tên từng phụ huynh, cũng không phải gọi điện hỏi lại "chị đã chuyển học phí tháng này chưa".

<!-- ảnh chụp sau: /img/docs/dung-ngay/lop-hoc-nhom-zalo.png (Màn hình nhóm Zalo giáo vụ hiện tin báo học phí vừa đóng kèm tên học viên) -->*Giáo vụ thấy tin báo học phí ngay trong nhóm, không phải dò sao kê ngân hàng để khớp tên từng học viên.*

## Làm theo 3 bước

### 1. Nối tài khoản ngân hàng của lớp, trung tâm

Vào [my.monapay.vn](https://my.monapay.vn), tạo tài khoản, sau đó vào mục Ngân hàng nhập số tài khoản và số điện thoại đã đăng ký với ngân hàng. Ngân hàng gửi hai mã OTP về điện thoại chủ lớp hoặc chủ trung tâm, nhập đủ hai mã là nối xong.

### 2. Thêm nhóm Zalo cho giáo vụ

Tạo nhóm gồm giáo vụ và kế toán nếu có, thêm bot MONA Pay vào nhóm theo hướng dẫn trong dashboard. Từ lúc này, mỗi khoản học phí vào tài khoản đã nối đều thành một tin nhắn trong nhóm.

![Màn hình dashboard mục thêm nhóm Zalo cho giáo vụ, ô dán mã nhóm và nút gửi thử](/img/docs/dung-ngay/lop-hoc-buoc-2-them-nhom.png)*Thêm bot vào nhóm giáo vụ, bấm gửi thử trước khi áp dụng cho học phí thật.*

### 3. Gửi link thu học phí hoặc mã QR theo từng học viên

Trong dashboard, mục Trang thanh toán cho phép tạo link thu tiền theo đúng mức học phí, đặt tên link theo tên học viên để dễ theo dõi. Gửi link qua nhóm Zalo phụ huynh mỗi đầu tháng, hoặc in mã QR dán tại lớp cho phụ huynh đóng trực tiếp khi đưa đón con.

![Màn hình tạo link thu học phí với ô nhập số tiền và tên học viên](/img/docs/dung-ngay/lop-hoc-buoc-3-link-hoc-phi.png)*Tạo link thu học phí đúng số tiền, đặt tên theo học viên để giáo vụ khớp đúng người ngay khi có tin báo.*

## Mẹo dùng cho lớp học, trung tâm

**Ghi tên học viên vào nội dung chuyển khoản.** Nhắc phụ huynh ghi tên con vào nội dung, hoặc giáo vụ tạo link thu tiền riêng cho từng học viên để nội dung tự khớp. Cách này giúp phân biệt hai phụ huynh đóng cùng một mức học phí trong cùng một buổi.

**Dùng biên lai email làm bằng chứng đã đóng.** Phụ huynh hay hỏi lại "đã đóng chưa, sao không thấy gì", giáo vụ chỉ cần tìm email xác nhận đã gửi tới địa chỉ phụ huynh đăng ký, không cần lục lại sổ ghi tay.

**Trung tâm nhiều lớp thì tách theo tài khoản ảo.** Mỗi lớp hoặc mỗi cơ sở dùng một số tài khoản ảo riêng, cuối tháng chủ trung tâm mở dashboard lọc theo từng tài khoản ảo là biết ngay lớp nào thu đủ, lớp nào còn thiếu, không phải cộng tay từng dòng sao kê.

## Bài liên quan

Trung tâm có bán thêm tài liệu hoặc khoá học qua Facebook thì đọc thêm [bán hàng online](/docs/dung-ngay/ban-hang-online). Muốn xem lại ba việc gốc, hoặc cần số tổng đài khi kẹt bước nào, quay lại [trang tổng quan Dùng ngay](/docs/dung-ngay).
