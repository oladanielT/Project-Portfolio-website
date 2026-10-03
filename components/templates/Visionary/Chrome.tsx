"use client";

import { useEffect, useRef, useState } from "react";
import type { SiteContent } from "@/lib/schema";

export function OrbitMark({ variant = 0 }: { variant?: number }) {
  return (
    <svg
      className="v-orbit-mark"
      viewBox="0 0 80 80"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="40" cy="40" r="27" />
      <ellipse
        cx="40"
        cy="40"
        rx="36"
        ry="12"
        transform={`rotate(${variant * 30 - 35} 40 40)`}
      />
      <ellipse
        cx="40"
        cy="40"
        rx="12"
        ry="36"
        transform={`rotate(${variant * 30 - 35} 40 40)`}
      />
      <circle cx="40" cy="40" r="4" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Arrow({ diagonal = true }: { diagonal?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={diagonal ? "M5 19 19 5M5 5h14v14" : "M4 12h16m-6-6 6 6-6 6"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function VisionaryHeader({
  content: c,
  base = "",
}: {
  content: SiteContent;
  base?: string;
}) {
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const links = [
    ...(c.sections.work && c.projects.length
      ? [["work", "Selected work"]]
      : []),
    ...(c.sections.about &&
    (c.about.heading || c.about.paragraphs.length || c.about.photo)
      ? [["about", "About"]]
      : []),
    ...(c.sections.expertise &&
    (c.expertise.length || c.services.length || c.skills.length)
      ? [["expertise", "Expertise"]]
      : []),
    ["contact", "Let’s talk"],
  ];
  useEffect(() => {
    if (!open) return;
    const modal = dialog.current;
    modal?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      modal?.close();
      document.body.style.overflow = previous;
    };
  }, [open]);
  function close() {
    setOpen(false);
    toggle.current?.focus();
  }
  return (
    <>
      <a className="v-skip" href="#main-content">
        Skip to content
      </a>
      <header className="v-header">
        <a
          className="v-brand"
          href={`${base}#top`}
          aria-label={`${c.hero.name}, home`}
        >
          <OrbitMark />
          <span>
            {c.hero.name.split(" ")[0]}
            <i>.</i>
          </span>
        </a>
        <nav className="v-desktop-nav" aria-label="Main navigation">
          {links.map(([id, label]) => (
            <a key={id} href={`${base}#${id}`}>
              {label}
              {id === "contact" && <Arrow />}
            </a>
          ))}
        </nav>
        <button
          ref={toggle}
          className="v-menu-toggle"
          aria-expanded={open}
          aria-controls="visionary-menu"
          onClick={() => setOpen(true)}
        >
          Menu <span aria-hidden="true">+</span>
        </button>
      </header>
      <dialog
        ref={dialog}
        id="visionary-menu"
        className="v-menu"
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
        aria-label="Navigation menu"
      >
        <div className="v-menu-top">
          <OrbitMark />
          <button onClick={close} autoFocus>
            Close ×
          </button>
        </div>
        <nav aria-label="Mobile navigation">
          {links.map(([id, label], i) => (
            <a key={id} href={`${base}#${id}`} onClick={close}>
              <span>0{i + 1}</span>
              {label}
              <Arrow />
            </a>
          ))}
        </nav>
        <p className="v-kicker">{c.hero.name}</p>
      </dialog>
    </>
  );
}

export function VisionaryFooter({
  content: c,
  base = "",
}: {
  content: SiteContent;
  base?: string;
}) {
  const socials = [
    ["LinkedIn", c.contact.linkedin],
    ["GitHub", c.contact.github],
    ["Instagram", c.contact.instagram],
    ["Facebook", c.contact.facebook],
    ["X / Twitter", c.contact.twitter],
  ].filter(([, url]) => url);
  return (
    <footer className="v-footer v-container">
      <div className="v-footer-top">
        <a href={`${base}#top`} className="v-footer-brand">
          <OrbitMark />
          <span>{c.hero.name}</span>
        </a>
        <a className="v-text-link" href={`${base}#top`}>
          Back to top <span aria-hidden="true">↑</span>
        </a>
      </div>
      <div className="v-footer-bottom">
        <p>
          © {new Date().getFullYear()} {c.hero.name}
        </p>
        <div>
          {socials.map(([name, url]) => (
            <a href={url} key={name} target="_blank" rel="noreferrer">
              {name} ↗
            </a>
          ))}
          {c.contact.cv && (
            <a href={c.contact.cv} target="_blank" rel="noreferrer">
              View CV ↗
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
