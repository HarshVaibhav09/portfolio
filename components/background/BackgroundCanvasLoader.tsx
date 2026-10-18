"use client";

import dynamic from "next/dynamic";

// WebGL needs window, so three + R3F load only in the browser and stay out of the
// server render and the initial JS bundle.
const BackgroundCanvas = dynamic(() => import("./BackgroundCanvas"), { ssr: false });

export function BackgroundCanvasLoader() {
  return <BackgroundCanvas />;
}
