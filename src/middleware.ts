import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

// Optimized middleware that only runs for a limited set of routes
// and creates static paths for most content
export default async function middleware(request: NextRequest) {
  // Skip middleware for static assets and API routes
  if (
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/api") ||
    request.nextUrl.pathname.match(/\.(jpg|jpeg|png|gif|svg|ico|webp|css|js)$/)
  ) {
    return NextResponse.next();
  }

  // Use lighter middleware configuration
  const intlMiddleware = createMiddleware({
    ...routing,
    localePrefix: "as-needed",
    localeDetection: false,
  });

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Only match routes that need localization
    "/",
    "/(fi|en)/:path*",
    // Exclude all static assets to improve performance
    "/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)",
  ],
};
