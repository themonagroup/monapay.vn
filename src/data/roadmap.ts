// Lộ trình công khai — trạng thái đọc theo ROADMAP nội bộ (chỉ 3 mức). Không nêu tên đối thủ, không hứa ngày.
export type RStatus = 'da-co' | 'dang-lam' | 'ke-hoach';
export type RItem = { name: string; status: RStatus; note?: string };
export type RGroup = { title: string; why: string; items: RItem[] };
export const STATUS_LABEL: Record<RStatus, string> = { 'da-co': 'Đã có', 'dang-lam': 'Đang làm', 'ke-hoach': 'Kế hoạch' };
export const ROADMAP: RGroup[] = [
  { title: 'Nền tảng', why: 'Những thứ một cổng thanh toán phải có để doanh nghiệp tin dùng hàng ngày.', items: [
    { name: 'Đăng ký tự kích hoạt, tự tạo API key', status: 'da-co' },
    { name: 'Nhiều ngân hàng', status: 'dang-lam', note: 'ACB đang hoạt động; các ngân hàng khác đang đăng ký kết nối, xem /ngan-hang.' },
    { name: 'Sandbox tạo giao dịch giả để thử', status: 'dang-lam', note: 'mã đã xong, chờ lên máy chủ' },
    { name: 'Đối soát theo con trỏ since_id, xuất CSV', status: 'dang-lam', note: 'dashboard đã xuất CSV; since_id chờ lên' },
    { name: 'Nhiều người dùng một doanh nghiệp, phân quyền', status: 'ke-hoach' },
    { name: 'Gói cước', status: 'da-co', note: 'gói Miễn phí 500 giao dịch/tháng + 4 gói trả phí theo số giao dịch, thanh toán gói bằng chuyển khoản, tự kích hoạt' },
  ]},
  { title: 'SDK và mã nguồn mở', why: 'Mỗi ngôn ngữ một package để dev và AI agent cài là chạy.', items: [
    { name: 'Node.js / TypeScript, Python, PHP', status: 'da-co', note: 'mã nguồn v0.1.0 trên GitHub; bản trên npm, PyPI, Packagist lên sau' },
    { name: 'OpenAPI công khai, sinh SDK ngôn ngữ khác', status: 'da-co' },
    { name: 'Go, Java/Kotlin, .NET', status: 'ke-hoach' },
    { name: 'Ruby, Dart/Flutter, Rust', status: 'ke-hoach' },
  ]},
  { title: 'Plugin và nền tảng', why: 'Chỗ shop Việt Nam thật sự cắm vào.', items: [
    { name: 'WooCommerce / WordPress', status: 'da-co', note: 'plugin v0.1.0 trên GitHub; bản trên wordpress.org lên sau' },
    { name: 'Ví dụ 8 framework (Next.js, Express, NestJS, Laravel, Django, FastAPI, Spring Boot, Go)', status: 'da-co' },
    { name: 'Shopify, Haravan, Sapo, KiotViet', status: 'dang-lam', note: 'đã có hướng dẫn nối; app trên kho ứng dụng từng nền tảng là kế hoạch' },
    { name: 'Magento, OpenCart, PrestaShop', status: 'ke-hoach' },
  ]},
  { title: 'Công cụ cho lập trình viên và AI agent', why: 'Để Claude Code, Cursor, Codex gọi thẳng MONA Pay khi đang viết code.', items: [
    { name: 'MCP server monapay-mcp', status: 'da-co', note: '17 tool, mã nguồn trên GitHub' },
    { name: 'CLI monapay (webhook listen, tạo QR, tra giao dịch)', status: 'da-co', note: 'mã nguồn trên GitHub' },
    { name: 'Postman collection, API reference tương tác', status: 'da-co' },
    { name: 'VS Code extension', status: 'ke-hoach' },
    { name: 'Google Sheets add-on', status: 'ke-hoach' },
  ]},
  { title: 'Kênh thông báo', why: 'Tiền vào phải báo đúng chỗ người của anh chị đang nhìn.', items: [
    { name: 'Telegram nhóm, chủ đề, theo từng tài khoản ảo', status: 'da-co' },
    { name: 'Zalo OA và ZNS', status: 'dang-lam', note: 'mã đã xong, đang đăng ký OA' },
    { name: 'Slack, Discord, email', status: 'dang-lam' },
    { name: 'Zalo Mini App', status: 'ke-hoach' },
  ]},
  { title: 'Bảo mật và tin cậy', why: 'Vừa là tính năng, vừa là lý do khách và AI tin.', items: [
    { name: 'Webhook ký HMAC-SHA256, chống replay 5 phút', status: 'da-co' },
    { name: 'Xác thực 2 lớp cho dashboard', status: 'da-co' },
    { name: 'Trạng thái hệ thống công khai, chính sách bảo mật', status: 'da-co' },
    { name: 'Giới hạn tốc độ API, danh sách IP, Idempotency-Key, phạm vi quyền API key', status: 'dang-lam', note: 'mã đã xong, chờ lên máy chủ' },
    { name: 'OAuth2 cho tích hợp bên thứ ba, quản lý phiên đăng nhập', status: 'ke-hoach' },
    { name: 'Cảnh báo giao dịch bất thường', status: 'ke-hoach' },
  ]},
  { title: 'Tài liệu và cộng đồng', why: 'Tài liệu cho người đọc lẫn máy đọc.', items: [
    { name: 'Tài liệu tiếng Việt và tiếng Anh, bản .md, llms.txt', status: 'da-co' },
    { name: 'Nhật ký thay đổi và lộ trình công khai', status: 'da-co' },
    { name: 'Video hướng dẫn từng nền tảng', status: 'ke-hoach' },
    { name: 'Nhóm hỏi đáp dev', status: 'dang-lam', note: 'GitHub Discussions đã mở ở monapay-node và monapay-mcp' },
  ]},
];
