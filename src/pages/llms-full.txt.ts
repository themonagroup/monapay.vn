// llms-full.txt — toàn văn docs nối lại, agent nạp 1 phát là đủ context tích hợp.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '../data/site';
import { DOCS_NAV } from '../data/docs-nav';
export const GET: APIRoute = async () => {
  const docs = await getCollection('docs');
  const byId = Object.fromEntries(docs.map((d) => [d.id, d]));
  const out: string[] = [`# MONA Pay — toàn văn tài liệu tích hợp`, ``, `> ${SITE.entity}`, ``, `Base URL API: ${SITE.api} · Dashboard: ${SITE.app} · Hotline ${SITE.hotline} · ${SITE.email}`, ``];
  for (const g of DOCS_NAV) for (const i of g.items) {
    const d = byId[i.slug]; if (!d) continue;
    const p = i.slug === 'index' ? '/docs' : '/docs/' + i.slug;
    out.push(`---`, ``, `# ${d.data.title}`, ``, `> ${d.data.description}`, `> URL: ${SITE.url}${p} · Markdown: ${SITE.url}${p}.md`, ``, d.body ?? '', ``);
  }
  const posts = await getCollection('posts');
  for (const p of posts) out.push(`---`, ``, `# ${p.data.h1 || p.data.title}`, ``, `> ${p.data.description}`, `> URL: ${SITE.url}/blog/${p.id} · Markdown: ${SITE.url}/blog/${p.id}.md · Đăng ${p.data.date}`, ``, p.body ?? '', ``);
  return new Response(out.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
