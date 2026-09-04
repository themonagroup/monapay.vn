// Menu chính (mega menu): nguồn duy nhất cho header. Mỗi nhóm: label + cột items {href,label,desc}. active = path bắt đầu bằng href.
export type NavItem = { href: string; label: string; desc?: string; badge?: string };
export type NavGroup = { label: string; href?: string; cols?: { title: string; items: NavItem[] }[]; match?: string[] };
export const MEGA: NavGroup[] = [
  {
    label: 'Sản phẩm', match: ['/trang-thanh-toan', '/acb', '/ngan-hang', '/chia-se-bien-dong-so-du-telegram', '/ai-agent', '/tao-ma-qr-ngan-hang', '/loa-thong-bao-chuyen-khoan', '/docs/dung-ngay'],
    cols: [
      { title: 'Nhận tiền', items: [
        { href: '/docs/dung-ngay', label: 'Dùng ngay, không cần lập trình', desc: 'Hướng dẫn cho quán ăn, tiệm tóc, shop online, lớp học: nối ngân hàng, báo có, in QR trong 10 phút', badge: 'Cho chủ quán' },
        { href: '/trang-thanh-toan', label: 'Trang thanh toán', desc: 'Tạo link có VietQR, gửi khách hoặc chuyển hướng từ website', badge: 'Mới' },
        { href: '/ngan-hang', label: 'Ngân hàng hỗ trợ', desc: 'ACB đang chạy, các ngân hàng khác đang kết nối, bảng trạng thái', badge: 'Mở rộng' },
        { href: '/acb', label: 'Nhận tiền ACB theo thời gian thực', desc: 'Tài khoản ảo (VA) riêng từng đơn, ACB báo là biết ngay' },
        { href: '/docs/api/qr-thanh-toan', label: 'VietQR động', desc: 'Mã QR điền sẵn số tiền và nội dung, khách quét là khớp đơn' },
        { href: '/loa-thong-bao-chuyen-khoan', label: 'Thay loa báo tiền', desc: 'Báo có qua Telegram/Zalo/webhook, không cần mua loa' },
        { href: '/tao-ma-qr-ngan-hang', label: 'Tạo mã QR ngân hàng (miễn phí)', desc: 'Công cụ tạo VietQR 36 ngân hàng, chạy trên trình duyệt', badge: 'Tool' },
        { href: '/docs/webhooks/tich-hop-webhook', label: 'Webhook về website, phần mềm', desc: 'Ký HMAC-SHA256, chống replay 5 phút, lịch sử từng lần gửi' },
      ]},
      { title: 'Thông báo và quản lý', items: [
        { href: '/chia-se-bien-dong-so-du-telegram', label: 'Báo biến động số dư qua Telegram', desc: 'Cả nhóm công ty thấy tiền vào, không cần đưa app ngân hàng' },
        { href: '/docs/zalo', label: 'Báo tiền vào nhóm Zalo', desc: 'Đội bán hàng thấy tiền vào qua bot Gấu Mona, không cần Zalo OA' },
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
        { href: '/cong-thanh-toan-opencart', label: 'OpenCart', desc: 'Module GitHub, VietQR động, đơn tự sang Complete' },
        { href: '/cong-thanh-toan-prestashop', label: 'PrestaShop', desc: 'Module GitHub, VietQR động, đơn sang Payment accepted' },
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

// Menu tiếng Anh cho /en (Mon 03/09/2026: trang EN mà menu VI). Trang chưa có bản EN thì trỏ về trang VI, ghi rõ trong desc.
export const MEGA_EN: NavGroup[] = [
  {
    label: 'Products', match: ['/trang-thanh-toan', '/acb', '/ngan-hang', '/chia-se-bien-dong-so-du-telegram', '/en/ai-agent', '/tao-ma-qr-ngan-hang', '/loa-thong-bao-chuyen-khoan', '/en/docs/dung-ngay'],
    cols: [
      { title: 'Collect payments', items: [
        { href: '/en/docs/dung-ngay', label: 'Get started today, no coding needed', desc: 'For restaurants, salons, online shops and classes: connect a bank, get paid alerts, print a QR in 10 minutes', badge: 'For owners' },
        { href: '/trang-thanh-toan', label: 'Hosted checkout', desc: 'Create a VietQR payment link or redirect from a website (Vietnamese page)', badge: 'New' },
        { href: '/ngan-hang', label: 'Supported banks', desc: 'ACB live, other banks connecting, status table (Vietnamese page)', badge: 'Growing' },
        { href: '/acb', label: 'ACB transfers in real time', desc: 'A virtual account (VA) per order, ACB notifies instantly (Vietnamese page)' },
        { href: '/en/docs/api/qr-thanh-toan', label: 'Dynamic VietQR', desc: 'QR pre-filled with amount and note, scan to match the order' },
        { href: '/loa-thong-bao-chuyen-khoan', label: 'Replace the payment speaker', desc: 'Telegram, Zalo or webhook alerts instead of a speaker (Vietnamese page)' },
        { href: '/tao-ma-qr-ngan-hang', label: 'Bank QR generator (free)', desc: 'VietQR for 36 banks, runs in the browser', badge: 'Tool' },
        { href: '/en/docs/webhooks/tich-hop-webhook', label: 'Webhooks to your website or software', desc: 'HMAC-SHA256 signed, 5-minute replay window, delivery history' },
      ]},
      { title: 'Alerts and management', items: [
        { href: '/chia-se-bien-dong-so-du-telegram', label: 'Balance alerts on Telegram', desc: 'The whole team sees money arrive without sharing the bank app (Vietnamese page)' },
        { href: '/en/docs/zalo', label: 'Incoming-payment alerts on Zalo', desc: 'The sales team sees payments through the Gấu Mona bot, with no Zalo OA' },
        { href: 'https://my.monapay.vn', label: 'Dashboard my.monapay.vn', desc: 'Transactions, QR codes, webhook retries, statistics' },
        { href: '/en/ai-agent', label: 'For AI agents', desc: 'llms.txt, .md docs and openapi.json so an agent integrates on its own', badge: 'New' },
      ]},
    ],
  },
  {
    label: 'Solutions', match: ['/cong-thanh-toan-', '/nganh/', '/cong-thanh-toan-quoc-te', '/paypal-viet-nam', '/stripe-viet-nam', '/khach-hang'],
    cols: [
      { title: 'By platform', items: [
        { href: '/cong-thanh-toan-woocommerce', label: 'WooCommerce', desc: 'Bank transfer paid, order flips to paid (Vietnamese page)' },
        { href: '/cong-thanh-toan-wordpress', label: 'WordPress', desc: 'Courses, deposits, memberships unlock when money lands (Vietnamese page)' },
        { href: '/cong-thanh-toan-opencart', label: 'OpenCart', desc: 'GitHub module, dynamic VietQR, order moves to Complete (Vietnamese page)' },
        { href: '/cong-thanh-toan-prestashop', label: 'PrestaShop', desc: 'GitHub module, dynamic VietQR, order moves to Payment accepted (Vietnamese page)' },
        { href: '/cong-thanh-toan-shopify', label: 'Shopify', desc: 'Domestic transfers for Shopify stores in Vietnam (Vietnamese page)' },
        { href: '/cong-thanh-toan-haravan', label: 'Haravan', desc: 'Haravan orders confirm when money reaches ACB (Vietnamese page)' },
        { href: '/cong-thanh-toan-sapo', label: 'Sapo', desc: 'Dynamic VietQR per order, Telegram alerts (Vietnamese page)' },
        { href: '/cong-thanh-toan-kiotviet', label: 'KiotViet', desc: 'Match transfers with sales invoices (Vietnamese page)' },
      ]},
      { title: 'By industry', items: [
        { href: '/nganh/giao-duc', label: 'Education, training centres', desc: 'Automatic tuition collection, one VA per student (Vietnamese page)' },
        { href: '/nganh/nha-hang-fnb', label: 'Restaurants, F&B', desc: 'QR at the table, takeaway, cashier alerts (Vietnamese page)' },
        { href: '/nganh/spa-salon', label: 'Spa, salon, nails', desc: 'Booking deposits and service payments (Vietnamese page)' },
        { href: '/nganh/nhap-hang-trung-quoc', label: 'China import agents', desc: 'Customer top-ups, high-volume reconciliation (Vietnamese page)' },
        { href: '/nganh/cho-thue-tro', label: 'Rentals and buildings', desc: 'Rent, utilities, deposits with a VA per room (Vietnamese page)' },
        { href: '/nganh/hosting-saas', label: 'Hosting, SaaS, subscriptions', desc: 'Renewals activate when money lands, like Mona.Host (Vietnamese page)' },
      ]},
      { title: 'Compared with other gateways', items: [
        { href: '/cong-thanh-toan-quoc-te', label: 'International gateways', desc: 'When you need one and when you do not (Vietnamese page)' },
        { href: '/paypal-viet-nam', label: 'PayPal in Vietnam', desc: '4.40% + fixed fee, 60,000 VND per withdrawal (Vietnamese page)' },
        { href: '/stripe-viet-nam', label: 'Stripe in Vietnam', desc: 'Not open to Vietnamese businesses yet (Vietnamese page)' },
        { href: '/khach-hang', label: 'Real use cases', desc: 'Hosting, tuition, software, online shops of MONA customers (Vietnamese page)' },
      ]},
    ],
  },
  { label: 'Docs', href: '/en/docs', match: ['/en/docs'] },
  { label: 'Pricing', href: '/bang-gia', match: ['/bang-gia'] },
  { label: 'Security', href: '/cam-ket-bao-mat', match: ['/cam-ket-bao-mat'] },
  { label: 'Blog', href: '/blog', match: ['/blog'] },
  { label: 'FAQ', href: '/faq', match: ['/faq'] },
];
