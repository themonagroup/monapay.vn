// 10 ngân hàng có trang "Tạo mã QR <bank>" riêng (cụm keyword `tạo mã qr [bank]` 60–350/biến thể, Ahrefs 27/08/2026).
// BIN lấy từ BANKS trong /js/vietqr-core.js. Tên app = tên app ngân hàng số chính thức. KHÔNG ghi số khách/chi nhánh/phí của bank.
export type QrBank = { slug: string; name: string; fullName: string; bin: string; app: string; note: string };
export const QR_BANKS: QrBank[] = [
  { slug: 'vietcombank', name: 'Vietcombank', fullName: 'Ngân hàng TMCP Ngoại thương Việt Nam', bin: '970436', app: 'VCB Digibank', note: 'Tài khoản Vietcombank nhận tiền qua Napas 247 như mọi ngân hàng khác trong chuẩn VietQR.' },
  { slug: 'techcombank', name: 'Techcombank', fullName: 'Ngân hàng TMCP Kỹ thương Việt Nam', bin: '970407', app: 'Techcombank Mobile', note: 'Nhiều shop dùng số tài khoản dạng chọn số (tài khoản số đẹp) của Techcombank; mã QR nhận đúng số tài khoản anh chị nhập.' },
  { slug: 'mb-bank', name: 'MB Bank', fullName: 'Ngân hàng TMCP Quân đội', bin: '970422', app: 'App MBBank', note: 'MB Bank cho mở tài khoản số theo số điện thoại; nhập đúng số tài khoản hiện trên app MBBank.' },
  { slug: 'bidv', name: 'BIDV', fullName: 'Ngân hàng TMCP Đầu tư và Phát triển Việt Nam', bin: '970418', app: 'BIDV SmartBanking', note: 'Tài khoản BIDV thường dài 14 số; kiểm lại số trước khi in mã.' },
  { slug: 'vietinbank', name: 'VietinBank', fullName: 'Ngân hàng TMCP Công thương Việt Nam', bin: '970415', app: 'VietinBank iPay Mobile', note: 'Tài khoản VietinBank hay dùng cho đơn vị hành chính, trường học; mã tĩnh dán quầy thu là cách phổ biến.' },
  { slug: 'agribank', name: 'Agribank', fullName: 'Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam', bin: '970405', app: 'Agribank Plus', note: 'Agribank phủ rộng ở tỉnh, huyện; khách hàng nông sản, vật tư hay chuyển khoản qua Agribank.' },
  { slug: 'vpbank', name: 'VPBank', fullName: 'Ngân hàng TMCP Việt Nam Thịnh Vượng', bin: '970432', app: 'VPBank NEO', note: 'VPBank cấp tài khoản theo số điện thoại hoặc số chọn; nhập đúng số tài khoản đang dùng để nhận tiền.' },
  { slug: 'tpbank', name: 'TPBank', fullName: 'Ngân hàng TMCP Tiên Phong', bin: '970423', app: 'TPBank Mobile', note: 'TPBank có tài khoản Nickname; mã QR VietQR vẫn dùng số tài khoản, không dùng nickname.' },
  { slug: 'sacombank', name: 'Sacombank', fullName: 'Ngân hàng TMCP Sài Gòn Thương Tín', bin: '970403', app: 'Sacombank Pay', note: 'Tài khoản Sacombank phổ biến với hộ kinh doanh phía Nam; mã QR động theo đơn giúp đối chiếu đỡ nhầm.' },
  { slug: 'acb', name: 'ACB', fullName: 'Ngân hàng TMCP Á Châu', bin: '970416', app: 'ACB ONE', note: 'ACB là ngân hàng MONA Pay đang nối trực tiếp: tiền vào tài khoản ảo hoặc VietQR động là hệ thống tự xác nhận, báo Telegram, bắn webhook.' },
];
