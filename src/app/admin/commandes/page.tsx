import Link from "next/link";
import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, formatFCFA, formatDate } from "@/lib/utils";
import type { OrderStatus } from "@prisma/client";

export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const sp = await searchParams;
  const statusFilter: OrderStatus | undefined =
    sp.status && sp.status !== "ALL" && !sp.status.startsWith("_")
      ? (sp.status as OrderStatus)
      : undefined;
  const where = statusFilter ? { status: statusFilter } : {};
  const orders = await db.order.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { items: true, user: true },
    take: 100,
  });

  const statuses = await db.order.groupBy({ by: ["status"], _count: true });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold">Commandes</h1>
        <p className="text-sm text-muted-foreground">{orders.length} commandes</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        <Link href="/admin/commandes">
          <Button variant={sp.status ? "outline" : "default"} size="sm">Toutes</Button>
        </Link>
        {statuses.map((s) => (
          <Link key={s.status} href={`/admin/commandes?status=${s.status}`}>
            <Button variant={sp.status === s.status ? "default" : "outline"} size="sm">
              {ORDER_STATUS_LABELS[s.status]} ({s._count})
            </Button>
          </Link>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-secondary/50">
                  <th className="text-left p-3 font-medium">N°</th>
                  <th className="text-left p-3 font-medium">Client</th>
                  <th className="text-left p-3 font-medium">Date</th>
                  <th className="text-center p-3 font-medium">Articles</th>
                  <th className="text-right p-3 font-medium">Total</th>
                  <th className="text-center p-3 font-medium">Statut</th>
                  <th className="text-right p-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-b last:border-0 hover:bg-secondary/30">
                    <td className="p-3 font-semibold">{o.number}</td>
                    <td className="p-3">
                      <div>{o.guestName ?? o.user?.name ?? "—"}</div>
                      <div className="text-xs text-muted-foreground">{o.guestPhone ?? o.user?.phone}</div>
                    </td>
                    <td className="p-3 text-xs text-muted-foreground">{formatDate(o.createdAt)}</td>
                    <td className="p-3 text-center">{o.items.length}</td>
                    <td className="p-3 text-right font-semibold">{formatFCFA(o.total)}</td>
                    <td className="p-3 text-center">
                      <Badge variant="outline" className={`text-[10px] ${ORDER_STATUS_COLORS[o.status]}`}>
                        {ORDER_STATUS_LABELS[o.status]}
                      </Badge>
                    </td>
                    <td className="p-3 text-right">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/admin/commandes/${o.id}`}>Voir →</Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
