import { getContent } from "@/lib/content";
import TemplateRenderer from "@/components/TemplateRenderer";
export default async function Home() {
  return (
    <TemplateRenderer
      content={await getContent()}
      contactReady={Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)}
    />
  );
}
