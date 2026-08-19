# AGBE-TECH — Guide de déploiement

Ce guide couvre 3 scénarios :
1. **Vercel** (recommandé, le plus simple)
2. **VPS avec Docker Compose** (auto-hébergement)
3. **Migration SQLite → PostgreSQL**

---

## 🚀 Option 1 — Vercel (recommandé)

### Étape 1 : Préparer le repo GitHub
Le code est déjà sur : https://github.com/KuajoFia/mytech.git

### Étape 2 : Créer la base PostgreSQL
1. Créer un compte gratuit sur [Supabase](https://supabase.com) ou [Neon](https://neon.tech)
2. Créer un nouveau projet → récupérer l'URL de connexion au format :
   ```
   postgresql://user:password@host:5432/dbname?schema=public
   ```

### Étape 3 : Importer le projet sur Vercel
1. Aller sur [vercel.com/new](https://vercel.com/new)
2. Importer le repo `KuajoFia/mytech`
3. Vercel détecte automatiquement Next.js + `vercel.json`

### Étape 4 : Configurer les variables d'environnement
Dans **Settings → Environment Variables**, ajouter :

| Variable | Valeur | Notes |
|----------|-------|-------|
| `DATABASE_URL` | `postgresql://...` | URL Supabase/Neon |
| `NEXTAUTH_SECRET` | (généré, voir ci-dessous) | **OBLIGATOIRE** |
| `NEXTAUTH_URL` | `https://votre-app.vercel.app` | URL finale |
| `ADMIN_BOOTSTRAP_PASSWORD` | (votre mot de passe admin) | Pour le seed initial |
| `KKIAPAY_API_KEY` | (optionnel) | Clé Kkiapay |
| `KKIAPAY_SECRET` | (optionnel) | Secret webhook Kkiapay |
| `CINETPAY_API_KEY` | (optionnel) | Clé CinetPay |
| `WHATSAPP_TOKEN` | (optionnel) | WhatsApp Business |
| `WHATSAPP_PHONE_ID` | (optionnel) | WhatsApp Business |
| `SMTP_HOST` | (optionnel) | `smtp.gmail.com` etc. |
| `SMTP_PORT` | `587` | |
| `SMTP_USER` | (optionnel) | |
| `SMTP_PASSWORD` | (optionnel) | Mot de passe d'application |
| `CONTACT_EMAIL` | `contact@agbe-tech.com` | |

### Étape 5 : Générer le NEXTAUTH_SECRET
Sur votre machine locale :
```bash
openssl rand -hex 32
```
Copier la sortie (64 caractères hex) dans `NEXTAUTH_SECRET`.

### Étape 6 : Déployer
1. Cliquer sur **Deploy**
2. Vercel lance `bun install` + `bun run build:vercel`
3. Premier déploiement ~3 minutes

### Étape 7 : Lancer les migrations + seed
Après le premier déploiement, dans **Vercel → Settings → Functions → Terminal** (ou via Vercel CLI) :

```bash
# Installer Vercel CLI localement (si pas déjà fait)
npm i -g vercel
vercel login

# Lier le projet
vercel link

# Lancer les migrations en production
vercel env pull .env.production.local
npx prisma migrate deploy

# Lancer le seed (crée l'admin + données démo)
NODE_ENV=production bun run scripts/seed.ts
```

### Étape 8 : (Optionnel) Domaine personnalisé
1. Vercel → Settings → Domains
2. Ajouter `agbe-tech.com`
3. Configurer le DNS chez votre registrar (CNAME vers `cname.vercel-dns.com`)

---

## 🐳 Option 2 — VPS avec Docker Compose

### Prérequis
- VPS Linux (Ubuntu 22.04+, 2 vCPU, 2 GB RAM mini)
- Docker + Docker Compose installés
- Nom de domaine pointant vers le VPS

### Étape 1 : Cloner le repo
```bash
ssh root@votre-vps
git clone https://github.com/KuajoFia/mytech.git
cd mytech
```

### Étape 2 : Configurer l'environnement
```bash
cp .env.example .env
nano .env
# Éditer :
# - DATABASE_URL (laisser la valeur Docker Compose)
# - NEXTAUTH_SECRET (openssl rand -hex 32)
# - NEXTAUTH_URL (https://votre-domaine.com)
# - POSTGRES_PASSWORD (mot de passe DB fort)
# - ADMIN_BOOTSTRAP_PASSWORD
# - Clés API paiement / SMTP / WhatsApp (optionnel)
```

### Étape 3 : Lancer la stack
```bash
docker compose up -d --build
```
L'app démarre sur `http://localhost:3000`.

### Étape 4 : Migrations + seed
```bash
docker compose exec app bunx prisma migrate deploy
docker compose exec app bun run scripts/seed.ts
```

### Étape 5 : Reverse proxy + SSL avec Caddy
Le `Caddyfile` est déjà configuré. Éditer le domaine :
```caddyfile
agbe-tech.com {
  reverse_proxy localhost:3000
  encode gzip
}
```
Puis :
```bash
apt install caddy
systemctl enable --now caddy
```
Caddy génère automatiquement les certificats Let's Encrypt.

---

## 🗄️ Migration SQLite → PostgreSQL

Si vous voulez migrer les données existantes de `db/custom.db` vers PostgreSQL :

```bash
# 1. Exporter les données SQLite en SQL
bun run scripts/export-sqlite.ts > backup.sql

# 2. Créer le schéma PostgreSQL
DATABASE_URL="postgresql://..." bunx prisma db push

# 3. Importer les données
psql "$DATABASE_URL" < backup.sql

# 4. Réindexer
DATABASE_URL="postgresql://..." bunx prisma db push --accept-data-loss
```

---

## 🔐 Sécurité post-déploiement

### Checklist obligatoire :
- [ ] `NEXTAUTH_SECRET` défini et gardé secret
- [ ] Mot de passe admin changé après le premier login (`/admin/parametres`)
- [ ] HTTPS activé (automatique sur Vercel, via Caddy sinon)
- [ ] `DATABASE_URL` ne contient pas le mot de passe en clair dans le repo
- [ ] Webhooks Kkiapay/CinetPay : configurer les URLs de callback dans les dashboards respectifs :
  - Kkiapay : `https://votre-domaine.com/api/webhooks/kkiapay`
  - CinetPay : `https://votre-domaine.com/api/webhooks/cinetpay`

### Variables sensibles à ne JAMAIS committer :
- `.env` (déjà dans `.gitignore`)
- `db/custom.db` (déjà dans `.gitignore`)
- Tous les fichiers de logs (`dev.log`, `server.log`)

---

## 📊 Monitoring (optionnel)

### Sentry (erreurs)
```bash
bun add @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

### Vercel Analytics (gratuit)
Déjà activé implicitement via `vercel.json`. Visible dans le dashboard Vercel.

### Logs DB
Sur Vercel : **Dashboard → Storage → Queries**.
Sur VPS : `docker compose logs -f postgres`.

---

## ✅ Vérification post-déploiement

1. Ouvrir `https://votre-domaine.com` → page d'accueil s'affiche
2. Aller sur `/admin/connexion` → se connecter avec le mot de passe configuré
3. Aller sur `/boutique` → vérifier que les produits s'affichent
4. Faire une commande test → vérifier que l'email de confirmation arrive (si SMTP configuré)
5. Vérifier `/api/admin/analytics` (admin) → doit retourner les KPIs

Si un problème survient, consulter les logs :
- Vercel : `vercel logs`
- VPS : `docker compose logs -f app`

---

## 🆘 Dépannage

| Problème | Solution |
|----------|----------|
| `Prisma Client not generated` | `bunx prisma generate` avant le build |
| `Database connection refused` | Vérifier `DATABASE_URL` + whitelist IP (Supabase) |
| `NEXTAUTH_SECRET not set` | Générer avec `openssl rand -hex 32` |
| `CSP bloque les images` | Ajouter le domaine dans `next.config.ts → images.remotePatterns` |
| `Webhook Kkiapay 401` | Vérifier `KKIAPAY_SECRET` = secret configuré dans le dashboard Kkiapay |

---

## 📞 Support
- Documentation Vercel : https://vercel.com/docs
- Documentation Next.js : https://nextjs.org/docs
- Documentation Prisma : https://pris.ly/d/migrate-deploy
