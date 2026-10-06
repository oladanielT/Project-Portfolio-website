import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { configured, supabaseKey, supabaseUrl } from "@/lib/supabase/config";
const ADMIN_GATE_COOKIE = "portfolio_admin_gate";

export async function middleware(request: NextRequest) {
  const secretKey = process.env.ADMIN_SECRET_KEY;

  if (secretKey) {
    const url = request.nextUrl;
    const keyParam = url.searchParams.get("key") || url.searchParams.get("secret");
    const gateCookie = request.cookies.get(ADMIN_GATE_COOKIE)?.value;

    // Support locking the gate: ?lock=1 removes the gate cookie
    if (url.searchParams.get("lock") === "1") {
      const cleanUrl = new URL(url.pathname, request.url);
      const response = NextResponse.redirect(cleanUrl);
      response.cookies.delete(ADMIN_GATE_COOKIE);
      return response;
    }

    // 1. If matching secret is provided in the query string (?key=... or ?secret=...)
    if (keyParam === secretKey) {
      const cleanUrl = new URL(url.pathname, request.url);
      url.searchParams.forEach((val, key) => {
        if (key !== "key" && key !== "secret") cleanUrl.searchParams.set(key, val);
      });
      const response = NextResponse.redirect(cleanUrl);
      response.cookies.set(ADMIN_GATE_COOKIE, secretKey, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
      return response;
    }

    // 2. If no valid cookie exists, return 404 (cloaking admin from bots & public)
    if (gateCookie !== secretKey) {
      if (url.pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      return NextResponse.rewrite(new URL("/not-found", request.url), {
        status: 404,
      });
    }
  }

  let response = NextResponse.next({ request });
  if (configured()) {
    const db = createServerClient(supabaseUrl(), supabaseKey(), {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (values) => {
          values.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          values.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    });
    try {
      await db.auth.getUser();
    } catch {
      /* Ignore expired token or refresh failures in middleware */
    }
  }
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };
