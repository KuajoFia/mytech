import { describe, it, expect } from "vitest";
import { z } from "zod";

describe("Checkout Zod schema", () => {
  const CheckoutItemSchema = z.object({
    productId: z.string().min(1),
    quantity: z.number().int().min(1).max(999),
  });

  const CheckoutSchema = z.object({
    name: z.string().min(2, "Nom requis").max(120),
    phone: z.string().min(8, "Téléphone invalide").max(20),
    items: z.array(CheckoutItemSchema).min(1, "Panier vide"),
    deliveryMode: z.enum(["PICKUP_STORE", "LOME_DELIVERY", "OTHER_REGIONS"]),
  });

  it("accepts a valid checkout payload", () => {
    const valid = {
      name: "Jean Kouassi",
      phone: "+22898112233",
      items: [{ productId: "abc", quantity: 2 }],
      deliveryMode: "LOME_DELIVERY",
    };
    const result = CheckoutSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("rejects empty cart", () => {
    const invalid = {
      name: "Jean",
      phone: "+22898112233",
      items: [],
      deliveryMode: "LOME_DELIVERY",
    };
    const result = CheckoutSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("rejects phone too short", () => {
    const invalid = {
      name: "Jean",
      phone: "123",
      items: [{ productId: "abc", quantity: 1 }],
      deliveryMode: "LOME_DELIVERY",
    };
    const result = CheckoutSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("rejects invalid delivery mode", () => {
    const invalid = {
      name: "Jean",
      phone: "+22898112233",
      items: [{ productId: "abc", quantity: 1 }],
      deliveryMode: "EXPRESS_DRONE",
    };
    const result = CheckoutSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("rejects negative quantity", () => {
    const invalid = {
      name: "Jean",
      phone: "+22898112233",
      items: [{ productId: "abc", quantity: -5 }],
      deliveryMode: "LOME_DELIVERY",
    };
    const result = CheckoutSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
