"use client";

import Image from "next/image";
import Link from "next/link";
import type { SiteContent } from "@/lib/schema";
import MotionScene from "./MotionScene";
import "./styles.css";

const Arrow = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4.5 2.5H12.5V10.5M12.5 2.5L2.5 12.5" stroke="currentColor" strokeWidth="1.2" />
  </svg>
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
    <a href={url || '#'} target="_blank" rel="noopener noreferrer" aria-label={type} style={{ opacity: 0.7, transition: 'opacity 0.2s', color: 'inherit' }} onMouseOver={(e) => e.currentTarget.style.opacity='1'} onMouseOut={(e) => e.currentTarget.style.opacity='0.7'}>
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

  return (
    <div className="bento-wrapper">
      <MotionScene />
      
      <header style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', maxWidth: 1200, margin: '0 auto' }}>
        <strong>{c.hero.name}</strong>
        <nav style={{ display: 'flex', gap: '2rem' }}>
          {c.sections.work && <a href="#work">Work</a>}
          {c.sections.about && <a href="#about">About</a>}
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main className="bento-container" id="main-content">
        
        {/* HERO WIDGETS */}
        <div className="bento-card bento-hero-intro bento-reveal">
          <p className="eyebrow" style={{marginBottom: '1rem'}}>👋 {c.hero.eyebrow}</p>
          <h1 style={{ fontSize: '3.5rem', lineHeight: 1.1, marginBottom: '1.5rem' }}>
            {c.hero.title}
          </h1>
          <p style={{ fontSize: '1.25rem', opacity: 0.8, maxWidth: 500 }}>
            {c.hero.intro}
          </p>
        </div>

        <div className="bento-card bento-hero-portrait bento-reveal">
          {c.hero.photo && (
            <Image
              src={c.hero.photo}
              alt={c.hero.name}
              style={{ objectPosition: c.hero.photoPosition, objectFit: 'cover' }}
              fill
              unoptimized
            />
          )}
        </div>

        <div className="bento-card bento-stat-card bento-reveal" style={{ background: 'var(--accent)', color: 'var(--background)' }}>
          <h3 style={{ fontSize: '3rem', margin: 0 }}>{projects.length}+</h3>
          <p style={{ opacity: 0.9 }}>Projects Delivered</p>
        </div>

        <div className="bento-card bento-stat-card bento-reveal">
          <h3 style={{ fontSize: '1.5rem', margin: 0 }}>{c.contact.location}</h3>
          <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>Current Location</p>
        </div>

        <a href="#contact" className="bento-card bento-stat-card bento-reveal" style={{ textDecoration: 'none' }}>
          <h3 style={{ fontSize: '1.5rem', margin: 0 }}>Available</h3>
          <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>For new opportunities</p>
        </a>

        {/* WORK WIDGETS */}
        {c.sections.work && projects.map((p, i) => (
          <Link
            key={p.slug}
            href={`${preview ? "/admin/preview" : ""}/work/${p.slug}`}
            className={`bento-card bento-work-card bento-reveal ${i === 0 ? 'featured' : ''}`}
          >
            {p.cover && (
              <Image src={p.cover} alt={p.title} fill unoptimized style={{ objectFit: 'cover' }} />
            )}
            <div className="bento-work-info">
              <p className="eyebrow">{p.category}</p>
              <h3 style={{ fontSize: i === 0 ? '3rem' : '2rem', margin: 0 }}>{p.title}</h3>
            </div>
          </Link>
        ))}

        {/* ABOUT & SKILLS WIDGETS */}
        {c.sections.about && (
          <div className="bento-card bento-reveal" style={{ gridColumn: 'span 12', gridRow: 'span 4' }}>
            <div style={{ maxWidth: 800 }}>
              <p className="eyebrow" style={{marginBottom: '1rem'}}>ABOUT ME</p>
              {c.about?.paragraphs?.map((p, i) => (
                <p key={i} style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>{p}</p>
              ))}
            </div>
          </div>
        )}

        {c.sections.tools && (
          <div className="bento-card bento-reveal" style={{ gridColumn: 'span 12', gridRow: 'span 2' }}>
            <p className="eyebrow" style={{marginBottom: '1rem'}}>TOOLKIT</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              {c.tools?.map((t) => (
                <span key={t} style={{ padding: '0.75rem 1.5rem', background: 'var(--surface-raised)', borderRadius: '100px' }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        <div id="contact" className="bento-card bento-reveal" style={{ gridColumn: 'span 12', gridRow: 'span 3', background: 'var(--foreground)', color: 'var(--background)', textAlign: 'center', justifyContent: 'center' }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'inherit' }}>{c.contact.heading}</h2>
          <p style={{ opacity: 0.8, marginBottom: '2rem' }}>{c.contact.location}</p>
          <a href={`mailto:${c.contact.email}`} className="button" style={{ background: 'var(--background)', color: 'var(--foreground)', alignSelf: 'center', borderRadius: '100px' }}>
            Get in touch
          </a>
          <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem", flexWrap: "wrap", justifyContent: "center" }}>
            {c.contact.github && <a href={c.contact.github} target="_blank" rel="noreferrer" style={{ color: "inherit", textDecoration: "underline" }}>GitHub</a>}
            {c.contact.linkedin && <a href={c.contact.linkedin} target="_blank" rel="noreferrer" style={{ color: "inherit", textDecoration: "underline" }}>LinkedIn</a>}
            {c.contact.twitter && <a href={c.contact.twitter} target="_blank" rel="noreferrer" style={{ color: "inherit", textDecoration: "underline" }}>Twitter</a>}
            {c.contact.instagram && <a href={c.contact.instagram} target="_blank" rel="noreferrer" style={{ color: "inherit", textDecoration: "underline" }}>Instagram</a>}
            {c.contact.facebook && <a href={c.contact.facebook} target="_blank" rel="noreferrer" style={{ color: "inherit", textDecoration: "underline" }}>Facebook</a>}
          </div>
        </div>

      </main>
    </div>
  );
}
