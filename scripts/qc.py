#!/usr/bin/env python3
"""QC gate site monapay.vn: quét dist/*.html (+ docs .md) theo luật voice MONA + GEO checklist SPEC 1.4.
Dùng: python3 scripts/qc.py dist [--strict]  → exit 1 nếu có FAIL."""
import re, sys, os, html, json, glob
root = sys.argv[1] if len(sys.argv) > 1 else 'dist'
BANNED = os.path.expanduser('~/.claude/skills/mon-taste-qc/catalog/banned-ai-tells.md')
subs, regs = [], []
for line in open(BANNED, encoding='utf-8'):
    line = line.rstrip('\n')
    if not line.startswith('- ') or '→' in line: continue
    body = line[2:].strip()
    if body.startswith('re: '): regs.append(re.compile(body[4:], re.I))
    elif body and not body.startswith('**'): subs.append(body.lower())
ENTITY = 'MONA Pay là cổng thanh toán và API ngân hàng của The MONA Group'
# Giá (Mon chốt 31/08/2026: free 500 GD/tháng + gói trả phí) — cụm cũ 'miễn phí hoàn toàn / không giới hạn giao dịch' là SAI SỰ THẬT → FAIL
PRICING_BANNED = ['miễn phí hoàn toàn', 'không giới hạn giao dịch', 'không giới hạn số giao dịch', 'không giới hạn số lượng giao dịch', 'no transaction limit', 'completely free']
# Ngoại lệ Mon chốt 02/09: cụm trên HỢP LỆ khi nói về tầng khách hàng MONA — gỡ ngữ cảnh đó khỏi text trước khi quét
PRICING_ALLOWED_CTX = re.compile(r'.{0,160}(khách hàng của mona|khách hàng của the mona|mona customers).{0,160}', re.I)
def strip_pricing_allowed(t):
    return PRICING_ALLOWED_CTX.sub(' ', t)
def text_of(h):
    h = re.sub(r'<script[^>]*>.*?</script>', ' ', h, flags=re.S)
    h = re.sub(r'<style[^>]*>.*?</style>', ' ', h, flags=re.S)
    h = re.sub(r'<pre[^>]*>.*?</pre>', ' ', h, flags=re.S)   # bỏ code
    h = re.sub(r'<code[^>]*>.*?</code>', ' ', h, flags=re.S)
    t = re.sub(r'<[^>]+>', ' ', h)
    return html.unescape(re.sub(r'\s+', ' ', t))
fails, warns = 0, 0
files = sorted(glob.glob(os.path.join(root, '**', '*.html'), recursive=True))
for f in files:
    raw = open(f, encoding='utf-8').read()
    t = text_of(raw)
    rel = os.path.relpath(f, root)
    issues, ws = [], []
    is_en = rel.startswith('en/') or rel == 'en.html'
    # voice (bỏ qua trang tiếng Anh)
    if is_en:
        h1 = len(re.findall(r'<h1[\s>]', raw))
        if h1 != 1: issues.append(f'{h1} thẻ H1')
        if re.search(r"<img[^>]+src=\"/(?!brand/|_astro/|og/|img/)", raw): issues.append('img src ngoài /brand,/_astro,/og,/img')
        title = re.search(r'<title>(.*?)</title>', raw, re.S)
        if title and len(html.unescape(title.group(1)).strip()) > 70: ws.append('title dài')
        for s in PRICING_BANNED:
            if s in strip_pricing_allowed(t).lower(): issues.append(f'giá cũ (free-all): "{s}"')
        for i in issues: print(f'FAIL {rel}: {i}')
        fails += len(issues); warns += len(ws); continue
    for m in re.finditer(r'\b(\w+) ạ[.!?,]', t): issues.append(f'"ạ" cuối câu: …{m.group(0)}')
    if re.search(r'\bVâng\b', t): issues.append('"Vâng"')
    for m in re.finditer(r'(?:^|[.!?]\s+)Dạ\b', t): issues.append('mở câu "Dạ" (văn viết)')
    for m in re.finditer(r'\b(bạn|các bạn|quý khách)\b', t, re.I):
        ctx = t[max(0, m.start()-30):m.end()+30]
        if 'chatbot' in ctx.lower() or 'sepay' in ctx.lower(): continue
        issues.append(f'xưng "{m.group(0)}": …{ctx}…')
    for s in subs:
        if s in t.lower(): issues.append(f'banned tell: "{s}"')
    for s in PRICING_BANNED:
        if s in strip_pricing_allowed(t).lower(): issues.append(f'giá cũ (free-all): "{s}"')
    for r in regs:
        m = r.search(t)
        if m: issues.append(f'banned regex: "{m.group(0)[:60]}"')
    for m in re.finditer(r'(tốt nhất|số 1 (việt nam|thị trường|ngành)|hàng đầu(?! tiên)|giải pháp toàn diện|trải nghiệm liền mạch)', t, re.I):
        issues.append(f'superlative/cliché: "{m.group(0)}"')
    # em-dash trong prose (trừ câu entity)
    body_no_entity = t.replace(ENTITY, '').replace('— thiết kế để cả lập trình viên lẫn AI agent tích hợp trong vài phút', '').replace('MONA Pay — API ngân hàng & webhook thanh toán tự động cho thời đại AI', '').replace('MONA Pay — cổng thanh toán', '')
    n_dash = len(re.findall(r'\s—\s', body_no_entity))
    if n_dash > 4: ws.append(f'em-dash trong prose: {n_dash} chỗ (ngoài câu entity)')
    # GEO
    is_doc = rel.startswith('docs')
    if not is_doc:
        if 'answer-first' not in raw and not (rel.startswith('blog/') and 'post-body' in raw): issues.append('thiếu .answer-first')
        if ENTITY not in t: ws.append('thiếu câu entity nguyên văn')
        if 'FAQPage' not in raw: ws.append('thiếu FAQPage schema')
    nums = len(re.findall(r'\b\d[\d.,]*\s*(?:%|đ|VNĐ|giao dịch|phút|giây|năm|dự án|ngân hàng|bước|lần|ký tự|GD)', t))
    if nums < 3: ws.append(f'chỉ {nums} câu có số')
    title = re.search(r'<title>(.*?)</title>', raw, re.S)
    if title:
        L = len(html.unescape(title.group(1)).strip())
        if L > 70: ws.append(f'title dài {L} ký tự')
    desc = re.search(r'name="description" content="([^"]*)"', raw)
    if desc:
        L = len(html.unescape(desc.group(1)))
        if L > 170 or L < 90: ws.append(f'meta description {L} ký tự')
    h1 = len(re.findall(r'<h1[\s>]', raw))
    if h1 != 1: issues.append(f'{h1} thẻ H1')
    if re.search(r"<img[^>]+src=\"/(?!brand/|_astro/|og/|img/)", raw): issues.append("img src ngoài /brand,/_astro,/og,/img")
    if 'Title Case' in t: pass
    for i in issues: print(f'FAIL {rel}: {i}')
    for w in ws: print(f'warn {rel}: {w}')
    fails += len(issues); warns += len(ws)
print(f'\n{len(files)} trang · {fails} FAIL · {warns} warn')
sys.exit(1 if fails else 0)
