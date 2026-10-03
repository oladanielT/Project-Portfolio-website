"use client";
import { useEffect, useState } from "react";
export default function Nav({
  name,
  home = false,
  base = "",
  sections,
}: {
  name: string;
  home?: boolean;
  base?: string;
  sections?: { about: boolean; work: boolean; expertise: boolean };
}) {
  const [open, setOpen] = useState(false);
  const prefix = home ? base || "/" : "";
  useEffect(() => {
    if (!open) return;
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        document.getElementById("menu-toggle")?.focus();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);
  return (
    <header className="site-header">
      <div className="page-width nav-inner">
        <a className="brand" href={home ? base || "/" : "#top"}>
          {name.split(" ")[0]}
          <span>.</span>
        </a>
        <button
          id="menu-toggle"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="main-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? "Close −" : "Menu +"}
        </button>
        <nav
          id="main-navigation"
          className={open ? "is-open" : ""}
          aria-label="Main navigation"
        >
          {[
            ["about", "The person"],
            ["work", "The work"],
            ["expertise", "The expertise"],
          ]
            .filter(
              ([id]) => !sections || sections[id as keyof typeof sections],
            )
            .map(([id, label]) => (
              <a
                key={id}
                href={`${prefix}#${id}`}
                onClick={() => setOpen(false)}
              >
                {label}
              </a>
            ))}
          <a
            className="nav-contact"
            href={`${prefix}#contact`}
            onClick={() => setOpen(false)}
          >
            Let’s talk <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
