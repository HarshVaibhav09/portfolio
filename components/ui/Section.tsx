import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

interface SectionProps {
  id: string;
  label: string;
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

export function Section({ id, label, title, description, children, className }: SectionProps) {
  const titleId = `${id}-title`;

  return (
    <section id={id} aria-labelledby={titleId} className={cn("py-24", className)}>
      <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8">
        <Reveal>
          <header className="mb-12">
            <p className="font-mono text-sm uppercase tracking-widest text-accent">{label}</p>
            <h2 id={titleId} className="mt-3 text-3xl font-semibold tracking-tight text-text md:text-4xl">
              {title}
            </h2>
            {description && <p className="mt-3 max-w-2xl text-lg text-muted">{description}</p>}
          </header>
        </Reveal>
        {children}
      </div>
    </section>
  );
}
