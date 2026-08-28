// Raw markdown for each English docs page: /en/docs/<slug>.md — read directly by LLMs/agents.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '../../../data/site';
const ENTITY_EN = 'MONA Pay is the payment gateway and bank API of The MONA Group that lets Vietnamese businesses receive and confirm bank transfers in real time via virtual accounts (VA), VietQR, webhooks and Telegram — built so both developers and AI agents can integrate in minutes.';
export async function getStaticPaths() {
  const docs = await getCollection('docs_en');
  return docs.map((d) => ({ params: { slug: d.id }, props: { d } }));
}
export const GET: APIRoute = ({ props }) => {
  const d = props.d;
  const url = SITE.url + (d.id === 'index' ? '/en/docs' : '/en/docs/' + d.id);
  const body = `# ${d.data.title}\n\n> ${d.data.description}\n> Source: ${url} · Updated: ${d.data.updated ?? ''} · ${ENTITY_EN}\n\n${d.body}\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
};
