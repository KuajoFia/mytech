import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// Mock Next.js headers/cookies — they're only available in server components
vi.mock("next/headers", () => ({
  cookies: vi.fn(() => ({
    get: vi.fn(() => undefined),
    set: vi.fn(),
    delete: vi.fn(),
  })),
}));

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

// Mock @/lib/db for unit tests that don't need a real DB
vi.mock("@/lib/db", () => ({
  db: {
    user: { findUnique: vi.fn(), findFirst: vi.fn(), create: vi.fn(), update: vi.fn() },
    order: { findUnique: vi.fn(), create: vi.fn(), update: vi.fn(), count: vi.fn() },
    product: { findMany: vi.fn(), findUnique: vi.fn(), update: vi.fn() },
    settings: { findFirst: vi.fn(), update: vi.fn() },
    paymentTransaction: { findUnique: vi.fn(), create: vi.fn(), update: vi.fn() },
    orderTimeline: { create: vi.fn() },
  },
}));
