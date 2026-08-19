import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword, SESSION_COOKIE } from "@/lib/auth";

describe("password hashing", () => {
  it("hashes a password with bcrypt (hash starts with $2)", async () => {
    const hash = await hashPassword("mySecret123");
    expect(hash).toMatch(/^\$2[abxy]\$/);
    expect(hash).not.toBe("mySecret123");
  });

  it("produces different hashes for the same password (random salt)", async () => {
    const h1 = await hashPassword("mySecret123");
    const h2 = await hashPassword("mySecret123");
    expect(h1).not.toBe(h2);
  });

  it("verifies a correct password against a bcrypt hash", async () => {
    const hash = await hashPassword("mySecret123");
    const ok = await verifyPassword("mySecret123", hash);
    expect(ok).toBe(true);
  });

  it("rejects an incorrect password", async () => {
    const hash = await hashPassword("mySecret123");
    const ok = await verifyPassword("wrongPassword", hash);
    expect(ok).toBe(false);
  });

  it("handles legacy plaintext hashes (backward-compat)", async () => {
    const ok = await verifyPassword("plaintext-pw", "plaintext-pw");
    expect(ok).toBe(true);
  });

  it("returns false for empty hash", async () => {
    const ok = await verifyPassword("test", "");
    expect(ok).toBe(false);
  });
});

describe("session constants", () => {
  it("exports the cookie name", () => {
    expect(SESSION_COOKIE).toBe("agbe_session");
  });
});
