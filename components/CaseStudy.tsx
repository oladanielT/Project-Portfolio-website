"use client";
import "./templates/Architect/styles.css";
import "./templates/Bento/styles.css";
import "./templates/Noir/styles.css";
import "./templates/Visionary/styles.css";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import type { SiteContent } from "@/lib/schema";
import Nav from "./Nav";
import VisionaryCaseStudy from "./templates/Visionary/CaseStudy";
import NoirCaseStudy from "./templates/Noir/CaseStudy";

function ThemeInjector({ template, colorMode }: { template: string; colorMode: string }) {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", colorMode);
    document.documentElement.setAttribute("data-template", template);
  }, [template, colorMode]);
  return null;
}

const SocialIcon = ({ type, url }: { type: string; url?: string }) => {
    const paths: Record<string, string> = {
        facebook: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z",
        twitter: "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z",
        instagram: "M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z M6.5 6.5h.01 M21 12v-2a9 9 0 00-9-9 9 9 0 00-9 9v2a9 9 0 009 9 9 9 0 009-9z",
        linkedin: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z M2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z",
    github: "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22",
    };
    return (
    <a href={url || '#'} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label={type}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d={paths[type]}></path>
        {type === 'instagram' && <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>}
      </svg>
    </a>
    );
};

const ArchitectNav = ({ c, base }: { c: SiteContent; base: string }) => {
  const prefix = base ? base : "/";
  return (
      <nav className="site-nav">
        <div className="nav-left">
          <Link href={`${prefix}#hero`} className="brand-logo">
            <span className="name-full">{c.hero.name}</span>
            <span className="name-short">{c.hero.name.split(' ')[0]}</span>
          </Link>
        </div>
        <div className="nav-center">
          <Link href={`${prefix}#hero`}>Home</Link>
          {c.sections.about && <Link href={`${prefix}#about`}>About</Link>}
          {c.sections.work && <Link href={`${prefix}#work`}>Work</Link>}
          {c.sections.organizations && <Link href={`${prefix}#partners`}>Partners</Link>}
          <Link href={`${prefix}#contact`}>Contact</Link>
        </div>
        <div className="nav-right">
          <Link href={`${prefix}#contact`} className="btn-primary btn-small">Let's Talk</Link>
        </div>
      </nav>
  );
};

const ArchitectFooter = ({ c, base }: { c: SiteContent; base: string }) => {
  const prefix = base ? base : "/";
  return (
      <footer className="site-footer">
        <div className="footer-top-row">
          <div className="footer-brand-col">
             <Link href={`${prefix}#hero`} className="brand-logo">
                <span className="name-full">{c.hero.name}</span>
                <span className="name-short">{c.hero.name.split(' ')[0]}</span>
             </Link>
             <div className="footer-contact-info" style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', opacity: 0.8 }}>
                <a href={`mailto:${c.contact.email}`} className="contact-link">{c.contact.email}</a>
                {c.contact.location && <span className="contact-link">{c.contact.location}</span>}
             </div>
          </div>
          <div className="footer-social-wrapper">
             <SocialIcon type="twitter" url={c.contact.twitter} />
             <SocialIcon type="facebook" url={c.contact.facebook} />
             <SocialIcon type="instagram" url={c.contact.instagram} />
             <SocialIcon type="linkedin" url={c.contact.linkedin} />
             {c.contact.github && <SocialIcon type="github" url={c.contact.github} />}
          </div>
        </div>
        <div className="footer-bottom-row">
          <p className="copyright">
             &copy; {new Date().getFullYear()} {c.hero.name}. All rights reserved.
          </p>
          <div className="legal-links">
             <a href="#">Privacy Policy</a>
             <a href="#">Terms of Service</a>
          </div>
        </div>
      </footer>
  );
};

export default function CaseStudy({
  content: c,
  index,
  preview = false,
}: {
  content: SiteContent;
  index: number;
  preview?: boolean;
}) {
  if (c.template === "visionary") return <VisionaryCaseStudy content={c} index={index} preview={preview} />;
  if (c.template === "noir") return <NoirCaseStudy content={c} index={index} preview={preview} />;
  
  const p = c.projects[index];
  const next = c.projects[(index + 1) % c.projects.length];
  const base = preview ? "/admin/preview" : "";
    return (
    <>
      <ThemeInjector template={c.template || "architect"} colorMode={c.colorMode || "light"} />
      <div className={`${c.template || "architect"}-wrapper theme-${c.colorMode || "light"}`}>
        <main id="top">
      {(!c.template || c.template === "architect") ? (
        <ArchitectNav c={c} base={base} />
      ) : (
        <Nav name={c.hero.name} home base={base} sections={c.sections} />
      )}
      {preview && (
        <div className="preview-banner">
          Draft case study · Only visible to you{" "}
          <Link href="/admin">Back to editor ↗</Link>
        </div>
      )}
      <article className="case-study page-width">
        <Link className="text-link" href={`${base}/#work`}>
          ← All selected work
        </Link>
        <p className="eyebrow">{p.category}</p>
        <h1>{p.title}</h1>
        <p className="case-lead">{p.description}</p>
        <div className="case-meta">
          <div>
            <span>ORGANIZATION</span>
            <p>{p.org}</p>
          </div>
          <div>
            <span>MY ROLE</span>
            <p>{p.role}</p>
          </div>
        </div>
        {p.cover && (
          <div className="case-cover">
            <Image
              src={p.cover}
              alt={`${p.title} overview`}
              fill
              priority
              unoptimized
              sizes="100vw"
            />
          </div>
        )}
        <div className="case-body">
          <section>
            <h2>What moved forward.</h2>
            <ul className="case-results">
              {p.stats.map((s) => (
                <li key={s}>
                  <span>↗</span>
                  {s}
                </li>
              ))}
            </ul>
          </section>
          {p.blocks.map((b, i) => (
            <section key={i}>
              <h2>{b.heading}</h2>
              <p className="preserve-lines">{b.body}</p>
              {b.image && (
                <Image
                  className="case-artifact"
                  src={b.image}
                  width={1000}
                  height={700}
                  alt={b.alt || b.heading}
                  unoptimized
                />
              )}
            </section>
          ))}
          {p.caseStudyUrl && (
            <a
              className="button button-primary"
              href={p.caseStudyUrl}
              target="_blank"
              rel="noreferrer"
            >
              Visit project ↗
            </a>
          )}
        </div>
        <div className="case-next">
          <Link href={`${base}/#contact`}>Have a project in mind? ↗</Link>
          {next.slug !== p.slug && (
            <Link href={`${base}/work/${next.slug}`}>Next: {next.title} →</Link>
          )}
        </div>
      </article>
    </main>
    {(!c.template || c.template === "architect") && <ArchitectFooter c={c} base={base} />}
    </div>
    </>
  );
}
