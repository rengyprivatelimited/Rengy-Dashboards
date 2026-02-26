import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const response = NextResponse.redirect(new URL("/login", request.url));
  response.cookies.set("rengy_auth", "", { path: "/", maxAge: 0 });
  response.cookies.set("rengy_role", "", { path: "/", maxAge: 0 });
  response.cookies.set("rengy_name", "", { path: "/", maxAge: 0 });
  return response;
}
