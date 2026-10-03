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
  // Always use the local site.json (defaultContent) instead of the cached DB draft so the user sees the latest updates!
  const c = defaultContent;
  const index = c.projects.findIndex((p) => p.slug === slug);
  if (index < 0) notFound();
  return <CaseStudy content={c} index={index} preview />;
}
