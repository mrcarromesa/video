import { NextRequest, NextResponse } from "next/server";

const PUBLIC_FILE = /\.(.*)$/;

export async function middleware(req: NextRequest) {
  if (
    req.nextUrl.pathname.startsWith("/_next") ||
    req.nextUrl.pathname.includes("/api/") ||
    PUBLIC_FILE.test(req.nextUrl.pathname)
  ) {
    return;
  }
  console.log("aqui middleware", req.nextUrl.locale);

  if (req.nextUrl.locale === "en-US") {
    NextResponse.redirect(new URL(`/en${req.nextUrl.pathname}`, req.url));
  }
}
