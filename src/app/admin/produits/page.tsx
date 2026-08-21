import Link from "next/link";
import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit3, Trash2 } from "lucide-react";
import { formatFCFA, safeParse } from "@/lib/utils";

export const dynamic = "force-dynamic";


export default async function AdminProductsPage() {
  const products = await db.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { brand: true, category: true },
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Produits</h1>
          <p className="text-sm text-muted-foreground">{products.length} produits dans le catalogue</p>
        </div>
        <Button asChild className="bg-brand hover:bg-brand-light">
          <Link href="/admin/produits/new">
            <Plus className="h-4 w-4 mr-1" /> Nouveau produit
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-secondary/50">
                  <th className="text-left p-3 font-medium">Produit</th>
                  <th className="text-left p-3 font-medium">Catégorie</th>
                  <th className="text-left p-3 font-medium">Marque</th>
                  <th className="text-right p-3 font-medium">Prix</th>
                  <th className="text-center p-3 font-medium">Stock</th>
                  <th className="text-center p-3 font-medium">Statut</th>
                  <th className="text-right p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b last:border-0 hover:bg-secondary/30">
                    <td className="p-3">
                      <Link href={`/admin/produits/${p.id}`} className="font-medium hover:text-brand">
                        {p.name}
                      </Link>
                      <div className="text-xs text-muted-foreground">SKU: {p.sku}</div>
                    </td>
                    <td className="p-3 text-xs">{p.category?.name}</td>
                    <td className="p-3 text-xs">{p.brand?.name}</td>
                    <td className="p-3 text-right">
                      {p.pricingMode === "ON_REQUEST" ? (
                        <span className="text-xs text-brand">Sur devis</span>
                      ) : (
                        <>
                          {p.promoPrice && (
                            <div className="text-xs text-muted-foreground line-through">
                              {formatFCFA(p.regularPrice)}
                            </div>
                          )}
                          <div className="font-semibold">{formatFCFA(p.promoPrice ?? p.regularPrice)}</div>
                        </>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <Badge variant="outline" className={
                        p.stock === 0 ? "bg-red-100 text-red-800 border-red-200" :
                        p.stock <= 5 ? "bg-amber-100 text-amber-800 border-amber-200" :
                        "bg-emerald-100 text-emerald-800 border-emerald-200"
                      }>
                        {p.stock}
                      </Badge>
                    </td>
                    <td className="p-3 text-center">
                      <Badge variant="outline" className="text-[10px]">{p.status}</Badge>
                    </td>
                    <td className="p-3 text-right">
                      <div className="inline-flex gap-1">
                        <Button asChild size="icon" variant="ghost">
                          <Link href={`/admin/produits/${p.id}`}>
                            <Edit3 className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
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
