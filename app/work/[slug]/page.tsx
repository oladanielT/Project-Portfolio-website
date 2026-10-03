import { notFound } from "next/navigation";
import { getContent } from "@/lib/content";
import CaseStudy from "@/components/CaseStudy";
import type { Metadata } from "next";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = await getContent();
  const p = c.projects.find((p) => p.slug === slug);
  return {
    title: p ? `${p.title} — ${c.hero.name}` : "Project not found",
    description: p?.description,
  };
}
export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const c = await getContent();
  const index = c.projects.findIndex((p) => p.slug === slug);
  if (index < 0) notFound();
  return <CaseStudy content={c} index={index} />;
}
