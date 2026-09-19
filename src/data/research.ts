import type { ResearchEntry } from "@/types";

/**
 * Research log.
 *
 * Two venues are confirmed for 2026: ICWT and ICSMech. Nothing else about
 * either entry is documented — no paper title, no expanded conference name,
 * no submission state, no link. Those fields are `null` with the gap listed
 * in `pending`, so the section can render honestly ("venue confirmed, details
 * to follow") instead of showing invented titles.
 *
 * `status` is `pending-confirmation` for both: it is not known whether these
 * are submitted, accepted, or presented.
 */

const icwt2026: ResearchEntry = {
  slug: "icwt-2026",
  index: "01",
  year: 2026,
  title: null,
  conference: {
    acronym: "ICWT",
    name: null,
    year: 2026,
  },
  topic: null,
  contribution: null,
  status: "pending-confirmation",
  projectSlug: null,
  links: [],
  pending: [
    "Paper title.",
    "Full conference name and host/location.",
    "Topic and contribution summary.",
    "Submission state — submitted, accepted, or presented.",
    "Co-authors.",
    "Paper, DOI, or presentation link.",
    "Which project this paper draws on, if any.",
  ],
};

const icsmech2026: ResearchEntry = {
  slug: "icsmech-2026",
  index: "02",
  year: 2026,
  title: null,
  conference: {
    acronym: "ICSMech",
    name: null,
    year: 2026,
  },
  topic: null,
  contribution: null,
  status: "pending-confirmation",
  projectSlug: null,
  links: [],
  pending: [
    "Paper title.",
    "Full conference name and host/location.",
    "Topic and contribution summary.",
    "Submission state — submitted, accepted, or presented.",
    "Co-authors.",
    "Paper, DOI, or presentation link.",
    "Which project this paper draws on, if any.",
  ],
};

export const research: ResearchEntry[] = [icwt2026, icsmech2026];

export function getResearchEntry(slug: string): ResearchEntry | undefined {
  return research.find((entry) => entry.slug === slug);
}

/**
 * Entries that record `slug` as the project they draw on. Empty for both
 * projects today — `projectSlug` is `null` on every entry — so the cross-link
 * on a project page simply does not render until the owner supplies it.
 */
export function getResearchForProject(slug: string): ResearchEntry[] {
  return research.filter((entry) => entry.projectSlug === slug);
}
