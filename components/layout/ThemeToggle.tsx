"use client";

import { useLayoutEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { getTheme, THEME_STORAGE_KEY, useTheme, type Theme } from "@/hooks/useTheme";
import { ui } from "@/lib/content";

export function ThemeToggle() {
  const theme = useTheme();

  // React Strict Mode (dev) remounts and can reset attributes on <html>, wiping what the
  // inline script set. Re-apply the saved theme before paint. No-op in production.
  useLayoutEffect(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === "light" || saved === "dark") {
        document.documentElement.setAttribute("data-theme", saved);
      }
    } catch {
      // localStorage can be blocked (private mode, strict settings). Keep the current theme.
    }
  }, []);

  const toggle = () => {
    const next: Theme = getTheme() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Theme still switches for this visit even if it can't be saved.
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? ui.switchToLight : ui.switchToDark}
      className="group relative grid size-10 shrink-0 place-items-center rounded-full after:absolute after:-inset-0.5 bg-accent/10 text-accent transition-colors hover:bg-accent/20"
    >
      {/* Icons swap with CSS on [data-theme], so the right one shows before hydration. */}
      <span className="grid place-items-center transition-transform duration-300 group-hover:rotate-180">
        <Sun className="size-5 in-data-[theme=light]:hidden" aria-hidden="true" />
        <Moon className="hidden size-5 in-data-[theme=light]:block" aria-hidden="true" />
      </span>
    </button>
  );
}
