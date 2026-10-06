import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import seed from "@/content/site.json";
import { siteSchema } from "./schema";
import { configured, supabaseKey, supabaseUrl } from "./supabase/config";
export type { SiteContent, Project } from "./schema";

export const defaultContent = siteSchema.parse(seed);

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
    if (error || !data?.content) {
      if (error) {
        console.warn("Unable to read published portfolio from Supabase. Falling back to default content.", error);
      }
      return defaultContent;
    }

    const parsed = siteSchema.parse(data.content);
    
    // Self-healing: if projects from publication lack story blocks or challenge/approach/result, restore from seed
    parsed.projects = parsed.projects.map((p) => {
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

    return parsed;
  },
  ["portfolio-publication"],
  { tags: ["portfolio"], revalidate: 300 },
);

export const getContent = cache(async () => readPublished());
