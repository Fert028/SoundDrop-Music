import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith("/auth");
    const isProtectedPage = req.nextUrl.pathname.startsWith("/profile") ||
                           req.nextUrl.pathname.startsWith("/dashboard");

    // Если пользователь авторизован и пытается зайти на страницы auth - редирект в профиль
    if (isAuth && isAuthPage) {
      return NextResponse.redirect(new URL("/profile", req.url));
    }

    // Если пользователь не авторизован и пытается зайти на защищенную страницу - редирект на логин
    if (!isAuth && isProtectedPage) {
      let from = req.nextUrl.pathname;
      if (req.nextUrl.search) {
        from += req.nextUrl.search;
      }

      return NextResponse.redirect(
        new URL(`/auth/signin?from=${encodeURIComponent(from)}`, req.url)
      );
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Для публичных страниц всегда возвращаем true
        // Проверка доступа происходит в основном теле функции
        return true;
      },
    },
  }
);

// Конфигурируем для каких маршрутов запускать middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};