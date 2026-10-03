"use client";
import { useEffect, useId, useRef, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import type { SiteContent, Project } from "@/lib/schema";
import MotionScene from "./MotionScene";
import "./styles.css";

const Arrow = () => <span aria-hidden="true">↗</span>;

const PARTNERS = [
  { name: "Google", slug: "google" },
  { name: "Google Analytics", slug: "googleanalytics" },
  { name: "GitHub", slug: "github" },
  { name: "OpenAI", slug: "openai" },
  { name: "Jira", slug: "jira" },
  { name: "Trello", slug: "trello" },
  { name: "Monday", slug: "mondaydotcom" },
  { name: "Notion", slug: "notion" },
  { name: "Slack", slug: "slack" },
  { name: "Figma", slug: "figma" },
];

/* Works with ANY css colour format (hex, rgb, oklch, color(srgb …)) by
   letting a canvas convert it, then applies the WCAG contrast rule:
   light card → black icons, dark card → white icons. */
function pickTone(cssColor: string): "light" | "dark" {
  const cv = document.createElement("canvas");
  cv.width = cv.height = 1;
  const ctx = cv.getContext("2d", { willReadFrequently: true });
  if (!ctx) return "dark";
  ctx.fillStyle = "#000";
  ctx.fillStyle = cssColor;
  ctx.clearRect(0, 0, 1, 1);
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  const lin = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  const L = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  return L > 0.179 ? "light" : "dark"; // 0.179 = where white and black contrast are equal
}

type CurveType = "s-curve" | "hypotenuse" | "wave";

const CURVE_PATHS: Record<CurveType, string> = {
  "s-curve":
    "M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L0,320Z",
  hypotenuse: "M0,320L1440,0L1440,320Z",
  wave: "M0,96L80,112C160,128,320,160,480,160C640,160,800,128,960,112C1120,96,1280,96,1360,96L1440,96L1440,320L0,320Z",
};

const AnimatedCurve = ({ type, className = "" }: { type: CurveType; className?: string }) => {
  const id = useId().replace(/:/g, "");
  return (
    <div className={`bg-curve-layer wave-animation ${className}`} aria-hidden="true">
      <svg viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
        <defs>
          <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "var(--curve-color-1)", stopOpacity: 0.8 }} />
            <stop offset="100%" style={{ stopColor: "var(--curve-color-2)", stopOpacity: 0.3 }} />
          </linearGradient>
        </defs>
        <path fill={`url(#${id})`} d={CURVE_PATHS[type]} />
      </svg>
    </div>
  );
};

const SOCIAL_PATHS: Record<string, string> = {
  facebook: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z",
  twitter:
    "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z",
  instagram: "M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z M17.5 6.5h.01",
  linkedin: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z M2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z",
    github: "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22",
};

const SocialIcon = ({ type, url }: { type: string; url?: string }) => {
  if (!url) return null;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label={type}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d={SOCIAL_PATHS[type]} />
        {type === "instagram" && <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />}
      </svg>
    </a>
  );
};

export function ProjectCard({
  project,
  index,
  preview = false,
}: {
  project: Project;
  index: number;
  preview?: boolean;
}) {
  const href = `${preview ? "/admin/preview" : ""}/work/${project.slug}`;
  return (
    <article className="work-card" data-reveal>
      <Link className="work-image" href={href} aria-label={`Explore ${project.title}`}>
        {project.cover && (
          <Image
            src={project.cover}
            alt={`${project.title} project`}
            fill
            sizes="(min-width: 700px) 45vw, 100vw"
            unoptimized
            style={{ objectFit: "cover" }}
          />
        )}
      </Link>
      <div className="work-copy">
        <p className="eyebrow">{project.category}</p>
        <Link href={href}>
          <h3>{project.title}</h3>
        </Link>
        <p className="work-description">{project.description}</p>
        <Link className="button" href={href} style={{ width: "fit-content" }}>
          Read Case Study <Arrow />
        </Link>
      </div>
    </article>
  );
}

export default function Portfolio({
  content: c,
  contactReady = false,
  preview = false,
}: {
  content: SiteContent;
  contactReady?: boolean;
  preview?: boolean;
}) {
  const projects = [...c.projects];
  const prefix = preview ? "/admin/preview" : "";
  const marqueeRef = useRef<HTMLDivElement>(null);

  // remove the cast once `glow` is added to the hero schema
  const glow = (c.hero as { glow?: string }).glow ?? "emerald";

  const initials = c.hero.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const showAbout = c.sections.about !== false && !!c.about;
  const aboutPhoto = c.about?.photo || c.hero.photo;
  const aboutParagraphs = (c.about?.body ?? "").split(/\n{2,}/).filter(Boolean);

  /* Re-checks whenever the mode / admin colours change, not just on mount */
  useEffect(() => {
    const box = marqueeRef.current;
    if (!box) return;

    const update = () => {
      const card = box.querySelector<HTMLElement>(".partner-logo-card");
      if (!card) return;
      box.dataset.tone = pickTone(getComputedStyle(card).backgroundColor);
    };
    update();

    const mo = new MutationObserver(update);
    const opts = {
      attributes: true,
      attributeFilter: ["class", "style", "data-theme", "data-mode", "data-template"],
    };
    mo.observe(document.documentElement, opts);
    mo.observe(document.body, opts);
    const root = box.closest("[data-template]");
    if (root) mo.observe(root, opts);

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", update);

    return () => {
      mo.disconnect();
      mq.removeEventListener("change", update);
    };
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const body = `${f.get("message")}\n\nFrom: ${f.get("name")} (${f.get("email")})\nCompany: ${f.get("company") || "-"}`;
    window.location.href = `mailto:${c.contact.email}?subject=${encodeURIComponent(String(f.get("subject")))}&body=${encodeURIComponent(body)}`;
  };

  return (
    <MotionScene>
      <main id="top" data-glow={glow}>
        <nav className="site-nav">
          <Link href={`${prefix}#hero`} className="brand-logo">
            {c.hero.name}
          </Link>
          <div className="nav-center">
            <Link href={`${prefix}#hero`}>Home</Link>
            {showAbout && <Link href={`${prefix}#about`}>About</Link>}
            {c.sections.work && <Link href={`${prefix}#work`}>Work</Link>}
            {c.sections.expertise && <Link href={`${prefix}#expertise`}>Expertise</Link>}
            <Link href={`${prefix}#contact`}>Contact</Link>
          </div>
          <Link href={`${prefix}#contact`} className="button">
            Let&apos;s Talk
          </Link>
        </nav>

        {/* HERO */}
        <section className="editorial-hero" id="hero">
          <div className="hero-wash" aria-hidden="true">
            <div className="blob-bg" />
            <AnimatedCurve type="wave" />
          </div>

          <div className="hero-enter">
            {c.hero.photo ? (
              <Image
                src={c.hero.photo}
                alt={c.hero.name}
                width={250}
                height={250}
                className="hero-image"
                unoptimized
                priority
              />
            ) : (
              <div className="hero-image hero-initials" aria-hidden="true">
                {initials}
              </div>
            )}
          </div>
          <h1 className="hero-enter">{c.hero.name}</h1>
          <p className="hero-enter hero-intro">{c.hero.intro}</p>
          <div className="hero-enter hero-actions">
            <Link href={`${prefix}#work`} className="button">
              {c.hero.ctaLabel || "Explore Work"}
            </Link>
            <Link href={`${prefix}#contact`} className="button button-outline">
              Contact Us
            </Link>
          </div>
        </section>

        {/* PARTNERS MARQUEE */}
        <section id="partners" className="partners-section">
          <div className="marquee-container" ref={marqueeRef}>
            <div className="marquee-track">
              {[...PARTNERS, ...PARTNERS].map((tool, i) => (
                <div key={`${tool.slug}-${i}`} className="partner-logo-card" aria-hidden={i >= PARTNERS.length}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://cdn.simpleicons.org/${tool.slug}`}
                    alt={i < PARTNERS.length ? tool.name : ""}
                    className="partner-img"
                    loading="lazy"
                    onError={(e) => {
                      const card = e.currentTarget.parentElement;
                      if (card) card.style.display = "none";
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ABOUT */}
        {showAbout && c.about && (
          <section id="about" className="about-section section-space">
            <AnimatedCurve type="s-curve" />
            <div className="page-width about-grid">
              <div className="about-photo-wrap" data-reveal>
                {aboutPhoto ? (
                  <Image
                    src={aboutPhoto}
                    alt={`${c.hero.name} portrait`}
                    width={640}
                    height={800}
                    className="about-photo"
                    unoptimized
                  />
                ) : (
                  <div className="about-photo about-initials" aria-hidden="true">
                    {initials}
                  </div>
                )}
              </div>
              <div className="about-copy" data-reveal>
                <p className="eyebrow">About Me</p>
                <h2>{c.about.heading}</h2>
                {aboutParagraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
                {!!c.about.stats?.length && (
                  <div className="about-stats">
                    {c.about.stats.map((s) => (
                      <div key={s.label} className="about-stat">
                        <strong>{s.value}</strong>
                        <span>{s.label}</span>
                      </div>
                    ))}
                  </div>
                )}
                <Link href={`${prefix}#contact`} className="button" style={{ width: "fit-content" }}>
                  Work With Me <Arrow />
                </Link>
              </div>
            </div>
          </section>
        )}

        {c.sections.work && (
          <section id="work" className="projects-section section-space">
            <AnimatedCurve type="hypotenuse" />
            <div className="page-width">
              <div className="section-heading" data-reveal>
                <h2>Selected Work</h2>
                <p>A closer look at the products, the process, and the progress.</p>
              </div>
              <div className="work-grid">
                {projects.map((p, i) => (
                  <ProjectCard key={p.slug} project={p} index={i} preview={preview} />
                ))}
              </div>
            </div>
          </section>
        )}

        {c.sections.expertise && (
          <section id="expertise" className="expertise-section section-space">
            <AnimatedCurve type="wave" />
            <div className="page-width">
              <div className="section-heading" data-reveal>
                <h2>Expertise</h2>
                <p>I connect the thinking with the doing.</p>
              </div>
              <div className="expertise-grid">
                {c.expertise.map((e, i) => (
                  <article className="expertise-card" key={i} data-reveal>
                    <h3>{e.title}</h3>
                    <p>{e.description}</p>
                    <div className="skill-tags">
                      {e.skills.map((s) => (
                        <span key={s}>{s}</span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {c.sections.testimonial && c.testimonial && (
          <section id="testimonials" className="testimonials-section section-space">
            <AnimatedCurve type="s-curve" />
            <div className="section-heading" data-reveal>
              <h2>What Our Clients Say</h2>
            </div>
            <div className="testimonial-wrap" data-reveal>
              <div className="testimonial-inner">
                <p className="quote-mark" aria-hidden="true">“</p>
                <p className="quote-text">{c.testimonial.quote}</p>
                <div className="quote-author">
                  <h4>{c.testimonial.name}</h4>
                  <span>{c.testimonial.role}</span>
                </div>
              </div>
            </div>
          </section>
        )}

        <section id="contact" className="contact-section section-space">
          <AnimatedCurve type="wave" />
          <div className="page-width">
            <div className="contact-top" data-reveal>
              <h2>{c.contact.heading}</h2>
              <p>{c.contact.subheading}</p>
            </div>
            <form className="premium-form" onSubmit={handleSubmit} data-reveal>
              <div className="form-row">
                <input className="field" name="name" type="text" placeholder="Name" required autoComplete="name" />
                <input className="field" name="email" type="email" placeholder="Email" required autoComplete="email" />
              </div>
              <input className="field" name="company" type="text" placeholder="Company / Organization" autoComplete="organization" />
              <input className="field" name="subject" type="text" placeholder="Subject / Service" required />
              <textarea className="field" name="message" placeholder="Message" rows={5} required />
              <button type="submit" className="button">Send Message</button>
            </form>
          </div>
        </section>

        <footer className="site-footer">
          <div>
            <Link href={`${prefix}#hero`} className="brand-logo">
              {c.hero.name}
            </Link>
            <div className="footer-contact-info">
              <a href={`mailto:${c.contact.email}`}>{c.contact.email}</a>
              {c.contact.location && <span>{c.contact.location}</span>}
            </div>
          </div>
          <div className="footer-social-wrapper">
            <SocialIcon type="twitter" url={c.contact.twitter} />
            <SocialIcon type="facebook" url={c.contact.facebook} />
            <SocialIcon type="instagram" url={c.contact.instagram} />
            <SocialIcon type="linkedin" url={c.contact.linkedin} />
             {c.contact.github && <SocialIcon type="github" url={c.contact.github} />}
          </div>
          <span>© {new Date().getFullYear()} {c.hero.name}. All rights reserved.</span>
        </footer>
      </main>
    </MotionScene>
  );
}