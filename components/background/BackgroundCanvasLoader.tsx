"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// WebGL needs window, so three + R3F load only in the browser and stay out of the
// server render and the initial JS bundle.
const BackgroundCanvas = dynamic(() => import("./BackgroundCanvas"), { ssr: false });

// Phones: slow CPUs, and nothing to react to until a touch anyway. 767px matches Tailwind's
// md breakpoint (768px and up is the desktop layout).
const PHONE_QUERY = "(max-width: 767px), (pointer: coarse)";
const FIRST_INTERACTION = ["scroll", "touchstart", "pointerdown", "keydown"] as const;

/**
 * Mounts the canvas late so the three.js chunk (~900 KB unminified) never competes with the
 * hero image (the LCP element), fonts or hydration. The dynamic import starts on mount.
 * - Desktop: once the page has loaded and the browser is idle.
 * - Phones: on the first scroll, touch or key press. Parsing three.js and starting WebGL
 *   costs a phone ~250 ms of main thread (measured as Total Blocking Time), so it waits
 *   until the visitor is engaging with the page rather than landing on it.
 */
export function BackgroundCanvasLoader() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    if (window.matchMedia(PHONE_QUERY).matches) {
      // Whichever event comes first wins; the other three listeners are removed with it.
      const onFirst = () => {
        removeAll();
        setReady(true);
      };
      const removeAll = () => {
        for (const type of FIRST_INTERACTION) window.removeEventListener(type, onFirst);
      };
      for (const type of FIRST_INTERACTION) window.addEventListener(type, onFirst, { passive: true });
      return removeAll;
    }

    const schedule = () => {
      if ("requestIdleCallback" in window) {
        idleId = window.requestIdleCallback(() => setReady(true), { timeout: 2000 });
      } else {
        timeoutId = setTimeout(() => setReady(true), 200);
      }
    };

    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return () => {
      window.removeEventListener("load", schedule);
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, []);

  return ready ? <BackgroundCanvas /> : null;
}
