/**
 * AGBE-TECH — Signed session + bcrypt password hashing
 *
 * Phase 1 — Security hardening:
 * - HMAC-signed session token (no more base64 forgery)
 * - bcrypt password hashing (no more plaintext)
 * - Same interface as before: setSessionCookie / getSession / clearSession / verifyPassword
 *
 * Production: replace HMAC with NextAuth JWT in a future iteration.
 */
import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { db } from "./db";

export const SESSION_COOKIE = "agbe_session";
const SESSION_TTL = 60 * 60 * 24 * 30; // 30 days

const SESSION_SECRET =
  process.env.NEXTAUTH_SECRET ||
  process.env.SESSION_SECRET ||
  "agbe-tech-dev-fallback-secret-change-in-prod";

if (!process.env.NEXTAUTH_SECRET && process.env.NODE_ENV === "production") {
  console.warn("[auth] NEXTAUTH_SECRET not set — using fallback secret. THIS IS INSECURE IN PRODUCTION.");
}

export type SessionUser = {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  role: "CLIENT" | "PRO" | "ADMIN" | "STAFF";
};

type SessionPayload = SessionUser & { ts: number };

function sign(payload: SessionPayload): string {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = createHmac("sha256", SESSION_SECRET).update(body).digest("base64url");
  return `${body}.${sig}`;
}

function verify(token: string): SessionPayload | null {
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expectedSig = createHmac("sha256", SESSION_SECRET).update(body).digest("base64url");
  // timingSafeEqual requires equal length buffers
  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expBuf.length) return null;
  if (!timingSafeEqual(sigBuf, expBuf)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString()) as SessionPayload;
    if (Date.now() - payload.ts > SESSION_TTL * 1000) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function setSessionCookie(user: SessionUser) {
  const cookieStore = await cookies();
  const token = sign({ ...user, ts: Date.now() });
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL,
  });
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const payload = verify(token);
  if (!payload) return null;
  // Re-fetch from DB to ensure role is current (handles role changes / deletions)
  const user = await db.user.findUnique({
    where: { id: payload.id },
    select: { id: true, name: true, phone: true, email: true, role: true },
  });
  if (!user) return null;
  return user as SessionUser;
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

// ── Password hashing ──────────────────────────────────────────

const BCRYPT_ROUNDS = 10;

export async function hashPassword(plaintext: string): Promise<string> {
  return bcrypt.hash(plaintext, BCRYPT_ROUNDS);
}

export async function verifyPassword(plaintext: string, hash: string): Promise<boolean> {
  if (!hash) return false;
  // Backward-compat: legacy plaintext stored hashes — flag them so caller can rehash
  if (!hash.startsWith("$2a$") && !hash.startsWith("$2b$") && !hash.startsWith("$2y$")) {
    // Plaintext legacy — verify then rehash at call site
    return plaintext === hash;
  }
  return bcrypt.compare(plaintext, hash);
}

// ── Authorization helpers ──────────────────────────────────────

export async function requireAdmin(): Promise<SessionUser | null> {
  const session = await getSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "STAFF")) return null;
  return session;
}

export async function requireAuth(): Promise<SessionUser | null> {
  return await getSession();
}
