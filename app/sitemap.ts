import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

// No lastModified: new Date() during prerender is a build error under Cache Components,
// and a hard-coded date would go stale.
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${getSiteUrl()}/`, changeFrequency: "monthly", priority: 1 }];
}
