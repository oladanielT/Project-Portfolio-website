import { redirect, notFound } from "next/navigation";
import { adminSession } from "@/lib/supabase/server";
import { defaultContent } from "@/lib/content";
import { siteSchema } from "@/lib/schema";
import CaseStudy from "@/components/CaseStudy";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Draft case study",
  robots: { index: false, follow: false },
};

export default async function Preview({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const session = await adminSession();
  if (!session) redirect("/admin");
  const { slug } = await params;
  const { data, error } = await session.db
    .from("portfolio_drafts")
    .select("content")
    .eq("id", 1)
    .maybeSingle();
  if (error) throw new Error("Unable to load the saved portfolio draft.");
  const c = data?.content ? siteSchema.parse(data.content) : defaultContent;

  c.projects = c.projects.map((p) => {
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

  const index = c.projects.findIndex((p) => p.slug === slug);
  if (index < 0) notFound();
  return (
    <div
      className={`draft-preview-theme theme-${c.colorMode || "light"}`}
      data-template={c.template || "architect"}
      data-theme={c.colorMode || "light"}
    >
      <CaseStudy content={c} index={index} preview />
    </div>
  );
}
