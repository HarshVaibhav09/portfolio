/**
 * Absolute site origin, without a trailing slash. Used by metadataBase, the sitemap,
 * robots.txt and JSON-LD.
 *
 * NEXT_PUBLIC_SITE_URL (set it in production) > https://VERCEL_URL on Vercel > localhost.
 * VERCEL_URL is the per-deployment URL, so production should always set NEXT_PUBLIC_SITE_URL.
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}
