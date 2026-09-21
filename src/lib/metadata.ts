import type { Metadata } from "next";
import { site } from "@/data/site";

/**
 * Metadata that depends on the production origin.
 *
 * `site.url` is `null` until a domain is chosen (Phase 6G, `site.pending`).
 * Everything here is written so that the null case emits nothing rather than
 * a guessed address: no canonical, no `og:url`, no sitemap line in robots,
 * no sitemap entries. The moment `site.url` is set, all four turn on with no
 * further code change, because every route already goes through
 * `routeMetadata`.
 *
 * What is emitted regardless of a domain — `og:type`, `og:site_name`, and
 * (from the root layout) the Twitter card type — needs no URL to be correct.
 * `og:title` and `og:description` are not set here: Next fills both from the
 * route's resolved `title` (template applied) and `description` when the
 * `openGraph` object leaves them out, so a page cannot share under a title
 * different from the one in its tab.
 */

/** Absolute URL for a route path, or `null` while `site.url` is unset. */
export function siteUrl(path = "/"): string | null {
  return site.url ? new URL(path, site.url).toString() : null;
}

/**
 * The per-route slice of `Metadata`: canonical and `og:url` when a domain
 * exists, `og:type` and `og:site_name` always. Spread it into a route's
 * `metadata` after `title` and `description`.
 *
 * `openGraph` is a nested field, and Next merges nested fields by
 * replacement, not deeply — a route that set `openGraph: { url }` alone would
 * drop the root layout's `type` and `siteName`. So the whole object is built
 * here, once, for every route.
 */
export function routeMetadata(path: string): Pick<Metadata, "alternates" | "openGraph"> {
  const url = siteUrl(path);
  return {
    ...(url ? { alternates: { canonical: url } } : {}),
    openGraph: {
      type: "website",
      siteName: site.name,
      ...(url ? { url } : {}),
    },
  };
}
