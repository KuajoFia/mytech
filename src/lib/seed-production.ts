/**
 * Seed production data — products, articles, realisations, testimonials.
 * Run via /api/setup-db?token=... (extended) or locally.
 *
 * Uses Unsplash images (free, high quality) so content looks real on first load.
 */
import type { PrismaClient } from "@prisma/client";

const CATEGORIES = [
  { slug: "cameras", name: "Caméras de surveillance", icon: "cctv", description: "Caméras IP, analogiques, PTZ, dôme, bullet — Hikvision, Dahua et plus." },
  { slug: "solaire", name: "Solaire & énergie", icon: "sun", description: "Panneaux solaires, batteries, onduleurs, kits complets." },
  { slug: "reseau", name: "Réseau informatique", icon: "network", description: "Switchs, routeurs, AP Wi-Fi, baies de brassage, câbles." },
  { slug: "electricite", name: "Électricité bâtiment", icon: "bolt", description: "Disjoncteurs, armoires, câbles, prises, tableaux électriques." },
  { slug: "telecom", name: "Liaison longue distance", icon: "antenna", description: "Antennes, radios, faisceaux hertziens pour liaisons longues distances." },
];

const BRANDS = [
  { slug: "hikvision", name: "Hikvision", logo: null },
  { slug: "dahua", name: "Dahua", logo: null },
  { slug: "growatt", name: "Growatt", logo: null },
  { slug: "victron", name: "Victron Energy", logo: null },
  { slug: "tp-link", name: "TP-Link", logo: null },
  { slug: "cisco", name: "Cisco", logo: null },
  { slug: "schneider", name: "Schneider Electric", logo: null },
  { slug: "agbe", name: "AGBE-TECH", logo: null },
];

type ProductSeed = {
  name: string;
  slug: string;
  sku: string;
  brandSlug: string;
  categorySlug: string;
  shortDesc: string;
  description: string;
  regularPrice: number;
  promoPrice?: number;
  stock: number;
  warranty: string;
  images: string[];
  attributes: Array<{ name: string; value: string }>;
  tags: string[];
  featured?: boolean;
};

const PRODUCTS: ProductSeed[] = [
  // ── Caméras ──────────────────────────────────────────
  {
    name: "Caméra IP dôme 4MP Hikvision DS-2CD2143G2",
    slug: "camera-ip-dome-4mp-hikvision-ds-2cd2143g2",
    sku: "CAM-HK-2143",
    brandSlug: "hikvision",
    categorySlug: "cameras",
    shortDesc: "Caméra IP dôme 4MP avec AcuSense, vision nocturne 30m, audio.",
    description: "Caméra IP dôme 4 Mégapixels de chez Hikvision avec technologie AcuSense pour une détection intelligente des humains et véhicules. Vision nocturne jusqu'à 30 mètres, audio bidirectionnel intégré, certification IP67 pour usage extérieur. Idéale pour la surveillance de villas, boutiques et entrepôts.",
    regularPrice: 85000,
    promoPrice: 75000,
    stock: 12,
    warranty: "2 ans constructeur",
    images: ["https://images.unsplash.com/photo-1557234195-bd9f8b6f6a3b?w=800&q=80"],
    attributes: [
      { name: "Résolution", value: "4 MP (2560×1440)" },
      { name: "Vision nocturne", value: "30 m IR" },
      { name: "Indice protection", value: "IP67" },
      { name: "Audio", value: "Bidirectionnel" },
    ],
    tags: ["camera-ip", "hikvision", "dome", "4mp", "exterieur"],
    featured: true,
  },
  {
    name: "Caméra bullet 8MP Dahua IPC-HFW3849H1",
    slug: "camera-bullet-8mp-dahua-ipc-hfw3849h1",
    sku: "CAM-DH-3849",
    brandSlug: "dahua",
    categorySlug: "cameras",
    shortDesc: "Caméra bullet 8MP 4K avec IR 50m, WDR, IA Perimeter Protection.",
    description: "Caméra bullet 4K (8MP) Dahua avec vision nocturne intelligente jusqu'à 50m, WDR 120dB, et IA Perimeter Protection pour la détection précise des intrus. Parfaite pour les périmètres sensibles, parkings et zones industrielles.",
    regularPrice: 145000,
    stock: 6,
    warranty: "2 ans constructeur",
    images: ["https://images.unsplash.com/photo-1557234195-bd9f8b6f6a3b?w=800&q=80"],
    attributes: [
      { name: "Résolution", value: "8 MP (4K)" },
      { name: "Vision nocturne", value: "50 m IR" },
      { name: "WDR", value: "120 dB" },
      { name: "IA", value: "Perimeter Protection" },
    ],
    tags: ["camera-ip", "dahua", "bullet", "4k", "ia"],
    featured: true,
  },
  {
    name: "NVR 16 canaux Hikvision DS-7616NI-K2",
    slug: "nvr-16-canaux-hikvision-ds-7616ni-k2",
    sku: "NVR-HK-7616",
    brandSlug: "hikvision",
    categorySlug: "cameras",
    shortDesc: "Enregistreur NVR 16 canaux 4K, 2 disques jusqu'à 10 To chacun.",
    description: "Enregistreur réseau NVR 16 canaux Hikvision DS-7616NI-K2 avec support 4K, jusqu'à 2 disques durs SATA de 10 To chacun (soit 20 To de stockage). Compatible H.265+/H.264+/H.265. Lecture synchrone 16 canaux, recherche intelligente par événement. Idéal pour les installations professionnelles.",
    regularPrice: 285000,
    stock: 4,
    warranty: "2 ans constructeur",
    images: ["https://images.unsplash.com/photo-1558002038-1055907df827?w=800&q=80"],
    attributes: [
      { name: "Canaux", value: "16" },
      { name: "Résolution max", value: "4K (8MP)" },
      { name: "Disques", value: "2× 10 To max" },
      { name: "Compression", value: "H.265+" },
    ],
    tags: ["nvr", "hikvision", "enregistreur", "16-canaux"],
  },

  // ── Solaire ──────────────────────────────────────────
  {
    name: "Panneau solaire 450W monocristalin Jinko Tiger Neo",
    slug: "panneau-solaire-450w-jinko-tiger-neo",
    sku: "SOL-JK-450",
    brandSlug: "agbe",
    categorySlug: "solaire",
    shortDesc: "Panneau 450W monocristalin N-type, rendement 22%, garantie 25 ans.",
    description: "Panneau solaire photovoltaïque 450W Jinko Tiger Neo N-type avec rendement exceptionnel de 22%. Cellules monocristallines N-type pour une meilleure performance en faible éclairage et en chaleur. Garantie produit 12 ans, garantie puissance 25 ans. Idéal pour installations résidentielles et commerciales.",
    regularPrice: 95000,
    promoPrice: 85000,
    stock: 25,
    warranty: "25 ans puissance",
    images: ["https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80"],
    attributes: [
      { name: "Puissance", value: "450 Wc" },
      { name: "Type cellules", value: "Monocristalin N-type" },
      { name: "Rendement", value: "22 %" },
      { name: "Garantie", value: "25 ans puissance" },
    ],
    tags: ["panneau", "solaire", "450w", "monocristalin", "jinko"],
    featured: true,
  },
  {
    name: "Onduleur hybride Growatt SPF 5000ES 5kW",
    slug: "onduleur-hybride-growatt-spf-5000es-5kw",
    sku: "OND-GR-5000",
    brandSlug: "growatt",
    categorySlug: "solaire",
    shortDesc: "Onduleur hybride 5kW 48V, MPPT 500V, sortie 230V pure sinus.",
    description: "Onduleur hybride Growatt SPF 5000ES d'une puissance de 5kW, compatible batteries 48V (LiFePO4 ou plomb). MPPT haute tension 500VDC, rendement MPPT 99.5%. Sortie 230V pure sinus, prise en charge WiFi pour monitoring mobile. Parfait pour autonomie totale d'une villa.",
    regularPrice: 425000,
    stock: 8,
    warranty: "5 ans constructeur",
    images: ["https://images.unsplash.com/photo-1545208942-e1c6f0e2b3a4?w=800&q=80"],
    attributes: [
      { name: "Puissance", value: "5000 W" },
      { name: "Tension batterie", value: "48 V" },
      { name: "MPPT", value: "500 VDC max" },
      { name: "Sortie", value: "230 V pure sinus" },
    ],
    tags: ["onduleur", "hybride", "growatt", "5kw", "mppt"],
    featured: true,
  },
  {
    name: "Batterie LiFePO4 200Ah 48V Pylontech",
    slug: "batterie-lifepo4-200ah-48v-pylontech",
    sku: "BAT-PY-20048",
    brandSlug: "agbe",
    categorySlug: "solaire",
    shortDesc: "Batterie lithium LiFePO4 200Ah 48V, 10.24 kWh, 6000 cycles.",
    description: "Batterie lithium fer phosphate (LiFePO4) Pylontech 200Ah 48V, capacité 10.24 kWh. Plus de 6000 cycles à 80% DoD, BMS intégré avec communication CAN/RS485. Compatible avec la plupart des onduleurs hybrides (Growatt, Victron, Deye). Sécurité: pas de risque d'emballement thermique.",
    regularPrice: 1850000,
    stock: 3,
    warranty: "5 ans constructeur",
    images: ["https://images.unsplash.com/photo-1609205807107-e1d7a14ec5a4?w=800&q=80"],
    attributes: [
      { name: "Capacité", value: "10.24 kWh" },
      { name: "Tension", value: "48 V" },
      { name: "Cycles", value: "6000+ à 80% DoD" },
      { name: "Technologie", value: "LiFePO4" },
    ],
    tags: ["batterie", "lifepo4", "pylontech", "48v", "stockage"],
  },

  // ── Réseau ───────────────────────────────────────────
  {
    name: "Switch PoE+ 24 ports TP-Link TL-SG2218P",
    slug: "switch-poe-24-ports-tp-link-tl-sg2218p",
    sku: "SW-TP-2218",
    brandSlug: "tp-link",
    categorySlug: "reseau",
    shortDesc: "Switch administrable 24 ports Gigabit PoE+ 195W, 4 ports SFP.",
    description: "Switch administrable L2+ TP-Link TL-SG2218P — 24 ports Gigabit PoE+ (budget 195W) et 4 ports SFP. Idéal pour la vidéosurveillance IP et le déploiement Wi-Fi entreprise. Supporte VLAN, QoS, LAG, IGMP Snooping. Interface web intuitive, garantie à vie.",
    regularPrice: 285000,
    stock: 7,
    warranty: "Garantie à vie",
    images: ["https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80"],
    attributes: [
      { name: "Ports", value: "24× Gigabit PoE+" },
      { name: "Budget PoE", value: "195 W" },
      { name: "Uplink", value: "4× SFP" },
      { name: "Niveau", value: "L2+" },
    ],
    tags: ["switch", "poe", "tp-link", "24-ports", "administrable"],
  },
  {
    name: "Point d'accès Wi-Fi 6 TP-Link EAP670",
    slug: "point-acces-wifi-6-tp-link-eap670",
    sku: "AP-TP-670",
    brandSlug: "tp-link",
    categorySlug: "reseau",
    shortDesc: "AP Wi-Fi 6 AX5400, jusqu'à 200 clients, PoE+, mesh.",
    description: "Point d'accès Wi-Fi 6 TP-Link EAP670 — débit jusqu'à 5378 Mbps (AX5400), prend en charge jusqu'à 200+ clients simultanés. Parfait pour hôtels, bureaux, ERP. Fonctionnalités: mesh seamless roaming, VLAN, captive portal, gestion centralisée Omada.",
    regularPrice: 95000,
    stock: 10,
    warranty: "3 ans constructeur",
    images: ["https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=800&q=80"],
    attributes: [
      { name: "Standard", value: "Wi-Fi 6 (802.11ax)" },
      { name: "Débit", value: "5378 Mbps" },
      { name: "Clients", value: "200+" },
      { name: "PoE", value: "PoE+ (802.3at)" },
    ],
    tags: ["wifi-6", "tp-link", "ap", "entreprise", "mesh"],
  },

  // ── Électricité ──────────────────────────────────────
  {
    name: "Tableau électrique 3 rangées 13 modules pré-équipé",
    slug: "tableau-electrique-3-rangees-13-modules",
    sku: "ELEC-TAB-13",
    brandSlug: "schneider",
    categorySlug: "electricite",
    shortDesc: "Tableau 13 modules avec disjoncteur différentiel 30mA + 8 disjoncteurs.",
    description: "Tableau électrique complet 3 rangées / 13 modules Schneider Electric. Inclus: 1 disjoncteur de branchement 32A, 1 interrupteur différentiel 30mA 40A type AC, 8 disjoncteurs modulaires (10A prises, 16A prise, 20A spécialisé, 2A éclairage). Conforme NFC 15-100, prêt à installer.",
    regularPrice: 135000,
    stock: 15,
    warranty: "2 ans",
    images: ["https://images.unsplash.com/photo-1621905251189-08b45d6a5797?w=800&q=80"],
    attributes: [
      { name: "Modules", value: "13" },
      { name: "Rangées", value: "3" },
      { name: "Différentiel", value: "30 mA type AC" },
      { name: "Norme", value: "NFC 15-100" },
    ],
    tags: ["tableau", "electrique", "schneider", "13-modules"],
  },

  // ── Télécom ─────────────────────────────────────────
  {
    name: "Radio PtP Ubiquiti airFiber 5XHD 5GHz",
    slug: "radio-ptp-ubiquiti-airfiber-5xhd",
    sku: "RADIO-UB-AF5XHD",
    brandSlug: "agbe",
    categorySlug: "telecom",
    shortDesc: "Radio point-à-point 5GHz, débit 500Mbps, portée 30+ km.",
    description: "Radio Ubiquiti airFiber 5XHD pour liaison point-à-point longue distance 5GHz. Débit jusqu'à 500 Mbps (half-duplex) ou 1 Gbps (full-duplex). Latence < 2ms. Portée jusqu'à 30+ km selon antenne. Idéal pour connecter des sites distants, fournir de l'accès Internet ou relier plusieurs bâtiments.",
    regularPrice: 425000,
    stock: 5,
    warranty: "1 an constructeur",
    images: ["https://images.unsplash.com/photo-1593784991095-a850d71472c4?w=800&q=80"],
    attributes: [
      { name: "Bande", value: "5 GHz" },
      { name: "Débit", value: "500 Mbps HD / 1 Gbps FD" },
      { name: "Portée", value: "30+ km" },
      { name: "Latence", value: "< 2 ms" },
    ],
    tags: ["radio", "ptp", "ubiquiti", "liaison", "longue-distance"],
    featured: true,
  },

  // ── Électricité bâtiment — seconde référence ────────
  {
    name: "Disjoncteur différentiel 30mA 40A type A Schneider",
    slug: "disjoncteur-differentiel-30ma-40a-schneider",
    sku: "ELEC-DD-40A",
    brandSlug: "schneider",
    categorySlug: "electricite",
    shortDesc: "Disjoncteur différentiel 30mA 40A type A, 4 modules, idéal cuisine/SDB.",
    description: "Interrupteur différentiel Schneider Electric 30mA 40A type A (AC+DC). Protège les personnes contre les fuites de courant, y compris sur charges électroniques (lave-linge, plaque induction, four). 4 modules, 30mA haute sensibilité, conforme NF C 15-100.",
    regularPrice: 28500,
    stock: 30,
    warranty: "2 ans",
    images: ["https://images.unsplash.com/photo-1565607754907-1b6a3a3d7c8a?w=800&q=80"],
    attributes: [
      { name: "Calibre", value: "40 A" },
      { name: "Sensibilité", value: "30 mA type A" },
      { name: "Modules", value: "4" },
      { name: "Norme", value: "NF C 15-100" },
    ],
    tags: ["disjoncteur", "differentiel", "schneider", "securite"],
  },
];

const BLOG_POSTS = [
  {
    slug: "comment-choisir-camera-surveillance-lome",
    title: "Comment choisir sa caméra de surveillance à Lomé ?",
    excerpt: "Résolution, vision nocturne, IP66, IA AcuSense — notre guide complet pour bien équiper votre villa ou entreprise au Togo.",
    content: `## Les 5 critères essentiels

Choisir une caméra de surveillance adaptée à Lomé nécessite de comprendre quelques critères techniques. Voici les 5 points à vérifier absolument.

### 1. La résolution

Privilégiez au minimum du **4 MP (2560×1440)** pour pouvoir identifier les visages et les plaques d'immatriculation. Le 8 MP (4K) est recommandé pour les zones sensibles (entrées, parkings).

### 2. La vision nocturne

À Lomé, les coupures de courant sont fréquentes. Optez pour des caméras avec vision nocturne IR **30m minimum**, et idéalement avec détection de mouvement IA pour ne pas stocker 8h de vidéo inutile.

### 3. L'indice de protection (IP)

Pour l'extérieur, exigez l'**IP66 ou IP67** — résistant à la poussière et aux fortes pluies tropicales.

### 4. L'alimentation PoE

Privilégiez les caméras **PoE (Power over Ethernet)** — un seul câble Cat6 transporte l'alimentation ET les données. Installation plus simple, plus fiable.

### 5. La marque

Hikvision et Dahua dominent le marché togolais. Préférez-les pour la disponibilité des pièces, le SAV local et la compatibilité avec les NVR standards.

## Notre recommandation

Pour une villa standard à Lomé (4 angles + entrée), un pack de **4 caméras IP dôme 4MP + 1 NVR 8 canaux + 1 disque 2 To** revient à environ 350 000 FCFA posé. Devis gratuit sur demande.`,
    cover: "https://images.unsplash.com/photo-1557234195-bd9f8b6f6a3b?w=1200&q=80",
    tags: ["camera", "videosurveillance", "guide", "lome"],
    published: true,
  },
  {
    slug: "dimensionnement-installation-solaire-villa-togo",
    title: "Dimensionner son installation solaire au Togo : le guide",
    excerpt: "Combien de panneaux pour une villa à Lomé ? Quelle batterie ? Quel onduleur ? On vous explique tout avec un cas concret.",
    content: `## Le constat

Au Togo, le tarif CEET est élevé (~92 FCFA/kWh) et les coupures sont fréquentes. Une installation solaire bien dimensionnée permet une autonomie totale ou partielle avec un retour sur investissement en **4 à 7 ans**.

## La méthode en 4 étapes

### Étape 1 : Calculer votre consommation journalière

Listez vos appareils + leur puissance + leur durée d'utilisation :

- Climatiseur 12000 BTU : 1200W × 8h = 9.6 kWh/jour
- Réfrigérateur : 150W × 24h (cycle 30%) = 1.1 kWh/jour
- Éclairage LED × 10 : 80W × 5h = 0.4 kWh/jour
- TV + décodeur : 150W × 5h = 0.75 kWh/jour
- Pompe à eau : 750W × 1h = 0.75 kWh/jour

**Total : ~12.6 kWh/jour**

### Étape 2 : Dimensionner les panneaux

À Lomé, l'ensoleillement moyen est de **5.5 kWh/m²/jour**. Comptez un rendement global de 75% (pertes onduleur, câbles, chaleur).

Puissance crête nécessaire = 12.6 / (5.5 × 0.75) ≈ **3 kWc**

Soit **7 panneaux de 450W** (à 95 000 FCFA/unité = 665 000 FCFA).

### Étape 3 : Dimensionner les batteries

Pour une autonomie de 24h (sans soleil), stockage nécessaire = 12.6 / 0.8 (DoD LiFePO4) = **16 kWh**.

Soit **1 batterie LiFePO4 48V 200Ah (10 kWh)** + 1 seconde plus petite, OU directement 2× 200Ah = **20 kWh** (marge confort).

### Étape 4 : L'onduleur

Puissance onduleur = somme des puissances démarrables × 1.2.

Pour notre cas : clim 1200W (démarrage 3500W) + autres 1500W = **5 kW recommandé**.

## Budget total estimé

- Panneaux 3 kWc : 665 000 FCFA
- Onduleur hybride 5 kW Growatt : 425 000 FCFA
- Batteries LiFePO4 20 kWh : 3 700 000 FCFA
- Pose + câblage + BOM : 800 000 FCFA

**Total : ~5.6 millions FCFA TTC**

Avec une économie de 80 000 FCFA/mois sur la facture CEET, retour sur investissement en **5.8 ans**. Les 20 années suivantes sont gratuites.

## Conclusion

Bien dimensionner son solaire est essentiel pour éviter les déceptions. Contactez AGBE-TECH pour un devis personnalisé gratuit.`,
    cover: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200&q=80",
    tags: ["solaire", "guide", "dimensionnement", "togo"],
    published: true,
  },
  {
    slug: "mise-aux-normes-electriques-batiment-togo",
    title: "Mise aux normes électriques : pourquoi et combien ?",
    excerpt: "NFC 15-100, certificat CEBA, disjoncteur différentiel 30mA — tout ce qu'il faut savoir pour sécuriser votre bâtiment au Togo.",
    content: `## Pourquoi mettre aux normes ?

Une installation électrique non conforme présente 3 risques majeurs :

1. **Risque d'incendie** (30% des incendies domestiques au Togo sont d'origine électrique)
2. **Risque d'électrocution** (surtout dans les pièces humides : cuisine, SDB)
3. **Refus d'assurance** en cas de sinistre (l'assureur exige un certificat de conformité)

## Les obligations de la norme NFC 15-100

### 1. Le tableau électrique

Doit comporter au minimum :
- 1 disjoncteur de branchement (32A ou 60A)
- 1 interrupteur différentiel 30mA **par circuit** cuisine/SDB
- 1 disjoncteur par circuit (éclairage 10A, prises 16/20A, spécialisé 20A)

### 2. La mise à la terre

Une terre de **< 100 ohms** est obligatoire. Sans terre, le différentiel 30mA ne peut pas fonctionner correctement.

### 3. Les protections

- Prises avec obturateurs (sécurité enfants)
- Éclairage SDB en très basse tension (12V) ou IP44 minimum
- Distance minimum 60cm entre point d'eau et prise

## Le certificat CEBA

Le **Consuel Électrique du Bâtiment Agréé** est obligatoire :
- Pour toute nouvelle installation
- Pour une mise aux normes complète
- Avant la revente d'un bien immobilier

Le CEBA est délivré après inspection par un organisme agréé. Coût : ~25 000 FCFA.

## Combien coûte une mise aux normes ?

| Type de logement | Surface | Budget estimé |
|------------------|---------|----------------|
| Studio / T1 | < 40 m² | 180 000 - 250 000 FCFA |
| Villa 3 chambres | 120 m² | 350 000 - 500 000 FCFA |
| Immeuble R+1 | 200 m² | 600 000 - 900 000 FCFA |
| Local commercial | 150 m² | 400 000 - 650 000 FCFA |

## La méthode AGBE-TECH

1. Diagnostic complet gratuit (1h sur place)
2. Devis détaillé avec plan de mise aux normes
3. Intervention en 1-3 jours selon l'ampleur
4. Délivrance du certificat CEBA sous 2 semaines

**Astuce** : si vous prévoyez des travaux (peinture, carrelage), profitez-en pour mettre aux normes l'électrique en même temps — vous économisez sur la main d'œuvre.

Contactez-nous pour un diagnostic gratuit à Lomé.`,
    cover: "https://images.unsplash.com/photo-1621905251189-08b45d6a5797?w=1200&q=80",
    tags: ["electricite", "mise-aux-normes", "ceba", "guide"],
    published: true,
  },
  {
    slug: "câblage-reseau-cat6-entreprise-togo",
    title: "Câblage réseau Cat6 pour entreprise : 7 erreurs à éviter",
    excerpt: "Retour d'expérience sur 500+ chantiers de câblage réseau au Togo. Les erreurs qui coûtent cher et comment les éviter.",
    content: `## Introduction

Après 500+ chantiers de câblage réseau au Togo, nous avons identifié 7 erreurs récurrentes qui coûtent cher (en performance, en maintenance, et parfois en sécurité).

## Les 7 erreurs à éviter

### 1. Utiliser du Cat5e au lieu de Cat6

Le Cat5e supporte 1 Gbps sur 100m, le Cat6 supporte **10 Gbps sur 55m**. Pour 30% de surcoût, vous future-proof votre installation pour 15-20 ans.

### 2. Négliger le cheminement

Un câble réseau ne se pose pas n'importe où :
- Évitez de le faire courir parallèlement aux câbles électriques (interférences)
- Minimum **30 cm d'écart** avec les câbles 220V
- Utilisez des goulottes ou chemins de câbles dédiés

### 3. Mal sertir les connecteurs RJ45

Erreur n°1 des installations DIY :
- Torsadez les paires le **moins possible** (max 1.5 cm détorsadé)
- Respectez la norme **T568B** (majoritaire au Togo)
- Testez chaque câble avec un testeur LAN avant de fermer les gaines

### 4. Oublier la baie de brassage

Sans baie de brassage organisée, votre local réseau devient rapidement un chaos. Investissez dans :
- Une baie 19" 12U ou 24U (selon besoin)
- Des panneaux de brassage Cat6 (24 ports)
- Un organiseur de câbles horizontal par 2U

### 5. Sous-estimer le PoE

Si vous prévoyez des caméras IP, des AP Wi-Fi ou des téléphones VoIP, **utilisez du switch PoE+** (802.3at, 30W par port). Prévoyez un budget PoE de **1.5× la somme des puissances** des équipements (marge de sécurité).

### 6. Pas de plan avant de poser

Toujours dessiner un plan :
- Position des prises réseau (1 par bureau + 1 par local technique)
- Cheminement des câbles (avec longueurs)
- Prévision de **20% de câbles en réserve** (extensions futures)

### 7. Oublier l'étiquetage

Chaque câble doit être étiqueté aux **deux extrémités** avec le même numéro. Utilisez une imprimante d'étiquettes thermique ( Brother PT-E550W par exemple). Cela vous sauvera des heures de debugging.

## Conclusion

Un bon câblage réseau Cat6 correctement réalisé dure 20 ans sans intervention. Les économies sur les matériaux (câble discount, pas de baie) coûtent très cher en maintenance. Investissez dans la qualité dès le départ.

AGBE-TECH réalise des installations de câblage réseau certifiées (test Fluke fourni) à Lomé et dans tout le Togo. Devis gratuit.`,
    cover: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1200&q=80",
    tags: ["reseau", "cat6", "cablage", "guide"],
    published: true,
  },
];

const REALISATIONS = [
  {
    slug: "installation-solaire-villa-agoe",
    title: "Autonomie solaire totale — Villa 5 pièces Agoè",
    category: "solar",
    client: "Privé (M. K.)",
    location: "Agoè-Nyivé, Lomé",
    description: "Installation d'un système solaire hybride 6 kWc pour une villa de 5 pièces avec 2 climatisations. Objectif : autonomie totale, élimination de la facture CEET. Solution livrée : 12 panneaux Jinko 450W + onduleur Growatt 5kW + batterie LiFePO4 10 kWh. Production moyenne : 28 kWh/jour. Autonomie sans soleil : 24h. Économie annuelle : 1 200 000 FCFA.",
    images: '["https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200&q=80"]',
    date: "2026-02-15",
    featured: true,
  },
  {
    slug: "videosurveillance-pharmacie-kegue",
    title: "Vidéosurveillance 8 caméras — Pharmacie Kégué",
    category: "camera",
    client: "Pharmacie Kégué",
    location: "Kégué, Lomé",
    description: "Déploiement d'un système complet de vidéosurveillance pour la Pharmacie Kégué : 8 caméras IP Hikvision 4MP (intérieures + extérieures), NVR 16 canaux avec 2 disques 4 To (60 jours de stockage), accès mobile sécurisé pour le gérant. Installation réalisée en 1 journée, hors heures d'ouverture.",
    images: '["https://images.unsplash.com/photo-1557234195-bd9f8b6f6a3b?w=1200&q=80"]',
    date: "2026-01-20",
    featured: true,
  },
  {
    slug: "cablage-reseau-ecole-privee",
    title: "Câblage réseau Cat6 — École privée Agoè",
    category: "network",
    client: "École privée (Confidentiel)",
    location: "Agoè-Nyivé, Lomé",
    description: "Câblage réseau Cat6 structuré pour une école privée de 24 salles de classe : 4 switchs administrables TP-Link 24 ports PoE+, 12 points d'accès Wi-Fi 6 pour roaming seamless, 600+ prises RJ45 certifiées, baie de brassage 24U avec organizeurs. Tests Fluke fournis pour toutes les liaisons. Projet livré en 5 jours.",
    images: '["https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1200&q=80"]',
    date: "2025-11-10",
    featured: false,
  },
  {
    slug: "mise-aux-normes-batiment-administratif",
    title: "Mise aux normes électriques — Bâtiment administratif",
    category: "electricity",
    client: "Institution publique",
    location: "Tokoin, Lomé",
    description: "Rénovation complète du tableau électrique d'un bâtiment administratif de 3 étages : remplacement de l'ancien tableau, mise aux normes NFC 15-100 complète, installation de 6 armoires divisionnaires, 200 disjoncteurs différentiels 30mA type A, mise à la terre refaite (terre 8 ohms). Certificat CEBA délivré après inspection.",
    images: '["https://images.unsplash.com/photo-1621905251189-08b45d6a5797?w=1200&q=80"]',
    date: "2025-09-25",
    featured: true,
  },
  {
    slug: "faisceau-hertzien-entreprise-sokode",
    title: "Liaison faisceau hertzien 15 km — Entreprise Sokodé",
    category: "telecom",
    client: "Entreprise agroalimentaire",
    location: "Sokodé → Atakpamé",
    description: "Déploiement d'une liaison faisceau hertzien Ubiquiti airFiber 5XHD entre deux sites distants de 15 km (bureau Sokodé → site de production Atakpamé). Débit 500 Mbps half-duplex, latence < 2ms. Étude LOS préalable, pose sur mâts 12m des deux côtés. Solution alternative à la fibre optique, 60% moins chère.",
    images: '["https://images.unsplash.com/photo-1593784991095-a850d71472c4?w=1200&q=80"]',
    date: "2025-08-12",
    featured: false,
  },
  {
    slug: "kit-solaire-pour-clinique-kara",
    title: "Kit solaire secours — Clinique privée Kara",
    category: "solar",
    client: "Clinique privée",
    location: "Kara",
    description: "Installation d'un kit solaire de secours pour une clinique privée à Kara : 8 panneaux 450W + onduleur hybride 5kW + batterie 10 kWh. Objectif : maintenir le fonctionnement des équipements critiques (réfrigérateur vaccins, éclairage bloc opératoire) pendant les coupures électriques. Autonomie 12h sur charge critique.",
    images: '["https://images.unsplash.com/photo-1545208942-e1c6f0e2b3a4?w=1200&q=80"]',
    date: "2025-07-05",
    featured: false,
  },
];

const TESTIMONIALS = [
  {
    name: "Kossi Mensah",
    role: "Gérant",
    company: "Pharmacie Kégué",
    rating: 5,
    content: "Installation de vidéosurveillance impeccable. Travail soigné, équipe professionnelle, prix correct. Le gérant peut maintenant surveiller sa pharmacie à distance depuis son téléphone. Je recommande AGBE-TECH.",
    published: true,
  },
  {
    name: "Afi Dzifa",
    role: "Propriétaire",
    company: "Privé",
    rating: 5,
    content: "Mon installation solaire tourne sans souci depuis 2 ans. Facture CEET divisée par 4. Merci à toute l'équipe pour le suivi et le professionnalisme.",
    published: true,
  },
  {
    name: "Komlan Agbodjan",
    role: "Directeur technique",
    company: "Entreprise agroalimentaire",
    rating: 5,
    content: "Liaison faisceau hertzien installée entre Sokodé et Atakpamé. Débit garanti, latence faible, équipe réactive. Solution plus économique que la fibre, délai d'installation court.",
    published: true,
  },
  {
    name: "M. Adjamagbo",
    role: "Directeur",
    company: "École privée Agoè",
    rating: 5,
    content: "Câblage réseau pour 24 salles de classe réalisé pendant les vacances scolaires en 5 jours. Tests Fluke fournis pour chaque prise. Rien à redire sur la qualité.",
    published: true,
  },
];

export async function seedProduction(db: PrismaClient) {
  console.log("→ Catégories...");
  for (const cat of CATEGORIES) {
    await db.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  console.log("→ Marques...");
  for (const brand of BRANDS) {
    await db.brand.upsert({
      where: { slug: brand.slug },
      update: {},
      create: brand,
    });
  }

  console.log("→ Produits...");
  for (const p of PRODUCTS) {
    const category = await db.category.findUnique({ where: { slug: p.categorySlug } });
    const brand = await db.brand.findUnique({ where: { slug: p.brandSlug } });
    if (!category || !brand) continue;
    await db.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        name: p.name,
        slug: p.slug,
        sku: p.sku,
        shortDesc: p.shortDesc,
        description: p.description,
        categoryId: category.id,
        brandId: brand.id,
        regularPrice: p.regularPrice,
        promoPrice: p.promoPrice ?? null,
        stock: p.stock,
        warranty: p.warranty,
        images: JSON.stringify(p.images),
        tags: JSON.stringify(p.tags),
        attributes: JSON.stringify(p.attributes),
        status: "ACTIVE",
        pricingMode: "PRICE",
        featured: p.featured ?? false,
      },
    });
  }

  console.log("→ Articles de blog...");
  for (const b of BLOG_POSTS) {
    await db.blogPost.upsert({
      where: { slug: b.slug },
      update: {},
      create: {
        ...b,
        tags: JSON.stringify(b.tags),
      },
    });
  }

  console.log("→ Réalisations...");
  for (const r of REALISATIONS) {
    await db.realization.upsert({
      where: { slug: r.slug },
      update: {},
      create: {
        ...r,
        date: new Date(r.date),
      },
    });
  }

  console.log("→ Témoignages...");
  for (const t of TESTIMONIALS) {
    const existing = await db.testimonial.findFirst({ where: { name: t.name, content: t.content } });
    if (!existing) {
      await db.testimonial.create({ data: t });
    }
  }

  console.log(`✓ Seed terminé : ${PRODUCTS.length} produits, ${BLOG_POSTS.length} articles, ${REALISATIONS.length} réalisations, ${TESTIMONIALS.length} témoignages.`);
}
