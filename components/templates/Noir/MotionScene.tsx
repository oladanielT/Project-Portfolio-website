"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function MotionScene() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    // Scope to the page wrapper (this component is rendered inside it).
    const root = ref.current?.parentElement;
    if (!root) return;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        // Hero intro
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from(".nx-nav", { y: -40, opacity: 0, duration: 0.8 })
          .from(".nx-hero-copy > *", { y: 36, opacity: 0, duration: 0.9, stagger: 0.12 }, "-=0.4")
          .from(".nx-hero-photo", { scale: 0.9, opacity: 0, duration: 1.1, ease: "back.out(1.4)" }, "-=0.9")
          .from(".nx-hero-float", { scale: 0, opacity: 0, duration: 0.6, stagger: 0.15, ease: "back.out(2)" }, "-=0.4");

        // Scroll reveals (batched so siblings stagger)
        gsap.set(".nx-reveal", { opacity: 0, y: 40 });
        ScrollTrigger.batch(".nx-reveal", {
          start: "top 90%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, { opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease: "power3.out", overwrite: true }),
        });

        // Count-up stats
        gsap.utils.toArray<HTMLElement>(".nx-count").forEach((el) => {
          const to = Number(el.dataset.to || 0);
          const o = { v: 0 };
          ScrollTrigger.create({
            trigger: el,
            start: "top 92%",
            once: true,
            onEnter: () =>
              gsap.to(o, {
                v: to,
                duration: 1.6,
                ease: "power2.out",
                onUpdate: () => {
                  el.textContent = String(Math.round(o.v));
                },
              }),
          });
        });
      }, root);

      return () => ctx.revert();
    });

    // Reduced motion: show everything, count-ups jump to final value
    mm.add("(prefers-reduced-motion: reduce)", () => {
      root.querySelectorAll<HTMLElement>(".nx-count").forEach((el) => {
        el.textContent = el.dataset.to || "0";
      });
    });

    return () => mm.revert();
  }, []);

  return <div ref={ref} hidden aria-hidden />;
}