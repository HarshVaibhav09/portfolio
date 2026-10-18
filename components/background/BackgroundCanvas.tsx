"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { NeuralField } from "@/components/three/NeuralField";
import { useMediaQuery } from "@/hooks/useMediaQuery";

/**
 * The page's only WebGL render loop. Loaded client-only via BackgroundCanvasLoader.
 * Layering: orbs (-z-10) < this canvas (-z-[5]) < page content < Navbar (z-50).
 */
export default function BackgroundCanvas() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onVisibility = () => setHidden(document.hidden);
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // "demand" renders once (and on resize or theme change) with no animation loop.
  const frameloop = hidden ? "never" : reducedMotion ? "demand" : "always";

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-[5]">
      <Canvas
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        gl={{ alpha: true, powerPreference: "low-power" }}
        frameloop={frameloop}
        // Listen on <body> so the cursor is tracked over page content, while the canvas
        // itself stays pointer-events: none and never blocks clicks.
        eventSource={document.body}
        eventPrefix="client"
      >
        <NeuralField count={isMobile ? 50 : 120} animate={!reducedMotion} />
      </Canvas>
    </div>
  );
}
