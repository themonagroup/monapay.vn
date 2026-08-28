// Đo headline mọi trang ở desktop 1280 + mobile 390: H1 số hàng, H2 >2 hàng desktop, tràn ngang. Dùng playwright của MCP nếu có.
import { chromium } from 'playwright';
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
const base = 'http://127.0.0.1:8877';
const pages = [];
const walk = (d, pre='') => { for (const f of readdirSync(d)) { const p = join(d,f); if (statSync(p).isDirectory()) walk(p, pre+'/'+f); else if (f.endsWith('.html')) pages.push(pre+'/'+f); } };
walk('dist');
const br = await chromium.launch(); const pg = await br.newPage();
const lines = (h) => Math.round(h.getBoundingClientRect().height / parseFloat(getComputedStyle(h).lineHeight));
const measure = () => ({
  h1: [...document.querySelectorAll('h1')].map(h => ({ t: h.innerText.slice(0,60), l: Math.round(h.getBoundingClientRect().height / parseFloat(getComputedStyle(h).lineHeight)) })),
  h2over: [...document.querySelectorAll('h2')].map(h => ({ t: h.innerText.slice(0,50), l: Math.round(h.getBoundingClientRect().height / parseFloat(getComputedStyle(h).lineHeight)) })).filter(x => x.l > 2),
  hscroll: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
});
for (const p of pages) {
  await pg.setViewportSize({ width: 1280, height: 900 }); await pg.goto(base + p, { waitUntil: 'load' }); await pg.waitForTimeout(150);
  const d = await pg.evaluate(measure);
  await pg.setViewportSize({ width: 390, height: 800 }); await pg.waitForTimeout(150);
  const m = await pg.evaluate(measure);
  const bad = [];
  d.h1.forEach(h => { if (h.l > 2) bad.push(`H1 desktop ${h.l} hàng: ${h.t}`); });
  d.h2over.forEach(h => bad.push(`H2 desktop ${h.l} hàng: ${h.t}`));
  if (d.hscroll) bad.push('tràn ngang desktop');
  if (m.hscroll) bad.push('tràn ngang mobile');
  m.h1.forEach(h => { if (h.l > 4) bad.push(`H1 mobile ${h.l} hàng: ${h.t}`); });
  console.log((bad.length ? 'XX ' : 'ok ') + p + (bad.length ? '\n   - ' + bad.join('\n   - ') : ''));
}
await br.close();
