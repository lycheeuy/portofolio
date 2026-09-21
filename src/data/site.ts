import type { NavItem, SectionMeta, SiteConfig } from "@/types";

/**
 * Site-level configuration and the canonical navigation source.
 *
 * `src/components/layout/nav-links.ts` re-exports `NAVIGATION` as
 * `NAV_LINKS`, so the header, the mobile overlay, and the footer still read
 * from one list and no label is duplicated.
 *
 * Phase 6D turned the four in-page anchors into routes. `NAVIGATION` now
 * carries page paths, and `Home` joins the list because it is a destination
 * rather than a scroll target — the wordmark alone is not a navigation item.
 */

export const NAVIGATION: readonly NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Research", href: "/research" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

/**
 * Editorial index, label, and route per top-level destination. `00` is the
 * home page, matching the index motif already used in `hero.tsx`.
 *
 * `label` is the page's own heading; `NAVIGATION.label` is its short form in
 * a nav bar. "Selected work" and "Projects" are the same destination said at
 * two lengths, which is why the two lists are separate rather than one.
 */
export const SECTIONS: readonly SectionMeta[] = [
  { id: "top", index: "00", label: "Intro", href: "/" },
  { id: "work", index: "01", label: "Selected work", href: "/projects" },
  { id: "research", index: "02", label: "Research log", href: "/research" },
  { id: "about", index: "03", label: "About", href: "/about" },
  { id: "contact", index: "04", label: "Contact", href: "/contact" },
] as const;

/** Index and label for a destination, by route. Falls back to nothing. */
export function getSection(href: string): SectionMeta | undefined {
  return SECTIONS.find((section) => section.href === href);
}

/**
 * `title` is the homepage `<title>` and the fallback for any route without
 * one; every other route goes through the `%s — Alif Reezi` template in the
 * root layout, so the separator here is the same em dash. The role names the
 * owner's first `profile.roles` entry rather than a shorter form of it, so a
 * search result and the Hero say the same thing.
 *
 * `description` is the site-wide search and share summary. Every clause is a
 * documented fact: the role, the degree, the focus areas, and the two case
 * studies' domains (medical imaging research, edge AI deployment).
 */
export const site: SiteConfig = {
  name: "Alif Reezi",
  shortName: "Alif Reezi.",
  title: "Alif Reezi — AI / Machine Learning Engineer",
  description:
    "AI / Machine Learning Engineer and Biomedical Engineering graduate working across computer vision, deep learning, and research — from medical imaging models to edge AI deployment.",
  tagline:
    "AI / Machine Learning Engineer working across computer vision, model experimentation, and research.",
  locale: "en",
  url: null,
  navigation: NAVIGATION,
  sections: SECTIONS,
  pending: [
    "Production domain — `url` is null, so canonical URLs, `og:url`, the sitemap entries, and the robots sitemap line are not emitted. Setting `url` turns all four on without further code.",
    "Open Graph / social share image — `public/images/og/` is empty; no `og:image` is declared rather than one pointing at a file that does not exist.",
  ],
};
