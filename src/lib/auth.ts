/**
 * AGBE-TECH — simple cookie-based session helper
 * (production: replace with NextAuth + bcrypt + OTP via Twilio/WhatsApp API)
 */
import { cookies } from "next/headers";
import { db } from "./db";

export const SESSION_COOKIE = "agbe_session";
const SESSION_TTL = 60 * 60 * 24 * 30; // 30 days

type SessionUser = {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  role: "CLIENT" | "PRO" | "ADMIN" | "STAFF";
};

export async function setSessionCookie(user: SessionUser) {
  const cookieStore = await cookies();
  // For demo, we encode user id + role in base64. Production: signed JWT.
  const token = Buffer.from(JSON.stringify({ ...user, ts: Date.now() })).toString("base64");
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL,
  });
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const decoded = JSON.parse(Buffer.from(token, "base64").toString()) as SessionUser & { ts: number };
    if (Date.now() - decoded.ts > SESSION_TTL * 1000) return null;
    // Re-fetch from DB to ensure role is current
    const user = await db.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, phone: true, email: true, role: true },
    });
    if (!user) return null;
    return user as SessionUser;
  } catch {
    return null;
  }
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

/**
 * Compare a plaintext password against the (in this demo, plaintext) stored hash.
 * In production: use bcrypt.compare().
 */
export function verifyPassword(plaintext: string, stored: string): boolean {
  // Demo only — production MUST use bcrypt.
  return plaintext === stored;
}
