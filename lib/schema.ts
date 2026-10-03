import { z } from "zod";
const short = z.string().trim().max(200);
const text = z.string().trim().max(12000);
const link = z
  .string()
  .max(2048)
  .refine(
    (v) =>
      !v || /^https:\/\//i.test(v) || /^\/api\/media\/[0-9a-f-]{36}$/i.test(v),
    "Use an HTTPS URL or an uploaded media URL",
  );
export const projectSchema = z.object({
  title: short.min(1),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .max(100),
  org: short,
  cover: link,
  description: text,
  stats: z.array(short).max(12),
  caseStudyUrl: link.optional(),
  category: short,
  role: short,
  featured: z.boolean(),
  blocks: z
    .array(
      z.object({
        heading: short.min(1),
        body: text,
        image: link.optional(),
        alt: short.optional(),
      }),
    )
    .max(30),
});
export const siteSchema = z.object({
  template: z.enum([
    "elegant", "classic", "architect", "visionary", "bold",
    "bento", "noir", "aurora", "glass", "memphis", "motion", "editorial", "template5"
  ]).default("template5"),
  colorMode: z.enum([
    "light", "dark", "vibrant", "pitch-black", "cream",
    "monochrome", "sunset", "ocean", "forest", "candy"
  ]).default("light"),
  hero: z.object({
    eyebrow: short,
    name: short.min(1),
    title: short,
    intro: text,
    photo: link,
    photoPosition: z
      .enum(["50% 20%", "50% 35%", "50% 50%", "50% 75%"])
      .default("50% 35%"),
    ctaLabel: short,
  }),
  about: z.object({
    heading: short,
    photo: link,
    photoPosition: z
      .enum(["50% 20%", "50% 35%", "50% 50%", "50% 75%"])
      .default("50% 35%"),
    paragraphs: z.array(text).max(12),
    stat: z.object({ value: short, label: short }),
  }),
  services: z.array(z.object({ title: short, description: text })).default([]),
  skills: z.array(short).default([]),
  organizations: z
    .array(z.object({ name: short.min(1), detail: short, url: link }))
    .max(20),
  expertise: z
    .array(
      z.object({
        title: short.min(1),
        description: text,
        skills: z.array(short).max(30),
      }),
    )
    .max(6),
  process: z.array(z.object({ title: short.min(1), description: text })).max(6),
  tools: z
    .array(z.object({ name: short.min(1), purpose: short, logo: link }))
    .max(30),
  projects: z
    .array(projectSchema)
    .max(30)
    .refine(
      (v) => new Set(v.map((p) => p.slug)).size === v.length,
      "Project slugs must be unique",
    )
    .refine(
      (v) => v.filter((p) => p.featured).length <= 1,
      "Choose only one featured project",
    ),
  testimonial: z.object({ quote: text, name: short, role: short }),
  testimonials: z.array(z.object({ quote: text, name: short, role: short })).optional(),
  contact: z.object({
    heading: short,
    subheading: text,
    email: z.string().email(),
    location: short,
    linkedin: link.optional(),
    github: link.optional(),
    instagram: link.optional(),
    facebook: link.optional(),
    twitter: link.optional(),
    cv: link.optional(),
    formEnabled: z.boolean(),
  }),
  sections: z.object({
    organizations: z.boolean(),
    about: z.boolean(),
    work: z.boolean(),
    expertise: z.boolean(),
    process: z.boolean(),
    tools: z.boolean(),
    testimonial: z.boolean(),
  }),
  seo: z.object({ title: short.min(1), description: z.string().max(500) }),
});
export type SiteContent = z.infer<typeof siteSchema>;
export type Project = z.infer<typeof projectSchema>;
