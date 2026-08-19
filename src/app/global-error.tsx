"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertOctagon, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[global-error]", error);
  }, [error]);

  return (
    <html lang="fr">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif" }}>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#F5F7FA",
            padding: "1rem",
          }}
        >
          <div style={{ maxWidth: 480, textAlign: "center" }}>
            <div
              style={{
                width: 64,
                height: 64,
                margin: "0 auto 16px",
                borderRadius: "50%",
                background: "#FEE2E2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AlertOctagon color="#DC2626" size={32} />
            </div>
            <h1 style={{ color: "#0A3D91", fontSize: 24, marginBottom: 8 }}>
              Erreur critique
            </h1>
            <p style={{ color: "#5C6678", fontSize: 14, marginBottom: 24 }}>
              L&apos;application a rencontré une erreur inattendue. Veuillez réessayer.
              {error.digest && (
                <span style={{ display: "block", marginTop: 8, fontFamily: "monospace", fontSize: 12 }}>
                  Réf: {error.digest}
                </span>
              )}
            </p>
            <button
              onClick={reset}
              style={{
                background: "#0A3D91",
                color: "white",
                border: 0,
                padding: "12px 24px",
                borderRadius: 8,
                fontWeight: 700,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <RefreshCw size={16} /> Réessayer
            </button>
            <div style={{ marginTop: 16 }}>
              <Link href="/" style={{ color: "#0A3D91", fontSize: 14 }}>
                ← Retour à l&apos;accueil
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
