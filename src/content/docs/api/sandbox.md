---
title: "Sandbox MONA Pay: thử giao dịch và checkout không tốn tiền"
description: "Tạo giao dịch tiền vào giả, thử webhook, Telegram, email và hosted checkout trước khi nối ngân hàng; có sẵn VA sandbox SBX, không gửi tiền thật và không tính hạn mức."
updated: 03/09/2026
---

Sandbox cho anh chị chạy trọn luồng xác nhận thanh toán mà không chuyển tiền thật. Gọi `POST /api/v1/sandbox/transactions`, MONA Pay ghi một giao dịch giả rồi phát qua webhook, Telegram, email và bộ khớp hosted checkout giống luồng thật.

> Chưa nối ngân hàng vẫn thử được. MONA Pay tự tạo một VA sandbox riêng cho tài khoản, có số bắt đầu bằng `SBX…`. Nếu anh chị đã có VA thật, có thể truyền số VA đó; giao dịch vẫn mang cờ `is_sandbox: true` và không đụng tới tiền trong ngân hàng.

## POST /api/v1/sandbox/transactions

Request cần Bearer token và `X-Client-Secret`:

```bash
curl -X POST https://api.monapay.vn/api/v1/sandbox/transactions \
  -H "Authorization: Bearer $MONA_TOKEN" \
  -H "X-Client-Secret: $MONA_SECRET" \
  -H 'Content-Type: application/json' \
  -d '{"amount":250000,"description":"Thanh toan DH10234"}'
```

Không truyền số tài khoản thì MONA Pay tự cấp hoặc dùng lại VA sandbox `SBX…` của anh chị. Muốn thử trên một VA thật đã nối, truyền thêm `virtual_account_number`:

```json
{
  "virtual_account_number": "LOCHOA000123456",
  "amount": 250000,
  "description": "Thanh toan DH10234",
  "transaction_code": "SANDBOX-DH10234-01"
}
```

| Trường | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| `virtual_account_number` | string, tối đa 50 ký tự | không | Số VA thật hoặc VA `SBX…`; bỏ trống để MONA Pay tự cấp VA sandbox |
| `account_number` | string, tối đa 50 ký tự | không | Tài khoản thật đã nối; chỉ cần một trong hai trường số tài khoản nếu muốn chỉ định nơi nhận |
| `amount` | integer | có | Số tiền giả, lớn hơn 0 và tối đa 1.000.000.000 VND |
| `description` | string, 1–255 ký tự | có | Nội dung chuyển khoản giả; nên đặt mã đơn để kiểm logic khớp |
| `transaction_code` | string, 1–100 ký tự | không | Mã tự đặt để thử chống trùng; bỏ trống thì MONA Pay sinh mã `SANDBOX-…` |

Response 200:

```json
{
  "success": true,
  "message": "Sandbox transaction accepted",
  "data": {
    "transaction_code": "SANDBOX-DH10234-01",
    "virtual_account_number": "SBX000123456",
    "account_number": "SBX000123456",
    "amount": 250000,
    "is_sandbox": true
  }
}
```

Giao dịch đi qua cùng bộ xử lý và kênh thông báo như giao dịch thật. Khi đối soát, dùng `transaction_code` làm khoá chống trùng và nhận biết môi trường thử bằng `is_sandbox`.

## Chạy webhook trên localhost
Webhook cần một URL HTTPS công khai, MONA Pay không thể gọi trực tiếp vào `localhost`.
```bash
cloudflared tunnel --url http://localhost:4400
```
Dán URL HTTPS do tunnel cấp vào `webhook_url`; anh chị cũng có thể dùng ngrok.
Nếu chưa có URL công khai, hãy hỏi lại `GET /api/v1/checkouts/{checkout_id}` mỗi vài giây trong lúc thử.
Trang [Địa chỉ IP](/docs/dia-chi-ip) chỉ áp dụng khi đưa hệ thống lên production.

## Thử hosted checkout

Khi tạo checkout, thêm `"sandbox": true` vào body. Phiên thử dùng VA `SBX…`, trả `checkout_url`, dữ liệu QR hợp lệ để hiển thị và trường `sandbox: true`; trang thanh toán có dải **PHIÊN THỬ, không chuyển tiền thật**.

```bash
curl -X POST https://api.monapay.vn/api/v1/checkouts \
  -H "Authorization: Bearer $MONA_TOKEN" \
  -H "X-Client-Secret: $MONA_SECRET" \
  -H "Idempotency-Key: sandbox-DH10234" \
  -H 'Content-Type: application/json' \
  -d '{"amount":250000,"order_code":"DH10234","return_url":"https://shop.vn/payment/return","sandbox":true}'
```

Lấy `data.bank.account_number` hoặc số VA trong response checkout, rồi gọi `/sandbox/transactions` với `virtual_account_number` đó. Khi tổng tiền sandbox đủ `amount`, phiên chuyển sang `paid` và phát `CHECKOUT_PAID`. Chi tiết trường checkout ở [Trang thanh toán](/docs/api/trang-thanh-toan).

## Ba ca nên chạy trước khi lên thật

1. **Đủ tiền:** tạo checkout 250.000đ, bắn một giao dịch sandbox 250.000đ. Chờ `CHECKOUT_PAID`, kiểm chữ ký, trạng thái `paid` và việc xử lý đơn chỉ chạy một lần.
2. **Thiếu tiền:** tạo checkout 250.000đ, bắn 200.000đ. Phiên phải giữ `pending` và ghi `partial_amount`; chưa được giao hàng.
3. **Gửi lại cùng mã giao dịch:** gửi lại đúng `transaction_code`. MONA Pay trả 200 giống lần đầu và không cộng dồn, vì vậy `paid_amount` giữ nguyên. Muốn tự động kiểm ca này, gọi `GET /api/v1/checkouts/{checkout_id}` trước và sau, rồi so `paid_amount` và `partial_amount`.

## Giới hạn của sandbox

- Không có tiền thật được gửi hoặc nhận; đừng quét QR sandbox để chuyển khoản.
- Giao dịch sandbox không tính vào hạn mức giao dịch của gói.
- VA `SBX…`, QR và checkout sandbox chỉ dùng để thử; không đưa cho khách thanh toán thật.
- Sandbox kiểm luồng MONA Pay và code của anh chị, không thay cho lần kiểm tra cuối bằng một khoản chuyển thật sau khi nối ngân hàng.

Xem thêm [định dạng payload webhook](/docs/webhooks/dinh-dang-payload), [bảo mật webhook](/docs/webhooks/bao-mat) và [đối soát giao dịch](/docs/api/giao-dich).
