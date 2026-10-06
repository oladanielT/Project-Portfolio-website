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

export const defaultFaqs = [
  {
    question: "How do you approach a new project?",
    answer: "I start by understanding the goals, people, and constraints, then shape a clear plan and work with the team to deliver it.",
  },
  {
    question: "What kind of projects do you take on?",
    answer: "I’m open to thoughtful projects where my experience can help a team solve a meaningful problem and create a useful result.",
  },
  {
    question: "How can we work together?",
    answer: "Use the contact form or email below to share a little about your project. I’ll get back to you to discuss the next steps.",
  },
];

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
  challenge: text.optional(),
  approach: text.optional(),
  result: text.optional(),
  blocks: z
    .array(
      z.object({
        heading: short.min(1),
        body: text,
        image: link.optional(),
        alt: short.optional(),
      }),
    )
    .default([]),
}).transform((p) => {
  const challengeFromBlocks = (p.blocks || []).find((b) => /challenge/i.test(b.heading))?.body;
  const approachFromBlocks = (p.blocks || []).find((b) => /approach/i.test(b.heading))?.body;
  const resultFromBlocks = (p.blocks || []).find((b) => /result/i.test(b.heading))?.body;

  const challenge = p.challenge || challengeFromBlocks || undefined;
  const approach = p.approach || approachFromBlocks || undefined;
  const result = p.result || resultFromBlocks || undefined;

  let blocks = [...(p.blocks || [])];
  if (challenge && !blocks.some((b) => /challenge/i.test(b.heading))) {
    blocks.unshift({ heading: "01 The challenge", body: challenge });
  }
  if (approach && !blocks.some((b) => /approach/i.test(b.heading))) {
    const cIdx = blocks.findIndex((b) => /challenge/i.test(b.heading));
    blocks.splice(cIdx >= 0 ? cIdx + 1 : 0, 0, { heading: "02 My approach", body: approach });
  }
  if (result && !blocks.some((b) => /result/i.test(b.heading))) {
    blocks.push({ heading: "03 The result", body: result });
  }

  return {
    ...p,
    challenge,
    approach,
    result,
    blocks,
  };
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
  faqs: z.array(z.object({ question: short.min(1), answer: text })).max(30).default([]),
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
    faqs: z.boolean().default(true),
  }),
  seo: z.object({ title: short.min(1), description: z.string().max(500) }),
}).transform((content) => {
  const testimonials = [...(content.testimonials || [])];
  const legacy = content.testimonial;
  if (content.testimonials === undefined && legacy.quote) {
    testimonials.push(legacy);
  } else if (
    legacy.quote &&
    !testimonials.some(
      (item) => item.name === legacy.name || item.quote === legacy.quote,
    )
  ) {
    testimonials.push(legacy);
  }
  return {
    ...content,
    testimonial: testimonials[0] || { quote: "", name: "", role: "" },
    testimonials,
  };
});

export type SiteContent = z.infer<typeof siteSchema>;
export type Project = z.infer<typeof projectSchema>;

export function projectStorySections(project: Project) {
  const named = [
    { heading: "The challenge", value: project.challenge, pattern: /challenge/i },
    { heading: "My approach", value: project.approach, pattern: /approach/i },
    { heading: "The result", value: project.result, pattern: /result/i },
  ];
  const story = named.flatMap(({ heading, value, pattern }) => {
    const legacy = (project.blocks || []).find((block) => pattern.test(block.heading));
    const body = value || legacy?.body;
    return body ? [{ ...(legacy || {}), heading, body }] : [];
  });
  const additional = (project.blocks || []).filter(
    (block) => !named.some(({ pattern }) => pattern.test(block.heading)),
  );
  return [...story, ...additional];
}
