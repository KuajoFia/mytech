import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
  DELIVERY_MODE_LABELS,
  formatFCFA,
  formatDateTime,
} from "@/lib/utils";
import { OrderStatusUpdater } from "@/components/admin/order-status-updater";

export const dynamic = "force-dynamic";


const ALL_STATUSES = [
  "QUOTE_REQUESTED",
  "PROFORMA_ISSUED",
  "ORDERED",
  "AWAITING_PAYMENT",
  "PAID",
  "PREPARING",
  "AWAITING_DELIVERY",
  "DELIVERING",
  "DELIVERED",
  "CANCELLED",
  "RETURNED",
];

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await db.order.findUnique({
    where: { id },
    include: {
      items: { include: { product: true } },
      documents: { orderBy: { createdAt: "desc" } },
      timeline: { orderBy: { createdAt: "asc" } },
      user: true,
    },
  });
  if (!order) notFound();

  return (
    <div className="space-y-6">
      <Link href="/admin/commandes" className="text-sm text-muted-foreground hover:text-brand">
        ← Retour aux commandes
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">{order.number}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className={ORDER_STATUS_COLORS[order.status]}>
              {ORDER_STATUS_LABELS[order.status]}
            </Badge>
            <span className="text-xs text-muted-foreground">Créée le {formatDateTime(order.createdAt)}</span>
          </div>
        </div>
        <OrderStatusUpdater orderId={order.id} currentStatus={order.status} statuses={ALL_STATUSES} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Items */}
        <Card>
          <CardHeader className="pb-3"><h2 className="font-display font-bold">Articles</h2></CardHeader>
          <CardContent className="space-y-3">
            {order.items.map((it) => (
              <div key={it.id} className="flex items-center gap-3 pb-3 border-b last:border-0 last:pb-0">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">{it.name}</div>
                  <div className="text-xs text-muted-foreground">SKU: {it.sku}</div>
                  <div className="text-xs text-muted-foreground">{it.quantity} × {formatFCFA(it.unitPrice)}</div>
                </div>
                <div className="font-semibold">{formatFCFA(it.total)}</div>
              </div>
            ))}
            <div className="border-t pt-3 space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Sous-total HT</span><span>{formatFCFA(order.subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">TVA 18%</span><span>{formatFCFA(order.vat)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Livraison</span><span>{order.shippingFee === 0 ? "Offerte" : formatFCFA(order.shippingFee)}</span></div>
              <div className="flex justify-between font-bold text-base pt-1 border-t">
                <span>Total TTC</span><span className="text-brand">{formatFCFA(order.total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3"><h3 className="font-display font-bold">Client</h3></CardHeader>
            <CardContent className="text-sm space-y-1">
              <div><strong>{order.guestName ?? order.user?.name}</strong></div>
              <div className="text-muted-foreground">{order.guestPhone ?? order.user?.phone}</div>
              {order.guestEmail && <div className="text-muted-foreground">{order.guestEmail}</div>}
              {order.companyName && <div className="text-xs mt-2 pt-2 border-t">Pro : {order.companyName}</div>}
              {order.nif && <div className="text-xs text-muted-foreground">NIF: {order.nif}</div>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3"><h3 className="font-display font-bold">Livraison</h3></CardHeader>
            <CardContent className="text-sm space-y-1">
              <div>{DELIVERY_MODE_LABELS[order.deliveryMode]}</div>
              {order.shippingAddress && <div className="text-muted-foreground text-xs">{order.shippingAddress}</div>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3"><h3 className="font-display font-bold">Documents générés</h3></CardHeader>
            <CardContent className="space-y-2 text-sm">
              {order.documents.length === 0 ? (
                <p className="text-xs text-muted-foreground">Aucun document généré pour l&apos;instant.</p>
              ) : (
                order.documents.map((d) => (
                  <a
                    key={d.id}
                    href={`/api/orders/${order.id}/pdf?type=${d.type}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block hover:bg-secondary p-2 rounded"
                  >
                    <div className="font-medium text-sm">{d.number}</div>
                    <div className="text-xs text-muted-foreground">{formatDateTime(d.createdAt)}</div>
                  </a>
                ))
              )}
              <div className="pt-2 border-t mt-2">
                <div className="text-xs uppercase text-muted-foreground mb-1">Générer un nouveau document</div>
                <div className="flex flex-wrap gap-1">
                  {(["PROFORMA", "PURCHASE_ORDER", "RECEIPT", "DELIVERY_NOTE", "CREDIT_NOTE"] as const).map((t) => (
                    <a
                      key={t}
                      href={`/api/orders/${order.id}/pdf?type=${t}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] bg-secondary hover:bg-brand hover:text-white px-2 py-1 rounded"
                    >
                      {ORDER_STATUS_LABELS ? t.replace("_", " ") : t}
                    </a>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Timeline */}
      <Card>
        <CardHeader className="pb-3"><h3 className="font-display font-bold">Historique</h3></CardHeader>
        <CardContent>
          <ol className="space-y-2">
            {order.timeline.map((t) => (
              <li key={t.id} className="flex items-start gap-3 text-sm">
                <div className="font-bold text-brand text-xs w-24 shrink-0">{formatDateTime(t.createdAt)}</div>
                <div>
                  <Badge variant="outline" className={`text-[10px] ${ORDER_STATUS_COLORS[t.status]}`}>
                    {ORDER_STATUS_LABELS[t.status]}
                  </Badge>
                  {t.note && <span className="text-muted-foreground text-xs ml-2">{t.note}</span>}
                </div>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
