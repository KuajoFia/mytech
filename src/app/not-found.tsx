import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search, Phone } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full text-center space-y-6">
        <div className="space-y-2">
          <p className="font-display text-7xl font-extrabold text-brand">404</p>
          <h1 className="font-display text-2xl font-bold">Page introuvable</h1>
          <p className="text-sm text-muted-foreground">
            La page que vous recherchez n&apos;existe pas, a été déplacée, ou n&apos;est plus accessible.
            Si vous pensez qu&apos;il s&apos;agit d&apos;une erreur, n&apos;hésitez pas à nous contacter.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          <Button asChild className="bg-brand hover:bg-brand-light">
            <Link href="/">
              <Home className="h-4 w-4 mr-1" /> Accueil
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/boutique">
              <Search className="h-4 w-4 mr-1" /> Voir la boutique
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/contact">
              <Phone className="h-4 w-4 mr-1" /> Nous contacter
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
