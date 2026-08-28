# HANDOFF — site ngoài monapay.vn (`~/MONApay/site`, Astro static)

## Kiến trúc
- Astro 7 `output:'static'`, `build.format:'file'` → `dist/acb.html` phục vụ tại `/acb` (nginx `try_files $uri $uri.html`). Không Node server trên VPS.
- Nguồn sự thật: `src/data/site.ts` (entity, số công ty, số kỹ thuật BE) · `src/data/pricing.ts` (cờ `PRICING_APPROVED`) · `src/data/docs-nav.ts` (sidebar docs) · `src/data/pages.ts` (mô tả trang cho llms.txt).
- Docs = markdown `src/content/docs/**` → render `/docs/<slug>` + **bản thô `/docs/<slug>.md`** (endpoint `[...slug].md.ts`) + `/llms.txt` + `/llms-full.txt` + `/openapi.json` (sinh từ `../fe-payment/openapi.json` qua `scripts/gen-openapi.mjs`, lọc route công khai).
- Schema: Organization + WebSite ở mọi trang (Base.astro); FAQPage sinh từ `<Faq>`; TechArticle + Breadcrumb ở docs; SoftwareApplication ở home/ai-agent.
- robots.txt mở GPTBot/ClaudeBot/PerplexityBot/OAI-SearchBot/Google-Extended.

## Deploy
- `./deploy.sh` = build → `scripts/qc.py dist` (gate voice + GEO, FAIL là dừng) → rsync `dist/` → `root@125.212.251.228:/opt/www/monapay.vn/dist/`.
- nginx: `/opt/nginx/conf/vhosts/monapay.vn.conf` (root static, .md = text/markdown, CORS cho .md/openapi). Dashboard giữ vhost `monapay.mona.host.conf` (server_name `monapay.mona.host my.monapay.vn`).
- SSL: đang mượn cert `monapay.mona.host` (CF proxy Full chấp nhận). Khi NS về Cloudflare: `certbot --nginx -d monapay.vn -d www.monapay.vn -d my.monapay.vn` (certbot custom path theo HANDOFF gốc) rồi sửa 2 dòng ssl_certificate trong vhost.

## Backlog site
- OG image `/og/monapay-og.png` (1200×630) — chưa có, đặt GPT render theo luật poster (Base.astro đã trỏ sẵn path).
- FE dashboard: hỗ trợ `my.monapay.vn/auth?mode=register` để nút "Tạo tài khoản" mở thẳng tab đăng ký.
- Sandbox tự lấy key không cần duyệt (điều kiện cứng cho định vị AI agent) — BE phase 2.
- `/en/*` song ngữ + hreflang; trang bank mới khi có; `/cong-thanh-toan-sapo|haravan`.
