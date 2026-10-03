import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import seed from "@/content/site.json";
import { siteSchema } from "./schema";
import { configured, supabaseKey, supabaseUrl } from "./supabase/config";
export type { SiteContent, Project } from "./schema";
export const defaultContent = siteSchema.parse(seed);
console.log("FORM ENABLED STATUS:", defaultContent.contact.formEnabled);
const readPublished = unstable_cache(
  async () => {
    const db = createClient(supabaseUrl(), supabaseKey(), {
      auth: { persistSession: false },
      
    });
    const { data, error } = await db
      .from("portfolio_publications")
      .select("content")
      .eq("id", 1)
      .maybeSingle();
    if (error) {
      console.warn("Unable to read published portfolio from Supabase. Falling back to default content.", error);
      return defaultContent;
    }
    return data ? siteSchema.parse(data.content) : defaultContent;
  },
  ["portfolio-publication"],
  { tags: ["portfolio"], revalidate: 300 },
);
export const getContent = cache(async () =>
  defaultContent,
);
