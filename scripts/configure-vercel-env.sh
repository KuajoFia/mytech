#!/usr/bin/env bash
# AGBE-TECH — Configure Vercel environment variables via REST API
#
# Usage:
#   VERCEL_TOKEN="your-vercel-token" \
#   VERCEL_PROJECT_ID="prj_xxx" \
#   ./scripts/configure-vercel-env.sh
#
# Get your Vercel token at: https://vercel.com/account/tokens
# Get your project ID from Vercel dashboard → Settings → General → Project ID

set -euo pipefail

if [ -z "${VERCEL_TOKEN:-}" ]; then
  echo "❌ VERCEL_TOKEN not set."
  echo "   Create one at: https://vercel.com/account/tokens"
  echo "   Then: export VERCEL_TOKEN='your-token'"
  exit 1
fi

if [ -z "${VERCEL_PROJECT_ID:-}" ]; then
  echo "❌ VERCEL_PROJECT_ID not set."
  echo "   Find it in Vercel dashboard → Settings → General → Project ID"
  echo "   Then: export VERCEL_PROJECT_ID='prj_xxx'"
  exit 1
fi

# Database URL (note: @ must be URL-encoded as %40 in passwords)
DATABASE_URL="postgresql://postgres:Lapaix%401311@db.fkjomoctlukymwrzkcqj.supabase.co:5432/postgres"
NEXTAUTH_SECRET="51fb0d47293808c6fe8ad72214004d73d2488c9f157e859e3fa0e3b3e7ad715c"
NEXTAUTH_URL="${NEXTAUTH_URL:-https://mytech-xxx.vercel.app}"

# Get the team ID (optional)
TEAM_ID="${VERCEL_TEAM_ID:-}"

API_BASE="https://api.vercel.com"

# Helper: set env var on Vercel (production + preview + development)
set_env() {
  local key="$1"
  local value="$2"
  local target="${3:-production preview development}"

  echo -n "  → $key... "

  for t in $target; do
    local payload
    payload=$(jq -n \
      --arg key "$key" \
      --arg value "$value" \
      --arg type "encrypted" \
      --arg target "$t" \
      '{key: $key, value: $value, type: $type, target: [$target]}')

    local url="${API_BASE}/v9/projects/${VERCEL_PROJECT_ID}/env"
    if [ -n "$TEAM_ID" ]; then
      url="${url}?teamId=${TEAM_ID}"
    fi

    curl -s -X POST "$url" \
      -H "Authorization: Bearer ${VERCEL_TOKEN}" \
      -H "Content-Type: application/json" \
      -d "$payload" > /dev/null
  done

  echo "✓"
}

echo "🚀 Configuration des variables d'environnement Vercel"
echo "===================================================="
echo ""
echo "Project ID: $VERCEL_PROJECT_ID"
echo ""

set_env "DATABASE_URL" "$DATABASE_URL"
set_env "NEXTAUTH_SECRET" "$NEXTAUTH_SECRET"
set_env "NEXTAUTH_URL" "$NEXTAUTH_URL"
set_env "ADMIN_BOOTSTRAP_PASSWORD" "agbe-admin-2026"

echo ""
echo "✅ Variables configurées !"
echo ""
echo "👉 Maintenant, déclenchez un nouveau déploiement :"
echo "   - Soit via Vercel dashboard → Deployments → Redeploy"
echo "   - Soit via un nouveau push git sur main"
