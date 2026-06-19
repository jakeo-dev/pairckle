import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const newUser = request.cookies.get("newUser")
    ? request.cookies.get("newUser")?.value
    : true;
  console.log("hi!");
  console.log(request.nextUrl.pathname);
  console.log(newUser);
  if (request.nextUrl.pathname === "/" && !newUser) {
    return NextResponse.redirect(new URL("/create", request.url));
  }
}
