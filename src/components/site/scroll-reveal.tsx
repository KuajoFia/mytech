"use client";

import { useEffect, useRef, useState, type ReactNode, type ElementType } from "react";
import { cn } from "@/lib/utils";

type ScrollRevealProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: 50 | 100 | 150 | 200 | 300 | 400;
  threshold?: number;
  once?: boolean;
};

/**
 * ScrollReveal — wraps content with a fade-in-up animation triggered
 * when the element enters the viewport. Respects prefers-reduced-motion.
 *
 * Usage:
 *   <ScrollReveal as="section" delay={100}>...</ScrollReveal>
 *   <ScrollReveal className="grid grid-cols-3">...</ScrollReveal>
 */
export function ScrollReveal({
  children,
  as: Tag = "div",
  className,
  delay,
  threshold = 0.15,
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced motion
    if (typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true);
            if (once) observer.disconnect();
          } else if (!once) {
            setRevealed(false);
          }
        }
      },
      { threshold, rootMargin: "0px 0px -50px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  return (
    <Tag
      ref={ref as any}
      className={cn("reveal", revealed && "revealed", className)}
      data-delay={delay}
    >
      {children}
    </Tag>
  );
}
