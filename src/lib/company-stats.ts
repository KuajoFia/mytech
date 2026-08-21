/**
 * Stats entreprise partagées — source unique de vérité pour éviter les incohérences
 * entre les pages (home, à-propos, services, faq, etc.).
 *
 * À mettre à jour une fois par an (année civile).
 *
 * Référence : 2014 = année de création d'AGBE-TECH (12 ans en 2026).
 */
export const COMPANY_STATS = {
  foundedYear: 2014,
  yearsExperience: new Date().getFullYear() - 2014, // 12 en 2026
  projectsCount: "500+",
  activeClients: "350+",
  technicians: 12,
  employees: 15,
  rating: "4.8/5",
  servicesCount: 6, // 5 expertises techniques + maintenance
  warrantyYears: 5, // garantie installations pièces + main d'œuvre
  retractionDays: 14, // délai de rétractation
  deliveryLomeFee: 2000, // FCFA
  responseTimeHours: 24, // délai de réponse devis
  interventionTimeHours: 4, // astreinte Lomé
} as const;

export const TAGLINE = "Connecter · Sécuriser · Alimenter · Performer";
