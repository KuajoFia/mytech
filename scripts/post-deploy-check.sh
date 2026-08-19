#!/usr/bin/env bash
# AGBE-TECH — post-deploy smoke check
# Usage: ./scripts/post-deploy-check.sh https://your-domain.com

set -euo pipefail

URL="${1:-http://localhost:3000}"

echo "🔍 Vérification post-déploiement sur $URL ..."
echo ""

fail=0

check() {
  local path="$1"
  local expected_status="${2:-200}"
  local res
  res=$(curl -s -o /dev/null -w "%{http_code}" "$URL$path" 2>/dev/null || echo "000")
  if [ "$res" = "$expected_status" ]; then
    echo "  ✅ $path → $res"
  else
    echo "  ❌ $path → $res (attendu: $expected_status)"
    fail=1
  fi
}

check "/" 200
check "/boutique" 200
check "/contact" 200
check "/a-propos" 200
check "/blog" 200
check "/admin/connexion" 200
check "/api" 200
check "/this-does-not-exist" 404
check "/robots.txt" 200
check "/sitemap.xml" 200

echo ""
if [ "$fail" = "0" ]; then
  echo "🎉 Toutes les vérifications sont passées !"
  exit 0
else
  echo "⚠️  Certaines vérifications ont échoué."
  exit 1
fi
