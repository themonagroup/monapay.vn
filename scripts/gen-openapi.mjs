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

// Email notifications — contract: handoff/email/CONTRACT-EMAIL-API.md.
const emailEvents = ['TRANSACTION_IN', 'WEBHOOK_FAILED', 'VA_CREATED'];
const emailEventTypes = [...emailEvents, 'VERIFICATION', 'TEST', 'RECEIPT'];
const emailStatuses = ['sent', 'failed', 'suppressed', 'skipped'];
const emailErrorLabels = ['OK', 'SMTP_4XX', 'SMTP_5XX', 'TIMEOUT', 'CONNECTION', 'SUPPRESSED', 'RATE_LIMITED', 'TEMPLATE', 'UNVERIFIED'];
const bearerSecurity = [{ bearerAuth: [] }];
const writeSecurity = [{ bearerAuth: [], clientSecret: [] }];
const configId = { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } };
const idempotencyKey = { name: 'Idempotency-Key', in: 'header', required: false, schema: { type: 'string', maxLength: 255 }, description: 'TTL 24 giờ; cùng key khác body trả 409.' };
const jsonBody = (schema) => ({ required: true, content: { 'application/json': { schema } } });
const envelope = (data, description) => ({
  description,
  content: { 'application/json': { schema: { type: 'object', required: ['success', 'message', 'data'], properties: { success: { type: 'boolean' }, message: { type: 'string' }, data } } } },
});

out.components = out.components || {};
out.components.schemas = out.components.schemas || {};
Object.assign(out.components.schemas, {
  EmailConfig: {
    type: 'object', title: 'EmailConfig',
    description: 'Cấu hình thông báo email. Chỉ hoạt động khi mọi người nhận đã xác minh và is_active=true.',
    required: ['id', 'client_id', 'name', 'recipients', 'recipient_status', 'events', 'is_active', 'created_at', 'updated_at'],
    properties: {
      id: { type: 'string', format: 'uuid' }, client_id: { type: 'string', format: 'uuid' },
      name: { type: 'string', minLength: 1, maxLength: 255 },
      recipients: { type: 'array', minItems: 1, maxItems: 10, uniqueItems: true, items: { type: 'string', format: 'email' } },
      recipient_status: { type: 'array', items: { type: 'object', required: ['email', 'verified', 'suppressed'], properties: { email: { type: 'string', format: 'email' }, verified: { type: 'boolean' }, suppressed: { type: 'boolean' } } } },
      pending_verification: { type: 'array', description: 'Các địa chỉ còn phải nhập mã 6 số.', items: { type: 'string', format: 'email' } },
      events: { type: 'array', minItems: 1, uniqueItems: true, items: { type: 'string', enum: emailEvents } },
      virtual_account_id: { anyOf: [{ type: 'string', format: 'uuid' }, { type: 'null' }] },
      is_active: { type: 'boolean' }, created_at: { type: 'string', format: 'date-time' }, updated_at: { type: 'string', format: 'date-time' },
    },
  },
  EmailConfigCreate: {
    type: 'object', title: 'EmailConfigCreate', required: ['name', 'recipients'],
    properties: {
      name: { type: 'string', minLength: 1, maxLength: 255 },
      recipients: { type: 'array', minItems: 1, maxItems: 10, uniqueItems: true, items: { type: 'string', format: 'email' } },
      events: { type: 'array', minItems: 1, default: ['TRANSACTION_IN'], contains: { const: 'TRANSACTION_IN' }, items: { type: 'string', enum: emailEvents } },
      virtual_account_id: { anyOf: [{ type: 'string', format: 'uuid' }, { type: 'null' }] },
    },
    example: { name: 'Ke toan', recipients: ['ketoan@example.com'], events: ['TRANSACTION_IN', 'WEBHOOK_FAILED'] },
  },
  EmailLog: {
    type: 'object', title: 'EmailLog', description: 'Metadata của một lần gửi. Hệ thống không lưu nội dung email.',
    required: ['id', 'client_id', 'event_type', 'recipient', 'subject', 'status', 'error_label', 'attempt', 'created_at'],
    properties: {
      id: { type: 'string', format: 'uuid' }, client_id: { type: 'string', format: 'uuid' },
      config_id: { anyOf: [{ type: 'string', format: 'uuid' }, { type: 'null' }] },
      event_type: { type: 'string', enum: emailEventTypes }, recipient: { type: 'string', format: 'email' }, subject: { type: 'string' },
      message_id: { anyOf: [{ type: 'string' }, { type: 'null' }] }, status: { type: 'string', enum: emailStatuses },
      smtp_code: { anyOf: [{ type: 'string' }, { type: 'null' }] }, duration_ms: { anyOf: [{ type: 'integer', minimum: 0 }, { type: 'null' }] },
      error_label: { type: 'string', enum: emailErrorLabels }, attempt: { type: 'integer', minimum: 1 }, created_at: { type: 'string', format: 'date-time' },
    },
  },
  SandboxTransactionCreate: {
    type: 'object', title: 'SandboxTransactionCreate', required: ['amount', 'description'], additionalProperties: false,
    description: 'Tạo giao dịch tiền vào giả. Bỏ trống số tài khoản để MONA Pay tự tạo hoặc dùng lại VA sandbox SBX của client.',
    properties: {
      virtual_account_number: { type: 'string', minLength: 1, maxLength: 50, description: 'VA thật đã nối hoặc VA sandbox SBX; không bắt buộc.' },
      account_number: { type: 'string', minLength: 1, maxLength: 50, description: 'Tài khoản thật đã nối; không bắt buộc.' },
      amount: { type: 'integer', minimum: 1, maximum: 1000000000, description: 'Số tiền giả, đơn vị VND.' },
      description: { type: 'string', minLength: 1, maxLength: 255, description: 'Nội dung chuyển khoản giả.' },
      transaction_code: { type: 'string', minLength: 1, maxLength: 100, description: 'Mã tuỳ chọn để thử chống trùng; hệ thống tự sinh SANDBOX-… khi bỏ trống.' },
    },
    example: { amount: 250000, description: 'Thanh toan DH10234', transaction_code: 'SANDBOX-DH10234-01' },
  },
  SandboxTransaction: {
    type: 'object', title: 'SandboxTransaction', required: ['transaction_code', 'virtual_account_number', 'account_number', 'amount', 'is_sandbox'],
    properties: {
      transaction_code: { type: 'string' },
      virtual_account_number: { anyOf: [{ type: 'string' }, { type: 'null' }], description: 'VA chỉ định hoặc VA sandbox tự cấp, bắt đầu bằng SBX khi client chưa nối ngân hàng; null khi chỉ định tài khoản thật.' },
      account_number: { type: 'string' },
      amount: { type: 'integer' },
      is_sandbox: { type: 'boolean', const: true },
    },
  },
  PaymentProfile: {
    type: 'object', title: 'PaymentProfile',
    description: 'Hồ sơ nhận diện và tài khoản mặc định cho hosted checkout. return_signature_secret chỉ được trả một lần khi tạo hoặc xoay.',
    required: ['display_name', 'default_bank_account_id', 'va_prefix', 'owner_number', 'owner_type', 'merchant_id', 'terminal_id', 'beneficiary_name', 'locale', 'show_mona_badge'],
    properties: {
      display_name: { type: 'string', minLength: 1, maxLength: 255 },
      logo_url: { anyOf: [{ type: 'string', format: 'uri', pattern: '^https://' }, { type: 'null' }], description: 'Logo HTTPS, tối đa 512 KB.' },
      hotline: { anyOf: [{ type: 'string', maxLength: 30 }, { type: 'null' }] },
      support_email: { anyOf: [{ type: 'string', format: 'email' }, { type: 'null' }] },
      default_bank_account_id: { type: 'string', format: 'uuid' },
      default_virtual_account_id: { anyOf: [{ type: 'string', format: 'uuid' }, { type: 'null' }] },
      va_prefix: { type: 'string', minLength: 1, maxLength: 20 },
      owner_number: { type: 'string', minLength: 1 },
      owner_type: { type: 'string', enum: ['PER', 'ORG'] },
      merchant_id: { type: 'string', minLength: 1 },
      terminal_id: { type: 'string', minLength: 1 },
      beneficiary_name: { type: 'string', minLength: 1, maxLength: 255 },
      accent_color: { anyOf: [{ type: 'string', pattern: '^#[0-9A-Fa-f]{6}$' }, { type: 'null' }] },
      locale: { type: 'string', enum: ['vi', 'en'], default: 'vi' },
      show_mona_badge: { type: 'boolean', default: true },
      return_signature_secret: { type: 'string', readOnly: true, description: 'Secret 48 ký tự, chỉ có trong response tạo mới hoặc xoay secret.' },
    },
  },
  CheckoutCreate: {
    type: 'object', title: 'CheckoutCreate', required: ['amount', 'order_code', 'return_url'],
    properties: {
      amount: { type: 'integer', minimum: 1000, maximum: 1000000000, description: 'Số tiền VND.' },
      order_code: { type: 'string', minLength: 1, maxLength: 50, pattern: '^[A-Za-z0-9_-]+$' },
      description: { type: 'string', maxLength: 100 },
      return_url: { type: 'string', format: 'uri', pattern: '^https://' },
      cancel_url: { type: 'string', format: 'uri', pattern: '^https://' },
      payer_email: { type: 'string', format: 'email' },
      payer_name: { type: 'string', maxLength: 255 },
      expires_in: { type: 'integer', minimum: 60, maximum: 86400, default: 900 },
      metadata: { type: 'object', additionalProperties: true, description: 'JSON tối đa 2 KB sau khi encode.' },
      virtual_account_id: { type: 'string', format: 'uuid' },
      sandbox: { type: 'boolean', default: false, description: 'true để dùng VA sandbox SBX và không chuyển tiền thật.' },
    },
    example: { amount: 250000, order_code: 'DH10234', description: 'Thanh toan DH10234', return_url: 'https://shop.vn/payment/return', cancel_url: 'https://shop.vn/checkout', expires_in: 900 },
  },
  Checkout: {
    type: 'object', title: 'Checkout',
    required: ['id', 'token', 'checkout_url', 'status', 'amount', 'currency', 'order_code', 'description', 'qr_code_id', 'qr_data_url', 'qr_image_url', 'bank', 'return_url', 'expires_at', 'created_at'],
    properties: {
      id: { type: 'string', format: 'uuid' },
      token: { type: 'string', minLength: 32, description: 'Token URL-safe dùng cho trang public.' },
      checkout_url: { type: 'string', format: 'uri', example: 'https://pay.monapay.vn/c/VlGJtN2dJH_lZ5pU7eKqX8cR3wA9mB4n' },
      status: { type: 'string', enum: ['pending', 'paid', 'expired', 'cancelled'] },
      amount: { type: 'integer', minimum: 1000 }, currency: { type: 'string', const: 'VND' },
      order_code: { type: 'string' }, description: { type: 'string' },
      payer_email: { anyOf: [{ type: 'string', format: 'email' }, { type: 'null' }] },
      payer_name: { anyOf: [{ type: 'string' }, { type: 'null' }] },
      metadata: { anyOf: [{ type: 'object', additionalProperties: true }, { type: 'null' }] },
      qr_code_id: { type: 'string', format: 'uuid' }, qr_data_url: { type: 'string' },
      qr_image_url: { type: 'string', format: 'uri' },
      bank: { type: 'object', required: ['code', 'name', 'account_number', 'account_name', 'transfer_content'], properties: {
        code: { type: 'string', example: 'ACB' }, name: { type: 'string', example: 'Ngân hàng ACB' },
        account_number: { type: 'string' }, account_name: { type: 'string' }, transfer_content: { type: 'string' },
      } },
      return_url: { type: 'string', format: 'uri' }, cancel_url: { anyOf: [{ type: 'string', format: 'uri' }, { type: 'null' }] },
      expires_at: { type: 'string', format: 'date-time' }, paid_at: { anyOf: [{ type: 'string', format: 'date-time' }, { type: 'null' }] },
      transaction_code: { anyOf: [{ type: 'string' }, { type: 'null' }] },
      paid_amount: { anyOf: [{ type: 'integer' }, { type: 'null' }] }, partial_amount: { anyOf: [{ type: 'integer' }, { type: 'null' }] },
      paid_late: { type: 'boolean', default: false }, sandbox: { type: 'boolean', default: false }, created_at: { type: 'string', format: 'date-time' },
    },
  },
});

const qrPayment = out.components.schemas.QRPaymentRequest;
if (qrPayment?.properties) {
  qrPayment.properties.payer_email = {
    anyOf: [{ type: 'string', format: 'email' }, { type: 'null' }],
    description: 'Tuỳ chọn. Gửi biên lai Đã nhận thanh toán khi giao dịch khớp QR.',
  };
  if (qrPayment.example) qrPayment.example.payer_email = 'payer@example.com';
}
const acbQrGenerate = out.paths['/api/v1/acb/qr-payment/generate']?.post;
if (acbQrGenerate?.responses?.['200']) {
  acbQrGenerate.responses['200'] = envelope({
    type: 'object', additionalProperties: true, required: ['qr_image_url'],
    properties: { qr_image_url: { type: 'string', format: 'uri', description: 'Ảnh PNG public của QR.' } },
  }, 'Kết quả tạo QR, có qr_image_url trỏ tới ảnh PNG public.');
}

const configEnvelope = envelope({ $ref: '#/components/schemas/EmailConfig' }, 'Envelope với data là EmailConfig.');
Object.assign(out.paths, {
  '/api/v1/email-configs': {
    get: {
      tags: ['Email'], summary: 'Danh sách cấu hình email', operationId: 'list_email_configs', security: bearerSecurity,
      responses: { 200: envelope({ type: 'array', items: { $ref: '#/components/schemas/EmailConfig' } }, 'Envelope với data là EmailConfig[].') },
    },
    post: {
      tags: ['Email'], summary: 'Tạo cấu hình email', operationId: 'create_email_config', security: writeSecurity,
      description: 'Tạo ở trạng thái chưa hoạt động nếu còn địa chỉ chưa xác minh. Hệ thống tự gửi mã 6 số, hạn 15 phút, tới từng địa chỉ mới.',
      parameters: [idempotencyKey],
      requestBody: jsonBody({ $ref: '#/components/schemas/EmailConfigCreate' }),
      responses: { 200: envelope({ $ref: '#/components/schemas/EmailConfig' }, 'data có pending_verification cho địa chỉ còn chờ mã.'), 409: { description: 'Idempotency-Key đã dùng với body khác.' }, 422: { description: 'Dữ liệu không hợp lệ hoặc quá 10 người nhận.' } },
    },
  },
  '/api/v1/email-configs/{id}': {
    get: { tags: ['Email'], summary: 'Chi tiết cấu hình email', operationId: 'get_email_config', security: bearerSecurity, parameters: [configId], responses: { 200: configEnvelope, 404: { description: 'Không tìm thấy cấu hình thuộc client.' } } },
    put: {
      tags: ['Email'], summary: 'Cập nhật cấu hình email', operationId: 'update_email_config', security: writeSecurity, parameters: [configId],
      description: 'is_active=true khi còn người nhận chưa xác minh trả 422 với detail recipients_unverified.',
      requestBody: jsonBody({ type: 'object', minProperties: 1, properties: {
        name: { type: 'string', minLength: 1, maxLength: 255 },
        recipients: { type: 'array', minItems: 1, maxItems: 10, uniqueItems: true, items: { type: 'string', format: 'email' } },
        events: { type: 'array', minItems: 1, contains: { const: 'TRANSACTION_IN' }, items: { type: 'string', enum: emailEvents } },
        virtual_account_id: { anyOf: [{ type: 'string', format: 'uuid' }, { type: 'null' }] }, is_active: { type: 'boolean' },
      } }),
      responses: { 200: configEnvelope, 422: { description: 'detail=recipients_unverified hoặc dữ liệu không hợp lệ.' } },
    },
    delete: { tags: ['Email'], summary: 'Xoá thật cấu hình email', operationId: 'delete_email_config', security: writeSecurity, parameters: [configId], responses: { 200: R('Đã xoá cấu hình.'), 404: { description: 'Không tìm thấy cấu hình thuộc client.' } } },
  },
  '/api/v1/email-configs/{id}/verify': {
    post: {
      tags: ['Email'], summary: 'Xác minh người nhận email', operationId: 'verify_email_recipient', security: writeSecurity, parameters: [configId, idempotencyKey],
      description: 'Mã 6 số hết hạn sau 15 phút, tối đa 5 lần nhập sai. Khi mọi địa chỉ đã xác minh, hệ thống tự bật cấu hình.',
      requestBody: jsonBody({ type: 'object', required: ['email', 'code'], properties: { email: { type: 'string', format: 'email' }, code: { type: 'string', pattern: '^[0-9]{6}$' } } }),
      responses: { 200: configEnvelope, 422: { description: 'Mã sai, hết hạn hoặc đã vượt 5 lần nhập sai.' } },
    },
  },
  '/api/v1/email-configs/{id}/resend-verification': {
    post: {
      tags: ['Email'], summary: 'Gửi lại mã xác minh email', operationId: 'resend_email_verification', security: writeSecurity, parameters: [configId, idempotencyKey],
      description: 'Giới hạn 5 lần mỗi địa chỉ mỗi giờ và 30 lần mỗi client mỗi giờ.',
      requestBody: jsonBody({ type: 'object', required: ['email'], properties: { email: { type: 'string', format: 'email' } } }),
      responses: { 200: R('Đã gửi mã mới nếu địa chỉ cần xác minh.'), 429: { description: 'Vượt rate limit xác minh.' } },
    },
  },
  '/api/v1/email-configs/{id}/test': {
    post: {
      tags: ['Email'], summary: 'Gửi thử email tiền vào', operationId: 'test_email_config', security: writeSecurity, parameters: [configId, idempotencyKey],
      description: 'Gửi mẫu TRANSACTION_IN tới người nhận đã xác minh. Giới hạn 20 mail mỗi client mỗi giờ.',
      requestBody: jsonBody({ type: 'object', maxProperties: 0 }),
      responses: { 200: R('data: {sent: string[], skipped: [{email, reason}], log_ids: []}'), 429: { description: 'Vượt giới hạn mail test.' } },
    },
  },
  '/api/v1/email-logs': {
    get: {
      tags: ['Email'], summary: 'Log gửi email', operationId: 'list_email_logs', security: bearerSecurity,
      description: 'Chỉ trả metadata; không lưu hoặc trả nội dung email.',
      parameters: [
        { name: 'config_id', in: 'query', schema: { type: 'string', format: 'uuid' } },
        { name: 'status', in: 'query', schema: { type: 'string', enum: ['sent', 'failed', 'suppressed'] } },
        { name: 'event_type', in: 'query', schema: { type: 'string', enum: emailEventTypes } },
        { name: 'from_date', in: 'query', schema: { type: 'string', format: 'date-time' } }, { name: 'to_date', in: 'query', schema: { type: 'string', format: 'date-time' } },
        { name: 'page', in: 'query', schema: { type: 'integer', minimum: 1, default: 1 } }, { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 } },
      ],
      responses: { 200: envelope({ type: 'object', required: ['items', 'page', 'limit', 'total'], properties: { items: { type: 'array', items: { $ref: '#/components/schemas/EmailLog' } }, page: { type: 'integer' }, limit: { type: 'integer' }, total: { type: 'integer' } } }, 'Log phân trang.') },
    },
  },
  '/api/v1/email-logs/stats': {
    get: {
      tags: ['Email'], summary: 'Thống kê gửi email', operationId: 'get_email_log_stats', security: bearerSecurity,
      parameters: [{ name: 'from_date', in: 'query', schema: { type: 'string', format: 'date-time' } }, { name: 'to_date', in: 'query', schema: { type: 'string', format: 'date-time' } }],
      responses: { 200: R('data: {total, sent, failed, suppressed, success_rate, p95_duration_ms, error_labels: {label: n}}') },
    },
  },
  '/api/v1/email-suppressions': {
    get: { tags: ['Email'], summary: 'Danh sách địa chỉ email bị chặn', description: 'Chỉ trả địa chỉ thuộc các cấu hình của client hiện tại.', operationId: 'list_email_suppressions', security: bearerSecurity, responses: { 200: R('Danh sách suppression gồm email, reason và thời điểm tạo.') } },
  },
  '/api/v1/email-suppressions/{email}': {
    delete: {
      tags: ['Email'], summary: 'Gỡ chặn địa chỉ email', operationId: 'delete_email_suppression', security: writeSecurity,
      description: 'Client tự chịu trách nhiệm gỡ chặn sau khi sửa nguyên nhân; percent-encode địa chỉ trong URL khi cần.',
      parameters: [{ name: 'email', in: 'path', required: true, schema: { type: 'string', format: 'email' } }],
      responses: { 200: R('Đã gỡ chặn địa chỉ.'), 404: { description: 'Địa chỉ không bị chặn hoặc không thuộc client.' } },
    },
  },
});

const checkoutId = { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } };
const checkoutToken = { name: 'token', in: 'path', required: true, schema: { type: 'string', minLength: 32 } };
const imageSize = { name: 'size', in: 'query', required: false, schema: { type: 'integer', minimum: 128, maximum: 2048, default: 512 } };
const checkoutEnvelope = envelope({ $ref: '#/components/schemas/Checkout' }, 'Envelope với data là Checkout.');
const pngResponse = { description: 'Ảnh QR PNG hiển thị inline.', headers: { 'Content-Disposition': { schema: { type: 'string' }, description: 'inline' } }, content: { 'image/png': { schema: { type: 'string', format: 'binary' } } } };
Object.assign(out.paths, {
  '/api/v1/sandbox/transactions': {
    post: {
      tags: ['Sandbox'], summary: 'Tạo giao dịch tiền vào giả', operationId: 'create_sandbox_transaction', security: writeSecurity,
      description: 'Chạy được trước khi nối ngân hàng: MONA Pay tự tạo hoặc dùng lại VA sandbox SBX. Nếu truyền VA thật đã nối thì dùng VA đó. Giao dịch đi qua webhook, Telegram, email và checkout matcher nhưng không chuyển tiền thật, không tính hạn mức.',
      requestBody: jsonBody({ $ref: '#/components/schemas/SandboxTransactionCreate' }),
      responses: {
        200: envelope({ $ref: '#/components/schemas/SandboxTransaction' }, 'Giao dịch sandbox đã được chấp nhận để xử lý.'),
        401: { description: 'Bearer token không hợp lệ hoặc hết hạn.' },
        403: { description: 'Thiếu hoặc sai X-Client-Secret.' },
        422: { description: 'Body không hợp lệ hoặc tài khoản được chỉ định không thuộc client.' },
      },
    },
  },
  '/api/v1/payment-profile': {
    get: { tags: ['Hosted checkout'], summary: 'Hồ sơ trang thanh toán', operationId: 'get_payment_profile', security: bearerSecurity, responses: { 200: envelope({ $ref: '#/components/schemas/PaymentProfile' }, 'Hồ sơ của client.'), 404: { description: 'Chưa có hồ sơ thanh toán.' } } },
    put: {
      tags: ['Hosted checkout'], summary: 'Tạo hoặc cập nhật hồ sơ trang thanh toán', operationId: 'set_payment_profile', security: writeSecurity,
      description: 'Kiểm tra tài khoản ngân hàng và VA thuộc client. return_signature_secret chỉ được trả một lần khi tạo mới.',
      requestBody: jsonBody({ $ref: '#/components/schemas/PaymentProfile' }),
      responses: { 200: envelope({ $ref: '#/components/schemas/PaymentProfile' }, 'Hồ sơ đã lưu.'), 422: { description: 'VA hoặc dữ liệu hồ sơ không hợp lệ.' } },
    },
  },
  '/api/v1/payment-profile/reveal-return-secret': {
    post: {
      tags: ['Hosted checkout'], summary: 'Xem lại secret ký redirect', operationId: 'reveal_checkout_return_secret', security: writeSecurity,
      description: 'Xác nhận chủ tài khoản bằng password hoặc totp_code rồi trả return_signature_secret.',
      requestBody: jsonBody({ type: 'object', minProperties: 1, properties: { password: { type: 'string', minLength: 1 }, totp_code: { type: 'string', pattern: '^[0-9]{6}$' } } }),
      responses: { 200: envelope({ type: 'object', required: ['return_signature_secret'], properties: { return_signature_secret: { type: 'string' } } }, 'Secret hiện tại.'), 401: { description: 'Xác nhận mật khẩu hoặc 2FA không đúng.' }, 404: { description: 'Chưa có hồ sơ thanh toán.' } },
    },
  },
  '/api/v1/payment-profile/rotate-return-secret': {
    post: { tags: ['Hosted checkout'], summary: 'Xoay secret ký redirect', operationId: 'rotate_checkout_return_secret', security: writeSecurity, parameters: [idempotencyKey], responses: { 200: envelope({ type: 'object', required: ['return_signature_secret'], properties: { return_signature_secret: { type: 'string' } } }, 'Secret mới, chỉ trả một lần.') } },
  },
  '/api/v1/checkouts': {
    get: {
      tags: ['Hosted checkout'], summary: 'Danh sách phiên thanh toán', operationId: 'list_checkouts', security: bearerSecurity,
      parameters: [
        { name: 'status', in: 'query', schema: { type: 'string', enum: ['pending', 'paid', 'expired', 'cancelled'] } },
        { name: 'order_code', in: 'query', schema: { type: 'string', maxLength: 50 } },
        { name: 'from_date', in: 'query', schema: { type: 'string', format: 'date' } }, { name: 'to_date', in: 'query', schema: { type: 'string', format: 'date' } },
        { name: 'page', in: 'query', schema: { type: 'integer', minimum: 1, default: 1 } }, { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 } },
      ],
      responses: { 200: envelope({ type: 'object', required: ['items', 'page', 'limit', 'total'], properties: { items: { type: 'array', items: { $ref: '#/components/schemas/Checkout' } }, page: { type: 'integer' }, limit: { type: 'integer' }, total: { type: 'integer' } } }, 'Danh sách checkout phân trang.') },
    },
    post: {
      tags: ['Hosted checkout'], summary: 'Tạo phiên thanh toán và link thu tiền', operationId: 'create_checkout', security: writeSecurity,
      description: 'Tạo VietQR động và trả checkout_url. Nếu chưa có hồ sơ trả 422 detail=payment_profile_missing.',
      parameters: [{ ...idempotencyKey, required: true }], requestBody: jsonBody({ $ref: '#/components/schemas/CheckoutCreate' }),
      responses: { 201: checkoutEnvelope, 409: { description: 'Trùng order_code đang pending hoặc Idempotency-Key khác body.' }, 422: { description: 'payment_profile_missing hoặc dữ liệu không hợp lệ.' }, 502: { description: 'Ngân hàng không tạo được QR.' } },
    },
  },
  '/api/v1/checkouts/{id}': {
    get: { tags: ['Hosted checkout'], summary: 'Chi tiết phiên thanh toán', operationId: 'get_checkout', security: bearerSecurity, parameters: [checkoutId], responses: { 200: checkoutEnvelope, 404: { description: 'Không tìm thấy checkout thuộc client.' } } },
  },
  '/api/v1/checkouts/{id}/cancel': {
    post: { tags: ['Hosted checkout'], summary: 'Huỷ phiên đang chờ', operationId: 'cancel_checkout', security: writeSecurity, parameters: [checkoutId, { ...idempotencyKey, required: true }], responses: { 200: checkoutEnvelope, 409: { description: 'Checkout không còn ở trạng thái pending.' }, 404: { description: 'Không tìm thấy checkout.' } } },
  },
  '/api/v1/checkouts/{id}/expire-now': {
    post: { tags: ['Hosted checkout'], summary: 'Cho phiên hết hạn ngay', operationId: 'expire_checkout_now', security: writeSecurity, description: 'Chỉ dành cho admin hoặc test.', parameters: [checkoutId, idempotencyKey], responses: { 200: checkoutEnvelope, 409: { description: 'Checkout không còn pending.' } } },
  },
  '/api/v1/checkouts/public/{token}': {
    get: { tags: ['Hosted checkout public'], summary: 'Dữ liệu trang thanh toán public', operationId: 'get_public_checkout', security: [], parameters: [checkoutToken], responses: { 200: R('Tên shop, logo, hotline, accent, số tiền, mã đơn, ngân hàng, QR, trạng thái, hạn và URL trở về. Không lộ client_id, id nội bộ hoặc email.'), 404: { description: 'Token không tồn tại.' }, 429: { description: 'Quá 60 request mỗi phút trên IP.' } } },
  },
  '/api/v1/checkouts/public/{token}/status': {
    get: { tags: ['Hosted checkout public'], summary: 'Poll trạng thái checkout', operationId: 'get_public_checkout_status', security: [], parameters: [checkoutToken], responses: { 200: envelope({ type: 'object', required: ['status', 'expires_at', 'seconds_left'], properties: { status: { type: 'string', enum: ['pending', 'paid', 'expired', 'cancelled'] }, paid_at: { anyOf: [{ type: 'string', format: 'date-time' }, { type: 'null' }] }, expires_at: { type: 'string', format: 'date-time' }, seconds_left: { type: 'integer', minimum: 0 } } }, 'Trạng thái gọn để poll mỗi 3 giây.'), 404: { description: 'Token không tồn tại.' }, 429: { description: 'Quá 60 request mỗi phút trên IP.' } } },
  },
  '/api/v1/checkouts/public/{token}/qr.png': {
    get: { tags: ['Hosted checkout public'], summary: 'Ảnh QR của checkout', operationId: 'get_public_checkout_qr_image', security: [], parameters: [checkoutToken, imageSize], responses: { 200: pngResponse, 404: { description: 'Token không tồn tại.' } } },
  },
  '/api/v1/checkouts/public/{token}/cancel': {
    post: { tags: ['Hosted checkout public'], summary: 'Khách huỷ checkout đang chờ', operationId: 'cancel_public_checkout', security: [], parameters: [checkoutToken], responses: { 200: R('Checkout cancelled và cancel_url để chuyển về merchant.'), 409: { description: 'Checkout không còn pending.' }, 404: { description: 'Token không tồn tại.' }, 429: { description: 'Quá 60 request mỗi phút trên IP.' } } },
  },
  '/api/v1/qr/{qr_id}/image.png': {
    get: { tags: ['QR public'], summary: 'Ảnh PNG cho QR đã tạo', operationId: 'get_qr_image', security: [], parameters: [{ name: 'qr_id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }, imageSize], responses: { 200: pngResponse, 404: { description: 'QR không tồn tại.' } } },
  },
  '/api/v1/qr/generate': {
    post: {
      tags: ['QR'], summary: 'Tạo QR thanh toán', operationId: 'generate_qr', security: writeSecurity,
      requestBody: jsonBody({ type: 'object', additionalProperties: true, description: 'Thông tin ngân hàng, số tiền và nội dung theo cấu hình QR của client.' }),
      responses: { 200: envelope({ type: 'object', additionalProperties: true, required: ['qr_image_url'], properties: { qr_image_url: { type: 'string', format: 'uri', description: 'Ảnh PNG public của QR.' } } }, 'Kết quả tạo QR, có qr_image_url trỏ tới ảnh PNG public.') },
    },
  },
});
// Gắn security scheme cho rõ
out.components.securitySchemes = {
  bearerAuth: { type: 'http', scheme: 'bearer', description: 'access_token từ POST /api/v1/client/login' },
  clientSecret: { type: 'apiKey', in: 'header', name: 'X-Client-Secret', description: 'client_secret sinh từ POST /api/v1/client-keys/generate — bắt buộc cho POST/PUT/DELETE' },
};
out.security = [{ bearerAuth: [] }];
writeFileSync(new URL('../public/openapi.json', import.meta.url), JSON.stringify(out, null, 2));
console.log('openapi.json:', Object.keys(out.paths).length, 'paths');
