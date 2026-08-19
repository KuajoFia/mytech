import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, formatFCFA, formatDate } from "@/lib/utils";
import { Package, FileText, MapPin, User, ChevronRight, LogOut } from "lucide-react";

export default async function AccountDashboard() {
  const session = await getSession();
  if (!session) redirect("/compte/connexion");

  const orders = await db.order.findMany({
    where: {
      OR: [{ userId: session.id }, { guestPhone: session.phone }],
    },
    orderBy: { createdAt: "desc" },
    take: 10,
    include: { items: true },
  });

  const totalSpent = orders
    .filter((o) => o.status === "PAID" || o.status === "DELIVERED")
    .reduce((s, o) => s + o.total, 0);

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold">
            Bonjour, {session.name} 👋
          </h1>
          <p className="text-sm text-muted-foreground">
            {session.email ?? session.phone} ·{" "}
            <Badge variant="outline">{session.role}</Badge>
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/compte/profil">
              <User className="h-4 w-4 mr-1" /> Mon profil
            </Link>
          </Button>
          <form action="/api/auth/logout" method="post">
            <button
              type="submit"
              className="inline-flex items-center gap-1 border rounded-md px-3 py-2 text-sm hover:bg-secondary"
            >
              <LogOut className="h-4 w-4" /> Déconnexion
            </button>
          </form>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-3 md:grid-cols-3 mb-8">
        <Card>
          <CardContent className="p-5">
            <div className="text-xs uppercase text-muted-foreground">Commandes totales</div>
            <div className="font-display text-2xl font-extrabold text-brand mt-1">{orders.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="text-xs uppercase text-muted-foreground">Total dépensé</div>
            <div className="font-display text-2xl font-extrabold text-brand mt-1">{formatFCFA(totalSpent)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="text-xs uppercase text-muted-foreground">Commandes actives</div>
            <div className="font-display text-2xl font-extrabold text-brand mt-1">
              {orders.filter((o) => !["DELIVERED", "CANCELLED", "RETURNED"].includes(o.status)).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders */}
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <h2 className="font-display font-bold flex items-center gap-2">
            <Package className="h-5 w-5 text-brand" /> Mes commandes
          </h2>
          <Button asChild variant="ghost" size="sm">
            <Link href="/boutique">Nouvelle commande</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-4">Vous n&apos;avez pas encore de commande.</p>
              <Button asChild className="bg-brand hover:bg-brand-light">
                <Link href="/boutique">Découvrir la boutique</Link>
              </Button>
            </div>
          ) : (
            <div className="divide-y">
              {orders.map((o) => (
                <Link
                  key={o.id}
                  href={`/compte/commandes/${o.id}`}
                  className="flex items-center gap-4 py-3 hover:bg-secondary/50 px-2 rounded transition"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{o.number}</span>
                      <Badge variant="outline" className={`text-[10px] ${ORDER_STATUS_COLORS[o.status]}`}>
                        {ORDER_STATUS_LABELS[o.status]}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {formatDate(o.createdAt)} · {o.items.length} article{o.items.length > 1 ? "s" : ""}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-sm">{formatFCFA(o.total)}</div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
