/**
 * Absolute site origin, without a trailing slash. Used by metadataBase, the sitemap,
 * robots.txt and JSON-LD.
 *
 * 1. NEXT_PUBLIC_SITE_URL: set it in production (custom domain).
 * 2. VERCEL_PROJECT_PRODUCTION_URL on production builds: the project's production domain.
 * 3. VERCEL_URL: the per-deployment URL. Only right for previews, because Vercel's deployment
 *    protection puts it behind a login, so social crawlers fetching og:image would get a 401.
 * 4. localhost for local builds.
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");
  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (process.env.VERCEL_ENV === "production" && production) return `https://${production}`;
  const deployment = process.env.VERCEL_URL?.trim();
  if (deployment) return `https://${deployment}`;
  return "http://localhost:3000";
}
