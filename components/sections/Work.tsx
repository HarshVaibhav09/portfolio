import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cardClass } from "@/components/ui/card-styles";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { TiltCard } from "@/components/ui/TiltCard";
import { projects, sections, work, type Project } from "@/lib/content";
import { cn } from "@/lib/utils";

function StackTags({ items }: { items: string[] }) {
  return (
    <ul aria-label={work.stackLabel} className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li key={item}>
          <Badge>{item}</Badge>
        </li>
      ))}
    </ul>
  );
}

function ProjectLinks({ project }: { project: Project }) {
  return (
    <div className="flex flex-wrap gap-2">
      {/* Live only where a live URL exists (MailWarden and NyayaSetu have none) */}
      {project.links.live && (
        <Button
          href={project.links.live}
          variant="outline"
          size="sm"
          aria-label={`${work.liveAria} ${project.name}`}
        >
          <ExternalLink className="size-4" aria-hidden="true" />
          {work.live}
        </Button>
      )}
      <Button
        href={project.links.code}
        variant="ghost"
        size="sm"
        aria-label={`${work.codeAria} ${project.name}`}
      >
        <SocialIcon name="github" className="size-4" />
        {work.code}
      </Button>
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 text-muted">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5">
          <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" />
          {item}
        </li>
      ))}
    </ul>
  );
}

function FeaturedProject({ project }: { project: Project }) {
  return (
    // Large panel: card styling only, no tilt.
    <article className={cn(cardClass, "grid gap-8 p-6 md:p-8 lg:grid-cols-[1.2fr_1fr]")}>
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center gap-3">
          <Badge className="border-accent/40 text-accent">{work.featuredLabel}</Badge>
          {project.date && <span className="font-mono text-xs text-muted">{project.date}</span>}
        </div>
        <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">{project.name}</h3>
        <p className="text-lg text-text/85">{project.oneLiner}</p>
        <BulletList items={project.highlights} />
        <StackTags items={project.stack} />
        <div className="mt-auto pt-2">
          <ProjectLinks project={project} />
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-3 self-start">
        {project.metrics?.map((metric) => (
          <div
            key={metric.label}
            className="flex flex-col-reverse justify-end rounded-xl border border-border bg-bg-raised/50 p-4"
          >
            <dt className="mt-1 font-mono text-xs text-muted">{metric.label}</dt>
            <dd className="text-lg font-semibold text-text md:text-xl lg:text-2xl">{metric.value}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <TiltCard className="h-full p-6">
      <article className="flex h-full flex-col gap-4">
        <div>
          {project.date && <p className="font-mono text-xs text-muted">{project.date}</p>}
          <h3 className="mt-1 text-xl font-semibold tracking-tight">{project.name}</h3>
        </div>
        <p className="text-text/85">{project.oneLiner}</p>
        <BulletList items={project.highlights.slice(0, 2)} />
        {project.note && (
          <p className="border-l-2 border-accent-2/40 pl-3 text-sm text-muted">{project.note}</p>
        )}
        <StackTags items={project.stack} />
        <div className="mt-auto pt-2">
          <ProjectLinks project={project} />
        </div>
      </article>
    </TiltCard>
  );
}

export function Work() {
  const featured = projects.find((p) => p.featured);
  const others = projects.filter((p) => !p.featured);

  return (
    <Section id="work" {...sections.work}>
      {featured && (
        <Reveal>
          <FeaturedProject project={featured} />
        </Reveal>
      )}

      <Reveal className="mt-12">
        <h3 className="font-mono text-sm uppercase tracking-widest text-muted">{work.moreHeading}</h3>
      </Reveal>
      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {others.map((project, i) => (
          <Reveal key={project.slug} className="h-full" delay={i * 0.08}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
