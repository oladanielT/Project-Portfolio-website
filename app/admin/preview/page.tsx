import { redirect } from "next/navigation";
import { adminSession } from "@/lib/supabase/server";
import { defaultContent } from "@/lib/content";
import { siteSchema } from "@/lib/schema";
import TemplateRenderer from "@/components/TemplateRenderer";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Draft preview",
  robots: { index: false, follow: false },
};
export default async function Preview() {
  const session = await adminSession();
  if (!session) redirect("/admin");
  const { data, error } = await session.db
    .from("portfolio_drafts")
    .select("content")
    .eq("id", 1)
    .maybeSingle();
  if (error) throw new Error("Unable to load the saved portfolio draft.");
  const content = data?.content ? siteSchema.parse(data.content) : defaultContent;
  return (
    <div
      className={`draft-preview-theme theme-${content.colorMode || "light"}`}
      data-template={content.template || "architect"}
      data-theme={content.colorMode || "light"}
    >
      <TemplateRenderer content={content} preview />
    </div>
  );
}
