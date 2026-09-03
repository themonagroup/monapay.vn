#!/usr/bin/env bash
# Deploy site ngoài monapay.vn: build local → rsync dist lên mona-vps-1 103.168.54.80 (nginx static, /etc/nginx/sites-available/monapay.vn.conf). Dời từ VPS money 03/09/2026.
set -euo pipefail
cd "$(dirname "$0")"
npm run build
python3 scripts/qc.py dist || { echo "QC FAIL — không deploy"; exit 1; }
rsync -az --delete dist/ mona-vps-1:/opt/www/monapay.vn/dist/
echo "DEPLOYED → https://monapay.vn (kiểm: curl -s https://monapay.vn/)"
