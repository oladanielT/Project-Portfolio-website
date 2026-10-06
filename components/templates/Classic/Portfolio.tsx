import Image from "next/image";
import Link from "next/link";
import type { FormEvent } from "react";
import type { SiteContent, Project } from "@/lib/schema";
import Nav from "../../Nav";
import MotionScene from "./MotionScene";
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
  const footerLinks = ([
    ["#main-content", "Home", true],
    ["#about", "About", c.sections.about],
    ["#work", "Work", c.sections.work],
    ["#expertise", "Expertise", c.sections.expertise],
  ] as [string, string, boolean][]).filter(([, , visible]) => visible);
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const body = `${form.get("message")}\n\nFrom: ${form.get("name")} (${form.get("email")})\nCompany: ${form.get("company") || "-"}`;
    window.location.href = `mailto:${c.contact.email}?subject=${encodeURIComponent(String(form.get("subject")))}&body=${encodeURIComponent(body)}`;
  };
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
                {c.hero.eyebrow || "PRODUCT THINKING. HUMAN IMPACT."}
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
                  {c.hero.ctaLabel || "View my work"}
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
        {c.sections.testimonial && c.testimonials.length > 0 && (
          <section className="testimonial-section section-space classic-testimonials">
            <div className="page-width testimonial-list" data-count={c.testimonials.length} data-carousel={c.testimonials.length > 2 ? "true" : "false"} tabIndex={c.testimonials.length > 2 ? 0 : undefined} role={c.testimonials.length > 2 ? "region" : undefined} aria-label={c.testimonials.length > 2 ? "Client testimonials. Scroll horizontally to see more." : undefined}>
            {c.testimonials.map((testimonial, index) => <figure className="testimonial-inner" data-reveal key={index}>
              <p className="eyebrow">IN GOOD COMPANY</p>
              <span className="quote-mark" aria-hidden="true">
                “
              </span>
              <blockquote>{testimonial.quote}</blockquote>
              <figcaption>
                <span className="quote-avatar" aria-hidden="true">
                  {testimonial.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
                <div>
                  <strong>{testimonial.name}</strong>
                  <p>{testimonial.role}</p>
                </div>
              </figcaption>
            </figure>)}
            </div>
          </section>
        )}
        <section id="contact" className="contact-section classic-contact">
          <div className="page-width classic-contact-grid">
            <div className="classic-contact-intro" data-reveal>
              <Label n="/">LET&apos;S WORK TOGETHER</Label>
              <h2>{c.contact.heading}</h2>
              <p>{c.contact.subheading}</p>
              <a className="button button-light" href={`mailto:${c.contact.email}`}>
                Get in touch <Arrow />
              </a>
              {c.contact.location && <p className="classic-contact-location">{c.contact.location}</p>}
            </div>
            <form className="classic-mailto-form" onSubmit={handleSubmit} data-reveal>
              <div className="classic-form-row">
                <input name="name" type="text" placeholder="Name" required autoComplete="name" />
                <input name="email" type="email" placeholder="Email" required autoComplete="email" />
              </div>
              <input name="company" type="text" placeholder="Company / Organization" autoComplete="organization" />
              <input name="subject" type="text" placeholder="Subject / Service" required />
              <textarea name="message" placeholder="Message" rows={5} required />
              <button type="submit" className="button button-light">Send Message <Arrow /></button>
            </form>
          </div>
        </section>
        <footer className="classic-site-footer">
          <div className="page-width">
            <div className="classic-footer-grid">
              <div className="classic-footer-lead">
                <Label n="/">HAVE A PROJECT IN MIND?</Label>
                <h3>Let&apos;s make something meaningful.</h3>
                <a href={`mailto:${c.contact.email}`} className="button button-light">Get in touch <Arrow /></a>
              </div>
              <div className="classic-footer-column">
                <Label n="/">NAVIGATION</Label>
                {footerLinks.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
              </div>
              {c.expertise.length > 0 && (
                <div className="classic-footer-column">
                  <Label n="/">EXPERTISE</Label>
                  {c.expertise.slice(0, 5).map((item, index) => <span key={`${item.title}-${index}`}>{item.title}</span>)}
                </div>
              )}
              <div className="classic-footer-column">
                <Label n="/">CONTACT</Label>
                <a href={`mailto:${c.contact.email}`}>{c.contact.email}</a>
                {c.contact.location && <span>{c.contact.location}</span>}
                {c.contact.cv && <a href={c.contact.cv} target="_blank" rel="noreferrer">Download CV &darr;</a>}
                <div className="classic-footer-socials">
                  {[["GitHub", c.contact.github], ["LinkedIn", c.contact.linkedin], ["Instagram", c.contact.instagram], ["Facebook", c.contact.facebook], ["Twitter", c.contact.twitter]].filter(([, url]) => url).map(([label, url]) => (
                    <a key={label} href={url as string} target="_blank" rel="noreferrer">{label}</a>
                  ))}
                </div>
              </div>
            </div>
            <div className="classic-footer-bottom">
              <span>&copy; {new Date().getFullYear()} {c.hero.name}. All rights reserved.</span>
              <a href="#top">Back to top &uarr;</a>
            </div>
          </div>
        </footer>
      </main>
    </MotionScene>
  );
}
