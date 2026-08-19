/**
 * AGBE-TECH — seed data
 * Run: bun run db:seed
 */
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

const CATEGORIES = [
  { slug: 'cameras', name: 'Caméras de surveillance', icon: 'cctv', description: 'Caméras IP, analogiques, PTZ, dôme, bullet — Hikvision, Dahua et plus.' },
  { slug: 'solaire', name: 'Solaire & énergie', icon: 'sun', description: 'Panneaux solaires, batteries, onduleurs, kits complets.' },
  { slug: 'reseau', name: 'Réseau informatique', icon: 'network', description: 'Switchs, routeurs, AP Wi-Fi, baies de brassage, câbles.' },
  { slug: 'electricite', name: 'Électricité bâtiment', icon: 'bolt', description: 'Disjoncteurs, armoires, câbles, prises, tableaux électriques.' },
  { slug: 'telecom', name: 'Liaison longue distance', icon: 'antenna', description: 'Antennes, radios, faisceaux hertziens pour liaisons longues distances.' },
];

const BRANDS = [
  { slug: 'hikvision', name: 'Hikvision' },
  { slug: 'dahua', name: 'Dahua' },
  { slug: 'growatt', name: 'Growatt' },
  { slug: 'victron', name: 'Victron Energy' },
  { slug: 'tp-link', name: 'TP-Link' },
  { slug: 'cisco', name: 'Cisco' },
  { slug: 'schneider', name: 'Schneider Electric' },
  { slug: 'agbe', name: 'AGBE-TECH' },
];

const PRODUCTS = [
  {
    name: 'Caméra IP dôme 4MP Hikvision DS-2CD2143G2',
    slug: 'camera-ip-dome-4mp-hikvision',
    sku: 'CAM-HK-2143',
    brandSlug: 'hikvision',
    categorySlug: 'cameras',
    shortDesc: 'Caméra IP dôme 4 Mégapixels avec AcuSense, vision nocturne 30 m, audio.',
    description: 'La caméra IP dôme Hikvision DS-2CD2143G2-I offre une résolution 4MP avec la technologie AcuSense pour la détection intelligente des humaines et véhicules. Vision nocturne jusqu\'à 30 m avec True WDR 120 dB. Indice de protection IP67, idéal pour extérieur. Compatible NVR Hikvision et ONVIF. Alimentation PoE 802.3af.',
    regularPrice: 95000,
    stock: 12,
    warranty: '24 mois',
    attributes: JSON.stringify([
      { name: 'Type', value: 'IP dôme' },
      { name: 'Résolution', value: '4 MP (2560×1440)' },
      { name: 'Vision nocturne', value: '30 m IR' },
      { name: 'Protection', value: 'IP67' },
      { name: 'Alimentation', value: 'PoE 802.3af / 12V DC' },
      { name: 'Stockage', value: 'microSD 256 Go + NVR' },
    ]),
    tags: JSON.stringify(['ip', 'dome', '4mp', 'exterieur']),
    featured: true,
  },
  {
    name: 'Caméra Bullet 2MP Dahua IPC-HFW1200S',
    slug: 'camera-bullet-2mp-dahua',
    sku: 'CAM-DH-1200',
    brandSlug: 'dahua',
    categorySlug: 'cameras',
    shortDesc: 'Caméra bullet 2MP, vision nocturne IR 30m, IP67, économique et fiable.',
    description: 'Caméra bullet Dahua IPC-HFW1200S-S5 — résolution 2MP 1080p, IR jusqu\'à 30 m, IP67, détection de mouvement intelligent (SMD). Idéale pour la surveillance des boutiques, maisons et entrepôts à Lomé.',
    regularPrice: 55000,
    promoPrice: 49000,
    stock: 25,
    warranty: '24 mois',
    attributes: JSON.stringify([
      { name: 'Type', value: 'Bullet IP' },
      { name: 'Résolution', value: '2 MP (1920×1080)' },
      { name: 'Vision nocturne', value: '30 m IR' },
      { name: 'Protection', value: 'IP67' },
      { name: 'Alimentation', value: 'PoE / 12V DC' },
      { name: 'Stockage', value: 'microSD + NVR' },
    ]),
    tags: JSON.stringify(['ip', 'bullet', '2mp', 'exterieur']),
    featured: true,
  },
  {
    name: 'Panneau solaire monocristallin 450 Wc',
    slug: 'panneau-solaire-450wc-monocristallin',
    sku: 'SOL-PN-450',
    brandSlug: 'agbe',
    categorySlug: 'solaire',
    shortDesc: 'Panneau solaire 450 Wc monocristallin, rendement 21%, garantie 12 ans.',
    description: 'Panneau solaire photovoltaïque 450 Wc monocristallin half-cut — haut rendement 21%, cellules PERC. Idéal pour installations résidentielles et commerciales au Togo. Garantie linéaire 25 ans, garantie produit 12 ans. Cadre aluminium anodisé, verre trempé 3.2 mm. Tension Vmp 41.5 V, Imp 10.85 A.',
    regularPrice: 130000,
    stock: 40,
    warranty: '12 ans produit / 25 ans linéaire',
    attributes: JSON.stringify([
      { name: 'Puissance (Wc)', value: '450 Wc' },
      { name: 'Technologie', value: 'Monocristallin half-cut PERC' },
      { name: 'Vmp / Imp', value: '41.5 V / 10.85 A' },
      { name: 'Rendement', value: '21 %' },
      { name: 'Cellules', value: '144 (6×24)' },
      { name: 'Garantie', value: '12 ans produit, 25 ans linéaire' },
    ]),
    tags: JSON.stringify(['panneau', 'monocristallin', '450wc', 'residentiel']),
    featured: true,
  },
  {
    name: 'Batterie LiFePO4 100 Ah 12V',
    slug: 'batterie-lifepo4-100ah-12v',
    sku: 'SOL-BT-100',
    brandSlug: 'agbe',
    categorySlug: 'solaire',
    shortDesc: 'Batterie lithium LiFePO4 100 Ah 12V — 6000 cycles, BMS intégré.',
    description: 'Batterie lithium fer phosphate (LiFePO4) 100 Ah 12V — longue durée de vie 6000 cycles à 80% DOD. BMS intégré protégeant contre surcharge, décharge profonde, surintensité. Idéale pour stockage solaire, alarmes, applications marine. Poids 12 kg. Tension de charge 14.4 V, décharge 10 V.',
    regularPrice: 420000,
    stock: 8,
    warranty: '5 ans',
    attributes: JSON.stringify([
      { name: 'Capacité', value: '100 Ah' },
      { name: 'Tension nominale', value: '12.8 V' },
      { name: 'Technologie', value: 'LiFePO4' },
      { name: 'Cycles', value: '6000 @ 80% DOD' },
      { name: 'BMS', value: 'Intégré' },
      { name: 'Poids', value: '12 kg' },
    ]),
    tags: JSON.stringify(['batterie', 'lifepo4', 'lithium']),
    featured: true,
  },
  {
    name: 'Onduleur hybride Growatt 5 kW 48V',
    slug: 'onduleur-hybride-growatt-5kw',
    sku: 'SOL-ON-5K',
    brandSlug: 'growatt',
    categorySlug: 'solaire',
    shortDesc: 'Onduleur hybride 5 kW 48V Growatt SPF 5000ES — MPPT 5000W, AC 230V.',
    description: 'Onduleur hybride Growatt SPF 5000ES 5 kVA 48V — MPPT 5000W intégré, sortie 230V pure sinusoïde. Compatible batteries lithium et plomb. Idéal pour installations solaires résidentielles et professionnelles au Togo. Tension PV max 120VDC, courant max 100A. Affichage LCD.',
    regularPrice: 480000,
    stock: 5,
    warranty: '5 ans',
    attributes: JSON.stringify([
      { name: 'Puissance', value: '5 kW / 5 kVA' },
      { name: 'Tension batterie', value: '48 V' },
      { name: 'MPPT', value: '5000 W, 120 VDC max' },
      { name: 'Sortie AC', value: '230 V pure sinusoïde' },
      { name: 'Rendement', value: '93 %' },
      { name: 'Garantie', value: '5 ans' },
    ]),
    tags: JSON.stringify(['onduleur', 'hybride', 'growatt', '5kw']),
    featured: false,
  },
  {
    name: 'Switch Gigabit 24 ports PoE+ TP-Link TL-SG2218P',
    slug: 'switch-gigabit-24p-poe-tplink',
    sku: 'NET-SW-24P',
    brandSlug: 'tp-link',
    categorySlug: 'reseau',
    shortDesc: 'Switch administrable 24 ports Gigabit PoE+ 195W, 4 ports SFP.',
    description: 'Switch administrable TP-Link TL-SG2218P — 24 ports Gigabit PoE+ (budget 195W), 4 ports SFP. Idéal pour la vidéosurveillance IP et le déploiement Wi-Fi entreprise. Supporte VLAN, QoS, LAG, IGMP Snooping. Interface web intuitive.',
    regularPrice: 285000,
    stock: 6,
    warranty: '5 ans',
    attributes: JSON.stringify([
      { name: 'Type', value: 'Switch administrable L2+' },
      { name: 'Ports', value: '24× Gigabit PoE+ + 4× SFP' },
      { name: 'Budget PoE', value: '195 W' },
      { name: 'Vitesse', value: 'Gigabit 1 Gbps' },
      { name: 'VLAN / QoS', value: 'Oui / Oui' },
      { name: 'Gestion', value: 'Web, SNMP' },
    ]),
    tags: JSON.stringify(['switch', 'gigabit', 'poe', 'tplink']),
    featured: false,
  },
  {
    name: 'Point d\'accès Wi-Fi 6 TP-Link EAP670',
    slug: 'ap-wifi6-tplink-eap670',
    sku: 'NET-AP-670',
    brandSlug: 'tp-link',
    categorySlug: 'reseau',
    shortDesc: 'Point d\'accès Wi-Fi 6 AX5400, 4.8 Gbps, PoE+, gestion cloud.',
    description: 'Point d\'accès TP-Link EAP670 — Wi-Fi 6 AX5400, dual-band 4804 Mbps + 574 Mbps. Jusqu\'à 200 clients connectés. PoE+ 802.3at. Gestion centralisée via Omada SDN (cloud). Idéal hôtels, écoles, bureaux à Lomé.',
    regularPrice: 175000,
    stock: 10,
    warranty: '3 ans',
    attributes: JSON.stringify([
      { name: 'Type', value: 'Point d\'accès' },
      { name: 'Norme Wi-Fi', value: 'Wi-Fi 6 (802.11ax)' },
      { name: 'Débit', value: 'AX5400 (5400 Mbps)' },
      { name: 'Clients', value: '200+ simultanés' },
      { name: 'PoE', value: '802.3at PoE+' },
      { name: 'Gestion', value: 'Omada SDN cloud' },
    ]),
    tags: JSON.stringify(['wifi6', 'ap', 'entreprise']),
    featured: false,
  },
  {
    name: 'Disjoncteur différentiel 30 mA Schneider 2P 40A',
    slug: 'disjoncteur-diff-30ma-schneider-2p-40a',
    sku: 'ELE-DJ-2P40',
    brandSlug: 'schneider',
    categorySlug: 'electricite',
    shortDesc: 'Disjoncteur différentiel 2P 40A 30mA type AC — protection des personnes.',
    description: 'Disjoncteur différentiel Schneider Electric 2P 40A 30mA type AC — protection contre les fuites de courant et contacts indirects. Conforme à la norme NFC 15-100. Idéal pour tableaux électriques résidentiels et tertiaires. Courant de court-circuit 6000 A.',
    regularPrice: 18000,
    stock: 30,
    warranty: '2 ans',
    attributes: JSON.stringify([
      { name: 'Type', value: 'Différentiel' },
      { name: 'Calibre', value: '40 A' },
      { name: 'Sensibilité', value: '30 mA type AC' },
      { name: 'Pôles', value: '2P' },
      { name: 'Tension', value: '220/240 V' },
      { name: 'Normes', value: 'CE, NFC 15-100, IEC 61008' },
    ]),
    tags: JSON.stringify(['disjoncteur', 'differentiel', 'schneider']),
    featured: false,
  },
  {
    name: 'Câble Cat6 UTP 305 m cuivre (boîte)',
    slug: 'cable-cat6-utp-305m-cuivre',
    sku: 'NET-CB-CAT6',
    brandSlug: 'agbe',
    categorySlug: 'reseau',
    shortDesc: 'Câble Cat6 UTP 100% cuivre, 305 m par boîte, certification ANSI/TIA.',
    description: 'Boîte de câble Cat6 UTP 100% cuivre 24 AWG, longueur 305 m. Bande passante 250 MHz. Certification ANSI/TIA-568.2-D et ISO/IEC 11801. Conducteurs cuivre nu (non CCA) pour performance maximale. Gaine LSZH. Idéal pour câblage réseau structuré en entreprise.',
    regularPrice: 75000,
    stock: 20,
    warranty: '10 ans',
    attributes: JSON.stringify([
      { name: 'Type', value: 'Câble réseau' },
      { name: 'Catégorie', value: 'Cat6 UTP' },
      { name: 'Longueur', value: '305 m (1000 ft)' },
      { name: 'Conducteur', value: 'Cuivre 24 AWG' },
      { name: 'Bande passante', value: '250 MHz' },
      { name: 'Norme', value: 'ANSI/TIA-568.2-D' },
    ]),
    tags: JSON.stringify(['cable', 'cat6', 'cuivre']),
    featured: false,
  },
  {
    name: 'Kit solaire hybride 3 kVA maison',
    slug: 'kit-solaire-hybride-3kva-maison',
    sku: 'SOL-KIT-3K',
    brandSlug: 'agbe',
    categorySlug: 'solaire',
    shortDesc: 'Kit complet 3 kVA : onduleur hybride + 6 panneaux 450Wc + batterie 200Ah.',
    description: 'Kit solaire hybride clé en main 3 kVA pour maison ou petit bureau. Comprend : onduleur hybride 3 kW 24V, 6 panneaux 450 Wc, batterie LiFePO4 200 Ah, structure de montage, câles DC, parafoudre. Installation par techniciens AGBE-TECH. Idéal pour 1 maison 3 chambres avec réfrigérateur, TV, éclairage LED, ventilateurs.',
    regularPrice: 0,
    pricingMode: 'ON_REQUEST',
    stock: 999,
    warranty: '5 ans (installation incluse)',
    attributes: JSON.stringify([
      { name: 'Puissance', value: '3 kVA' },
      { name: 'Panneaux', value: '6 × 450 Wc (2700 Wc)' },
      { name: 'Batterie', value: 'LiFePO4 200 Ah 24V' },
      { name: 'Autonomie', value: '~24 h usage modéré' },
      { name: 'Installation', value: 'Incluse (Lomé)' },
      { name: 'Garantie', value: '5 ans' },
    ]),
    tags: JSON.stringify(['kit', 'solaire', 'hybride', '3kva']),
    featured: true,
  },
  {
    name: 'Radio faisceau hertzien 5 GHz Ubiquiti airFiber 5X',
    slug: 'radio-fh-5ghz-ubiquiti-airfiber-5x',
    sku: 'TEL-RF-AF5X',
    brandSlug: 'agbe',
    categorySlug: 'telecom',
    shortDesc: 'Radio faisceau hertzien 5 GHz — débit 1.75 Gbps, portée 100+ km.',
    description: 'Radio liaison point-à-point Ubiquiti airFiber 5X — bande 5 GHz, débit agrégé 1.75 Gbps, portée jusqu\'à 100+ km. Latence < 2 ms. Idéal pour liaisons longue distance opérateurs, entreprises multi-sites, fourniture d\'accès Internet. Nécessite antennes distinctes (recommendé airFiber AF-5G30).',
    regularPrice: 0,
    pricingMode: 'ON_REQUEST',
    stock: 3,
    warranty: '1 an',
    attributes: JSON.stringify([
      { name: 'Type', value: 'Faisceau hertzien PtP' },
      { name: 'Bande', value: '5 GHz' },
      { name: 'Débit', value: '1.75 Gbps agrégé' },
      { name: 'Portée', value: '100+ km' },
      { name: 'Latence', value: '< 2 ms' },
      { name: 'Antenne', value: 'Externe (AF-5G30 recommendé)' },
    ]),
    tags: JSON.stringify(['faisceau', 'herzien', 'telecom', 'p2p']),
    featured: false,
  },
  {
    name: 'Armoire électrique 3 rangées 13 modules',
    slug: 'armoire-electrique-3-rangees-13-modules',
    sku: 'ELE-AR-3R13',
    brandSlug: 'agbe',
    categorySlug: 'electricite',
    shortDesc: 'Armoire électrique pré-équipée 3 rangées × 13 modules — disjoncteurs non inclus.',
    description: 'Armoire électrique murale 3 rangées × 13 modules — pré-équipée de peignes, barres de terre et neutre. Porte transparente. IP65. Idéale pour installations résidentielles selon norme NFC 15-100. Compatible disjoncteurs DIN 18 mm.',
    regularPrice: 35000,
    stock: 15,
    warranty: '2 ans',
    attributes: JSON.stringify([
      { name: 'Type', value: 'Armoire murale' },
      { name: 'Modules', value: '3 × 13 = 39 modules' },
      { name: 'Protection', value: 'IP65' },
      { name: 'Porte', value: 'Transparente verrouillable' },
      { name: 'Norme', value: 'NFC 15-100' },
      { name: 'Couleur', value: 'Gris RAL 7035' },
    ]),
    tags: JSON.stringify(['armoire', 'tableau', 'electrique']),
    featured: false,
  },
];

const SERVICES = [
  {
    slug: 'reseau-informatique',
    title: 'Réseau informatique',
    shortDesc: 'Installation, configuration et maintenance de réseaux informatiques pour entreprises.',
    description: 'Notre équipe conçoit, déploie et maintient des réseaux informatiques fiables pour les entreprises, hôtels, écoles et institutions. Câblage structuré Cat6/Cat6a, configuration de switchs, routeurs, points d\'accès Wi-Fi, baies de brassage, sécurité périmétrique. Nous intervenons à Lomé et dans tout le Togo pour des installations clé en main.',
    icon: 'network',
    benefits: JSON.stringify([
      'Câblage structuré certifié (Cat6/Cat6a, fibre optique)',
      'Configuration de switchs administrables et VLAN',
      'Wi-Fi haute densité pour hôtels et ERP',
      'Sécurité périmétrique (firewall, VPN)',
      'Maintenance préventive et curative 7j/7',
    ]),
    interventions: JSON.stringify([
      'Câblage réseau neuf ou reprise',
      'Installation de baies de brassage',
      'Configuration switch/routeur (Cisco, TP-Link, MikroTik)',
      'Déploiement Wi-Fi entreprise (mesh, roaming)',
      'Audit de sécurité et diagnostic réseau',
    ]),
    faqs: JSON.stringify([
      { q: 'Intervenez-vous en urgence ?', a: 'Oui, nous proposons un service d\'astreinte 7j/7 pour les clients sous contrat de maintenance.' },
      { q: 'Quelle est la zone d\'intervention ?', a: 'Lomé et toute la région maritime. Pour les autres régions, contactez-nous pour un devis sur mesure.' },
      { q: 'Proposez-vous un contrat de maintenance ?', a: 'Oui, nos contrats annuels incluent visites préventives, support à distance et intervention prioritaire.' },
    ]),
  },
  {
    slug: 'liaison-longue-distance',
    title: 'Liaison longue distance',
    shortDesc: 'Solutions de connexion longue distance par faisceau hertzien, fibre et radio.',
    description: 'Nous déployons des liaisons longue distance point-à-point et point-à-multipoint par faisceau hertzien (5 GHz, 11 GHz, 60 GHz), fibre optique ou liaison radio. Idéal pour relier plusieurs sites d\'entreprise, fournir de l\'accès Internet, ou connecter des sites isolés au Togo.',
    icon: 'antenna',
    benefits: JSON.stringify([
      'Liaisons haut débit jusqu\'à 10 Gbps',
      'Portée jusqu\'à 100+ km',
      'Latence faible (< 2 ms)',
      'Redondance et haute disponibilité',
      'Plan de fréquences et étude radio gratuite',
    ]),
    interventions: JSON.stringify([
      'Faisceau hertzien PtP / PtMP',
      'Fibre optique souterraine et aérienne',
      'Radios 5 GHz / 60 GHz (Ubiquiti, MikroTik)',
      'Étude de site et LOS (line of sight)',
      'Maintenance et monitoring distant',
    ]),
    faqs: JSON.stringify([
      { q: 'Quelle portée maximale ?', a: 'Jusqu\'à 100 km selon le matériel, la fréquence et la visibilité radio (LOS). Une étude de site est nécessaire.' },
      { q: 'Quel débit possible ?', a: 'De 100 Mbps à 10 Gbps selon la solution retenue.' },
      { q: 'Faut-il une licence ARPT ?', a: 'Pour les fréquences sous licence, oui. Nous accompagnons nos clients dans les démarches.' },
    ]),
  },
  {
    slug: 'cameras-surveillance',
    title: 'Caméras IP & analogiques',
    shortDesc: 'Installation de systèmes de vidéosurveillance IP et analogiques adaptés à vos besoins.',
    description: 'Nous installons des systèmes de vidéosurveillance complets : caméras IP, analogiques HD, PTZ, dômes, bullet. Configuration de NVR, stockage local/cloud, accès à distance via smartphone. Marques Hikvision, Dahua. Idéal pour boutiques, maisons, entrepôts, ERP à Lomé.',
    icon: 'cctv',
    benefits: JSON.stringify([
      'Caméras IP 4MP/4K haute résolution',
      'Vision nocturne jusqu\'à 50 m',
      'Accès à distance sécurisé (smartphone)',
      'Détection intelligente AcuSense',
      'Stockage 30 jours et plus',
    ]),
    interventions: JSON.stringify([
      'Audit et étude de couverture',
      'Installation caméras intérieures/extérieures',
      'Configuration NVR et stockage',
      'Configuration alertes et détection de mouvement',
      'Maintenance, nettoyage, mise à jour',
    ]),
    faqs: JSON.stringify([
      { q: 'Caméra IP ou analogique ?', a: 'L\'IP est recommandée pour les nouvelles installations (haute résolution, flexibilité). L\'analogique HD est une option économique pour la rénovation.' },
      { q: 'Puis-je consulter mes caméras depuis mon téléphone ?', a: 'Oui, application mobile iOS/Android fournie avec le NVR. Accès sécurisé par mot de passe.' },
      { q: 'Combien de temps les enregistrements sont-ils conservés ?', a: '30 jours par défaut, paramétrable selon le disque dur installé.' },
    ]),
  },
  {
    slug: 'electricite-batiment',
    title: 'Électricité bâtiment',
    shortDesc: 'Installation, dépannage et mise aux normes électriques pour particuliers et entreprises.',
    description: 'Nos électriciens qualifiés interviennent sur tous types de bâtiments : villas, immeubles, bureaux, commerces, ERP. Installation complète, dépannage 24/7, mise aux normes NFC 15-100, augmentation de puissance, domotique. Devis gratuit sous 24h.',
    icon: 'bolt',
    benefits: JSON.stringify([
      'Mise aux normes NFC 15-100',
      'Dépannage 24/7 pour clients sous contrat',
      'Installations conformes et garanties 5 ans',
      'Tableaux électriques organisés et sûrs',
      'Solutions domotiques (KNX, connected)',
    ]),
    interventions: JSON.stringify([
      'Installation électrique neuve',
      'Mise aux normes et diagnostic',
      'Dépannage électrique toutes urgences',
      'Ajout de points (prises, éclairage)',
      'Domotique et gestion d\'énergie',
    ]),
    faqs: JSON.stringify([
      { q: 'Intervenez-vous en urgence ?', a: 'Oui, astreinte 24/7 pour dépannage électrique. Appelez le +228 98 89 79 14.' },
      { q: 'Quelle est la zone ?', a: 'Lomé, Kégué et alentours pour les urgences. Toutes régions sur rendez-vous.' },
      { q: 'Proposez-vous la CEBA ?', a: 'Oui, nous délivrons le Certificat de Conformité Électrique du Bâtiment (CEBA) sur demande.' },
    ]),
  },
  {
    slug: 'panneaux-solaires',
    title: 'Panneaux solaires',
    shortDesc: 'Installations solaires clés en main : photovoltaïque, hybride, stockage.',
    description: 'Nous concevons et installons des systèmes solaires photovoltaïques sur mesure : kits résidentiels, systèmes hybrides avec batteries LiFePO4, pompes solaires, éclairage public solaire. Étude énergétique gratuite, installation par techniciens certifiés, garantie 5 à 25 ans.',
    icon: 'sun',
    benefits: JSON.stringify([
      'Étude énergétique personnalisée gratuite',
      'Composants de marques certifiées (Growatt, Victron)',
      'Stockage LiFePO4 longue durée (6000+ cycles)',
      'Financement possible par partenaires bancaires',
      'Garantie 5 ans installation + 25 ans panneaux',
    ]),
    interventions: JSON.stringify([
      'Systèmes solaires résidentiels (1–10 kVA)',
      'Systèmes hybrides avec stockage',
      'Pompes solaires pour agriculture',
      'Éclairage public solaire',
      'Maintenance et nettoyage panneaux',
    ]),
    faqs: JSON.stringify([
      { q: 'Quelle autonomie possible ?', a: 'De 8h à 48h selon la consommation et la capacité batterie. L\'étude énergétique le détermine.' },
      { q: 'Combien coûte une installation ?', a: 'À partir de 800 000 FCFA pour une villa 3 chambres. Devis personnalisé après étude.' },
      { q: 'Le solaire est-il rentable ?', a: 'Le retour sur investissement est généralement de 3 à 5 ans, puis 20+ ans d\'énergie gratuite.' },
    ]),
  },
];

const REALIZATIONS = [
  { slug: 'installation-solaire-villa-lome-nord', title: 'Installation solaire hybride 8 kVA — Villa Lomé Nord', category: 'solar', client: 'Privé', location: 'Lomé Nord', description: 'Installation d\'un système solaire hybride 8 kVA avec 16 panneaux 450 Wc, batterie LiFePO4 200 Ah, onduleur Growatt SPF 8000. Autonomie 24h, retour sur investissement estimé 3 ans.', featured: true },
  { slug: 'videosurveillance-commerce-kekue', title: 'Système de vidéosurveillance — Commerce Kégué', category: 'camera', client: 'Commerce', location: 'Kégué, Lomé', description: 'Installation de 8 caméras IP Hikvision 4MP, NVR 32 canaux, accès distant via smartphone. Couverture complète intérieure et extérieure du magasin.' },
  { slug: 'câblage-reseau-ecole-privée', title: 'Câblage réseau Cat6 — École privée Agoè', category: 'network', client: 'École privée', location: 'Agoè-Nyivé, Lomé', description: 'Câblage Cat6 structuré pour 24 salles de classe, 4 switchs administrables, 12 points d\'accès Wi-Fi 6. 600+ prises RJ45 certifiées.' },
  { slug: 'mise-aux-normes-batiment-administratif', title: 'Mise aux normes électriques — Bâtiment administratif', category: 'electricity', client: 'Institution', location: 'Tokoin, Lomé', description: 'Rénovation complète du tableau électrique, mise aux normes NFC 15-100, installation de 6 armores et 200 disjoncteurs différentiels. Certificat CEBA délivré.' },
  { slug: 'liaison-faisceau-bankao-sokode', title: 'Liaison faisceau hertzien 15 km — Bankao→Sokodé', category: 'telecom', client: 'Opérateur', location: 'Plateau - Sokodé', description: 'Déploiement d\'une liaison faisceau hertzien 11 GHz 15 km entre deux sites, débit 1 Gbps, redondance radio. Antennes de 0.6 m, latence < 2 ms.' },
  { slug: 'eclairage-public-solaire-baguida', title: 'Éclairage public solaire — Baguida', category: 'solar', client: 'Commune', location: 'Baguida, Lomé', description: 'Installation de 24 lampadaires solaires autonomes 80W le long de l\'avenue principale. Allumage automatique au crépuscule, autonomie 3 jours sans soleil.' },
];

const TESTIMONIALS = [
  { name: 'Kossi Mensah', role: 'Gérant', company: 'Pharmacie Kégué', rating: 5, content: 'Installation de vidéosurveillance impeccable. Travail soigné, équipe professionnelle, prix correct. Je recommande AGBE-TECH.', published: true },
  { name: 'Afi Dzifa', role: 'Propriétaire', company: 'Privé', rating: 5, content: 'Mon installation solaire tourne sans souci depuis 2 ans. Facture CEET divisée par 4. Merci à toute l\'équipe.', published: true },
  { name: 'Hôtel Lomé', role: 'Directeur technique', company: 'Hôtel Lomé', rating: 5, content: 'Câblage réseau et Wi-Fi 6 sur 4 étages. Service réactif et conforme au devis. Excellent rapport qualité-prix.', published: true },
  { name: 'Mairie de Bè', role: 'Responsable bâtiment', company: 'Commune', rating: 4, content: 'Mise aux normes électriques de notre bâtiment administratif. Délai respecté, accompagnement pour le CEBA.', published: true },
];

const BLOG_POSTS = [
  {
    slug: 'combien-coute-camera-surveillance-lome',
    title: 'Combien coûte une caméra de surveillance à Lomé en 2026 ?',
    excerpt: 'Tarifs des caméras IP à Lomé, installation comprise. Guide comparatif pour particuliers et commerces.',
    content: '## Prix d\'une caméra de surveillance à Lomé\n\nLe prix d\'une caméra de surveillance à Lomé varie de **45 000 à 350 000 FCFA** selon le type et la résolution. Voici les fourchettes observées :\n\n### Caméras IP\n- **2MP (1080p)** : 45 000 – 65 000 FCFA\n- **4MP (1440p)** : 80 000 – 120 000 FCFA\n- **4K (8MP)** : 180 000 – 350 000 FCFA\n\n### Caméras PTZ\n- **Motorisées 4MP** : 250 000 – 500 000 FCFA\n\n### Installation\nL\'installation par AGBE-TECH démarre à **15 000 FCFA** par caméra (câblage, configuration, test). Un forfait « système complet » (NVR + 4 caméras + installation) débute à **450 000 FCFA**.\n\n## Facteurs influençant le prix\n- La résolution (2MP vs 4K)\n- La marque (Hikvision/Dahua vs génériques)\n- La portée vision nocturne\n- Le stockage (durée et type : NVR, cloud)\n- La complexité d\'installation (hauteur, câblage)\n\n## Recommandations AGBE-TECH\nPour un commerce à Lomé, nous recommandons au minimum **4 caméras 4MP** + 1 NVR 8 canaux + 1 disque 2 To. Budget total ≈ 600 000 FCFA TTC.\n\nContactez-nous pour un devis gratuit : **+228 98 89 79 14**.',
    tags: JSON.stringify(['camera', 'prix', 'lome', 'guide']),
    published: true,
  },
  {
    slug: 'kit-solaire-maison-lome-guide',
    title: 'Quel kit solaire pour une maison à Lomé ?',
    excerpt: 'Choisir la bonne puissance de kit solaire selon sa consommation. Guide pratique pour les particuliers.',
    content: '## Choisir son kit solaire à Lomé\n\n### Évaluer sa consommation\nLa première étape consiste à lister vos appareils et leur puissance :\n- Réfrigérateur : 150–300 W\n- TV LED : 50–100 W\n- Ventilateur : 50–75 W\n- Éclairage LED : 5–15 W par ampoule\n- Chargeurs : 5–25 W\n\n### Dimensionner le système\nUne maison de 3 chambres avec réfrigérateur, TV, 6 ampoules LED, 2 ventilateurs consomme environ **2–3 kWh/jour**.\n\n### Puissance recommandée\n- **Petit budget** : 1.5 kVA + 4 panneaux + batterie 100 Ah → 600 000–900 000 FCFA\n- **Confort standard** : 3 kVA + 6 panneaux + batterie 200 Ah → 1 200 000–1 800 000 FCFA\n- **Autonomie maximale** : 5 kVA + 12 panneaux + 2 batteries 200 Ah → 2 500 000–3 500 000 FCFA\n\n### Retour sur investissement\nAvec une facture CEET moyenne de 40 000 FCFA/mois, le retour sur investissement est de **3 à 5 ans**. Au-delà, l\'énergie est quasi gratuite.\n\n## Pourquoi faire appel à AGBE-TECH ?\n- Étude énergétique gratuite\n- Composants certifiés (Growatt, Victron, LiFePO4)\n- Installation garantie 5 ans\n- Financement possible via partenaires\n\nDemandez votre devis : **+228 98 89 79 14**',
    tags: JSON.stringify(['solaire', 'kit', 'guide', 'lome']),
    published: true,
  },
  {
    slug: 'camera-ip-vs-analogique-choisir',
    title: 'Caméra IP ou analogique : que choisir ?',
    excerpt: 'Comparatif technique entre caméras IP et analogiques pour vous aider à choisir.',
    content: '## IP vs Analogique : le comparatif\n\n### Caméra IP\n**Avantages :**\n- Résolution 4K possible\n- PoE (alimentation par câble réseau)\n- Audio bidirectionnel\n- Intelligence artificielle (AcuSense, ligne virtuelle)\n- Accès distant direct (P2P)\n\n**Inconvénients :**\n- Plus chère à l\'achat\n- Bande passante réseau\n\n### Caméra analogique HD (AHD, HDCVI, HDTVI)\n**Avantages :**\n- Coût plus bas\n- Câblage coaxial existant réutilisable\n- Latence nulle\n\n**Inconvénients :**\n- Résolution limitée (max 4MP en pratique)\n- Pas d\'audio distant\n- Intelligence limitée\n\n## Notre recommandation\nPour une **nouvelle installation** à Lomé, optez pour l\'IP. Le surcoût est absorbé par les fonctionnalités et la flexibilité.\n\nPour une **rénovation** avec câblage coaxial existant, l\'analogique HD reste pertinent.\n\nContactez AGBE-TECH pour une étude personnalisée.',
    tags: JSON.stringify(['camera', 'ip', 'analogique', 'guide']),
    published: true,
  },
];

async function main() {
  console.log('→ Réinitialisation de la base...');
  await db.document.deleteMany();
  await db.orderMessage.deleteMany();
  await db.orderTimeline.deleteMany();
  await db.orderItem.deleteMany();
  await db.quoteItem.deleteMany();
  await db.quote.deleteMany();
  await db.order.deleteMany();
  await db.productReview.deleteMany();
  await db.product.deleteMany();
  await db.brand.deleteMany();
  await db.category.deleteMany();
  await db.service.deleteMany();
  await db.serviceRequest.deleteMany();
  await db.realization.deleteMany();
  await db.testimonial.deleteMany();
  await db.blogPost.deleteMany();
  await db.address.deleteMany();
  await db.otpCode.deleteMany();
  await db.user.deleteMany();
  await db.settings.deleteMany();

  console.log('→ Création des paramètres...');
  await db.settings.create({ data: {} });

  console.log('→ Création des catégories...');
  for (const cat of CATEGORIES) {
    await db.category.create({ data: cat });
  }

  console.log('→ Création des marques...');
  for (const brand of BRANDS) {
    await db.brand.create({ data: brand });
  }

  console.log('→ Création des produits...');
  for (const p of PRODUCTS) {
    const { categorySlug, brandSlug, ...rest } = p;
    const category = await db.category.findUnique({ where: { slug: categorySlug } });
    const brand = await db.brand.findUnique({ where: { slug: brandSlug } });
    await db.product.create({
      data: {
        ...rest,
        pricingMode: (rest as any).pricingMode ?? 'PRICE',
        categoryId: category!.id,
        brandId: brand?.id,
        // No local images yet — fall back to /api/placeholder at render time.
        images: JSON.stringify([]),
      },
    });
  }

  console.log('→ Création des services...');
  for (const s of SERVICES) {
    await db.service.create({ data: s });
  }

  console.log('→ Création des réalisations...');
  for (const r of REALIZATIONS) {
    await db.realization.create({ data: r });
  }

  console.log('→ Création des témoignages...');
  for (const t of TESTIMONIALS) {
    await db.testimonial.create({ data: t });
  }

  console.log('→ Création des articles de blog...');
  for (const b of BLOG_POSTS) {
    await db.blogPost.create({ data: b });
  }

  console.log('→ Création d\'un compte admin...');
  const bcrypt = await import('bcryptjs');
  const adminPassword = process.env.ADMIN_BOOTSTRAP_PASSWORD || 'agbe-admin-2026';
  const adminHash = await bcrypt.hash(adminPassword, 10);
  await db.user.create({
    data: {
      phone: '22800000000',
      email: 'admin@agbe-tech.com',
      name: 'Administrateur AGBE-TECH',
      role: 'ADMIN',
      passwordHash: adminHash,
    },
  });
  console.log(`  → Admin créé (mot de passe: ${adminPassword === 'agbe-admin-2026' ? 'défaut démo' : 'env ADMIN_BOOTSTRAP_PASSWORD'}).`);
  console.log('  → ⚠️  Changez ce mot de passe immédiatement en production via /admin/connexion → /admin/parametres.');

  console.log('✓ Seed terminé.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
