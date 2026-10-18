"use client";

import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { Briefcase, Clock, Code, House, Mail, Menu, User, X, type LucideIcon } from "lucide-react";
import { nav, site, ui, type NavItem, type SectionId, type UiIconKey } from "@/lib/content";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";

const icons: Record<UiIconKey, LucideIcon> = {
  home: House,
  user: User,
  briefcase: Briefcase,
  code: Code,
  clock: Clock,
  mail: Mail,
};

const MENU_ID = "mobile-menu";
const SCROLLED_AFTER_PX = 20;
const sectionIds = nav.map((item) => item.id);
const lastSectionId = sectionIds[sectionIds.length - 1];

/**
 * Tracks scroll state and which section is in view.
 *
 * IntersectionObserver watches a thin band 30% down the viewport (clear of the fixed
 * 64px navbar). Sections currently touching that band are kept in a Set; the last one
 * in page order wins. The contact section is short, so it may never reach the band:
 * a scroll listener marks "at bottom" and forces it active in that case.
 */
function useNavState() {
  const [scrolled, setScrolled] = useState(false);
  const [atBottom, setAtBottom] = useState(false);
  const [observed, setObserved] = useState<SectionId>(sectionIds[0]);

  useEffect(() => {
    const inBand = new Set<SectionId>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id as SectionId;
          if (entry.isIntersecting) inBand.add(id);
          else inBand.delete(id);
        }
        const current = sectionIds.filter((id) => inBand.has(id)).pop();
        if (current) setObserved(current);
      },
      { rootMargin: "-30% 0px -65% 0px" },
    );
    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const el = document.documentElement;
      setScrolled(window.scrollY > SCROLLED_AFTER_PX);
      setAtBottom(window.scrollY + el.clientHeight >= el.scrollHeight - 2);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return { scrolled, active: atBottom ? lastSectionId : observed };
}

function NavLink({
  item,
  active,
  onClick,
  stacked,
}: {
  item: NavItem;
  active: boolean;
  onClick?: () => void;
  stacked?: boolean;
}) {
  const Icon = icons[item.icon];
  return (
    <a
      href={`#${item.id}`}
      onClick={onClick}
      aria-current={active ? "location" : undefined}
      className={cn(
        "relative inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-accent",
        // 2px underline that grows from 0 to full width on hover / when active
        "after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-accent after:transition-[width] after:duration-300",
        "hover:after:w-full",
        stacked ? "w-full py-3 text-base" : "py-2",
        active ? "text-accent after:w-full" : "text-muted",
      )}
    >
      <Icon className="size-4" aria-hidden="true" />
      {item.label}
    </a>
  );
}

export function Navbar() {
  const { scrolled, active } = useNavState();
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const close = useCallback((restoreFocus: boolean) => {
    setOpen(false);
    if (restoreFocus) buttonRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close(true);
    };
    const onPointerDown = (e: PointerEvent) => {
      if (headerRef.current?.contains(e.target as Node)) return;
      // Only pull focus back if it was inside the menu; never steal it from what was clicked.
      close(headerRef.current?.contains(document.activeElement) ?? false);
    };
    const onResize = () => {
      if (window.matchMedia("(min-width: 768px)").matches) close(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("resize", onResize);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("resize", onResize);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, close]);

  const scrollToTop = (e: MouseEvent) => {
    e.preventDefault();
    close(false);
    // Default behavior follows CSS scroll-behavior, which reduced motion sets to auto.
    window.scrollTo({ top: 0 });
  };

  return (
    <header
      ref={headerRef}
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b border-accent/10 backdrop-blur-[20px] transition-[background-color,box-shadow] duration-300",
        // 20% black reads as a gray band on white, so light mode gets a softer shadow.
        scrolled ? "bg-bg-alt/95 shadow-lg shadow-black/6 dark:shadow-black/20" : "bg-bg-alt/80",
      )}
    >
      <nav
        aria-label={ui.navLabel}
        className="mx-auto flex h-16 w-full max-w-[1200px] items-center gap-6 px-4 md:px-8"
      >
        <a
          href="#home"
          onClick={scrollToTop}
          aria-label={ui.logoLabel}
          className="text-gradient relative text-xl font-bold tracking-tight after:absolute after:-inset-2"
        >
          {site.logo}
        </a>

        <ul className="ml-auto hidden items-center gap-6 md:flex lg:gap-8">
          {nav.map((item) => (
            <li key={item.id}>
              <NavLink item={item} active={active === item.id} />
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <ThemeToggle />
          <button
            ref={buttonRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls={MENU_ID}
            aria-label={ui.menu}
            className="relative grid size-10 place-items-center rounded-full text-text transition-colors after:absolute after:-inset-0.5 hover:bg-bg-raised md:hidden"
          >
            {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
          </button>
        </div>

        <div
          id={MENU_ID}
          className={cn(
            "absolute inset-x-0 top-full max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-accent/10 bg-bg-alt/95 backdrop-blur-[20px] md:hidden",
            open ? "block" : "hidden",
          )}
        >
          <ul className="flex flex-col px-4 py-3">
            {nav.map((item) => (
              <li key={item.id}>
                {/* close(false): the fragment navigation sets the focus starting point, so the
                    next Tab continues from the chosen section, not from the menu button. */}
                <NavLink item={item} active={active === item.id} stacked onClick={() => close(false)} />
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
