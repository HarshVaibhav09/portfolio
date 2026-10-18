import { GradientOrbs } from "@/components/background/GradientOrbs";
import { BackToTop } from "@/components/layout/BackToTop";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { Skills } from "@/components/sections/Skills";
import { Work } from "@/components/sections/Work";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { sections } from "@/lib/content";

export default function Home() {
  return (
    <>
      <GradientOrbs />
      <ScrollProgress />
      <main>
        <Hero />
        <About />
        <Work />
        <Skills />
        <Experience />
        {/* Placeholder until the Contact phase */}
        <Section id="contact" {...sections.contact}>
          <Reveal>
            <div className="h-64 rounded-2xl border border-border bg-bg-alt/60 backdrop-blur-[10px]" />
          </Reveal>
        </Section>
      </main>
      <BackToTop />
    </>
  );
}
