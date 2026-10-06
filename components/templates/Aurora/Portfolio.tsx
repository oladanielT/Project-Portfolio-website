"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "../Visionary/Media";
import { defaultFaqs, type SiteContent } from "@/lib/schema";
import TemplateFooter from "../common/TemplateFooter";
import "../Visionary/styles.css";
import "./styles.css";

const Arrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const Edge = ({ pos }: { pos: "top" | "bottom" }) => (
  <svg className={`a-edge a-edge-${pos}`} viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
    <path d="M0 0H1440V30C1150 150 760 -50 0 80Z" />
  </svg>
);

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <p className="a-eyebrow">{children}</p>
);

function Testimonials({ items }: { items: SiteContent["testimonials"] }) {
  const [i, setI] = useState(0);
  const n = items.length;
  useEffect(() => {
    if (n < 2) return;
    const t = setInterval(() => setI((p) => (p + 1) % n), 6000);
    return () => clearInterval(t);
  }, [n]);
  if (!n) return null;
  const at = (k: number) => items[(i + k + n) % n];
  const card = (t: (typeof items)[number], cls: string) => (
    <blockquote className={`a-quote ${cls}`}>
      <p>“{t.quote}”</p>
      <footer>
        <strong>{t.name}</strong>
        <span>{t.role}</span>
      </footer>
    </blockquote>
  );
  return (
    <div className="a-testi" role="region" aria-roledescription="carousel" aria-label="Client testimonials">
      <div className="a-testi-stage">
        {n > 2 && card(at(-1), "is-side")}
        {card(at(0), "is-main")}
        {n > 1 && card(at(1), "is-side")}
      </div>
      {n > 1 && (
        <div className="a-dots">
          {items.map((_, k) => (
            <button key={k} type="button" className={k === i ? "is-on" : ""} onClick={() => setI(k)} aria-label={`Testimonial ${k + 1}`} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Portfolio({
  content: c,
  preview = false,
}: {
  content: SiteContent;
  contactReady?: boolean;
  preview?: boolean;
}) {
  const rail = useRef<HTMLDivElement>(null);
  const mode = c.colorMode || "light";
  const projects = c.sections.work
    ? [...c.projects].sort((a, b) => Number(b.featured) - Number(a.featured))
    : [];
  const expertise = c.expertise.length
    ? c.expertise
    : c.services.map((s) => ({ ...s, skills: [] as string[] }));
  const showAbout =
    c.sections.about &&
    Boolean(c.about.heading || c.about.paragraphs.length || c.about.photo || c.about.stat.value);
  const faqs = c.faqs && c.faqs.length > 0 ? c.faqs : defaultFaqs;
  const base = preview ? "/admin/preview" : "";
  const links = [
    projects.length > 0 && ["Work", "#work"],
    showAbout && ["About", "#about"],
    c.sections.expertise && expertise.length > 0 && ["Skills", "#skills"],
    c.sections.process && c.process.length > 0 && ["Journey", "#journey"],
    c.sections.testimonial && c.testimonials.length > 0 && ["Testimonials", "#testimonials"],
  ].filter(Boolean) as string[][];

  return (
    <div className={`aurora theme-${mode}`} id="top" data-template="aurora" data-theme={mode}>
      <header className="a-header">
        <a href="#top" className="a-brand">
          <span className="a-logo" aria-hidden="true" />
          {c.hero.name}
        </a>
        <nav className="a-nav" aria-label="Primary">
          {links.map(([label, href]) => (
            <a key={href} href={href}>{label}</a>
          ))}
        </nav>
        <a href="#contact" className="a-pill">Let’s talk <Arrow /></a>
      </header>

      {preview && (
        <aside className="a-preview">
          Draft preview · Aurora <Link href="/admin">Back to editor ↗</Link>
        </aside>
      )}

      <main id="main-content">
        {/* HERO */}
        <section className="a-dark a-hero" aria-labelledby="a-hero-title">
          <div className="a-glow" aria-hidden="true" />
          <div className="a-wrap a-hero-grid">
            <div>
              {c.hero.eyebrow && <Eyebrow>{c.hero.eyebrow}</Eyebrow>}
              <h1 id="a-hero-title">{c.hero.name}</h1>
              {c.hero.title && <p className="a-hero-title">{c.hero.title}</p>}
              <p className="a-lead">{c.hero.intro}</p>
              <a className="a-btn" href={projects.length ? "#work" : "#contact"}>
                {projects.length ? c.hero.ctaLabel || "View my work" : "Let’s talk"} <Arrow />
              </a>
            </div>
            <div className="a-hero-image">
              {c.hero.photo ? (
                <Image
                  src={c.hero.photo}
                  alt={c.hero.name}
                  fill
                  unoptimized
                  sizes="(max-width: 760px) 88vw, 42vw"
                  style={{ objectPosition: c.hero.photoPosition, objectFit: "cover" }}
                />
              ) : (
                <span>{c.hero.name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("")}</span>
              )}
            </div>
          </div>
        </section>

        {/* ABOUT */}
        {showAbout && (
          <section id="about" className="a-wave" aria-labelledby="a-about-title">
            <Edge pos="top" />
            <div className="a-wrap a-about">
              <div className="a-orb">
                {c.about.photo ? (
                  <Image src={c.about.photo} alt={c.hero.name} fill unoptimized sizes="(max-width:760px) 80vw, 36vw" style={{ objectPosition: c.about.photoPosition }} />
                ) : (
                  <span>{c.hero.name.split(/\s+/).slice(0, 2).map((p) => p[0]).join("")}</span>
                )}
              </div>
              <div>
                <Eyebrow>About me</Eyebrow>
                <h2 id="a-about-title">{c.about.heading || "A little about me."}</h2>
                {c.about.paragraphs.map((p, k) => (
                  <p className="a-body" key={k}>{p}</p>
                ))}
                {c.about.stat.value && (
                  <div className="a-stat">
                    <strong>{c.about.stat.value}</strong>
                    <span>{c.about.stat.label}</span>
                  </div>
                )}
                {c.contact.cv && (
                  <a className="a-link" href={c.contact.cv} target="_blank" rel="noreferrer">
                    View curriculum vitae <Arrow />
                  </a>
                )}
              </div>
            </div>
            <Edge pos="bottom" />
          </section>
        )}

        {/* SKILLS */}
        {c.sections.expertise && (expertise.length > 0 || c.skills?.length > 0) && (
          <section id="skills" className="a-dark a-section" aria-labelledby="a-skills-title">
            <div className="a-wrap">
              <div className="a-head">
                <div>
                  <Eyebrow>My skills</Eyebrow>
                  <h2 id="a-skills-title">Expertise with <em>passion.</em></h2>
                </div>
                <p className="a-body">The craft and capabilities behind the work.</p>
              </div>
              <div className="a-skills">
                {expertise.map((e, k) => (
                  <article key={`${e.title}-${k}`} className={`a-glass ${k === 0 ? "is-hero" : ""}`}>
                    <h3>{e.title}</h3>
                    <p>{e.description}</p>
                    {"skills" in e && e.skills && e.skills.length > 0 && (
                      <ul className="a-tags">{e.skills.map((s, j) => <li key={j}>{s}</li>)}</ul>
                    )}
                  </article>
                ))}
              </div>
              {(c.skills?.length > 0 || (c.sections.tools && c.tools.length > 0)) && (
                <ul className="a-tags a-tags-lg">
                  {c.skills?.map((s, k) => <li key={`s${k}`}>{s}</li>)}
                  {c.sections.tools && c.tools.map((t, k) => <li key={`t${k}`}>{t.name}</li>)}
                </ul>
              )}
            </div>
          </section>
        )}

        {/* WORK */}
        {projects.length > 0 && (
          <section id="work" className="a-dark a-section a-work" aria-labelledby="a-work-title">
            <div className="a-wrap a-work-head">
              <div>
                <Eyebrow>Featured work</Eyebrow>
                <h2 id="a-work-title">Digital experiences that make an <em>impact.</em></h2>
              </div>
              <div className="a-arrows">
                <button type="button" onClick={() => rail.current?.scrollBy({ left: -360, behavior: "smooth" })} aria-label="Previous projects">←</button>
                <button type="button" onClick={() => rail.current?.scrollBy({ left: 360, behavior: "smooth" })} aria-label="Next projects">→</button>
              </div>
            </div>
            <div className="a-rail" ref={rail}>
              {projects.map((p, k) => (
                <article key={p.slug} className="a-card">
                  <Link href={`${base}/work/${p.slug}`} aria-label={`Explore the project: ${p.title}`}>
                    <div className="a-card-img">
                      {p.cover ? <Image src={p.cover} alt={`${p.title} preview`} fill unoptimized sizes="320px" /> : <i>{p.title}</i>}
                    </div>
                    <h3>{p.title}</h3>
                    <p>{p.description}</p>
                    <span className="a-meta">{[p.category, p.org].filter(Boolean).join(" · ")}</span>
                  </Link>
                  {p.caseStudyUrl && (
                    <a className="a-link" href={p.caseStudyUrl} target="_blank" rel="noreferrer">Live preview ↗</a>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {/* JOURNEY */}
        {c.sections.process && c.process.length > 0 && (
          <section id="journey" className="a-wave" aria-labelledby="a-journey-title">
            <Edge pos="top" />
            <div className="a-wrap">
              <Eyebrow>Experience</Eyebrow>
              <h2 id="a-journey-title">The journey that <em>shaped me.</em></h2>
              <ol className="a-timeline">
                {c.process.map((s, k) => (
                  <li key={`${s.title}-${k}`}>
                    <span className="a-node">{String(k + 1).padStart(2, "0")}</span>
                    <h3>{s.title}</h3>
                    <p>{s.description}</p>
                  </li>
                ))}
              </ol>
            </div>
            <Edge pos="bottom" />
          </section>
        )}

        {/* TESTIMONIALS */}
        {c.sections.testimonial && c.testimonials.length > 0 && (
          <section id="testimonials" className="a-dark a-section" aria-labelledby="a-testi-title">
            <div className="a-wrap">
              <Eyebrow>Testimonials</Eyebrow>
              <h2 id="a-testi-title">People <em>love</em> working with me.</h2>
              <Testimonials items={c.testimonials} />
            </div>
          </section>
        )}

        {/* FAQS */}
        {c.sections.faqs && faqs.length > 0 && (
          <section id="faqs" className="a-dark a-section" aria-labelledby="a-faq-title">
            <div className="a-wrap a-faqs">
              <Eyebrow>Inquiries</Eyebrow>
              <h2 id="a-faq-title">Common <em>questions.</em></h2>
              {faqs.map((f, k) => (
                <details key={k} className="a-glass" open={k === 0}>
                  <summary>{f.question}<span>+</span></summary>
                  <p>{f.answer}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="a-wave a-cta" aria-labelledby="a-cta-title">
          <Edge pos="top" />
          <div className="a-wrap a-cta-grid">
            <div>
              <Eyebrow>Let’s work together</Eyebrow>
              <h2 id="a-cta-title">Have a <em>project</em> in mind?</h2>
            </div>
            <div>
              <p className="a-body">I’m always open to discussing new projects, creative ideas or opportunities to be part of your vision.</p>
              <a className="a-btn a-btn-solid" href="#contact">Let’s talk <Arrow /></a>
            </div>
          </div>
          <Edge pos="bottom" />
        </section>
      </main>

      <div className={`visionary-wrapper v-site aurora-footer-shell theme-${mode}`} data-template="aurora" data-theme={mode}>
        <TemplateFooter content={c} templateVariant="visionary" />
      </div>
    </div>
  );
}
