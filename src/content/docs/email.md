---
title: "Thông báo tiền vào qua email: cấu hình, xác minh người nhận, log"
description: "Cấu hình MONA Pay gửi email khi có tiền vào, xác minh người nhận bằng mã 6 số, gửi thử, đọc log và xử lý địa chỉ bị suppression qua API, MCP hoặc dashboard."
updated: 03/09/2026
---

MONA Pay gửi email ngay khi tài khoản hoặc VA của anh chị có tiền vào, webhook gửi lỗi hoặc VA mới được tạo. Mỗi cấu hình nhận tối đa 10 địa chỉ và chỉ hoạt động sau khi mọi người nhận nhập đúng mã xác minh 6 số. Anh chị có thể tạo qua API, MCP hoặc dashboard, gửi thử rồi đọc log chỉ chứa metadata, không lưu nội dung mail.

## Chọn cách cấu hình

Nên đi theo đúng thứ tự dưới đây nếu anh chị đang tích hợp bằng code hoặc AI agent.

1. **API:** đầy đủ nhất cho hệ thống cần tự tạo cấu hình, xác minh, gửi thử và đọc log.
2. **MCP cho Claude Code hoặc Codex:** agent gọi tool MONA Pay, dừng lại hỏi mã 6 số trong hộp thư rồi làm tiếp.
3. **Dashboard:** vào `my.monapay.vn` khi cần thao tác thủ công, không viết code.

Một client tạo được nhiều cấu hình. Mỗi cấu hình có tên, tối đa 10 người nhận, danh sách sự kiện và có thể giới hạn vào một `virtual_account_id`. Địa chỉ đã xác minh một lần được dùng lại cho cấu hình khác của cùng client.

## 1. Cấu hình qua API

Base URL là `https://api.monapay.vn/api/v1`. Mọi request cần `Authorization: Bearer <token>`. Request ghi bằng POST, PUT hoặc DELETE cần thêm `X-Client-Secret`; POST hỗ trợ `Idempotency-Key` trong 24 giờ.

| Method | Endpoint | Body hoặc query | Kết quả |
|---|---|---|---|
| GET | `/api/v1/email-configs` | Không có | Danh sách `EmailConfig` |
| POST | `/api/v1/email-configs` | `{name, recipients, events?, virtual_account_id?}` | Tạo cấu hình, tự gửi mã cho địa chỉ chưa xác minh |
| GET | `/api/v1/email-configs/{id}` | Không có | Một `EmailConfig` |
| PUT | `/api/v1/email-configs/{id}` | `{name?, recipients?, events?, virtual_account_id?, is_active?}` | Sửa cấu hình; bật khi còn người nhận chưa xác minh trả 422 |
| DELETE | `/api/v1/email-configs/{id}` | Không có | Xoá cấu hình |
| POST | `/api/v1/email-configs/{id}/verify` | `{email, code}` | Xác minh địa chỉ; tự bật khi tất cả đã xác minh |
| POST | `/api/v1/email-configs/{id}/resend-verification` | `{email}` | Gửi lại mã xác minh |
| POST | `/api/v1/email-configs/{id}/test` | `{}` | Gửi mail mẫu tới người nhận đã xác minh |
| GET | `/api/v1/email-logs` | `config_id?`, `status?`, `event_type?`, `from_date?`, `to_date?`, `page?`, `limit?` | Log phân trang |
| GET | `/api/v1/email-logs/stats` | `from_date?`, `to_date?` | Tổng số, tỷ lệ thành công, p95 và nhãn lỗi |
| GET | `/api/v1/email-suppressions` | Không có | Danh sách địa chỉ đang bị chặn |
| DELETE | `/api/v1/email-suppressions/{email}` | Không có | Gỡ chặn địa chỉ sau khi đã sửa nguyên nhân |

### cURL: tạo → xác minh → gửi thử → đọc log

```bash
BASE=https://api.monapay.vn/api/v1
TOKEN="$MONA_TOKEN"
SECRET="$MONA_SECRET"

# 1. Tạo cấu hình; lưu id và xem pending_verification trong response
CONFIG_ID=$(curl -s -X POST "$BASE/email-configs" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Client-Secret: $SECRET" \
  -H "Idempotency-Key: email-ke-toan-20260903" \
  -H 'Content-Type: application/json' \
  -d '{"name":"Ke toan","recipients":["ketoan@example.com"],"events":["TRANSACTION_IN","WEBHOOK_FAILED"]}' \
  | jq -r '.data.id')

# 2. Hỏi người nhận mã 6 số trong hộp thư, không tự đoán mã
read -r -p 'Ma xac minh email: ' VERIFY_CODE
curl -s -X POST "$BASE/email-configs/$CONFIG_ID/verify" \
  -H "Authorization: Bearer $TOKEN" -H "X-Client-Secret: $SECRET" \
  -H 'Content-Type: application/json' \
  -d "{\"email\":\"ketoan@example.com\",\"code\":\"$VERIFY_CODE\"}"

# 3. Gửi mail mẫu TRANSACTION_IN
curl -s -X POST "$BASE/email-configs/$CONFIG_ID/test" \
  -H "Authorization: Bearer $TOKEN" -H "X-Client-Secret: $SECRET" \
  -H 'Content-Type: application/json' -d '{}'

# 4. Đọc log mới nhất của cấu hình
curl -s "$BASE/email-logs?config_id=$CONFIG_ID&page=1&limit=20" \
  -H "Authorization: Bearer $TOKEN" | jq '.data.items'
```

Mã xác minh hết hạn sau 15 phút. Nhập sai tối đa 5 lần thì phải gọi `POST /email-configs/{id}/resend-verification` để lấy mã mới.

### Node.js

```js
const base = 'https://api.monapay.vn/api/v1';
const writeHeaders = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${process.env.MONA_TOKEN}`,
  'X-Client-Secret': process.env.MONA_SECRET,
};

async function request(path, options = {}) {
  const response = await fetch(base + path, options);
  const body = await response.json();
  if (!response.ok || !body.success) throw new Error(`${body.detail || response.status}: ${body.message}`);
  return body.data;
}

const config = await request('/email-configs', {
  method: 'POST',
  headers: { ...writeHeaders, 'Idempotency-Key': crypto.randomUUID() },
  body: JSON.stringify({ name: 'Ke toan', recipients: ['ketoan@example.com'], events: ['TRANSACTION_IN'] }),
});

const code = process.env.MONA_EMAIL_VERIFY_CODE; // hỏi người dùng rồi truyền qua biến môi trường
await request(`/email-configs/${config.id}/verify`, {
  method: 'POST', headers: writeHeaders,
  body: JSON.stringify({ email: 'ketoan@example.com', code }),
});
await request(`/email-configs/${config.id}/test`, { method: 'POST', headers: writeHeaders, body: '{}' });
const logs = await request(`/email-logs?config_id=${config.id}&page=1&limit=20`, {
  headers: { Authorization: `Bearer ${process.env.MONA_TOKEN}` },
});
console.log(logs.items);
```

### Python

```python
import os
import uuid
import requests

base = "https://api.monapay.vn/api/v1"
token = os.environ["MONA_TOKEN"]
headers = {
    "Authorization": f"Bearer {token}",
    "X-Client-Secret": os.environ["MONA_SECRET"],
    "Content-Type": "application/json",
}

created = requests.post(
    f"{base}/email-configs",
    headers={**headers, "Idempotency-Key": str(uuid.uuid4())},
    json={"name": "Ke toan", "recipients": ["ketoan@example.com"], "events": ["TRANSACTION_IN"]},
    timeout=10,
)
created.raise_for_status()
config = created.json()["data"]

code = os.environ["MONA_EMAIL_VERIFY_CODE"]  # hỏi người dùng, không tự đoán
verified = requests.post(
    f"{base}/email-configs/{config['id']}/verify",
    headers=headers,
    json={"email": "ketoan@example.com", "code": code},
    timeout=10,
)
verified.raise_for_status()
requests.post(f"{base}/email-configs/{config['id']}/test", headers=headers, json={}, timeout=10).raise_for_status()
logs = requests.get(
    f"{base}/email-logs",
    headers={"Authorization": f"Bearer {token}"},
    params={"config_id": config["id"], "page": 1, "limit": 20},
    timeout=10,
)
logs.raise_for_status()
print(logs.json()["data"]["items"])
```

## 2. Cấu hình qua MCP cho Claude Code hoặc Codex

Luồng zero-dashboard dành cho agent:

1. Gọi `monapay_create_email_config` với `name`, `recipients`, `events` và `virtual_account_id` nếu cần.
2. Đọc `pending_verification`, báo người dùng mở từng hộp thư và hỏi mã 6 số. Agent phải dừng chờ, không tự đoán.
3. Gọi `monapay_verify_email` cho từng địa chỉ và mã tương ứng.
4. Gọi `monapay_test_email` sau khi cấu hình tự chuyển sang `is_active: true`.
5. Gọi `monapay_email_logs`, kiểm tra log có `status: "sent"`.

Ví dụ prompt giao cho agent:

```text
Tạo cấu hình email tên "Kế toán" cho ketoan@example.com, nhận TRANSACTION_IN và WEBHOOK_FAILED.
Sau khi tạo, hỏi tôi mã xác minh 6 số trong hộp thư rồi mới gọi monapay_verify_email.
Xác minh xong gọi monapay_test_email và monapay_email_logs; chỉ kết luận hoàn tất khi log có status sent.
```

## 3. Cấu hình trong dashboard

Vào `my.monapay.vn` → **Email** → **Tạo cấu hình**, đặt tên, thêm tối đa 10 địa chỉ, chọn sự kiện và VA nếu cần. Mỗi người nhận mở mail lấy mã 6 số rồi nhập vào dashboard. Khi mọi địa chỉ đã xác minh, MONA Pay tự bật cấu hình; bấm **Gửi thử** và mở mục **Log email** để kiểm tra.

## Sự kiện có thể nhận

| Sự kiện | Khi nào gửi | Ghi chú |
|---|---|---|
| `TRANSACTION_IN` | Có tiền vào tài khoản hoặc VA phù hợp | Bắt buộc có, là sự kiện mặc định |
| `WEBHOOK_FAILED` | Một lần gửi webhook thất bại sau retry | Giúp đội vận hành xử lý nhanh |
| `VA_CREATED` | Một VA mới được tạo xong | Có thể giới hạn cấu hình theo một VA |

## Mẫu email tiền vào

Chủ đề mẫu:

```text
Có tiền vào +320.000đ · MONA0000010234 · DH10234 NGUYEN VAN A
```

Nội dung hiển thị số tiền, VA hoặc số tài khoản, nội dung chuyển khoản, thời gian, mã giao dịch, ngân hàng và nút **Xem trên dashboard**. Cuối mail ghi rõ mail được gửi tự động từ MONA Pay, The MONA Group với 14.000+ dự án, cùng nơi tắt hoặc đổi người nhận.

## Log, suppression và bounce

`GET /email-logs` trả người nhận, chủ đề, `message_id`, trạng thái, mã SMTP, thời gian, nhãn lỗi và số lần thử. MONA Pay **không lưu nội dung email**. Trạng thái gồm `sent`, `failed`, `suppressed`, `skipped`; nhãn lỗi gồm `OK`, `SMTP_4XX`, `SMTP_5XX`, `TIMEOUT`, `CONNECTION`, `SUPPRESSED`, `RATE_LIMITED`, `TEMPLATE`, `UNVERIFIED`.

Bounce cứng với mã 5.x.x đưa địa chỉ vào suppression với lý do `hard_bounce`; khiếu nại hoặc thao tác tắt tay cũng có thể chặn địa chỉ. MONA Pay ngừng gửi và ghi log `SUPPRESSED`. Sau khi sửa địa chỉ hoặc xử lý nguyên nhân, anh chị xem `GET /email-suppressions`, rồi gọi `DELETE /email-suppressions/{email}` để tự gỡ chặn. Bounce 4.x.x chỉ được ghi log để theo dõi.

## Rate limit và retry

| Loại | Giới hạn |
|---|---|
| `TRANSACTION_IN` | 600 mail mỗi client mỗi giờ; vượt mức ghi `RATE_LIMITED`, không gửi |
| Mail test | 20 mail mỗi client mỗi giờ |
| Mã xác minh | 5 lần mỗi địa chỉ mỗi giờ, 30 lần mỗi client mỗi giờ |

Lỗi SMTP 4xx, timeout hoặc mất kết nối được thử lại tối đa 3 lần sau 1 giây, 5 giây và 25 giây. SMTP 5xx thất bại ngay. Địa chỉ đang suppression không được gửi lại.

## Bảo mật và quyền riêng tư

- Mọi người nhận phải xác minh trước khi cấu hình hoạt động; thêm địa chỉ mới có thể làm cấu hình chờ xác minh.
- MONA Pay chỉ lưu metadata của lần gửi, không log nội dung email.
- Mail gửi từ `MONA Pay <noreply@monapay.vn>`, `Reply-To: info@themona.global`, có `Message-ID: <uuid@monapay.vn>`, `X-Mona-Mail-Id` và `Auto-Submitted: auto-generated`.
- Mail thông báo và biên lai có `List-Unsubscribe: <mailto:bounce@monapay.vn?subject=unsubscribe>, <https://my.monapay.vn/email-config>` cùng `List-Unsubscribe-Post: List-Unsubscribe=One-Click`; mail mã xác minh không cần các header này.
- Secret và token phải nằm trong biến môi trường. Không ghi mã xác minh, Bearer token hay `X-Client-Secret` vào log ứng dụng.

## FAQ

**Vì sao tạo xong mà `is_active` vẫn là `false`?** Ít nhất một địa chỉ còn trong `pending_verification`. Nhập đúng mã 6 số cho mọi người nhận; MONA Pay tự bật cấu hình sau mã cuối cùng.

**Không nhận được mã xác minh thì làm gì?** Kiểm tra thư rác và địa chỉ đã nhập, sau đó gọi endpoint gửi lại. Mã có hạn 15 phút; giới hạn gửi lại là 5 lần mỗi địa chỉ mỗi giờ.

**Vì sao test trả `skipped` hoặc log ghi `SUPPRESSED`?** Địa chỉ chưa xác minh hoặc đang bị chặn do bounce cứng, khiếu nại hay tắt tay. Xem danh sách suppression, sửa nguyên nhân rồi mới gỡ chặn.

**Email có thay webhook hoặc Telegram không?** Không bắt buộc thay. Anh chị có thể dùng đồng thời 3 kênh: webhook cho phần mềm, Telegram cho nhóm và email cho người cần nhận trong hộp thư.
