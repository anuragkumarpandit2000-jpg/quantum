import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PREFIXES = ["/dashboard", "/onboarding", "/admin"];

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const host = request.headers.get("host") || "";

  // 1. Canonical Domain Redirection (Apex -> www 301 Permanent Redirect)
  if (host === "transformationyourself.in") {
    const canonicalUrl = new URL(`https://www.transformationyourself.in${pathname}${search}`);
    return NextResponse.redirect(canonicalUrl, { status: 301 });
  }

  // 2. CSRF Mitigation for State-Changing API Mutations
  if (["POST", "PUT", "DELETE", "PATCH"].includes(request.method)) {
    const origin = request.headers.get("origin");
    if (origin && host) {
      try {
        const originHost = new URL(origin).host;
        const isLocal = host.includes("localhost") || host.includes("127.0.0.1");
        const isProdMatch = originHost === host || originHost.endsWith(".transformationyourself.in");
        if (!isLocal && !isProdMatch) {
          return new NextResponse(
            JSON.stringify({ error: "Forbidden: Cross-Site Request Forgery (CSRF) detected." }),
            { status: 403, headers: { "Content-Type": "application/json" } }
          );
        }
      } catch {
        // Malformed origin header
        return new NextResponse(
          JSON.stringify({ error: "Forbidden: Malformed Origin header." }),
          { status: 403, headers: { "Content-Type": "application/json" } }
        );
      }
    }
  }

  // 3. Route Protection: Redirect Unauthenticated Users to /login
  const token = request.cookies.get("quantum_session")?.value;
  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  if (isProtected) {
    if (!token || token.split(".").length !== 3) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 4. Response with Modern Enterprise Security Headers
  const response = NextResponse.next();

  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), browsing-topics=()"
  );

  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "media-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://generativelanguage.googleapis.com https://api.resend.com",
    "frame-ancestors 'none'",
  ].join("; ");

  response.headers.set("Content-Security-Policy", csp);

  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload"
    );
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - sitemap.xml
     * - robots.txt
     * - public assets (/assets, /uploads)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|assets/|uploads/).*)",
  ],
};
