import { notFound } from "next/navigation";
import { getContent } from "@/lib/content";
import CaseStudy from "@/components/CaseStudy";
import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site-url";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = await getContent();
  const p = c.projects.find((p) => p.slug === slug);
  const title = p ? `${p.title} - ${c.hero.name}` : "Project not found";
  const image = p?.cover || c.hero.photo || undefined;
  return {
    metadataBase: getSiteUrl(),
    alternates: { canonical: `/work/${slug}` },
    title: p ? `${p.title} — ${c.hero.name}` : "Project not found",
    description: p?.description,
    openGraph: {
      title,
      description: p?.description,
      type: "article",
      siteName: c.hero.name,
      url: `/work/${slug}`,
      images: image ? [{ url: image, alt: p?.title || c.hero.name }] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description: p?.description,
      images: image ? [image] : undefined,
    },
  };
}
export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const c = await getContent();
  const index = c.projects.findIndex((p) => p.slug === slug);
  if (index < 0) notFound();
  return <CaseStudy content={c} index={index} />;
}
