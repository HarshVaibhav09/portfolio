"use client";

import { useEffect, useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const TYPE_MS = 70;
const DELETE_MS = 35;
const HOLD_MS = 1600; // word fully typed
const PAUSE_MS = 300; // gap before the next word starts

interface RotatingTextProps {
  prefix: string;
  words: readonly string[];
  /** Page-relative time (ms) at which typing starts, so it begins after the headline reveal. */
  startAtMs: number;
}

export function RotatingText({ prefix, words, startAtMs }: RotatingTextProps) {
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  // The server HTML contains the first word, so no-JS and reduced-motion users see a real line.
  const [text, setText] = useState(words[0]);

  useEffect(() => {
    if (reducedMotion) return;

    let timer: ReturnType<typeof setTimeout>;
    let wordIndex = 0;
    let length = 0;
    let deleting = false;

    const tick = () => {
      const word = words[wordIndex];
      if (!deleting) {
        length++;
        setText(word.slice(0, length));
        if (length === word.length) {
          deleting = true;
          timer = setTimeout(tick, HOLD_MS);
        } else {
          timer = setTimeout(tick, TYPE_MS);
        }
      } else {
        length--;
        setText(word.slice(0, length));
        if (length === 0) {
          deleting = false;
          wordIndex = (wordIndex + 1) % words.length;
          timer = setTimeout(tick, PAUSE_MS);
        } else {
          timer = setTimeout(tick, DELETE_MS);
        }
      }
    };

    // The line is still invisible (CSS fade-up has not started), so clearing it is not seen.
    const clear = setTimeout(() => setText(""), 0);
    // performance.now() is time since navigation start, roughly when the CSS reveal began.
    timer = setTimeout(tick, Math.max(0, startAtMs - performance.now()));

    return () => {
      clearTimeout(clear);
      clearTimeout(timer);
    };
  }, [reducedMotion, words, startAtMs]);

  return (
    <p className="min-h-7 font-mono text-base text-muted md:text-lg">
      {/* Screen readers get the whole sentence once, not every typed character. */}
      <span className="sr-only">
        {prefix}
        {words.join(", ")}
      </span>
      <span aria-hidden="true">
        {prefix}
        <span className="text-text">{reducedMotion ? words[0] : text}</span>
        <span className="hero-caret ml-0.5 inline-block h-[1.1em] w-0.5 translate-y-[0.2em] bg-accent motion-reduce:hidden" />
      </span>
    </p>
  );
}
