"use client";

import { useRef } from "react";
import Image from "./Media";
import Link from "next/link";
import type { SiteContent } from "@/lib/schema";
import ContactForm from "@/components/ContactForm";
import MotionScene from "./MotionScene";
import { Arrow, OrbitMark, VisionaryFooter, VisionaryHeader } from "./Chrome";
import "./styles.css";

function Label({
  number,
  children,
}: {
  number: string;
  children: React.ReactNode;
}) {
  return (
    <p className="v-kicker v-section-label">
      <span>{number} /</span>
      {children}
    </p>
  );
}

export default function Portfolio({
  content: c,
  contactReady,
  preview = false,
}: {
  content: SiteContent;
  contactReady: boolean;
  preview?: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const projects = c.sections.work
    ? [...c.projects].sort((a, b) => Number(b.featured) - Number(a.featured))
    : [];
  const expertise = c.expertise.length
    ? c.expertise
    : c.services.map((service) => ({ ...service, skills: [] as string[] }));
  const showAbout =
    c.sections.about &&
    Boolean(
      c.about.heading ||
      c.about.paragraphs.length ||
      c.about.photo ||
      c.about.stat.value,
    );
  return (
    <div
      ref={root}
      className="visionary-wrapper v-site"
      id="top"
      data-template="visionary"
      data-theme={c.colorMode}
    >
      <MotionScene root={root} />
      <VisionaryHeader content={c} />
      {preview && (
        <aside className="v-preview">
          Draft preview · The Visionary{" "}
          <Link href="/admin">Back to editor ↗</Link>
        </aside>
      )}
      <main id="main-content">
        <section className="v-hero v-container" aria-labelledby="v-hero-title">
          <div className="v-hero-copy">
            {c.hero.eyebrow && (
              <p className="v-kicker v-hero-eyebrow">
                <span className="v-dot" />
                {c.hero.eyebrow}
              </p>
            )}
            <h1 id="v-hero-title">{c.hero.name}</h1>
            {c.hero.title && <p className="v-hero-title">{c.hero.title}</p>}
            <p className="v-hero-intro">{c.hero.intro}</p>
            <div className="v-actions">
              <a
                className="v-button"
                href={projects.length ? "#work" : "#contact"}
              >
                {projects.length
                  ? c.hero.ctaLabel || "View my work"
                  : "Let’s talk"}
                <Arrow />
              </a>
              {projects.length > 0 && (
                <a className="v-text-link" href="#contact">
                  Let’s talk <Arrow />
                </a>
              )}
            </div>
          </div>
          <div
            className={`v-hero-art ${c.hero.photo ? "" : "v-art-no-photo"}`}
            aria-hidden="true"
          >
            <svg className="v-orbit-guide" viewBox="0 0 600 650" fill="none">
              <ellipse
                cx="300"
                cy="320"
                rx="270"
                ry="225"
                transform="rotate(-35 300 320)"
              />
              <ellipse
                cx="300"
                cy="320"
                rx="270"
                ry="225"
                transform="rotate(35 300 320)"
              />
              <path d="M300 15v620M15 320h570" strokeDasharray="3 9" />
            </svg>
            <div className="v-sculpture">
              <div className="v-sculpture-spin">
                <div className="v-ring v-ring-one" />
                <div className="v-ring v-ring-two" />
                <div className="v-ring v-ring-three" />
                <div className="v-orb" />
              </div>
            </div>
            {c.hero.photo && (
              <div className="v-hero-portrait">
                <Image
                  src={c.hero.photo}
                  alt=""
                  fill
                  priority
                  unoptimized
                  sizes="(max-width: 760px) 70vw, 28vw"
                  style={{ objectPosition: c.hero.photoPosition }}
                />
                <span className="v-portrait-line" />
              </div>
            )}
            <span className="v-art-plus v-art-plus-one">+</span>
            <span className="v-art-plus v-art-plus-two">+</span>
            <span className="v-art-caption v-kicker">
              A different perspective.
            </span>
            <span className="v-art-coordinate v-kicker">VISION / 01</span>
          </div>
          <div className="v-hero-bottom">
            <span className="v-kicker">{c.contact.location}</span>
            <a
              href={
                projects.length ? "#work" : showAbout ? "#about" : "#contact"
              }
              className="v-kicker"
            >
              Scroll to explore <span aria-hidden="true">↓</span>
            </a>
          </div>
        </section>

        {c.sections.organizations && c.organizations.length > 0 && (
          <section className="v-organizations" aria-label="Organizations">
            <div className="v-container v-organizations-inner">
              <p className="v-kicker">Along the journey</p>
              <div>
                {c.organizations.map((org, i) => (
                  <div className="v-organization" key={`${org.name}-${i}`}>
                    <span className="v-star" aria-hidden="true">
                      ✳
                    </span>
                    <div>
                      {org.url ? (
                        <a href={org.url} target="_blank" rel="noreferrer">
                          {org.name} ↗
                        </a>
                      ) : (
                        <span>{org.name}</span>
                      )}
                      {org.detail && <p>{org.detail}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {projects.length > 0 && (
          <section
            id="work"
            className="v-section v-container"
            aria-labelledby="v-work-title"
          >
            <Label number="01">Selected work</Label>
            <div className="v-section-heading" data-v-reveal>
              <h2 id="v-work-title">
                Ideas out
                <br />
                in the <em>world.</em>
              </h2>
              <p>
                A closer look at the work.
                <br />
                The thinking, the process, the outcome.
              </p>
            </div>
            <div className="v-project-grid">
              {projects.map((p, i) => (
                <article
                  className={`v-project ${p.featured ? "v-project-featured" : ""}`}
                  key={p.slug}
                  data-v-reveal
                >
                  <Link
                    href={`${preview ? "/admin/preview" : ""}/work/${p.slug}`}
                    className="v-project-link"
                    aria-label={`Explore the project: ${p.title}`}
                  >
                    <div className="v-project-image">
                      {p.cover ? (
                        <Image
                          src={p.cover}
                          alt={`${p.title} project preview`}
                          fill
                          unoptimized
                          sizes="(max-width: 760px) 90vw, 42vw"
                        />
                      ) : (
                        <div className="v-project-placeholder">
                          <OrbitMark variant={i} />
                          <span>{p.title}</span>
                        </div>
                      )}
                      <span className="v-project-index v-kicker">
                        {String(i + 1).padStart(2, "0")} /{" "}
                        {p.featured ? "Featured project" : "Project"}
                      </span>
                      <span className="v-project-arrow">
                        <Arrow />
                      </span>
                    </div>
                  </Link>
                  <div className="v-project-content">
                    <div className="v-project-info">
                      <div>
                        <p className="v-kicker">{p.category}</p>
                        <h3>
                          <Link
                            href={`${preview ? "/admin/preview" : ""}/work/${p.slug}`}
                          >
                            {p.title}
                          </Link>
                        </h3>
                      </div>
                      <p className="v-project-role">{p.role || p.org}</p>
                    </div>
                    <p className="v-project-description">{p.description}</p>
                    {p.stats.length > 0 && (
                      <ul className="v-project-results">
                        {(p.featured ? p.stats : p.stats.slice(0, 1)).map(
                          (stat, index) => (
                            <li key={index}>
                              <span aria-hidden="true">↗</span>
                              {stat}
                            </li>
                          ),
                        )}
                      </ul>
                    )}
                    {p.featured && (
                      <Link
                        className="v-text-link v-project-cta"
                        href={`${preview ? "/admin/preview" : ""}/work/${p.slug}`}
                      >
                        Explore the project <Arrow />
                      </Link>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {showAbout && (
          <section
            id="about"
            className="v-about v-section"
            aria-labelledby="v-about-title"
          >
            <div className="v-container v-about-grid">
              <div className="v-about-visual" data-v-reveal>
                <div className="v-about-shape" />
                <svg
                  className="v-contours"
                  viewBox="0 0 400 500"
                  fill="none"
                  aria-hidden="true"
                >
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <ellipse
                      key={i}
                      cx="200"
                      cy="250"
                      rx={110 + i * 15}
                      ry={170 + i * 15}
                      transform="rotate(-25 200 250)"
                    />
                  ))}
                </svg>
                {c.about.photo ? (
                  <div className="v-about-photo">
                    <Image
                      src={c.about.photo}
                      alt={c.hero.name}
                      fill
                      unoptimized
                      sizes="(max-width: 760px) 85vw, 38vw"
                      style={{ objectPosition: c.about.photoPosition }}
                    />
                  </div>
                ) : (
                  <div className="v-about-monogram">
                    <OrbitMark />
                    <span>
                      {c.hero.name
                        .split(/\s+/)
                        .slice(0, 2)
                        .map((part) => part[0])
                        .join("")}
                    </span>
                  </div>
                )}
                {c.about.stat.value && (
                  <div className="v-stat">
                    <strong>{c.about.stat.value}</strong>
                    <span>{c.about.stat.label}</span>
                  </div>
                )}
              </div>
              <div className="v-about-copy" data-v-reveal>
                <Label number="02">Behind the vision</Label>
                <h2 id="v-about-title">
                  {c.about.heading || "A little about me."}
                </h2>
                {c.about.paragraphs.map((paragraph, i) => (
                  <p className="v-body" key={i}>
                    {paragraph}
                  </p>
                ))}
                {c.contact.cv && (
                  <a
                    className="v-text-link"
                    href={c.contact.cv}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View my CV <Arrow />
                  </a>
                )}
              </div>
            </div>
          </section>
        )}

        {c.sections.expertise &&
          (expertise.length > 0 || c.skills.length > 0) && (
            <section
              id="expertise"
              className="v-section v-container"
              aria-labelledby="v-expertise-title"
            >
              <Label number="03">Expertise</Label>
              <div className="v-section-heading" data-v-reveal>
                <h2 id="v-expertise-title">
                  Where vision
                  <br />
                  meets <em>practice.</em>
                </h2>
                <p>The capabilities behind the work.</p>
              </div>
              <div className="v-expertise-list">
                {expertise.map((item, i) => (
                  <article
                    className="v-expertise-row"
                    key={`${item.title}-${i}`}
                    data-v-reveal
                  >
                    <span className="v-kicker">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <OrbitMark variant={i} />
                    <h3>{item.title}</h3>
                    <div>
                      <p>{item.description}</p>
                      {item.skills.length > 0 && (
                        <ul className="v-tags">
                          {item.skills.map((skill, j) => (
                            <li key={j}>{skill}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </article>
                ))}
              </div>
              {c.skills.length > 0 && (
                <div className="v-additional-skills">
                  <p className="v-kicker">Skills in practice</p>
                  <ul className="v-tags">
                    {c.skills.map((skill, i) => (
                      <li key={i}>{skill}</li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}

        {c.sections.process && c.process.length > 0 && (
          <section
            id="process"
            className="v-process v-section"
            aria-labelledby="v-process-title"
          >
            <div className="v-container">
              <Label number="04">The process</Label>
              <div className="v-section-heading" data-v-reveal>
                <h2 id="v-process-title">
                  A path from
                  <br />
                  <em>what if</em> to what’s next.
                </h2>
                <OrbitMark />
              </div>
              <div className="v-process-grid">
                {c.process.map((step, i) => (
                  <article
                    className="v-process-step"
                    key={`${step.title}-${i}`}
                    data-v-reveal
                  >
                    <div className="v-step-path">
                      <span>{String(i + 1).padStart(2, "0")}</span>
                      <svg
                        viewBox="0 0 300 60"
                        preserveAspectRatio="none"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path d="M0 30C90 -25 210 85 300 30" pathLength="1" />
                      </svg>
                    </div>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {c.sections.tools && c.tools.length > 0 && (
          <section
            id="tools"
            className="v-section v-container v-tools"
            aria-labelledby="v-tools-title"
          >
            <Label number="05">The toolkit</Label>
            <div className="v-section-heading" data-v-reveal>
              <h2 id="v-tools-title">
                In my <em>orbit.</em>
              </h2>
              <p>The tools that help bring it all together.</p>
            </div>
            <div className="v-tools-grid">
              {c.tools.map((tool, i) => (
                <article
                  className="v-tool"
                  key={`${tool.name}-${i}`}
                  data-v-reveal
                >
                  <div className="v-tool-icon">
                    {tool.logo ? (
                      <Image
                        src={tool.logo}
                        width={36}
                        height={36}
                        alt=""
                        unoptimized
                      />
                    ) : (
                      <span>{tool.name.slice(0, 2)}</span>
                    )}
                  </div>
                  <h3>{tool.name}</h3>
                  <p>{tool.purpose}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        {c.sections.testimonial && c.testimonial.quote && (
          <section className="v-testimonial v-section" aria-label="Testimonial">
            <div className="v-container" data-v-reveal>
              <svg
                className="v-quote-mark"
                viewBox="0 0 100 70"
                fill="none"
                aria-hidden="true"
              >
                <path d="M42 5C18 8 5 27 5 58h33V30H23c3-10 9-15 19-18V5Zm51 0C69 8 56 27 56 58h33V30H74c3-10 9-15 19-18V5Z" />
              </svg>
              <blockquote>
                <p>{c.testimonial.quote}</p>
                <footer>
                  <span className="v-dot" />
                  <div>
                    <cite>{c.testimonial.name}</cite>
                    <span>{c.testimonial.role}</span>
                  </div>
                </footer>
              </blockquote>
            </div>
          </section>
        )}

        <section
          id="contact"
          className="v-contact v-section"
          aria-labelledby="v-contact-title"
        >
          <div className="v-container">
            <Label number="06">The next chapter</Label>
            <div className="v-contact-heading" data-v-reveal>
              <h2 id="v-contact-title">{c.contact.heading}</h2>
              <a
                className="v-contact-orbit"
                href={`mailto:${c.contact.email}`}
                aria-label="Get in touch by email"
              >
                <OrbitMark />
                <Arrow />
              </a>
            </div>
            <div className="v-contact-grid">
              <div>
                <p className="v-body">{c.contact.subheading}</p>
                <a className="v-email" href={`mailto:${c.contact.email}`}>
                  {c.contact.email} <Arrow />
                </a>
                {c.contact.location && (
                  <p className="v-kicker v-contact-location">
                    Based in {c.contact.location}
                  </p>
                )}
              </div>
              {c.contact.formEnabled && contactReady && !preview && (
                <ContactForm />
              )}
              {c.contact.formEnabled && preview && (
                <p className="v-form-note">
                  Your contact form appears here when messaging is connected on
                  the published site. Visitors can always reach you by email.
                </p>
              )}
            </div>
          </div>
        </section>
      </main>
      <VisionaryFooter content={c} />
    </div>
  );
}
