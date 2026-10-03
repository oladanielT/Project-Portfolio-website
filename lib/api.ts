import { NextResponse } from "next/server";
export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const expected = process.env.SITE_URL
    ? new URL(process.env.SITE_URL).origin
    : new URL(request.url).origin;
  return origin === expected || origin === new URL(request.url).origin;
}
export const failure = (message: string, status = 400) =>
  NextResponse.json({ error: message }, { status });
