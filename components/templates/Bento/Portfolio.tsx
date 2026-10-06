"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { defaultFaqs, type SiteContent } from "@/lib/schema";
import MotionScene from "./MotionScene";
import TemplateFooter from "../common/TemplateFooter";
import ContactForm from "@/components/ContactForm";
import "./styles.css";

const Arrow = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M4.5 2.5H12.5V10.5M12.5 2.5L2.5 12.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
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

  const navLinks = [
    { href: "#hero", label: "Home" },
    ...(c.sections.organizations && c.organizations?.length > 0 ? [{ href: "#organizations", label: "Partners" }] : []),
    ...(c.sections.about ? [{ href: "#about", label: "About" }] : []),
    ...(c.sections.work && projects.length > 0 ? [{ href: "#work", label: "Work" }] : []),
    ...(c.sections.expertise && c.expertise?.length > 0 ? [{ href: "#services", label: "Services" }] : []),
    ...(c.sections.process && c.process?.length > 0 ? [{ href: "#process", label: "Process" }] : []),
    ...(c.sections.tools && c.tools?.length > 0 ? [{ href: "#tools", label: "Toolkit" }] : []),
    ...(c.sections.testimonial && c.testimonials?.length > 0 ? [{ href: "#testimonials", label: "Reviews" }] : []),
    ...(c.sections.faqs && faqs.length > 0 ? [{ href: "#faqs", label: "FAQs" }] : []),
    { href: "#contact", label: "Contact" },
  ];

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="bento-wrapper" data-template="bento" data-theme={c.colorMode || "light"}>
      <MotionScene />
      
      {/* 0. HEADER / NAVBAR */}
      <header className="bento-header" id="top">
        <div className="bento-header-inner">
          <Link href="#top" className="bento-brand">
            <span className="bento-brand-dot">●</span>
            <strong>{c.hero.name}</strong>
          </Link>
          <nav className="bento-nav-links" aria-label="Main Navigation">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="bento-nav-item">
                {l.label}
              </a>
            ))}
          </nav>
          <div className="bento-header-actions">
            <a href="#contact" className="bento-cta-btn bento-cta-desktop">
              Let&apos;s Talk <Arrow />
            </a>
            <button
              type="button"
              className={`bento-burger ${mobileMenuOpen ? "is-active" : ""}`}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>

        {/* Mobile Expandable Bento Drawer */}
        {mobileMenuOpen && (
          <div className="bento-mobile-drawer">
            <div className="bento-mobile-nav-grid">
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="bento-mobile-nav-item"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="bento-mobile-nav-bullet">✦</span>
                  <span>{l.label}</span>
                </a>
              ))}
            </div>
            <a
              href="#contact"
              className="bento-button bento-btn-primary bento-mobile-cta"
              onClick={() => setMobileMenuOpen(false)}
            >
              Let&apos;s Talk <Arrow />
            </a>
          </div>
        )}
      </header>

      {/* BENTO GRID MAIN CONTAINER */}
      <main className="bento-container" id="main-content">
        
        {/* 1. HERO CARDS */}
        <div id="hero" className="bento-card bento-hero-intro bento-reveal">
          {c.hero.eyebrow && (
            <span className="bento-pill-tag">
              👋 {c.hero.eyebrow}
            </span>
          )}
          <h1 className="bento-hero-name">
            {c.hero.name}
          </h1>
          {c.hero.title && (
            <h2 className="bento-hero-title">{c.hero.title}</h2>
          )}
          <p className="bento-hero-desc">
            {c.hero.intro}
          </p>
          <div className="bento-hero-actions">
            <a href="#work" className="bento-button bento-btn-primary">
              {c.hero.ctaLabel || "Selected Work"} <Arrow />
            </a>
            <a href="#contact" className="bento-button bento-btn-secondary">
              Get in touch
            </a>
          </div>
        </div>

        <div className="bento-card bento-hero-portrait bento-reveal">
          {c.hero.photo ? (
            <Image
              src={c.hero.photo}
              alt={c.hero.name}
              style={{ objectPosition: c.hero.photoPosition || "center", objectFit: "cover" }}
              fill
              unoptimized
            />
          ) : (
            <div className="bento-portrait-fallback">
              <span>{c.hero.name.charAt(0)}</span>
            </div>
          )}
          <div className="bento-portrait-badge">
            <span className="pulse-dot"></span> Available for work
          </div>
        </div>

        {/* Hero Quick Stat Widgets */}
        <div className="bento-card bento-stat-card bento-stat-accent bento-reveal">
          <h3 className="bento-stat-value">{projects.length}+</h3>
          <p className="bento-stat-label">Projects Delivered</p>
        </div>

        <div className="bento-card bento-stat-card bento-reveal">
          <span className="bento-stat-icon">📍</span>
          <h3 className="bento-stat-subvalue">{c.contact.location || "Remote"}</h3>
          <p className="bento-stat-label">Current Base</p>
        </div>

        <a href="#contact" className="bento-card bento-stat-card bento-stat-clickable bento-reveal">
          <span className="bento-stat-icon">⚡</span>
          <h3 className="bento-stat-subvalue">Ready to Collaborate</h3>
          <p className="bento-stat-label">Start a new project &rarr;</p>
        </a>

        {/* 2. ORGANIZATIONS / TRUSTED BY */}
        {c.sections.organizations && c.organizations && c.organizations.length > 0 && (
          <div id="organizations" className="bento-card bento-full-width bento-reveal">
            <div className="bento-card-header">
              <span className="bento-section-label">PARTNERSHIPS</span>
              <h2>Trusted By Leading Organizations</h2>
            </div>
            <div className="bento-orgs-grid">
              {c.organizations.map((org, i) => (
                <div key={i} className="bento-org-item">
                  <span className="bento-org-icon">⊛</span>
                  <div>
                    <strong className="bento-org-name">{org.name}</strong>
                    {org.detail && <p className="bento-org-detail">{org.detail}</p>}
                  </div>
                  {org.url && (
                    <a href={org.url} target="_blank" rel="noreferrer" className="bento-org-link">
                      <Arrow />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. ABOUT ME */}
        {c.sections.about && (
          <div id="about" className="bento-card bento-full-width bento-reveal">
            <div className="bento-card-header">
              <span className="bento-section-label">ABOUT ME</span>
              <h2>{c.about?.heading || "The person behind the process"}</h2>
            </div>
            <div className="bento-about-layout">
              <div className="bento-about-paragraphs">
                {c.about?.paragraphs?.map((p, i) => (
                  <p key={i} className="bento-body-text">{p}</p>
                ))}
              </div>
              {c.about?.stat?.value && (
                <div className="bento-about-stat-box">
                  <span className="bento-big-stat">{c.about.stat.value}</span>
                  <span className="bento-big-label">{c.about.stat.label}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 4. WORK / PROJECTS */}
        {c.sections.work && projects.length > 0 && (
          <>
            <div id="work" className="bento-card bento-full-width bento-section-title-card bento-reveal">
              <span className="bento-section-label">PORTFOLIO</span>
              <h2>Selected Case Studies &amp; Projects</h2>
              <p className="bento-card-subtitle">Hands-on delivery across tech, logistics, and digital products.</p>
            </div>

            {projects.map((p, i) => (
              <Link
                key={p.slug}
                href={`${preview ? "/admin/preview" : ""}/work/${p.slug}`}
                className={`bento-card bento-work-card bento-reveal ${i === 0 ? "featured" : ""}`}
              >
                {p.cover ? (
                  <Image
                    src={p.cover}
                    alt={p.title}
                    fill
                    unoptimized
                    style={{ objectFit: "cover" }}
                    className="bento-work-img"
                  />
                ) : (
                  <div className="bento-work-fallback">
                    <div className="bento-fallback-badge">
                      <span className="bento-fallback-glyph">❖</span>
                      <span>{p.category || "Selected Work"}</span>
                    </div>
                  </div>
                )}
                <div className="bento-work-info">
                  <div className="bento-work-meta">
                    <span className="bento-tag">{p.category}</span>
                    <span className="bento-work-arrow"><Arrow /></span>
                  </div>
                  <h3 className="bento-work-title">{p.title}</h3>
                  <p className="bento-work-snippet">{p.description}</p>
                  {p.stats && p.stats.length > 0 && (
                    <div className="bento-work-stats">
                      {p.stats.slice(0, 2).map((stat, idx) => (
                        <span key={idx} className="bento-work-stat-pill">
                          ↗ {stat}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </>
        )}

        {/* 5. SERVICES / EXPERTISE */}
        {c.sections.expertise && c.expertise && c.expertise.length > 0 && (
          <div id="services" className="bento-card bento-full-width bento-reveal">
            <div className="bento-card-header">
              <span className="bento-section-label">SERVICES &amp; EXPERTISE</span>
              <h2>Areas of Focus &amp; Capabilities</h2>
            </div>
            <div className="bento-services-grid">
              {c.expertise.map((exp, i) => (
                <div key={i} className="bento-service-card">
                  <span className="bento-service-badge">0{i + 1}</span>
                  <h3>{exp.title}</h3>
                  <p>{exp.description}</p>
                  {exp.skills && exp.skills.length > 0 && (
                    <div className="bento-skill-pills">
                      {exp.skills.map((s, j) => (
                        <span key={j} className="bento-pill">{s}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. PROCESS */}
        {c.sections.process && c.process && c.process.length > 0 && (
          <div id="process" className="bento-card bento-full-width bento-reveal">
            <div className="bento-card-header">
              <span className="bento-section-label">METHODOLOGY</span>
              <h2>How I Deliver Results</h2>
            </div>
            <div className="bento-process-grid">
              {c.process.map((step, i) => (
                <div key={i} className="bento-process-step">
                  <div className="bento-step-header">
                    <span className="bento-step-num">STEP 0{i + 1}</span>
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. TOOLS / TOOLKIT */}
        {c.sections.tools && c.tools && c.tools.length > 0 && (
          <div id="tools" className="bento-card bento-full-width bento-reveal">
            <div className="bento-card-header">
              <span className="bento-section-label">TOOLKIT</span>
              <h2>Daily Drivers &amp; Productivity Stack</h2>
            </div>
            <div className="bento-tools-wrap">
              {c.tools.map((t) => (
                <div key={t.name} className="bento-tool-pill">
                  {t.logo ? (
                    <img src={t.logo} alt={t.name} className="bento-tool-logo" />
                  ) : (
                    <span className="bento-tool-initial">{t.name.slice(0, 1)}</span>
                  )}
                  <span>{t.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 8. TESTIMONIALS */}
        {c.sections.testimonial && c.testimonials && c.testimonials.length > 0 && (
          <div id="testimonials" className="bento-card bento-full-width bento-reveal">
            <div className="bento-card-header">
              <span className="bento-section-label">TESTIMONIALS</span>
              <h2>Client &amp; Colleague Endorsements</h2>
            </div>
            <div className="bento-testimonials-grid">
              {c.testimonials.map((t, i) => (
                <div key={i} className="bento-testimonial-card">
                  <span className="bento-quote-mark">“</span>
                  <p className="bento-quote-text">{t.quote}</p>
                  <div className="bento-quote-author">
                    <strong>{t.name}</strong>
                    <span>{t.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 9. FAQS */}
        {c.sections.faqs && faqs.length > 0 && (
          <div id="faqs" className="bento-card bento-full-width bento-reveal">
            <div className="bento-card-header">
              <span className="bento-section-label">FAQ</span>
              <h2>Frequently Asked Questions</h2>
            </div>
            <div className="bento-faqs-list">
              {faqs.map((f, i) => (
                <details key={i} className="bento-faq-item" open={i === 0}>
                  <summary className="bento-faq-question">
                    <span>{f.question}</span>
                    <span className="bento-faq-plus">+</span>
                  </summary>
                  <div className="bento-faq-answer">
                    <p>{f.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}

        {/* 10. CONTACT CARD */}
        <div id="contact" className="bento-card bento-full-width bento-contact-card bento-reveal">
          <div className="bento-contact-inner">
            <div className="bento-contact-header">
              <span className="bento-section-label">GET IN TOUCH</span>
              <h2>{c.contact.heading || "Let's collaborate on your next product."}</h2>
              <p>{c.contact.subheading || "I'd love to discuss how we can work together."}</p>
              
              <div className="bento-contact-details">
                <a href={`mailto:${c.contact.email}`} className="bento-contact-mail">
                  ✉ {c.contact.email}
                </a>
                {c.contact.location && (
                  <p className="bento-contact-loc">📍 Based in {c.contact.location}</p>
                )}
              </div>
            </div>

            <div className="bento-contact-form-side">
              {c.contact.formEnabled && contactReady && !preview ? (
                <ContactForm />
              ) : (
                <form
                  className="bento-inquiry-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = new FormData(e.currentTarget);
                    const name = form.get("name") || "";
                    const email = form.get("email") || "";
                    const msg = form.get("message") || "";
                    window.location.href = `mailto:${c.contact.email}?subject=Project Inquiry from ${name}&body=${encodeURIComponent(String(msg) + "\n\nEmail: " + String(email))}`;
                  }}
                >
                  <input name="name" type="text" placeholder="Your Name *" required />
                  <input name="email" type="email" placeholder="Your Email *" required />
                  <textarea name="message" rows={4} placeholder="Tell me about your project *" required />
                  <button type="submit" className="bento-button bento-btn-primary">
                    Send Message <Arrow />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

      </main>

      {/* 11. GOLD STANDARD REAL FOOTER (REPLACING OLD INLINE NAMES) */}
      <TemplateFooter
        content={c}
        links={navLinks}
        templateVariant="bento"
      />
    </div>
  );
}
