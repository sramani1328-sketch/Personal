import { NextResponse, type NextRequest } from "next/server";

// Lightweight guard — only checks that a session cookie exists. Full verification runs in the
// server components / API routes via getSessionAdmin().
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const publicPaths = ["/admin/login", "/admin/verify-otp"];
  const isPublicApi =
    pathname.startsWith("/api/admin/auth/login") ||
    pathname.startsWith("/api/admin/auth/verify-otp");

  if (!pathname.startsWith("/admin") && !pathname.startsWith("/api/admin")) return NextResponse.next();
  if (publicPaths.includes(pathname) || isPublicApi) return NextResponse.next();

  const token = req.cookies.get("sr_admin_session")?.value;
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };
