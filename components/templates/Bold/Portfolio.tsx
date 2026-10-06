"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import type { SiteContent, Project } from "@/lib/schema";
import MotionScene from "./MotionScene";
import "./styles.css";

const Arrow = () => <span aria-hidden="true">→</span>;

const PARTNERS = [
  { name: "Google", slug: "google", color: "4285F4", mark: "G" },
  { name: "Google Analytics", slug: "googleanalytics", color: "E37400", mark: "GA" },
  { name: "GitHub", slug: "github", color: "181717", mark: "GH" },
  { name: "OpenAI", slug: "openai", color: "412991", mark: "AI", localMark: true },
  { name: "Jira", slug: "jira", color: "0052CC", mark: "J" },
  { name: "Trello", slug: "trello", color: "0052CC", mark: "T" },
  { name: "Monday.com", slug: "mondaydotcom", color: "FF3D57", mark: "m", localMark: true },
  { name: "Notion", slug: "notion", color: "000000", mark: "N" },
  { name: "Slack", slug: "slack", color: "4A154B", mark: "S", localMark: true },
  { name: "Figma", slug: "figma", color: "F24E1E", mark: "F" },
];

const SOCIAL_PATHS: Record<string, string> = {
  facebook: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z",
  twitter: "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z",
  instagram: "M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z M17.5 6.5h.01",
  linkedin: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z M2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z",
  github: "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22",
};
const SocialIcon = ({ type, url }: { type: string; url?: string }) => {
  if (!url) return null;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label={type}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d={SOCIAL_PATHS[type]} />
        {type === "instagram" && <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />}
      </svg>
    </a>
  );
};

export function ProjectCard({ project, index, preview = false }: { project: Project; index: number; preview?: boolean }) {
  const href = `${preview ? "/admin/preview" : ""}/work/${project.slug}`;
  return (
    <article className="work-card" data-reveal>
      <Link href={href} aria-label={`Explore ${project.title}`}>
        <div className="work-image">
          {project.cover && (
            <Image src={project.cover} alt={`${project.title} project`} fill sizes="(min-width: 1000px) 25vw, (min-width: 600px) 45vw, 100vw" unoptimized style={{ objectFit: "cover" }} />
          )}
        </div>
        <div className="work-copy">
          <div>
            <h3>{project.title}</h3>
            <p className="work-description">{project.category}</p>
          </div>
          <span className="round-arrow" aria-hidden="true">↗</span>
        </div>
      </Link>
    </article>
  );
}

const Eyebrow = ({ children }: { children: React.ReactNode }) => <p className="eyebrow">{children}</p>;

export default function Portfolio({
  content: c, contactReady = false, preview = false,
}: { content: SiteContent; contactReady?: boolean; preview?: boolean }) {
  const projects = [...c.projects];
  const prefix = preview ? "/admin/preview" : "";
  const railRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => en.isIntersecting && setActive(en.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ["hero", "about", "work", "expertise", "testimonials", "contact"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => { window.removeEventListener("scroll", onScroll); io.disconnect(); };
  }, []);

  const first = c.hero.name.split(" ")[0];
  const initials = c.hero.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  const showAbout = c.sections.about !== false && !!c.about;
  const aboutPhoto = c.about?.photo || c.hero.photo;
  const aboutParagraphs =
    c.about?.paragraphs && c.about.paragraphs.length > 0
      ? c.about.paragraphs
      : (((c.about as any)?.body ?? "") as string).split(/\n{2,}/).filter(Boolean);
  const stat = (c.about as any)?.stat?.value ? (c.about as any).stat : (c.about as any)?.stats?.[0];
  const skills: string[] = (c.skills?.length ? c.skills : c.expertise.flatMap((e) => e.skills)).slice(0, 8);

  const links = [
    ["#hero", "Home", true], ["#about", "About", showAbout], ["#work", "Work", c.sections.work],
    ["#expertise", "Services", c.sections.expertise], ["#testimonials", "Reviews", c.sections.testimonial && c.testimonials.length > 0],
    ["#contact", "Contact", true],
  ].filter((l) => l[2]) as [string, string, boolean][];

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const body = `${f.get("message")}\n\nFrom: ${f.get("name")} (${f.get("email")})\nCompany: ${f.get("company") || "-"}`;
    window.location.href = `mailto:${c.contact.email}?subject=${encodeURIComponent(String(f.get("subject")))}&body=${encodeURIComponent(body)}`;
  };

  const socials = (
    <>
      <SocialIcon type="github" url={c.contact.github} />
      <SocialIcon type="linkedin" url={c.contact.linkedin} />
      <SocialIcon type="twitter" url={c.contact.twitter} />
      <SocialIcon type="instagram" url={c.contact.instagram} />
      <SocialIcon type="facebook" url={c.contact.facebook} />
    </>
  );

  return (
    <MotionScene>
      <main id="top">
        <nav className={`site-nav ${scrolled ? "is-scrolled" : ""}`}>
          <Link href={`${prefix}#hero`} className="brand-logo" aria-label={`${c.hero.name} home`}>
            <span className="brand-full">{c.hero.name}<i className="brand-dot" aria-hidden="true" /></span>
            <small className="brand-title">{c.hero.title}</small>
            <span className="brand-monogram" aria-hidden="true">{initials[0]}</span>
          </Link>
          <div className="nav-center">
            {links.map(([h, l]) => (
              <Link key={h} href={`${prefix}${h}`} className={active === h.slice(1) ? "is-active" : ""}>{l}</Link>
            ))}
          </div>
          <Link href={`${prefix}#contact`} className="button nav-cta">
            <span className="nav-cta-full">Let&apos;s Work Together</span>
            <span className="nav-cta-compact">Let&apos;s Talk</span>
            <Arrow />
          </Link>
        </nav>

        {/* HERO */}
        <section className="editorial-hero max-w-8xl mx-auto" id="hero">
          <div className="hero-wash" aria-hidden="true"><div className="blob-bg" /></div>
          <div className="page-width hero-grid max-w-8xl mx-auto">
            <div className="hero-copy">
              <p className="hero-enter hero-chip">{c.hero.eyebrow || `Hello, I'm ${first}`} <span aria-hidden="true">👋</span></p>
              <h1 className="hero-enter">{c.hero.name}{c.hero.title && <em>{c.hero.title}</em>}</h1>
              <p className="hero-enter hero-intro">{c.hero.intro}</p>
              <div className="hero-enter hero-actions">
                {c.sections.work && <Link href={`${prefix}#work`} className="button">{c.hero.ctaLabel || "View My Work"} <Arrow /></Link>}
                {c.contact.cv
                  ? <a href={c.contact.cv} target="_blank" rel="noreferrer" className="button button-outline">Download CV ↓</a>
                  : <Link href={`${prefix}#contact`} className="button button-outline">Contact Me</Link>}
              </div>
            </div>
            <div className="hero-enter hero-portrait">
              {c.hero.photo ? (
                <Image src={c.hero.photo} alt={c.hero.name} width={640} height={760} className="hero-image" unoptimized priority style={{ objectPosition: (c.hero as any).photoPosition }} />
              ) : (
                <div className="hero-image hero-initials" aria-hidden="true">{initials}</div>
              )}
              <svg className="hero-badge" viewBox="0 0 120 120" aria-hidden="true">
                <defs><path id="badge-circle" d="M60,60 m-48,0 a48,48 0 1,1 96,0 a48,48 0 1,1 -96,0" /></defs>
                <text><textPath href="#badge-circle">AVAILABLE FOR FREELANCE • AVAILABLE FOR FREELANCE •</textPath></text>
              </svg>
              <span className="hero-badge-letter" aria-hidden="true">{initials[0]}</span>
            </div>
            <div className="hero-side" aria-label="Social links">
              <span>Scroll down</span>
              {socials}
            </div>
          </div>
        </section>

        {/* PARTNERS */}
        <section id="partners" className="partners-section">
          <div className="marquee-container">
            <div className="marquee-track">
              {[...PARTNERS, ...PARTNERS].map((tool, i) => (
                <div key={`${tool.slug}-${i}`} className="partner-logo-card" aria-hidden={i >= PARTNERS.length}>
                  <span className="partner-icon-box" aria-hidden="true">
                    {tool.localMark ? (
                      <span className="partner-fallback" style={{ color: `#${tool.color}` }}>{tool.mark}</span>
                    ) : (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={`https://cdn.simpleicons.org/${tool.slug}/${tool.color}`} alt="" className="partner-img" loading="lazy"
                          onError={(e) => { e.currentTarget.hidden = true; e.currentTarget.nextElementSibling?.removeAttribute("hidden"); }} />
                        <span className="partner-fallback" style={{ color: `#${tool.color}` }} hidden>{tool.mark}</span>
                      </>
                    )}
                  </span>
                  <span className="partner-name">{tool.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WORK */}
        {c.sections.work && (
          <section id="work" className="section-space">
            <div className="page-width">
              <div className="section-heading" data-reveal>
                <div><Eyebrow>Selected work</Eyebrow><h2>Crafted with purpose.</h2></div>
                <Link href={`${prefix}#contact`} className="text-link">Start a project <Arrow /></Link>
              </div>
              <div className="work-grid">
                {projects.map((p, i) => <ProjectCard key={p.slug} project={p} index={i} preview={preview} />)}
              </div>
            </div>
          </section>
        )}

        {/* SERVICES */}
        {c.sections.expertise && (
          <section id="expertise" className="section-space">
            <div className="page-width split">
              <div data-reveal>
                <Eyebrow>What I do</Eyebrow>
                <h2>Design. Develop. <br />Deliver.</h2>
              </div>
              <div className="expertise-grid">
                {c.expertise.map((e, i) => (
                  <article className="expertise-card" key={i} data-reveal>
                    <span className="icon-ring" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                    <h3>{e.title}</h3>
                    <p>{e.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ABOUT */}
        {showAbout && c.about && (
          <section id="about" className="section-space">
            <div className="page-width about-grid">
              <div className="about-copy" data-reveal>
                <Eyebrow>About me</Eyebrow>
                <h2>{c.about.heading}</h2>
                {aboutParagraphs.map((p, i) => <p key={i}>{p}</p>)}
                <Link href={`${prefix}#contact`} className="button button-outline" style={{ width: "fit-content" }}>Work With Me <Arrow /></Link>
              </div>
              <div className="about-photo-wrap" data-reveal>
                {aboutPhoto ? (
                  <Image src={aboutPhoto} alt={`${c.hero.name} portrait`} width={640} height={800} className="about-photo" unoptimized />
                ) : (
                  <div className="about-photo about-initials" aria-hidden="true">{initials}</div>
                )}
                {stat?.value && <div className="about-badge"><strong>{stat.value}</strong><span>{stat.label}</span></div>}
              </div>
              {skills.length > 0 && (
                <div className="skill-list" data-reveal>
                  <Eyebrow>My skills</Eyebrow>
                  {skills.map((s) => <div key={s} className="skill-row"><span>{s}</span><i aria-hidden="true" /></div>)}
                </div>
              )}
            </div>
          </section>
        )}

        {/* TESTIMONIALS */}
        {c.sections.testimonial && c.testimonials.length > 0 && (
          <section id="testimonials" className="section-space">
            <div className="page-width split">
              <div data-reveal>
                <Eyebrow>Testimonials</Eyebrow>
                <h2>What clients say about my <em>work.</em></h2>
                <div className="rail-arrows">
                  <button type="button" aria-label="Previous" onClick={() => railRef.current?.scrollBy({ left: -340, behavior: "smooth" })}>←</button>
                  <button type="button" aria-label="Next" onClick={() => railRef.current?.scrollBy({ left: 340, behavior: "smooth" })}>→</button>
                </div>
              </div>
              <div className="testimonial-wrap" ref={railRef} data-reveal>
                {c.testimonials.map((t, i) => (
                  <div className="testimonial-inner" key={i}>
                    <p className="quote-mark" aria-hidden="true">“</p>
                    <p className="quote-text">{t.quote}</p>
                    <div className="quote-author">
                      <span className="avatar" aria-hidden="true">{t.name[0]}</span>
                      <div><h4>{t.name}</h4><span>{t.role}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CONTACT */}
        <section id="contact" className="contact-section section-space">
          <div className="page-width split">
            <div className="contact-top" data-reveal>
              <Eyebrow>Let&apos;s work together</Eyebrow>
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
              <button type="submit" className="button">Send Message <Arrow /></button>
            </form>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="site-footer p-4 flex flex-col ">
          <div className="page-width footer-grid">
            <div>
              <Eyebrow>Let&apos;s work together</Eyebrow>
              <h3>Have a project in mind?</h3>
              <p>I&apos;m always open to discussing new projects and ideas.</p>
              <Link href={`${prefix}#contact`} className="button">Get in Touch <Arrow /></Link>
            </div>
            <div>
              <Eyebrow>Navigation</Eyebrow>
              {links.map(([h, l]) => <Link key={h} href={`${prefix}${h}`}>{l}</Link>)}
            </div>
            {c.expertise.length > 0 && (
              <div>
                <Eyebrow>Services</Eyebrow>
                {c.expertise.slice(0, 5).map((e, i) => <span key={i}>{e.title}</span>)}
              </div>
            )}
            <div>
              <Eyebrow>Contact</Eyebrow>
              <a href={`mailto:${c.contact.email}`}>{c.contact.email}</a>
              {c.contact.location && <span>{c.contact.location}</span>}
              <div className="footer-social-wrapper">{socials}</div>
            </div>
          </div>
          <div className="page-width footer-bottom">
            <span>© {new Date().getFullYear()} {c.hero.name}. All rights reserved.</span>
          </div>
        </footer>
      </main>
    </MotionScene>
  );
}
