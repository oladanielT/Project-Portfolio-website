"use client";

import Image from "next/image";
import Link from "next/link";
import { defaultFaqs, type SiteContent } from "@/lib/schema";
import MotionScene from "./MotionScene";
import TemplateFooter from "../common/TemplateFooter";
import "./styles.css";

export default function Template5Portfolio({
  content,
  contactReady,
  preview,
}: {
  content: SiteContent;
  contactReady: boolean;
  preview?: boolean;
}) {
  const faqs = (content.faqs && content.faqs.length > 0) ? content.faqs : defaultFaqs;

  const navLinks = [
    { href: "#hero", label: "Home" },
    ...(content.sections.about ? [{ href: "#about", label: "About" }] : []),
    ...(content.sections.work && content.projects.length > 0 ? [{ href: "#work", label: "Work" }] : []),
    ...(content.sections.expertise && content.expertise.length > 0 ? [{ href: "#services", label: "Services" }] : []),
    ...(content.sections.process && content.process.length > 0 ? [{ href: "#process", label: "Process" }] : []),
    ...(content.sections.tools && content.tools.length > 0 ? [{ href: "#tools", label: "Tools" }] : []),
    ...(content.sections.faqs && faqs.length > 0 ? [{ href: "#faqs", label: "FAQs" }] : []),
    { href: "#contact", label: "Contact" },
  ];

  return (
    <div className="template5-wrapper" data-template="template5" id="hero">
      <header className="nav-header">
        <div className="nav-brand">
          {content.hero.name.split(" ")[0]}<span>.</span>
        </div>
        <nav className="nav-links">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href}>{l.label}</Link>
          ))}
        </nav>
        <Link href="#contact" className="btn btn-glass">
          Let&apos;s talk ↗
        </Link>
      </header>

      <main>
        {/* 1. HERO */}
        <section className="hero-section max-w-8xl mx-auto w-full">
          <div className="hero-content">
            <h1>
              Hi, I&apos;m <br />
              <span className="highlight">{content.hero.name}.</span>
            </h1>
            <div className="hero-subtitle">
              {content.hero.eyebrow}
            </div>
            <p className="hero-intro">
              {content.hero.intro}
            </p>
            <div className="hero-actions">
              <Link href="#work" className="btn btn-primary">
                {content.hero.ctaLabel || "View Work"} →
              </Link>
              <Link href="#about" className="btn btn-secondary">
                About me <span>👤</span>
              </Link>
            </div>
          </div>
          
          <div className="hero-visual">
            <MotionScene />
            {content.hero.photo && (
              <Image 
                src={content.hero.photo} 
                alt={content.hero.name} 
                width={400} 
                height={400} 
                className="avatar"
                style={{ objectPosition: content.hero.photoPosition || "center" }}
              />
            )}
            
            <div className="glass-card">
              <div className="status">Available for work</div>
              <p>I&apos;m currently accepting new projects.</p>
              {content.contact.cv && (
                <Link href={content.contact.cv} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{width: '100%', justifyContent: 'center', fontSize: '12px', padding: '8px'}}>
                  → Download Resume
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* 2. ORGANIZATIONS / TRUSTED BY */}
        {content.sections.organizations && content.organizations.length > 0 && (
          <section className="trusted-by" id="organizations">
            <span>Trusted by</span>
            <div className="org-logos">
              {content.organizations.map((org, i) => (
                <div key={i} style={{fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <span style={{fontSize: '20px'}}>⊛</span> {org.name}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 3. ABOUT */}
        {content.sections.about && (
          <section id="about" className="about-section">
            <div className="about-visual">
              {content.about.photo && (
                <Image 
                  src={content.about.photo}
                  alt="About me"
                  width={400}
                  height={500}
                  className="about-avatar"
                  style={{ objectPosition: content.about.photoPosition || "center" }}
                />
              )}
            </div>
            <div className="about-details">
              <h2>{content.about.heading || "About me"}</h2>
              <div className="about-content">
                {content.about.paragraphs?.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              {content.about.stat?.value && (
                <div className="about-stat">
                  <span className="stat-value">{content.about.stat.value}</span>
                  <span className="stat-label">{content.about.stat.label}</span>
                </div>
              )}
            </div>
          </section>
        )}

        {/* 4. WORK / PROJECTS */}
        {content.sections.work && content.projects.length > 0 && (
          <section id="work" className="selected-work">
            <div className="work-header">
              <div>
                <span className="label">Selected Work</span>
                <h2>Designing digital experiences that make an impact.</h2>
              </div>
              <Link href="#work" className="btn btn-secondary">
                View all projects →
              </Link>
            </div>

            <div className="projects-grid">
              {content.projects.map((project) => (
                <div key={project.slug} className="project-card">
                  <div className="project-image-wrap">
                    <span className="project-tag">{project.category.split('·')[0].trim()}</span>
                    {project.cover && (
                      <Image 
                        src={project.cover}
                        alt={project.title}
                        width={400}
                        height={250}
                      />
                    )}
                  </div>
                  <div className="project-info">
                    <div>
                      <h3>{project.title}</h3>
                      <p>{project.category}</p>
                    </div>
                    <Link href={`${preview ? "/admin/preview" : ""}/work/${project.slug}`} className="project-link">
                      ↗
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 5. SERVICES / EXPERTISE */}
        {content.sections.expertise && content.expertise.length > 0 && (
          <section id="services" className="expertise-section">
            <div className="section-header">
              <span className="label">Expertise</span>
              <h2>Services I offer</h2>
            </div>
            <div className="expertise-grid">
              {content.expertise.map((exp, i) => (
                <div key={i} className="expertise-card">
                  <h3>{exp.title}</h3>
                  <p>{exp.description}</p>
                  <div className="expertise-skills">
                    {exp.skills?.map((skill, j) => (
                      <span key={j} className="skill-pill">{skill}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 6. PROCESS */}
        {content.sections.process && content.process.length > 0 && (
          <section id="process" className="process-section">
            <div className="section-header">
              <span className="label">Process</span>
              <h2>How I work</h2>
            </div>
            <div className="process-grid">
              {content.process.map((step, i) => (
                <div key={i} className="process-step">
                  <div className="step-number">0{i + 1}</div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 7. TOOLS */}
        {content.sections.tools && content.tools.length > 0 && (
          <section id="tools" className="tools-section">
            <div className="section-header">
              <span className="label">Toolkit</span>
              <h2>Tools I use daily</h2>
            </div>
            <div className="tools-flex">
              {content.tools.map((tool, i) => (
                <div key={i} className="tool-pill">
                  {tool.name}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 8. TESTIMONIALS */}
        {content.sections.testimonial && content.testimonials.length > 0 && (
          <section className="testimonial">
            {content.testimonials.map((testimonial, index) => (
              <article className="testimonial-entry" key={index}>
                <div className="testimonial-quote">{testimonial.quote}</div>
                <div className="testimonial-author">
                  {content.about.photo && (
                    <Image src={content.about.photo} alt={testimonial.name} width={50} height={50} />
                  )}
                  <div>
                    <div style={{fontWeight: 600, fontSize: '14px'}}>{testimonial.name}</div>
                    <div style={{fontSize: '12px', color: 'var(--color-text-muted)'}}>{testimonial.role}</div>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}

        {/* 9. FAQS */}
        {content.sections.faqs && faqs.length > 0 && (
          <section id="faqs" className="t5-faqs-section" style={{ padding: '80px 5%', maxWidth: '900px', margin: '0 auto' }}>
            <div className="section-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
              <span className="label">FAQ</span>
              <h2>Frequently asked questions</h2>
            </div>
            <div className="t5-faqs-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {faqs.map((faq, i) => (
                <details key={i} open={i === 0} style={{ background: 'var(--color-surface)', padding: '20px 24px', borderRadius: '16px', border: '1px solid var(--color-border)' }}>
                  <summary style={{ fontSize: '18px', fontWeight: 600, cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{faq.question}</span>
                    <span style={{ fontSize: '20px', color: 'var(--color-accent)' }}>+</span>
                  </summary>
                  <p style={{ marginTop: '12px', fontSize: '15px', lineHeight: 1.6, color: 'var(--color-text-muted)' }}>
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* 10. GOLD STANDARD FOOTER */}
      <TemplateFooter
        content={content}
        links={navLinks}
        templateVariant="template5"
      />
    </div>
  );
}
