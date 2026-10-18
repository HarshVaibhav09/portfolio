"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";

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
    <motion.div
      data-reveal
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}
