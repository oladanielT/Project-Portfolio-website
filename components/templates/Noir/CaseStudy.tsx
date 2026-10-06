"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { SiteContent } from "@/lib/schema";
import { projectStorySections } from "@/lib/schema";
import MotionScene from "./MotionScene";
import TemplateFooter from "../common/TemplateFooter";
import "./styles.css";

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

export default function NoirCaseStudy({
  content: c,
  index,
  preview = false,
}: {
  content: SiteContent;
  index: number;
  preview?: boolean;
}) {
  const [menu, setMenu] = useState(false);
  const p = c.projects[index];
  const storySections = projectStorySections(p);
  const next = c.projects[(index + 1) % c.projects.length];
  const prefix = preview ? "/admin/preview" : "";
  const initial = (c.hero.name || "?").trim().charAt(0).toUpperCase();

  const services = (c as any).sections?.services === false ? [] : (c as any).services || [];
  const tools = c.sections.tools ? c.tools || [] : [];
  const projects = c.sections.work ? c.projects || [] : [];

  const marqueeItems = (
    tools.length
      ? tools.map((t) => t.name)
      : Array.from(new Set(projects.map((p) => p.category).filter(Boolean)))
  ) as string[];
  if (!marqueeItems.length) marqueeItems.push(c.hero.title);

  const links = [
    { href: `${prefix}/#top`, label: "Home" },
    services.length ? { href: `${prefix}/#services`, label: "Services" } : null,
    c.sections.about ? { href: `${prefix}/#about`, label: "About" } : null,
    c.sections.work ? { href: `${prefix}/#work`, label: "Projects" } : null,
    { href: `${prefix}/#contact`, label: "Contact" },
  ].filter(Boolean) as { href: string; label: string }[];

  return (
    <div data-template="noir">
      <div className="nx" id="top" data-theme={c.colorMode || "light"}>
        <MotionScene />

        {/* ───────── Header ───────── */}
        <header className="nx-header">
          <div className="nx-wrap">
            <div className="nx-nav">
              <Link href={`${prefix}/#top`} className="nx-logo">
                <span className="nx-logo-mark">{initial}</span>
                {c.hero.name}
              </Link>
              <nav className="nx-links" aria-label="Primary">
                {links.map((l) => (
                  <Link key={l.href} href={l.href}>{l.label}</Link>
                ))}
              </nav>
              <Link href={`${prefix}/#contact`} className="nx-btn nx-btn--dark nx-btn--sm nx-cta-desktop">Contact Me</Link>
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
                <Link key={l.href} href={l.href} onClick={() => setMenu(false)}>{l.label}</Link>
              ))}
              <Link href={`${prefix}/#contact`} onClick={() => setMenu(false)}>Contact Me</Link>
            </div>
          </div>
        </header>

        {/* ───────── Main Content ───────── */}
        <main id="main-content" style={{ paddingTop: "4rem" }}>
          <article className="nx-wrap nx-sec" style={{ paddingTop: "2rem" }}>
            <Link className="nx-eyebrow" href={`${prefix}/#work`} style={{ textDecoration: "none", marginBottom: "2rem", display: "inline-block" }}>
              ← All selected work
            </Link>

            <div className="nx-about-grid" style={{ marginBottom: "5rem" }}>
              <div className="nx-about-copy">
                <span className="nx-eyebrow">{p.category}</span>
                <h1 className="nx-h1" style={{ fontSize: "clamp(2.5rem, 5vw, 3.8rem)", margin: "0.5rem 0 1.5rem" }}>{p.title}</h1>
                <p className="nx-lead" style={{ fontSize: "1.15rem", marginBottom: "2.5rem", maxWidth: "100%" }}>{p.description}</p>

                <div className="nx-grid nx-grid--2 nx-case-meta" style={{ marginTop: 0 }}>
                  {p.org && (
                    <div>
                      <span className="nx-eyebrow" style={{ fontSize: "0.8rem", letterSpacing: "0.05em" }}>ORGANIZATION</span>
                      <p style={{ marginTop: "0.25rem", fontSize: "1.05rem" }}><strong>{p.org}</strong></p>
                    </div>
                  )}
                  {p.role && (
                    <div>
                      <span className="nx-eyebrow" style={{ fontSize: "0.8rem", letterSpacing: "0.05em" }}>MY ROLE</span>
                      <p style={{ marginTop: "0.25rem", fontSize: "1.05rem" }}><strong>{p.role}</strong></p>
                    </div>
                  )}
                </div>
              </div>

              {p.cover && (
                <div className="nx-about-media nx-reveal" style={{ width: "100%", aspectRatio: "4/3", borderRadius: "2rem", overflow: "hidden", position: "relative" }}>
                  <Image src={p.cover} alt={`${p.title} overview`} fill priority unoptimized style={{ objectFit: "cover" }} sizes="(max-width: 860px) 100vw, 50vw" />
                </div>
              )}
            </div>

            <div className="nx-about-copy" style={{ maxWidth: "100%", margin: "0 auto" }}>
              {p.stats && p.stats.length > 0 && (
                <section className="nx-sec nx-sec--tight" style={{ paddingBottom: "1rem" }}>
                  <h2 className="nx-h2">What moved <span className="nx-accent">forward.</span></h2>
                  <ul style={{ listStyle: "none", padding: 0, marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {p.stats.map((s) => (
                      <li key={s} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                        <span className="nx-accent"><Arrow /></span> {s}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <section className="nx-sec nx-sec--tight" style={{ paddingTop: "1rem" }}>
                <div className="nx-grid nx-grid--2 nx-case-story">
                  {storySections.map((b, i) => (
                    <div key={i}>
                      <h2 className="nx-h2" style={{ fontSize: "1.8rem" }}>{b.heading}</h2>
                      <p className="nx-lead" style={{ marginTop: "1rem", whiteSpace: "pre-wrap", fontSize: "1rem" }}>{b.body}</p>
                      {b.image && (
                        <div className="nx-card-img" style={{ marginTop: "1.5rem", position: "relative", width: "100%", aspectRatio: "16/9", borderRadius: "1rem" }}>
                          <Image src={b.image} fill alt={b.alt || b.heading} unoptimized style={{ objectFit: "cover" }} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {p.caseStudyUrl && (
                <div style={{ marginTop: "3rem" }}>
                  <a className="nx-btn nx-btn--dark" href={p.caseStudyUrl} target="_blank" rel="noreferrer">
                    Visit project <span className="nx-btn-ico"><Arrow /></span>
                  </a>
                </div>
              )}
            </div>

            <div className="nx-case-next" style={{ marginTop: "6rem", borderTop: "1px solid var(--nx-line)", paddingTop: "3rem" }}>
              <Link href={`${prefix}/#contact`} className="nx-link">Have a project in mind? <Arrow /></Link>
              {next.slug !== p.slug && (
                <Link href={`${prefix}/work/${next.slug}`} className="nx-link" style={{ textAlign: "right" }}>
                  Next: {next.title} <span className="nx-btn-ico nx-btn-ico--dark" style={{ width: "2rem", height: "2rem", marginLeft: "1rem" }}><Arrow /></span>
                </Link>
              )}
            </div>
          </article>
        </main>

        {/* ───────── Footer ───────── */}
        <TemplateFooter content={c} templateVariant="noir" base={prefix} />
      </div>
    </div>
  );
}
