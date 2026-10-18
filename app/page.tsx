import { GradientOrbs } from "@/components/background/GradientOrbs";
import { BackToTop } from "@/components/layout/BackToTop";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { Skills } from "@/components/sections/Skills";
import { Work } from "@/components/sections/Work";

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
        <Contact />
      </main>
      <BackToTop />
    </>
  );
}
