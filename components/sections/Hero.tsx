import Image from "next/image";
import type { CSSProperties } from "react";
import { ChevronDown, Download, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { RotatingText } from "@/components/ui/RotatingText";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { hero, profile } from "@/lib/content";

/* Reveal timing. Letters are pure CSS (see .hero-letter in globals.css); everything after
   the headline starts once the last letter has finished, one step apart. */
const STAGGER_MS = 40;
const LETTER_MS = 180;
const STEP_MS = 120;

type Vars = CSSProperties & Record<`--${string}`, string | number>;

// "Hi," "I'm" then "Harsh" "Vaibhav". Spaces stay as real text nodes (they are the line-break
// points) and count as a slot in the stagger so timing matches the character count.
const words = [
  ...profile.greeting.split(" ").map((text) => ({ text, name: false })),
  ...profile.name.split(" ").map((text) => ({ text, name: true })),
];
const totalChars = words.reduce((n, w) => n + w.text.length, 0) + words.length - 1;
const nameLetters = profile.name.replaceAll(" ", "").length;
const HEADLINE_END_MS = (totalChars - 1) * STAGGER_MS + LETTER_MS;

const afterHeadline = (step: number): Vars => ({ "--d": HEADLINE_END_MS + step * STEP_MS });

function Headline() {
  let slot = 0; // stagger position across the whole sentence
  let nameIndex = 0; // gradient slice across the name's letters only

  return (
    <h1
      aria-label={`${profile.greeting} ${profile.name}`}
      className="text-4xl leading-[1.1] font-semibold tracking-tight text-balance md:text-[3.5rem]"
      style={{ "--stagger": `${STAGGER_MS}ms`, "--letter-dur": `${LETTER_MS}ms` } as Vars}
    >
      {words.map((word, w) => (
        <span key={w}>
          {w > 0 && " "}
          <span className="inline-block whitespace-nowrap" aria-hidden="true">
            {[...word.text].map((char, c) => {
              const style: Vars = { "--i": slot++ };
              if (word.name) {
                style["--j"] = nameIndex++;
                style["--n"] = nameLetters;
              }
              return (
                <span
                  key={c}
                  className={word.name ? "hero-letter hero-name-letter" : "hero-letter"}
                  style={style}
                >
                  {char}
                </span>
              );
            })}
          </span>
        </span>
      ))}
    </h1>
  );
}

export function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-svh items-center overflow-x-clip pt-24 pb-24"
    >
      <div className="mx-auto grid w-full max-w-[1200px] items-center gap-10 px-4 md:px-8 lg:grid-cols-[1.2fr_1fr] lg:gap-12">
        {/* Photo: first on mobile, right column on desktop. The photo is the LCP element, so it
            renders immediately; only the glow and ring fade in (fading the photo delayed LCP ~1s). */}
        <div className="order-first flex justify-center lg:order-last">
          <div className="relative size-44 sm:size-52 md:size-64 lg:size-80 xl:size-96">
            <div aria-hidden="true" className="hero-rise absolute inset-0" style={{ "--d": 0 } as Vars}>
              <div className="absolute -inset-6 rounded-full opacity-30 blur-3xl [background-image:var(--gradient-brand)]" />
              <div className="hero-ring absolute inset-0 rounded-full" />
            </div>
            <div className="absolute inset-1 overflow-hidden rounded-full bg-bg md:inset-1.5">
              <Image
                src={profile.photo.src}
                alt={profile.photo.alt}
                fill
                preload
                sizes="(min-width: 1280px) 384px, (min-width: 1024px) 320px, (min-width: 768px) 256px, (min-width: 640px) 208px, 176px"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-6 text-center lg:items-start lg:text-left">
          <p
            className="hero-rise inline-flex items-center gap-2.5 rounded-full border border-border bg-bg-alt/60 px-4 py-1.5 font-mono text-xs text-muted backdrop-blur-[10px] sm:text-sm"
            style={{ "--d": 0 } as Vars}
          >
            <span className="relative flex size-2.5" aria-hidden="true">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75 motion-reduce:hidden" />
              <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
            </span>
            {profile.status}
          </p>

          <Headline />

          <div className="hero-rise" style={afterHeadline(0)}>
            <RotatingText
              prefix={profile.rotatingPrefix}
              words={profile.rotatingWords}
              startAtMs={HEADLINE_END_MS + 150}
            />
          </div>

          <p className="hero-rise max-w-xl text-lg text-muted" style={afterHeadline(1)}>
            {profile.description}
          </p>

          <div className="hero-rise flex flex-wrap justify-center gap-3 lg:justify-start" style={afterHeadline(2)}>
            <Button href="#work" variant="gradient">
              {hero.cta.work}
            </Button>
            <Button href={profile.resume} download variant="outline">
              <Download className="size-4" aria-hidden="true" />
              {hero.cta.resume}
            </Button>
            <Button href="#contact" variant="ghost">
              {hero.cta.contact}
            </Button>
          </div>

          <div
            className="hero-rise flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-sm text-muted lg:justify-start"
            style={afterHeadline(3)}
          >
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-4 text-accent" aria-hidden="true" />
              {profile.location}
            </span>
            <ul className="flex items-center gap-2">
              {profile.socials.map((social) => (
                <li key={social.label}>
                  <Button
                    href={social.href}
                    variant="ghost"
                    aria-label={social.label}
                    className="relative size-10 p-0! after:absolute after:-inset-0.5"
                  >
                    <SocialIcon name={social.icon} className="size-5" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          <dl
            className="hero-rise mt-2 flex flex-wrap justify-center gap-x-8 gap-y-4 border-t border-border pt-6 lg:justify-start"
            style={afterHeadline(4)}
          >
            {profile.stats.map((stat) => (
              <div key={stat.label} className="flex flex-col-reverse items-center lg:items-start">
                <dt className="font-mono text-xs text-muted">{stat.label}</dt>
                <dd className="text-2xl font-semibold text-text">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <a
        href="#about"
        aria-label={hero.scrollLabel}
        className="hero-rise after:absolute after:-inset-0.5 absolute bottom-6 left-1/2 grid size-10 -translate-x-1/2 place-items-center rounded-full border border-border text-muted transition-colors hover:border-accent/40 hover:text-accent"
        style={afterHeadline(5)}
      >
        <ChevronDown className="size-5 animate-bounce motion-reduce:animate-none" aria-hidden="true" />
      </a>
    </section>
  );
}
