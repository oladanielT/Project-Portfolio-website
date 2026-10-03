import { NextResponse } from "next/server";
import { adminSession } from "@/lib/supabase/server";
import { sameOrigin, failure } from "@/lib/api";
export const dynamic = "force-dynamic";
export async function GET() {
  const session = await adminSession();
  if (!session) return failure("Unauthorized", 401);
  const { data, error } = await session.db
    .from("portfolio_inquiries")
    .select("id,name,email,message,status,created_at")
    .order("created_at", { ascending: false })
    .limit(100);
  return error
    ? failure("Unable to load inquiries", 500)
    : NextResponse.json(data);
}
export async function POST(request: Request) {
  if (!sameOrigin(request)) return failure("Invalid request origin", 403);
  const session = await adminSession();
  if (!session) return failure("Unauthorized", 401);
  let body;
  try {
    body = await request.json();
  } catch {
    return failure("Invalid request");
  }
  if (
    !["new", "contacted", "archived"].includes(body.status) ||
    typeof body.id !== "string"
  )
    return failure("Invalid inquiry update");
  const { error } = await session.db
    .from("portfolio_inquiries")
    .update({ status: body.status })
    .eq("id", body.id);
  return error
    ? failure("Unable to update inquiry", 500)
    : NextResponse.json({ saved: true });
}
