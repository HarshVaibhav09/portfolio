"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useTheme, type Theme } from "@/hooks/useTheme";

/* ------------------------------------------------------------------
   Tuning. Distances are world units: the default camera (z=5, fov 75)
   sees about 7.7 units of height at z=0.
   ------------------------------------------------------------------ */
const BASE_SPEED = 0.12; // drift speed, units per second
const POINT_SIZE = 0.09;
const TARGET_NEIGHBORS = 3.5; // link distance is sized so each particle averages about this many lines
const LINK_DIST_MIN = 0.7;
const LINK_DIST_MAX = 1.4;
const REPEL_RADIUS = 1.6;
const REPEL_STRENGTH = 2.4; // acceleration at the cursor, units per second squared
const SPEED_RECOVERY = 1.5; // how fast pushed particles ease back to drift speed, per second
const MAX_DT = 0.05; // clamp so a tab switch or long frame never teleports particles

// Particle colors come from the --accent / --accent-2 tokens in globals.css, so they track
// the theme exactly (#FF8E53 / #00D4FF dark, #B43A0A / #0E7490 light).
const THEME_STYLE: Record<Theme, { blending: THREE.Blending; pointOpacity: number; lineOpacity: number }> = {
  dark: { blending: THREE.AdditiveBlending, pointOpacity: 0.7, lineOpacity: 0.22 },
  light: { blending: THREE.NormalBlending, pointOpacity: 0.45, lineOpacity: 0.15 },
};

/* ------------------------------------------------------------------
   Simulation. Plain functions over typed arrays, kept outside React:
   React only holds the Field object; these mutate it in place.
   ------------------------------------------------------------------ */

interface Field {
  count: number;
  positions: Float32Array; // xyz per particle
  velocities: Float32Array; // xyz per particle (z unused)
  colors: Float32Array; // rgb per particle
  linePositions: Float32Array; // 2 vertices * xyz per segment
  lineColors: Float32Array; // 2 vertices * rgba per segment
  lineOpacity: number;
  points: THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial>;
  lines: THREE.LineSegments<THREE.BufferGeometry, THREE.LineBasicMaterial>;
}

/** Soft round dot so points are not rendered as squares. */
function createDotTexture() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.45, "rgba(255,255,255,0.75)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/** Allocates every buffer once. Nothing is allocated per frame. */
function createField(count: number, width: number, height: number): Field {
  const maxSegments = (count * (count - 1)) / 2;
  const positions = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const linePositions = new Float32Array(maxSegments * 2 * 3);
  const lineColors = new Float32Array(maxSegments * 2 * 4); // RGBA: alpha fades lines in both blend modes

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = BASE_SPEED * (0.5 + Math.random() * 0.5);
    positions[i * 3] = (Math.random() - 0.5) * width;
    positions[i * 3 + 1] = (Math.random() - 0.5) * height;
    velocities[i * 3] = Math.cos(angle) * speed;
    velocities[i * 3 + 1] = Math.sin(angle) * speed;
  }

  const pointGeometry = new THREE.BufferGeometry();
  pointGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage));
  pointGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3).setUsage(THREE.DynamicDrawUsage));
  lineGeometry.setAttribute("color", new THREE.BufferAttribute(lineColors, 4).setUsage(THREE.DynamicDrawUsage));
  lineGeometry.setDrawRange(0, 0);

  const points = new THREE.Points(
    pointGeometry,
    new THREE.PointsMaterial({
      size: POINT_SIZE,
      map: createDotTexture(),
      vertexColors: true,
      transparent: true,
      depthWrite: false,
    }),
  );
  const lines = new THREE.LineSegments(
    lineGeometry,
    new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false }),
  );
  // Positions change every frame, so a bounding sphere computed once would cull wrongly.
  points.frustumCulled = false;
  lines.frustumCulled = false;

  return {
    count,
    positions,
    velocities,
    colors,
    linePositions,
    lineColors,
    lineOpacity: THEME_STYLE.dark.lineOpacity,
    points,
    lines,
  };
}

function disposeField({ points, lines }: Field) {
  points.geometry.dispose();
  points.material.map?.dispose();
  points.material.dispose();
  lines.geometry.dispose();
  lines.material.dispose();
}

/** Blending, opacity and particle colors for a theme. Runs only on theme change. */
function applyTheme(field: Field, theme: Theme) {
  const style = THEME_STYLE[theme];
  const css = getComputedStyle(document.documentElement);
  const palette = [
    new THREE.Color(css.getPropertyValue("--accent").trim() || "#FF8E53"),
    new THREE.Color(css.getPropertyValue("--accent-2").trim() || "#00D4FF"),
  ];

  const { colors, points, lines } = field;
  for (let i = 0; i < field.count; i++) {
    const c = palette[i % 2]; // alternate warm orange and cyan
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }
  points.geometry.attributes.color.needsUpdate = true;

  points.material.blending = lines.material.blending = style.blending;
  points.material.opacity = style.pointOpacity;
  points.material.needsUpdate = lines.material.needsUpdate = true;
  field.lineOpacity = style.lineOpacity;
}

/** Drift, cursor repulsion and bouncing at the visible viewport edges. */
function stepParticles(
  field: Field,
  dt: number,
  halfW: number,
  halfH: number,
  repel: boolean,
  cursorX: number,
  cursorY: number,
) {
  const { count, positions: p, velocities: v } = field;
  const repelR2 = REPEL_RADIUS * REPEL_RADIUS;

  for (let i = 0; i < count; i++) {
    const ix = i * 3;
    const iy = ix + 1;
    let vx = v[ix];
    let vy = v[iy];

    if (repel) {
      const dx = p[ix] - cursorX;
      const dy = p[iy] - cursorY;
      const d2 = dx * dx + dy * dy;
      if (d2 < repelR2 && d2 > 1e-6) {
        const d = Math.sqrt(d2);
        // Force grows linearly as the particle gets closer; divide by d to normalize direction.
        const f = (REPEL_STRENGTH * (1 - d / REPEL_RADIUS) * dt) / d;
        vx += dx * f;
        vy += dy * f;
      }
    }

    // Ease pushed particles back to drift speed so pushes do not accumulate.
    const speed = Math.hypot(vx, vy);
    if (speed > BASE_SPEED) {
      const k = Math.max(BASE_SPEED / speed, 1 - SPEED_RECOVERY * dt);
      vx *= k;
      vy *= k;
    }

    let x = p[ix] + vx * dt;
    let y = p[iy] + vy * dt;
    if (x < -halfW) {
      x = -halfW;
      vx = Math.abs(vx);
    } else if (x > halfW) {
      x = halfW;
      vx = -Math.abs(vx);
    }
    if (y < -halfH) {
      y = -halfH;
      vy = Math.abs(vy);
    } else if (y > halfH) {
      y = halfH;
      vy = -Math.abs(vy);
    }

    p[ix] = x;
    p[iy] = y;
    v[ix] = vx;
    v[iy] = vy;
  }
  field.points.geometry.attributes.position.needsUpdate = true;
}

/** Rebuilds line segments: n(n-1)/2 pair checks, sqrt only for pairs that draw a line. */
function updateLinks(field: Field, halfW: number, halfH: number) {
  const { count, positions: p, colors: c, linePositions: lp, lineColors: lc } = field;

  // Size the link distance to the viewport so density looks the same on phone and desktop.
  const linkDist = Math.min(
    LINK_DIST_MAX,
    Math.max(LINK_DIST_MIN, Math.sqrt((TARGET_NEIGHBORS * 4 * halfW * halfH) / (Math.PI * count))),
  );
  const linkDist2 = linkDist * linkDist;
  const maxAlpha = field.lineOpacity;

  let segments = 0;
  for (let i = 0; i < count; i++) {
    const ix = i * 3;
    for (let j = i + 1; j < count; j++) {
      const jx = j * 3;
      const dx = p[ix] - p[jx];
      const dy = p[ix + 1] - p[jx + 1];
      const d2 = dx * dx + dy * dy;
      if (d2 >= linkDist2) continue;

      const alpha = (1 - Math.sqrt(d2) / linkDist) * maxAlpha;
      const o = segments * 6;
      lp[o] = p[ix];
      lp[o + 1] = p[ix + 1];
      lp[o + 2] = 0;
      lp[o + 3] = p[jx];
      lp[o + 4] = p[jx + 1];
      lp[o + 5] = 0;

      const co = segments * 8;
      lc[co] = c[ix];
      lc[co + 1] = c[ix + 1];
      lc[co + 2] = c[ix + 2];
      lc[co + 3] = alpha;
      lc[co + 4] = c[jx];
      lc[co + 5] = c[jx + 1];
      lc[co + 6] = c[jx + 2];
      lc[co + 7] = alpha;
      segments++;
    }
  }

  const geometry = field.lines.geometry;
  geometry.setDrawRange(0, segments * 2);
  // Upload only the part of each buffer that is in use this frame.
  const posAttr = geometry.attributes.position as THREE.BufferAttribute;
  const colorAttr = geometry.attributes.color as THREE.BufferAttribute;
  posAttr.clearUpdateRanges();
  posAttr.addUpdateRange(0, segments * 6);
  posAttr.needsUpdate = true;
  colorAttr.clearUpdateRanges();
  colorAttr.addUpdateRange(0, segments * 8);
  colorAttr.needsUpdate = true;
}

/* ------------------------------------------------------------------
   Component
   ------------------------------------------------------------------ */

interface NeuralFieldProps {
  count: number;
  animate: boolean;
}

export function NeuralField({ count, animate }: NeuralFieldProps) {
  const get = useThree((s) => s.get);
  const invalidate = useThree((s) => s.invalidate);
  const theme = useTheme();
  const pointerActive = useRef(false);

  // Re-created only when the particle count changes (desktop <-> mobile breakpoint).
  const field = useMemo(() => {
    const { width, height } = get().viewport;
    return createField(count, width, height);
  }, [count, get]);

  // Free GPU memory when the field is replaced or the canvas unmounts.
  useEffect(() => () => disposeField(field), [field]);

  useEffect(() => {
    applyTheme(field, theme);
    invalidate(); // in demand mode (reduced motion) nothing redraws on its own
  }, [field, theme, invalidate]);

  // Only repel while a real cursor or touch is on the page; R3F's pointer starts at (0,0).
  useEffect(() => {
    const onMove = () => {
      pointerActive.current = true;
    };
    const onOut = (e: PointerEvent) => {
      if (!e.relatedTarget) pointerActive.current = false; // left the window
    };
    const onEnd = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") pointerActive.current = false; // finger lifted
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerout", onOut, { passive: true });
    window.addEventListener("pointerup", onEnd, { passive: true });
    window.addEventListener("pointercancel", onEnd, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerout", onOut);
      window.removeEventListener("pointerup", onEnd);
      window.removeEventListener("pointercancel", onEnd);
    };
  }, []);

  // Runs every rendered frame, outside React: no state, no re-renders.
  useFrame((state, delta) => {
    // Read the viewport every frame so a resize needs no re-render.
    const halfW = state.viewport.width / 2;
    const halfH = state.viewport.height / 2;

    if (animate) {
      const dt = Math.min(delta, MAX_DT);
      // pointer is normalized [-1, 1]; scale to world units at z=0.
      const cursorX = state.pointer.x * halfW;
      const cursorY = state.pointer.y * halfH;
      stepParticles(field, dt, halfW, halfH, pointerActive.current, cursorX, cursorY);
    }
    updateLinks(field, halfW, halfH);
  });

  return (
    <>
      <primitive object={field.lines} />
      <primitive object={field.points} />
    </>
  );
}
