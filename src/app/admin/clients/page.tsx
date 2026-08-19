import Link from "next/link";
import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatFCFA, formatDate } from "@/lib/utils";

export default async function AdminClientsPage() {
  const clients = await db.user.findMany({
    where: { role: { in: ["CLIENT", "PRO"] } },
    orderBy: { createdAt: "desc" },
    include: {
      orders: { select: { id: true, total: true, status: true } },
    },
    take: 100,
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold">Clients</h1>
        <p className="text-sm text-muted-foreground">{clients.length} clients</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-secondary/50">
                  <th className="text-left p-3 font-medium">Nom</th>
                  <th className="text-left p-3 font-medium">Contact</th>
                  <th className="text-center p-3 font-medium">Type</th>
                  <th className="text-center p-3 font-medium">Commandes</th>
                  <th className="text-right p-3 font-medium">Total dépensé</th>
                  <th className="text-left p-3 font-medium">Inscrit le</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((c) => {
                  const totalSpent = c.orders
                    .filter((o) => o.status === "PAID" || o.status === "DELIVERED")
                    .reduce((s, o) => s + o.total, 0);
                  return (
                    <tr key={c.id} className="border-b last:border-0 hover:bg-secondary/30">
                      <td className="p-3">
                        <div className="font-semibold">{c.name}</div>
                        {c.companyName && <div className="text-xs text-muted-foreground">{c.companyName}</div>}
                      </td>
                      <td className="p-3">
                        <div>{c.phone}</div>
                        {c.email && <div className="text-xs text-muted-foreground">{c.email}</div>}
                      </td>
                      <td className="p-3 text-center">
                        <Badge variant="outline" className="text-[10px]">{c.role}</Badge>
                      </td>
                      <td className="p-3 text-center">{c.orders.length}</td>
                      <td className="p-3 text-right font-semibold">{formatFCFA(totalSpent)}</td>
                      <td className="p-3 text-xs text-muted-foreground">{formatDate(c.createdAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
