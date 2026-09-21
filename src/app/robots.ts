import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/metadata";

/**
 * `/robots.txt`. Everything on the site is public, so the rule is allow-all.
 * The `Sitemap:` line needs an absolute URL and is emitted only once
 * `site.url` is set — see `lib/metadata.ts`.
 */
export default function robots(): MetadataRoute.Robots {
  const sitemap = siteUrl("/sitemap.xml");
  return {
    rules: { userAgent: "*", allow: "/" },
    ...(sitemap ? { sitemap } : {}),
  };
}
