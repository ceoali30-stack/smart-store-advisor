import { NextResponse } from "next/server";

export function middleware(request) {
  const url = request.nextUrl;

  const protectedPaths = ["/dashboard", "/charts"];

  const isProtected = protectedPaths.some((path) =>
    url.pathname.startsWith(path)
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  const merchantId = url.searchParams.get("merchant_id");

  if (!merchantId) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}
