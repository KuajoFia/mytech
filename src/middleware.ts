import { NextResponse, type NextRequest } from "next/server";

/**
 * Middleware — runs on every request before the route handler.
 *
 * Responsibilities:
 * - Inject `x-pathname` header for server components to know the current path.
 * - Apply security headers to all responses.
 * - Note: Auth checks are done at the route handler / page level via getSession().
 *   Middleware can't reliably verify our HMAC token (Edge runtime has no Node crypto),
 *   so we keep the heavy auth in the API routes themselves.
 */

const SECURITY_HEADERS = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

export function middleware(req: NextRequest) {
  // Make current pathname available to server components via a request header.
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", req.nextUrl.pathname);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  // Apply security headers
  for (const h of SECURITY_HEADERS) {
    response.headers.set(h.key, h.value);
  }

  // In production, add HSTS
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload"
    );
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/placeholder).*)"],
};
