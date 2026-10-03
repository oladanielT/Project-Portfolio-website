import Image from "next/image";
import Link from "next/link";
import type { SiteContent, Project } from "@/lib/schema";
import Nav from "../../Nav";
import MotionScene from "./MotionScene";
import ContactForm from "../../ContactForm";
const Arrow = () => <span aria-hidden="true">↗</span>;
function Label({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <p className="section-label">
      <span>{n}</span>
      {children}
    </p>
  );
}
export function ProjectCard({
  project,
  index,
  featured = false,
  preview = false,
}: {
  project: Project;
  index: number;
  featured?: boolean;
  preview?: boolean;
}) {
  return (
    <article
      className={`work-card ${featured ? "featured-work" : ""}`}
      data-reveal
    >
      <Link
        className="work-image"
        href={`${preview ? "/admin/preview" : ""}/work/${project.slug}`}
        aria-label={`Explore ${project.title}`}
      >
        <span className="work-index">
          SELECTED WORK / {String(index + 1).padStart(2, "0")}
        </span>
        {project.cover && (
          <Image
            src={project.cover}
            alt={`${project.title} project`}
            fill
            sizes={
              featured
                ? "(min-width: 1000px) 65vw, 100vw"
                : "(min-width: 700px) 45vw, 100vw"
            }
            unoptimized
          />
        )}
        <span className="work-open" aria-hidden="true">
          ↗
        </span>
      </Link>
      <div className="work-copy">
        <p className="eyebrow">{project.category}</p>
        <Link href={`${preview ? "/admin/preview" : ""}/work/${project.slug}`}>
          <h3>{project.title}</h3>
        </Link>
        <p className="work-description">{project.description}</p>
        <div className="work-outcomes">
          {project.stats.slice(0, 3).map((stat) => {
            const metric = !featured && stat.match(/^(\d[\d,+]*)(.*)$/);
            return metric ? (
              <p className="metric-outcome" key={stat}>
                <strong>{metric[1]}</strong>
                <span>{metric[2]}</span>
              </p>
            ) : (
              <p key={stat}>
                <span aria-hidden="true">↗</span>
                {stat}
              </p>
            );
          })}
        </div>
        <Link
          className="text-link"
          href={`${preview ? "/admin/preview" : ""}/work/${project.slug}`}
        >
          Explore the project <Arrow />
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
  const name = c.hero.name.split(" ");
  const projects = [...c.projects].sort(
    (a, b) => Number(b.featured) - Number(a.featured),
  );
  return (
    <MotionScene>
      <main id="top">
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <Nav name={c.hero.name} sections={c.sections} />
        {preview && (
          <div className="preview-banner">
            Draft preview · Only visible to you{" "}
            <Link href="/admin">Back to editor ↗</Link>
          </div>
        )}
        <section className="editorial-hero" id="main-content">
          {(!c.template || c.template === "elegant" || c.template === "visionary") && (
            <>
              <div className="hero-wash" aria-hidden="true" />
              <div className="hero-orbit" aria-hidden="true" />
            </>
          )}
          {c.template === "architect" && (
            <div className="architect-trapezium" aria-hidden="true" />
          )}
          <div className="page-width hero-grid">
            <div className="hero-copy">
              <p className="eyebrow hero-enter">
                <span className="little-star" aria-hidden="true">
                  ✳
                </span>{" "}
                PRODUCT THINKING. HUMAN IMPACT.
              </p>
              <p className="hero-meet hero-enter">Hello, I’m</p>
              <h1 className="hero-name hero-enter">
                <span>{name[0]}</span>
                <span className="hero-name-rest">
                  <em>{name[1]}</em> {name.slice(2).join(" ")}
                </span>
              </h1>
              <p className="hero-role hero-enter">{c.hero.title}</p>
              <p className="hero-intro hero-enter">{c.hero.intro}</p>
              <div className="hero-actions hero-enter">
                <a
                  href={c.sections.work ? "#work" : "#contact"}
                  className="button button-primary"
                >
                  {c.hero.ctaLabel}
                  <Arrow />
                </a>
                <a className="quiet-link" href="#contact">
                  Let’s connect <Arrow />
                </a>
              </div>
            </div>
            <div className="hero-portrait">
              <div className="portrait-outline" aria-hidden="true" />
              <div className="portrait-frame">
                {c.hero.photo && (
                  <Image
                    src={c.hero.photo}
                    alt={c.hero.name}
                    style={{ objectPosition: c.hero.photoPosition }}
                    fill
                    priority
                    unoptimized
                    sizes="(min-width: 900px) 40vw, 90vw"
                  />
                )}
              </div>
              <div className="portrait-note">
                <span className="note-star" aria-hidden="true">
                  ✳
                </span>
                <span>
                  Bringing clarity.
                  <br />
                  <em>Moving ideas forward.</em>
                </span>
              </div>
              <p className="portrait-caption">
                {c.hero.eyebrow}
                <span>01 /</span>
              </p>
            </div>
          </div>
          <div className="page-width hero-bottom">
            <span>
              {c.contact.location} <span className="tiny-dot" /> Working across
              products & operations
            </span>
            <a href={c.sections.about ? "#about" : "#contact"}>
              A little further down <span aria-hidden="true">↓</span>
            </a>
          </div>
        </section>
        {c.sections.organizations && c.organizations.length > 0 && (
          <section className="organizations">
            <div className="page-width organizations-inner">
              <p className="eyebrow">
                EXPERIENCE ACROSS
                <br />
                AMBITIOUS TEAMS
              </p>
              <div className="organization-list">
                {c.organizations.map((o) => (
                  <div key={o.name}>
                    <span className="organization-name">{o.name}</span>
                    <span>{o.detail}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
        {c.sections.about && (
          <section id="about" className="section-space about-section">
            <div className="page-width about-grid">
              <div className="about-visual" data-reveal>
                <div className="about-photo">
                  {c.about.photo && (
                    <Image
                      src={c.about.photo}
                      alt={`${c.hero.name}, product and operations professional`}
                      style={{ objectPosition: c.about.photoPosition }}
                      fill
                      unoptimized
                      sizes="(min-width: 900px) 40vw, 90vw"
                    />
                  )}
                </div>
                <div className="about-photo-label">
                  <span>A little strategy.</span>
                  <em>A lot of intention.</em>
                </div>
                <span className="about-spark" aria-hidden="true">
                  ✳
                </span>
              </div>
              <div className="about-copy" data-reveal>
                <Label n="01 /">THE PERSON</Label>
                <h2>{c.about.heading}</h2>
                {c.about.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
                <div className="about-signoff">
                  <span className="signature">{name[1] || name[0]}.</span>
                  <span>PRODUCTS. PEOPLE. POSSIBILITIES.</span>
                </div>
              </div>
            </div>
          </section>
        )}
        {c.sections.work && (
          <section id="work" className="projects-section section-space">
            <div className="page-width">
              <div className="section-heading" data-reveal>
                <div>
                  <Label n="02 /">THE WORK</Label>
                  <h2>
                    Ideas, brought
                    <br />
                    <em>into the world.</em>
                  </h2>
                </div>
                <p>
                  A closer look at the products,
                  <br />
                  the process, and the progress.
                </p>
              </div>
              <div className="work-grid">
                {projects.map((p, i) => (
                  <ProjectCard
                    key={p.slug}
                    project={p}
                    index={i}
                    featured={i === 0}
                    preview={preview}
                  />
                ))}
              </div>
            </div>
          </section>
        )}
        {c.sections.expertise && (
          <section id="expertise" className="expertise-section section-space">
            <div className="page-width">
              <div className="section-heading" data-reveal>
                <div>
                  <Label n="03 /">THE EXPERTISE</Label>
                  <h2>
                    Good ideas need
                    <br />
                    <em>a way forward.</em>
                  </h2>
                </div>
                <p>I connect the thinking with the doing.</p>
              </div>
              <div className="expertise-grid">
                {c.expertise.map((e, i) => (
                  <article className="expertise-card" key={i} data-reveal>
                    <span className="expertise-symbol" aria-hidden="true">
                      {["◎", "↗", "✳"][i % 3]}
                    </span>
                    <span className="eyebrow expertise-number">0{i + 1}</span>
                    <h3>{e.title}</h3>
                    <p>{e.description}</p>
                    <ul>
                      {e.skills.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}
        {c.sections.process && c.process.length > 0 && (
          <section className="process-section section-space">
            <div className="page-width">
              <Label n="04 /">HOW I WORK</Label>
              <h2 className="section-title">
                From possibility <em>to progress.</em>
              </h2>
              <div className="process-grid">
                {c.process.map((p, i) => (
                  <article key={i} data-reveal>
                    <span className="process-number">0{i + 1}</span>
                    <h3>{p.title}</h3>
                    <p>{p.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}
        {c.sections.tools && c.tools.length > 0 && (
          <section className="tools-section section-space">
            <div className="page-width">
              <Label n="/">THE TOOLKIT</Label>
              <h2 className="section-title">
                Tools that support <em>the work.</em>
              </h2>
              <div className="tools-grid">
                {c.tools?.map((t) => (
                  <div className="tool-card" key={t.name} data-reveal>
                    {t.logo ? (
                      <Image
                        src={t.logo}
                        alt=""
                        width={36}
                        height={36}
                        unoptimized
                      />
                    ) : (
                      <span aria-hidden="true">{t.name.slice(0, 1)}</span>
                    )}
                    <div>
                      <h3>{t.name}</h3>
                      <p>{t.purpose}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
        {c.sections.testimonial && c.testimonial.quote && (
          <section className="testimonial-section section-space">
            <figure className="page-width testimonial-inner" data-reveal>
              <p className="eyebrow">IN GOOD COMPANY</p>
              <span className="quote-mark" aria-hidden="true">
                “
              </span>
              <blockquote>{c.testimonial.quote}</blockquote>
              <figcaption>
                <span className="quote-avatar" aria-hidden="true">
                  {c.testimonial.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
                <div>
                  <strong>{c.testimonial.name}</strong>
                  <p>{c.testimonial.role}</p>
                </div>
              </figcaption>
            </figure>
          </section>
        )}
        <section id="contact" className="contact-section">
          <div className="contact-orbit" aria-hidden="true" />
          <div className="page-width">
            <div className="contact-top" data-reveal>
              <Label n="/">WHAT’S NEXT?</Label>
              <h2>{c.contact.heading}</h2>
              <p>{c.contact.subheading}</p>
              <a
                className="button button-light"
                href={`mailto:${c.contact.email}`}
              >
                Let’s make it happen <Arrow />
              </a>
            </div>
            <div className="contact-details">
              <a href={`mailto:${c.contact.email}`}>{c.contact.email}</a>
              <div>
                {c.contact.github && (
                  <a href={c.contact.github} target="_blank" rel="noreferrer">
                    GitHub ↗
                  </a>
                )}
                {c.contact.linkedin && (
                  <a href={c.contact.linkedin} target="_blank" rel="noreferrer">
                    LinkedIn ↗
                  </a>
                )}
                {c.contact.instagram && (
                  <a href={c.contact.instagram} target="_blank" rel="noreferrer">
                    Instagram ↗
                  </a>
                )}
                {c.contact.facebook && (
                  <a href={c.contact.facebook} target="_blank" rel="noreferrer">
                    Facebook ↗
                  </a>
                )}
                {c.contact.twitter && (
                  <a href={c.contact.twitter} target="_blank" rel="noreferrer">
                    Twitter ↗
                  </a>
                )}
                {c.contact.cv && (
                  <a href={c.contact.cv} target="_blank" rel="noreferrer">
                    Download CV ↓
                  </a>
                )}
              </div>
            </div>
            {c.contact.formEnabled && contactReady && !preview && (
              <ContactForm />
            )}
            <footer className="site-footer">
              <a href="#top" className="footer-brand">
                {name[0]}
                <em>.</em>
              </a>
              <span>
                © {new Date().getFullYear()} {c.hero.name}
              </span>
              <a href="#top">Back to top ↑</a>
            </footer>
          </div>
        </section>
      </main>
    </MotionScene>
  );
}
