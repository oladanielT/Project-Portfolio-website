"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function MotionScene() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      // Stagger reveal the bento cards
      gsap.from(".bento-reveal", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".bento-container",
          start: "top 80%",
        }
      });
      
      // Allow scroll triggers for individual cards further down
      const cards = gsap.utils.toArray(".bento-reveal");
      cards.forEach((card: any) => {
        gsap.from(card, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
          }
        });
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return <div ref={ref} style={{ display: "none" }} />;
}
