import { NextResponse, type NextRequest } from "next/server";

const COOKIE_NAME = "rekal_auth";

export function proxy(request: NextRequest) {
  const password = process.env.APP_PASSWORD;
  const token = process.env.AUTH_SECRET ?? password;
  const isLogin = request.nextUrl.pathname === "/login";
  const isAuthenticated = Boolean(token && request.cookies.get(COOKIE_NAME)?.value === token);

  if (!password) {
    return isLogin ? NextResponse.next() : NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthenticated && isLogin) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!isAuthenticated && !isLogin) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
