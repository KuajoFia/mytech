import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

/**
 * GET /api/admin/export/orders?format=csv
 *
 * Exports all orders (PAID or all statuses) as CSV for accounting.
 * Required by admin only.
 */
export async function GET(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }
  const url = new URL(req.url);
  const onlyPaid = url.searchParams.get("onlyPaid") === "1";
  const format = url.searchParams.get("format") || "csv";

  const orders = await db.order.findMany({
    where: onlyPaid ? { status: "PAID" } : {},
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  if (format === "csv") {
    const header = [
      "numero",
      "date",
      "statut",
      "client_nom",
      "client_telephone",
      "client_email",
      "entreprise",
      "rccm",
      "nif",
      "mode_livraison",
      "frais_livraison",
      "sous_total",
      "remise",
      "tva",
      "total",
      "methode_paiement",
      "ref_paiement",
      "paye_le",
      "nb_articles",
    ].join(";");

    const rows = orders.map((o) =>
      [
        o.number,
        new Date(o.createdAt).toISOString().slice(0, 10),
        o.status,
        `"${(o.guestName || "").replace(/"/g, '""')}"`,
        o.guestPhone || "",
        o.guestEmail || "",
        `"${(o.companyName || "").replace(/"/g, '""')}"`,
        o.rccm || "",
        o.nif || "",
        o.deliveryMode,
        o.shippingFee,
        o.subtotal,
        o.discount,
        o.vat,
        o.total,
        o.paymentMethod || "",
        o.paymentRef || "",
        o.paidAt ? new Date(o.paidAt).toISOString().slice(0, 10) : "",
        o.items.length,
      ].join(";")
    );

    const csv = [header, ...rows].join("\n");
    return new Response("\uFEFF" + csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="orders-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  }

  return NextResponse.json(orders);
}
