"use client";

import Image from "next/image";
import Link from "next/link";
import type { SiteContent } from "@/lib/schema";
import MotionScene from "./MotionScene";
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
  return (
    <div className="template5-wrapper" data-template="template5">
      <header className="nav-header">
        <div className="nav-brand">
          {content.hero.name.split(" ")[0]}<span>.</span>
        </div>
        <nav className="nav-links">
          <Link href="#work">Work</Link>
          <Link href="#about">About</Link>
          <Link href="#services">Services</Link>
          <Link href="#contact">Contact</Link>
        </nav>
        <Link href="#contact" className="btn btn-glass">
          Let's talk ↗
        </Link>
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-content">
            <h1>
              Hi, I'm <br />
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
                {content.hero.ctaLabel} →
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
              <p>I'm currently accepting new projects.</p>
              <Link href={content.contact.cv || "#"} className="btn btn-secondary" style={{width: '100%', justifyContent: 'center', fontSize: '12px', padding: '8px'}}>
                → Download Resume
              </Link>
            </div>
          </div>
        </section>

        {content.sections.organizations && content.organizations.length > 0 && (
          <section className="trusted-by">
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
              {content.projects.map((project, idx) => (
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
                    <Link href={`/work/${project.slug}`} className="project-link">
                      ↗
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

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

        {content.sections.testimonial && content.testimonial && (
          <section className="testimonial">
            <div className="testimonial-quote">
              {content.testimonial.quote}
            </div>
            <div className="testimonial-author">
              <Image src={content.about.photo} alt={content.testimonial.name} width={50} height={50} />
              <div>
                <div style={{fontWeight: 600, fontSize: '14px'}}>{content.testimonial.name}</div>
                <div style={{fontSize: '12px', color: 'var(--color-text-muted)'}}>{content.testimonial.role}</div>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer id="contact" className="footer">
        <h2>Let's create something amazing together.</h2>
        <div className="footer-contact">
          <p>{content.contact.email}</p>
          <p>{content.contact.location}</p>
        </div>
        <div className="social-links">
          {content.contact.github && <a href={content.contact.github} className="social-icon">gh</a>}
          {content.contact.linkedin && <a href={content.contact.linkedin} className="social-icon">in</a>}
          {content.contact.facebook && <a href={content.contact.facebook} className="social-icon">fb</a>}
          {content.contact.instagram && <a href={content.contact.instagram} className="social-icon">ig</a>}
          {content.contact.twitter && <a href={content.contact.twitter} className="social-icon">tw</a>}
        </div>
      </footer>
    </div>
  );
}
