"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { ui } from "@/lib/content";
import { cn } from "@/lib/utils";

const SHOW_AFTER_PX = 600;

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      setVisible(window.scrollY > SHOW_AFTER_PX);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const scrollToTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label={ui.backToTop}
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      className={cn(
        "fixed bottom-6 right-6 z-50 grid size-12 place-items-center rounded-full",
        "border border-border bg-bg-alt/80 text-accent shadow-lg backdrop-blur-md",
        "transition-all duration-300 hover:-translate-y-1 hover:border-accent/40",
        visible ? "opacity-100" : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      <ArrowUp className="size-5" aria-hidden="true" />
    </button>
  );
}
