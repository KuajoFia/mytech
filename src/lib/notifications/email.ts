/**
 * Email notifications — uses nodemailer when SMTP env vars are configured.
 * Falls back to console.log in dev when no SMTP credentials.
 *
 * Env vars:
 * - SMTP_HOST (e.g. smtp.gmail.com)
 * - SMTP_PORT (587)
 * - SMTP_USER
 * - SMTP_PASSWORD
 * - CONTACT_EMAIL (from address, e.g. contact@agbe-tech.com)
 */

export type EmailPayload = {
  to: string;
  subject: string;
  text?: string;
  html?: string;
};

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT ?? "587");
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;
const FROM_EMAIL = process.env.CONTACT_EMAIL || "contact@agbe-tech.com";

let nodemailer: any = null;
async function getMailer() {
  if (nodemailer) return nodemailer;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD) return null;
  // Dynamic import to avoid loading in build if unused
  const mod = await import("nodemailer");
  nodemailer = mod.default || mod;
  return nodemailer;
}

export async function sendEmail(payload: EmailPayload): Promise<{ ok: boolean; error?: string }> {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD) {
    console.warn("[email] SMTP not configured — skipping. Payload:", {
      to: payload.to,
      subject: payload.subject,
    });
    return { ok: false, error: "SMTP not configured" };
  }
  try {
    const mailer = await getMailer();
    const transport = mailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
    });
    await transport.sendMail({
      from: `"AGBE-TECH" <${FROM_EMAIL}>`,
      to: payload.to,
      subject: payload.subject,
      text: payload.text,
      html: payload.html,
    });
    return { ok: true };
  } catch (e: any) {
    console.error("[email] send error:", e.message);
    return { ok: false, error: e.message };
  }
}

// ── Templates ────────────────────────────────────────

export function orderConfirmationEmail(order: {
  number: string;
  total: number;
  guestName?: string | null;
  guestEmail?: string | null;
  items: Array<{ name: string; quantity: number; unitPrice: number }>;
}): EmailPayload {
  const rowsHtml = order.items
    .map(
      (i) =>
        `<tr><td style="padding:6px 0;border-bottom:1px solid #eee">${i.name}</td><td style="text-align:center">${i.quantity}</td><td style="text-align:right">${(i.unitPrice * i.quantity).toLocaleString("fr-FR")} FCFA</td></tr>`
    )
    .join("");
  return {
    to: order.guestEmail || "",
    subject: `Commande ${order.number} confirmée — AGBE-TECH`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1A1F2C">
        <div style="background:#0A3D91;color:white;padding:20px;border-radius:8px 8px 0 0">
          <h1 style="margin:0;font-size:20px">Merci pour votre commande, ${order.guestName || "Client"} !</h1>
        </div>
        <div style="border:1px solid #E2E8F0;border-top:0;padding:20px;border-radius:0 0 8px 8px">
          <p>Votre commande <strong>${order.number}</strong> a bien été enregistrée. Notre équipe la prépare et vous contactera bientôt.</p>
          <table style="width:100%;border-collapse:collapse;margin:12px 0;font-size:14px">
            <thead><tr style="border-bottom:2px solid #0A3D91"><th style="text-align:left;padding:6px 0">Produit</th><th>Qté</th><th style="text-align:right">Total</th></tr></thead>
            <tbody>${rowsHtml}</tbody>
          </table>
          <div style="text-align:right;font-size:18px;font-weight:700;color:#0A3D91;margin-top:12px">
            Total : ${order.total.toLocaleString("fr-FR")} FCFA
          </div>
          <p style="font-size:12px;color:#5C6678;margin-top:24px">
            Pour toute question, contactez-nous au +228 98 89 79 14 ou par WhatsApp.
          </p>
        </div>
      </div>
    `,
  };
}

export function quoteIssuedEmail(quote: {
  number: string;
  total: number;
  guestEmail?: string | null;
  guestName?: string | null;
  validUntil: Date | string;
}): EmailPayload {
  return {
    to: quote.guestEmail || "",
    subject: `Facture proforma ${quote.number} — AGBE-TECH`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1A1F2C">
        <div style="background:#0A3D91;color:white;padding:20px;border-radius:8px 8px 0 0">
          <h1 style="margin:0;font-size:20px">Votre devis ${quote.number}</h1>
        </div>
        <div style="border:1px solid #E2E8F0;border-top:0;padding:20px;border-radius:0 0 8px 8px">
          <p>Bonjour ${quote.guestName || ""},</p>
          <p>Veuillez trouver votre facture proforma ci-jointe. Montant total : <strong>${quote.total.toLocaleString("fr-FR")} FCFA</strong>.</p>
          <p>Valable jusqu'au <strong>${new Date(quote.validUntil).toLocaleDateString("fr-FR")}</strong>.</p>
          <p>Pour commander, connectez-vous à votre espace client et validez le devis.</p>
        </div>
      </div>
    `,
  };
}
