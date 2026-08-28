// Bản markdown thô cho mỗi trang docs: /docs/<slug>.md — LLM/agent đọc thẳng, không cần parse HTML.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '../../data/site';
export async function getStaticPaths() {
  const docs = await getCollection('docs');
  return docs.map((d) => ({ params: { slug: d.id }, props: { d } }));
}
export const GET: APIRoute = ({ props }) => {
  const d = props.d;
  const url = SITE.url + (d.id === 'index' ? '/docs' : '/docs/' + d.id);
  const body = `# ${d.data.title}\n\n> ${d.data.description}\n> Nguồn: ${url} · Cập nhật: ${d.data.updated ?? ''} · ${SITE.entityShort}\n\n${d.body}\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
};
