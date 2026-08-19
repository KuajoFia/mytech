import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // Make current pathname available to server components via a request header.
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", req.nextUrl.pathname);
  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/placeholder).*)"],
};
