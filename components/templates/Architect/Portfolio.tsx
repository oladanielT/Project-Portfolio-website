"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { SiteContent } from "@/lib/schema";
import MotionScene from "./MotionScene";
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

const SocialIcon = ({ type, url }: { type: string, url?: string }) => {
  const paths = {
    facebook: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z",
    twitter: "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z",
    instagram: "M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z M6.5 6.5h.01 M21 12v-2a9 9 0 00-9-9 9 9 0 00-9 9v2a9 9 0 009 9 9 9 0 009-9z",
    linkedin: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z M2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z",
    github: "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22",
  };
  return (
    <a href={url || '#'} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label={type}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d={paths[type as keyof typeof paths]} />
        {type === 'instagram' && <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />}
      </svg>
    </a>
  );
};

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
  
  // Fallback logos for organizations if none provided, to ensure images show
  const defaultLogos = [
    "https://logo.clearbit.com/mailchimp.com",
    "https://logo.clearbit.com/trello.com",
    "https://logo.clearbit.com/jira.com",
    "https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg",
    "https://logo.clearbit.com/figma.com",
    "https://logo.clearbit.com/framer.com"
  ];

  return (
    <div className={`architect-wrapper theme-${c.colorMode || 'light'}`}>
      <MotionScene />
      <SvgShapes />

      {/* NAVBAR */}
      <nav className="site-nav">
        <div className="nav-left">
          <Link href="#hero" className="brand-logo">
            <span className="name-full">{c.hero.name}</span>
            <span className="name-short">{c.hero.name.split(' ')[0]}</span>
          </Link>
        </div>
        <div className="nav-center">
          <Link href="#hero">Home</Link>
          {c.sections.about && <Link href="#about">About</Link>}
          {c.sections.work && <Link href="#work">Work</Link>}
          {c.sections.organizations && <Link href="#partners">Partners</Link>}
          <Link href="#contact">Contact</Link>
        </div>
        <div className="nav-right">
          <Link href="#contact" className="btn-primary btn-small">Let's Talk</Link>
        </div>
      </nav>

      <main>
        {/* HERO */}
        <section id="hero" className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">{c.hero.name}</h1>
            <p className="hero-intro">{c.hero.intro}</p>
            <div className="hero-actions">
              <Link href="#work" className="btn-primary">{c.hero.ctaLabel || 'Explore Work'}</Link>
              <Link href="#contact" className="btn-secondary">Contact Us</Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-image-mask">
              {c.hero.photo && (
                <Image src={c.hero.photo} alt={c.hero.name} fill priority unoptimized className="obj-cover" style={{ objectPosition: c.hero.photoPosition }} />
              )}
            </div>
          </div>
        </section>

        {/* ABOUT */}
        {c.sections.about && (
          <section id="about" className="about-section">
            <div className="about-bg-shape"></div>
            <div className="about-visual">
              <div className="about-image-frame">
                {c.about.photo && (
                  <Image src={c.about.photo} alt="About" fill unoptimized className="obj-cover" style={{ objectPosition: c.about.photoPosition }} />
                )}
              </div>
            </div>
            <div className="about-content">
              <span className="section-eyebrow">ABOUT US</span>
              <h2 className="section-title">{c.about.heading || "Who we are"}</h2>
              <div className="about-text">
                {c.about.paragraphs?.map((p, i) => <p key={i}>{p}</p>)}
              </div>
              {c.about.stat && (
                <div className="about-stat">
                  <span className="stat-value">{c.about.stat.value}</span>
                  <span className="stat-label">{c.about.stat.label}</span>
                </div>
              )}
            </div>
          </section>
        )}

        {/* WORK */}
        {c.sections.work && projects.length > 0 && (
          <section id="work" className="work-section">
            <div className="work-header">
              <span className="section-eyebrow">OUR PORTFOLIO</span>
              <h2 className="section-title">Selected Work</h2>
              <p className="section-desc">A showcase of our most recent and impactful projects.</p>
            </div>
            <div className="work-grid">
              {projects.map((p, i) => (
                <Link key={p.slug} href={`${preview ? "/admin/preview" : ""}/work/${p.slug}`} className="work-card">
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

        {/* FEATURE SHOWCASE (Project Strategy) */}
        {c.sections.expertise && c.expertise && c.expertise.length > 0 && (
          <section className="showcase-section">
            <div className="showcase-content">
              <span className="section-eyebrow">STRATEGY</span>
              <h2 className="section-title">{c.expertise[0].title}</h2>
              <p className="showcase-desc">{c.expertise[0].description}</p>
              {c.expertise[0].skills && c.expertise[0].skills.length > 0 && (
                <div className="showcase-skills">
                  {c.expertise[0].skills.map((s, i) => <span key={i} className="skill-pill">{s}</span>)}
                </div>
              )}
            </div>
            <div className="showcase-visual">
              <div className="showcase-img-placeholder">
                 <Image src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800" alt="Strategy" fill unoptimized className="obj-cover" />
              </div>
            </div>
          </section>
        )}

        {/* PARTNERS / TOOLS MARQUEE */}
        <section id="partners" className="partners-section">
          <div className="partners-header">
            <h2 className="section-title text-center">Tools We Use</h2>
          </div>
          <div className="marquee-container">
            <div className="marquee-track track-left">
              {[
                { name: 'Google Workspace', url: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Google_Workspace_Logo.svg' },
                { name: 'Google Analytics', url: 'https://upload.wikimedia.org/wikipedia/commons/7/77/GAnalytics.svg' },
                { name: 'GitHub', url: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg' },
                { name: 'ChatGPT', url: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg' },
                { name: 'Jira', url: 'https://cdn.simpleicons.org/jira' },
                { name: 'Trello', url: 'https://cdn.simpleicons.org/trello' },
                { name: 'Monday', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c6/Monday_logo.svg' },
                { name: 'Notion', url: 'https://cdn.simpleicons.org/notion' },
                { name: 'Slack', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg' },
                { name: 'Figma', url: 'https://cdn.simpleicons.org/figma' },
                // Duplicate for seamless loop
                { name: 'Google Workspace', url: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Google_Workspace_Logo.svg' },
                { name: 'Google Analytics', url: 'https://upload.wikimedia.org/wikipedia/commons/7/77/GAnalytics.svg' },
                { name: 'GitHub', url: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg' },
                { name: 'ChatGPT', url: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg' },
                { name: 'Jira', url: 'https://cdn.simpleicons.org/jira' },
                { name: 'Trello', url: 'https://cdn.simpleicons.org/trello' },
                { name: 'Monday', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c6/Monday_logo.svg' },
                { name: 'Notion', url: 'https://cdn.simpleicons.org/notion' },
                { name: 'Slack', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg' },
                { name: 'Figma', url: 'https://cdn.simpleicons.org/figma' }
              ].map((tool, i) => (
                <div key={`tool-${i}`} className="partner-logo-card">
                  <img src={tool.url} alt={tool.name} className="partner-img" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        {c.sections.testimonial && c.testimonial && (
          <section id="testimonials" className="testimonials-section">
             <h2 className="section-title text-center">What Our Clients Say</h2>
             <div className="testimonials-carousel">
               <div className="testimonials-track centered">
                  {/* Just one testimonial centered as requested, no duplication */}
                  <div className="testimonial-card-large">
                    <p className="quote-mark">“</p>
                    <p className="quote-text">{c.testimonial.quote}</p>
                    <div className="quote-author">
                      <div className="author-info">
                        <h4>{c.testimonial.name}</h4>
                        <span>{c.testimonial.role}</span>
                      </div>
                    </div>
                  </div>
               </div>
             </div>
          </section>
        )}

        {/* CONTACT SPLIT */}
        <section id="contact" className="contact-section">
          <div className="contact-content">
            <h2 className="section-title">Let's Work Together</h2>
            <p className="contact-desc">{c.contact.subheading || "Ready to start your next big project? Reach out to us."}</p>
            
          </div>
          <div className="contact-form-container">
            {true ? (
              <form className="premium-form" onSubmit={(e) => e.preventDefault()}>
                <div className="form-row">
                  <input type="text" placeholder="Name" required />
                  <input type="email" placeholder="Email" required />
                </div>
                <input type="text" placeholder="Company / Organization" />
                <input type="text" placeholder="Subject / Service" required />
                <textarea placeholder="Message" rows={6} required></textarea>
                <button type="submit" className="btn-primary btn-large">Send Message</button>
              </form>
            ) : (
              <div className="contact-fallback">
                <a href={`mailto:${c.contact.email}`} className="btn-primary btn-large">Email Us Directly</a>
              </div>
            )}
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="final-cta-section">
           <div className="final-cta-content">
             <h2>Ready to start something great together?</h2>
             <p>Let's turn your vision into reality.</p>
             <Link href="#contact" className="btn-primary btn-large">Get Started &rarr;</Link>
           </div>
        </section>

      </main>

      {/* FOOTER (Simplified as requested) */}
      <footer className="site-footer">
        <div className="footer-top-row">
          <div className="footer-brand-col">
             <Link href="#hero" className="brand-logo">
                <span className="name-full">{c.hero.name}</span>
                <span className="name-short">{c.hero.name.split(' ')[0]}</span>
             </Link>
             <div className="footer-contact-info" style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', opacity: 0.8 }}>
                <a href={`mailto:${c.contact.email}`} className="contact-link">{c.contact.email}</a>
                {c.contact.location && <span className="contact-link">{c.contact.location}</span>}
             </div>
          </div>
          <div className="footer-social-wrapper">
             <SocialIcon type="twitter" url={c.contact.twitter} />
             <SocialIcon type="facebook" url={c.contact.facebook} />
             <SocialIcon type="instagram" url={c.contact.instagram} />
             <SocialIcon type="linkedin" url={c.contact.linkedin} />
             {c.contact.github && <SocialIcon type="github" url={c.contact.github} />}
          </div>
        </div>
        <div className="footer-bottom-row">
          <p className="copyright">
             &copy; {new Date().getFullYear()} {c.hero.name}. All rights reserved.
          </p>
          <div className="legal-links">
             <a href="#">Privacy Policy</a>
             <a href="#">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
