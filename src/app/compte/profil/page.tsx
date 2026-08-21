import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";


export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect("/compte/connexion");

  const user = await db.user.findUnique({
    where: { id: session.id },
    include: { addresses: true },
  });
  if (!user) redirect("/compte/connexion");

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <Link href="/compte" className="text-sm text-muted-foreground hover:text-brand mb-4 inline-block">
        ← Retour au tableau de bord
      </Link>
      <h1 className="font-display text-2xl font-bold mb-6">Mon profil</h1>

      <Card className="mb-6">
        <CardHeader className="pb-3"><h2 className="font-display font-bold">Informations</h2></CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <div className="text-muted-foreground">Nom complet</div>
            <div className="font-medium">{user.name}</div>
            <div className="text-muted-foreground">Téléphone</div>
            <div className="font-medium">{user.phone}</div>
            <div className="text-muted-foreground">Email</div>
            <div className="font-medium">{user.email ?? "—"}</div>
            <div className="text-muted-foreground">Type de compte</div>
            <div className="font-medium">{user.role}</div>
            {user.companyName && (
              <>
                <div className="text-muted-foreground">Raison sociale</div>
                <div className="font-medium">{user.companyName}</div>
              </>
            )}
            {user.nif && (
              <>
                <div className="text-muted-foreground">NIF</div>
                <div className="font-medium">{user.nif}</div>
              </>
            )}
            {user.rccm && (
              <>
                <div className="text-muted-foreground">RCCM</div>
                <div className="font-medium">{user.rccm}</div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <h2 className="font-display font-bold">Carnet d&apos;adresses</h2>
          <Button variant="outline" size="sm" disabled>Ajouter</Button>
        </CardHeader>
        <CardContent>
          {user.addresses.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune adresse enregistrée pour l&apos;instant.</p>
          ) : (
            <ul className="space-y-2">
              {user.addresses.map((a) => (
                <li key={a.id} className="text-sm border rounded p-3">
                  <div className="font-medium">{a.label}</div>
                  <div className="text-muted-foreground">{a.line1} {a.line2}</div>
                  <div className="text-muted-foreground">{a.city} {a.region}</div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
