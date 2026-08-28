// Nhật ký thay đổi công khai — nơi ở duy nhất; trang /changelog đọc từ đây. Chỉ ghi việc ĐÃ lên thật (kiểm ROADMAP + NGUYEN-LIEU), không hứa ngày.
export type Change = { date: string; version?: string; title: string; items: string[]; tag?: 'san-pham' | 'tai-lieu' | 'ma-nguon' | 'ha-tang' };
export const CHANGELOG: Change[] = [
  { date: '29/08/2026', version: 'v0.1.0', tag: 'ma-nguon', title: 'Mở mã nguồn SDK, MCP server, CLI, plugin WooCommerce', items: [
    'GitHub org The MONA Group (github.com/themonagroup): SDK Node.js (@monapay/node), Python (monapay), PHP (monapay/php-sdk), MCP server monapay-mcp cho Claude Code, Cursor, Codex, CLI monapay (login, tạo QR, tra giao dịch, webhook listen), plugin WooCommerce, 8 ví dụ framework (Next.js, Express, NestJS, Laravel, Django, FastAPI, Spring Boot, Go). Tất cả MIT, phát hành v0.1.0; bản trên npm, PyPI, Packagist, wordpress.org lên sau.',
    'API reference tương tác tại /docs/api-reference (sinh từ openapi.json, thử endpoint ngay trên trình duyệt) và Postman collection 20 request.',
    'Trạng thái hệ thống công khai tại /status, kiểm 5 phút một lần website, dashboard, API; dữ liệu máy đọc /status.json.',
  ]},
  { date: '29/08/2026', tag: 'tai-lieu', title: 'Tài liệu tiếng Anh và bảng ngân hàng hỗ trợ', items: [
    '17 trang tài liệu bản tiếng Anh tại /en/docs, trang /en và /en/ai-agent, hreflang hai chiều, mỗi trang có bản .md cho máy đọc; llms.txt thêm mục English docs.',
    'Trang /ngan-hang: bảng trạng thái kết nối từng ngân hàng (đang hoạt động, đang đăng ký kết nối, trong kế hoạch); thêm ngân hàng không phải sửa tích hợp vì webhook, Telegram, API dùng chung.',
    'Blog 14 bài hướng dẫn và kiến thức (xác nhận thanh toán tự động, báo có, gắn cổng thanh toán, VietQR, webhook, API ngân hàng, open banking, tài khoản ảo), mỗi bài có bản .md.',
  ]},
  { date: '28/08/2026', tag: 'san-pham', title: 'Website monapay.vn và dashboard my.monapay.vn', items: [
    'Website chính thức: trang sản phẩm, tài liệu tích hợp 18 trang, llms.txt, llms-full.txt, openapi.json, robots mở cho GPTBot, ClaudeBot, PerplexityBot.',
    'Đăng ký tài khoản tự kích hoạt, dùng ngay, tự tạo API key; nút Tạo tài khoản mở thẳng tab đăng ký (/auth?mode=register).',
    'Wizard nối ACB 4 bước liền mạch với 2 lần OTP (tạo tài khoản ảo, đăng ký nhận thông báo giao dịch).',
    'Dashboard Webhooks: lịch sử từng lần gửi (mã HTTP, thời gian phản hồi, nhãn lỗi), gửi lại, thống kê tỷ lệ thành công và P95.',
    'Tool tạo mã QR ngân hàng chuẩn VietQR cho 36 ngân hàng, chạy trên trình duyệt, không lưu dữ liệu, kèm 10 trang theo ngân hàng.',
    'Bộ nhận diện: logo, favicon, ảnh đại diện chia sẻ; trang Điều khoản sử dụng và Chính sách bảo mật.',
  ]},
];
// Đang triển khai (mã đã viết, chờ đưa lên máy chủ) — cập nhật tại đây khi lên
export const IN_PROGRESS: string[] = [
  'Gửi lại webhook tự động theo lịch (tối đa 7 lần) khi máy chủ của anh chị không phản hồi.',
  'Chế độ sandbox: tạo giao dịch giả để thử webhook, Telegram mà không cần chuyển tiền.',
  'Tham số since_id khi tra giao dịch để đối soát theo con trỏ, kèm has_more.',
  'Giới hạn tốc độ gọi API, danh sách IP được phép, Idempotency-Key cho lệnh tạo QR và tài khoản ảo.',
  'Phạm vi quyền cho từng API key (chỉ đọc, tạo QR, tạo tài khoản ảo, cấu hình webhook).',
  'Kênh thông báo Zalo OA và ZNS, Slack, Discord, email bên cạnh Telegram.',
  'Kết nối thêm ngân hàng ngoài ACB theo bảng tại /ngan-hang.',
];
