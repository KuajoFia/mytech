"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

type Props = {
  product?: any;
  categories: { id: string; name: string }[];
  brands: { id: string; name: string }[];
};

export function ProductForm({ product, categories, brands }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [attrs, setAttrs] = useState<{ name: string; value: string }[]>(
    product?.attributes ? safeParseArr(product.attributes) : []
  );
  const [form, setForm] = useState({
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    sku: product?.sku ?? "",
    barcode: product?.barcode ?? "",
    shortDesc: product?.shortDesc ?? "",
    description: product?.description ?? "",
    categoryId: product?.categoryId ?? categories[0]?.id ?? "",
    brandId: product?.brandId ?? "",
    regularPrice: product?.regularPrice ?? 0,
    promoPrice: product?.promoPrice ?? 0,
    stock: product?.stock ?? 0,
    stockThreshold: product?.stockThreshold ?? 3,
    warranty: product?.warranty ?? "",
    weight: product?.weight ?? 0,
    dimensions: product?.dimensions ?? "",
    pdfSpec: product?.pdfSpec ?? "",
    tags: product?.tags ? (safeParseArr(product.tags).join(", ")) : "",
    pricingMode: product?.pricingMode ?? "PRICE",
    status: product?.status ?? "ACTIVE",
    featured: product?.featured ?? false,
  });

  function safeParseArr(s: string): any[] {
    try { return JSON.parse(s) } catch { return [] }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        regularPrice: Number(form.regularPrice),
        promoPrice: form.promoPrice ? Number(form.promoPrice) : null,
        stock: Number(form.stock),
        stockThreshold: Number(form.stockThreshold),
        weight: form.weight ? Number(form.weight) : null,
        attributes: JSON.stringify(attrs.filter((a) => a.name && a.value)),
        tags: JSON.stringify(form.tags.split(",").map((t) => t.trim()).filter(Boolean)),
        images: product?.images ?? "[]",
      };
      const url = product ? `/api/admin/products/${product.id}` : "/api/admin/products";
      const method = product ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.error ?? "Échec");
      }
      toast.success(product ? "Produit mis à jour" : "Produit créé");
      router.push("/admin/produits");
      router.refresh();
    } catch (e: any) {
      toast.error("Erreur", { description: e.message });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <Link href="/admin/produits" className="inline-flex items-center text-sm text-muted-foreground hover:text-brand">
        <ArrowLeft className="h-4 w-4 mr-1" /> Retour
      </Link>

      <Card>
        <CardHeader className="pb-3"><h2 className="font-display font-bold">Informations générales</h2></CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Label htmlFor="name">Nom du produit *</Label>
            <Input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="slug">Slug (URL)</Label>
            <Input id="slug" value={form.slug} placeholder="auto-généré si vide" onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="sku">SKU *</Label>
            <Input id="sku" required value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="cat">Catégorie *</Label>
            <Select value={form.categoryId} onValueChange={(v) => setForm({ ...form, categoryId: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="brand">Marque</Label>
            <Select value={form.brandId} onValueChange={(v) => setForm({ ...form, brandId: v })}>
              <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">— Aucune —</SelectItem>
                {brands.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="short">Description courte</Label>
            <Input id="short" value={form.shortDesc} onChange={(e) => setForm({ ...form, shortDesc: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="desc">Description complète</Label>
            <Textarea id="desc" rows={5} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="tags">Tags (séparés par virgules)</Label>
            <Input id="tags" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="ip, dome, 4mp" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3"><h2 className="font-display font-bold">Prix & stock</h2></CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div>
            <Label htmlFor="rp">Prix régulier (FCFA) *</Label>
            <Input id="rp" type="number" required value={form.regularPrice} onChange={(e) => setForm({ ...form, regularPrice: Number(e.target.value) })} />
          </div>
          <div>
            <Label htmlFor="pp">Prix promo (FCFA)</Label>
            <Input id="pp" type="number" value={form.promoPrice || ""} onChange={(e) => setForm({ ...form, promoPrice: Number(e.target.value) })} />
          </div>
          <div>
            <Label htmlFor="pm">Mode de tarification</Label>
            <Select value={form.pricingMode} onValueChange={(v) => setForm({ ...form, pricingMode: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="PRICE">Prix affiché</SelectItem>
                <SelectItem value="ON_REQUEST">Prix sur demande</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="st">Stock</Label>
            <Input id="st" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} />
          </div>
          <div>
            <Label htmlFor="stt">Seuil d&apos;alerte</Label>
            <Input id="stt" type="number" value={form.stockThreshold} onChange={(e) => setForm({ ...form, stockThreshold: Number(e.target.value) })} />
          </div>
          <div>
            <Label htmlFor="status">Statut</Label>
            <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Actif</SelectItem>
                <SelectItem value="DRAFT">Brouillon</SelectItem>
                <SelectItem value="ARCHIVED">Archivé</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="war">Garantie</Label>
            <Input id="war" value={form.warranty} onChange={(e) => setForm({ ...form, warranty: e.target.value })} />
          </div>
          <div className="md:col-span-3 flex items-center gap-3">
            <Switch
              id="feat"
              checked={form.featured}
              onCheckedChange={(v) => setForm({ ...form, featured: v })}
            />
            <Label htmlFor="feat">Mettre en avant (page d&apos;accueil)</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <h2 className="font-display font-bold">Attributs techniques</h2>
          <Button type="button" variant="outline" size="sm" onClick={() => setAttrs([...attrs, { name: "", value: "" }])}>
            + Ajouter
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {attrs.length === 0 && (
            <p className="text-xs text-muted-foreground">Aucun attribut. Ajoutez-en pour les specs techniques (résolution, puissance, etc.).</p>
          )}
          {attrs.map((a, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2">
              <Input placeholder="Nom (ex : Résolution)" value={a.name} onChange={(e) => {
                const arr = [...attrs]; arr[i].name = e.target.value; setAttrs(arr);
              }} />
              <Input placeholder="Valeur (ex : 4 MP)" value={a.value} onChange={(e) => {
                const arr = [...attrs]; arr[i].value = e.target.value; setAttrs(arr);
              }} />
              <Button type="button" variant="ghost" size="icon" onClick={() => setAttrs(attrs.filter((_, idx) => idx !== i))}>
                ✕
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex gap-2 justify-end">
        <Button asChild variant="outline">
          <Link href="/admin/produits">Annuler</Link>
        </Button>
        <Button type="submit" disabled={saving} className="bg-brand hover:bg-brand-light">
          <Save className="h-4 w-4 mr-1" /> {saving ? "Enregistrement…" : "Enregistrer"}
        </Button>
      </div>
    </form>
  );
}
