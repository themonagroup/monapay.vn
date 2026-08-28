# KEYWORD MAP — monapay.vn (nguồn số: Ahrefs VN + GSC pull 27/08/2026, file `~/MONApay/handoff/ref/thanh-toan-monapay-kw-20260827.json`)

Luật: **title + H1 + đoạn mở đều mở bằng keyword chính**; keyword phụ rải H2/FAQ. Intent lõi "tự động xác nhận chuyển khoản" = 0–10 vol (keyword ma) → phục vụ qua GEO/AI, KHÔNG làm keyword head.

| Trang | Keyword chính (vol · KD) | Keyword phụ | Title (55–65) |
|---|---|---|---|
| `/` | `cổng thanh toán` 300 · KD1 | `api ngân hàng` 200 · KD0, `tích hợp cổng thanh toán` 20 | Cổng thanh toán và API ngân hàng nhận tiền tự động \| MONA Pay |
| `/acb` | `api acb` ~90 (cụm `api [bank]`) | `biến động số dư` 200, `tài khoản ngân hàng ảo` 300 | API ACB: biến động số dư, tài khoản ảo ACB theo thời gian thực |
| `/cong-thanh-toan-woocommerce` | `cổng thanh toán woocommerce` (biến thể cụm G) | `tích hợp cổng thanh toán` 20, `tích hợp thanh toán vào website` 50 | Cổng thanh toán WooCommerce chuyển khoản, tự xác nhận đơn |
| `/cong-thanh-toan-wordpress` | `tích hợp cổng thanh toán vào website` 50 | `plugin thanh toán wordpress` 20 | Tích hợp cổng thanh toán vào website WordPress (chuyển khoản ACB) |
| `/chia-se-bien-dong-so-du-telegram` | `biến động số dư` 200 | `thông báo biến động số dư`, `loa thông báo` 600 (đối chiếu) | Biến động số dư ngân hàng báo qua Telegram, tiền vào ACB thấy ngay |
| `/ai-agent` | `api ngân hàng` 200 · KD0 | `webhook` 2.0K · KD0 | API ngân hàng cho AI agent: webhook thanh toán tích hợp 5 phút |
| `/faq` | `cổng thanh toán là gì` 60 | `api ngân hàng là gì`, `paypal có dùng được ở việt nam không` | Cổng thanh toán MONA Pay là gì? 20 câu hỏi thường gặp |
| `/bang-gia` | `cổng thanh toán` (biến thể giá) | `phí paypal việt nam` (cột so sánh quốc tế) | Bảng giá cổng thanh toán MONA Pay: miễn phí 100 giao dịch/tháng |
| `/khach-hang` | brand | `cổng thanh toán` | Khách hàng dùng cổng thanh toán MONA Pay vào việc gì |
| `/gioi-thieu`, `/lien-he` | brand | — | giữ |
| `/docs` | `webhook` 2.0K · KD0 | `api ngân hàng` | Tài liệu webhook và API ngân hàng MONA Pay |
| `/docs/khai-niem` | `webhook là gì` 900 · `vietqr là gì` 1.2K | `tài khoản ngân hàng ảo` 300, `open banking` 700 | Webhook là gì, VietQR là gì, tài khoản ảo là gì (giải thích dễ hiểu) |
| `/docs/webhooks/tich-hop-webhook` | `tích hợp webhook` 350 | `webhook` | Tích hợp webhook thanh toán: nhận tiền vào ACB trong 5 phút |
| `/docs/api/tai-khoan-ao-va` | `tài khoản ngân hàng ảo` / `virtual account` 300 | `api acb` | Tài khoản ngân hàng ảo (virtual account) ACB: tạo VA qua API |
| `/docs/api/qr-thanh-toan` | `tạo mã qr ngân hàng` 2.0K (cụm tool) | `vietqr` | API tạo mã QR ngân hàng ACB (VietQR động) theo đơn hàng |
| `/docs/telegram` | `biến động số dư` 200 | — | Thông báo biến động số dư qua Telegram: cấu hình bot MONA Pay |
| `/docs/api/xac-thuc` | `api ngân hàng` | — | Xác thực API ngân hàng MONA Pay: Bearer token và X-Client-Secret |
| docs còn lại | giữ title kỹ thuật (đã keyword-led: webhook/đối soát/IP) | | |

Việc treo (Ahrefs credit): verify KD `sepay alternative`, `casso vs sepay`; content-gap mona.software vs sepay.vn cho cụm webhook. GSC: bài mona.media `huong-dan-cau-hinh-webhook-sepay` (pos 7.4) → chèn link `/chuyen-tu-sepay` (off-site, làm sau).

**⛔️ Lệnh Mon 28/08 khuya:** cụm `sepay` 7.5K / `sepay là gì` / `sepay alternative` / `casso vs sepay` **KHÔNG khai thác trên monapay.vn** (không nhắc tên đối thủ VN). Trang `/chuyen-tu-sepay` đã xoá. Thay bằng cụm so với cổng nước ngoài: `/cong-thanh-toan-quoc-te` (`cổng thanh toán quốc tế` 200), `/paypal-viet-nam`, `/stripe-viet-nam` (Fork I).

## Bổ sung 28/08 khuya (đợt 2–4 của loop)
| Trang | Keyword chính | Nguồn |
|---|---|---|
| `/cong-thanh-toan-quoc-te` | `cổng thanh toán quốc tế` 200 | Ahrefs + Suggest ("…tại việt nam", "…paypal", "…stripe") |
| `/paypal-viet-nam` | `paypal việt nam`, `paypal có dùng được ở việt nam không`, `phí paypal là bao nhiêu`, `rút tiền paypal về ngân hàng việt nam` | Suggest (chờ Ahrefs volume) |
| `/stripe-viet-nam` | `stripe việt nam`, `stripe có hỗ trợ việt nam không` | Suggest |
| `/tao-ma-qr-ngan-hang` | `tạo mã qr ngân hàng` 2.0K (cụm tool), `tạo mã qr [bank]` 60–350 → `?bank=<BIN>` | Ahrefs 27/08 |
| `/cong-thanh-toan-shopify` | `cổng thanh toán shopify việt nam` | Suggest |
| `/cong-thanh-toan-haravan` `/sapo` `/kiotviet` | `haravan cổng thanh toán` (Sapo/KiotViet volume rất thấp, viết cho GEO) | Suggest |
| `/nganh/giao-duc` | `phần mềm quản lý học phí`, `thu học phí tự động` | Suggest |
| `/nganh/nhap-hang-trung-quoc` | `dịch vụ thanh toán hộ nhập hàng trung quốc` | Suggest |
| `/nganh/*` còn lại | long-tail GEO "tự động xác nhận thanh toán cho <ngành>" | — |
| `/blog/*` 9 bài | xem frontmatter `keyword` từng bài (xác nhận thanh toán tự động · báo có tự động · tích hợp cổng thanh toán vào website 50 · nhận thanh toán từ nước ngoài · cổng thanh toán miễn phí · cổng thanh toán cho website bán hàng · MONA Pay brand) | Ahrefs + Suggest |
⛔️ Cụm `sepay` 7.5K: KHÔNG khai thác trên site (lệnh Mon 28/08). Việc treo Ahrefs: cần phiên có MCP Chrome để lấy volume/KD các từ Suggest.
