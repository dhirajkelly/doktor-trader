#!/bin/bash
# One-time server setup for Doktor Trader (Ubuntu, run as root).
#   bash install.sh            -> step 1: user, node, deploy key (prints the public key)
#   bash install.sh finish     -> step 2: clone, service, timer, Caddy
set -euo pipefail
REPO=git@github.com:dhirajkelly/doktor-trader.git
KEY=/etc/doktor-trader/deploy_key

if [ "${1:-}" != "finish" ]; then
  id doktor >/dev/null 2>&1 || useradd --system --create-home --home-dir /var/lib/doktor-home --shell /usr/sbin/nologin doktor
  if ! command -v node >/dev/null || [ "$(node -p 'process.versions.node.split(".")[0]')" -lt 18 ]; then
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && apt-get install -y nodejs
  fi
  command -v git >/dev/null || apt-get install -y git
  mkdir -p /etc/doktor-trader /var/lib/doktor-trader
  chown doktor:doktor /var/lib/doktor-trader
  [ -f $KEY ] || ssh-keygen -t ed25519 -N '' -C 'doktor-trader@sonar' -f $KEY
  chown doktor:doktor $KEY $KEY.pub; chmod 600 $KEY
  echo "DEPLOY_PUBKEY: $(cat $KEY.pub)"
  exit 0
fi

export GIT_SSH_COMMAND="ssh -i $KEY -o IdentitiesOnly=yes -o StrictHostKeyChecking=accept-new"
if [ ! -d /opt/doktor-trader/.git ]; then
  mkdir -p /opt/doktor-trader && chown doktor:doktor /opt/doktor-trader
  sudo -u doktor -E git clone -q $REPO /opt/doktor-trader
fi
git config --global --add safe.directory /opt/doktor-trader
cd /opt/doktor-trader
sudo -u doktor npm ci --omit=dev --no-audit --no-fund
[ -f /etc/doktor-trader.env ] || cat > /etc/doktor-trader.env <<ENV
NODE_ENV=production
PORT=4300
SITE_URL=https://dhirajkelly.id
DATA_DIR=/var/lib/doktor-trader
ENV
# keep uploaded photos already on the old web root
for f in doktor-portrait.webp dhiraj.webp; do [ -f /var/www/dhirajkelly/$f ] && [ ! -f public/$f ] && cp /var/www/dhirajkelly/$f public/; done
cp deploy/doktor-trader.service deploy/doktor-trader-pull.service deploy/doktor-trader-pull.timer /etc/systemd/system/
systemctl daemon-reload
systemctl enable --now doktor-trader doktor-trader-pull.timer
sleep 2; curl -fsS -o /dev/null -w "app: %{http_code}\n" http://127.0.0.1:4300/

# Caddy: swap the file_server block for a reverse proxy (backup first)
CF=/etc/caddy/Caddyfile
cp $CF /etc/caddy/Caddyfile.bak-$(date +%Y%m%d-%H%M)
python3 - "$CF" <<'PY'
import re, sys
p = sys.argv[1]; s = open(p).read()
new = "\treverse_proxy 127.0.0.1:4300\n\tencode gzip\n"
pat = re.compile(r'(\n(?:https?://)?dhirajkelly\.id[^\n{]*\{\n)(.*?)(\n\})', re.S)
m = pat.search(s)
if not m: sys.exit("dhirajkelly.id block not found")
if 'reverse_proxy 127.0.0.1:4300' not in m.group(2):
    s = s[:m.start(2)] + new.rstrip('\n') + s[m.end(2):]
    open(p, 'w').write(s)
print("caddy block:", pat.search(s).group(0))
PY
caddy validate --config $CF --adapter caddyfile && systemctl reload caddy
echo "DONE. Create the admin: cd /opt/doktor-trader && sudo -u doktor env \$(cat /etc/doktor-trader.env | xargs) node scripts/create-admin.js EMAIL \"Nama\""
