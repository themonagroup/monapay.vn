#!/usr/bin/env bash
# Deploy site ngoài monapay.vn: build local → rsync dist lên vps-money-mona (nginx static, vhost monapay.vn.conf)
set -euo pipefail
cd "$(dirname "$0")"
npm run build
python3 scripts/qc.py dist || { echo "QC FAIL — không deploy"; exit 1; }
rsync -az --delete -e "ssh -i $HOME/.ssh/vps-money-mona" dist/ root@125.212.251.228:/opt/www/monapay.vn/dist/
echo "DEPLOYED → https://monapay.vn (kiểm: curl -sk --resolve monapay.vn:443:125.212.251.228 https://monapay.vn/)"
