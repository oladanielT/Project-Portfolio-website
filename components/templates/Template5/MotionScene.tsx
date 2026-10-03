"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function MotionScene() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      
      const elements = document.querySelectorAll('.hero-content h1, .hero-content p, .hero-content .btn, .hero-visual, .project-card, .testimonial');
      if (elements.length) {
        gsap.from(elements, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".template5-wrapper",
            start: "top 80%",
          }
        });
      }
      
      const glassCard = document.querySelector(".glass-card");
      if (glassCard) {
         gsap.to(glassCard, {
           y: -15,
           duration: 3,
           repeat: -1,
           yoyo: true,
           ease: "sine.inOut"
         });
      }
      
    }, ref);

    return () => ctx.revert();
  }, []);

  return <div ref={ref} style={{ display: "none" }} />;
}
