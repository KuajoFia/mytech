#!/usr/bin/env bash
# AGBE-TECH — Déploiement 1-clic sur Vercel
# Usage:
#   ./scripts/deploy-vercel.sh
#
# Prérequis:
#   - Vercel CLI installée (npm i -g vercel)
#   - Compte Vercel lié (vercel login)
#   - Repo GitHub KuajoFia/mytech

set -euo pipefail

PROJECT_NAME="agbe-tech"
REPO_URL="https://github.com/KuajoFia/mytech.git"

echo "🚀 Déploiement AGBE-TECH sur Vercel"
echo "===================================="
echo ""

# Vérif dépendances
if ! command -v vercel &> /dev/null; then
  echo "❌ Vercel CLI n'est pas installé."
  echo "   Installez avec: npm i -g vercel"
  exit 1
fi

if ! command -v openssl &> /dev/null; then
  echo "❌ openssl n'est pas installé."
  exit 1
fi

# Étape 1 : lier le projet local à Vercel
echo "📦 Liaison du projet à Vercel..."
vercel link --yes --project="$PROJECT_NAME" 2>/dev/null || vercel link

# Étape 2 : générer NEXTAUTH_SECRET
echo ""
echo "🔐 Génération du NEXTAUTH_SECRET..."
SECRET=$(openssl rand -hex 32)
echo "  → $SECRET"

# Étape 3 : configurer les variables d'env (interactif)
echo ""
echo "⚙️  Configuration des variables d'environnement..."
echo "   (Laissez vide si vous l'avez déjà configurée dans le dashboard Vercel)"

read -rp "DATABASE_URL (PostgreSQL, ex: postgresql://user:pass@host:5432/db?schema=public): " DB_URL
read -rp "URL publique (ex: https://agbe-tech.vercel.app): " PUBLIC_URL
read -rp "Mot de passe admin initial (défaut: agbe-admin-2026): " ADMIN_PW
ADMIN_PW=${ADMIN_PW:-agbe-admin-2026}

# Set env vars on Vercel (production + preview + development)
echo ""
echo "📤 Envoi des variables à Vercel..."
echo "y" | vercel env add NEXTAUTH_SECRET production <<< "$SECRET"
echo "y" | vercel env add DATABASE_URL production <<< "$DB_URL"
echo "y" | vercel env add NEXTAUTH_URL production <<< "$PUBLIC_URL"
echo "y" | vercel env add ADMIN_BOOTSTRAP_PASSWORD production <<< "$ADMIN_PW"

echo ""
echo "🏗️  Déploiement en production..."
vercel --prod

echo ""
echo "✅ Déploiement terminé !"
echo ""
echo "📋 Prochaines étapes:"
echo "  1. Lancez les migrations DB:"
echo "     vercel env pull .env.production.local"
echo "     npx prisma migrate deploy"
echo ""
echo "  2. (Optionnel) Seedez les données démo:"
echo "     NODE_ENV=production bun run scripts/seed.ts"
echo ""
echo "  3. Branchez votre domaine personnalisé dans Vercel → Settings → Domains"
echo ""
echo "🔗 URL du projet: https://vercel.com/dashboard > $PROJECT_NAME"
