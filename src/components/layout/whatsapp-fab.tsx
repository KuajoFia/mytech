"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, X } from "lucide-react";

export function WhatsAppFab() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  if (pathname?.startsWith("/admin")) return null;

  const phone = "22898897914";
  const defaultMessage = encodeURIComponent(
    "Bonjour AGBE-TECH, je souhaite un devis / une information."
  );

  if (!mounted) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      {open && (
        <div className="bg-background rounded-lg shadow-brand-lg border border-border w-72 overflow-hidden animate-fade-in">
          <div className="bg-brand p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                <span className="font-semibold">Chat WhatsApp AGBE-TECH</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Fermer"
                className="rounded p-1 hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-white/80 mt-1">
              Réponse sous 30 min en heures ouvrables
            </p>
          </div>
          <div className="p-4 space-y-3">
            <p className="text-sm text-muted-foreground">
              Bonjour 👋 Comment pouvons-nous vous aider aujourd&apos;hui ?
            </p>
            <a
              href={`https://wa.me/${phone}?text=${defaultMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-[#25D366] hover:bg-[#1eb858] text-white text-sm font-medium rounded-md px-4 py-2.5 text-center transition"
            >
              Ouvrir WhatsApp
            </a>
            <a
              href="tel:+22898897914"
              className="block w-full border border-border text-sm font-medium rounded-md px-4 py-2.5 text-center hover:bg-secondary"
            >
              Appeler +228 98 89 79 14
            </a>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="WhatsApp"
        className="h-14 w-14 rounded-full bg-[#25D366] hover:bg-[#1eb858] shadow-brand-lg flex items-center justify-center text-white transition-transform hover:scale-105"
      >
        <svg viewBox="0 0 32 32" fill="currentColor" className="h-7 w-7" aria-hidden="true">
          <path d="M16.04 4c-6.6 0-11.96 5.36-11.96 11.96 0 2.1.55 4.16 1.6 5.97L4 28l6.27-1.64c1.74.95 3.71 1.45 5.71 1.45h.01c6.6 0 11.96-5.36 11.96-11.96C28 9.36 22.64 4 16.04 4zm0 21.85h-.01c-1.79 0-3.55-.48-5.08-1.39l-.36-.22-3.72.97.99-3.63-.24-.37a9.86 9.86 0 0 1-1.51-5.25c0-5.46 4.45-9.91 9.92-9.91 2.65 0 5.14 1.04 7.02 2.91a9.83 9.83 0 0 1 2.91 7.01c0 5.46-4.45 9.88-9.92 9.88zm5.44-7.42c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.07 4.49.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35z"/>
        </svg>
      </button>
    </div>
  );
}
