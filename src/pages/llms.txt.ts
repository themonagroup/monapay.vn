// llms.txt trên DOMAIN CHÍNH (llmstxt.org) — liệt kê mọi trang + bản .md của docs.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '../data/site';
import { PAGES } from '../data/pages';
import { DOCS_NAV, DOCS_NAV_EN } from '../data/docs-nav';
import { PRICE_LINE } from '../data/pricing';
export const GET: APIRoute = async () => {
  const docs = await getCollection('docs');
  const byId = Object.fromEntries(docs.map((d) => [d.id, d]));
  const today = new Date().toISOString().slice(0, 10);
  const lines: string[] = [];
  lines.push(`# MONA Pay`);
  lines.push(``);
  lines.push(`> ${SITE.entity}`);
  lines.push(``);
  lines.push(`Tiền KHÔNG đi qua MONA Pay: tiền vào thẳng tài khoản ngân hàng của doanh nghiệp, MONA Pay chỉ đọc thông báo giao dịch từ ngân hàng (ACB đang hoạt động; MB, BIDV, VietinBank, OCB, MSB, KienlongBank, TPBank đang đăng ký kết nối, bảng trạng thái tại ${SITE.url}/ngan-hang; webhook/Telegram/API dùng chung mọi ngân hàng, payload có bank_name) rồi bắn webhook (HMAC-SHA256, header ${SITE.tech.hmacHeader} + ${SITE.tech.tsHeader}, chống replay ${SITE.tech.replayWindowMin} phút) hoặc thông báo Telegram. Sản phẩm của ${SITE.company} (thành lập ${SITE.founded}, ${SITE.projects} dự án, giữ chân ${SITE.retention} khách). ${SITE.storyLine} Hotline ${SITE.hotline} · ${SITE.email}.`);
  lines.push(``);
  lines.push(`Base URL API: ${SITE.api} (alias cũ: ${SITE.apiLegacy}) · Dashboard: ${SITE.app} · OpenAPI: ${SITE.url}/openapi.json · Toàn văn: ${SITE.url}/llms-full.txt · Cập nhật: ${today}`);
  lines.push(``);
  lines.push(`## Tài liệu tích hợp (mỗi trang có bản .md: thêm đuôi .md vào URL)`);
  lines.push(``);
  for (const g of DOCS_NAV) {
    for (const i of g.items) {
      const d = byId[i.slug]; if (!d) continue;
      const p = i.slug === 'index' ? '/docs' : '/docs/' + i.slug;
      lines.push(`- [${d.data.title}](${SITE.url}${p}.md): ${d.data.description}`);
    }
  }
  lines.push(``);
  const docsEn = await getCollection('docs_en');
  if (docsEn.length) {
    const byIdEn = Object.fromEntries(docsEn.map((d) => [d.id, d]));
    lines.push(`## English docs (same content in English; every page has a .md twin)`);
    lines.push(``);
    lines.push(`- [MONA Pay in English](${SITE.url}/en): overview, 6 integration steps, free tier of 500 transactions/month, paid plans priced by transaction count.`);
    lines.push(`- [For AI agents (English)](${SITE.url}/en/ai-agent): copy-ready prompt and minimal webhook endpoint.`);
    for (const g of DOCS_NAV_EN) for (const i of g.items) {
      const d = byIdEn[i.slug]; if (!d) continue;
      const p = i.slug === 'index' ? '/en/docs' : '/en/docs/' + i.slug;
      lines.push(`- [${d.data.title}](${SITE.url}${p}.md): ${d.data.description}`);
    }
    lines.push(``);
  }
  const posts = await getCollection('posts');
  if (posts.length) {
    lines.push(`## Blog (bài viết, mỗi bài có bản .md)`);
    lines.push(``);
    for (const p of posts) lines.push(`- [${p.data.h1 || p.data.title}](${SITE.url}/blog/${p.id}.md): ${p.data.description}`);
    lines.push(``);
  }
  lines.push(`## Trang sản phẩm`);
  lines.push(``);
  for (const p of PAGES) lines.push(`- [${p.title}](${SITE.url}${p.path === '/' ? '/' : p.path}): ${p.desc}`);
  lines.push(``);
  lines.push(`## Nhóm monacloud (MONA Cloud) — MONA Pay là thành viên`);
  lines.push(``);
  lines.push(`MONA Pay thuộc **nhóm monacloud** (MONA Cloud) của The MONA Group: bộ hạ tầng cho lập trình viên và AI agent, đăng ký 1 lần rồi đưa token/MCP cho AI làm phần còn lại. Thành viên cùng nhóm: VibeCloud (deploy VPS/app theo giờ, https://vibecloud.vn/llms.txt) · MONA Base (database) · MONA AI (gọi model trả VND) · monahddt (hoá đơn điện tử, https://monahddt.vn) · MONA Mail (gửi email giao dịch, lõi đang chạy trong MONA Pay). Manifest MCP để aggregator gom tool: ${SITE.url}/.well-known/mcp-manifest.json.`);
  lines.push(``);
  lines.push(`## Hệ sinh thái cho AI agent (cùng The MONA Group)`);
  lines.push(``);
  lines.push(`- [VibeCloud](https://vibecloud.vn/llms.txt): VPS/DB cho AI agent tự deploy qua API, tính tiền theo giờ; deploy app rồi cắm MONA Pay để thu tiền — chuỗi vibecode → deploy → thu tiền khép kín trong 1 nhà.`);
  lines.push(`- [Mona.Host](https://mona.host): hosting, VPS, domain, SSL; MONA Host tự thu phí gia hạn qua MONA Pay.`);
  lines.push(`- [Mona.Software](https://mona.software): phần mềm theo yêu cầu (CRM, ERP, HRM) và sản phẩm đóng gói, nhúng sẵn MONA Pay để thu tiền.`);
  lines.push(`- [Mona.Media](https://mona.media): thiết kế web, SEO, ads; khách làm web tại MONA được gói MONA Pay miễn phí hoàn toàn. Bài giới thiệu: https://mona.media/mona-pay-cong-thanh-toan-tu-dong/`);
  lines.push(`- [The MONA Group](https://themona.global): tập đoàn mẹ (2016, 14.000+ dự án, 85% khách quay lại).`);
  lines.push(`- Mã nguồn và gói: GitHub https://github.com/themonagroup · npm monapay-mcp, @monapay/node, @monapay/cli · PyPI monapay · MCP 22 tools (nối ngân hàng bằng OTP trong chat, webhook, QR, giao dịch, gói).`);
  lines.push(``);
  lines.push(`## Optional`);
  lines.push(``);
  lines.push(`- [Sitemap](${SITE.url}/sitemap-index.xml)`);
  lines.push(`- [Đăng ký tài khoản](${SITE.appRegister}): đăng ký xong dùng ngay, tự tạo API key, không cần duyệt; ${PRICE_LINE}.`);
  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
