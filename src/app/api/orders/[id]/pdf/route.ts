import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { formatFCFA, formatDate, safeParse } from "@/lib/utils";
import { getSession } from "@/lib/auth";
import { getCachedSettings } from "@/lib/settings-cache";
import { Settings } from "@prisma/client";

type DocContext = {
  order: any;
  settings: Settings | null;
};

const DOC_LABELS: Record<string, string> = {
  ACKNOWLEDGE: "Accusé de réception",
  PROFORMA: "Facture proforma",
  PURCHASE_ORDER: "Bon de commande",
  PAYMENT_REMINDER: "Rappel de paiement",
  RECEIPT: "Reçu / Facture acquittée",
  DELIVERY_NOTE: "Bon de livraison",
  CREDIT_NOTE: "Avoir",
};

const DOC_PREFIX: Record<string, string> = {
  ACKNOWLEDGE: "AR",
  PROFORMA: "PF",
  PURCHASE_ORDER: "BC",
  PAYMENT_REMINDER: "RP",
  RECEIPT: "FA",
  DELIVERY_NOTE: "BL",
  CREDIT_NOTE: "AV",
};

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }
  const { id } = await params;
  const docType = req.nextUrl.searchParams.get("type") as keyof typeof DOC_LABELS;
  if (!docType || !DOC_LABELS[docType]) {
    return new Response("Type de document invalide", { status: 400 });
  }

  const order = await db.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } }, documents: true },
  });
  if (!order) {
    return new Response("Commande introuvable", { status: 404 });
  }

  // Authz: admin/staff can see all; client only their own
  const isStaff = session.role === "ADMIN" || session.role === "STAFF";
  if (!isStaff && order.userId !== session.id && order.guestPhone !== session.phone) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const settings = await getCachedSettings();

  const year = new Date().getFullYear();
  const seq = order.documents.length + 1;
  const number = `${DOC_PREFIX[docType] ?? "DOC"}-${year}-${String(seq).padStart(3, "0")}`;

  // Persist document record
  await db.document.create({
    data: {
      orderId: order.id,
      number,
      type: docType as any,
      dataJson: JSON.stringify({ ts: Date.now() }),
    },
  });

  const html = renderDocument({ order, settings }, docType, number);

  // Allow ?download=1 to force download (Content-Disposition: attachment)
  const download = req.nextUrl.searchParams.get("download") === "1";
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `${download ? "attachment" : "inline"}; filename="${number}.html"`,
      "Cache-Control": "private, no-cache",
    },
  });
}

function renderDocument({ order, settings }: DocContext, docType: string, number: string): string {
  const labels = DOC_LABELS;
  const isDelivery = docType === "DELIVERY_NOTE";
  const isReceipt = docType === "RECEIPT";
  const isProforma = docType === "PROFORMA";

  const vatRate = settings?.vatRate ?? 0.18;
  const subtotal = order.subtotal;
  const vat = Math.round(subtotal * vatRate);
  const total = order.total;
  const shipping = order.shippingFee ?? 0;
  const discount = order.discount ?? 0;

  const itemsRows = order.items.map((it: any, i: number) => `
    <tr>
      <td class="num">${i + 1}</td>
      <td>
        <strong>${escapeHtml(it.name)}</strong>
        ${it.product ? renderAttributes(it.product.attributes) : ""}
        <div class="sku">SKU: ${escapeHtml(it.sku)}</div>
      </td>
      <td class="num">${it.quantity}</td>
      <td class="num">u.</td>
      <td class="num">${isDelivery ? "—" : formatFCFA(it.unitPrice)}</td>
      <td class="num">${isDelivery ? it.quantity : formatFCFA(it.unitPrice * it.quantity)}</td>
    </tr>
  `).join("");

  const customer = order.companyName || order.guestName || order.user?.name || "Client";
  const customerLine2 = [
    order.billingAddress,
    order.guestPhone || order.user?.phone,
    order.guestEmail || order.user?.email,
  ].filter(Boolean).join(" · ");
  const customerPro = order.nif || order.rccm ? `NIF: ${order.nif ?? "-"} · RCCM: ${order.rccm ?? "-"}` : "";

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<title>${labels[docType]} ${number} — AGBE-TECH</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: 'Inter', Arial, sans-serif; color: #1A1F2C; margin: 0; padding: 28px; font-size: 12px; }
  .doc { max-width: 800px; margin: 0 auto; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; border-bottom: 3px solid #0A3D91; padding-bottom: 16px; }
  .brand { display: flex; gap: 10px; align-items: center; }
  .brand-logo { width: 48px; height: 48px; background: #0A3D91; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 18px; }
  .brand-name { font-size: 22px; font-weight: 800; color: #0A3D91; }
  .brand-tag { font-size: 9px; color: #5C6678; letter-spacing: 1px; text-transform: uppercase; }
  .brand-addr { font-size: 11px; color: #5C6678; margin-top: 4px; }
  .doc-meta { text-align: right; font-size: 11px; }
  .doc-title { font-size: 20px; font-weight: 700; color: #0A3D91; }
  .doc-number { font-weight: 700; margin-top: 4px; }
  .doc-date { color: #5C6678; }
  .parties { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 24px 0; }
  .party { padding: 12px; background: #F5F7FA; border-radius: 6px; border-left: 3px solid #0A3D91; }
  .party-label { font-size: 9px; text-transform: uppercase; color: #5C6678; letter-spacing: 1px; margin-bottom: 4px; }
  .party-name { font-weight: 700; }
  .party-line { font-size: 11px; color: #5C6678; margin-top: 2px; }
  table.items { width: 100%; border-collapse: collapse; margin-top: 12px; }
  table.items th, table.items td { padding: 8px 6px; border-bottom: 1px solid #E2E8F0; text-align: left; vertical-align: top; font-size: 11px; }
  table.items th { background: #0A3D91; color: white; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
  .num { text-align: right; white-space: nowrap; }
  .sku { font-size: 10px; color: #94A3B8; margin-top: 2px; }
  .attrs { font-size: 10px; color: #5C6678; margin-top: 4px; padding-left: 8px; border-left: 2px solid #E2E8F0; }
  .attr-pair { display: inline-block; margin-right: 12px; }
  .attr-name { color: #94A3B8; }
  .totals { margin-top: 16px; margin-left: auto; width: 280px; }
  .totals .row { display: flex; justify-content: space-between; padding: 4px 0; font-size: 12px; }
  .totals .total { border-top: 2px solid #0A3D91; padding-top: 8px; margin-top: 4px; font-size: 16px; font-weight: 800; color: #0A3D91; }
  .legal { margin-top: 24px; padding: 12px; background: #F5F7FA; border-radius: 6px; font-size: 10px; color: #5C6678; }
  .sign { margin-top: 28px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .sign-box { border: 1px solid #94A3B8; padding: 24px 12px 8px; text-align: center; font-size: 10px; color: #5C6678; }
  .stamp { position: absolute; right: 40px; bottom: 80px; transform: rotate(-15deg); border: 3px solid #DC2626; color: #DC2626; padding: 6px 16px; font-weight: 800; font-size: 16px; border-radius: 4px; opacity: 0.7; }
  .doc-wrap { position: relative; }
  .footer { margin-top: 30px; padding-top: 12px; border-top: 1px solid #E2E8F0; font-size: 10px; color: #5C6678; display: flex; justify-content: space-between; }
  .bank { background: #F5F7FA; padding: 10px; border-radius: 6px; margin-top: 12px; font-size: 11px; }
  .bank h4 { margin: 0 0 4px; color: #0A3D91; font-size: 11px; text-transform: uppercase; }
  .pay-badges { display: flex; gap: 8px; margin-top: 6px; }
  .pay-badge { background: white; border: 1px solid #E2E8F0; border-radius: 4px; padding: 3px 8px; font-size: 10px; font-weight: 700; }
</style>
</head>
<body>
<div class="doc doc-wrap">
  <div class="header">
    <div>
      <div class="brand">
        <div class="brand-logo">A</div>
        <div>
          <div class="brand-name">AGBE-TECH</div>
          <div class="brand-tag">Connecter · Sécuriser · Alimenter · Performer</div>
          <div class="brand-addr">
            ${escapeHtml(settings?.address ?? "Kégué, Rue Kpacha — Lomé, Togo")}<br>
            Tél: ${escapeHtml(settings?.phone1 ?? "+228 98 89 79 14")} / ${escapeHtml(settings?.phone2 ?? "+228 93 90 77 06")}<br>
            ${escapeHtml(settings?.email ?? "contact@agbe-tech.com")}
            ${settings?.rccm ? ` · RCCM: ${escapeHtml(settings.rccm)}` : ""}
            ${settings?.nif ? ` · NIF: ${escapeHtml(settings.nif)}` : ""}
          </div>
        </div>
      </div>
    </div>
    <div class="doc-meta">
      <div class="doc-title">${labels[docType]}</div>
      <div class="doc-number">N° ${number}</div>
      <div class="doc-date">Date: ${formatDate(new Date())}</div>
      ${order.number ? `<div class="doc-date">Réf. commande: ${order.number}</div>` : ""}
      ${isProforma ? `<div class="doc-date">Valable jusqu'au: ${formatDate(new Date(Date.now() + (settings?.proformaValidity ?? 15) * 86400000))}</div>` : ""}
      ${order.paymentRef ? `<div class="doc-date">Réf. paiement: ${order.paymentRef}</div>` : ""}
    </div>
  </div>

  ${isReceipt ? `<div class="stamp">PAYÉE LE ${formatDate(order.paidAt ?? new Date())}</div>` : ""}

  <div class="parties">
    <div class="party">
      <div class="party-label">Émetteur</div>
      <div class="party-name">${escapeHtml(settings?.legalName ?? "AGBE-TECH")}</div>
      <div class="party-line">${escapeHtml(settings?.address ?? "Kégué, Rue Kpacha — Lomé, Togo")}</div>
      <div class="party-line">Tél: ${escapeHtml(settings?.phone1 ?? "+228 98 89 79 14")}</div>
      <div class="party-line">Email: ${escapeHtml(settings?.email ?? "contact@agbe-tech.com")}</div>
      ${settings?.rccm ? `<div class="party-line">RCCM: ${escapeHtml(settings.rccm)}</div>` : ""}
      ${settings?.nif ? `<div class="party-line">NIF: ${escapeHtml(settings.nif)}</div>` : ""}
    </div>
    <div class="party">
      <div class="party-label">Client</div>
      <div class="party-name">${escapeHtml(customer)}</div>
      ${customerLine2 ? `<div class="party-line">${escapeHtml(customerLine2)}</div>` : ""}
      ${customerPro ? `<div class="party-line">${escapeHtml(customerPro)}</div>` : ""}
    </div>
  </div>

  <table class="items">
    <thead>
      <tr>
        <th style="width:24px;">N°</th>
        <th>Désignation & caractéristiques</th>
        <th class="num" style="width:50px;">Qté</th>
        <th class="num" style="width:40px;">Unité</th>
        <th class="num" style="width:90px;">${isDelivery ? "—" : "PU HT"}</th>
        <th class="num" style="width:100px;">${isDelivery ? "Qté livrée" : "Total HT"}</th>
      </tr>
    </thead>
    <tbody>
      ${itemsRows}
    </tbody>
  </table>

  ${isDelivery ? "" : `
    <div class="totals">
      <div class="row"><span>Sous-total HT</span><span>${formatFCFA(subtotal)}</span></div>
      ${discount ? `<div class="row"><span>Remise</span><span>- ${formatFCFA(discount)}</span></div>` : ""}
      <div class="row"><span>TVA (${Math.round(vatRate * 100)} %)</span><span>${formatFCFA(vat)}</span></div>
      <div class="row"><span>Livraison</span><span>${shipping === 0 ? "Offerte" : formatFCFA(shipping)}</span></div>
      <div class="row total"><span>Total TTC</span><span>${formatFCFA(total)}</span></div>
    </div>
  `}

  ${isDelivery ? `
    <div style="margin-top:24px; padding:14px; background:#FEF3C7; border-radius:6px; font-size:11px;">
      <strong>Décharge:</strong> Reçu le ${formatDate(new Date())} en bon état apparent. Conformité à vérifier dans les 48h.
    </div>
  ` : ""}

  ${isProforma ? `
    <div class="legal">
      Cette facture proforma ne tient pas lieu de facture définitive. Elle est valable ${settings?.proformaValidity ?? 15} jours à compter de la date d'émission.
      Les prix indiqués sont en FCFA TTC, TVA ${Math.round(vatRate * 100)} % incluse. Stock réservé après confirmation et paiement.
    </div>
    <div class="sign">
      <div class="sign-box">Le Client<br>(date, nom, cachet, signature)<br><br><br></div>
      <div class="sign-box">Pour AGBE-TECH<br>(date, nom, cachet, signature)<br><br><br></div>
    </div>
  ` : ""}

  ${isReceipt ? `
    <div class="bank">
      <h4>Paiement</h4>
      <div>Mode: <strong>${order.paymentMethod ?? "—"}</strong> · Référence: ${order.paymentRef ?? "—"}</div>
      <div class="pay-badges">
        <span class="pay-badge">T-Money</span>
        <span class="pay-badge">Flooz</span>
        <span class="pay-badge">Virement</span>
      </div>
    </div>
  ` : ""}

  <div class="footer">
    <div>
      <strong>AGBE-TECH</strong> · ${escapeHtml(settings?.address ?? "Kégué, Lomé, Togo")}<br>
      ${settings?.rccm ? `RCCM ${escapeHtml(settings.rccm)}` : ""} ${settings?.nif ? ` · NIF ${escapeHtml(settings.nif)}` : ""} · TVA ${Math.round((vatRate) * 100)} %
    </div>
    <div>
      Merci de votre confiance — <strong>www.agbe-tech.com</strong>
    </div>
  </div>
</div>
<script>window.onload = () => setTimeout(() => window.print(), 300);</script>
</body>
</html>`;
}

function escapeHtml(s: string): string {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));
}

function renderAttributes(attributesJson: string): string {
  const attrs = safeParse<{ name: string; value: string }[]>(attributesJson, []);
  if (attrs.length === 0) return "";
  return `<div class="attrs">${attrs.map((a) => `<span class="attr-pair"><span class="attr-name">${escapeHtml(a.name)}:</span> ${escapeHtml(a.value)}</span>`).join("")}</div>`;
}
