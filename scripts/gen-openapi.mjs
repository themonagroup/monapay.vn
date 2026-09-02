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
// Billing (gói + hoá đơn) — BE mới hơn bản openapi.json export, khai tay các route dành cho khách.
const R = (desc) => ({ description: desc, content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, message: { type: 'string' }, data: {} } } } } });
Object.assign(out.paths, {
  '/api/v1/billing/plans': { get: { tags: ['billing'], summary: 'Danh sách 5 gói (public, không cần đăng nhập)', security: [], responses: { 200: R('5 gói: code, name, price_month, price_year (= price_month × 10), tx_limit, overage_per_tx, features') } } },
  '/api/v1/billing/usage': { get: { tags: ['billing'], summary: 'Mức dùng tháng hiện tại của client', description: 'Giao dịch = 1 khoản tiền VÀO ghi nhận trên mọi tài khoản/VA đã nối, cắt tháng theo giờ Việt Nam (UTC+7). Sandbox và webhook gửi lại không tính.', responses: { 200: R('plan_code, plan_cycle, plan_expires_at, tx_used, tx_limit, overage_tx, overage_amount') } } },
  '/api/v1/billing/invoices': {
    get: { tags: ['billing'], summary: 'Danh sách hoá đơn (phân trang, mới nhất trước)', parameters: [ { name: 'status', in: 'query', schema: { type: 'string' } }, { name: 'page', in: 'query', schema: { type: 'integer' } }, { name: 'limit', in: 'query', schema: { type: 'integer' } } ], responses: { 200: R('{ data: [...], total }') } },
    post: { tags: ['billing'], summary: 'Tạo hoá đơn nâng gói (cần X-Client-Secret)', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['plan_code', 'cycle'], properties: { plan_code: { type: 'string', enum: ['startup', 'business', 'enterprise', 'scale'] }, cycle: { type: 'string', enum: ['month', 'year'] } } } } } }, responses: { 201: R('Hoá đơn pending, hạn 48h, mã chuyển khoản MPAY + 6 số, kèm payment: ảnh VietQR + payload EMVCo. Chuyển đúng số tiền với nội dung là mã MPAY, hệ tự khớp trong vài giây.') } },
  },
  '/api/v1/billing/invoices/{invoice_id}': { get: { tags: ['billing'], summary: 'Chi tiết hoá đơn (poll trạng thái paid)', parameters: [{ name: 'invoice_id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }], responses: { 200: R('Hoá đơn + payment nếu còn pending; status: pending | paid | cancelled | expired') } } },
  '/api/v1/billing/invoices/{invoice_id}/cancel': { post: { tags: ['billing'], summary: 'Huỷ hoá đơn pending (cần X-Client-Secret)', parameters: [{ name: 'invoice_id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }], responses: { 200: R('pending → cancelled') } } },
});
// Gắn security scheme cho rõ
out.components = out.components || {};
out.components.securitySchemes = {
  bearerAuth: { type: 'http', scheme: 'bearer', description: 'access_token từ POST /api/v1/client/login' },
  clientSecret: { type: 'apiKey', in: 'header', name: 'X-Client-Secret', description: 'client_secret sinh từ POST /api/v1/client-keys/generate — bắt buộc cho POST/PUT/DELETE' },
};
out.security = [{ bearerAuth: [] }];
writeFileSync(new URL('../public/openapi.json', import.meta.url), JSON.stringify(out, null, 2));
console.log('openapi.json:', Object.keys(out.paths).length, 'paths');
