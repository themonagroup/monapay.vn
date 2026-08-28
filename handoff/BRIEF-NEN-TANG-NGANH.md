# BRIEF đợt 4 — trang theo NỀN TẢNG + theo NGÀNH (ngang độ phủ SePay, nhưng chỉ nói thật)

Khung/voice/GEO: `~/MONApay/site/BRIEF-CONTENT.md` mục 0 + 2 (answer-first 40–60 từ, entity `SITE.entity` ≥1, ≥3 câu số, anh chị/tụi em, không ạ/Vâng/Dạ/bạn (kể cả nghĩa "bạn kế toán" → "nhân viên kế toán"), banned-ai-tells, title 55–65 mở bằng keyword, meta 150–160, H1 ≤2 hàng desktop có `<br class="br-d">` + style scoped, `<Faq>` ≥5, `<CtaBand>`, `PRICE_LINE` từ `../data/pricing`, không ảnh giả, không logo hãng khác (không có file gốc), ⛔️ không nhắc SePay/Casso/PayOS). Sự thật kỹ thuật: `handoff/blog/NGUYEN-LIEU.md` mục B.

## Sự thật về cách nối nền tảng (viết đúng vậy, không hứa "plugin 1 click")
- MONA Pay bắn **webhook** (JSON, ký HMAC) khi tiền vào tài khoản ảo/VietQR. Muốn đơn trên nền tảng tự đổi trạng thái thì cần **một lớp nối**: nhận webhook → gọi API của nền tảng để đánh dấu đơn đã thanh toán. Lớp nối này: (a) **đội MONA viết cho khách** (MONA làm phần mềm theo yêu cầu, 14.000+ dự án, thường vài ngày), hoặc (b) dev của anh chị tự viết theo docs (`/docs/webhooks/tich-hop-webhook`, `/docs/api/qr-thanh-toan`). ⛔️ KHÔNG khẳng định chi tiết API của Shopify/Haravan/Sapo/KiotViet (tên endpoint, gói nào mở API) — chỉ nói "nền tảng có API quản lý đơn hàng cho tài khoản/gói hỗ trợ API; kiểm với nền tảng của anh chị".
- Cách đơn giản nhất **không cần code**: tạo **VietQR động theo đơn** trong dashboard MONA Pay (hoặc API), gắn ảnh QR vào trang cảm ơn/tin nhắn chốt đơn; tiền vào → Telegram nhóm báo ngay; nhân viên đổi trạng thái đơn tay nhưng **không phải canh app ngân hàng**. Viết rõ đây là "đường tạm, đủ dùng cho shop nhỏ".
- Tất cả: tiền vào thẳng tài khoản ACB của anh chị, miễn phí hoàn toàn.

## Sự thật về phần mềm MONA theo ngành (link mona.software, không bịa tính năng chi tiết)
- Giáo dục: **MONA EduCenter** (trung tâm), **MONA LMS / Elearning / SkillHub** (khoá học online), **UniMaster** (trường/đại học) — thu học phí, phí đăng ký khoá; ca thật: Khánh Hùng Academy thu học phí qua hệ thống này (40.000 học viên, 760 học viên PRO).
- F&B: **Nhahang AI** (nhà hàng/quán) — thanh toán tại bàn, đơn mang đi.
- Spa/salon/nail: phần mềm quản lý spa/salon/nail của Mona.Software — đặt cọc lịch, thanh toán dịch vụ.
- Nhập hàng Trung Quốc: phần mềm quản lý nhập hàng TQ của Mona.Software — khách nạp tiền/đặt cọc đơn, đối soát khối lượng lớn; query thật "dịch vụ thanh toán hộ nhập hàng trung quốc".
- Cho thuê trọ/toà nhà: thu tiền phòng, điện nước, cọc định kỳ (mona.house là site của MONA về mảng này) — VA cố định theo phòng/khách.
- Hosting/SaaS/phần mềm thuê bao: chính Mona.Host thu phí hosting/VPS/domain qua MONA Pay (ca tự dùng hơn 4 năm), gia hạn tự kích hoạt khi tiền vào.
- Tiệm vàng: **JMS**. Thương mại điện tử: **MONA eCommerce**.
⛔️ Không bịa giá phần mềm, số khách, tên khách. Chỉ nói "liên hệ 1900 636 648" cho phần mềm.

## Keyword (Google Suggest 28/08 + Ahrefs 27/08)
- Shopify: "cổng thanh toán shopify việt nam", "cổng thanh toán shopify", "thuê/tạo/đăng ký cổng thanh toán shopify", "các cổng thanh toán shopify".
- Haravan: "haravan cổng thanh toán". Sapo/KiotViet/Ladipage: volume rất thấp → viết ngắn hơn (~900–1.200 chữ), trọng tâm là cách nối + VietQR động.
- Giáo dục: "phần mềm quản lý học phí" (Suggest mạnh), "thu học phí tự động", "quản lý học phí học sinh/học viên".
- Nhập hàng TQ: "dịch vụ thanh toán hộ nhập hàng trung quốc" (Suggest). F&B/spa/trọ/hosting: long-tail, viết cho GEO ("tự động xác nhận thanh toán cho nhà hàng/spa/phòng trọ/hosting").

## Phân công
**Fork N — nền tảng** (`src/pages/`): `cong-thanh-toan-shopify.astro` (đầy đủ ~1.800 chữ), `cong-thanh-toan-haravan.astro` (~1.400), `cong-thanh-toan-sapo.astro` (~1.100), `cong-thanh-toan-kiotviet.astro` (~1.100). Mỗi trang: answer-first; đau của shop trên nền tảng đó (khách chuyển khoản → chờ xác nhận); 2 đường nối (lớp nối do MONA/dev viết · VietQR động + Telegram không cần code) dạng `<Steps>`; bảng "cổng thu % / cổng quốc tế / chuyển khoản VietQR + MONA Pay" (số PayPal/Stripe theo NGUYEN-LIEU mục C); "MONA làm gì cho anh chị"; FAQ ≥5; CtaBand. JSON-LD Article/WebPage + FAQPage (Faq tự sinh).
**Fork O — ngành** (`src/pages/nganh/`): `giao-duc.astro` (đầy đủ ~1.800), `nha-hang-fnb.astro`, `spa-salon.astro`, `nhap-hang-trung-quoc.astro`, `cho-thue-tro.astro`, `hosting-saas.astro` (~1.100–1.400 mỗi trang). Mỗi trang: answer-first; 3–4 đau thật của ngành khi thu tiền chuyển khoản; cách MONA Pay giải (VA theo học viên/phòng/đơn, VietQR động, Telegram nhóm, webhook vào phần mềm); "phần mềm MONA cho ngành này" (đúng tên sản phẩm ở trên + link https://mona.software, không bịa tính năng); ca thật nếu có (KHA, Mona.Host) — không bịa ca khác; FAQ ≥5; CtaBand. Đường dẫn trang là `/nganh/<slug>`.
Cả hai: thêm dòng vào `src/data/pages.ts` cho trang mình tạo (chỉ thêm dòng). KHÔNG sửa nav (parent làm). Gate: `npm run build` xanh, `python3 scripts/qc.py dist` 0 FAIL cho trang mình, Playwright/iframe đo H1 ≤2 hàng desktop + không tràn ngang mobile nếu có thể (browser MCP có thể bận → bỏ qua, parent đo). Báo cáo ngắn.
