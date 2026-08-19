/**
 * WhatsApp Business Cloud API client.
 *
 * Sends messages via the Meta WhatsApp Business API.
 * Requires env vars:
 * - WHATSAPP_TOKEN (permanent access token)
 * - WHATSAPP_PHONE_ID (phone number ID)
 *
 * Falls back to console.log when not configured.
 *
 * Docs: https://developers.facebook.com/docs/whatsapp/cloud-api
 */

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const WHATSAPP_PHONE_ID = process.env.WHATSAPP_PHONE_ID;
const API_VERSION = "v18.0";

export type WhatsAppMessage = {
  to: string; // E.164 format, e.g. "22898897914"
  templateName?: string;
  templateLanguage?: string;
  templateParams?: string[];
  text?: string; // simple text message (no template)
};

export async function sendWhatsApp(
  msg: WhatsAppMessage
): Promise<{ ok: boolean; error?: string }> {
  if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_ID) {
    console.warn("[whatsapp] Not configured — skipping. Payload:", msg);
    return { ok: false, error: "WhatsApp not configured" };
  }
  try {
    const url = `https://graph.facebook.com/${API_VERSION}/${WHATSAPP_PHONE_ID}/messages`;
    let body: any;
    if (msg.templateName) {
      body = {
        messaging_product: "whatsapp",
        to: msg.to,
        type: "template",
        template: {
          name: msg.templateName,
          language: { code: msg.templateLanguage || "fr" },
          components: msg.templateParams?.length
            ? [
                {
                  type: "body",
                  parameters: msg.templateParams.map((p) => ({ type: "text", text: p })),
                },
              ]
            : undefined,
        },
      };
    } else {
      body = {
        messaging_product: "whatsapp",
        to: msg.to,
        type: "text",
        text: { body: msg.text || "" },
      };
    }

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[whatsapp] API error:", res.status, err);
      return { ok: false, error: `WhatsApp API ${res.status}: ${err}` };
    }
    return { ok: true };
  } catch (e: any) {
    console.error("[whatsapp] error:", e.message);
    return { ok: false, error: e.message };
  }
}

// ── Helpers ──────────────────────────────────────────

export function orderConfirmationWhatsApp(order: {
  number: string;
  total: number;
  guestName?: string | null;
  guestPhone?: string | null;
}): WhatsAppMessage {
  // Requires a pre-approved template "order_confirmation" in your WhatsApp Business account.
  return {
    to: order.guestPhone || "",
    templateName: "order_confirmation",
    templateLanguage: "fr",
    templateParams: [order.guestName || "Client", order.number, `${order.total.toLocaleString("fr-FR")} FCFA`],
  };
}
