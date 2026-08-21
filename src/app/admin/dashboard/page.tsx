import Link from "next/link";
import { Package, ShoppingCart, Users, TrendingUp, AlertCircle, Clock } from "lucide-react";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, formatFCFA, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";


export default async function AdminDashboard() {
  let orders: any;
  let recentOrders: any[] = [];
  let products: any[] = [];
  let clients: any[] = [];
  let lowStockProducts: any[] = [];
  let serviceRequests: any[] = [];
  let paidCount = 0;
  let statusGroups: any[] = [];
  let dbError = false;

  try {
    [
      orders,
      recentOrders,
      products,
      clients,
      lowStockProducts,
      serviceRequests,
    ] = await Promise.all([
      db.order.aggregate({ _sum: { total: true }, _count: true }),
      db.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        include: { items: true, user: true },
      }),
      db.product.findMany(),
      db.user.findMany({ where: { role: "CLIENT" }, take: 5, orderBy: { createdAt: "desc" } }),
      db.product.findMany({ where: { stock: { lte: 5 } }, take: 5, include: { brand: true } }),
      db.serviceRequest.findMany({ where: { status: "NEW" }, orderBy: { createdAt: "desc" }, take: 5 }),
    ]);

    paidCount = await db.order.count({ where: { status: "PAID" } });

    // Status distribution
    statusGroups = await db.order.groupBy({
      by: ["status"],
      _count: true,
    });
  } catch (e) {
    console.error("AdminDashboard DB error:", e);
    dbError = true;
  }

  const revenue = orders?._sum?.total ?? 0;
  const ordersCount = orders?._count ?? 0;

  const stats = [
    { label: "Revenus (TTC)", value: formatFCFA(revenue), icon: TrendingUp, color: "text-emerald-600" },
    { label: "Commandes totales", value: ordersCount, icon: ShoppingCart, color: "text-brand" },
    { label: "Commandes payées", value: paidCount, icon: Package, color: "text-emerald-600" },
    { label: "Clients", value: clients.length > 0 ? `${clients.length}+` : "0", icon: Users, color: "text-brand" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Tableau de bord</h1>
        <p className="text-sm text-muted-foreground">Vue d&apos;ensemble de l&apos;activité AGBE-TECH</p>
      </div>

      {dbError && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
          <strong>⚠️ Base de données non accessible.</strong> Les données affichées ci-dessous sont vides car la connexion à PostgreSQL a échoué.
          Vérifiez la variable <code>DATABASE_URL</code> dans Vercel → Settings → Environment Variables.
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">{s.label}</div>
                  <div className={`font-display text-2xl font-extrabold mt-1 ${s.color}`}>{s.value}</div>
                </div>
                <div className="rounded-lg bg-secondary p-2">
                  <s.icon className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent orders */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <h2 className="font-display font-bold">Commandes récentes</h2>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/commandes">Tout voir →</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentOrders.map((o) => (
                <Link
                  key={o.id}
                  href={`/admin/commandes/${o.id}`}
                  className="flex items-center gap-3 p-2 hover:bg-secondary/50 rounded transition"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm">{o.number}</div>
                    <div className="text-xs text-muted-foreground">
                      {o.guestName ?? o.user?.name} · {formatDate(o.createdAt)}
                    </div>
                  </div>
                  <Badge variant="outline" className={`text-[10px] ${ORDER_STATUS_COLORS[o.status]}`}>
                    {ORDER_STATUS_LABELS[o.status]}
                  </Badge>
                  <div className="font-semibold text-sm w-24 text-right">{formatFCFA(o.total)}</div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Status distribution */}
        <Card>
          <CardHeader className="pb-3"><h2 className="font-display font-bold">Statuts des commandes</h2></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {statusGroups.map((g) => (
                <div key={g.status} className="flex items-center justify-between text-sm">
                  <Badge variant="outline" className={`text-[10px] ${ORDER_STATUS_COLORS[g.status]}`}>
                    {ORDER_STATUS_LABELS[g.status]}
                  </Badge>
                  <span className="font-semibold">{g._count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Low stock */}
        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <h2 className="font-display font-bold flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-500" /> Stock bas
            </h2>
            <Button asChild variant="ghost" size="sm"><Link href="/admin/produits">Gérer →</Link></Button>
          </CardHeader>
          <CardContent>
            {lowStockProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucun stock bas.</p>
            ) : (
              <ul className="space-y-2">
                {lowStockProducts.map((p) => (
                  <li key={p.id} className="flex items-center justify-between text-sm">
                    <div>
                      <div className="font-medium">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.brand?.name}</div>
                    </div>
                    <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                      Stock : {p.stock}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Service requests */}
        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <h2 className="font-display font-bold flex items-center gap-2">
              <Clock className="h-4 w-4 text-brand" /> Devis services à traiter
            </h2>
            <Button asChild variant="ghost" size="sm"><Link href="/admin/devis">Tout voir →</Link></Button>
          </CardHeader>
          <CardContent>
            {serviceRequests.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucune demande en attente.</p>
            ) : (
              <ul className="space-y-2">
                {serviceRequests.map((r) => (
                  <li key={r.id} className="flex items-center justify-between text-sm border-b last:border-0 pb-2 last:pb-0">
                    <div>
                      <div className="font-medium">{r.name}</div>
                      <div className="text-xs text-muted-foreground">{r.service} · {r.phone}</div>
                    </div>
                    <span className="text-xs text-muted-foreground">{formatDate(r.createdAt)}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
