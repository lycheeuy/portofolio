import type { ResearchStatus } from "@/types";

/**
 * Reader-facing wording for every `ResearchStatus`, including the five this
 * data does not use yet, so a status change in the data layer never falls
 * through to a raw enum string on the page.
 *
 * `pending-confirmation` deliberately does not say "submitted" or "accepted" —
 * the venue is what is confirmed, nothing about the paper's fate is known.
 *
 * Lifted out of `research-log.tsx` in Phase 6D, when the research index and
 * the research detail page both needed it. Two copies of this map would
 * disagree the first time a status was reworded.
 */
export const STATUS_LABEL: Record<ResearchStatus, string> = {
  "pending-confirmation": "Venue confirmed · details to follow",
  "in-preparation": "In preparation",
  submitted: "Submitted",
  accepted: "Accepted",
  presented: "Presented",
  published: "Published",
};

/** Statuses where the paper's outcome is settled, so the marker earns colour. */
export const SETTLED: ReadonlySet<ResearchStatus> = new Set([
  "accepted",
  "presented",
  "published",
]);
