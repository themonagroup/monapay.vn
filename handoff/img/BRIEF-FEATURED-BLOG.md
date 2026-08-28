# BRIEF — Featured image (thumbnail bán click) cho 9 bài blog monapay.vn

## Luật (từ PLAYBOOK-ANH-CONTENT-MONEY của MONA, áp cho monapay.vn với palette MONA Pay)
- Tool `image_gen`, **landscape 1536x1024**, 1 ảnh/bài, lưu `out/<slug>.png`.
- **Xem 3 reference trước khi render** (view_image): `ref/MAU-featured-clickbait.png` (bố cục mẫu Mon duyệt: tít 2 dòng IN HOA trên tấm nền tối bo góc bên trái, gấu biểu cảm mạnh góc trái dưới, nửa phải minh hoạ đúng ý), `ref/gau-bang-tay-ai-agent-mona.png` (thần thái Gấu Cười 3D dễ thương + BĂNG TAY quấn bắp tay in chữ `AI Agent MONA`), `ref/gau-present-chi-bang.png` (đồng phục polo trắng / hoodie kem).
- **Gấu**: 3D dễ thương đúng thần thái reference (KHÔNG creepy, KHÔNG panda thật), mặc polo trắng hoặc hoodie kem trơn (KHÔNG tự chế logo trên ngực; che ngực bằng tay/đạo cụ nếu cần), **bắt buộc băng tay quấn bắp tay trên in chữ trắng `AI Agent MONA` đúng chính tả** (gradient xanh #2f4fe0 → tím #7c3aed → coral #ff7a59 trên băng). Biểu cảm MẠNH theo từng bài.
- **Chữ**: để model viết thẳng tiếng Việt CÓ DẤU, IN HOA, đúng nguyên văn bên dưới, 2 dòng: dòng 1 = keyword (trắng), dòng 2 = hook (màu chốt). Sai dấu/sai chữ/thiếu chữ → REGEN, không nộp.
- **Palette MONA Pay** (khác mona.media): nền tối crimson-đen `#1B0C11 → #3A1020` có vệt sáng lạnh, ánh sáng trắng mát; chữ hook màu **teal `#36BFB2`** cho bài "thơm/hướng dẫn", **coral `#FF786A`** cho bài "đau". Điểm nhấn teal/crimson. ⛔️ KHÔNG ám vàng, KHÔNG tím indigo chủ đạo, KHÔNG logo hãng khác (MoMo/PayPal/ngân hàng), KHÔNG người thật, KHÔNG watermark, KHÔNG cliché bóng đèn/bắt tay/địa cầu/bánh răng.
- Nửa phải = cảnh CÓ Ý đúng bài (gấu/đồ vật đang LÀM việc bài nói), không mockup rỗng.
- Checklist tự soát từng ảnh: đúng 2 dòng chữ, đủ dấu; băng tay đọc được `AI Agent MONA`; gấu đúng thần thái; 1536x1024; không ám vàng; không logo lạ. Ghi `out/STATUS.txt` mỗi dòng `<slug> OK|REGEN <ghi chú>`.

## 9 bài (slug → dòng 1 / dòng 2 (màu) → biểu cảm gấu → cảnh nửa phải)
1. `xac-nhan-thanh-toan-tu-dong` → "XÁC NHẬN THANH TOÁN TỰ ĐỘNG" / "HẾT CANH APP NGÂN HÀNG" (teal) → gấu thở phào, thumbs up → điện thoại hiện thông báo tiền vào, mũi tên sang màn hình đơn hàng chuyển trạng thái xanh "đã thanh toán" (chữ trên màn có thể là ký hiệu tick, không cần chữ).
2. `tu-dong-bao-co-tien-vao-tai-khoan` → "BÁO CÓ TỰ ĐỘNG" / "CẢ NHÓM THẤY TIỀN VÀO" (teal) → gấu chỉ tay hào hứng → màn hình chat nhóm kiểu Telegram (không logo) với bong bóng thông báo tiền vào, vài gấu đồng nghiệp nhìn màn.
3. `gan-cong-thanh-toan-vao-website` → "GẮN CỔNG THANH TOÁN VÀO WEB" / "CÁCH NÀO MIỄN PHÍ?" (teal) → gấu suy nghĩ, tay chống cằm → 3 cánh cửa/ngả rẽ trước một website, một ngả sáng teal có mã QR.
4. `nhan-tien-viet-va-ngoai-te-usd` → "THU TIỀN VIỆT HAY TIỀN ĐÔ?" / "CHỌN SAI MẤT PHÍ MỖI ĐƠN" (coral) → gấu lo lắng nhìn hoá đơn → hai làn: đồng VND chảy thẳng vào ngân hàng vs đồng USD đi qua nhiều trạm thu phí.
5. `cong-thanh-toan-mien-phi` → "CỔNG THANH TOÁN MIỄN PHÍ" / "KHÔNG THU MỘT ĐỒNG" (teal) → gấu cười tươi giơ bảng giá 0 → đồng xu "0" teal to, tiền vào thẳng két/ngân hàng.
6. `momo-zalopay-shopeepay-vnpay-cho-website` → "VÍ ĐIỆN TỬ HAY VIETQR?" / "WEB BÁN HÀNG NÊN GẮN GÌ" (teal) → gấu cân 2 tay như cái cân → bên trái vài ví điện tử generic (icon ví, không logo), bên phải mã QR + app ngân hàng, cân nghiêng nhẹ về QR.
7. `mona-pay-mo-public-sau-4-nam` → "MONA PAY MỞ CHO MỌI NGƯỜI" / "SAU 4 NĂM CHỈ KHÁCH MONA DÙNG" (teal) → gấu mở toang cánh cửa, vẫy tay → sau cửa là dãy cửa hàng/quán/trung tâm sáng đèn, dòng khách đi vào.
8. `vi-sao-mona-pay-mien-phi` → "VÌ SAO MIỄN PHÍ HOÀN TOÀN?" / "TIỀN KHÔNG QUA TRUNG GIAN" (teal) → gấu giải thích, tay chỉ sơ đồ → mũi tên tiền từ khách bay thẳng vào toà nhà ngân hàng, không có trạm trung gian nào (trạm bị gạch chéo).
9. `tu-xay-cong-thanh-toan-de-thu-tien-hosting` → "TỰ XÂY CỔNG THANH TOÁN" / "ĐỂ THU TIỀN HOSTING 4 NĂM" (teal) → gấu kỹ sư đội mũ, cầm laptop → tủ server sáng đèn teal, dòng thông báo tiền vào chạy trên màn.
