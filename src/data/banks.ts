// NGÂN HÀNG — nơi ở duy nhất về trạng thái kết nối. Thêm bank = thêm 1 dòng; mọi trang/FAQ/docs đọc từ đây.
// status: 'live' = đang hoạt động thật · 'dang-dang-ky' = đã/đang nộp hồ sơ kết nối API đối tác · 'ke-hoach' = trong kế hoạch
export type BankStatus = 'live' | 'dang-dang-ky' | 'ke-hoach';
export type Bank = { slug: string; name: string; fullName: string; bin: string; status: BankStatus; since?: string; note?: string; features?: { va: boolean; qr: boolean; notify: boolean } };
export const BANKS: Bank[] = [
  { slug: 'acb', name: 'ACB', fullName: 'Ngân hàng TMCP Á Châu', bin: '970416', status: 'live', since: '2022', note: 'Tài khoản ảo, VietQR động, thông báo giao dịch qua API đối tác của ACB. Chạy thật từ 2022.', features: { va: true, qr: true, notify: true } },
  { slug: 'mb', name: 'MB Bank', fullName: 'Ngân hàng TMCP Quân đội', bin: '970422', status: 'dang-dang-ky', note: 'Đăng ký chương trình API mở của MB.' },
  { slug: 'bidv', name: 'BIDV', fullName: 'Ngân hàng TMCP Đầu tư và Phát triển Việt Nam', bin: '970418', status: 'dang-dang-ky', note: 'Đăng ký cổng Open API của BIDV.' },
  { slug: 'vietinbank', name: 'VietinBank', fullName: 'Ngân hàng TMCP Công Thương Việt Nam', bin: '970415', status: 'dang-dang-ky', note: 'Đăng ký VietinBank iConnect.' },
  { slug: 'ocb', name: 'OCB', fullName: 'Ngân hàng TMCP Phương Đông', bin: '970448', status: 'dang-dang-ky', note: 'Đăng ký Open API của OCB.' },
  { slug: 'msb', name: 'MSB', fullName: 'Ngân hàng TMCP Hàng Hải', bin: '970426', status: 'dang-dang-ky' },
  { slug: 'kienlongbank', name: 'KienlongBank', fullName: 'Ngân hàng TMCP Kiên Long', bin: '970452', status: 'dang-dang-ky' },
  { slug: 'tpbank', name: 'TPBank', fullName: 'Ngân hàng TMCP Tiên Phong', bin: '970423', status: 'dang-dang-ky' },
  { slug: 'vietcombank', name: 'Vietcombank', fullName: 'Ngân hàng TMCP Ngoại thương Việt Nam', bin: '970436', status: 'ke-hoach' },
  { slug: 'techcombank', name: 'Techcombank', fullName: 'Ngân hàng TMCP Kỹ Thương', bin: '970407', status: 'ke-hoach' },
  { slug: 'vpbank', name: 'VPBank', fullName: 'Ngân hàng TMCP Việt Nam Thịnh Vượng', bin: '970432', status: 'ke-hoach' },
  { slug: 'sacombank', name: 'Sacombank', fullName: 'Ngân hàng TMCP Sài Gòn Thương Tín', bin: '970403', status: 'ke-hoach' },
  { slug: 'agribank', name: 'Agribank', fullName: 'Ngân hàng Nông nghiệp và Phát triển Nông thôn', bin: '970405', status: 'ke-hoach' },
];
export const LIVE_BANKS = BANKS.filter((b) => b.status === 'live');
export const APPLYING_BANKS = BANKS.filter((b) => b.status === 'dang-dang-ky');
export const PLANNED_BANKS = BANKS.filter((b) => b.status === 'ke-hoach');
export const STATUS_LABEL: Record<BankStatus, string> = { live: 'Đang hoạt động', 'dang-dang-ky': 'Đang đăng ký kết nối', 'ke-hoach': 'Trong kế hoạch' };
// Câu dùng chung khắp site (import, không gõ tay) — đổi data là đổi cả site
export const BANKS_LINE = `${LIVE_BANKS.map((b) => b.name).join(', ')} đang hoạt động; ${APPLYING_BANKS.map((b) => b.name).join(', ')} đang trong quá trình đăng ký kết nối`;
export const BANKS_SHORT = LIVE_BANKS.length === 1 ? `hiện chạy với ${LIVE_BANKS[0].name}, các ngân hàng khác đang kết nối thêm` : `chạy với ${LIVE_BANKS.map((b) => b.name).join(', ')}`;
