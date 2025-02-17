import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const intlMiddleware = createMiddleware(routing);

const checkAuth = async (req: NextRequest) => {
  const protectedPaths = ["/dashboard", "/admin", "/profile"];
  const isProtectedPath = protectedPaths.some((path) => req.nextUrl.pathname.includes(path));

  if (!isProtectedPath) return null;

  // Check the validity of the token
  const token = await getToken({ req });

  if (!token) {
    const from = req.nextUrl.pathname + req.nextUrl.search;
    return NextResponse.redirect(new URL(`/login?from=${encodeURIComponent(from)}`, req.url));
  }

  return null;
};

export async function middleware(req: NextRequest) {
  const authResult = await checkAuth(req);
  if (authResult) return authResult;

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
