// BẢNG GIÁ — đọc từ ../../../pricing/plans.json (nguồn duy nhất, copy ở ./plans.json qua scripts-sync-plans.sh).
// Mon chốt 31/08/2026: gói Miễn phí 500 giao dịch/tháng (gấp 10 mức phổ biến trên thị trường), trên đó 4 gói trả phí tính theo số giao dịch.
// Đổi giá: sửa pricing/plans.json → chạy ./scripts-sync-plans.sh → build. KHÔNG gõ số giá ở trang.
import plansJson from './plans.json';

export type PricingMode = 'free-all' | 'tiers';
export const PRICING_MODE: PricingMode = 'tiers';
export const PRICING_APPROVED = true;

export type Plan = {
  code: string; name: string; price_month: number; price_year: number;
  tx_limit: number; overage_per_tx: number | null; featured: boolean; sort: number; features: string[]; hidden?: boolean;
};
export const YEARLY_MONTHS: number = plansJson.yearly_months;
const ALL_PLANS: Plan[] = [...plansJson.plans]
  .sort((a, b) => a.sort - b.sort)
  .map((p) => ({ ...p, price_year: p.price_month * YEARLY_MONTHS }));
// PLANS công khai KHÔNG gồm gói ẩn (vd 'mona') — bảng giá đang xài index nên đừng đổi
export const PLANS: Plan[] = ALL_PLANS.filter((p) => !p.hidden);
// Gói khách hàng MONA (Mon chốt 02/09): miễn phí hoàn toàn, không giới hạn, admin gán tay
export const MONA_CUSTOMER_PLAN = ALL_PLANS.find((p) => p.code === 'mona');
export const MONA_FREE_LINE = 'Miễn phí hoàn toàn, không giới hạn giao dịch, cho khách hàng của MONA';
export const FREE_PLAN = PLANS.find((p) => p.code === 'free')!;
export const PAID_PLANS = PLANS.filter((p) => p.price_month > 0);
export const CHEAPEST_PAID = PAID_PLANS[0];
export const FREE_TX_PER_MONTH = FREE_PLAN.tx_limit; // 500

export const fmt = (n: number) => new Intl.NumberFormat('vi-VN').format(n);
export const fmtVnd = (n: number) => `${fmt(n)} đ`;

export const TX_RULE: string = plansJson.tx_rule;
export const FREE_OVER_QUOTA_POLICY: string = plansJson.free_over_quota_policy;
export const PAID_OVER_QUOTA_POLICY: string = plansJson.paid_over_quota_policy;
export const INVOICE_TTL_HOURS: number = plansJson.invoice_ttl_hours;

export const FAIR_USE = {
  rateLimit: 'Có giới hạn tốc độ gọi API để chặn bắn dồn dập; dùng bình thường không bao giờ chạm ngưỡng.',
  note: 'Ngoài hạn mức giao dịch theo gói, chỉ chặn hành vi bất thường (bắn API dồn dập, tạo tài khoản hàng loạt).',
};

// Câu giá dùng chung mọi trang (import thay vì gõ tay) — đổi plans.json là đổi toàn site
export const PRICE_LINE = `miễn phí ${fmt(FREE_TX_PER_MONTH)} giao dịch mỗi tháng`;
export const PRICE_LINE_FULL = `${PRICE_LINE}, gói trả phí từ ${fmtVnd(CHEAPEST_PAID.price_month)}/tháng tính theo số giao dịch`;
export const FREE_MULTIPLE_LINE = `gấp 10 lần mức miễn phí phổ biến trên thị trường`;
