// Sidebar docs — thứ tự hiển thị + nhóm. slug khớp tên file trong src/content/docs (không đuôi .md)
export const DOCS_NAV: { group: string; items: { slug: string; label: string }[] }[] = [
  { group: 'Bắt đầu', items: [
    { slug: 'index', label: 'Tổng quan' },
    { slug: 'bat-dau-nhanh', label: 'Bắt đầu nhanh (5 phút)' },
    { slug: 'khai-niem', label: 'Khái niệm: VA, VietQR, webhook' },
  ]},
  { group: 'Webhooks', items: [
    { slug: 'webhooks/tich-hop-webhook', label: 'Tích hợp webhook' },
    { slug: 'webhooks/dinh-dang-payload', label: 'Định dạng payload' },
    { slug: 'webhooks/bao-mat', label: 'Bảo mật: HMAC + chống replay' },
    { slug: 'webhooks/gui-lai-va-xu-ly-loi', label: 'Gửi lại và xử lý lỗi' },
    { slug: 'webhooks/doi-soat', label: 'Đối soát giao dịch' },
  ]},
  { group: 'API v1', items: [
    { slug: 'api/xac-thuc', label: 'Xác thực' },
    { slug: 'api/api-keys', label: 'API keys' },
    { slug: 'api/tai-khoan-ao-va', label: 'Tài khoản ảo (VA)' },
    { slug: 'api/qr-thanh-toan', label: 'QR thanh toán' },
    { slug: 'api/giao-dich', label: 'Giao dịch' },
    { slug: 'api/webhook-configs', label: 'Cấu hình webhook qua API' },
  ]},
  { group: 'Kênh thông báo', items: [
    { slug: 'telegram', label: 'Telegram' },
  ]},
  { group: 'Tham chiếu', items: [
    { slug: 'api-reference', label: 'API reference tương tác' },
    { slug: 'dia-chi-ip', label: 'Địa chỉ IP' },
    { slug: 'ai-agent', label: 'Dành cho AI agent' },
  ]},
];
export const DOCS_FLAT = DOCS_NAV.flatMap((g) => g.items);

// English sidebar — cùng slug, nhãn tiếng Anh (trang /en/docs/*)
export const DOCS_NAV_EN: { group: string; items: { slug: string; label: string }[] }[] = [
  { group: 'Getting started', items: [
    { slug: 'index', label: 'Overview' },
    { slug: 'bat-dau-nhanh', label: 'Quick start (5 minutes)' },
    { slug: 'khai-niem', label: 'Concepts: VA, VietQR, webhooks' },
  ]},
  { group: 'Webhooks', items: [
    { slug: 'webhooks/tich-hop-webhook', label: 'Webhook integration' },
    { slug: 'webhooks/dinh-dang-payload', label: 'Payload format' },
    { slug: 'webhooks/bao-mat', label: 'Security: HMAC + replay protection' },
    { slug: 'webhooks/gui-lai-va-xu-ly-loi', label: 'Retries and error handling' },
    { slug: 'webhooks/doi-soat', label: 'Reconciliation' },
  ]},
  { group: 'API v1', items: [
    { slug: 'api/xac-thuc', label: 'Authentication' },
    { slug: 'api/api-keys', label: 'API keys' },
    { slug: 'api/tai-khoan-ao-va', label: 'Virtual accounts (VA)' },
    { slug: 'api/qr-thanh-toan', label: 'QR payments' },
    { slug: 'api/giao-dich', label: 'Transactions' },
    { slug: 'api/webhook-configs', label: 'Webhook configuration API' },
  ]},
  { group: 'Notification channels', items: [
    { slug: 'telegram', label: 'Telegram' },
  ]},
  { group: 'Reference', items: [
    { slug: 'dia-chi-ip', label: 'IP addresses' },
    { slug: 'ai-agent', label: 'For AI agents' },
  ]},
];
