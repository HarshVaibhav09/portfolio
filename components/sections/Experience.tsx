import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { experience, sections } from "@/lib/content";
import { Achievements } from "./Achievements";

export function Experience() {
  return (
    <Section id="experience" {...sections.experience}>
      <ol className="relative space-y-12 border-l border-border pl-8 md:pl-10">
        {experience.map((job) => (
          <li key={`${job.company}-${job.start}`}>
            <Reveal className="relative">
              {/* Dot centered on the timeline hairline (offset = padding-left + half the dot) */}
              <span
                aria-hidden="true"
                className="absolute top-1.5 -left-[38px] size-3 rounded-full bg-accent ring-4 ring-bg md:-left-[46px]"
              />
              <h3 className="text-xl font-semibold tracking-tight">{job.role}</h3>
              <p className="mt-1 text-text/85">
                {job.company} <span className="text-muted">· {job.mode}</span>
              </p>
              <p className="mt-1 font-mono text-xs text-muted">
                {job.start} to {job.end}
              </p>
              <ul className="mt-4 space-y-2 text-muted">
                {job.highlights.map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" />
                    {item}
                  </li>
                ))}
              </ul>
              {job.ownership && (
                <p className="mt-4 border-l-2 border-accent-2/40 pl-3 text-sm text-muted">{job.ownership}</p>
              )}
            </Reveal>
          </li>
        ))}
      </ol>

      <div className="mt-20">
        <Achievements />
      </div>
    </Section>
  );
}
