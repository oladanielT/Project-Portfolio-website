"use client";

import React from "react";
import Link from "next/link";
import type { SiteContent } from "@/lib/schema";
import "./TemplateFooter.css";

export type FooterLink = {
  href: string;
  label: string;
};

const SocialIcon = ({ type, url }: { type: string; url?: string }) => {
  const paths: Record<string, string> = {
    facebook: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z",
    twitter: "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z",
    instagram: "M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z M6.5 6.5h.01 M21 12v-2a9 9 0 00-9-9 9 9 0 00-9 9v2a9 9 0 009 9 9 9 0 009-9z",
    linkedin: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z M2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z",
    github: "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22",
  };

  const path = paths[type];
  if (!path) return null;

  const icon = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={path} />
      {type === "instagram" && <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />}
    </svg>
  );

  return url ? (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={type}
      className="tf-social-icon"
    >
      {icon}
    </a>
  ) : (
    <span
      role="img"
      aria-label={`${type} not configured`}
      className="tf-social-icon is-unconfigured"
    >
      {icon}
    </span>
  );
};

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 17 17 7M8 7h9v9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Star({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 1.5l2.2 7.3 7.3 2.2-7.3 2.2L12 20.5l-2.2-7.3L2.5 11l7.3-2.2z" />
    </svg>
  );
}

function Marquee({ items }: { items: string[] }) {
  const base = items.length >= 5 ? items : [...items, ...items, ...items];
  const group = (key: string) => (
    <div className="tf-marquee-group" key={key} aria-hidden={key === "b"}>
      {base.map((t, i) => (
        <span className="tf-marquee-item" key={`${key}-${i}`}>
          {t}
          <Star />
        </span>
      ))}
    </div>
  );

  return (
    <div className="tf-marquee">
      <div className="tf-marquee-track">
        {group("a")}
        {group("b")}
      </div>
    </div>
  );
}

export default function TemplateFooter({
  content: c,
  links,
  templateVariant = "default",
  base,
}: {
  content: SiteContent;
  links?: FooterLink[];
  templateVariant?: string;
  base?: string;
}) {
  const initial = (c.hero.name || "P").trim().charAt(0).toUpperCase();

  // Dynamic marquee items
  const marqueeItems = (
    c.tools && c.tools.length > 0
      ? c.tools.map((t) => t.name)
      : c.skills && c.skills.length > 0
        ? c.skills
        : c.projects.map((p) => p.category).filter(Boolean)
  ) as string[];

  if (!marqueeItems.length) {
    marqueeItems.push(c.hero.title || "Product & Operations Strategist");
  }

  // If base is provided, prefix anchor links (e.g. "/#about" or "/admin/preview/#about")
  const prefix = base !== undefined ? (base ? (base.endsWith("/") ? base : `${base}/`) : "/") : "";

  // Dynamic navigation links fallback
  const defaultLinks: FooterLink[] = [
    { href: `${prefix}#top`, label: "Home" },
    ...(c.sections.organizations && c.organizations?.length > 0 ? [{ href: `${prefix}#organizations`, label: "Partners" }] : []),
    ...(c.sections.about ? [{ href: `${prefix}#about`, label: "About" }] : []),
    ...(c.sections.work && c.projects?.length > 0 ? [{ href: `${prefix}#work`, label: "Work" }] : []),
    ...(c.sections.expertise && ((c.expertise && c.expertise.length > 0) || ((c as any).services && (c as any).services.length > 0)) ? [{ href: `${prefix}#services`, label: "Services" }] : []),
    ...(c.sections.process && c.process?.length > 0 ? [{ href: `${prefix}#process`, label: "Process" }] : []),
    ...(c.sections.tools && c.tools?.length > 0 ? [{ href: `${prefix}#tools`, label: "Toolkit" }] : []),
    ...(c.sections.testimonial && ((c.testimonials && c.testimonials.length > 0) || c.testimonial?.quote) ? [{ href: `${prefix}#testimonials`, label: "Reviews" }] : []),
    ...(c.sections.faqs ? [{ href: `${prefix}#faqs`, label: "FAQs" }] : []),
    { href: `${prefix}#contact`, label: "Contact" },
  ];

  const rawLinks = links && links.length > 0 ? links : defaultLinks;
  const activeLinks = rawLinks.map((l) => {
    if (prefix && l.href.startsWith("#")) {
      return { ...l, href: `${prefix}${l.href}` };
    }
    return l;
  });

  return (
    <footer id="contact" className={`tf-footer tf-variant-${templateVariant}`} aria-label="Site Footer">
      <Marquee items={marqueeItems} />
      
      <div className="tf-wrap tf-inner">
        <div className="tf-top">
          <div className="tf-top-heading">
            <span className="tf-eyebrow">Get in touch</span>
            <h2 className="tf-title">
              Let&apos;s <span className="tf-accent">Connect</span> and build together
            </h2>
          </div>
          <a href={`mailto:${c.contact.email}`} className="tf-cta-btn">
            Say Hello <span className="tf-btn-ico"><Arrow /></span>
          </a>
        </div>

        <div className="tf-cols">
          {/* Column 1: Brand & Profile */}
          <div className="tf-col tf-col-brand">
            <a href={base !== undefined ? `${prefix}#top` : "#top"} className="tf-brand">
              <span className="tf-monogram">{initial}</span>
              <span className="tf-name">{c.hero.name}</span>
            </a>
            <p className="tf-tagline">{c.hero.title}</p>
            {c.contact.location && (
              <p className="tf-location">📍 {c.contact.location}</p>
            )}
            {c.contact.cv && (
              <a href={c.contact.cv} target="_blank" rel="noreferrer" className="tf-cv-link">
                View CV / Resume ↗
              </a>
            )}
          </div>

          {/* Column 2: Navigation Links */}
          <div className="tf-col tf-col-nav">
            <h4 className="tf-col-title">Navigation</h4>
            <nav className="tf-nav-list" aria-label="Footer Navigation">
              {activeLinks.map((l, i) => (
                <a key={`${l.href}-${i}`} href={l.href} className="tf-nav-link">
                  {l.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Column 3: Contact Details & Social Links */}
          <div className="tf-col tf-col-contact">
            <h4 className="tf-col-title">Contact</h4>
            <a href={`mailto:${c.contact.email}`} className="tf-email-link">
              {c.contact.email}
            </a>
            <p className="tf-availability">Open for freelance and full-time opportunities.</p>
            
            <div className="tf-socials">
              <SocialIcon type="github" url={c.contact.github} />
              <SocialIcon type="linkedin" url={c.contact.linkedin} />
              <SocialIcon type="twitter" url={c.contact.twitter} />
              <SocialIcon type="instagram" url={c.contact.instagram} />
              <SocialIcon type="facebook" url={c.contact.facebook} />
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Top link */}
        <div className="tf-bottom">
          <span className="tf-copy">
            © {new Date().getFullYear()} {c.hero.name}. All Rights Reserved.
          </span>
          <a href="#top" className="tf-top-link">
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
