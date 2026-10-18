import { Award, GraduationCap, MapPin, Target, type LucideIcon } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { about, sections, type FactIconKey } from "@/lib/content";

const factIcons: Record<FactIconKey, LucideIcon> = {
  "graduation-cap": GraduationCap,
  "map-pin": MapPin,
  target: Target,
  award: Award,
};

export function About() {
  return (
    <Section id="about" {...sections.about}>
      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
        <div className="space-y-5 text-lg leading-relaxed text-text/85">
          {about.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <aside
          aria-labelledby="about-facts-title"
          className="h-fit rounded-2xl border border-border bg-bg-alt/60 p-6 backdrop-blur-[10px] transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-accent/40"
        >
          <h3 id="about-facts-title" className="font-mono text-sm uppercase tracking-widest text-accent">
            {about.factsTitle}
          </h3>
          <dl className="mt-5 space-y-5">
            {about.facts.map((fact) => {
              const Icon = factIcons[fact.icon];
              return (
                <div key={fact.label} className="flex items-start gap-3">
                  <Icon className="mt-0.5 size-5 shrink-0 text-accent-2" aria-hidden="true" />
                  <div>
                    <dt className="font-mono text-xs uppercase tracking-wider text-muted">{fact.label}</dt>
                    <dd className="mt-0.5 text-text">{fact.value}</dd>
                  </div>
                </div>
              );
            })}
          </dl>
        </aside>
      </div>
    </Section>
  );
}
