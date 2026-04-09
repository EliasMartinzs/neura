import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

const publicRoutes = ["/auth/sign-in", "/auth/sign-up"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/auth")) return NextResponse.next();

  const isPublicRoute = publicRoutes.includes(pathname);
  const isApi = pathname.startsWith("/api");

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (session && isPublicRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!session && !isPublicRoute && !isApi) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  return NextResponse.next();
}

// Matcher aplica middleware a tudo que não seja raiz de publicRoutes ou API
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/auth/sign-in",
    "/auth/sign-up",
    "/api/:path*",
  ],
};
