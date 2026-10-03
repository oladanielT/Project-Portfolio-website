"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function MotionScene({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        // hero entrance: runs on the real classes used in the template
        gsap.from(".hero-enter", {
          y: 28,
          opacity: 0,
          duration: 1,
          stagger: 0.12,
          ease: "power3.out",
          clearProps: "all",
        });

        // scroll reveals
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
          gsap.from(el, {
            y: 30,
            opacity: 0,
            duration: 0.85,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 94%", once: true },
            clearProps: "all",
          });
        });

        // hero background drifts slower than the page (parallax)
        gsap.to(".hero-wash", {
          y: 100,
          ease: "none",
          scrollTrigger: {
            trigger: ".editorial-hero",
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });
      }, ref);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return <div ref={ref}>{children}</div>;
}