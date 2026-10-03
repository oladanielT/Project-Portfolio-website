"use client";
import { useEffect, type RefObject } from "react";

export default function MotionScene({
  root,
}: {
  root: RefObject<HTMLDivElement>;
}) {
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (min-width: 761px)",
    );
    const animations = new Set<Animation>();
    let observer: IntersectionObserver | undefined;
    let frame = 0;
    const art = element.querySelector<HTMLElement>(".v-hero-art");
    const header = element.querySelector<HTMLElement>(".v-header");
    function setup() {
      observer?.disconnect();
      animations.forEach((animation) => animation.cancel());
      animations.clear();
      if (preference.matches) {
        art?.style.removeProperty("--pointer-x");
        art?.style.removeProperty("--pointer-y");
        return;
      }
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const animation = entry.target.animate(
              [
                { opacity: 0.25, transform: "translateY(22px)" },
                { opacity: 1, transform: "translateY(0)" },
              ],
              { duration: 700, easing: "cubic-bezier(.2,.7,.2,1)" },
            );
            animations.add(animation);
            animation.onfinish = () => animations.delete(animation);
            const path = entry.target.querySelector(".v-step-path path");
            if (path) {
              const line = path.animate(
                [{ strokeDashoffset: "1" }, { strokeDashoffset: "0" }],
                { duration: 1100, easing: "ease-out" },
              );
              animations.add(line);
              line.onfinish = () => animations.delete(line);
            }
            observer?.unobserve(entry.target);
          });
        },
        { threshold: 0.08 },
      );
      element
        ?.querySelectorAll("[data-v-reveal]")
        .forEach((node) => observer?.observe(node));
    }
    function move(event: PointerEvent) {
      if (!art || preference.matches || !pointer.matches) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const box = art.getBoundingClientRect();
        art.style.setProperty(
          "--pointer-x",
          `${((event.clientX - box.left) / box.width - 0.5) * 14}deg`,
        );
        art.style.setProperty(
          "--pointer-y",
          `${((event.clientY - box.top) / box.height - 0.5) * -14}deg`,
        );
      });
    }
    function reset() {
      cancelAnimationFrame(frame);
      art?.style.setProperty("--pointer-x", "0deg");
      art?.style.setProperty("--pointer-y", "0deg");
    }
    const scroll = () =>
      header?.classList.toggle("v-header-scrolled", window.scrollY > 40);
    setup();
    scroll();
    preference.addEventListener("change", setup);
    art?.addEventListener("pointermove", move);
    art?.addEventListener("pointerleave", reset);
    window.addEventListener("scroll", scroll, { passive: true });
    return () => {
      observer?.disconnect();
      animations.forEach((animation) => animation.cancel());
      cancelAnimationFrame(frame);
      preference.removeEventListener("change", setup);
      art?.removeEventListener("pointermove", move);
      art?.removeEventListener("pointerleave", reset);
      window.removeEventListener("scroll", scroll);
    };
  }, [root]);
  return null;
}
