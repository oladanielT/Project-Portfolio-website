"use client";
import { useRef } from "react";
import Image from "./Media";
import Link from "next/link";
import type { SiteContent } from "@/lib/schema";
import { Arrow, VisionaryFooter, VisionaryHeader } from "./Chrome";
import MotionScene from "./MotionScene";
import "./styles.css";

export default function VisionaryCaseStudy({
  content: c,
  index,
  preview = false,
}: {
  content: SiteContent;
  index: number;
  preview?: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const project = c.projects[index];
  const next = c.projects[(index + 1) % c.projects.length];
  const base = preview ? "/admin/preview/" : "/";
  return (
    <div
      ref={root}
      id="top"
      className="visionary-wrapper v-site"
      data-template="visionary"
      data-theme={c.colorMode}
    >
      <MotionScene root={root} />
      <VisionaryHeader content={c} base={base} />
      <main id="main-content" className="v-case-main">
        {preview && (
          <aside className="v-container v-kicker">
            Draft case study · <Link href="/admin">Back to editor ↗</Link>
          </aside>
        )}
        <article>
          <header className="v-case-header v-container">
            <Link className="v-text-link" href={`${base}#work`}>
              ← All selected work
            </Link>
            <p className="v-kicker">{project.category}</p>
            <h1>{project.title}</h1>
            <p className="v-case-lead">{project.description}</p>
            <div className="v-case-meta">
              {project.org && (
                <div>
                  <span className="v-kicker">Organization</span>
                  <p>{project.org}</p>
                </div>
              )}
              {project.role && (
                <div>
                  <span className="v-kicker">My role</span>
                  <p>{project.role}</p>
                </div>
              )}
            </div>
          </header>
          {project.cover && (
            <div className="v-case-cover v-container">
              <Image
                src={project.cover}
                alt={`${project.title} overview`}
                fill
                priority
                unoptimized
                sizes="88vw"
              />
            </div>
          )}
          <div className="v-case-content v-container">
            {project.stats.length > 0 && (
              <section className="v-case-block" data-v-reveal>
                <h2>
                  What moved <em>forward.</em>
                </h2>
                <ul className="v-case-results">
                  {project.stats.map((stat, i) => (
                    <li key={i}>
                      <span aria-hidden="true">↗</span>
                      {stat}
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {project.blocks.map((block, i) => (
              <section className="v-case-block" key={i} data-v-reveal>
                <h2>{block.heading}</h2>
                <p className="v-body">{block.body}</p>
                {block.image && (
                  <Image
                    src={block.image}
                    alt={block.alt || block.heading}
                    width={1200}
                    height={800}
                    unoptimized
                    sizes="(max-width: 760px) 88vw, 920px"
                  />
                )}
              </section>
            ))}
            {project.caseStudyUrl && (
              <a
                className="v-button"
                href={project.caseStudyUrl}
                target="_blank"
                rel="noreferrer"
              >
                Visit project <Arrow />
              </a>
            )}
          </div>
        </article>
        <div className="v-case-next v-container">
          {next && next.slug !== project.slug ? (
            <Link href={`${base}work/${next.slug}`}>
              <p className="v-kicker">Next in the orbit ↗</p>
              <h2>{next.title}</h2>
            </Link>
          ) : (
            <Link href={`${base}#work`} className="v-text-link">
              Back to selected work <Arrow />
            </Link>
          )}
          <Link href={`${base}#contact`} className="v-button">
            Have something in mind? <Arrow />
          </Link>
        </div>
      </main>
      <VisionaryFooter content={c} base={base} />
    </div>
  );
}
