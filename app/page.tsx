import { GradientOrbs } from "@/components/background/GradientOrbs";
import { BackToTop } from "@/components/layout/BackToTop";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { About } from "@/components/sections/About";
import { Hero } from "@/components/sections/Hero";
import { Section } from "@/components/ui/Section";
import { nav, sections } from "@/lib/content";

// Sections still to build in later phases.
const placeholders = nav.filter(({ id }) => id !== "home" && id !== "about");

export default function Home() {
  return (
    <>
      <GradientOrbs />
      <ScrollProgress />
      <main>
        <Hero />
        <About />
        {placeholders.map(({ id }) => (
          <Section key={id} id={id} {...sections[id]}>
            <div className="h-64 rounded-2xl border border-border bg-bg-alt/60 backdrop-blur-[10px]" />
          </Section>
        ))}
      </main>
      <BackToTop />
    </>
  );
}
