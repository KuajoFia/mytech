#!/usr/bin/env bash
# AGBE-TECH — Bootstrap production database
# Run this from YOUR LOCAL MACHINE (the sandbox cannot reach Supabase directly).
#
# Prerequisites:
#   - Node.js 20+ / Bun 1.3+
#   - Git clone of the repo
#
# Usage:
#   git clone https://github.com/KuajoFia/mytech.git
#   cd mytech
#   bun install
#   DATABASE_URL="postgresql://postgres:Lapaix%401311@db.fkjomoctlukymwrzkcqj.supabase.co:5432/postgres" \
#     ADMIN_BOOTSTRAP_PASSWORD="votre-mot-de-passe-admin" \
#     ./scripts/bootstrap-prod.sh

set -euo pipefail

if [ -z "${DATABASE_URL:-}" ]; then
  echo "❌ DATABASE_URL not set."
  echo "   Export it before running this script:"
  echo "   export DATABASE_URL='postgresql://postgres:Lapaix%401311@db.fkjomoctlukymwrzkcqj.supabase.co:5432/postgres'"
  exit 1
fi

if [ -z "${ADMIN_BOOTSTRAP_PASSWORD:-}" ]; then
  echo "⚠️  ADMIN_BOOTSTRAP_PASSWORD not set — using default 'agbe-admin-2026'"
  export ADMIN_BOOTSTRAP_PASSWORD="agbe-admin-2026"
fi

echo "🚀 AGBE-TECH — Bootstrap production database"
echo "============================================"
echo ""

# Step 1: Generate Prisma client
echo "1️⃣  Generate Prisma client..."
bunx prisma generate

# Step 2: Push schema to PostgreSQL
echo ""
echo "2️⃣  Push schema to PostgreSQL (creates all tables)..."
bunx prisma db push --force-reset --accept-data-loss
echo "   ✓ Tables created"

# Step 3: Seed admin user + demo data
echo ""
echo "3️⃣  Seed database (admin user + demo data)..."
bun run scripts/seed.ts
echo "   ✓ Seed complete"

# Step 4: Verify
echo ""
echo "4️⃣  Verify admin user exists..."
bun -e "
import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();
const admin = await db.user.findFirst({ where: { role: 'ADMIN' } });
if (admin) {
  console.log('   ✓ Admin user found:', admin.email);
} else {
  console.log('   ✗ No admin user found');
  process.exit(1);
}
await db.\$disconnect();
"

echo ""
echo "✅ Bootstrap terminé avec succès !"
echo ""
echo "🔑 Identifiants admin :"
echo "   Email:    admin@agbe-tech.com"
echo "   Password: ${ADMIN_BOOTSTRAP_PASSWORD}"
echo ""
echo "🔗 Connectez-vous sur votre site Vercel → /admin/connexion"
