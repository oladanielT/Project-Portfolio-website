import { createClient } from "@supabase/supabase-js";
import { createHmac } from "crypto";
import { z } from "zod";
import { NextResponse } from "next/server";
import { sameOrigin, failure } from "@/lib/api";
import { configured, supabaseUrl } from "@/lib/supabase/config";
import { getContent } from "@/lib/content";
const schema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  message: z.string().trim().min(10).max(5000),
  website: z.string().max(200).optional(),
});
export async function POST(request: Request) {
  if (!sameOrigin(request)) return failure("Invalid request origin", 403);
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!configured() || !secret)
    return failure("Please use the email link to get in touch.", 503);
  if (!(await getContent()).contact.formEnabled)
    return failure("Please use the email link to get in touch.", 503);
  let body;
  try {
    const raw = await request.text();
    if (raw.length > 8000) return failure("Message is too long", 413);
    body = JSON.parse(raw);
  } catch {
    return failure("Invalid message");
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success)
    return failure(
      "Please provide your name, a valid email, and a message of 10–5,000 characters.",
    );
  if (parsed.data.website) return NextResponse.json({ received: true });
  // Vercel overwrites x-vercel-forwarded-for; other hosts must provide a trusted proxy header.
  const ip =
    (process.env.VERCEL
      ? request.headers.get("x-vercel-forwarded-for")
      : request.headers.get("x-real-ip")) || "shared-origin";
  const visitorKey = createHmac("sha256", secret).update(ip).digest("hex");
  const db = createClient(supabaseUrl(), secret, {
    auth: { persistSession: false },
  });
  const { error } = await db.rpc("portfolio_submit_inquiry", {
    visitor_key: visitorKey,
    visitor_name: parsed.data.name,
    visitor_email: parsed.data.email,
    visitor_message: parsed.data.message,
  });
  if (error)
    return failure(
      error.code === "P0001"
        ? "Too many messages. Please try again later or use the email link."
        : "Unable to save your message. Please use the email link.",
      error.code === "P0001" ? 429 : 500,
    );
  return NextResponse.json({ received: true });
}
