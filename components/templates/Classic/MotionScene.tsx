"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
export default function MotionScene({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.from(".hero-enter", {
          y: 28,
          opacity: 0,
          duration: 1,
          stagger: 0.12,
          ease: "power3.out",
          clearProps: "all",
        });
        gsap.from(".hero-portrait", {
          y: 35,
          rotate: 3,
          opacity: 0,
          duration: 1.4,
          ease: "power3.out",
          clearProps: "all",
        });
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
        gsap.to(".hero-orbit", {
          rotation: 360,
          duration: 130,
          repeat: -1,
          ease: "none",
        });
      }, ref);
      return () => ctx.revert();
    });
    mm.add(
      "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
      () => {
        const ctx = gsap.context(() => {
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
          gsap.to(".architect-trapezium", {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 60% 100%)",
            y: 50,
            ease: "none",
            scrollTrigger: {
              trigger: ".editorial-hero",
              start: "top top",
              end: "bottom top",
              scrub: 1.5,
            },
          });
        }, ref);
        return () => ctx.revert();
      },
    );
    return () => mm.revert();
  }, []);
  return <div ref={ref}>{children}</div>;
}
