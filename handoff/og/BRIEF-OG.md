# BRIEF — Ảnh OG (Open Graph) cho website monapay.vn

## Đề bài
Render 2 phương án ảnh nền OG cho MONA Pay (cổng thanh toán + API ngân hàng của The MONA Group: khách chuyển khoản → ngân hàng ACB báo → webhook/Telegram xác nhận tự động; tiền KHÔNG qua trung gian). Ảnh dùng làm og:image khi chia sẻ link lên Facebook/Zalo/Telegram, nên phải đọc được ở size nhỏ, sạch, "fintech tin cậy".

## Spec cứng
- Tool: `image_gen`. Size **1536x1024** (landscape), sẽ crop về 1200x630 ở giữa → đừng đặt chi tiết quan trọng sát mép trên/dưới (chừa 15% trên + 15% dưới).
- Palette brand: nền trắng ngà ánh hồng nhạt `#FFF7F9`; khối chính đỏ crimson `#971B38`; điểm nhấn xanh teal `#00685F`; mực tối `#261118`. KHÔNG tím, KHÔNG gradient cầu vồng, KHÔNG neon.
- Bố cục: **1/3 bên TRÁI để TRỐNG hoàn toàn (nền phẳng)** để dán logo file gốc sau. 2/3 bên phải: 1 điện thoại nghiêng đang hiện mã QR (ô vuông đen-trắng chung chung, KHÔNG cần đúng chuẩn VietQR), phía trên có bong bóng thông báo teal với dấu tick (ý: tiền đã vào tài khoản theo thời gian thực), vài đường mảnh nối tới icon máy chủ nhỏ và icon máy bay giấy (Telegram). Có thể thêm thẻ ngân hàng/đồng xu crimson làm props, nhẹ thôi.
- Chất render: 3D-lite mềm, bóng đổ nhẹ, sạch kiểu app ngân hàng số. Không nhân vật, không gấu.
- ⛔️ TUYỆT ĐỐI KHÔNG CHỮ, KHÔNG SỐ, KHÔNG LOGO, KHÔNG WATERMARK trong ảnh (kể cả trên màn hình điện thoại) — logo sẽ được dán sau từ file gốc `ref-logo-monapay.png` (chỉ để tham khảo tông màu, KHÔNG vẽ lại nó).
- Phương án 2: cùng brief nhưng nền tối crimson đậm `#1B0C11`→`#2B141C`, props sáng, vẫn chừa trống 1/3 trái.

## Output
- `out/og-light.png` (phương án 1, nền sáng) và `out/og-dark.png` (phương án 2, nền tối). PNG, đúng 1536x1024.

## Checklist tự soát trước khi nộp (sai là regen, không nộp bản lỗi)
- [ ] Không có bất kỳ ký tự chữ/số nào trong ảnh.
- [ ] 1/3 trái trống, nền phẳng đủ để đặt logo ngang 420px.
- [ ] Màu đúng palette (crimson + teal + nền hồng nhạt), không tím.
- [ ] Không vật thể quan trọng trong 15% mép trên/dưới.
