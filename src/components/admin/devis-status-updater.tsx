"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function DevisStatusUpdater({ requestId, currentStatus }: { requestId: string; currentStatus: string }) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [busy, setBusy] = useState(false);

  async function save() {
    if (status === currentStatus) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/devis/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Échec");
      toast.success("Statut mis à jour");
      router.refresh();
    } catch (e: any) {
      toast.error("Erreur", { description: e.message });
    } finally {
      setBusy(false);
    }
  }

  const labels: Record<string, string> = {
    NEW: "Nouvelle",
    IN_PROGRESS: "En cours",
    TREATED: "Traitée",
  };

  return (
    <div className="flex items-center gap-2 shrink-0">
      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="w-36 h-8 text-xs"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="NEW">Nouvelle</SelectItem>
          <SelectItem value="IN_PROGRESS">En cours</SelectItem>
          <SelectItem value="TREATED">Traitée</SelectItem>
        </SelectContent>
      </Select>
      <Button size="sm" onClick={save} disabled={busy || status === currentStatus} className="bg-brand hover:bg-brand-light h-8">
        {busy ? "…" : "OK"}
      </Button>
    </div>
  );
}
