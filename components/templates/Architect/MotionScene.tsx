"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function MotionScene() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      
      
      // Smart Header (Hide on scroll down, show on scroll up)
      const nav = document.querySelector(".site-nav") as HTMLElement;
      if (nav) {
        ScrollTrigger.create({
          start: "top top",
          end: "max",
          onUpdate: (self) => {
            const currentScroll = self.scroll();
            if (currentScroll > 150) {
              if (self.direction === 1) {
                // scrolling down
                gsap.to(nav, { yPercent: -100, duration: 0.3, ease: "power2.out", overwrite: true });
              } else {
                // scrolling up
                gsap.to(nav, { yPercent: 0, duration: 0.3, ease: "power2.out", overwrite: true });
              }
            } else {
              gsap.to(nav, { yPercent: 0, duration: 0.3, ease: "power2.out", overwrite: true });
            }
          }
        });
      }

      // Abstract SVGs subtle animations
      gsap.to(".shape-a", {
        y: 50,
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
      
      gsap.to(".shape-b", {
        rotation: 30,
        duration: 15,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
      
      gsap.to(".shape-c", {
        x: -30,
        y: -20,
        duration: 12,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      // Simple horizontal infinite move for marquee
      const trackLeft = document.querySelector(".track-left") as HTMLElement;
      if (trackLeft) {
        gsap.to(".track-left", {
          xPercent: -50,
          repeat: -1,
          duration: 20,
          ease: "linear"
        });
      }
      
    }, ref);

    return () => ctx.revert();
  }, []);

  return <div ref={ref} style={{ display: "none" }} />;
}
