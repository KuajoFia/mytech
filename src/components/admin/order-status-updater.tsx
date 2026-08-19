"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ORDER_STATUS_LABELS } from "@/lib/utils";

export function OrderStatusUpdater({
  orderId,
  currentStatus,
  statuses,
}: {
  orderId: string;
  currentStatus: string;
  statuses: string[];
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [busy, setBusy] = useState(false);

  async function save() {
    if (status === currentStatus) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, note: "Mis à jour depuis le back-office" }),
      });
      if (!res.ok) throw new Error("Échec");
      toast.success(`Statut → ${ORDER_STATUS_LABELS[status]}`);
      router.refresh();
    } catch (e: any) {
      toast.error("Erreur", { description: e.message });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
        <SelectContent>
          {statuses.map((s) => (
            <SelectItem key={s} value={s}>{ORDER_STATUS_LABELS[s]}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button onClick={save} disabled={busy || status === currentStatus} className="bg-brand hover:bg-brand-light">
        {busy ? "…" : "Appliquer"}
      </Button>
    </div>
  );
}
