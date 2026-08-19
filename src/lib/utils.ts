import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format number as FCFA currency */
export function formatFCFA(value: number): string {
  if (!Number.isFinite(value)) return "0 FCFA";
  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(value)) + " FCFA";
}

/** Slugify French/African strings (handle accents) */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Generate a sequential document number like BC-2026-001 */
export function genDocNumber(prefix: string, year: number, seq: number): string {
  return `${prefix}-${year}-${String(seq).padStart(3, "0")}`;
}

/** Parse JSON safely */
export function safeParse<T>(value: unknown, fallback: T): T {
  if (typeof value !== "string") return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

/** Truncate text */
export function truncate(s: string, max = 120): string {
  if (s.length <= max) return s;
  return s.slice(0, max - 1).trim() + "…";
}

/** Format date dd/mm/yyyy (fr-FR) */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
}

/** Format date with time */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

/** Status labels in French */
export const ORDER_STATUS_LABELS: Record<string, string> = {
  QUOTE_REQUESTED: "Devis demandé",
  PROFORMA_ISSUED: "Proforma émise",
  ORDERED: "Commandée",
  AWAITING_PAYMENT: "En attente de paiement",
  PAID: "Payée",
  PREPARING: "En préparation",
  AWAITING_DELIVERY: "En attente de livraison",
  DELIVERING: "En cours de livraison",
  DELIVERED: "Livrée",
  CANCELLED: "Annulée",
  RETURNED: "Retour / Avoir",
};

export const ORDER_STATUS_COLORS: Record<string, string> = {
  QUOTE_REQUESTED: "bg-blue-100 text-blue-800 border-blue-200",
  PROFORMA_ISSUED: "bg-indigo-100 text-indigo-800 border-indigo-200",
  ORDERED: "bg-cyan-100 text-cyan-800 border-cyan-200",
  AWAITING_PAYMENT: "bg-amber-100 text-amber-800 border-amber-200",
  PAID: "bg-emerald-100 text-emerald-800 border-emerald-200",
  PREPARING: "bg-violet-100 text-violet-800 border-violet-200",
  AWAITING_DELIVERY: "bg-orange-100 text-orange-800 border-orange-200",
  DELIVERING: "bg-pink-100 text-pink-800 border-pink-200",
  DELIVERED: "bg-green-100 text-green-800 border-green-200",
  CANCELLED: "bg-red-100 text-red-800 border-red-200",
  RETURNED: "bg-rose-100 text-rose-800 border-rose-200",
};

export const QUOTE_STATUS_LABELS: Record<string, string> = {
  DRAFT: "Brouillon",
  ISSUED: "Émise",
  APPROVED: "Approuvée",
  REFUSED: "Refusée",
  EXPIRED: "Expirée",
  CONVERTED: "Convertie en commande",
};

export const DELIVERY_MODE_LABELS: Record<string, string> = {
  PICKUP_STORE: "Retrait magasin (Kégué, gratuit)",
  LOME_DELIVERY: "Livraison Lomé & environs",
  OTHER_REGIONS: "Autres régions (sur devis)",
};
