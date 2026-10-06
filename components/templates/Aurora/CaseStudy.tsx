"use client";

import Image from "../Visionary/Media";
import Link from "next/link";
import type { SiteContent } from "@/lib/schema";
import { projectStorySections } from "@/lib/schema";
import TemplateFooter from "../common/TemplateFooter";
import "../Visionary/styles.css";
import "./styles.css";

const Arrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export default function AuroraCaseStudy({
  content: c,
  index,
  preview = false,
}: {
  content: SiteContent;
  index: number;
  preview?: boolean;
}) {
  const project = c.projects[index];
  const story = projectStorySections(project);
  const next = c.projects.length > 1 ? c.projects[(index + 1) % c.projects.length] : null;
  const base = preview ? "/admin/preview/" : "/";
  const mode = c.colorMode || "light";

  return (
    <div className={`aurora theme-${mode}`} data-template="aurora" data-theme={mode}>
      <header className="a-header">
        <Link href={`${base}#top`} className="a-brand">
          <span className="a-logo" aria-hidden="true" />
          {c.hero.name}
        </Link>
        <nav className="a-nav" aria-label="Primary">
          <Link href={`${base}#work`}>Work</Link>
          {c.sections.about && <Link href={`${base}#about`}>About</Link>}
          <Link href={`${base}#contact`}>Contact</Link>
        </nav>
        <Link href={`${base}#contact`} className="a-pill">Let&apos;s talk <Arrow /></Link>
      </header>

      {preview && (
        <aside className="a-preview">
          Draft case study · Aurora <Link href="/admin">Back to editor ↗</Link>
        </aside>
      )}

      <main className="a-case-main" id="top">
        <header className="a-dark a-case-hero">
          <div className="a-glow" aria-hidden="true" />
          <div className="a-wrap">
            <Link className="a-link a-case-back" href={`${base}#work`}>← All selected work</Link>
            <p className="a-eyebrow">{project.category || "Selected work"}</p>
            <h1>{project.title}</h1>
            <p className="a-lead">{project.description}</p>
            <div className="a-case-meta">
              {project.org && <div><span>Organization</span><strong>{project.org}</strong></div>}
              {project.role && <div><span>My role</span><strong>{project.role}</strong></div>}
            </div>
          </div>
        </header>

        {project.cover && (
          <div className="a-wrap a-case-overview">
            <div className="a-case-cover">
              <Image src={project.cover} alt={`${project.title} overview`} fill priority unoptimized sizes="(max-width: 760px) 88vw, 40vw" />
            </div>
            {project.stats.length > 0 && (
              <section className="a-case-results" aria-labelledby="a-case-results-title">
                <div>
                  <p className="a-eyebrow">Outcomes</p>
                  <h2 id="a-case-results-title">What moved <em>forward.</em></h2>
                </div>
                <ul>{project.stats.map((stat, i) => <li key={`${stat}-${i}`}>{stat}</li>)}</ul>
              </section>
            )}
          </div>
        )}

        <div className="a-wrap a-case-content">
          {!project.cover && project.stats.length > 0 && (
            <section className="a-case-results" aria-labelledby="a-case-results-title">
              <div>
                <p className="a-eyebrow">Outcomes</p>
                <h2 id="a-case-results-title">What moved <em>forward.</em></h2>
              </div>
              <ul>{project.stats.map((stat, i) => <li key={`${stat}-${i}`}>{stat}</li>)}</ul>
            </section>
          )}

          {story.length > 0 && (
            <div className="a-case-story-grid">
              {story.map((block, i) => (
                <section className="a-case-block" key={`${block.heading}-${i}`}>
                  <p className="a-eyebrow">{String(i + 1).padStart(2, "0")} / Project story</p>
                  <h2>{block.heading}</h2>
                  <p className="a-body">{block.body}</p>
                  {block.image && (
                    <Image className="a-case-artifact" src={block.image} alt={block.alt || block.heading} width={1200} height={800} unoptimized sizes="(max-width: 760px) 88vw, 30vw" />
                  )}
                </section>
              ))}
            </div>
          )}

          {project.caseStudyUrl && (
            <a className="a-btn a-case-visit" href={project.caseStudyUrl} target="_blank" rel="noreferrer">Visit project <Arrow /></a>
          )}
        </div>

        <div className="a-wrap a-case-next">
          <Link href={next ? `${base}work/${next.slug}` : `${base}#work`}>
            <p className="a-eyebrow">{next ? "Next project" : "Back to selected work"}</p>
            <h2>{next ? next.title : "Explore more work"}</h2>
          </Link>
          <Link href={`${base}#contact`} className="a-btn a-btn-solid">Have a project in mind? <Arrow /></Link>
        </div>
      </main>

      <div className={`visionary-wrapper v-site aurora-footer-shell theme-${mode}`} data-template="aurora" data-theme={mode}>
        <TemplateFooter content={c} templateVariant="visionary" base={preview ? "/admin/preview" : ""} />
      </div>
    </div>
  );
}
