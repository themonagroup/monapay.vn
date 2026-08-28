// BẢNG GIÁ — nơi ở duy nhất của giá. Mon quyết chế độ bằng PRICING_MODE:
//  'free-all'  = MIỄN PHÍ HOÀN TOÀN, không giới hạn giao dịch, chỉ fair-use chống spam (đề xuất 28/08 nếu ACB không thu MONA phí theo GD/VA)
//  'tiers'     = gói theo giao dịch (số đề xuất dưới), cần PRICING_APPROVED=true mới hiện giá gói trả phí
export type PricingMode = 'free-all' | 'tiers';
export const PRICING_MODE: PricingMode = 'free-all';
export const PRICING_APPROVED = false;              // chỉ dùng khi PRICING_MODE = 'tiers'
export const FREE_TX_PER_MONTH = 100;               // chỉ dùng khi PRICING_MODE = 'tiers'
export const FAIR_USE = {                           // free-all: giới hạn chống lạm dụng, không phải giới hạn thương mại
  webhookPerConfig: 'không giới hạn giao dịch',
  rateLimit: 'Có giới hạn tốc độ gọi API để chặn bắn dồn dập; dùng bình thường không bao giờ chạm ngưỡng.',
  note: 'Dùng thật bao nhiêu cũng miễn phí. Chỉ chặn hành vi bất thường (bắn API dồn dập, tạo tài khoản hàng loạt).',
};
export const PLANS = [
  { id: 'free', name: 'Miễn phí', price: 0, unit: 'đ/tháng', tx: `${FREE_TX_PER_MONTH} giao dịch/tháng`, featured: false,
    features: ['Đủ tính năng: VA, VietQR, webhook, Telegram, API', 'Không giới hạn số webhook', 'Dashboard theo dõi giao dịch + lịch sử gửi webhook', 'Hỗ trợ qua tổng đài 1900 636 648'] },
  { id: 'startup', name: 'Khởi nghiệp', price: 199000, unit: 'đ/tháng', tx: '2.000 giao dịch/tháng', featured: true,
    features: ['Mọi thứ của gói Miễn phí', 'Vượt hạn mức: tính thêm theo giao dịch, không khoá dịch vụ', 'Ưu tiên hỗ trợ kỹ thuật', 'Xuất CSV đối soát'] },
  { id: 'business', name: 'Doanh nghiệp', price: 799000, unit: 'đ/tháng', tx: '15.000 giao dịch/tháng', featured: false,
    features: ['Mọi thứ của gói Khởi nghiệp', 'Nhiều tài khoản ngân hàng, nhiều VA', 'Kỹ sư MONA hỗ trợ tích hợp trực tiếp', 'Hoá đơn VAT'] },
];
// Câu giá dùng chung mọi trang (import thay vì gõ tay) — đổi mode là đổi toàn site
export const PRICE_LINE = PRICING_MODE === 'free-all'
  ? 'miễn phí hoàn toàn, không giới hạn giao dịch'
  : `miễn phí ${FREE_TX_PER_MONTH} giao dịch mỗi tháng`;
