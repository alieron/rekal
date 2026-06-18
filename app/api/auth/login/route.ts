import { NextResponse } from "next/server";

const COOKIE_NAME = "rekal_auth";

export async function POST(request: Request) {
  const { password } = (await request.json().catch(() => ({}))) as { password?: string };
  const appPassword = process.env.APP_PASSWORD;
  const token = process.env.AUTH_SECRET ?? appPassword;

  if (!appPassword || !token) {
    return NextResponse.json({ error: "APP_PASSWORD is not configured." }, { status: 500 });
  }

  if (password !== appPassword) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}
