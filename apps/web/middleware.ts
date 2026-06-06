import createMiddleware from "next-intl/middleware";
import { withAuth } from "next-auth/middleware";
import { routing } from "@/i18n/routing";
import { NextResponse } from "next/server";
import type { NextRequestWithAuth } from "next-auth/middleware";

const intlMiddleware = createMiddleware(routing);

const protectedPaths = ["/dashboard"];
const authPaths = ["/sign-in", "/sign-up", "/verify"];

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Strip locale prefix to check path
    const pathWithoutLocale = pathname.replace(/^\/(en|ua)/, "") || "/";

    const isProtected = protectedPaths.some((p) =>
      pathWithoutLocale.startsWith(p),
    );
    const isAuthPage = authPaths.some((p) => pathWithoutLocale.startsWith(p));

    if (isProtected && !token) {
      const signInUrl = new URL("/sign-in", req.nextUrl.origin);
      signInUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
      return NextResponse.redirect(signInUrl);
    }

    if (isAuthPage && token) {
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl.origin));
    }

    return intlMiddleware(req);
  },
  {
    callbacks: {
      // Always run the middleware function; auth checking is done inside
      authorized: () => true,
    },
  },
);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
