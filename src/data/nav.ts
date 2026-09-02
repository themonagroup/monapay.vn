// Menu chính (mega menu) — nguồn duy nhất cho header. Mỗi nhóm: label + cột items {href,label,desc}. active = path bắt đầu bằng href.
export type NavItem = { href: string; label: string; desc?: string; badge?: string };
export type NavGroup = { label: string; href?: string; cols?: { title: string; items: NavItem[] }[]; match?: string[] };
export const MEGA: NavGroup[] = [
  {
    label: 'Sản phẩm', match: ['/acb', '/ngan-hang', '/chia-se-bien-dong-so-du-telegram', '/ai-agent', '/tao-ma-qr-ngan-hang', '/loa-thong-bao-chuyen-khoan'],
    cols: [
      { title: 'Nhận tiền', items: [
        { href: '/ngan-hang', label: 'Ngân hàng hỗ trợ', desc: 'ACB đang chạy, các ngân hàng khác đang kết nối, bảng trạng thái', badge: 'Mở rộng' },
        { href: '/acb', label: 'Nhận tiền ACB theo thời gian thực', desc: 'Tài khoản ảo (VA) riêng từng đơn, ACB báo là biết ngay' },
        { href: '/docs/api/qr-thanh-toan', label: 'VietQR động', desc: 'Mã QR điền sẵn số tiền và nội dung, khách quét là khớp đơn' },
        { href: '/loa-thong-bao-chuyen-khoan', label: 'Thay loa báo tiền', desc: 'Báo có qua Telegram/Zalo/webhook, không cần mua loa' },
        { href: '/tao-ma-qr-ngan-hang', label: 'Tạo mã QR ngân hàng (miễn phí)', desc: 'Công cụ tạo VietQR 36 ngân hàng, chạy trên trình duyệt', badge: 'Tool' },
        { href: '/docs/webhooks/tich-hop-webhook', label: 'Webhook về website, phần mềm', desc: 'Ký HMAC-SHA256, chống replay 5 phút, lịch sử từng lần gửi' },
      ]},
      { title: 'Thông báo và quản lý', items: [
        { href: '/chia-se-bien-dong-so-du-telegram', label: 'Báo biến động số dư qua Telegram', desc: 'Cả nhóm công ty thấy tiền vào, không cần đưa app ngân hàng' },
        { href: 'https://my.monapay.vn', label: 'Dashboard my.monapay.vn', desc: 'Xem giao dịch, tạo QR, gửi lại webhook, thống kê' },
        { href: '/ai-agent', label: 'Dành cho AI agent', desc: 'llms.txt, tài liệu .md, openapi.json để agent tự tích hợp', badge: 'Mới' },
      ]},
    ],
  },
  {
    label: 'Giải pháp', match: ['/cong-thanh-toan-', '/nganh/', '/cong-thanh-toan-quoc-te', '/paypal-viet-nam', '/stripe-viet-nam', '/khach-hang'],
    cols: [
      { title: 'Theo nền tảng', items: [
        { href: '/cong-thanh-toan-woocommerce', label: 'WooCommerce', desc: 'Khách chuyển khoản, đơn tự sang đã thanh toán' },
        { href: '/cong-thanh-toan-wordpress', label: 'WordPress', desc: 'Khoá học, đặt cọc, hội viên tự mở khi tiền vào' },
        { href: '/cong-thanh-toan-shopify', label: 'Shopify', desc: 'Thu chuyển khoản nội địa cho shop Shopify tại Việt Nam' },
        { href: '/cong-thanh-toan-haravan', label: 'Haravan', desc: 'Đơn Haravan tự xác nhận khi tiền vào ACB' },
        { href: '/cong-thanh-toan-sapo', label: 'Sapo', desc: 'VietQR động theo đơn, báo Telegram' },
        { href: '/cong-thanh-toan-kiotviet', label: 'KiotViet', desc: 'Khớp tiền chuyển khoản với hoá đơn bán' },
      ]},
      { title: 'Theo ngành', items: [
        { href: '/nganh/giao-duc', label: 'Giáo dục, trung tâm', desc: 'Thu học phí tự động, VA riêng từng học viên' },
        { href: '/nganh/nha-hang-fnb', label: 'Nhà hàng, F&B', desc: 'QR tại bàn, đơn mang đi, báo tiền vào cho thu ngân' },
        { href: '/nganh/spa-salon', label: 'Spa, salon, nail', desc: 'Đặt cọc lịch hẹn, thanh toán dịch vụ' },
        { href: '/nganh/nhap-hang-trung-quoc', label: 'Nhập hàng Trung Quốc', desc: 'Khách nạp tiền, đối soát khối lượng lớn' },
        { href: '/nganh/cho-thue-tro', label: 'Cho thuê trọ, toà nhà', desc: 'Tiền phòng, điện nước, cọc theo VA từng phòng' },
        { href: '/nganh/hosting-saas', label: 'Hosting, SaaS, thuê bao', desc: 'Gia hạn tự kích hoạt khi tiền vào, như Mona.Host' },
      ]},
      { title: 'So với cổng khác', items: [
        { href: '/cong-thanh-toan-quoc-te', label: 'Cổng thanh toán quốc tế', desc: 'Khi nào cần, khi nào không hợp thu tiền trong nước' },
        { href: '/paypal-viet-nam', label: 'PayPal tại Việt Nam', desc: 'Phí 4,40% + phí cố định, rút về ngân hàng 60.000đ' },
        { href: '/stripe-viet-nam', label: 'Stripe tại Việt Nam', desc: 'Chưa mở đăng ký cho doanh nghiệp Việt Nam' },
        { href: '/khach-hang', label: 'Ca dùng thật', desc: 'Hosting, học phí, phần mềm, web bán hàng của khách MONA' },
      ]},
    ],
  },
  { label: 'Tài liệu', href: '/docs', match: ['/docs'] },
  { label: 'Bảng giá', href: '/bang-gia', match: ['/bang-gia'] },
  { label: 'Bảo mật', href: '/cam-ket-bao-mat', match: ['/cam-ket-bao-mat'] },
  { label: 'Blog', href: '/blog', match: ['/blog'] },
  { label: 'Hỏi đáp', href: '/faq', match: ['/faq'] },
];
