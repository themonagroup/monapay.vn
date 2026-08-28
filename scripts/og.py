#!/usr/bin/env python3
"""Composite OG image: nền do Codex image_gen render (không chữ) + logo MONA Pay file gốc (không vẽ lại). Output public/og/monapay-og.png 1200x630."""
import sys, json, base64, io, os
from PIL import Image
src = sys.argv[1]  # PNG do Codex image_gen render (handoff/og/out/og-light.png) hoặc resp.json OpenAI
if src.endswith('.json'):
    d = json.load(open(src)); b64 = d['data'][0].get('b64_json')
    if not b64: raise SystemExit('no b64: ' + json.dumps(d)[:300])
    bg = Image.open(io.BytesIO(base64.b64decode(b64))).convert('RGBA')
else:
    bg = Image.open(src).convert('RGBA')
logo_variant = sys.argv[2] if len(sys.argv) > 2 else 'light'  # light = logo chữ tối cho nền sáng; dark = nền tối
W, H = bg.size
target = 1200 / 630
h = int(W / target); top = (H - h) // 2
bg = bg.crop((0, top, W, top + h)).resize((1200, 630), Image.LANCZOS)
logo = Image.open(os.path.expanduser(f'~/MONApay/brand/monapay-logo-{logo_variant}.png')).convert('RGBA')
lw = 420; lh = int(logo.height * lw / logo.width)
logo = logo.resize((lw, lh), Image.LANCZOS)
bg.alpha_composite(logo, (72, 630 // 2 - lh // 2))
os.makedirs('public/og', exist_ok=True)
bg.convert('RGB').save('public/og/monapay-og.png', optimize=True)
print('OK public/og/monapay-og.png', bg.size)
