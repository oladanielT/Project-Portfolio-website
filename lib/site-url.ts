/** Canonical public origin used by metadata, sitemaps, and request validation. */
export function getSiteUrl(): URL {
  const configured = process.env.SITE_URL?.trim();
  if (configured) return new URL(new URL(configured).origin);

  const vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercelProductionUrl) return new URL(`https://${vercelProductionUrl}`);

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) return new URL(`https://${vercelUrl}`);

  return new URL("http://localhost:3000");
}
