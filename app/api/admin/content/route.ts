import { NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { adminSession } from "@/lib/supabase/server";
import { defaultContent } from "@/lib/content";
import { defaultFaqs, siteSchema } from "@/lib/schema";
import { sameOrigin, failure } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await adminSession();
  if (!session)
    return failure("Sign in with an authorized administrator account.", 401);
  const { db } = session;
  const [draft, revisions, publication] = await Promise.all([
    db
      .from("portfolio_drafts")
      .select("content,version,updated_at")
      .eq("id", 1)
      .maybeSingle(),
    db
      .from("portfolio_revisions")
      .select("id,created_at")
      .order("id", { ascending: false })
      .limit(30),
    db
      .from("portfolio_publications")
      .select("updated_at")
      .eq("id", 1)
      .maybeSingle(),
  ]);
  if (draft.error || revisions.error || publication.error)
    return failure(
      "Unable to load content. Check that the database migration has been applied.",
      503,
    );
  const content = draft.data?.content
    ? siteSchema.parse(draft.data.content)
    : defaultContent;

  if (content.faqs.length === 0) content.faqs = defaultFaqs;

  // Self-healing: if draft lost project stories/challenges, restore from defaultContent
  content.projects = content.projects.map((p) => {
    const seedProject = defaultContent.projects.find((sp) => sp.slug === p.slug);
    if (seedProject) {
      const hasStory = Boolean(p.challenge || p.approach || p.result || (p.blocks && p.blocks.length > 0));
      if (!hasStory) {
        return {
          ...p,
          challenge: seedProject.challenge,
          approach: seedProject.approach,
          result: seedProject.result,
          blocks: seedProject.blocks,
        };
      }
    }
    return p;
  });

  return NextResponse.json(
    {
      content,
      version: draft.data?.version || 0,
      savedAt: draft.data?.updated_at,
      publishedAt: publication.data?.updated_at,
      revisions: revisions.data,
    },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return failure("Invalid request origin", 403);
  const session = await adminSession();
  if (!session) return failure("Unauthorized", 401);
  let body;
  try {
    const raw = await request.text();
    if (raw.length > 500000) return failure("Content is too large", 413);
    body = JSON.parse(raw);
  } catch {
    return failure("Invalid request");
  }
  const { db } = session;
  if (!Number.isInteger(body.version) || body.version < 0)
    return failure("Invalid content version");
  if (body.action === "save" || body.action === "restore") {
    let content = body.content;
    if (body.action === "restore") {
      if (!Number.isSafeInteger(body.id) || body.id < 1)
        return failure("Invalid revision");
      const revision = await db
        .from("portfolio_revisions")
        .select("content")
        .eq("id", body.id)
        .single();
      if (revision.error) return failure("Revision not found", 404);
      content = revision.data.content;
    }
    const parsed = siteSchema.safeParse(content);
    if (!parsed.success)
      return failure(
        parsed.error.issues
          .map((i) => `${i.path.join(".")}: ${i.message}`)
          .slice(0, 5)
          .join("; "),
      );
    const { data, error } = await db.rpc("portfolio_save_draft", {
      payload: parsed.data,
      expected_version: body.version,
    });
    if (error)
      return failure(
        error.code === "40001" ? error.message : "Unable to save draft",
        error.code === "40001" ? 409 : 500,
      );
    return NextResponse.json({ version: data, content: parsed.data });
  }
  if (body.action === "publish") {
    const draft = await db
      .from("portfolio_drafts")
      .select("content")
      .eq("id", 1)
      .single();
    if (draft.error || !siteSchema.safeParse(draft.data?.content).success)
      return failure("Save a valid draft before publishing");
    if (
      !process.env.SUPABASE_SERVICE_ROLE_KEY &&
      JSON.stringify(draft.data.content).includes("/api/media/")
    )
      return failure(
        "Configure the server-only service key before publishing uploaded media.",
      );
    const { error } = await db.rpc("portfolio_publish", {
      expected_version: body.version,
    });
    if (error)
      return failure(
        error.code === "40001" ? error.message : "Unable to publish",
        error.code === "40001" ? 409 : 500,
      );
    revalidateTag("portfolio");
    revalidatePath("/", "layout");
    return NextResponse.json({ published: true });
  }
  return failure("Unknown action");
}
