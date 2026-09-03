// Sự thật thương hiệu MONA Pay — nơi ở duy nhất, mọi trang import từ đây (không bịa số ở trang).
export const SITE = {
  name: 'MONA Pay',
  url: 'https://monapay.vn',
  app: 'https://my.monapay.vn',
  appLogin: 'https://my.monapay.vn/auth',
  appRegister: 'https://my.monapay.vn/auth?mode=register',
  api: 'https://api.monapay.vn',
  apiLegacy: 'https://ipn.mona.host',
  docs: 'https://monapay.vn/docs',
  hotline: '1900 636 648',
  hotlineTel: 'tel:1900636648',
  email: 'info@themona.global',
  company: 'The MONA Group',
  companyUrl: 'https://mona.media',
  founded: 2016,
  projects: '14.000+',
  retention: '85%',
  years: '10 năm',
  // Câu entity — lặp NGUYÊN VĂN ở title/meta/H1-đoạn mở/footer/llms.txt
  entity:
    'MONA Pay là cổng thanh toán và API ngân hàng của The MONA Group, giúp doanh nghiệp Việt Nam nhận và xác nhận tiền chuyển khoản theo thời gian thực qua tài khoản ảo (VA), VietQR, webhook và Telegram — thiết kế để cả lập trình viên lẫn AI agent tích hợp trong vài phút.',
  entityShort: 'MONA Pay — API ngân hàng & webhook thanh toán tự động cho thời đại AI.',
  trustLine:
    'Hệ thống MONA tự xây để thu tiền cho chính mình, rồi từ 2022 tới nay hơn 6.000 khách hàng mới của MONA đã thu tiền qua đây trong web, phần mềm MONA giao. Năm 2026 mở cho mọi doanh nghiệp, miễn phí 500 giao dịch mỗi tháng.',
  customersSince2022: '6.000+',
  storyLine: 'Từ 2022 tới nay, hơn 6.000 khách hàng mới của MONA đã dùng hệ thống này để nhận và xác nhận tiền chuyển khoản; năm 2026 tụi em mở public tại monapay.vn cho mọi doanh nghiệp.',
  // Số kỹ thuật lấy từ code BE acb-ipn (kiểm 28/08/2026) — đổi ở đây khi BE đổi
  tech: {
    hmacHeader: 'X-Mona-Signature',
    tsHeader: 'X-Mona-Timestamp',
    replayWindowMin: 5,
    webhookTimeoutSec: 10,
    listMaxLimit: 100,
    banks: ['ACB'],            // ⚠️ trạng thái đầy đủ + roadmap đa ngân hàng: src/data/banks.ts (LIVE_BANKS / APPLYING_BANKS)
    outboundIp: '103.168.55.14',
    lastVerified: '28/08/2026',
  },
  sameAs: [
    'https://mona.media',
    'https://mona.host',
    'https://mona.software',
    'https://www.facebook.com/monamedia.net',
  ],
};

export const NAV = [
  { href: '/acb', label: 'Ngân hàng ACB' },
  { href: '/bang-gia', label: 'Bảng giá' },
  { href: '/docs', label: 'Tài liệu' },
  { href: '/ai-agent', label: 'Cho AI agent' },
  { href: '/faq', label: 'Hỏi đáp' },
];

export const FOOTER_LINKS = {
  'Sản phẩm': [
    { href: '/trang-thanh-toan', label: 'Trang thanh toán MONA Pay' },
    { href: '/acb', label: 'Nhận tiền ACB theo thời gian thực' },
    { href: '/chia-se-bien-dong-so-du-telegram', label: 'Báo biến động số dư qua Telegram' },
    { href: '/cong-thanh-toan-woocommerce', label: 'Cổng thanh toán WooCommerce' },
    { href: '/cong-thanh-toan-wordpress', label: 'Cổng thanh toán WordPress' },
    { href: '/bang-gia', label: 'Bảng giá' },
  ],
  'Lập trình viên': [
    { href: '/docs', label: 'Tài liệu tích hợp' },
    { href: '/docs/webhooks/tich-hop-webhook', label: 'Webhook' },
    { href: '/docs/api/xac-thuc', label: 'API v1' },
    { href: '/ai-agent', label: 'Dành cho AI agent' },
    { href: '/llms.txt', label: 'llms.txt' },
  ],
  'MONA Pay': [
    { href: '/gioi-thieu', label: 'Giới thiệu' },
    { href: '/khach-hang', label: 'Khách hàng' },
    { href: '/cong-thanh-toan-quoc-te', label: 'So với cổng thanh toán quốc tế' },
    { href: '/faq', label: 'Hỏi đáp' },
    { href: 'https://my.monapay.vn', label: 'Đăng nhập' },
    { href: '/changelog', label: 'Nhật ký thay đổi' },
    { href: '/roadmap', label: 'Lộ trình' },
    { href: '/status', label: 'Trạng thái hệ thống' },
    { href: '/dieu-khoan', label: 'Điều khoản sử dụng' },
    { href: '/chinh-sach-bao-mat', label: 'Chính sách bảo mật' },
  ],
};

// Footer tiếng Anh cho /en (trang chưa có bản EN thì trỏ trang VI)
export const FOOTER_LINKS_EN = {
  'Products': [
    { href: '/trang-thanh-toan', label: 'MONA Pay hosted checkout' },
    { href: '/acb', label: 'ACB transfers in real time' },
    { href: '/chia-se-bien-dong-so-du-telegram', label: 'Balance alerts on Telegram' },
    { href: '/cong-thanh-toan-woocommerce', label: 'WooCommerce payment gateway' },
    { href: '/cong-thanh-toan-wordpress', label: 'WordPress payment gateway' },
    { href: '/bang-gia', label: 'Pricing' },
  ],
  'Developers': [
    { href: '/en/docs', label: 'Integration docs' },
    { href: '/en/docs/webhooks/tich-hop-webhook', label: 'Webhooks' },
    { href: '/en/docs/api/xac-thuc', label: 'API v1' },
    { href: '/en/ai-agent', label: 'For AI agents' },
    { href: '/llms.txt', label: 'llms.txt' },
  ],
  'MONA Pay': [
    { href: '/gioi-thieu', label: 'About' },
    { href: '/khach-hang', label: 'Customers' },
    { href: '/cong-thanh-toan-quoc-te', label: 'Compared with international gateways' },
    { href: '/faq', label: 'FAQ' },
    { href: 'https://my.monapay.vn', label: 'Log in' },
    { href: '/changelog', label: 'Changelog' },
    { href: '/roadmap', label: 'Roadmap' },
    { href: '/status', label: 'System status' },
    { href: '/dieu-khoan', label: 'Terms of service' },
    { href: '/chinh-sach-bao-mat', label: 'Privacy policy' },
  ],
};
