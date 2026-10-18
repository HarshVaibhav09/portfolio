"use client";

import type { ReactNode } from "react";
// `m` needs no feature bundle here: the tilt only drives motion values in `style`.
import { m } from "motion/react";
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
    <m.div className={cn("relative flex flex-col", cardClass, className)} style={style} {...handlers}>
      {/* z-index -10 sits above the card background but below its content */}
      {active && (
        <m.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit]"
          style={glareStyle}
        />
      )}
      {children}
    </m.div>
  );
}
