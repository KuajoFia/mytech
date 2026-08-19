# AGBE-TECH — Plateforme e-commerce + vitrine + espace client

> **« Connecter · Sécuriser · Alimenter · Performer »**

Plateforme web complète pour AGBE-TECH, entreprise togolaise spécialisée en solutions
technologiques et énergétiques (réseau, vidéosurveillance, électricité, solaire, liaison
longue distance). Site vitrine + boutique en ligne + espace client + back-office.

## ✨ Fonctionnalités

### Vitrine (front-office)
- **Accueil** : hero, 5 services, points forts, processus, témoignages, CTA
- **À propos** : histoire, valeurs, timeline, engagements
- **5 pages Services** (réseau, longue distance, caméras, électricité, solaire) avec FAQ
- **Réalisations** : galerie filtrable par catégorie
- **Blog** : articles SEO avec markdown
- **Contact & devis** : formulaire complet + carte OpenStreetMap
- **Bouton WhatsApp flottant**, click-to-call mobile, **responsive mobile-first**

### Boutique
- **Catalogue** : 12 produits seedés (caméras, solaire, réseau, électricité, télécom)
- **Filtres** : catégorie, marque, prix max, en stock, recherche, tri
- **Fiche produit** : galerie, specs techniques tablées, prix/promo, garantie, stock
- **Panier** : Zustand persisté, modifier quantités, vider
- **Checkout** : 4 sections (coord., facturation pro, livraison, paiement)
- **Paiements** : T-Money, Flooz, virement, espèces (intégration KKiaPay/CinetPay prête)

### Cycle de vie des commandes
- 11 statuts : devis demandé → proforma émise → commandée → en attente paiement →
  payée → en préparation → en attente livraison → en cours livraison → livrée →
  annulée → retour/avoir
- **Documents PDF imprimables** générés à la volée (HTML imprimable) :
  - `PF-AAAA-XXX` Proforma
  - `BC-AAAA-XXX` Bon de commande
  - `FA-AAAA-XXX` Reçu / Facture acquittée (avec filigrane « PAYÉE LE »)
  - `BL-AAAA-XXX` Bon de livraison (sans prix)
  - `AV-AAAA-XXX` Avoir
- Numérotation séquentielle inaltérable, mentions légales (RCCM, NIF, TVA 18 %)

### Espace client
- Inscription / connexion par téléphone ou email
- Comptes particuliers et professionnels (raison sociale, NIF/RCCM)
- Tableau de bord : commandes, total dépensé, commandes actives
- Détail commande : timeline visuelle, téléchargement PDF, actions
  (payer, annuler, re-commander)
- Profil + carnet d&apos;adresses

### Back-office (admin)
- **Tableau de bord** : CA, commandes, clients, stock bas, demandes de devis
- **Produits** : CRUD complet, attributs techniques, prix sur demande, stock
- **Commandes** : changement de statut 1 clic, génération PDF, historique
- **Clients** : liste, total dépensé
- **Devis services** : demandes reçues via formulaire, statuts
- **Paramètres** : entreprise, frais livraison, TVA, proforma, clés API paiement

### SEO & légal
- `sitemap.xml` dynamique, `robots.txt`
- JSON-LD `LocalBusiness` (schema.org)
- Métadonnées par page (title, description, OG)
- Pages **Mentions légales**, **Politique de confidentialité** (loi togolaise n° 2011-010),
  **CGV**

## 🛠️ Stack technique

- **Framework** : Next.js 16 (App Router) + TypeScript 5
- **Styles** : Tailwind CSS 4 + shadcn/ui (style New York) + Lucide icons
- **Base de données** : Prisma + SQLite (prod : MySQL/PostgreSQL)
- **État** : Zustand (panier), TanStack Query (server state)
- **Auth** : sessions cookie HTTP-only (production : NextAuth + bcrypt + OTP)
- **PDF** : rendu HTML imprimable (production : wkhtmltopdf ou Puppeteer)
- **Fonts** : Montserrat (titres) + Inter (corps)

## 🚀 Démarrage

### Prérequis
- Node.js 20+ ou Bun 1.1+
- npm / bun

### Installation

```bash
# Cloner le dépôt
git clone https://github.com/KuajoFia/mytech.git
cd mytech

# Installer les dépendances
bun install   # ou npm install

# Configurer l'environnement
cp .env.example .env
# éditer .env si besoin (DATABASE_URL par défaut : SQLite local)

# Initialiser la base de données + données de démo
bun run db:push
bun run db:seed

# Lancer le serveur de dev
bun run dev
```

→ http://localhost:3000

### Comptes de démonstration

**Admin back-office :**
- Email : `admin@agbe-tech.com`
- Mot de passe : `agbe-admin-2026`
- → http://localhost:3000/admin/connexion

**Espace client :** créez votre compte sur /compte/inscription

## 📂 Structure du projet

```
.
├── prisma/
│   └── schema.prisma          # Schéma complet (User, Product, Order, Quote, Document…)
├── scripts/
│   └── seed.ts                # Données de démo (catégories, produits, services…)
├── src/
│   ├── app/
│   │   ├── (public)/          # Pages vitrine
│   │   ├── admin/              # Back-office
│   │   ├── compte/             # Espace client
│   │   ├── api/                # API routes (auth, checkout, orders, pdf, admin…)
│   │   ├── layout.tsx          # Layout racine
│   │   ├── page.tsx            # Accueil
│   │   ├── sitemap.ts          # SEO
│   │   └── robots.ts
│   ├── components/
│   │   ├── ui/                 # shadcn/ui
│   │   ├── layout/             # Header, Footer, WhatsApp FAB
│   │   ├── shop/               # ProductCard, ShopFilters, ProductDetailClient
│   │   ├── cart/               # CartProvider (Zustand persisté)
│   │   ├── account/            # OrderActions
│   │   ├── admin/              # Sidebar, ProductForm, SettingsForm, StatusUpdaters
│   │   └── site/               # LocalBusiness JSON-LD
│   ├── lib/
│   │   ├── db.ts               # Prisma client singleton
│   │   ├── auth.ts             # Sessions cookie
│   │   └── utils.ts            # cn, formatFCFA, slugify, statuts… 
│   └── middleware.ts           # x-pathname pour layouts
├── public/                     # Logo SVG
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

## 🎨 Charte graphique

| Élément | Valeur |
|---|---|
| Bleu institutionnel | `#0A3D91` |
| Bleu clair | `#1449A5` |
| Bleu foncé | `#072D6B` |
| Jaune accent | `#FFB800` |
| Gris foncé texte | `#1A1F2C` |
| Police titres | Montserrat (700/800) |
| Police corps | Inter (400/500) |

## 🌍 Production

Avant déploiement :
1. Remplacer SQLite par MySQL/PostgreSQL (Prisma datasource)
2. Activer bcrypt pour les mots de passe (`src/lib/auth.ts`)
3. Intégrer NextAuth avec OTP SMS/WhatsApp pour l'auth
4. Brancher KKiaPay / CinetPay / PayDunya pour les paiements réels
5. Configurer les webhooks de paiement pour confirmation automatique
6. Ajouter les clés API dans `.env`
7. Migrer le rendu PDF vers wkhtmltopdf ou Puppeteer (serverless-friendly)
8. Configurer le domaine `agbe-tech.com` + SSL + emails pros
9. Activer Google Search Console + Google Business Profile
10. Sauvegardes quotidiennes de la BDD

## 📋 Roadmap (Phase 2)

- Simulateur solaire (estimation puissance/panneaux)
- Paiement T-Money/Flooz des contrats de maintenance
- Version anglaise (FR/EN via next-intl)
- Wishlist
- Application mobile (React Native)

## 📄 Licence

Code propriétaire — © AGBE-TECH. Tous droits réservés.

## 📞 Contact

- **AGBE-TECH** — Kégué, Rue Kpacha — Lomé, Togo
- Tél : +228 98 89 79 14 / +228 93 90 77 06
- Email : contact@agbe-tech.com
- WhatsApp : [wa.me/22898897914](https://wa.me/22898897914)
