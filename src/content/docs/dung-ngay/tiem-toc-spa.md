---
title: "Tiệm tóc, spa dùng MONA Pay: khách cọc lịch là lễ tân biết ngay"
description: "Hướng dẫn tiệm tóc, spa dùng MONA Pay: gửi link thu cọc lịch hẹn, lịch tự xác nhận khi tiền vào, nhóm Zalo lễ tân báo có ngay. Không cần lập trình."
updated: 03/09/2026
howto:
  - name: "Nối tài khoản ngân hàng của tiệm"
    text: "Tạo tài khoản MONA Pay, nối tài khoản ngân hàng đứng tên chủ tiệm bằng hai mã OTP ngân hàng gửi về điện thoại."
  - name: "Thêm nhóm Zalo cho lễ tân"
    text: "Thêm bot MONA Pay vào nhóm gồm lễ tân và chủ tiệm, mỗi lần khách chuyển cọc là cả nhóm nhận tin báo số tiền và tên khách."
  - name: "Tạo link thu cọc gửi khách qua Zalo, Messenger"
    text: "Chốt lịch xong, tạo một link thu tiền ghi đúng số cọc rồi gửi khách qua tin nhắn, khách bấm vào là ra màn hình chuyển khoản điền sẵn số tiền."
faq:
  - q: "Khách chuyển cọc mà tiệm chưa xem tin ngay lúc đó thì có mất thông tin không?"
    a: "Không mất. Tin báo nằm trong lịch sử nhóm Zalo và trong sổ giao dịch trên dashboard my.monapay.vn, lễ tân có thể mở lại xem bất cứ lúc nào, không nhất thiết phải đọc ngay lúc tin về."
  - q: "Khách đặt cọc rồi không đến, có bằng chứng gì để giữ cọc không?"
    a: "Có. Mỗi giao dịch có thời gian, số tiền và nội dung ghi rõ trong lịch sử trên dashboard và trong sao kê ngân hàng, tiệm dùng đó làm căn cứ áp dụng chính sách cọc của mình, không phải chỉ dựa vào lời khách nói đã chuyển."
  - q: "Dùng có mất phí không?"
    a: "Miễn phí 500 giao dịch mỗi tháng, không thu phần trăm trên số tiền khách chuyển. Tiệm vài chục lịch hẹn một tháng dùng thoải mái trong mức miễn phí."
  - q: "Tiền cọc có qua MONA Pay không?"
    a: "Không. Khách chuyển thẳng vào tài khoản ngân hàng đứng tên chủ tiệm. MONA Pay chỉ đọc lại thông báo giao dịch từ ngân hàng rồi báo về nhóm Zalo, không giữ tiền, không đứng giữa."
  - q: "Nhiều khách cọc cùng một mức tiền trong một buổi thì có bị nhầm khách không?"
    a: "Không nhầm nếu lễ tân dùng link thu tiền riêng cho từng khách hoặc ghi tên khách vào nội dung chuyển khoản khi chốt lịch. Tin báo về nhóm Zalo luôn kèm nội dung chuyển khoản để phân biệt từng người."
---

Chốt lịch xong, tiệm nhắn khách "chuyển cọc 200 nghìn giữ chỗ nha", khách chuyển xong không báo lại, đến giờ hẹn lễ tân vẫn phải mở app ngân hàng của chủ tiệm dò xem khách đã chuyển hay chưa mới dám xếp lịch. Bài này hướng dẫn tiệm tóc, spa, phòng khám nhỏ dùng MONA Pay để lễ tân biết cọc đã vào ngay lúc khách chuyển, không phải mở app ngân hàng kiểm tra thủ công.

> **Cho AI agent đọc trang này**
>
> Bản markdown thô của đúng trang này: `https://monapay.vn/docs/dung-ngay/tiem-toc-spa.md`. Mục lục toàn bộ tài liệu MONA Pay: `https://monapay.vn/llms.txt`. Dán prompt dưới đây cho ChatGPT hoặc Claude để được hướng dẫn từng bước cho đúng tiệm của anh chị.
>
> ```text
> Đọc https://monapay.vn/docs/dung-ngay/tiem-toc-spa.md rồi hướng dẫn tôi từng bước theo tình huống của tôi: tiệm tóc, spa, [số lễ tân, mức cọc thường thu].
> ```

## Kịch bản khi đã dùng MONA Pay

Khách nhắn Zalo đặt lịch cắt tóc lúc 15 giờ chiều mai. Lễ tân trả lời, chốt lịch, rồi gửi ngay một link thu cọc ghi sẵn số tiền cần chuyển, ví dụ 100.000 đồng giữ chỗ. Khách bấm vào link, màn hình chuyển khoản hiện sẵn số tiền và tên tiệm, khách chỉ cần xác nhận trong app ngân hàng của mình, không phải gõ tay số tài khoản hay số tiền.

Ngay khi tiền vào tài khoản tiệm, nhóm Zalo của lễ tân nhận một dòng tin báo số tiền và nội dung, lịch hẹn coi như đã giữ chỗ chắc chắn. Lễ tân không cần hỏi lại chủ tiệm "cọc vào chưa", cũng không cần mở app ngân hàng của chủ để dò từng dòng giao dịch.

<!-- ảnh chụp sau: /img/docs/dung-ngay/tiem-toc-nhom-zalo.png (Màn hình nhóm Zalo lễ tân hiện tin báo tiền cọc vừa vào) -->*Lễ tân thấy tin báo cọc ngay trong nhóm, không phải hỏi chủ tiệm hay mở app ngân hàng kiểm tra.*

## Làm theo 3 bước

### 1. Nối tài khoản ngân hàng của tiệm

Vào [my.monapay.vn](https://my.monapay.vn), tạo tài khoản, sau đó vào mục Ngân hàng nhập số tài khoản và số điện thoại đã đăng ký với ngân hàng. Ngân hàng gửi hai mã OTP về điện thoại chủ tiệm, nhập đủ hai mã là nối xong.

### 2. Thêm nhóm Zalo cho lễ tân

Tạo nhóm gồm lễ tân và chủ tiệm, thêm bot MONA Pay vào nhóm theo hướng dẫn trong dashboard. Từ lúc này, mỗi khoản tiền vào tài khoản đã nối đều thành một tin nhắn trong nhóm, lễ tân xem điện thoại đang cầm là biết, không cần đăng nhập app ngân hàng của chủ.

<!-- ảnh chụp sau: /img/docs/dung-ngay/tiem-toc-buoc-2-them-nhom.png (Màn hình dashboard mục thêm nhóm Zalo cho tiệm, ô dán mã nhóm) -->*Thêm bot vào nhóm lễ tân, bấm gửi thử trước khi áp dụng cho lịch hẹn thật.*

### 3. Tạo link thu cọc gửi khách qua Zalo, Messenger

Trong dashboard, mục Trang thanh toán cho phép tạo một link thu tiền theo đúng số cọc muốn thu, đặt tên link theo tên khách hoặc mã lịch hẹn để dễ theo dõi. Gửi link đó cho khách ngay khi chốt lịch qua Zalo hay Messenger, khách bấm vào là ra màn hình chuyển khoản điền sẵn số tiền, không cần biết số tài khoản tiệm.

<!-- ảnh chụp sau: /img/docs/dung-ngay/tiem-toc-buoc-3-link-thu-coc.png (Màn hình tạo link thu cọc với ô nhập số tiền và tên khách) -->*Tạo link thu cọc đúng số tiền cần thu rồi gửi khách qua tin nhắn, không cần khách tự gõ số tài khoản.*

## Mẹo dùng cho tiệm tóc, spa

**Ghi tên khách vào nội dung chuyển khoản khi chốt lịch.** Nhắc khách ghi tên mình vào nội dung, hoặc lễ tân tạo link thu cọc riêng cho từng khách để nội dung tự khớp. Cách này giúp phân biệt hai khách cọc cùng một mức tiền trong cùng buổi sáng.

**Thu phần còn lại sau khi làm dịch vụ xong cũng bằng link tương tự.** Xong buổi cắt, buổi spa, tạo thêm một link thu tiền cho phần còn lại, khách quét hoặc bấm link thanh toán ngay tại quầy, lễ tân không phải cầm máy POS riêng.

**Nhiều lễ tân theo ca thì dùng chung một nhóm Zalo.** Không cần tách nhóm theo ca vì ai cũng cần thấy lịch nào đã cọc, lịch nào chưa để tránh xếp trùng giờ.

## Bài liên quan

Tiệm có bán thêm sản phẩm chăm sóc qua Facebook thì đọc thêm [bán hàng online](/docs/dung-ngay/ban-hang-online). Muốn xem lại ba việc gốc, hoặc cần số tổng đài khi kẹt bước nào, quay lại [trang tổng quan Dùng ngay](/docs/dung-ngay).
