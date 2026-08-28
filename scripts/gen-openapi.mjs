// Sinh public/openapi.json = bản công khai (chỉ route dành cho khách) từ openapi.json của BE.
import { readFileSync, writeFileSync } from 'node:fs';
const src = JSON.parse(readFileSync(new URL('../../fe-payment/openapi.json', import.meta.url)));
const PUBLIC = [
  '/api/v1/client/register-client', '/api/v1/client/login', '/api/v1/client/me', '/api/v1/client/bank-accounts', '/api/v1/client/change-password',
  '/api/v1/client-keys/generate', '/api/v1/client-keys/list', '/api/v1/client-keys/destroy/{key_id}',
  '/api/v1/acb/virtual-account/registration', '/api/v1/acb/{acb_request_id}/virtual-account/verification', '/api/v1/acb/virtual-account/transactions',
  '/api/v1/acb/{virtual_account_id}/virtual-account/delete', '/api/v1/acb/{bank_account_id}/virtual-account/retrieve',
  '/api/v1/acb/{virtual_account_id}/notification/registration', '/api/v1/acb/{acb_request_id}/notification/verification',
  '/api/v1/acb/{acb_notification_id}/notification/modification', '/api/v1/acb/{acb_notification_id}/notification/delete',
  '/api/v1/acb/qr-payment/generate', '/api/v1/acb/qr-payment/{qr_code_id}/cancellation', '/health',
];
const out = {
  openapi: src.openapi || '3.1.0',
  info: {
    title: 'MONA Pay API v1', version: '1.0',
    description: 'MONA Pay là cổng thanh toán và API ngân hàng của The MONA Group, giúp doanh nghiệp Việt Nam nhận và xác nhận tiền chuyển khoản theo thời gian thực qua tài khoản ảo (VA), VietQR, webhook và Telegram. Tiền không đi qua MONA Pay. Tài liệu: https://monapay.vn/docs · llms.txt: https://monapay.vn/llms.txt',
    contact: { name: 'MONA Pay', url: 'https://monapay.vn', email: 'info@themona.global' },
  },
  servers: [{ url: 'https://api.monapay.vn', description: 'Production' }, { url: 'https://ipn.mona.host', description: 'Alias cũ (vẫn chạy)' }],
  paths: Object.fromEntries(Object.entries(src.paths).filter(([p]) => PUBLIC.includes(p))),
  components: src.components,
};
// Gắn security scheme cho rõ
out.components = out.components || {};
out.components.securitySchemes = {
  bearerAuth: { type: 'http', scheme: 'bearer', description: 'access_token từ POST /api/v1/client/login' },
  clientSecret: { type: 'apiKey', in: 'header', name: 'X-Client-Secret', description: 'client_secret sinh từ POST /api/v1/client-keys/generate — bắt buộc cho POST/PUT/DELETE' },
};
out.security = [{ bearerAuth: [] }];
writeFileSync(new URL('../public/openapi.json', import.meta.url), JSON.stringify(out, null, 2));
console.log('openapi.json:', Object.keys(out.paths).length, 'paths');
