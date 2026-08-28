# BRIEF viết bài blog monapay.vn (content money) — 9 bài, 3 fork

## Luật bắt buộc (đọc trước khi viết)
1. Đọc `~/Desktop/mona-media-factory/TIEU-CHUAN-CONTENT-MONEY.md` các mục 1 (chuỗi heading), 2 (POV), 3 (stances), 4 (ngôn ngữ), 4b (nhịp văn + mật độ sự thật), 4c (sổ nguyên liệu → đi vào từng H2), 6 (link/anti-fabrication), 7 (trích dẫn), 8 (CTA), 9 (QC). Mục 5 (hình) BỎ QUA đợt này (bài text-first, hình bổ sung sau).
2. Nguyên liệu CHỈ lấy từ `handoff/blog/NGUYEN-LIEU.md` + `BRIEF-CONTENT.md` mục 1. Không có nguyên liệu cho ý nào thì bỏ ý đó, KHÔNG bịa số/tên khách/case.
3. **Bài money = viết như chính MONA viết**: dựng khung từ trải nghiệm MONA (ca thu tiền hosting/học phí/phần mềm, lỗi tụi em từng vấp), dấu vết góc nhìn MONA rải ở thân TỪNG H2 ("tụi em", "ở MONA", "khách MONA hay gặp"), CẤM guide trung tính "X là gì → ưu nhược → chi phí". Mở bài vào thẳng từ trải nghiệm hoặc câu trả lời (answer-first 40–60 từ có keyword).
4. Voice: anh chị / tụi em / MONA; không "bạn", không "ạ", "Vâng", không mở câu "Dạ"; tiếng Việt, không title case; không em-dash tách vế; quét `~/.claude/skills/mon-taste-qc/catalog/banned-ai-tells.md` (substring + regex). Câu so le có nhịp: xen câu ngắn 5–8 chữ với câu dài, mỗi H2 ≥1 con số hoặc chi tiết cụ thể (mật độ sự thật).
5. SEO: title 55–65 ký tự mở bằng keyword chính; H1 chứa keyword (có thể khác title); meta 150–160; keyword trong đoạn mở + ≥2 H2; H2 là câu hỏi/nhu cầu thật; 1.500–3.000 từ; ≥4 link nội bộ đúng đường dẫn (mục D) + 1–2 link hệ sinh thái; FAQ cuối bài 4–6 câu dạng `## Câu hỏi thường gặp` với `### câu hỏi` (layout tự sinh, không cần schema tay).
6. CTA: 2 CTA theo giọng MONA (giữa bài sau đoạn insight: mềm, mời thử miễn phí; cuối bài: cụ thể "tạo tài khoản tại my.monapay.vn/auth?mode=register, nối ACB 4 bước, gọi 1900 636 648 nếu kẹt"). Không hỏi "còn thắc mắc gì không". Nêu rõ **miễn phí hoàn toàn, không giới hạn giao dịch**.
7. ⛔️ KHÔNG nhắc SePay/Casso/PayOS. So sánh chỉ với PayPal/Stripe (số ở mục C) và ví/cổng VN (MoMo/ZaloPay/ShopeePay/VNPAY-QR) theo đúng giới hạn mục C (không % cụ thể).
8. Frontmatter file `src/content/posts/<slug>.md`:
```
---
title: "…"
description: "…"
date: 29/08/2026
keyword: "…"
category: huong-dan | so-sanh | chuyen-mona | kien-thuc
h1: "…"   # nếu khác title
---
```
Body markdown thuần, bắt đầu bằng đoạn answer-first (không lặp H1). Bảng dùng markdown table.

## Gate tự soát (fail = viết lại, không nộp)
- `cd ~/MONApay/site && npm run build` xanh → `python3 ~/Desktop/mona-media-factory/_os/qc_goc_nhin_mona.py dist/blog/<slug>.html` PASS (ngưỡng mặc định) và `python3 ~/Desktop/mona-media-factory/_os/qc_nhip_van.py dist/blog/<slug>.html` PASS; `python3 scripts/qc.py dist` 0 FAIL.
- grep banned-ai-tells + voice trên file .md = 0.
- Mỗi H2 có dấu vết MONA + ≥1 số/chi tiết cụ thể; không câu hedge "tuỳ gói/có thể thay đổi theo thời điểm".

## Phân công (slug → keyword chính → góc bài)
**Fork K (huong-dan):**
- `xac-nhan-thanh-toan-tu-dong` — kw "xác nhận thanh toán tự động" (+ "tự động xác nhận chuyển khoản", "thanh toán tự động") — hướng dẫn từ chuyện MONA từng canh app ngân hàng → cơ chế VA/VietQR/webhook → làm trong 4 bước → lỗi hay gặp (OTP lần 2) → miễn phí.
- `tu-dong-bao-co-tien-vao-tai-khoan` — kw "báo có tự động" (+ "biến động số dư", "thông báo tiền vào tài khoản") — cho chủ DN/kế toán: báo có qua Telegram nhóm, theo từng VA, mẫu tin, phân quyền không đưa app bank cho nhân viên.
- `gan-cong-thanh-toan-vao-website` — kw "tích hợp cổng thanh toán vào website" (+ "gắn cổng thanh toán", "tích hợp cổng thanh toán") — 3 đường: ví/cổng thu % + ký hợp đồng, cổng quốc tế (PayPal/Stripe số mục C), chuyển khoản VietQR tự xác nhận (miễn phí); WooCommerce/WordPress cụ thể; link docs.
**Fork L (kien-thuc + so-sanh):**
- `nhan-tien-viet-va-ngoai-te-usd` — kw "nhận thanh toán từ nước ngoài" (+ "thu tiền usd", "thanh toán ngoại tệ") — bán trong nước VND: chuyển khoản/VietQR miễn phí; bán ra nước ngoài: PayPal (4,40% + cố định, rút 60.000đ), Stripe chưa mở VN; cách MONA khuyên chạy song song 2 đường; lưu ý pháp lý chỉ nêu "hỏi kế toán/ngân hàng", không tư vấn.
- `cong-thanh-toan-mien-phi` — kw "cổng thanh toán miễn phí" — miễn phí thật nghĩa là gì (không % , không phí rút, không phí mở), vì sao MONA Pay miễn phí (mục A5), giới hạn fair-use, so với "miễn phí" kiểu ví (miễn phí mở nhưng thu % giao dịch, theo mục C).
- `momo-zalopay-shopeepay-vnpay-cho-website` — kw "cổng thanh toán cho website bán hàng" (+ momo/zalopay/shopeepay/vnpay cho website) — so sánh công bằng theo giới hạn mục C: khách phải có ví, thu % theo hợp đồng, tiền về ví/đối soát rồi mới về bank, phù hợp bán lẻ tại quầy/app; chuyển khoản VietQR + MONA Pay: khách nào cũng có app bank, tiền vào thẳng tài khoản, miễn phí; kết luận dùng song song.
**Fork M (chuyen-mona):**
- `mona-pay-mo-public-sau-4-nam` — kw "MONA Pay" (brand) — bài kể chuyện: hơn 4 năm chỉ khách MONA dùng, thu hosting/học phí/phần mềm, vì sao 2026 mở (A2), mở thì khác gì (miễn phí, tự đăng ký dùng ngay, tài liệu cho AI agent), ngày 28/08 test 50.000đ + hố OTP lần 2.
- `vi-sao-mona-pay-mien-phi` — kw "MONA Pay miễn phí" — lập luận A5 + stances A6, đối chiếu cổng quốc tế/ví thu %, cam kết không thu % trên tiền, fair-use.
- `tu-xay-cong-thanh-toan-de-thu-tien-hosting` — kw "tự động xác nhận thanh toán hosting" (long-tail, GEO) — chuyện tụi em tự xây để thu phí hosting Mona.Host và học phí KHA (A1, A4), cái gì học được (VA riêng từng đơn, webhook ký HMAC, gửi lại), rồi nhúng vào web khách.

## ĐỢT 5 — 5 bài glossary ăn volume (Fork P) — category `kien-thuc`
Luật chung y như trên (đọc thêm TIEU-CHUAN-CONTENT-MONEY §10: bài "X là gì" LUÔN map được sang việc MONA làm → luôn có CTA, không viết từ điển khô). Mở bài = định nghĩa 40–60 từ trả lời thẳng (đoạn trích cho AI), rồi triển khai theo trải nghiệm MONA. Mỗi bài 1.500–2.200 chữ, FAQ 5 câu, ≥4 link nội bộ, 2 CTA.
- `webhook-la-gi` — kw `webhook là gì` (900), phụ `webhook` 2.0K, `tích hợp webhook` 350. Giải thích bằng ví dụ tiền vào ACB → MONA Pay POST về web; payload thật, HMAC, 200/201/202 trong 10 giây, gửi lại; khác polling; link `/docs/webhooks/tich-hop-webhook`.
- `vietqr-la-gi` — kw `vietqr là gì` (1.2K), phụ `tạo mã qr ngân hàng`. Chuẩn EMVCo, BIN 6 số (ACB 970416), Napas 247, tĩnh vs động, link tool `/tao-ma-qr-ngan-hang` + `/docs/api/qr-thanh-toan`.
- `api-ngan-hang-la-gi` — kw `api ngân hàng là gì`, phụ `api ngân hàng` 200, `api bank` 150, `kết nối api là gì` 150. Ngân hàng cấp API gì (VA, thông báo, QR), doanh nghiệp dùng để làm gì, ai cần, MONA Pay là lớp đứng giữa để không phải tự xin API từng bank; cần gì (pháp nhân/tài khoản), link `/acb`, `/docs`.
- `open-banking-la-gi` — kw `open banking là gì` (300), phụ `open banking` 700. Nghĩa, tình hình VN (chỉ nói "các ngân hàng đã mở API cho đối tác", không trích văn bản pháp luật/số liệu không có), lợi ích cho SME, ví dụ MONA Pay mở public 2026 nhờ bank thoáng hơn (A2), link `/gioi-thieu`.
- `tai-khoan-ngan-hang-ao-la-gi` — kw `tài khoản ngân hàng ảo` / `virtual account` (300), phụ `tài khoản ảo là gì`. VA là gì, khác tài khoản phụ, ACB cấp theo đầu số, mỗi đơn/khách 1 VA để khớp tiền, tiền về tài khoản chính, cách tạo qua dashboard/API, link `/docs/api/tai-khoan-ao-va`, `/acb`.
Gate như trên (qc_goc_nhin_mona + qc_nhip_van + scripts/qc.py + tells/voice). ⛔️ Không nhắc SePay/Casso/PayOS.
