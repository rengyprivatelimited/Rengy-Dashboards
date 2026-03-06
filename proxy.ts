import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getDashboardPath, isRoleSlug } from "@/features/auth/auth-config";

const PUBLIC_ROUTES = ["/login", "/forgot-password", "/logout"];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublicRoute = isPublicPath(pathname);
  const isAuthenticated = request.cookies.get("rengy_auth")?.value === "1";
  const roleCookie = request.cookies.get("rengy_role")?.value;
  const hasValidRole = !!roleCookie && isRoleSlug(roleCookie);
  const roleDashboardPath = hasValidRole ? getDashboardPath(roleCookie) : "/login";

  // Allow logout page to run its client-side cleanup flow.
  if (pathname === "/logout") {
    return NextResponse.next();
  }

  if (!isAuthenticated && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthenticated && isPublicRoute && hasValidRole) {
    return NextResponse.redirect(new URL(roleDashboardPath, request.url));
  }

  if (isAuthenticated && pathname === "/" && hasValidRole) {
    return NextResponse.redirect(new URL(roleDashboardPath, request.url));
  }

  if (isAuthenticated && !hasValidRole && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthenticated && hasValidRole && pathname.startsWith("/dashboard/")) {
    const requestedRole = pathname.split("/")[2] ?? "";
    if (!isRoleSlug(requestedRole) || requestedRole !== roleCookie) {
      return NextResponse.redirect(new URL(roleDashboardPath, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
