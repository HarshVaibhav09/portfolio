"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// WebGL needs window, so three + R3F load only in the browser and stay out of the
// server render and the initial JS bundle.
const BackgroundCanvas = dynamic(() => import("./BackgroundCanvas"), { ssr: false });

/**
 * Mounts the canvas only after the page has loaded and the browser is idle. The three.js
 * chunk (~900 KB unminified) then never competes with the hero image (the LCP element),
 * fonts or hydration for bandwidth and main-thread time. The dynamic import starts on mount.
 */
export function BackgroundCanvasLoader() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

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
