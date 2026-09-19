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

export const site: SiteConfig = {
  name: "Alif Reezi",
  shortName: "Alif Reezi.",
  title: "Alif Reezi - AI Engineer",
  description:
    "AI engineer and Biomedical Engineering graduate building machine learning systems for medical imaging and edge AI deployment.",
  tagline:
    "AI / Machine Learning Engineer working across computer vision, model experimentation, and research.",
  locale: "en",
  url: null,
  navigation: NAVIGATION,
  sections: SECTIONS,
  pending: [
    "Production domain — no URL is chosen yet, so canonical, sitemap, and Open Graph URLs cannot be set.",
    "Open Graph / social share image.",
    "Footer copy — the current footer is an acknowledged placeholder.",
  ],
};
