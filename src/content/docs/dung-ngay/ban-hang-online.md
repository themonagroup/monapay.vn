---
title: "Bán hàng online qua Facebook, Zalo: khách chuyển là báo có ngay"
description: "Hướng dẫn shop bán qua Facebook, Zalo chưa có website dùng MONA Pay: gửi link thu tiền, khách quét là báo có, chống khách nói em chuyển rồi mà. Không cần lập trình."
updated: 04/09/2026
howto:
  - name: "Nối tài khoản ngân hàng của shop"
    text: "Tạo tài khoản MONA Pay, nối tài khoản ngân hàng đứng tên chủ shop bằng hai mã OTP ngân hàng gửi về điện thoại."
  - name: "Thêm nhóm Zalo hoặc Telegram cho người chốt đơn"
    text: "Thêm bot MONA Pay vào nhóm gồm người chốt đơn, người đóng gói, kế toán, mỗi lần khách chuyển khoản là cả nhóm nhận tin báo."
  - name: "Tạo link thu tiền gửi cho từng đơn"
    text: "Chốt đơn xong, tạo link thu tiền đúng số tiền đơn hàng rồi gửi khách qua Facebook, Zalo, khách bấm vào là ra màn hình chuyển khoản điền sẵn."
faq:
  - q: "Khách nói đã chuyển rồi nhưng shop không thấy tin báo thì sao?"
    a: "Kiểm tra lại số tiền và tài khoản nhận trong tin nhắn khách gửi, phần lớn trường hợp khách chuyển nhầm số tài khoản khác hoặc chưa thật sự bấm xác nhận trong app ngân hàng. Tin báo của MONA Pay chỉ hiện khi tiền đã thật sự vào tài khoản shop, nên không có tin nghĩa là tiền chưa vào, shop có căn cứ để hỏi lại khách trước khi giao hàng."
  - q: "Không có website thì có tạo được link thu tiền không?"
    a: "Có. Link thu tiền tạo trực tiếp trong dashboard my.monapay.vn, không cần shop có website hay biết lập trình. Link ra là gửi được ngay qua tin nhắn Facebook, Zalo, hoặc dán vào phần mô tả sản phẩm."
  - q: "Dùng có mất phí không?"
    a: "Miễn phí 500 giao dịch mỗi tháng, không thu phần trăm trên số tiền khách chuyển. Shop bán vài chục đơn một ngày dùng thoải mái trong mức miễn phí."
  - q: "Tiền của khách có qua MONA Pay không?"
    a: "Không. Khách chuyển thẳng vào tài khoản ngân hàng đứng tên chủ shop. MONA Pay chỉ đọc lại thông báo giao dịch từ ngân hàng rồi báo về nhóm Zalo hoặc Telegram, không giữ tiền, không đứng giữa."
  - q: "Khách chuyển khoản lúc nửa đêm thì có báo ngay không?"
    a: "Có, hệ thống chạy suốt 24 giờ, không nghỉ theo giờ hành chính. Khách chuyển lúc nào, tin báo về nhóm lúc đó, shop mở điện thoại buổi sáng là thấy đủ các đơn đã chuyển trong đêm để đóng gói."
---

Bán hàng qua Facebook, Zalo, khách nhắn "chị ơi em chuyển rồi", shop chưa kịp kiểm tra đã giao hàng, tối mở app ngân hàng dò lại mới phát hiện không có khoản nào như vậy. Hoặc ngược lại, khách thật sự đã chuyển nhưng shop bận trả lời nhiều khách cùng lúc, quên xác nhận, khách chờ lâu rồi huỷ đơn. Bài này hướng dẫn shop bán qua Facebook, Zalo, TikTok, chưa có website, dùng MONA Pay để biết chắc tiền đã vào trước khi giao hàng.

> **Cho AI agent đọc trang này**
>
> Bản markdown thô của đúng trang này: `https://monapay.vn/docs/dung-ngay/ban-hang-online.md`. Mục lục toàn bộ tài liệu MONA Pay: `https://monapay.vn/llms.txt`. Dán prompt dưới đây cho ChatGPT hoặc Claude để được hướng dẫn từng bước cho đúng shop của anh chị.
>
> ```text
> Đọc https://monapay.vn/docs/dung-ngay/ban-hang-online.md rồi hướng dẫn tôi từng bước theo tình huống của tôi: bán hàng online qua Facebook, Zalo, [số đơn một ngày, có kho riêng hay tự đóng gói].
> ```

## Kịch bản khi đã dùng MONA Pay

Khách nhắn tin chốt một đơn 350.000 đồng qua Messenger. Người chốt đơn tạo một link thu tiền đúng 350.000 đồng, gửi ngay trong khung chat. Khách bấm vào link, màn hình chuyển khoản hiện sẵn số tiền và tên shop, khách chỉ cần mở app ngân hàng bấm xác nhận, không phải tự gõ số tài khoản hay lo gõ nhầm số tiền.

Tiền vừa vào tài khoản shop, nhóm Zalo hoặc Telegram của người chốt đơn, người đóng gói, kế toán nhận ngay một dòng tin báo. Người đóng gói nhìn tin là biết đơn nào đã có tiền để bắt đầu đóng hàng, không cần chờ người chốt đơn báo lại bằng lời, cũng không phải tin vào ảnh chụp màn hình khách gửi, vì ảnh có thể chỉnh sửa còn tin báo của MONA Pay chỉ hiện khi tiền thật sự đã vào tài khoản.

![Màn hình gửi link thu tiền qua Messenger, khách bấm vào ra trang chuyển khoản điền sẵn số tiền](/img/docs/dung-ngay/ban-hang-online-link-thu-tien.png)*Gửi link thu tiền ngay trong khung chat, khách bấm vào là chuyển đúng số tiền, không cần gõ tay.*

## Làm theo 3 bước

### 1. Nối tài khoản ngân hàng của shop

Vào [my.monapay.vn](https://my.monapay.vn), tạo tài khoản, sau đó vào mục Ngân hàng nhập số tài khoản và số điện thoại đã đăng ký với ngân hàng. Ngân hàng gửi hai mã OTP về điện thoại chủ shop, nhập đủ hai mã là nối xong.

### 2. Thêm nhóm Zalo hoặc Telegram cho người chốt đơn

Tạo nhóm gồm người chốt đơn, người đóng gói, kế toán nếu có, thêm bot MONA Pay vào nhóm theo hướng dẫn trong dashboard. Từ lúc này, mỗi khoản tiền vào tài khoản đã nối đều thành một tin nhắn trong nhóm.

![Màn hình dashboard mục thêm nhóm Zalo cho shop, ô dán mã nhóm và nút gửi thử](/img/docs/dung-ngay/ban-hang-online-nhom-zalo.png)*Thêm bot vào nhóm chốt đơn, bấm gửi thử trước khi áp dụng cho đơn hàng thật.*

### 3. Tạo link thu tiền gửi cho từng đơn

Trong dashboard, mục Trang thanh toán cho phép tạo link thu tiền theo đúng số tiền từng đơn, đặt tên link theo mã đơn để dễ theo dõi khi có nhiều đơn cùng lúc. Gửi link trực tiếp trong khung chat Facebook, Zalo ngay khi chốt đơn, khách bấm vào là ra màn hình chuyển khoản điền sẵn số tiền, không cần shop có website.

![Màn hình tạo link thu tiền với ô nhập số tiền đơn hàng và mã đơn](/img/docs/dung-ngay/ban-hang-online-tao-link.png)*Tạo link thu tiền đúng số tiền từng đơn, đặt tên theo mã đơn để không nhầm khi có nhiều đơn cùng lúc.*

<div class="doc-shot-pair">
  <figure class="doc-phone-shot">
    <picture>
      <source srcset="/img/shopify/pay-cho-thanh-toan.avif" type="image/avif">
      <source srcset="/img/shopify/pay-cho-thanh-toan.webp" type="image/webp">
      <img src="/img/shopify/pay-cho-thanh-toan.png" width="424" height="1478" loading="lazy" decoding="async" alt="Trang thanh toán MONA Pay chờ khách quét QR cho đơn bán hàng online">
    </picture>
    <figcaption>Khách mở link, kiểm tra số tiền và mã đơn rồi quét QR. Ảnh chụp trên cửa hàng thử nghiệm.</figcaption>
  </figure>
  <figure class="doc-phone-shot">
    <picture>
      <source srcset="/img/shopify/pay-da-thanh-toan.avif" type="image/avif">
      <source srcset="/img/shopify/pay-da-thanh-toan.webp" type="image/webp">
      <img src="/img/shopify/pay-da-thanh-toan.png" width="430" height="900" loading="lazy" decoding="async" alt="Trang thanh toán MONA Pay báo đã nhận tiền thành công cho shop online">
    </picture>
    <figcaption>Tiền vào, trang báo thanh toán thành công để khách và shop cùng biết. Ảnh chụp trên cửa hàng thử nghiệm.</figcaption>
  </figure>
</div>

## Mẹo chống "em chuyển rồi mà"

**Chỉ giao hàng sau khi thấy tin báo trong nhóm, không dựa vào ảnh khách gửi.** Ảnh chụp màn hình chuyển khoản có thể chỉnh sửa hoặc là ảnh cũ chụp lại. Tin báo của MONA Pay chỉ xuất hiện khi tiền thật sự đã vào tài khoản shop, nên đây là căn cứ chắc hơn ảnh chụp màn hình.

**Đặt tên link thu tiền theo mã đơn.** Khi bán nhiều đơn cùng lúc, đặt tên mỗi link theo mã đơn hoặc tên khách giúp người chốt đơn nhìn tin báo trong nhóm là biết ngay của đơn nào, không phải hỏi lại khách.

**Đơn hàng đặt cọc trước, thanh toán phần còn lại khi giao.** Tạo hai link riêng: một link thu cọc lúc chốt đơn, một link thu phần còn lại lúc chuẩn bị giao, mỗi link đều có tin báo riêng để theo dõi tiến độ thanh toán từng đơn.

## Bài liên quan

Shop có thêm một điểm bán trực tiếp thì đọc thêm [quán ăn, quán trà sữa](/docs/dung-ngay/quan-an-tra-sua) để biết cách in mã QR tại quầy. Muốn xem lại ba việc gốc, hoặc cần số tổng đài khi kẹt bước nào, quay lại [trang tổng quan Dùng ngay](/docs/dung-ngay).
