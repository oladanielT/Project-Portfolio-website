"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "./Media";
import Link from "next/link";
import { defaultFaqs, type SiteContent } from "@/lib/schema";
import MotionScene from "./MotionScene";
import TemplateFooter from "../common/TemplateFooter";
import { Arrow, OrbitMark, VisionaryHeader } from "./Chrome";
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

function TestimonialsSlider({
  testimonials,
}: {
  testimonials: SiteContent["testimonials"];
}) {
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => {
    setActive((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const prev = useCallback(() => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  useEffect(() => {
    if (testimonials.length <= 1 || isPaused) return;
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length, isPaused, next]);

  if (!testimonials.length) return null;

  return (
    <div
      className="v-testimonial-slider"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Client Testimonials"
    >
      <div className="v-testimonial-stage">
        {testimonials.map((testimonial, index) => {
          const isActive = index === active;
          return (
            <blockquote
              key={index}
              className={`v-testimonial-slide ${isActive ? "is-active" : ""}`}
              aria-hidden={!isActive}
            >
              <p>{testimonial.quote}</p>
              <footer>
                <span className="v-dot" />
                <div>
                  <cite>{testimonial.name}</cite>
                  <span>{testimonial.role}</span>
                </div>
              </footer>
            </blockquote>
          );
        })}
      </div>

      {testimonials.length > 1 && (
        <div className="v-testimonial-controls">
          <button
            type="button"
            className="v-testimonial-arrow"
            onClick={prev}
            aria-label="Previous testimonial"
          >
            ←
          </button>
          <div className="v-testimonial-dots">
            {testimonials.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`v-testimonial-dot ${i === active ? "is-active" : ""}`}
                onClick={() => setActive(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                aria-current={i === active ? "true" : undefined}
              />
            ))}
          </div>
          <button
            type="button"
            className="v-testimonial-arrow"
            onClick={next}
            aria-label="Next testimonial"
          >
            →
          </button>
        </div>
      )}
    </div>
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
  const faqs = c.faqs && c.faqs.length > 0 ? c.faqs : defaultFaqs;

  return (
    <div
      ref={root}
      className={`visionary-wrapper v-site theme-${c.colorMode || "dark"}`}
      id="top"
      data-template="visionary"
      data-theme={c.colorMode || "dark"}
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
        {/* 1. HERO */}
        <section className="v-hero v-container" aria-labelledby="v-hero-title">
          <div className="v-hero-card">
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
                  <a className="v-button v-button-outline" href="#contact">
                    Get in touch <Arrow />
                  </a>
                )}
              </div>
              <a
                href={
                  showAbout ? "#about" : projects.length ? "#work" : "#contact"
                }
                className="v-kicker v-scroll-hint"
              >
                Scroll down <span aria-hidden="true">↓</span>
              </a>
            </div>

            <div className="v-hero-visual">
              {c.hero.photo ? (
                <Image
                  src={c.hero.photo}
                  alt={c.hero.name}
                  fill
                  priority
                  unoptimized
                  sizes="(max-width: 760px) 100vw, 50vw"
                  style={{ objectPosition: c.hero.photoPosition }}
                />
              ) : (
                <div className="v-hero-art v-art-no-photo" aria-hidden="true">
                  <div className="v-sculpture">
                    <div className="v-sculpture-spin">
                      <div className="v-ring v-ring-one" />
                      <div className="v-ring v-ring-two" />
                      <div className="v-ring v-ring-three" />
                      <div className="v-orb" />
                    </div>
                  </div>
                </div>
              )}
              <aside className="v-hero-badge">
                <p className="v-kicker">
                  <span className="v-pulse" aria-hidden="true" />
                  Available for freelance
                </p>
                <p>Let’s work together on your next project.</p>
                <a href="#contact" className="v-kicker">
                  Schedule a call <Arrow />
                </a>
              </aside>
            </div>
          </div>
        </section>

        {/* 2. ORGANIZATIONS / TRUSTED BY */}
        {c.sections.organizations && c.organizations.length > 0 && (
          <section className="v-organizations" aria-label="Organizations">
            <div className="v-container v-organizations-inner">
              <p className="v-kicker">Along the journey · Trusted by</p>
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

        {/* 3. ABOUT */}
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
                    View curriculum vitae <Arrow />
                  </a>
                )}
              </div>
            </div>
          </section>
        )}

        {/* 4. WORK / SELECTED PROJECTS */}
        {projects.length > 0 && (
          <section
            id="work"
            className="v-section v-container"
            aria-labelledby="v-work-title"
          >
            <Label number="03">Selected work</Label>
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
              {projects.map((project, i) => {
                const isFeatured = i === 0;
                return (
                  <article
                    className={`v-project ${isFeatured ? "v-project-featured" : ""}`}
                    key={project.slug}
                    data-v-reveal
                  >
                    <Link
                      href={`${preview ? "/admin/preview" : ""}/work/${project.slug}`}
                      className="v-project-link"
                      aria-label={`Explore the project: ${project.title}`}
                    >
                      <div className="v-project-image">
                        {project.cover ? (
                          <Image
                            src={project.cover}
                            alt={`${project.title} project preview`}
                            fill
                            unoptimized
                            sizes={
                              isFeatured
                                ? "(max-width: 900px) 100vw, 55vw"
                                : "(max-width: 760px) 90vw, 42vw"
                            }
                          />
                        ) : (
                          <div className="v-project-placeholder">
                            <OrbitMark variant={i} />
                            <span>{project.title}</span>
                          </div>
                        )}
                        <span className="v-project-index v-kicker">
                          {String(i + 1).padStart(2, "0")} /{" "}
                          {isFeatured ? "Featured project" : "Project"}
                        </span>
                        <span className="v-project-arrow">
                          <Arrow />
                        </span>
                      </div>
                    </Link>
                    <div className="v-project-content">
                      <div className="v-project-info">
                        <div>
                          <p className="v-kicker">{project.category}</p>
                          <h3>
                            <Link
                              href={`${preview ? "/admin/preview" : ""}/work/${project.slug}`}
                            >
                              {project.title}
                            </Link>
                          </h3>
                        </div>
                        {(project.role || project.org) && (
                          <p className="v-project-role">
                            {project.org ? `${project.org} · ` : ""}
                            {project.role}
                          </p>
                        )}
                      </div>
                      <p className="v-project-description">
                        {project.description}
                      </p>
                      {project.stats && project.stats.length > 0 && (
                        <ul className="v-project-results">
                          {(isFeatured
                            ? project.stats.slice(0, 3)
                            : project.stats.slice(0, 2)
                          ).map((stat, index) => (
                            <li key={index}>
                              <span aria-hidden="true">↗</span>
                              <span>{stat}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      <div className="v-project-cta">
                        <Link
                          className="v-button"
                          href={`${preview ? "/admin/preview" : ""}/work/${project.slug}`}
                        >
                          Read case study <Arrow />
                        </Link>
                        {project.caseStudyUrl && (
                          <a
                            className="v-text-link"
                            href={project.caseStudyUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Live preview ↗
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {/* 5. SERVICES / EXPERTISE */}
        {c.sections.expertise &&
          (expertise.length > 0 || (c.skills && c.skills.length > 0)) && (
            <section
              id="services"
              className="v-services v-section"
              aria-labelledby="v-services-title"
            >
              <div
                id="expertise"
                style={{ position: "relative", top: "-120px" }}
              />
              <div className="v-container">
                <Label number="04">Focus areas</Label>
                <div className="v-section-heading" data-v-reveal>
                  <h2 id="v-services-title">
                    Where vision
                    <br />
                    meets <em>practice.</em>
                  </h2>
                  <p>
                    Specialized skill sets and capabilities behind the work.
                  </p>
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
                        {"skills" in item &&
                          item.skills &&
                          item.skills.length > 0 && (
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
                {c.skills && c.skills.length > 0 && (
                  <div className="v-additional-skills" data-v-reveal>
                    <p className="v-kicker">Skills in practice</p>
                    <ul className="v-tags">
                      {c.skills.map((skill, i) => (
                        <li key={i}>{skill}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          )}

        {/* 6. PROCESS */}
        {c.sections.process && c.process.length > 0 && (
          <section
            id="process"
            className="v-process v-section"
            aria-labelledby="v-process-title"
          >
            <div className="v-container">
              <Label number="05">The process</Label>
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

        {/* 7. TOOLS */}
        {c.sections.tools && c.tools.length > 0 && (
          <section
            id="tools"
            className="v-section v-container v-tools"
            aria-labelledby="v-tools-title"
          >
            <Label number="06">The toolkit</Label>
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

        {/* 8. TESTIMONIALS */}
        {c.sections.testimonial && c.testimonials.length > 0 && (
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
              <TestimonialsSlider testimonials={c.testimonials} />
            </div>
          </section>
        )}

        {/* 9. FAQS */}
        {c.sections.faqs && faqs.length > 0 && (
          <section
            id="faqs"
            className="v-section v-container v-faqs"
            aria-labelledby="v-faqs-title"
          >
            <Label number="07">Inquiries &amp; Clarity</Label>
            <div className="v-section-heading" data-v-reveal>
              <h2 id="v-faqs-title">
                Common <em>questions.</em>
              </h2>
              <p>Everything you might want to know before reaching out.</p>
            </div>
            <div className="v-faqs-list" data-v-reveal>
              {faqs.map((faq, i) => (
                <details key={i} className="v-faq-item" open={i === 0}>
                  <summary className="v-faq-question">
                    <span>{faq.question}</span>
                    <span className="v-faq-icon">+</span>
                  </summary>
                  <div className="v-faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* 11. FOOTER */}
      <TemplateFooter content={c} templateVariant="visionary" />
    </div>
  );
}