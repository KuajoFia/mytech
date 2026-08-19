"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SlidersHorizontal, RotateCcw } from "lucide-react";

type FilterProps = {
  categories: { slug: string; name: string }[];
  brands: { slug: string; name: string }[];
  current: {
    cat?: string;
    brand?: string;
    q?: string;
    sort?: string;
    max?: number;
    inStockOnly?: boolean;
  };
};

export function ShopFilters({ categories, brands, current }: FilterProps) {
  const router = useRouter();
  const sp = useSearchParams();

  const params = useMemo(() => {
    const p = new URLSearchParams(sp?.toString() ?? "");
    return p;
  }, [sp]);

  function update(key: string, value?: string) {
    const p = new URLSearchParams(params.toString());
    if (value && value !== "all" && value !== "") p.set(key, value);
    else p.delete(key);
    router.push(`/boutique?${p.toString()}`);
  }

  function reset() {
    router.push("/boutique");
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-brand" /> Filtres
        </h3>
        <Button variant="ghost" size="sm" onClick={reset} className="text-xs">
          <RotateCcw className="h-3 w-3 mr-1" /> Réinitialiser
        </Button>
      </div>

      {/* Search */}
      <div>
        <Label className="text-xs font-semibold uppercase text-muted-foreground mb-1.5">Recherche</Label>
        <Input
          placeholder="caméra, panneau, switch…"
          defaultValue={current.q ?? ""}
          onChange={(e) => update("q", e.target.value)}
          className="h-9"
        />
      </div>

      {/* Sort */}
      <div>
        <Label className="text-xs font-semibold uppercase text-muted-foreground mb-1.5">Trier par</Label>
        <Select defaultValue={current.sort ?? "newest"} onValueChange={(v) => update("sort", v)}>
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Nouveautés</SelectItem>
            <SelectItem value="price-asc">Prix croissant</SelectItem>
            <SelectItem value="price-desc">Prix décroissant</SelectItem>
            <SelectItem value="name">Nom A → Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Category */}
      <div>
        <Label className="text-xs font-semibold uppercase text-muted-foreground mb-1.5">Catégorie</Label>
        <div className="space-y-1.5">
          <button
            onClick={() => update("cat")}
            className={`block w-full text-left text-sm rounded-md px-2 py-1.5 hover:bg-secondary ${!current.cat || current.cat === "all" ? "bg-secondary font-semibold text-brand" : ""}`}
          >
            Toutes les catégories
          </button>
          {categories.map((c) => (
            <button
              key={c.slug}
              onClick={() => update("cat", c.slug)}
              className={`block w-full text-left text-sm rounded-md px-2 py-1.5 hover:bg-secondary ${current.cat === c.slug ? "bg-secondary font-semibold text-brand" : ""}`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Brand */}
      <div>
        <Label className="text-xs font-semibold uppercase text-muted-foreground mb-1.5">Marque</Label>
        <Select defaultValue={current.brand ?? "all"} onValueChange={(v) => update("brand", v)}>
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les marques</SelectItem>
            {brands.map((b) => (
              <SelectItem key={b.slug} value={b.slug}>{b.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Max price */}
      <div>
        <Label className="text-xs font-semibold uppercase text-muted-foreground mb-1.5">
          Prix max (FCFA)
        </Label>
        <Input
          type="number"
          step="5000"
          min="0"
          placeholder="ex : 200000"
          defaultValue={current.max ?? ""}
          onChange={(e) => update("max", e.target.value)}
          className="h-9"
        />
      </div>

      {/* In stock */}
      <label className="flex items-center gap-2 cursor-pointer">
        <Checkbox
          checked={!!current.inStockOnly}
          onCheckedChange={(v) => update("inStock", v ? "1" : "")}
        />
        <span className="text-sm">En stock uniquement</span>
      </label>
    </div>
  );
}
