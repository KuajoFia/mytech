import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
  DELIVERY_MODE_LABELS,
  formatFCFA,
  formatDate,
  formatDateTime,
} from "@/lib/utils";
import {
  ArrowLeft,
  FileText,
  Download,
  CheckCircle2,
  XCircle,
  Phone,
  MapPin,
} from "lucide-react";
import { OrderActions } from "@/components/account/order-actions";

const DOC_TYPES = [
  { key: "ACKNOWLEDGE", label: "Accusé de réception", icon: FileText },
  { key: "PROFORMA", label: "Proforma", icon: FileText },
  { key: "PURCHASE_ORDER", label: "Bon de commande", icon: FileText },
  { key: "RECEIPT", label: "Reçu / Facture", icon: Download },
  { key: "DELIVERY_NOTE", label: "Bon de livraison", icon: Download },
  { key: "CREDIT_NOTE", label: "Avoir", icon: FileText },
];

const TIMELINE_ORDER = [
  "QUOTE_REQUESTED",
  "PROFORMA_ISSUED",
  "ORDERED",
  "AWAITING_PAYMENT",
  "PAID",
  "PREPARING",
  "AWAITING_DELIVERY",
  "DELIVERING",
  "DELIVERED",
];

export default async function OrderDetailPage({ params, searchParams }: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ new?: string }>;
}) {
  const { id } = await params;
  const { new: isNew } = await searchParams;
  const session = await getSession();

  // Allow guests to view orders they just created via phone matching
  const order = await db.order.findUnique({
    where: { id },
    include: {
      items: { include: { product: true } },
      documents: { orderBy: { createdAt: "desc" } },
      timeline: { orderBy: { createdAt: "asc" } },
      messages: { orderBy: { createdAt: "asc" } },
    },
  });
  if (!order) notFound();

  // Access control
  if (session) {
    const isStaff = session.role === "ADMIN" || session.role === "STAFF";
    if (!isStaff && order.userId !== session.id && order.guestPhone !== session.phone) {
      redirect("/compte/connexion");
    }
  } else if (order.guestPhone) {
    // Allow guest access if there's no session but the order is fresh (just created)
    // For security in real apps, use a signed URL token. Here we allow only when ?new=1.
    if (isNew !== "1") redirect("/compte/connexion");
  } else {
    redirect("/compte/connexion");
  }

  const completedIdx = TIMELINE_ORDER.indexOf(order.status);

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/compte" className="inline-flex items-center text-sm text-muted-foreground hover:text-brand mb-4">
        <ArrowLeft className="h-4 w-4 mr-1" /> Retour aux commandes
      </Link>

      {isNew === "1" && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-md p-4 mb-6">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <h2 className="font-semibold text-emerald-800">Commande créée avec succès !</h2>
          </div>
          <p className="text-sm text-emerald-700 mt-1">
            Votre commande <strong>{order.number}</strong> est enregistrée. Vous recevrez une notification
            WhatsApp à chaque étape. Créez un compte pour suivre toutes vos commandes.
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold">{order.number}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className={ORDER_STATUS_COLORS[order.status]}>
              {ORDER_STATUS_LABELS[order.status]}
            </Badge>
            <span className="text-xs text-muted-foreground">Créée le {formatDate(order.createdAt)}</span>
          </div>
        </div>
        <OrderActions order={order} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Items */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <h2 className="font-display font-bold">Articles commandés</h2>
            </CardHeader>
            <CardContent className="space-y-3">
              {order.items.map((it) => (
                <div key={it.id} className="flex items-center gap-3 pb-3 border-b last:border-0 last:pb-0">
                  <Link
                    href={`/boutique/${it.product?.slug ?? "#"}`}
                    className="h-16 w-16 rounded bg-secondary flex items-center justify-center text-muted-foreground"
                  >
                    <FileText className="h-5 w-5" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link href={`/boutique/${it.product?.slug ?? "#"}`} className="font-semibold text-sm hover:text-brand line-clamp-1">
                      {it.name}
                    </Link>
                    <div className="text-xs text-muted-foreground">SKU: {it.sku}</div>
                    <div className="text-xs text-muted-foreground">
                      {it.quantity} × {formatFCFA(it.unitPrice)}
                    </div>
                  </div>
                  <div className="font-semibold">{formatFCFA(it.total)}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader className="pb-3"><h2 className="font-display font-bold">Suivi de commande</h2></CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {TIMELINE_ORDER.map((s, idx) => {
                  const evt = order.timeline.find((t) => t.status === s);
                  const isDone = idx <= completedIdx && completedIdx >= 0;
                  const isCurrent = idx === completedIdx;
                  return (
                    <li key={s} className="flex items-start gap-3">
                      <div className={`mt-0.5 h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isDone ? "bg-emerald-500 text-white" : "bg-secondary text-muted-foreground"
                      }`}>
                        {isDone ? "✓" : idx + 1}
                      </div>
                      <div className="flex-1">
                        <div className={`text-sm font-medium ${isCurrent ? "text-brand" : isDone ? "text-foreground" : "text-muted-foreground"}`}>
                          {ORDER_STATUS_LABELS[s]}
                        </div>
                        {evt && (
                          <div className="text-xs text-muted-foreground">{formatDateTime(evt.createdAt)}</div>
                        )}
                        {evt?.note && <div className="text-xs text-muted-foreground mt-0.5">{evt.note}</div>}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3"><h3 className="font-display font-bold">Récapitulatif</h3></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sous-total HT</span>
                <span>{formatFCFA(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">TVA 18 %</span>
                <span>{formatFCFA(order.vat)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Livraison</span>
                <span>{order.shippingFee === 0 ? "Offerte" : formatFCFA(order.shippingFee)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-base">
                <span>Total TTC</span>
                <span className="text-brand">{formatFCFA(order.total)}</span>
              </div>
              {order.paymentMethod && (
                <div className="pt-2 mt-2 border-t text-xs text-muted-foreground">
                  Paiement : <span className="font-medium text-foreground">{order.paymentMethod}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader className="pb-3"><h3 className="font-display font-bold flex items-center gap-2"><FileText className="h-4 w-4 text-brand" /> Documents PDF</h3></CardHeader>
            <CardContent className="space-y-2">
              {DOC_TYPES.map((d) => {
                const disabled =
                  (d.key === "RECEIPT" && order.status !== "PAID" && order.status !== "DELIVERED") ||
                  (d.key === "DELIVERY_NOTE" && !["AWAITING_DELIVERY", "DELIVERING", "DELIVERED"].includes(order.status)) ||
                  (d.key === "CREDIT_NOTE" && order.status !== "RETURNED");
                return (
                  <a
                    key={d.key}
                    href={disabled ? undefined : `/api/orders/${order.id}/pdf?type=${d.key}`}
                    target={disabled ? undefined : "_blank"}
                    rel={disabled ? undefined : "noopener noreferrer"}
                    className={`flex items-center justify-between text-sm rounded-md p-2 ${
                      disabled ? "text-muted-foreground/50 cursor-not-allowed" : "hover:bg-secondary text-foreground"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <d.icon className="h-4 w-4" /> {d.label}
                    </span>
                    {!disabled && <Download className="h-3 w-3" />}
                  </a>
                );
              })}
            </CardContent>
          </Card>

          {/* Delivery */}
          <Card>
            <CardHeader className="pb-3"><h3 className="font-display font-bold flex items-center gap-2"><MapPin className="h-4 w-4 text-brand" /> Livraison</h3></CardHeader>
            <CardContent className="text-sm space-y-1">
              <div>{DELIVERY_MODE_LABELS[order.deliveryMode]}</div>
              {order.shippingAddress && <div className="text-muted-foreground text-xs">{order.shippingAddress}</div>}
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="bg-secondary border-0">
            <CardContent className="p-5">
              <h3 className="font-semibold text-sm mb-2">Besoin d&apos;aide ?</h3>
              <p className="text-xs text-muted-foreground mb-3">Notre équipe support est disponible 7j/7.</p>
              <Button asChild size="sm" variant="outline" className="w-full">
                <a href="https://wa.me/22898897914" target="_blank" rel="noopener noreferrer">
                  <Phone className="h-3 w-3 mr-1" /> WhatsApp Support
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
