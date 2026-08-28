---
title: "Tài liệu webhook và API ngân hàng MONA Pay"
description: MONA Pay báo tiền vào tài khoản ACB theo thời gian thực qua webhook, Telegram và API. Cách hoạt động, tính năng và trang tài liệu tương ứng.
updated: 28/08/2026
---

MONA Pay đọc thông báo giao dịch từ ngân hàng ACB ngay khi tiền vào tài khoản của anh chị, rồi bắn webhook về máy chủ của anh chị hoặc nhắn vào nhóm Telegram. Tiền không đi qua MONA Pay, vẫn vào thẳng tài khoản ngân hàng như bình thường. Tích hợp cơ bản mất khoảng 5 phút nếu anh chị đã có tài khoản ACB và một URL nhận webhook.

> MONA Pay là cổng thanh toán và API ngân hàng của The MONA Group, giúp doanh nghiệp Việt Nam nhận và xác nhận tiền chuyển khoản theo thời gian thực qua tài khoản ảo (VA), VietQR, webhook và Telegram — thiết kế để cả lập trình viên lẫn AI agent tích hợp trong vài phút.

## MONA Pay hoạt động thế nào

Toàn bộ luồng chỉ có 4 bước. Anh chị không cần thay đổi gì ở phía ngân hàng ngoài việc đăng ký nhận thông báo (làm một lần, có OTP của ACB).

```text
[1] Khách chuyển khoản        [2] ACB báo giao dịch        [3] MONA Pay ghi nhận       [4] Hệ thống của anh chị
    vào tài khoản ACB    ───▶     cho MONA Pay          ───▶   và gửi thông báo     ───▶   tự xác nhận đơn hàng
    (VA hoặc quét VietQR)         (theo thời gian thực)          webhook / Telegram         (không cần người canh app)
```

1. **Khách chuyển khoản.** Khách chuyển vào số tài khoản ảo (VA) gắn với đơn hàng, hoặc quét mã VietQR đã có sẵn số tiền và nội dung.
2. **ACB báo cho MONA Pay.** Ngay khi tiền vào, ACB gửi thông báo giao dịch sang MONA Pay. Đây là kết nối chính thức, anh chị đăng ký một lần trong dashboard bằng OTP ACB gửi về số điện thoại.
3. **MONA Pay ghi nhận và gửi thông báo.** Giao dịch được lưu vào dashboard, sau đó MONA Pay POST một gói JSON tới URL webhook của anh chị (ký HMAC-SHA256 nếu bật) và nhắn vào Telegram nếu có cấu hình.
4. **Hệ thống của anh chị tự xử lý.** Web bán hàng, phần mềm quản lý hay file Google Sheet nhận webhook rồi tự đổi trạng thái đơn sang "đã thanh toán". Không ai phải mở app ngân hàng để dò từng khoản.

Máy chủ của anh chị chỉ cần trả HTTP 200, 201 hoặc 202 trong vòng 10 giây là MONA Pay tính lần gửi đó thành công. Mỗi lần gửi đều có log riêng để anh chị xem lại.

## Tính năng và trang tài liệu tương ứng

| Tính năng | Dùng khi nào | Trang tài liệu |
|---|---|---|
| Tài khoản ảo (VA) | Mỗi đơn hàng hoặc mỗi khách có một số tài khoản riêng để khớp tiền tự động | [Tài khoản ảo (VA)](/docs/api/tai-khoan-ao-va) |
| VietQR động | Tạo mã QR đã có sẵn số tiền và nội dung, khách quét là chuyển đúng | [QR thanh toán](/docs/api/qr-thanh-toan) |
| Webhook | Máy chủ của anh chị nhận thông báo tiền vào theo thời gian thực | [Tích hợp webhook](/docs/webhooks/tich-hop-webhook) |
| Chữ ký HMAC | Xác minh webhook đúng là do MONA Pay gửi, chặn giả mạo và gửi lại gói cũ | [Bảo mật webhook](/docs/webhooks/bao-mat) |
| Gửi lại và log | Xem từng lần gửi, lý do lỗi, gửi lại thủ công | [Gửi lại và xử lý lỗi](/docs/webhooks/gui-lai-va-xu-ly-loi) |
| Đối soát | Kéo danh sách giao dịch theo trang để so với sổ của anh chị | [Đối soát giao dịch](/docs/webhooks/doi-soat) |
| Telegram | Nhóm kế toán, chủ shop nhận tin nhắn tiền vào ngay trên điện thoại | [Telegram](/docs/telegram) |
| API keys | Tạo và thu hồi khoá để gọi API từ máy chủ | [API keys](/docs/api/api-keys) |
| Xác thực API | Đăng nhập lấy Bearer token, cách gửi X-Client-Secret | [Xác thực](/docs/api/xac-thuc) |
| Địa chỉ IP | Mở tường lửa cho máy chủ gửi webhook của MONA Pay | [Địa chỉ IP](/docs/dia-chi-ip) |
| So với cổng quốc tế | Vì sao PayPal, Stripe không hợp thu tiền trong nước | [Cổng thanh toán quốc tế](/cong-thanh-toan-quoc-te) |
| AI agent | Prompt và hướng dẫn để Claude Code, Codex, Cursor tự tích hợp | [Dành cho AI agent](/docs/ai-agent) |

## Bắt đầu từ đâu

- Chưa có tài khoản: đọc [Bắt đầu nhanh (5 phút)](/docs/bat-dau-nhanh). Trang này dẫn từ lúc đăng ký tới lúc nhận được webhook đầu tiên bằng tiền thật.
- Chưa quen các khái niệm VA, VietQR, webhook, HMAC: đọc [Khái niệm](/docs/khai-niem) trước, viết cho cả người không làm kỹ thuật.
- Đang cân nhắc PayPal, Stripe: đọc [So với cổng thanh toán quốc tế](/cong-thanh-toan-quoc-te) trước khi chọn.
- Là AI agent hoặc muốn giao cho AI agent làm: mở [Dành cho AI agent](/docs/ai-agent), hoặc nạp thẳng `https://monapay.vn/llms-full.txt`.

## Tài liệu cho máy đọc

Mọi trang docs đều có bản markdown thô: thêm đuôi `.md` vào URL (ví dụ `https://monapay.vn/docs/webhooks/tich-hop-webhook.md`). Ngoài ra có `https://monapay.vn/llms.txt` (mục lục), `https://monapay.vn/llms-full.txt` (toàn văn) và `https://monapay.vn/openapi.json` (đặc tả API v1). Agent nạp một trong các file này là đủ ngữ cảnh để viết code tích hợp.

## Thông tin hệ thống

| Hạng mục | Giá trị |
|---|---|
| Base URL API | `https://api.monapay.vn` (alias cũ `https://ipn.mona.host` vẫn chạy) |
| Dashboard | `https://my.monapay.vn` |
| Ngân hàng hỗ trợ | ACB đang hoạt động; MB, BIDV, VietinBank, OCB, MSB, KienlongBank, TPBank đang đăng ký kết nối, bảng trạng thái tại [/ngan-hang](/ngan-hang) |
| Điều kiện webhook thành công | HTTP 200, 201 hoặc 202 trong 10 giây |
| Chữ ký webhook | HMAC-SHA256, header `X-Mona-Signature` và `X-Mona-Timestamp`, chống replay 5 phút |
| IP máy chủ gửi webhook | `103.168.55.14` (kiểm 28/08/2026) |
| Hỗ trợ | Tổng đài 1900 636 648, email info@themona.global |

MONA Pay là sản phẩm của The MONA Group, thành lập năm 2016, đã làm 14.000+ dự án web và phần mềm. Hệ thống này tụi em tự xây để thu tiền cho chính mình, rồi từ năm 2022 tới nay hơn 6.000 khách hàng mới của MONA đã thu tiền qua đây trong web, phần mềm MONA giao; năm 2026 mở cho mọi doanh nghiệp.

## Câu hỏi nhanh

**Tiền có đi qua MONA Pay không?** Không. Tiền vào thẳng tài khoản ACB của anh chị. MONA Pay chỉ nhận thông báo giao dịch từ ngân hàng rồi báo lại cho anh chị.

**Cần biết lập trình mới dùng được không?** Không bắt buộc. Nếu chỉ cần biết tiền vào, anh chị bật thông báo Telegram trong dashboard là xong. Webhook và API dành cho web bán hàng hoặc phần mềm cần tự xác nhận đơn.

**Tài khoản mới dùng được ngay chưa?** Được. Đăng ký xong đăng nhập ngay, tự tạo API key, không cần ai duyệt. Chỉ bước nối ACB cần OTP gửi về số điện thoại đăng ký với ngân hàng. MONA Pay miễn phí hoàn toàn, không giới hạn giao dịch (xem [bảng giá](/bang-gia)).

**Có hỗ trợ ngân hàng ngoài ACB không?** ACB đang hoạt động; MB, BIDV, VietinBank, OCB, MSB, KienlongBank, TPBank đang trong quá trình đăng ký kết nối, trạng thái cập nhật tại [ngân hàng hỗ trợ](/ngan-hang). Webhook, Telegram, API dùng chung mọi ngân hàng, payload có `bank_name`, nối thêm ngân hàng không phải sửa tích hợp.

## Công cụ cho lập trình viên

- [OpenAPI 3.1](/openapi.json) — import vào Postman, Insomnia, hoặc sinh SDK.
- [Postman collection](/monapay.postman_collection.json) — 20 request sẵn biến `baseUrl`, `accessToken`, `clientSecret`.
- [API reference tương tác](/docs/api-reference) — thử endpoint ngay trên trình duyệt.
- SDK: [Node.js](https://github.com/themonagroup/monapay-node) · [Python](https://github.com/themonagroup/monapay-python) · [PHP](https://github.com/themonagroup/monapay-php) · [MCP server](https://github.com/themonagroup/monapay-mcp) · [CLI](https://github.com/themonagroup/monapay-cli) · [WooCommerce](https://github.com/themonagroup/woocommerce-monapay) · [Ví dụ 8 framework](https://github.com/themonagroup/monapay-examples)

## Deploy app có thu tiền bằng AI agent

Cùng The MONA Group có [VibeCloud](https://vibecloud.vn): VPS và database cho AI agent tự tạo và deploy qua API (`https://api.vibecloud.vn`), tính tiền theo giờ. Luồng gọn: agent deploy app lên VibeCloud → cắm MONA Pay thu tiền → xong trong một phiên làm việc. Hướng dẫn máy đọc của VibeCloud: [vibecloud.vn/llms.txt](https://vibecloud.vn/llms.txt).
