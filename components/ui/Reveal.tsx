"use client";

import type { ReactNode } from "react";
import { LazyMotion, m } from "motion/react";

// `m` + LazyMotion instead of `motion`: the full `motion` component bundles every feature
// (layout, drag, projection) into first-load JS. The import() promise is cached, so every
// Reveal shares one features chunk.
const loadFeatures = () => import("@/lib/motion-features").then((mod) => mod.default);

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Seconds. Use small steps to stagger siblings. */
  delay?: number;
}

/**
 * Fade up (16px) once when scrolled into view.
 * Reduced motion is handled in globals.css via [data-reveal], not in JS, because the
 * server cannot know the preference and a JS switch would flash hidden content.
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <m.div
        data-reveal
        className={className}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, ease: "easeOut", delay }}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}
