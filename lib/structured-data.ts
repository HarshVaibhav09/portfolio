import { profile, skillGroups } from "@/lib/content";
import { getSiteUrl } from "@/lib/site-url";

/** The subset of schema.org Person this site publishes. */
export interface PersonJsonLd {
  "@context": "https://schema.org";
  "@type": "Person";
  name: string;
  jobTitle: string;
  url: string;
  email: string;
  image: string;
  address: { "@type": "PostalAddress"; addressLocality: string; addressCountry: string };
  sameAs: string[];
  alumniOf: { "@type": "CollegeOrUniversity"; name: string };
  knowsAbout: string[];
}

/** schema.org Person for the JSON-LD script in the root layout. Built from content.ts only. */
export function personJsonLd(): PersonJsonLd {
  const siteUrl = getSiteUrl();
  const sameAs = profile.socials.filter((s) => s.href.startsWith("https://")).map((s) => s.href);

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.role,
    url: siteUrl,
    email: `mailto:${profile.email}`,
    image: `${siteUrl}${profile.photo.src}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: profile.location.split(",")[0].trim(),
      addressCountry: profile.countryCode,
    },
    sameAs,
    alumniOf: { "@type": "CollegeOrUniversity", name: profile.school },
    // The first three skills of each group: the core of the stack, not every chip.
    knowsAbout: skillGroups.flatMap((group) => group.skills.slice(0, 3).map((skill) => skill.name)),
  };
}

/** Serialize for a <script> tag: escape "<" so user-facing strings can never close the tag. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
