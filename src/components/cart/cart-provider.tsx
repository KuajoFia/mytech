"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  image?: string;
  pricingMode?: "PRICE" | "ON_REQUEST";
  max?: number;
};

type CartState = {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      add: (item) =>
        set((s) => {
          const existing = s.items.find((i) => i.productId === item.productId);
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.productId === item.productId
                  ? { ...i, quantity: Math.min(i.quantity + item.quantity, i.max ?? 999) }
                  : i
              ),
            };
          }
          return { items: [...s.items, item] };
        }),
      remove: (productId) =>
        set((s) => ({ items: s.items.filter((i) => i.productId !== productId) })),
      updateQty: (productId, qty) =>
        set((s) => ({
          items: s.items.map((i) =>
            i.productId === productId
              ? { ...i, quantity: Math.max(1, Math.min(qty, i.max ?? 999)) }
              : i
          ),
        })),
      clear: () => set({ items: [] }),
    }),
    {
      name: "agbe-cart",
      version: 1,
    }
  )
);

// React context wrapper so SSR/CSR hydration is consistent.
import { createContext, useContext, useEffect, useState } from "react";

const CartHydrationContext = createContext<boolean>(false);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setHydrated(true), []);
  return (
    <CartHydrationContext.Provider value={hydrated}>
      {children}
    </CartHydrationContext.Provider>
  );
}

export function useCart() {
  const hydrated = useContext(CartHydrationContext);
  const items = useCartStore((s) => s.items);
  const add = useCartStore((s) => s.add);
  const remove = useCartStore((s) => s.remove);
  const updateQty = useCartStore((s) => s.updateQty);
  const clear = useCartStore((s) => s.clear);

  const safeItems = hydrated ? items : [];
  const subtotal = safeItems.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const count = safeItems.reduce((s, i) => s + i.quantity, 0);

  return { items: safeItems, add, remove, updateQty, clear, subtotal, count, hydrated };
}
