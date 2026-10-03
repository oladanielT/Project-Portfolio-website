"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { SiteContent } from "@/lib/schema";
import MotionScene from "./MotionScene";
import "./styles.css";

/**
 * Optional sections (services, education, experience, testimonials, faqs)
 * render only when that data exists on the content object, so nothing breaks
 * if your schema doesn't have them yet.
 */
type Loose = Record<string, any>;

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M7 17 17 7M8 7h9v9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Star({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 1.5l2.2 7.3 7.3 2.2-7.3 2.2L12 20.5l-2.2-7.3L2.5 11l7.3-2.2z" />
    </svg>
  );
}

function Marquee({ items }: { items: string[] }) {
  const base = items.length >= 5 ? items : [...items, ...items, ...items];
  const group = (key: string) => (
    <div className="nx-marquee-group" key={key} aria-hidden={key === "b"}>
      {base.map((t, i) => (
        <span className="nx-marquee-item" key={`${key}${i}`}>
          {t}
          <Star />
        </span>
      ))}
    </div>
  );
  return (
    <div className="nx-marquee">
      <div className="nx-marquee-track">
        {group("a")}
        {group("b")}
      </div>
    </div>
  );
}

const norm = (i: Loose) => ({
  title: i.title || i.company || i.institution || i.school || i.name,
  sub: i.subtitle || i.role || i.degree || i.field || i.description,
  when: i.period || i.years || i.date || i.duration,
});

const SocialIcon = ({ type, url }: { type: string, url?: string }) => {
  const paths = {
    facebook: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z",
    twitter: "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z",
    instagram: "M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z M6.5 6.5h.01 M21 12v-2a9 9 0 00-9-9 9 9 0 00-9 9v2a9 9 0 009 9 9 9 0 009-9z",
    linkedin: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z M2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z",
    github: "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22",
  };
  return (
    <a href={url || '#'} target="_blank" rel="noopener noreferrer" aria-label={type} style={{ opacity: 0.8, transition: 'opacity 0.2s', color: 'inherit' }} onMouseOver={(e) => e.currentTarget.style.opacity='1'} onMouseOut={(e) => e.currentTarget.style.opacity='0.8'}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d={paths[type as keyof typeof paths]} />
        {type === 'instagram' && <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />}
      </svg>
    </a>
  );
};

export default function Portfolio({
  content: c,
  preview = false,
}: {
  content: SiteContent;
  contactReady: boolean;
  preview?: boolean;
}) {
  const x = c as unknown as Loose;
  const hero = c.hero as unknown as Loose;
  const about = (c.about ?? {}) as Loose;

  const projects = c.sections.work ? c.projects || [] : [];
  const tools = c.sections.tools ? c.tools || [] : [];
  const paragraphs: string[] = about.paragraphs || [];

  let heroImg: string | undefined =
    hero.image || hero.photo || hero.portrait || hero.avatar || about.image || about.photo;

  if (heroImg && heroImg.includes("res.cloudinary.com")) {
    heroImg = heroImg.replace("/upload/", "/upload/e_background_removal/f_png/");
    heroImg = heroImg.replace(/\.(jpg|jpeg)$/i, ".png");
  }

  const aboutImg: string | undefined = about.image || about.photo || heroImg;
  const tagline: string | undefined = hero.tagline || hero.subtitle || hero.description || paragraphs[0];
  const cvUrl: string | undefined = about.cvUrl || hero.cvUrl || x.cvUrl;

  const services: Loose[] = x.sections?.services === false ? [] : x.services || [];
  const education: Loose[] = x.education || [];
  const experience: Loose[] = x.experience || [];
  const testimonials: Loose[] = x.testimonials || [];
  const faqs: Loose[] = x.faqs || x.faq || [];

  const marqueeItems = (
    tools.length
      ? tools.map((t) => t.name)
      : Array.from(new Set(projects.map((p) => p.category).filter(Boolean)))
  ) as string[];
  if (!marqueeItems.length) marqueeItems.push(hero.title);

  const prefix = preview ? "/admin/preview" : "";
  const initial = (c.hero.name || "?").trim().charAt(0).toUpperCase();

  const [menu, setMenu] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const track = useRef<HTMLDivElement>(null);

  const slide = (dir: 1 | -1) => {
    const el = track.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  // Auto-swipe testimonials on small screens
  useEffect(() => {
    const el = track.current;
    if (!el || testimonials.length < 2) return;

    const mq = window.matchMedia("(max-width: 860px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setInterval> | undefined;
    let resume: ReturnType<typeof setTimeout> | undefined;
    let paused = false;

    const tick = () => {
      if (paused) return;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
      if (atEnd) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        const card = el.querySelector("figure") as HTMLElement | null;
        const gap = parseFloat(getComputedStyle(el).columnGap) || 24;
        el.scrollBy({ left: card ? card.offsetWidth + gap : el.clientWidth * 0.8, behavior: "smooth" });
      }
    };

    const stop = () => {
      if (timer) clearInterval(timer);
    };
    const start = () => {
      stop();
      if (mq.matches && !reduce.matches) timer = setInterval(tick, 4000);
    };

    const pause = () => {
      paused = true;
      if (resume) clearTimeout(resume);
    };
    const unpause = () => {
      if (resume) clearTimeout(resume);
      resume = setTimeout(() => {
        paused = false;
      }, 6000);
    };

    el.addEventListener("pointerdown", pause);
    el.addEventListener("pointerup", unpause);
    el.addEventListener("pointercancel", unpause);
    mq.addEventListener("change", start);
    start();

    return () => {
      stop();
      if (resume) clearTimeout(resume);
      el.removeEventListener("pointerdown", pause);
      el.removeEventListener("pointerup", unpause);
      el.removeEventListener("pointercancel", unpause);
      mq.removeEventListener("change", start);
    };
  }, [testimonials.length]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const subject = `Project inquiry from ${f.get("name")}`;
    const body = `${f.get("message")}\n\n${f.get("name")}\n${f.get("email")}`;
    window.location.href = `mailto:${c.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const links = [
    { href: "#top", label: "Home" },
    services.length ? { href: "#services", label: "Services" } : null,
    c.sections.about ? { href: "#about", label: "About" } : null,
    c.sections.work ? { href: "#work", label: "Projects" } : null,
    { href: "#contact", label: "Contact" },
  ].filter(Boolean) as { href: string; label: string }[];

  return (
    <div className="nx" id="top" data-template="noir" data-theme={c.colorMode || "light"}>
      <MotionScene />

      {/* ───────── Header ───────── */}
      <header className="nx-header">
        <div className="nx-wrap">
          <div className="nx-nav">
            <a href="#top" className="nx-logo">
              <span className="nx-logo-mark">{initial}</span>
              {c.hero.name}
            </a>
            <nav className="nx-links" aria-label="Primary">
              {links.map((l) => (
                <a key={l.href} href={l.href}>{l.label}</a>
              ))}
            </nav>
            <a href="#contact" className="nx-btn nx-btn--dark nx-btn--sm nx-cta-desktop">Contact Me</a>
            <button
              className="nx-burger"
              aria-label="Toggle menu"
              aria-expanded={menu}
              onClick={() => setMenu((m) => !m)}
            >
              <span /><span />
            </button>
          </div>
          <div className={`nx-menu ${menu ? "is-open" : ""}`}>
            {links.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setMenu(false)}>{l.label}</a>
            ))}
          </div>
        </div>
      </header>

      <main id="main-content">
        {/* ───────── Hero ───────── */}
        <section className="nx-hero">
          <div className="nx-wrap nx-hero-grid" style={{ width: "min(1536px, 100% - 2.5rem)", maxWidth: "100%", margin: "0 auto" }}>
            <div className="nx-hero-copy">
              <span className="nx-pill">👋 Hello There!</span>
              <h1 className="nx-h1" style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)", lineHeight: 1.2 }}>
                I&apos;m <span className="nx-accent">{c.hero.name}</span>,<br />
                {c.hero.title}
                {hero.location ? <><br />Based in {hero.location}.</> : null}
              </h1>
              {tagline && <p className="nx-lead">{tagline.length > 180 ? tagline.slice(0, 177) + "…" : tagline}</p>}
              <div className="nx-actions">
                {c.sections.work && (
                  <a href="#work" className="nx-btn nx-btn--dark">
                    View My Portfolio <span className="nx-btn-ico"><Arrow /></span>
                  </a>
                )}
                <a href="#contact" className="nx-btn nx-btn--ghost">Hire Me</a>
              </div>
            </div>

            <div className="nx-hero-media" style={{ position: "relative", width: "min(100%, 420px)", aspectRatio: "1 / 1" }}>
              {/* Blob background */}
              <div style={{
                position: "absolute",
                top: "5%", left: "5%", right: "5%", bottom: "5%",
                background: "var(--nx-accent)",
                opacity: 0.8,
                borderRadius: "40% 60% 70% 30% / 40% 50% 60% 50%",
                animation: "nx-spin 20s linear infinite",
                zIndex: 0
              }} />

              {/* Image container */}
              <div className="nx-hero-photo" style={{ position: "absolute", inset: 0, borderRadius: "2rem", background: "transparent", zIndex: 1 }}>
                {heroImg ? (
                  <Image src={heroImg} alt={c.hero.name} fill priority unoptimized style={{ objectFit: "contain", background: "transparent" }} />
                ) : (
                  <span className="nx-monogram">{initial}</span>
                )}
              </div>
              <span className="nx-hero-float nx-float-tag nx-float-tag--light" style={{ zIndex: 10 }}>● Available for work</span>
              <div className="nx-hero-float nx-badge" style={{ zIndex: 10 }} aria-hidden>
                <svg className="nx-badge-svg" viewBox="0 0 120 120">
                  <defs>
                    <path id="nx-circ" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
                  </defs>
                  <text fontSize="10" fontWeight="700" fill="currentColor" letterSpacing="1">
                    <textPath href="#nx-circ" textLength="272" lengthAdjust="spacing">
                      Available for work • Available for work •
                    </textPath>
                  </text>
                </svg>
                <span className="nx-badge-ico"><Arrow /></span>
              </div>
            </div>
          </div>
        </section>

        <Marquee items={marqueeItems} />

        {/* ───────── Services (optional) ───────── */}
        {services.length > 0 && (
          <section id="services" className="nx-sec">
            <div className="nx-wrap">
              <div className="nx-head nx-reveal">
                <div>
                  <span className="nx-eyebrow">Services</span>
                  <h2 className="nx-h2">Services <span className="nx-accent">I Provide</span></h2>
                </div>
              </div>
              <div className="nx-grid nx-grid--3">
                {services.map((s, i) => (
                  <article key={i} className="nx-service nx-reveal">
                    <span className="nx-service-ico"><Star size={20} /></span>
                    <h3>{s.title || s.name}</h3>
                    <p>{s.description || s.text}</p>
                    <a href="#contact" className="nx-link">Learn more <Arrow /></a>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ───────── About ───────── */}
        {c.sections.about && paragraphs.length > 0 && (
          <section id="about" className="nx-band nx-sec">
            <div className="nx-wrap nx-about-grid">
              <div className="nx-about-media nx-reveal">
                <div className="nx-about-photo">
                  {aboutImg ? (
                    <Image src={aboutImg} alt={c.hero.name} fill unoptimized style={{ objectFit: "cover" }} />
                  ) : (
                    <span className="nx-monogram">{initial}</span>
                  )}
                </div>
                <span className="nx-sticker nx-sticker--a">{c.hero.title}</span>
              </div>

              <div className="nx-about-copy">
                <span className="nx-eyebrow nx-reveal">About Me</span>
                <h2 className="nx-h2 nx-reveal">Who is <span className="nx-accent">{c.hero.name}</span>?</h2>
                {paragraphs.map((p, i) => (
                  <p key={i} className="nx-reveal nx-band-text">{p}</p>
                ))}
                <div className="nx-stats nx-reveal">
                  {projects.length > 0 && (
                    <div>
                      <strong><span className="nx-count" data-to={projects.length}>0</span>+</strong>
                      <span>Projects Completed</span>
                    </div>
                  )}
                  {tools.length > 0 && (
                    <div>
                      <strong><span className="nx-count" data-to={tools.length}>0</span>+</strong>
                      <span>Tools &amp; Skills</span>
                    </div>
                  )}
                </div>
                {cvUrl && (
                  <a href={cvUrl} className="nx-btn nx-btn--light nx-reveal" target="_blank" rel="noreferrer">
                    Download CV <span className="nx-btn-ico"><Arrow /></span>
                  </a>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ───────── Tools ───────── */}
        {tools.length > 0 && (
          <section id="skills" className="nx-sec">
            <div className="nx-wrap nx-center">
              <span className="nx-eyebrow nx-reveal">My Favorite Tools</span>
              <h2 className="nx-h2 nx-reveal">
                Exploring the <span className="nx-accent">Tools</span><br />Behind My Work
              </h2>
              <div className="nx-tools">
                {tools.map((t) => {
                  const tool = t as any;
                  const lvl = tool.level;
                  return (
                    <div key={tool.name} className="nx-tool nx-reveal">
                      <span className="nx-tool-ico" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', padding: '0.5rem' }}>
                        {tool.logo ? (
                          <img
                            src={tool.logo}
                            alt={tool.name}
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            className={["Notion", "GitHub"].includes(tool.name) ? "nx-dark-invert" : ""}
                          />
                        ) : (
                          tool.name.slice(0, 2)
                        )}
                      </span>
                      {lvl ? <strong>{lvl}%</strong> : null}
                      <span className="nx-tool-name">{tool.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ───────── Projects ───────── */}
        {projects.length > 0 && (
          <section id="work" className="nx-sec nx-sec--tight">
            <div className="nx-wrap">
              <div className="nx-head nx-reveal">
                <div>
                  <span className="nx-eyebrow">My Portfolio</span>
                  <h2 className="nx-h2">My Latest <span className="nx-accent">Projects</span></h2>
                </div>
              </div>
              <div className="nx-grid nx-grid--2">
                {projects.map((p) => (
                  <Link key={p.slug} href={`${prefix}/work/${p.slug}`} className="nx-card nx-reveal">
                    <div className="nx-card-img">
                      {p.cover && <Image src={p.cover} alt={p.title} fill unoptimized style={{ objectFit: "cover" }} />}
                    </div>
                    {p.category && (
                      <div className="nx-tags">
                        {String(p.category).split(/[,/|]/).map((t) => t.trim()).filter(Boolean).slice(0, 3).map((t) => (
                          <span key={t}>{t}</span>
                        ))}
                      </div>
                    )}
                    <div className="nx-card-foot" style={{ flexDirection: "column", alignItems: "flex-start", gap: "0.5rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                        <h3>{p.title}</h3>
                        <span className="nx-btn-ico nx-btn-ico--dark" style={{ flexShrink: 0 }}><Arrow /></span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ───────── Journey (optional) ───────── */}
        {(education.length > 0 || experience.length > 0) && (
          <section className="nx-sec">
            <div className="nx-wrap nx-center">
              <span className="nx-eyebrow nx-reveal">Education &amp; Work</span>
              <h2 className="nx-h2 nx-reveal">
                My <span className="nx-accent">Academic and Professional</span> Journey
              </h2>
              <div className="nx-grid nx-grid--2 nx-left">
                {[
                  { label: "Education", rows: education },
                  { label: "Work Experience", rows: experience },
                ].filter((g) => g.rows.length).map((g) => (
                  <div key={g.label} className="nx-journey nx-reveal">
                    <div className="nx-journey-head">
                      <span className="nx-service-ico"><Star size={20} /></span>
                      <h3>{g.label}</h3>
                    </div>
                    {g.rows.map((r, i) => {
                      const n = norm(r);
                      return (
                        <div key={i} className="nx-journey-row">
                          {n.when && <small>{n.when}</small>}
                          <strong>{n.title}</strong>
                          {n.sub && <span>{n.sub}</span>}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ───────── Testimonials (optional) ───────── */}
        {testimonials.length > 0 && (
          <section className="nx-sec nx-sec--tight">
            <div className="nx-wrap">
              <div className="nx-center nx-reveal">
                <span className="nx-eyebrow">Clients Testimonials</span>
                <h2 className="nx-h2">The Impact of My Work:<br /><span className="nx-accent">Client Testimonials</span></h2>
              </div>
              <div className="nx-track" ref={track}>
                {testimonials.map((t, i) => (
                  <figure key={i} className="nx-quote">
                    <div className="nx-stars" aria-label="5 out of 5">{"★★★★★"}</div>
                    <blockquote>{t.quote || t.text}</blockquote>
                    <figcaption>
                      <strong>{t.name || t.author}</strong>
                      <span>{t.role || t.title}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
              <div className="nx-ctrls">
                <button aria-label="Previous" onClick={() => slide(-1)} className="nx-ctrl nx-ctrl--prev"><Arrow /></button>
                <button aria-label="Next" onClick={() => slide(1)} className="nx-ctrl nx-ctrl--accent"><Arrow /></button>
              </div>
            </div>
          </section>
        )}

        {/* ───────── FAQ (optional) ───────── */}
        {faqs.length > 0 && (
          <section className="nx-band nx-sec">
            <div className="nx-wrap nx-faq-wrap">
              <div className="nx-center nx-reveal">
                <span className="nx-eyebrow">FAQs</span>
                <h2 className="nx-h2">Questions? <span className="nx-accent">Look here.</span></h2>
              </div>
              <div className="nx-faq">
                {faqs.map((f, i) => (
                  <div key={i} className={`nx-faq-item nx-reveal ${openFaq === i ? "is-open" : ""}`}>
                    <button onClick={() => setOpenFaq(openFaq === i ? -1 : i)} aria-expanded={openFaq === i}>
                      {f.question || f.q}
                      <span className="nx-plus" aria-hidden />
                    </button>
                    <div className="nx-faq-body"><p>{f.answer || f.a}</p></div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ───────── Contact ───────── */}
        <section id="contact" className="nx-sec">
          <div className="nx-wrap nx-contact-grid">
            <div className="nx-reveal">
              <span className="nx-eyebrow">Contact Here</span>
              <h2 className="nx-h2">{c.contact.heading}</h2>
              <a href={`mailto:${c.contact.email}`} className="nx-mail">
                <span className="nx-service-ico"><Arrow /></span>
                {c.contact.email}
              </a>
            </div>
            <form className="nx-form nx-reveal" onSubmit={onSubmit}>
              <label>Your Name *<input name="name" required placeholder="Enter your name" autoComplete="name" /></label>
              <label>Email *<input name="email" type="email" required placeholder="you@example.com" autoComplete="email" /></label>
              <label className="nx-full">Your Message *<textarea name="message" required rows={5} placeholder="Tell me about your project" /></label>
              <button type="submit" className="nx-btn nx-btn--dark nx-full-btn">
                Submit <span className="nx-btn-ico"><Arrow /></span>
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* ───────── Footer ───────── */}
      <footer className="nx-band nx-footer">
        <Marquee items={marqueeItems} />
        <div className="nx-wrap nx-footer-inner">
          <div className="nx-footer-top">
            <h2 className="nx-h2">Let&apos;s <span className="nx-accent">Connect</span> there</h2>
            <a href={`mailto:${c.contact.email}`} className="nx-btn nx-btn--light">
              Say Hello <span className="nx-btn-ico"><Arrow /></span>
            </a>
          </div>
          <div className="nx-footer-cols">
            <div>
              <a href="#top" className="nx-logo"><span className="nx-logo-mark">{initial}</span>{c.hero.name}</a>
              <p className="nx-band-text">{c.hero.title}</p>
            </div>
            <div>
              <h4>Navigation</h4>
              {links.map((l) => <a key={l.href} href={l.href}>{l.label}</a>)}
            </div>
            <div>
              <h4>Contact</h4>
              <a href={`mailto:${c.contact.email}`}>{c.contact.email}</a>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginTop: "1rem" }}>
                {c.contact.github && <a href={c.contact.github} target="_blank" rel="noreferrer">GitHub</a>}
                {c.contact.linkedin && <a href={c.contact.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}
                {c.contact.twitter && <a href={c.contact.twitter} target="_blank" rel="noreferrer">Twitter</a>}
                {c.contact.instagram && <a href={c.contact.instagram} target="_blank" rel="noreferrer">Instagram</a>}
                {c.contact.facebook && <a href={c.contact.facebook} target="_blank" rel="noreferrer">Facebook</a>}
              </div>
            </div>
          </div>
          <div className="nx-copy">
            <span>© {new Date().getFullYear()} {c.hero.name}. All Rights Reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}