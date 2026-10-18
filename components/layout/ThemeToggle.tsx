"use client";

import { useLayoutEffect, useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { ui } from "@/lib/content";

type Theme = "dark" | "light";

const STORAGE_KEY = "theme";

// <html data-theme> is the source of truth. The inline script in layout.tsx sets it
// before paint; this store lets React read it without a setState-in-effect.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

const getSnapshot = (): Theme => (document.documentElement.dataset.theme === "light" ? "light" : "dark");
const getServerSnapshot = (): Theme => "dark";

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // React Strict Mode (dev) remounts and can reset attributes on <html>, wiping what the
  // inline script set. Re-apply the saved theme before paint. No-op in production.
  useLayoutEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "light" || saved === "dark") {
        document.documentElement.setAttribute("data-theme", saved);
      }
    } catch {
      // localStorage can be blocked (private mode, strict settings). Keep the current theme.
    }
  }, []);

  const toggle = () => {
    const next: Theme = getSnapshot() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Theme still switches for this visit even if it can't be saved.
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? ui.switchToLight : ui.switchToDark}
      className="group grid size-10 shrink-0 place-items-center rounded-full bg-accent/10 text-accent transition-colors hover:bg-accent/20"
    >
      {/* Icons swap with CSS on [data-theme], so the right one shows before hydration. */}
      <span className="grid place-items-center transition-transform duration-300 group-hover:rotate-180">
        <Sun className="size-5 in-data-[theme=light]:hidden" aria-hidden="true" />
        <Moon className="hidden size-5 in-data-[theme=light]:block" aria-hidden="true" />
      </span>
    </button>
  );
}
