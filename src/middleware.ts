import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookie = request.cookies.get("crossmint-session")?.value;
  console.log(cookie, "cookie");
  console.log(pathname, "pathname");

  if (pathname.startsWith("/dashboard") && cookie == null) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (pathname === "/" && cookie) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*"],
};
