import type { MetadataRoute } from "next";
import { getContent } from "@/lib/content";
import { getSiteUrl } from "@/lib/site-url";

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const content = await getContent();
  const siteUrl = getSiteUrl();

  return [
    {
      url: new URL("/", siteUrl).toString(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...(content.sections.work
      ? content.projects.map((project) => ({
          url: new URL(`/work/${encodeURIComponent(project.slug)}`, siteUrl).toString(),
          changeFrequency: "monthly" as const,
          priority: 0.7,
        }))
      : []),
  ];
}
