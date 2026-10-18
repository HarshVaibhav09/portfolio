"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { useTilt } from "@/hooks/useTilt";
import { cn } from "@/lib/utils";
import { cardClass } from "./card-styles";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
}

export function TiltCard({ children, className }: TiltCardProps) {
  const { active, style, glareStyle, handlers } = useTilt<HTMLDivElement>();

  return (
    <motion.div className={cn("relative flex flex-col", cardClass, className)} style={style} {...handlers}>
      {/* z-index -10 sits above the card background but below its content */}
      {active && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit]"
          style={glareStyle}
        />
      )}
      {children}
    </motion.div>
  );
}
