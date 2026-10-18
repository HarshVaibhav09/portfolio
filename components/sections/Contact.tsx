import { cardBase } from "@/components/ui/card-styles";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { contact, profile, sections } from "@/lib/content";
import { cn, isExternal } from "@/lib/utils";
import { ContactForm } from "./ContactForm";

// Direct channels shown beside the form: email first, then LinkedIn.
const directLinks = (["email", "linkedin"] as const).flatMap((icon) =>
  profile.socials.filter((s) => s.icon === icon),
);

export function Contact() {
  return (
    <Section id="contact" {...sections.contact}>
      <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-14">
        <Reveal>
          <p className="text-lg leading-relaxed text-text/85">{contact.intro}</p>
          <ul className="mt-8 space-y-4">
            {directLinks.map((link) => {
              const external = isExternal(link.href);
              return (
                <li key={link.label}>
                  <a
                    href={link.href}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group inline-flex min-h-11 items-center gap-3"
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent/10 text-accent">
                      <SocialIcon name={link.icon} className="size-5" />
                    </span>
                    <span>
                      <span className="block font-mono text-xs uppercase tracking-wider text-muted">{link.label}</span>
                      <span className="break-all text-text transition-colors group-hover:text-accent">
                        {link.href.replace(/^(mailto:|https?:\/\/)/, "")}
                      </span>
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          {/* Card styling without the hover lift: a form should not move while you type in it */}
          <div className={cn(cardBase, "p-6 md:p-8")}>
            <ContactForm />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
