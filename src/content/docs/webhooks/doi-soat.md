---
title: Đối soát giao dịch bằng API MONA Pay
description: Kéo danh sách giao dịch theo trang (tối đa 100 mỗi trang) bằng API, so với sổ của anh chị bằng transaction_code, lịch cron gợi ý mỗi giờ hoặc mỗi ngày.
updated: 28/08/2026
---

Đối soát là bước so danh sách giao dịch MONA Pay ghi nhận với bảng giao dịch trong hệ thống của anh chị, để bổ sung khoản nào webhook chưa tới (máy chủ bảo trì, mất mạng, lỗi code). Anh chị gọi `GET /api/v1/acb/virtual-account/transactions` theo trang, mỗi trang tối đa 100 giao dịch, và so bằng `transaction_code`. Nên chạy mỗi giờ hoặc ít nhất mỗi ngày.

## Vì sao cần đối soát dù đã có webhook

Webhook là kênh thời gian thực nhưng phụ thuộc máy chủ của anh chị đang sống lúc tiền vào. Một lần deploy 2 phút, một lần hết hạn chứng chỉ SSL, một lần database khoá là có khoản bị lỡ. Hiện MONA Pay gửi lại thủ công (gửi lại tự động đang triển khai, xem [Gửi lại và xử lý lỗi](/docs/webhooks/gui-lai-va-xu-ly-loi)), nên đối soát định kỳ là lưới đỡ cần có ngay từ ngày đầu.

## API danh sách giao dịch

```text
GET https://api.monapay.vn/api/v1/acb/virtual-account/transactions
```

| Tham số query | Bắt buộc | Ý nghĩa |
|---|---|---|
| `virtual_account_number` | có | Số VA cần lấy giao dịch |
| `page` | không | Trang, bắt đầu từ 1 |
| `limit` | không | Số giao dịch mỗi trang, tối đa 100 |

Request là GET nên chỉ cần `Authorization: Bearer <access_token>`, không cần `X-Client-Secret`.

```bash
curl "https://api.monapay.vn/api/v1/acb/virtual-account/transactions?virtual_account_number=1234567890&page=1&limit=100" \
  -H "Authorization: Bearer $TOKEN"
```

Response theo khung chung `{"success": true, "message": "...", "data": {...}}`, trong đó `data` là khối phân trang (kiểm code BE 28/08/2026): `data.data` là mảng giao dịch, kèm `current_page`, `per_page`, `total`, `last_page`. Mỗi giao dịch trong `data.data` mang cùng thông tin với payload webhook: mã giao dịch, số tiền, thời gian, nội dung, số tài khoản nhận. Dừng vòng lặp khi `current_page >= last_page`. Chi tiết trường xem `https://monapay.vn/openapi.json` (mục `/api/v1/acb/virtual-account/transactions`).

Hiện API chưa có tham số `since_id` hay lọc theo khoảng ngày. Cách làm việc là kéo theo trang từ trang 1, giao dịch mới nhất ở đầu, dừng khi gặp `transaction_code` đã có trong bảng của anh chị và trang đó không còn mã nào mới.

## Thuật toán đối soát

1. Với mỗi VA đang dùng, gọi trang 1 với `limit=100`.
2. Với mỗi giao dịch, kiểm `transaction_code` đã có trong bảng của anh chị chưa.
3. Chưa có: chèn vào bảng và chạy đúng logic xử lý như khi nhận webhook (đổi trạng thái đơn, gửi email...). Nhớ đây là cùng một hàm xử lý, để đơn được cập nhật y hệt dù tới bằng đường nào.
4. Nếu cả trang đều đã có, dừng. Nếu còn mã mới, gọi trang tiếp theo.
5. Ghi lại thời điểm chạy và số giao dịch bổ sung, để anh chị biết webhook có đang hụt không.

```bash
# Đối soát nhanh bằng shell: liệt kê transaction_code của trang 1 để so bằng mắt
curl -s "https://api.monapay.vn/api/v1/acb/virtual-account/transactions?virtual_account_number=1234567890&page=1&limit=100" \
  -H "Authorization: Bearer $TOKEN" | python3 -c '
import sys, json
d = json.load(sys.stdin)["data"]
items = d if isinstance(d, list) else d.get("data") or []   # data.data = mảng giao dịch
for t in items:
    print(t.get("transaction_code"), t.get("amount"), t.get("transaction_date") or t.get("transfer_date"))
'
```

```php
<?php
// doi-soat.php: chạy bằng cron mỗi giờ. Bổ sung giao dịch webhook chưa tới.
$token = getenv('MONA_ACCESS_TOKEN');
$va    = '1234567890';
$pdo   = new PDO(getenv('DB_DSN'), getenv('DB_USER'), getenv('DB_PASS'));
$check = $pdo->prepare('SELECT 1 FROM giao_dich WHERE transaction_code = ?');

for ($page = 1; $page <= 50; $page++) {
    $url = "https://api.monapay.vn/api/v1/acb/virtual-account/transactions?virtual_account_number=$va&page=$page&limit=100";
    $ch  = curl_init($url);
    curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true, CURLOPT_HTTPHEADER => ["Authorization: Bearer $token"]]);
    $res = json_decode(curl_exec($ch), true);
    curl_close($ch);

    $items = $res['data']['data'] ?? [];   // data.data = mảng giao dịch, kèm current_page/last_page
    if (!$items) break;

    $moi = 0;
    foreach ($items as $t) {
        $check->execute([$t['transaction_code']]);
        if ($check->fetch()) continue;      // đã có, webhook đã tới
        xu_ly_giao_dich($t);                // cùng hàm xử lý với webhook, chống trùng bằng UNIQUE
        $moi++;
    }
    if ($moi === 0) break;                  // cả trang đều đã có, dừng
}
```

```js
// doi-soat.js: chạy bằng cron mỗi giờ (node doi-soat.js)
const TOKEN = process.env.MONA_ACCESS_TOKEN;
const VA = '1234567890';

async function doiSoat() {
  for (let page = 1; page <= 50; page++) {
    const url = `https://api.monapay.vn/api/v1/acb/virtual-account/transactions?virtual_account_number=${VA}&page=${page}&limit=100`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } });
    const body = await res.json();
    let items = body.data?.data ?? [];   // data.data = mảng giao dịch, kèm current_page/last_page
    if (items.length === 0) break;

    let moi = 0;
    for (const t of items) {
      const daCo = await db.exists('giao_dich', { transaction_code: t.transaction_code });
      if (daCo) continue;
      await xuLyGiaoDich(t); // cùng hàm xử lý với webhook
      moi++;
    }
    if (moi === 0) break;
  }
}

doiSoat().catch((e) => { console.error(e); process.exit(1); });
```

Lưu ý `access_token` có hạn dùng (`expires_in` khi đăng nhập). Script cron nên đăng nhập lại khi nhận 401, xem [Xác thực](/docs/api/xac-thuc).

## Lịch chạy gợi ý

| Loại hệ thống | Tần suất | Lý do |
|---|---|---|
| Web bán hàng giao ngay, ví bán vé, khoá học mở tức thì | Mỗi 15 phút | Khách chờ ngay sau khi chuyển |
| Phần mềm quản lý, thu học phí, thu phí dịch vụ | Mỗi giờ | Đủ nhanh, ít tốn tài nguyên |
| Kế toán cuối ngày | 23:30 mỗi ngày | Chốt sổ, in báo cáo |

Kết hợp cả hai: mỗi giờ chạy đối soát nhanh trang 1, cuối ngày chạy đủ mọi trang.

## Đối soát bằng dashboard

Không cần code, anh chị vào dashboard mục Giao dịch, lọc theo VA và khoảng ngày, xuất CSV rồi so với sổ bằng Excel: cột `transaction_code` là khoá, dùng VLOOKUP hoặc đối chiếu bằng Power Query. Cách này hợp với kế toán chốt sổ tuần hoặc tháng.

## Lỗi thường gặp

**Gọi API trả 401.** Token hết hạn. Đăng nhập lại lấy token mới.

**Trang 1 trống dù có giao dịch.** Sai `virtual_account_number`, hoặc giao dịch vào tài khoản chính chứ không vào VA đó. Kiểm số VA trong dashboard mục Ngân hàng & VA.

**Đối soát chèn trùng giao dịch.** Bảng chưa có UNIQUE trên `transaction_code`, hoặc hàm xử lý webhook và hàm đối soát ghi vào hai bảng khác nhau. Dùng chung một hàm và một bảng.

**Script chạy quá lâu.** Đang kéo hết mọi trang mỗi lần. Dừng ngay khi gặp trang không còn mã mới, như thuật toán trên.
