---
title: "API giao dịch: tra cứu tiền vào theo tài khoản ảo"
description: "Truy vấn giao dịch theo số VA (phân trang, tối đa 100/trang), cấu trúc bản ghi, đối soát bằng transaction_code và endpoint gửi lại thông báo cho 1 giao dịch."
updated: 28/08/2026
---

Mọi giao dịch ACB báo về đều được MONA Pay lưu lại, kể cả khi webhook tới server anh chị thất bại. Truy vấn bằng `GET /api/v1/acb/virtual-account/transactions?virtual_account_number=<số VA>&page=1&limit=100` (Bearer token, `limit` tối đa 100). Mỗi bản ghi có `transaction_code` là mã tham chiếu ổn định của ngân hàng, dùng làm khoá chống trùng khi đối soát. Giao dịch nào lỡ không tới được server thì gọi endpoint retry để MONA Pay gửi lại webhook hoặc tin Telegram cho đúng giao dịch đó.

## GET /api/v1/acb/virtual-account/transactions

Cần Bearer. Hệ thống tìm VA theo số, kiểm tra VA thuộc tài khoản của anh chị rồi mới trả giao dịch.

| Tham số (query) | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| `virtual_account_number` | string | có | Số VA, ví dụ `MONA0000010234` |
| `page` | integer ≥1 | không | Mặc định 1 |
| `limit` | integer 1-100 | không | Mặc định 10 |

```bash
curl "https://api.monapay.vn/api/v1/acb/virtual-account/transactions?virtual_account_number=MONA0000010234&page=1&limit=100" \
  -H "Authorization: Bearer $MONA_TOKEN"
```

Response 200:

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "data": [
      {
        "id": "0190d0e1-...",
        "acb_callback_request_id": "0190d0e0-...",
        "transaction_status": "SUCCESS",
        "transaction_channel": "IBFT",
        "transaction_date": "2026-08-28T10:45:12",
        "effective_date": "2026-08-28T10:45:12",
        "debit_or_credit": "credit",
        "amount": 2500000,
        "transaction_content": "Thanh toan DH10234",
        "transaction_code": "FT26240001234",
        "account_number": "123456789",
        "va_prefix_cd": "MONA",
        "va_nbr": "MONA0000010234",
        "attributes": {
          "remitter_name": "NGUYEN VAN A",
          "remitter_account_number": "9876543210",
          "issuer_bank_name": "Vietcombank",
          "reference_number": "FT26240001234"
        }
      }
    ],
    "current_page": 1,
    "per_page": 100,
    "total": 1,
    "last_page": 1,
    "start": 1,
    "end": 1,
    "has_next": false,
    "has_prev": false
  }
}
```

### Ý nghĩa từng trường

| Trường | Ý nghĩa |
|---|---|
| `id` | ID giao dịch trong MONA Pay, dùng cho endpoint retry |
| `transaction_status` | Trạng thái ACB trả về (`SUCCESS` là tiền đã vào) |
| `transaction_channel` | Kênh giao dịch theo ACB (chuyển khoản nhanh, QR...) |
| `transaction_date` | Thời điểm giao dịch, giờ Việt Nam |
| `effective_date` | Ngày hiệu lực ghi sổ |
| `debit_or_credit` | `credit` = tiền vào, `debit` = tiền ra. Webhook hiện chỉ bắn cho tiền vào |
| `amount` | Số tiền VND, số nguyên |
| `transaction_content` | Nội dung chuyển khoản khách gõ (hoặc QR điền sẵn) |
| `transaction_code` | Mã tham chiếu ngân hàng, ổn định qua mọi lần gửi lại, khoá chống trùng |
| `account_number` | Số tài khoản ACB thật nhận tiền |
| `va_prefix_cd`, `va_nbr` | Đầu số và số VA khớp giao dịch, `null` nếu tiền vào thẳng tài khoản chính |
| `attributes` | Thông tin phụ ACB gửi kèm: tên và số tài khoản người chuyển, ngân hàng chuyển, số tham chiếu, các trường `custom1`..`custom10` nếu có |

Ngoài ra, cùng bản ghi này là thứ webhook gửi sang anh chị dưới dạng rút gọn (xem [Định dạng payload](/docs/webhooks/dinh-dang-payload)).

## Đối soát bằng API

Hiện chưa có tham số `since_id`; đối soát theo cách sau (cron mỗi 15-30 phút hoặc cuối ngày):

1. Với mỗi VA đang dùng, gọi trang 1 với `limit=100`, đọc tiếp khi `has_next` là `true`.
2. Với mỗi bản ghi, tra `transaction_code` trong bảng giao dịch của anh chị. Có rồi thì bỏ qua, chưa có thì ghi thêm và xử lý đơn như khi nhận webhook.
3. Dừng khi gặp `transaction_code` đã có và `transaction_date` cũ hơn mốc đối soát lần trước (danh sách sắp xếp mới trước).

Chi tiết và code mẫu ở [Đối soát giao dịch](/docs/webhooks/doi-soat).

**PHP: đọc hết các trang**

```php
<?php
function monaGet(string $url): array {
    $ctx = stream_context_create(['http' => ['header' => 'Authorization: Bearer ' . getenv('MONA_TOKEN') . "\r\n", 'ignore_errors' => true]]);
    return json_decode(file_get_contents($url, false, $ctx), true) ?? [];
}
$va = 'MONA0000010234'; $page = 1;
do {
    $res = monaGet("https://api.monapay.vn/api/v1/acb/virtual-account/transactions?virtual_account_number=$va&page=$page&limit=100");
    if (empty($res['success'])) throw new RuntimeException($res['message'] ?? 'Lỗi truy vấn');
    foreach ($res['data']['data'] as $tx) {
        if ($tx['debit_or_credit'] !== 'credit') continue;
        // INSERT ... ON DUPLICATE KEY (UNIQUE transaction_code) → chỉ ghi bản chưa có
        ghiNhanGiaoDich($tx['transaction_code'], $tx['amount'], $tx['transaction_content'], $tx['transaction_date']);
    }
    $page++;
} while (!empty($res['data']['has_next']));
```

**Node**

```js
async function* monaTransactions(va) {
  for (let page = 1; ; page++) {
    const r = await fetch(`https://api.monapay.vn/api/v1/acb/virtual-account/transactions?virtual_account_number=${va}&page=${page}&limit=100`, {
      headers: { Authorization: `Bearer ${process.env.MONA_TOKEN}` },
    });
    const j = await r.json();
    if (!j.success) throw new Error(j.message);
    yield* j.data.data;
    if (!j.data.has_next) break;
  }
}
for await (const tx of monaTransactions('MONA0000010234')) {
  if (tx.debit_or_credit !== 'credit') continue;
  await db.upsertByTransactionCode(tx.transaction_code, tx); // UNIQUE(transaction_code)
}
```

## POST /api/v1/acb/virtual-account/transactions/{transaction_id}/retry

Gửi lại thông báo cho một giao dịch cụ thể (server anh chị lúc đó bị lỗi, hoặc cấu hình webhook sai rồi sửa lại). Cần Bearer + `X-Client-Secret`. Gửi lại tự động theo lịch đang triển khai, hiện là thao tác chủ động này hoặc nút "Gửi lại" trong dashboard.

| Trường | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| `target_type` | `WEBHOOK` / `TELEGRAM` | có | Kênh cần gửi lại |
| `target_id` | uuid | không | ID cấu hình webhook hoặc Telegram cụ thể. Bỏ trống = gửi lại theo mọi cấu hình đang bật khớp giao dịch |

```bash
curl -X POST https://api.monapay.vn/api/v1/acb/virtual-account/transactions/0190d0e1-.../retry \
  -H "Authorization: Bearer $MONA_TOKEN" -H "X-Client-Secret: $MONA_SECRET" \
  -H 'Content-Type: application/json' -d '{"target_type":"WEBHOOK"}'
```

Payload gửi lại y hệt lần đầu, cùng `transaction_code`, nên server anh chị phải chống trùng (xem [Gửi lại và xử lý lỗi](/docs/webhooks/gui-lai-va-xu-ly-loi)).

## Lỗi thường gặp

| HTTP | Nguyên nhân | Cách xử lý |
|---|---|---|
| 400 | Số VA không tồn tại hoặc không thuộc tài khoản | Lấy đúng số VA từ `GET /api/v1/acb/{bank_account_id}/virtual-account/retrieve` |
| 401 | Token hết hạn | Login lại |
| 422 | `limit` > 100 hoặc thiếu `virtual_account_number` | Sửa tham số |
| 404 (retry) | `transaction_id` không tồn tại | Lấy `id` từ danh sách giao dịch |
