#!/bin/bash
# Pulls origin/main. Restarts the app only when code changed; new articles are
# picked up by the running app (it scans content/articles every 5 minutes).
set -euo pipefail
cd /opt/doktor-trader
export GIT_SSH_COMMAND="ssh -i /etc/doktor-trader/deploy_key -o IdentitiesOnly=yes -o StrictHostKeyChecking=accept-new"
OLD=$(git rev-parse HEAD)
sudo -u doktor -E git fetch -q origin main
NEW=$(git rev-parse origin/main)
[ "$OLD" = "$NEW" ] && exit 0
sudo -u doktor git reset -q --hard origin/main
CHANGED=$(git diff --name-only "$OLD" "$NEW")
if echo "$CHANGED" | grep -q '^package-lock.json$'; then sudo -u doktor npm ci --omit=dev --no-audit --no-fund; fi
if echo "$CHANGED" | grep -qv '^content/'; then systemctl restart doktor-trader; echo "restarted ($NEW)"; else echo "content only ($NEW)"; fi
