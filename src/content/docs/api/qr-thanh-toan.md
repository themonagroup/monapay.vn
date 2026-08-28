---
title: "API tạo mã QR ngân hàng ACB (VietQR động) theo đơn hàng"
description: "Tạo mã VietQR ACB gắn mã đơn và số tiền qua POST /acb/qr-payment/generate, nhận qr_data_url để hiển thị; hủy QR chưa thanh toán. Code cURL, PHP, Node."
updated: 28/08/2026
---

QR thanh toán của MONA Pay là mã VietQR động do ACB tạo: đã điền sẵn số tài khoản (hoặc VA), số tiền và mã đơn, khách mở app ngân hàng bất kỳ quét là chuyển đúng số tiền, đúng nội dung, không gõ tay. Gọi `POST /api/v1/acb/qr-payment/generate` với `orderId`, `amount` (VND, số nguyên, tối đa 1.000.000.000) và đầu số VA, MONA Pay trả về `qr_data_url` để anh chị hiển thị ngay trên trang thanh toán. Khi khách trả xong, ACB báo về và MONA Pay bắn [webhook](/docs/webhooks/tich-hop-webhook) y như tiền vào VA. QR tạo nhầm thì hủy bằng endpoint cancellation trước khi khách quét.

Không muốn gọi API thì dashboard có mục Tạo QR: chọn VA, nhập số tiền, tải ảnh QR về in hoặc gửi khách.

## POST /api/v1/acb/qr-payment/generate

Cần Bearer + `X-Client-Secret`. Điều kiện: tài khoản ACB đã nối và có VA (xem [Tài khoản ảo](/docs/api/tai-khoan-ao-va)).

| Trường | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| `ownerNumber` | string | có | Số tài khoản ACB nhận tiền |
| `ownerType` | `PER` / `ORG` | có | `PER` cá nhân, `ORG` doanh nghiệp |
| `merchantId` | string | có | Mã merchant do ACB cấp khi mở dịch vụ QR. Giá trị đúng hiển thị ở dashboard mục Tạo QR |
| `terminalId` | string | có | Mã điểm bán do ACB cấp, cùng chỗ với `merchantId` |
| `orderId` | string | có | Mã đơn của anh chị, duy nhất cho mỗi lần thanh toán |
| `virtualAccountPrefix` | string (1-10) | có | Đầu số VA |
| `beneficiaryName` | string (1-100) | có | Tên người/đơn vị hưởng hiện trên app ngân hàng của khách |
| `amount` | integer | có | Số tiền VND, 0 đến 1.000.000.000. `0` = khách tự nhập số tiền |
| `description` | string (≤255) | không | Nội dung chuyển khoản hiện sẵn cho khách |
| `traceNumber` | string | không | Mã theo dõi riêng của anh chị, nên đặt để tra soát |
| `userId` | string | không | Mã khách trong hệ thống của anh chị |
| `voucherCode`, `loyaltyCode` | string | không | Mã giảm giá / tích điểm nếu anh chị cần lưu kèm |
| `additionalInfo` | array `[{key, value}]` | không | Thông tin phụ dạng khoá-giá trị |

Body mẫu:

```json
{
  "ownerNumber": "123456789",
  "ownerType": "ORG",
  "merchantId": "MC00012345",
  "terminalId": "TM0001",
  "orderId": "DH10234",
  "virtualAccountPrefix": "MONA",
  "beneficiaryName": "CONG TY ABC",
  "amount": 2500000,
  "description": "Thanh toan DH10234",
  "traceNumber": "DH10234-20260828"
}
```

Response 200: `data` là bản ghi QR, quan trọng nhất là `qr_data_url` và `virtual_account_number`.

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": "0190c0d1-...",
    "virtual_account_id": "0190b0c3-...",
    "owner_number": "123456789",
    "owner_type": "ORG",
    "merchant_id": "MC00012345",
    "terminal_id": "TM0001",
    "user_id": null,
    "order_id": "DH10234",
    "virtual_account_prefix": "MONA",
    "beneficiary_name": "CONG TY ABC",
    "amount": 2500000,
    "voucher_code": null,
    "loyalty_code": null,
    "description": "Thanh toan DH10234",
    "additional_info": null,
    "virtual_account_number": "MONA0000010234",
    "trace_number": "DH10234-20260828",
    "qr_data_url": "00020101021238...6304ABCD",
    "created_at": "2026-08-28T10:40:00",
    "updated_at": null
  }
}
```

`qr_data_url` là chuỗi dữ liệu QR chuẩn VietQR (EMVCo). Anh chị đưa chuỗi này vào thư viện vẽ QR bất kỳ (ví dụ `qrcode` của Node, `endroid/qr-code` của PHP) để ra ảnh. Lưu `id` để hủy khi cần.

**cURL**

```bash
curl -X POST https://api.monapay.vn/api/v1/acb/qr-payment/generate \
  -H "Authorization: Bearer $MONA_TOKEN" -H "X-Client-Secret: $MONA_SECRET" \
  -H 'Content-Type: application/json' \
  -d '{"ownerNumber":"123456789","ownerType":"ORG","merchantId":"MC00012345","terminalId":"TM0001","orderId":"DH10234","virtualAccountPrefix":"MONA","beneficiaryName":"CONG TY ABC","amount":2500000,"description":"Thanh toan DH10234"}'
```

**PHP**

```php
<?php
$ch = curl_init('https://api.monapay.vn/api/v1/acb/qr-payment/generate');
curl_setopt_array($ch, [
    CURLOPT_POST => true, CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 30,
    CURLOPT_HTTPHEADER => ['Content-Type: application/json', 'Authorization: Bearer ' . getenv('MONA_TOKEN'), 'X-Client-Secret: ' . getenv('MONA_SECRET')],
    CURLOPT_POSTFIELDS => json_encode([
        'ownerNumber' => '123456789', 'ownerType' => 'ORG', 'merchantId' => getenv('ACB_MERCHANT_ID'), 'terminalId' => getenv('ACB_TERMINAL_ID'),
        'orderId' => $order->code, 'virtualAccountPrefix' => 'MONA', 'beneficiaryName' => 'CONG TY ABC',
        'amount' => (int) $order->total, 'description' => 'Thanh toan ' . $order->code,
    ]),
]);
$res = json_decode(curl_exec($ch), true);
curl_close($ch);
if (empty($res['success'])) throw new RuntimeException($res['message'] ?? 'Tạo QR thất bại');

$qrString = $res['data']['qr_data_url']; // đưa vào thư viện vẽ QR
$qrId     = $res['data']['id'];          // lưu để hủy nếu đơn bị huỷ
```

**Node**

```js
import QRCode from 'qrcode'; // npm i qrcode

const r = await fetch('https://api.monapay.vn/api/v1/acb/qr-payment/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.MONA_TOKEN}`, 'X-Client-Secret': process.env.MONA_SECRET },
  body: JSON.stringify({
    ownerNumber: '123456789', ownerType: 'ORG', merchantId: process.env.ACB_MERCHANT_ID, terminalId: process.env.ACB_TERMINAL_ID,
    orderId: order.code, virtualAccountPrefix: 'MONA', beneficiaryName: 'CONG TY ABC', amount: order.total, description: `Thanh toan ${order.code}`,
  }),
});
const { success, data, message } = await r.json();
if (!success) throw new Error(message);
const pngDataUrl = await QRCode.toDataURL(data.qr_data_url); // <img src=...>
```

## DELETE /api/v1/acb/qr-payment/{qr_code_id}/cancellation

Hủy QR đã tạo nhưng khách chưa thanh toán (đơn bị hủy, đổi số tiền). Cần Bearer + `X-Client-Secret`. Body bắt buộc gửi lại thông tin khớp với lúc tạo:

| Trường | Kiểu | Bắt buộc |
|---|---|---|
| `ownerNumber` | string | có |
| `ownerType` | `PER` / `ORG` | có |
| `orderId` | string | có |
| `amount` | integer | có |
| `traceNumber` | string | không |

```bash
curl -X DELETE https://api.monapay.vn/api/v1/acb/qr-payment/0190c0d1-.../cancellation \
  -H "Authorization: Bearer $MONA_TOKEN" -H "X-Client-Secret: $MONA_SECRET" \
  -H 'Content-Type: application/json' \
  -d '{"ownerNumber":"123456789","ownerType":"ORG","orderId":"DH10234","amount":2500000}'
```

Response: `{"success": true, "message": "Success", "data": null}`.

## Khách quét xong thì sao

ACB ghi nhận tiền vào, báo cho MONA Pay, MONA Pay bắn webhook tới URL anh chị cấu hình với payload y như giao dịch VA:

```json
{"amount":2500000,"description":"Thanh toan DH10234","transfer_date":"10:45:12 28/08/2026","transaction_code":"FT26240001234","account_number":"MONA0000010234","bank_name":"ACB","type":"income"}
```

Khớp đơn bằng `account_number` (số VA gắn với QR) hoặc `description` chứa `orderId`. Nhớ so `amount` với số tiền đơn trước khi đổi trạng thái đã thanh toán.

## Lỗi thường gặp

| Tình huống | Nguyên nhân | Cách xử lý |
|---|---|---|
| 400 khi tạo | Tài khoản chưa đăng ký VA với đầu số này, hoặc `merchantId`/`terminalId` sai | Kiểm tra ở dashboard mục Tạo QR, tạo thử 1 mã trên web trước |
| 422 | Thiếu trường bắt buộc, `amount` vượt 1.000.000.000, `virtualAccountPrefix` dài quá 10 ký tự | Sửa theo `detail[]` |
| Khách quét được nhưng không thấy webhook | VA chưa đăng ký nhận thông báo (bước 3, 4 khi tạo VA) | Xem [Tài khoản ảo](/docs/api/tai-khoan-ao-va) |
| QR hết hạn trên app ngân hàng | Mỗi QR động có thời hạn theo quy định ACB | Tạo QR mới với cùng `orderId` sau khi hủy mã cũ |
