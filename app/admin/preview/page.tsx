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
  // Always use the local site.json (defaultContent) instead of the cached DB draft so the user sees the latest updates!
  return (
    <TemplateRenderer
      content={defaultContent}
      preview
    />
  );
}
