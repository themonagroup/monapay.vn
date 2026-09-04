---
title: "Dùng ngay, không cần web, không cần lập trình"
description: "Hướng dẫn cho chủ quán, chủ tiệm: nối ngân hàng, chọn kênh báo có tiền vào, in QR để quầy. Không cần web, không cần biết lập trình, khoảng 10 phút."
updated: 04/09/2026
howto:
  - name: "Nối tài khoản ngân hàng"
    text: "Đăng ký tài khoản MONA Pay tại my.monapay.vn, sau đó nối tài khoản ngân hàng đứng tên chính mình bằng hai mã OTP ngân hàng gửi về điện thoại. Không cần đưa mật khẩu ngân hàng cho ai."
  - name: "Chọn kênh báo có tiền vào"
    text: "Bật thông báo vào nhóm Zalo hoặc Telegram để cả nhân viên cùng thấy tiền vào, hoặc mở màn hình đọc to ở quầy. Bật một kênh hay bật cả hai đều được."
  - name: "In mã QR để quầy hoặc lấy link thu tiền"
    text: "In mã QR ngân hàng dán ở quầy để khách quét chuyển khoản, hoặc lấy link thu tiền gửi qua Zalo, Facebook cho khách chưa đến tận nơi."
faq:
  - q: "Tôi không rành máy tính, có tự làm được không?"
    a: "Được. Ba việc trong bài này đều làm trên điện thoại, bấm theo hướng dẫn trong dashboard, không cần viết dòng lệnh nào. Chỗ nào không hiểu, xem lại phần hướng dẫn của trang, hoặc gọi tổng đài ghi ở cuối trang này để có người ngồi cùng tới khi chạy."
  - q: "Cần chuẩn bị gì trước khi bắt đầu?"
    a: "Một tài khoản ngân hàng đứng tên chính chủ quán hoặc chủ tiệm, và chiếc điện thoại đang dùng số đã đăng ký với ngân hàng đó để nhận mã OTP. Có hai thứ này là làm được hết ba bước."
  - q: "Có mất phí không?"
    a: "MONA Pay miễn phí 500 giao dịch mỗi tháng, đủ dùng cho phần lớn quán, tiệm, lớp học. Không thu phần trăm trên số tiền khách chuyển. Bán quá 500 giao dịch một tháng thì mới cần xem gói trả phí, gọi tổng đài để được tư vấn gói hợp quy mô."
  - q: "Tiền có qua MONA Pay không, có an toàn không?"
    a: "Không. Khách chuyển thẳng vào tài khoản ngân hàng đứng tên anh chị, y như chuyển khoản bình thường. MONA Pay chỉ đọc lại thông báo giao dịch từ ngân hàng rồi báo cho anh chị biết, không giữ tiền, không đứng giữa."
  - q: "Tôi vừa bán tại quán vừa bán online thì chọn hướng dẫn nào?"
    a: "Đọc cả hai. Ba việc cốt lõi ở trang này dùng chung cho mọi hình thức bán hàng, còn bài riêng theo từng ngành ở dưới có thêm mẹo cho đúng tình huống của quán, tiệm hoặc shop online."
---

MONA Pay ban đầu viết cho lập trình viên nối vào website, phần mềm bán hàng bằng webhook, API. Nhưng phần lớn quán ăn, quán trà sữa, tiệm tóc, spa, shop bán qua Facebook hay Zalo, hoặc lớp học nhỏ không có ai biết lập trình, cũng không có website. Bài này viết riêng cho những người đó: không cần web, không cần biết lập trình, làm theo ba việc dưới đây là dùng được ngay.

> **Cho AI agent đọc trang này**
>
> Bản markdown thô của đúng trang này: `https://monapay.vn/docs/dung-ngay.md`. Mục lục toàn bộ tài liệu MONA Pay: `https://monapay.vn/llms.txt`. Không muốn đọc hết bài, anh chị dán prompt dưới đây cho ChatGPT hoặc Claude, máy tự đọc và hướng dẫn từng bước theo đúng tình huống của mình.
>
> ```text
> Đọc https://monapay.vn/docs/dung-ngay.md rồi hướng dẫn tôi từng bước theo tình huống của tôi: [quán ăn / tiệm tóc, spa / bán hàng online qua Facebook, Zalo / lớp học, trung tâm].
> ```

## Ai hợp dùng cách này

Cách dùng ngay trong bài này hợp với những người bán hàng nhận tiền bằng chuyển khoản, chưa có phần mềm quản lý, hoặc có phần mềm nhưng chưa muốn nhờ ai nối kỹ thuật. Cụ thể là:

- **Quán ăn, quán trà sữa, quán cà phê:** khách chuyển khoản xong, thu ngân cần biết ngay để giao món hoặc gạch bill, không phải hỏi chủ quán "tiền vô chưa".
- **Tiệm tóc, spa, phòng khám nhỏ:** khách đặt lịch chuyển cọc trước, lễ tân cần biết cọc đã vào để giữ chỗ.
- **Shop bán qua Facebook, Zalo:** khách nhắn "chuyển rồi" nhưng chưa có ai xác nhận thật sự đã có tiền, hoặc chưa có website để gắn công cụ thanh toán.
- **Lớp học, trung tâm nhỏ:** phụ huynh hoặc học viên đóng học phí bằng chuyển khoản, giáo vụ cần biết ai đã đóng mà không phải dò từng dòng sao kê.

Nếu quán, tiệm của anh chị rơi vào một trong bốn nhóm trên, đọc tiếp phần dưới rồi chọn đúng bài hướng dẫn theo ngành ở cuối trang.

## Cần chuẩn bị gì trước khi bắt đầu

Chỉ cần hai thứ, không cần gì thêm:

1. **Một tài khoản ngân hàng đứng tên chính mình** (cá nhân hoặc doanh nghiệp đều được), là nơi khách sẽ chuyển tiền vào. MONA Pay hiện nối được ACB, các ngân hàng khác đang trong quá trình đăng ký kết nối thêm.
2. **Chiếc điện thoại đang dùng số đã đăng ký với ngân hàng đó**, vì bước nối ngân hàng cần xác nhận bằng mã OTP ngân hàng gửi về số này.

Có đủ hai thứ trên, làm xong ba bước dưới đây mất khoảng 10 phút.

<figure class="photo">
  <picture>
    <source srcset="/img/dashboard/overview.avif" type="image/avif" />
    <source srcset="/img/dashboard/overview.webp" type="image/webp" />
    <img src="/img/dashboard/overview.png" width="1280" height="860" loading="lazy" decoding="async" alt="Dashboard MONA Pay tổng quan các bước nối ngân hàng, tạo tài khoản ảo và nhận báo có" />
  </picture>
  <figcaption>Tạm dùng màn hình Tổng quan để minh họa nơi bắt đầu ba bước, ảnh chụp từ dashboard my.monapay.vn.</figcaption>
</figure>

## 3 việc cốt lõi

### 1. Nối ngân hàng

Vào [my.monapay.vn](https://my.monapay.vn), tạo tài khoản bằng số điện thoại hoặc email, xong là dùng được ngay, không phải chờ ai duyệt. Vào mục Ngân hàng, nhập số tài khoản và số điện thoại đã đăng ký với ngân hàng, ngân hàng gửi hai mã OTP lần lượt: mã thứ nhất để tạo kết nối, mã thứ hai để bật nhận thông báo mỗi khi có tiền vào. Nhập xong hai mã, tài khoản ngân hàng đã nối xong.

### 2. Chọn kênh báo có

Chọn nơi anh chị muốn nhận tin báo mỗi khi có tiền vào. Ba lựa chọn dùng chung hoặc dùng riêng đều được:

- **Nhóm Zalo hoặc Telegram của quán, tiệm:** thêm bot MONA Pay vào nhóm có 5 đến 7 nhân viên, từ đó tiền vào là cả nhóm cùng thấy dòng tin, không ai phải hỏi lại ai.
- **Màn hình đọc to ở quầy (Loa báo có):** mở một đường link trên điện thoại hoặc máy tính bảng đặt tại quầy, bấm nút bật loa một lần, từ đó mỗi khi có tiền vào màn hình hiện dòng mới và đọc to số tiền cùng nội dung chuyển khoản, hợp với quầy đông khách, nhân viên không rảnh tay cầm điện thoại.
- **Email đã xác minh:** hợp cho chủ quán muốn tự mình theo dõi riêng, không cần vào nhóm chung.

Bật một kênh là đủ dùng, bật cả ba cũng không sao, mỗi kênh phục vụ một người khác nhau trong quán.

### 3. In mã QR để quầy, hoặc lấy link thu tiền

Có hai cách để khách chuyển đúng và đủ:

- **In mã QR ngân hàng dán ở quầy:** khách mở app ngân hàng, quét mã là ra đúng số tài khoản của quán, không phải đọc số tài khoản cho khách chép tay.
- **Lấy link thu tiền gửi qua tin nhắn:** hợp khi bán online, khách ở xa hoặc đặt cọc qua Zalo, Facebook, chưa đến tận quán. Gửi link, khách bấm vào là ra màn hình chuyển khoản đã điền sẵn số tiền.

Xong bước này là toàn bộ cách dùng ngay đã sẵn sàng. Việc còn lại là bán hàng như bình thường, tiền vào là có tin báo, không phải mở app ngân hàng dò từng dòng nữa.

## Chọn đúng bài theo tình huống của anh chị

Ba việc trên dùng chung cho mọi ngành, nhưng mỗi ngành có vài mẹo riêng đáng đọc thêm:

- [Quán ăn, quán trà sữa](/docs/dung-ngay/quan-an-tra-sua): kịch bản đúng lúc khách đông, xử lý khách chuyển thiếu, chia ca đêm.
- [Tiệm tóc, spa](/docs/dung-ngay/tiem-toc-spa): thu cọc lịch hẹn, nhóm Zalo lễ tân.
- [Bán hàng online](/docs/dung-ngay/ban-hang-online): bán qua Facebook, Zalo chưa có website, chống khách nói "em chuyển rồi mà".
- [Lớp học, trung tâm](/docs/dung-ngay/lop-hoc): thu học phí tự xác nhận, biên lai gửi email, nhóm Zalo giáo vụ.

Hướng dẫn ở bốn trang trên và trang này cũng xem được ngay trong dashboard [my.monapay.vn](https://my.monapay.vn), mục **Hướng dẫn**, cùng một nội dung, khỏi phải mở lại monapay.vn khi đang thao tác trong dashboard.

<figure class="photo">
  <picture>
    <source srcset="/img/dashboard/huong-dan.avif" type="image/avif" />
    <source srcset="/img/dashboard/huong-dan.webp" type="image/webp" />
    <img src="/img/dashboard/huong-dan.png" width="1280" height="860" loading="lazy" decoding="async" alt="Dashboard MONA Pay mục Hướng dẫn dùng ngay cho quán, tiệm, bán hàng online và lớp học" />
  </picture>
  <figcaption>Mục Hướng dẫn trong dashboard chia sẵn lối đi theo từng mô hình kinh doanh, ảnh chụp từ dashboard my.monapay.vn.</figcaption>
</figure>

Kẹt chỗ nào trong lúc làm theo, gọi tổng đài **1900 636 648**, có người trực nghe máy trong giờ làm việc và ngồi cùng anh chị tới khi ba bước trên chạy được.
