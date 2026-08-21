import Link from "next/link";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { DevisStatusUpdater } from "@/components/admin/devis-status-updater";

export const dynamic = "force-dynamic";


export default async function AdminDevisPage() {
  const requests = await db.serviceRequest.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold">Demandes de devis services</h1>
        <p className="text-sm text-muted-foreground">{requests.length} demandes</p>
      </div>

      <div className="grid gap-4">
        {requests.map((r) => (
          <Card key={r.id}>
            <CardHeader className="pb-2 flex flex-row items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold">{r.name}</h3>
                  <Badge variant="outline" className={
                    r.status === "NEW" ? "bg-blue-100 text-blue-800 border-blue-200" :
                    r.status === "IN_PROGRESS" ? "bg-amber-100 text-amber-800 border-amber-200" :
                    "bg-emerald-100 text-emerald-800 border-emerald-200"
                  }>
                    {r.status === "NEW" ? "Nouvelle" : r.status === "IN_PROGRESS" ? "En cours" : "Traitée"}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {formatDate(r.createdAt)} · {r.service}
                </div>
              </div>
              <DevisStatusUpdater requestId={r.id} currentStatus={r.status} />
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">📞 Téléphone : </span>
                  <a href={`tel:${r.phone}`} className="text-brand hover:underline">{r.phone}</a>
                </div>
                {r.email && (
                  <div>
                    <span className="text-muted-foreground">✉️ Email : </span>
                    <a href={`mailto:${r.email}`} className="text-brand hover:underline">{r.email}</a>
                  </div>
                )}
                {r.location && (
                  <div>
                    <span className="text-muted-foreground">📍 Localisation : </span>
                    {r.location}
                  </div>
                )}
                {r.delay && (
                  <div>
                    <span className="text-muted-foreground">⏱️ Délai souhaité : </span>
                    {r.delay}
                  </div>
                )}
              </div>
              {r.description && (
                <div className="bg-secondary rounded p-3 text-xs">
                  <div className="font-semibold mb-1">Description du besoin :</div>
                  <p className="whitespace-pre-wrap text-foreground/90">{r.description}</p>
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <Button asChild size="sm" variant="outline">
                  <a href={`https://wa.me/${r.phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer">
                    WhatsApp
                  </a>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <a href={`tel:${r.phone}`}>Appeler</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {requests.length === 0 && (
          <Card>
            <CardContent className="p-10 text-center text-muted-foreground">
              Aucune demande de devis pour l&apos;instant.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
