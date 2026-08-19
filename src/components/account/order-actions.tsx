"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CheckCircle2, CreditCard, XCircle, RotateCcw } from "lucide-react";
import { ORDER_STATUS_LABELS } from "@/lib/utils";

type OrderActionsProps = {
  order: {
    id: string;
    status: string;
    number: string;
    paymentMethod: string | null;
  };
};

export function OrderActions({ order }: OrderActionsProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function updateStatus(status: string, note?: string) {
    setBusy(true);
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, note }),
      });
      if (!res.ok) throw new Error("Échec");
      toast.success(`Statut mis à jour : ${ORDER_STATUS_LABELS[status]}`);
      router.refresh();
    } catch (e: any) {
      toast.error("Erreur", { description: e.message });
    } finally {
      setBusy(false);
    }
  }

  async function markPaid() {
    setBusy(true);
    try {
      // Simulate a payment confirmation (in production: webhook from Kkiapay/CinetPay)
      const res = await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "PAID",
          paymentMethod: order.paymentMethod ?? "TMONEY",
          paymentRef: `DEMO-${Date.now()}`,
          note: "Paiement confirmé (démo)",
        }),
      });
      if (!res.ok) throw new Error("Échec");
      toast.success("Paiement confirmé !", {
        description: "Le reçu PDF est disponible dans vos documents.",
      });
      router.refresh();
    } catch (e: any) {
      toast.error("Erreur", { description: e.message });
    } finally {
      setBusy(false);
    }
  }

  // Available actions per status
  const actions: React.ReactNode[] = [];

  if (order.status === "AWAITING_PAYMENT") {
    actions.push(
      <Button key="pay" onClick={markPaid} disabled={busy} className="bg-emerald-600 hover:bg-emerald-700">
        <CreditCard className="h-4 w-4 mr-1" /> Simuler paiement (T-Money)
      </Button>
    );
  }
  if (order.status === "QUOTE_REQUESTED") {
    actions.push(
      <Button key="cancel" onClick={() => updateStatus("CANCELLED", "Annulée par le client")} disabled={busy} variant="outline">
        <XCircle className="h-4 w-4 mr-1" /> Annuler
      </Button>
    );
  }
  if (order.status === "DELIVERED") {
    actions.push(
      <Button key="reorder" asChild variant="outline">
        <a href="/boutique">
          <RotateCcw className="h-4 w-4 mr-1" /> Re-commander
        </a>
      </Button>
    );
  }

  if (actions.length === 0) return null;
  return <div className="flex flex-wrap gap-2">{actions}</div>;
}
