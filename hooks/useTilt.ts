import type { PointerEvent } from "react";
import { useMotionTemplate, useMotionValue, useSpring, useTransform, type MotionStyle } from "motion/react";
import { useMediaQuery } from "./useMediaQuery";

const SPRING = { stiffness: 220, damping: 22, mass: 0.6 };
const GLARE_SPRING = { stiffness: 150, damping: 20 };

interface TiltOptions {
  /** Max rotation in degrees. */
  max?: number;
  perspective?: number;
  enabled?: boolean;
}

export interface Tilt<T extends HTMLElement> {
  /** False on touch devices, under reduced motion, or when disabled. */
  active: boolean;
  /** Card style (motion values); undefined when inactive so the card stays flat. */
  style: MotionStyle | undefined;
  glareStyle: MotionStyle;
  handlers: { onPointerMove?: (e: PointerEvent<T>) => void; onPointerLeave?: () => void };
}

/**
 * Pointer-based 3D tilt with a soft moving glare.
 *
 * The pointer position only ever writes to motion values; motion applies them to the
 * element's style directly, so moving the mouse causes no React re-render.
 * Off for touch devices (pointer: coarse) and under prefers-reduced-motion.
 */
export function useTilt<T extends HTMLElement>({
  max = 8,
  perspective = 1000,
  enabled = true,
}: TiltOptions = {}): Tilt<T> {
  const coarse = useMediaQuery("(pointer: coarse)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const active = enabled && !coarse && !reducedMotion;

  // Pointer position inside the card, -0.5 (left/top) to 0.5 (right/bottom).
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const hover = useMotionValue(0);

  const sx = useSpring(px, SPRING);
  const sy = useSpring(py, SPRING);
  const glareOpacity = useSpring(hover, GLARE_SPRING);

  // Pointer near the top tilts the top edge away; near the right tilts the right edge away.
  const rotateX = useTransform(sy, [-0.5, 0.5], [max, -max]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-max, max]);

  const glareX = useTransform(sx, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(sy, [-0.5, 0.5], [0, 100]);
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, var(--glare), transparent 55%)`;

  const onPointerMove = (e: PointerEvent<T>) => {
    if (e.pointerType === "touch") return;
    // Read the rect on every move so scrolling while hovering can never leave it stale.
    const rect = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
    hover.set(1);
  };

  const onPointerLeave = () => {
    px.set(0);
    py.set(0);
    hover.set(0);
  };

  return {
    active,
    style: active ? { rotateX, rotateY, transformPerspective: perspective } : undefined,
    glareStyle: { background: glareBackground, opacity: glareOpacity },
    handlers: active ? { onPointerMove, onPointerLeave } : {},
  };
}
