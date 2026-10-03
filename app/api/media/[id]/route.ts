import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { configured, supabaseUrl, supabaseKey } from "@/lib/supabase/config";
import { adminSession } from "@/lib/supabase/server";
import { failure } from "@/lib/api";
export const dynamic = "force-dynamic";
export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!configured() || !/^[0-9a-f-]{36}$/i.test(id))
    return failure("Not found", 404);
  const anon = createClient(supabaseUrl(), supabaseKey(), {
    auth: { persistSession: false },
  });
  const { data: publishedPath } = await anon.rpc("portfolio_published_media", {
    media_id: id,
  });
  if (publishedPath && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const service = createClient(
      supabaseUrl(),
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { persistSession: false } },
    );
    const { data } = await service.storage
      .from("portfolio-media")
      .createSignedUrl(publishedPath, 60);
    if (data)
      return NextResponse.redirect(data.signedUrl, {
        headers: { "Cache-Control": "private, no-store" },
      });
  }
  const session = await adminSession();
  if (!session) return failure("Not found", 404);
  const { data: media } = await session.db
    .from("portfolio_media")
    .select("path")
    .eq("id", id)
    .single();
  if (!media) return failure("Not found", 404);
  const { data } = await session.db.storage
    .from("portfolio-media")
    .createSignedUrl(media.path, 60);
  return data
    ? NextResponse.redirect(data.signedUrl, {
        headers: { "Cache-Control": "private, no-store" },
      })
    : failure("Not found", 404);
}
