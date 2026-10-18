import { GradientOrbs } from "@/components/background/GradientOrbs";
import { BackToTop } from "@/components/layout/BackToTop";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { Section } from "@/components/ui/Section";
import { nav, profile, sections } from "@/lib/content";

export default function Home() {
  const [home, ...rest] = nav;

  return (
    <>
      <GradientOrbs />
      <ScrollProgress />
      <main>
        {/* Placeholder hero until the Hero phase; holds the page's single h1. */}
        <section id={home.id} className="grid min-h-screen place-items-center px-4 text-center">
          <div>
            <p className="font-mono text-sm uppercase tracking-widest text-accent">{sections.home.label}</p>
            <h1 className="mt-3 text-4xl font-semibold md:text-6xl">
              {profile.greeting} <span className="text-gradient">{profile.name}</span>
            </h1>
            <p className="mt-4 text-lg text-muted">{profile.description}</p>
          </div>
        </section>

        {rest.map(({ id }) => (
          <Section key={id} id={id} {...sections[id]}>
            <div className="h-64 rounded-2xl border border-border bg-bg-alt/60 backdrop-blur-[10px]" />
          </Section>
        ))}
      </main>
      <BackToTop />
    </>
  );
}
