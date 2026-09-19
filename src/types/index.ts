/**
 * Content interfaces for the portfolio data layer (`src/data/`).
 *
 * Rule that governs every shape here: the data files carry only information
 * that is confirmed in `Docs/`. Anything not yet supplied by the owner is
 * modelled as `null` plus a `pending` entry rather than filled with a
 * plausible-sounding value, so the UI can tell "absent" from "unknown".
 */

/* ------------------------------------------------------------------ */
/* Shared                                                              */
/* ------------------------------------------------------------------ */

/**
 * An outbound reference. `href` is `null` when the resource is confirmed to
 * exist but its URL has not been supplied — never a guessed address.
 */
export interface ExternalLink {
  label: string;
  href: string | null;
  /** Why `href` is null, or any qualifier the UI should surface. */
  note?: string;
}

/** Grouped capability listing — "what the owner does", not skill percentages. */
export interface CapabilityGroup {
  label: string;
  items: string[];
}

/* ------------------------------------------------------------------ */
/* Profile                                                             */
/* ------------------------------------------------------------------ */

export interface Education {
  degree: string;
  field: string;
  status: string;
}

export interface ContactChannel {
  label: string;
  value: string;
  href: string;
  /** Shown in a public contact list. */
  primary: boolean;
}

export interface Profile {
  displayName: string;
  fullName: string;
  status: string;
  location: string;
  /** Short factual positioning line. Not a marketing tagline. */
  positioning: string;
  roles: string[];
  focusAreas: string[];
  /** Stated career direction, in order. */
  trajectory: string[];
  availability: string;
  education: Education;
  capabilities: CapabilityGroup[];
  contact: ContactChannel[];
  /** Content the owner has not supplied yet. */
  pending: string[];
}

/* ------------------------------------------------------------------ */
/* Projects                                                            */
/* ------------------------------------------------------------------ */

export interface ProjectDataset {
  label: string;
  imageCount: number;
  /** Class names as used in the experiments, when documented. */
  classes: string[] | null;
  note?: string;
}

/** Per-class classification metrics. `null` where the figure was not reported. */
export interface ClassMetrics {
  label: string;
  precision: number | null;
  recall: number | null;
  f1: number | null;
}

export interface ModelResult {
  name: string;
  /** `primary` is the selected model; `comparison` models were benchmarked against it. */
  role: "primary" | "comparison";
  accuracy: number | null;
  rocAuc: number | null;
  perClass: ClassMetrics[];
}

export interface Project {
  slug: string;
  /** Editorial index — "01", "02". */
  index: string;
  title: string;
  /** Discipline line, e.g. "Computer Vision / Research". */
  discipline: string;
  year: number | null;
  timeline: string | null;
  context: string;
  summary: string;
  problem: string;
  approach: string[];
  stack: CapabilityGroup[];
  dataset: ProjectDataset | null;
  models: ModelResult[];
  links: ExternalLink[];
  pending: string[];
}

/* ------------------------------------------------------------------ */
/* Research                                                            */
/* ------------------------------------------------------------------ */

/**
 * `pending-confirmation` means the venue is confirmed but the submission
 * state is not. It is deliberately not defaulted to "accepted".
 */
export type ResearchStatus =
  | "pending-confirmation"
  | "in-preparation"
  | "submitted"
  | "accepted"
  | "presented"
  | "published";

export interface Conference {
  acronym: string;
  /** Expanded name, only when documented. */
  name: string | null;
  year: number;
}

export interface ResearchEntry {
  slug: string;
  index: string;
  year: number;
  /** Paper title — `null` until the owner supplies it. */
  title: string | null;
  conference: Conference;
  topic: string | null;
  contribution: string | null;
  status: ResearchStatus;
  /** `Project.slug` this work draws on, when the link is documented. */
  projectSlug: string | null;
  links: ExternalLink[];
  pending: string[];
}

/* ------------------------------------------------------------------ */
/* Site                                                                */
/* ------------------------------------------------------------------ */

export interface NavItem {
  label: string;
  href: string;
}

export interface SiteConfig {
  name: string;
  /** Header wordmark / short form. */
  shortName: string;
  title: string;
  description: string;
  /** One-line description for compact placements. */
  tagline: string;
  locale: string;
  /** Canonical origin — `null` until a domain is chosen. */
  url: string | null;
  navigation: readonly NavItem[];
  sections: readonly SectionMeta[];
  pending: string[];
}

/**
 * Editorial label + index for one top-level destination.
 *
 * `id` is the DOM id of the section landmark; `href` is the route it now
 * lives at. The two were the same string while the site was one page
 * (`#work`); since Phase 6D they are not, so both are recorded here and the
 * header, the mobile overlay, and the footer all read the pairing from one
 * place.
 */
export interface SectionMeta {
  id: string;
  index: string;
  label: string;
  /** Route this section is served at. */
  href: string;
}

/* ------------------------------------------------------------------ */
/* Declared ahead of the phases that consume them                      */
/* ------------------------------------------------------------------ */

export interface Experience {
  title: string;
  organization: string;
}

export interface NowItem {
  label: string;
  content: string;
  updatedAt: string;
}
