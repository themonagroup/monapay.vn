// Cloudflare Worker: api.monapay.vn → reverse-proxy sang ipn.mona.host (backend acb-ipn).
// Lý do (02/09/2026): gateway 103.168.55.14 chưa có vhost api.monapay.vn (cert default hết hạn),
// mọi SDK/docs mặc định api.monapay.vn → dựng proxy ở edge để domain sống ngay, không phụ thuộc gateway.
// Giữ nguyên method/body/headers; thêm X-Forwarded-Host để BE biết domain gốc nếu cần.
export default {
  async fetch(request) {
    const url = new URL(request.url);
    url.hostname = 'ipn.mona.host';
    const headers = new Headers(request.headers);
    headers.set('Host', 'ipn.mona.host');
    headers.set('X-Forwarded-Host', 'api.monapay.vn');
    const init = { method: request.method, headers, redirect: 'manual' };
    if (!['GET', 'HEAD'].includes(request.method)) init.body = request.body;
    const res = await fetch(url.toString(), init);
    const out = new Headers(res.headers);
    out.set('X-MonaPay-Edge', 'cf-worker');
    return new Response(res.body, { status: res.status, statusText: res.statusText, headers: out });
  },
};
