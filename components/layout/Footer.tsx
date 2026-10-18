import { cacheLife } from "next/cache";
import { Button } from "@/components/ui/Button";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { footer, profile } from "@/lib/content";

// With Cache Components, new Date() in a prerendered component fails the build. Caching it
// keeps the page static; the year refreshes when the cache entry expires (daily).
async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg-alt/40 backdrop-blur-[10px]">
      {/* Extra bottom padding on mobile keeps text clear of the BackToTop button */}
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-6 px-4 pt-10 pb-24 text-center md:flex-row md:justify-between md:px-8 md:pb-10 md:text-left">
        <div>
          <p className="font-semibold text-text">{profile.name}</p>
          <p className="mt-1 max-w-sm text-sm text-muted">{footer.tagline}</p>
        </div>

        <ul className="flex items-center gap-1">
          {profile.socials.map((social) => (
            <li key={social.label}>
              <Button href={social.href} variant="ghost" aria-label={social.label} className="relative size-10 p-0! after:absolute after:-inset-0.5">
                <SocialIcon name={social.icon} className="size-5" />
              </Button>
            </li>
          ))}
        </ul>

        <div className="font-mono text-xs text-muted md:text-right">
          <p>{footer.builtWith}</p>
          <p className="mt-1">
            {footer.copyright} <CopyrightYear /> {profile.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
