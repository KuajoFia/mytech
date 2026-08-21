/**
 * Fallback services data — used when DB is empty or service not found.
 * Mirrors the structure of the Prisma Service model.
 *
 * Slugs are aligned with the header mega-menu and footer links.
 */
export type FallbackService = {
  slug: string;
  title: string;
  shortDesc: string;
  description: string;
  icon: string;
  benefits: string[];
  interventions: string[];
  faqs: { q: string; a: string }[];
};

export const FALLBACK_SERVICES: FallbackService[] = [
  {
    slug: "videosurveillance",
    title: "Vidéosurveillance",
    shortDesc: "Caméras IP, analogiques, PTZ, dôme, bullet — Hikvision, Dahua et plus.",
    description:
      "Notre équipe installe des systèmes de vidéosurveillance professionnels pour particuliers, entreprises et institutions au Togo. Nous maîtrisons les marques Hikvision, Dahua, TP-Link Tapo et proposons des solutions IP 4MP à 8MP, vision nocturne, détection IA AcuSense, audio bidirectionnel et accès mobile temps réel. Du câblage structuré au paramétrage fine des NVR/DVR, en passant par la configuration des notifications push sur smartphone, nous livrons des installations clé en main, garanties 2 ans.",
    icon: "cctv",
    benefits: [
      "Caméras IP 4MP / 8MP haute définition",
      "Vision nocturne jusqu'à 30 m",
      "Détection IA AcuSense (humain/véhicule)",
      "Accès mobile temps réel (iOS / Android)",
      "Stockage NVR 30 à 90 jours",
      "Audio bidirectionnel intégré",
    ],
    interventions: [
      "Audit technique et étude de site",
      "Pose de caméras IP / analogiques",
      "Câblage Cat6 et alimentation PoE",
      "Configuration NVR / DVR",
      "Paramétrage accès distant sécurisé",
      "Maintenance et dépannage 7j/7",
    ],
    faqs: [
      {
        q: "Combien de caméras faut-il pour une maison ?",
        a: "Pour une villa standard à Lomé (4 angles + entrée), 4 à 6 caméras suffisent. Pour un immeuble, comptez 2 caméras par étage + entrée + parking.",
      },
      {
        q: "Combien de temps conservation les enregistrements ?",
        a: "Avec un disque 1 To, environ 30 jours pour 4 caméras 4MP en continu. En détection de mouvement, 60 à 90 jours.",
      },
      {
        q: "Les caméras fonctionnent-elles pendant une coupure de courant ?",
        a: "Oui si vous ajoutez un onduleur ou une batterie de secours. Nous proposons des packs avec autonomie 4 à 8h.",
      },
    ],
  },
  {
    slug: "solaire-energie",
    title: "Solaire & énergie",
    shortDesc: "Panneaux solaires, batteries, onduleurs, kits complets clé en main.",
    description:
      "AGBE-TECH dimensionne et installe des systèmes solaires photovoltaïques pour maisons, entreprises et sites isolés au Togo. Nous travaillons avec des marques tierces de référence (Growatt, Victron Energy, Canadian Solar, Jinko) et fournissons des solutions hybrides avec batterie LiFePO4 pour assurer une autonomie 24h même en saison des pluies. Du panneau solaire au régulateur, en passant par l'onduleur et le système de monitoring, nous vous accompagnons de A à Z, avec un retour sur investissement moyen de 4 à 7 ans.",
    icon: "sun",
    benefits: [
      "Dimensionnement sur-mesure (1 à 50 kWc)",
      "Marques premium : Growatt, Victron, Canadian Solar",
      "Batteries LiFePO4 longue durée (6000 cycles)",
      "Monitoring mobile temps réel",
      "Garantie panneaux 10 à 25 ans",
      "Économie CEET jusqu'à 100%",
    ],
    interventions: [
      "Étude de dimensionnement et devis gratuit",
      "Pose de panneaux solaires (toiture ou au sol)",
      "Installation onduleurs et régulateurs",
      "Intégration batteries LiFePO4 / plomb",
      "Mise en service et tests",
      "Maintenance préventive annuelle",
    ],
    faqs: [
      {
        q: "Quelle puissance pour une villa à Lomé ?",
        a: "Une villa de 200 m² avec climatisation consomme 15 à 25 kWh/jour. Un kit solaire 5 kWc avec batterie 10 kWh couvre 80 à 100% des besoins.",
      },
      {
        q: "Combien coûte une installation solaire ?",
        a: "Comptez 1,5 à 3 millions FCFA pour un kit domestique 3 kWc avec batterie. Pour une entreprise, demandez un devis personnalisé.",
      },
      {
        q: "Les panneaux fonctionnent-ils en saison des pluies ?",
        a: "Oui, ils produisent 30 à 60% de leur puissance nominale. Avec une batterie suffisante, vous êtes autonome toute l'année.",
      },
    ],
  },
  {
    slug: "reseau-informatique",
    title: "Réseau informatique",
    shortDesc: "Câblage Cat6, switchs, routeurs, Wi-Fi entreprise, baies de brassage.",
    description:
      "Nous concevons et déployons des réseaux informatiques structurés pour entreprises, hôtels, écoles et institutions au Togo. Du câblage Cat6/Cat6a à la fibre optique, en passant par la configuration de switchs administrables Cisco, TP-Link et MikroTik, nous livrons des infrastructures fiables, sécurisées et évolutives. Notre expertise couvre aussi le Wi-Fi haute densité (mesh, roaming), les VLAN, la QoS, les firewalls périmétriques et le monitoring réseau.",
    icon: "network",
    benefits: [
      "Câblage certifié Cat6/Cat6a et fibre optique",
      "Switchs administrables L2+ (Cisco, TP-Link, MikroTik)",
      "Wi-Fi haute densité mesh / roaming",
      "VLAN, QoS, LAG, IGMP Snooping",
      "Firewall et VPN site-à-site",
      "Monitoring 24/7 et alertes",
    ],
    interventions: [
      "Audit réseau et étude de besoin",
      "Câblage structuré neuf ou reprise",
      "Installation de baies de brassage",
      "Configuration switch / routeur",
      "Déploiement Wi-Fi entreprise",
      "Sécurité périmétrique (firewall, VPN)",
    ],
    faqs: [
      {
        q: "Quelle différence entre Cat6 et Cat6a ?",
        a: "Le Cat6 supporte 1 Gbps sur 100 m et 10 Gbps sur 55 m. Le Cat6a supporte 10 Gbps sur 100 m complet — recommandé pour les installations futures-proof.",
      },
      {
        q: "Combien de points Wi-Fi pour un hôtel 3 étages ?",
        a: "Environ 1 AP par 4 chambres, soit 12 à 18 AP pour un hôtel 50 chambres. Nous utilisons des AP mesh gérés par contrôleur central.",
      },
      {
        q: "Proposez-vous des contrats de maintenance ?",
        a: "Oui, nos contrats annuels incluent visites préventives trimestrielles, support à distance illimité et intervention prioritaire sous 24h.",
      },
    ],
  },
  {
    slug: "electricite-batiment",
    title: "Électricité bâtiment",
    shortDesc: "Mise aux normes, tableaux, disjoncteurs, éclairage, énergie solaire intégrée.",
    description:
      "Notre équipe d'électriciens qualifiés intervient pour tous travaux d'électricité bâtiment au Togo : mise aux normes d'installations existantes, création de tableaux électriques complets, ajout de circuits prises/éclairage, installation de groupes électrogènes, intégration de systèmes solaires hybrides, et dépannage 7j/7. Nous garantissons la conformité aux normes NFC 15-100 et CEBA, et fournissons les certificats requis par les assurances.",
    icon: "bolt",
    benefits: [
      "Conformité NFC 15-100 et CEBA",
      "Tableaux électriques complets avec disjoncteurs différentiels",
      "Mise à la terre et paratonnerre",
      "Intégration onduleurs et groupes électrogènes",
      "Certificat de conformité délivré",
      "Dépannage et astreinte 24/7",
    ],
    interventions: [
      "Diagnostic complet de l'installation",
      "Mise aux normes et refonte tableau",
      "Ajout de circuits prises / éclairage",
      "Installation de disjoncteurs différentiels",
      "Mise à la terre et terre de protection",
      "Dépannage urgent 7j/7",
    ],
    faqs: [
      {
        q: "Quand faut-il mettre aux normes une installation ?",
        a: "Si votre installation a plus de 15 ans, ou si vous avez des disjoncteurs non différentiels, des prises sans terre, ou un tableau en bois/plastique ancien. Une mise aux normes est obligatoire avant revente.",
      },
      {
        q: "Qu'est-ce que le certificat CEBA ?",
        a: "Le Consuel Électrique du Bâtiment Agréé est obligatoire pour toute nouvelle installation ou mise aux normes. Nous le délivrons après inspection.",
      },
      {
        q: "Intervenez-vous en urgence le week-end ?",
        a: "Oui, nous proposons un service d'astreinte 7j/7 pour les clients sous contrat. Hors contrat, nous facturons un forfait intervention urgente.",
      },
    ],
  },
  {
    slug: "liaison-longue-distance",
    title: "Liaison longue distance",
    shortDesc: "Faisceaux hertziens, fibre optique, liaison radio longue portée.",
    description:
      "Nous déployons des liaisons longue distance point-à-point et point-à-multipoint pour relier plusieurs sites d'entreprise, fournir de l'accès Internet, ou connecter des sites isolés au Togo. Nos solutions incluent les faisceaux hertziens (5 GHz, 11 GHz, 60 GHz), la fibre optique souterraine et aérienne, ainsi que les radios longue portée Ubiquiti et MikroTik. Idéal pour relier des sites distants de 1 à 100+ km avec débits de 100 Mbps à 10 Gbps et latence inférieure à 2 ms.",
    icon: "antenna",
    benefits: [
      "Liaisons haut débit jusqu'à 10 Gbps",
      "Portée jusqu'à 100+ km",
      "Latence ultra-faible (< 2 ms)",
      "Redondance et haute disponibilité",
      "Étude de fréquences et LOS gratuite",
      "Marques Ubiquiti, MikroTik, Cambium",
    ],
    interventions: [
      "Étude de site et LOS (line of sight)",
      "Pose d'antennes et radios",
      "Configuration PtP / PtMP",
      "Plan de fréquences et coordination ARPT",
      "Fibre optique souterraine / aérienne",
      "Maintenance et monitoring distant",
    ],
    faqs: [
      {
        q: "Quelle portée maximale ?",
        a: "Jusqu'à 100 km selon le matériel, la fréquence et la visibilité radio (LOS). Une étude de site est nécessaire pour confirmer la faisabilité.",
      },
      {
        q: "Faut-il une licence ARPT ?",
        a: "Pour les fréquences sous licence (11 GHz, 18 GHz), oui. Nous accompagnons nos clients dans les démarches. Les bandes 5 GHz et 60 GHz sont libres.",
      },
      {
        q: "Quel débit possible ?",
        a: "De 100 Mbps à 10 Gbps selon la solution retenue. Pour 1 km en ville : 1 à 10 Gbps possible. Pour 50 km : 100 à 500 Mbps typiquement.",
      },
    ],
  },
  {
    slug: "maintenance-support",
    title: "Maintenance & support",
    shortDesc: "Contrats annuels, astreinte 7j/7, intervention prioritaire, monitoring.",
    description:
      "Nos contrats de maintenance annuels vous garantissent la tranquillité d'esprit : visites préventives trimestrielles, support à distance illimité, intervention sur site sous 24h ouvrée, et tarifs préférentiels sur tous travaux complémentaires. Nous monitorons vos installations à distance et vous alertons proactivement en cas d'anomalie (coupure, panne matérielle, intrusion détectée, baisse de production solaire).",
    icon: "wrench",
    benefits: [
      "Visites préventives trimestrielles",
      "Support à distance illimité",
      "Intervention prioritaire sous 24h",
      "Monitoring 24/7 des installations",
      "Tarifs préférentiels pièces et main d'œuvre",
      "Rapports d'intervention détaillés",
    ],
    interventions: [
      "Audit initial et contrat sur-mesure",
      "Visites préventives trimestrielles",
      "Support à distance (tél., WhatsApp, TeamViewer)",
      "Intervention sur site sous 24h ouvrée",
      "Monitoring actif des équipements",
      "Astreinte 24/7 pour urgences critiques",
    ],
    faqs: [
      {
        q: "Quels équipements sont couverts par le contrat ?",
        a: "Tous les équipements installés par AGBE-TECH : caméras, NVR, switchs, onduleurs, panneaux solaires, batteries. Nous proposons aussi des contrats sur installations tierces après audit.",
      },
      {
        q: "Que se passe-t-il en cas d'urgence hors heures ouvrées ?",
        a: "Notre astreinte répond 24/7. Délai d'intervention : 4h sur Lomé, 24h en région. Le déplacement est facturé selon votre contrat.",
      },
      {
        q: "Combien coûte un contrat de maintenance ?",
        a: "À partir de 100 000 FCFA/an pour une installation domestique (4 caméras + onduleur). Pour les entreprises, sur devis selon le parc.",
      },
    ],
  },
];

export function getFallbackService(slug: string): FallbackService | undefined {
  return FALLBACK_SERVICES.find((s) => s.slug === slug);
}
