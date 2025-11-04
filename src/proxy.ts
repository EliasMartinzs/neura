import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const publicRoutes = ["/auth/sign-in", "/auth/sign-up"];

// export async function proxy(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   // Rotas de API são sempre públicas
//   const isApi = pathname.startsWith("/api");

//   // Rotas públicas de auth
//   const isPublicRoute = publicRoutes.includes(pathname);

//   // Pega a sessão atual
//   const session = await auth.api.getSession({
//     headers: request.headers,
//   });

//   // Usuário logado acessando rota pública → redireciona para dashboard
//   if (session && isPublicRoute) {
//     return NextResponse.redirect(new URL("/dashboard", request.url));
//   }

//   // Usuário não logado acessando rota privada (não é pública nem API) → redireciona para sign-in
//   if (!session && !isPublicRoute && !isApi) {
//     return NextResponse.redirect(new URL("/auth/sign-in", request.url));
//   }

//   // Qualquer outra rota (API ou rota privada com sessão) → deixa passar
//   return NextResponse.next();
// }

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ignora rotas do Better Auth
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
