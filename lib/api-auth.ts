import { type NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "rekal_auth";

export function isAuthenticated(request: NextRequest) {
  const password = process.env.APP_PASSWORD;
  const token = process.env.AUTH_SECRET ?? password;

  return Boolean(token && request.cookies.get(COOKIE_NAME)?.value === token);
}

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
}
