"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to your error tracking service (Sentry, etc.)
    console.error("[app-error]", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
          <AlertTriangle className="h-8 w-8 text-amber-600" />
        </div>
        <div className="space-y-2">
          <h1 className="font-display text-2xl font-bold text-brand">
            Une erreur est survenue
          </h1>
          <p className="text-sm text-muted-foreground">
            Nous n&apos;avons pas pu traiter votre demande. Notre équipe a été notifiée.
            {error.digest && (
              <span className="block mt-2 text-xs font-mono">Réf: {error.digest}</span>
            )}
          </p>
        </div>
        <div className="flex gap-2 justify-center">
          <Button onClick={reset} className="bg-brand hover:bg-brand-light">
            <RefreshCw className="h-4 w-4 mr-1" /> Réessayer
          </Button>
          <Button asChild variant="outline">
            <Link href="/">
              <Home className="h-4 w-4 mr-1" /> Accueil
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
