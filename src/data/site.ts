import type { NavItem, SectionMeta, SiteConfig } from "@/types";

/**
 * Site-level configuration and the canonical navigation source.
 *
 * `src/components/layout/nav-links.ts` re-exports `NAVIGATION` as
 * `NAV_LINKS`, so the header and the mobile overlay still read from one list
 * and no label is duplicated.
 */

export const NAVIGATION: readonly NavItem[] = [
  { label: "Work", href: "#work" },
  { label: "Research", href: "#research" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
] as const;

/**
 * Editorial index + label per homepage section. `00` is the hero, matching
 * the index motif already used in `hero.tsx`.
 */
export const SECTIONS: readonly SectionMeta[] = [
  { id: "top", index: "00", label: "Intro" },
  { id: "work", index: "01", label: "Selected work" },
  { id: "research", index: "02", label: "Research log" },
  { id: "about", index: "03", label: "About" },
  { id: "contact", index: "04", label: "Contact" },
] as const;

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
    "Root metadata in `src/app/layout.tsx` states Purwokerto; the owner's stated location is Cirebon. The description here drops the location line until that is settled.",
  ],
};
