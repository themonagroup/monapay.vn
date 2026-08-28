import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '../../data/site';
export async function getStaticPaths() {
  const posts = await getCollection('posts');
  return posts.map((p) => ({ params: { slug: p.id }, props: { p } }));
}
export const GET: APIRoute = ({ props }) => {
  const p = props.p;
  const body = `# ${p.data.h1 || p.data.title}\n\n> ${p.data.description}\n> Nguồn: ${SITE.url}/blog/${p.id} · Đăng ${p.data.date} · ${SITE.entityShort}\n\n${p.body}\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
};
