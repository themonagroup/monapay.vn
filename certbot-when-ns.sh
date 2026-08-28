#!/usr/bin/env bash
# Chạy SAU khi NS monapay.vn đã về Cloudflare (dig +short monapay.vn NS → dina/jerry.ns.cloudflare.com).
# Cấp cert LE cho monapay.vn + www + my, rồi trỏ 2 vhost sang cert mới. certbot trên VPS money dùng custom path (xem HANDOFF gốc).
set -euo pipefail
H=root@125.212.251.228; K="$HOME/.ssh/vps-money-mona"
dig +short monapay.vn NS | grep -q cloudflare || { echo "NS chưa về Cloudflare — dừng"; exit 1; }
ssh -i "$K" $H 'set -e
certbot certonly --nginx --nginx-server-root /opt/nginx/conf --nginx-ctl /opt/nginx/sbin/nginx -d monapay.vn -d www.monapay.vn -d my.monapay.vn --non-interactive --agree-tos -m info@themona.global 2>&1 | tail -3
for F in /opt/nginx/conf/vhosts/monapay.vn.conf /opt/nginx/conf/vhosts/monapay.mona.host.conf; do
  sed -i "s#/etc/letsencrypt/live/monapay.mona.host/#/etc/letsencrypt/live/monapay.vn/#g" $F
done
/opt/nginx/sbin/nginx -t && /opt/nginx/sbin/nginx -s reload && echo "cert monapay.vn OK"'
curl -sI https://monapay.vn/ | head -1; curl -sI https://my.monapay.vn/ | head -1
