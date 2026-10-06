"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { defaultFaqs, type SiteContent } from "@/lib/schema";
import MotionScene from "./MotionScene";
import TemplateFooter from "../common/TemplateFooter";
import "./styles.css";

const SvgShapes = () => (
  <div className="svg-design-system" aria-hidden="true">
    <svg className="svg-shape shape-a glowing" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="100" fill="url(#grad1)" />
      <defs>
        <radialGradient id="grad1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
    <svg className="svg-shape shape-b" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <polygon points="50,0 200,0 150,200 0,200" />
    </svg>
    <svg className="svg-shape shape-c glowing" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="20" width="160" height="160" rx="40" transform="rotate(25 100 100)" fill="url(#grad2)" />
      <defs>
        <radialGradient id="grad2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  </div>
);

export default function Portfolio({
  content: c,
  contactReady,
  preview = false,
}: {
  content: SiteContent;
  contactReady: boolean;
  preview?: boolean;
}) {
  const projects = c.sections.work ? c.projects || [] : [];
  const faqs = (c.faqs && c.faqs.length > 0) ? c.faqs : defaultFaqs;

  const onSubmitContact = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = f.get("name") || "";
    const email = f.get("email") || "";
    const subject = f.get("subject") || `Project inquiry from ${name}`;
    const message = f.get("message") || "";
    const body = `${message}\n\nName: ${name}\nEmail: ${email}`;
    window.location.href = `mailto:${c.contact.email}?subject=${encodeURIComponent(String(subject))}&body=${encodeURIComponent(String(body))}`;
  };

  const navLinks = [
    { href: "#hero", label: "Home" },
    ...(c.sections.about ? [{ href: "#about", label: "About" }] : []),
    ...(c.sections.work && projects.length > 0 ? [{ href: "#work", label: "Work" }] : []),
    ...(c.sections.expertise && c.expertise?.length > 0 ? [{ href: "#services", label: "Services" }] : []),
    ...(c.sections.process && c.process?.length > 0 ? [{ href: "#process", label: "Process" }] : []),
    ...(c.sections.tools && c.tools?.length > 0 ? [{ href: "#tools", label: "Tools" }] : []),
    ...(c.sections.faqs && faqs.length > 0 ? [{ href: "#faqs", label: "FAQs" }] : []),
    { href: "#contact", label: "Contact" },
  ];

  return (
    <div className={`architect-wrapper theme-${c.colorMode || "light"}`} data-template="architect" data-theme={c.colorMode || "light"}>
      <MotionScene />
      <SvgShapes />

      {/* 0. NAVBAR */}
      <nav className="site-nav" aria-label="Main Navigation">
        <div className="nav-left">
          <Link href="#hero" className="brand-logo">
            <span className="name-full">{c.hero.name}</span>
            <span className="name-short">{c.hero.name.split(" ")[0]}</span>
          </Link>
        </div>
        <div className="nav-center">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </div>
        <div className="nav-right">
          <Link href="#contact" className="btn-primary btn-small">Let&apos;s Talk</Link>
        </div>
      </nav>

      <main id="main-content">
        {/* 1. HERO */}
        <section id="hero" className="hero-section">
          <div className="hero-content">
            {c.hero.eyebrow && (
              <span className="section-eyebrow" style={{ marginBottom: "0.75rem", display: "inline-block" }}>
                {c.hero.eyebrow}
              </span>
            )}
            <h1 className="hero-title">{c.hero.name}</h1>
            {c.hero.title && <p className="hero-subtitle-text">{c.hero.title}</p>}
            <p className="hero-intro">{c.hero.intro}</p>
            <div className="hero-actions">
              <Link href="#work" className="btn-primary">{c.hero.ctaLabel || "Explore Work"}</Link>
              <Link href="#contact" className="btn-secondary">Contact Us</Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-image-mask">
              {c.hero.photo && (
                <Image
                  src={c.hero.photo}
                  alt={c.hero.name}
                  fill
                  priority
                  unoptimized
                  className="obj-cover"
                  style={{ objectPosition: c.hero.photoPosition || "center" }}
                />
              )}
            </div>
          </div>
        </section>

        {/* 2. ORGANIZATIONS / TRUSTED BY */}
        {c.sections.organizations && c.organizations && c.organizations.length > 0 && (
          <section id="organizations" className="partners-section w-full">
            <div className="partners-header w-full max-w-7xl mx-auto">
              <span className="section-eyebrow text-center">TRUSTED COLLABORATIONS</span>
              <h2 className="section-title text-center">Organizations I&apos;ve Worked With</h2>
            </div>
            <div className="architect-orgs-grid">
              {c.organizations.map((org, i) => (
                <div key={i} className="architect-org-card">
                  <span className="org-mark">⊛</span>
                  <div className="org-details">
                    <strong className="org-name">{org.name}</strong>
                    {org.detail && <span className="org-detail">{org.detail}</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 3. ABOUT */}
        {c.sections.about && (
          <section id="about" className="about-section">
            <div className="about-bg-shape"></div>
            <div className="about-visual">
              <div className="about-image-frame">
                {c.about.photo && (
                  <Image
                    src={c.about.photo}
                    alt="About"
                    fill
                    unoptimized
                    className="obj-cover"
                    style={{ objectPosition: c.about.photoPosition || "center" }}
                  />
                )}
              </div>
            </div>
            <div className="about-content">
              <span className="section-eyebrow">ABOUT ME</span>
              <h2 className="section-title">{c.about.heading || "Who we are"}</h2>
              <div className="about-text">
                {c.about.paragraphs?.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              {c.about.stat?.value && (
                <div className="about-stat">
                  <span className="stat-value">{c.about.stat.value}</span>
                  <span className="stat-label">{c.about.stat.label}</span>
                </div>
              )}
            </div>
          </section>
        )}

        {/* 4. WORK / PROJECTS */}
        {c.sections.work && projects.length > 0 && (
          <section id="work" className="work-section">
            <div className="work-header">
              <span className="section-eyebrow">OUR PORTFOLIO</span>
              <h2 className="section-title">Selected Work</h2>
              <p className="section-desc">A showcase of our most recent and impactful projects.</p>
            </div>
            <div className="work-grid">
              {projects.map((p) => (
                <Link
                  key={p.slug}
                  href={`${preview ? "/admin/preview" : ""}/work/${p.slug}`}
                  className="work-card"
                >
                  <div className="work-card-image">
                    {p.cover && <Image src={p.cover} alt={p.title} fill unoptimized className="obj-cover" />}
                  </div>
                  <div className="work-card-content">
                    <span className="work-category">{p.category || p.role}</span>
                    <h3 className="work-title">{p.title}</h3>
                    <p className="work-desc">{p.description}</p>
                    <span className="work-cta">View Case Study &rarr;</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 5. SERVICES / EXPERTISE */}
        {c.sections.expertise && c.expertise && c.expertise.length > 0 && (
          <section id="services" className="expertise-section pb-6">
            <div className="work-header text-center">
              <span className="section-eyebrow">STRATEGY &amp; EXPERTISE</span>
              <h2 className="section-title">Services &amp; Capabilities</h2>
              <p className="section-desc text-center  ">Connecting user needs, business goals, and practical execution.</p>
            </div>
            <div className="architect-services-grid ">
              {c.expertise.map((exp, i) => (
                <div key={i} className="architect-service-card">
                  <div className="service-header-row">
                    <span className="service-number">0{i + 1}</span>
                    <h3 className="service-title">{exp.title}</h3>
                  </div>
                  <p className="service-desc">{exp.description}</p>
                  {exp.skills && exp.skills.length > 0 && (
                    <div className="service-skills">
                      {exp.skills.map((s, j) => (
                        <span key={j} className="skill-pill">{s}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 6. PROCESS */}
        {c.sections.process && c.process && c.process.length > 0 && (
          <section id="process" className="architect-process-section">
            <div className="work-header text-center">
              <span className="section-eyebrow">METHODOLOGY</span>
              <h2 className="section-title">How I Work</h2>
              <p className="section-desc text-center">A structured approach from discovery to sprint delivery.</p>
            </div>
            <div className="architect-process-grid">
              {c.process.map((step, i) => (
                <div key={i} className="architect-process-card">
                  <div className="process-step-badge">STEP 0{i + 1}</div>
                  <h3 className="process-title">{step.title}</h3>
                  <p className="process-desc">{step.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 7. TOOLS / PRODUCTIVITY STACK */}
        {c.sections.tools && c.tools && c.tools.length > 0 && (
          <section id="tools" className="partners-section">
            <div className="partners-header">
              <span className="section-eyebrow">PRODUCTIVITY STACK</span>
              <h2 className="section-title text-center">Tools &amp; Infrastructure</h2>
            </div>
            <div className="architect-tools-grid">
              {c.tools.map((tool, i) => (
                <div key={`tool-${i}`} className="architect-tool-card">
                  <div className="tool-icon-wrapper">
                    {tool.logo ? (
                      <img src={tool.logo} alt={tool.name} className="partner-img" />
                    ) : (
                      <span className="tool-initial-fallback">{tool.name.slice(0, 2)}</span>
                    )}
                  </div>
                  <span className="tool-name-label">{tool.name}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 8. TESTIMONIALS */}
        {c.sections.testimonial && c.testimonials && c.testimonials.length > 0 && (
          <section id="testimonials" className="testimonials-section">
            <div className="work-header text-center">
              <span className="section-eyebrow">ENDORSEMENTS</span>
              <h2 className="section-title">What Collaborators Say</h2>
            </div>
            <div className="testimonials-carousel">
              <div className="testimonials-track centered gap-4">
                {c.testimonials.map((testimonial, index) => (
                  <div className="testimonial-card-large" key={index}>
                    <p className="quote-mark">“</p>
                    <p className="quote-text">{testimonial.quote}</p>
                    <div className="quote-author">
                      <div className="author-info">
                        <h4>{testimonial.name}</h4>
                        <span>{testimonial.role}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 9. FAQS */}
        {c.sections.faqs && faqs.length > 0 && (
          <section id="faqs" className="architect-faqs-section">
            <div className="work-header text-center">
              <span className="section-eyebrow">QUESTIONS &amp; ANSWERS</span>
              <h2 className="section-title">Frequently Asked Questions</h2>
            </div>
            <div className="architect-faq-list">
              {faqs.map((f, i) => (
                <details key={i} className="architect-faq-item" open={i === 0}>
                  <summary className="architect-faq-question">
                    <span>{f.question}</span>
                    <span className="faq-toggle-icon">+</span>
                  </summary>
                  <div className="architect-faq-answer">
                    <p>{f.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* 10. CONTACT */}
        <section id="contact" className="contact-section">
          <div className="contact-content">
            <span className="section-eyebrow">CONNECT</span>
            <h2 className="section-title">Let&apos;s Work Together</h2>
            <p className="contact-desc">
              {c.contact.subheading || "Ready to start your next big project? Reach out to us."}
            </p>
            <div className="contact-meta-info" style={{ marginTop: "1.5rem" }}>
              <p><strong>Email:</strong> {c.contact.email}</p>
              {c.contact.location && <p><strong>Location:</strong> {c.contact.location}</p>}
            </div>
          </div>
          <div className="contact-form-container">
            <form className="premium-form" onSubmit={onSubmitContact}>
              <div className="form-row">
                <input name="name" type="text" placeholder="Your Name *" required />
                <input name="email" type="email" placeholder="Email Address *" required />
              </div>
              <input name="subject" type="text" placeholder="Subject / Service" />
              <textarea name="message" placeholder="Tell me about your project *" rows={5} required></textarea>
              <button type="submit" className="btn-primary btn-large">Send Message &rarr;</button>
            </form>
          </div>
        </section>
      </main>

      {/* 11. GOLD STANDARD REAL FOOTER */}
      <TemplateFooter
        content={c}
        links={navLinks}
        templateVariant="architect"
      />
    </div>
  );
}
