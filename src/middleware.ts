import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Create i18n middleware
const intlMiddleware = createMiddleware(routing);

// Check authentication
const checkAuth = (req: NextRequest) => {
  // Protected routes
  const protectedPaths = ["/dashboard", "/admin", "/profile"];
  const isProtectedPath = protectedPaths.some((path) => req.nextUrl.pathname.includes(path));

  if (!isProtectedPath) return null;

  // Check token (you can modify this according to your needs)
  const token = req.cookies.get("next-auth.session-token");

  if (!token) {
    const from = req.nextUrl.pathname + req.nextUrl.search;
    return NextResponse.redirect(new URL(`/login?from=${encodeURIComponent(from)}`, req.url));
  }

  return null;
};

// Combined middleware
export async function middleware(req: NextRequest) {
  // Check authentication first
  const authResult = checkAuth(req);
  if (authResult) return authResult;

  // Continue to i18n middleware
  return intlMiddleware(req);
}

export const config = {
  matcher: [
    // i18n routes
    "/",
    "/(fi|en)/:path*",
    // Protected routes
    "/dashboard/:path*",
    "/admin/:path*",
    "/profile/:path*",
    "/login",
  ],
};
