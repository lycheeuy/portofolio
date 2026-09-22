import type { ResearchEntry, ResearchStatus } from "@/types";

/**
 * Reader-facing wording for every `ResearchStatus`, including the ones this
 * data does not use, so a status change in the data layer never falls
 * through to a raw enum string on the page.
 *
 * `pending-confirmation` deliberately does not say "submitted" or "accepted" —
 * the venue is what is confirmed, nothing about the paper's fate is known.
 * `in-publication` is the owner's own wording (2026-09-21) for the ICWT paper
 * and is likewise not "accepted".
 *
 * Lifted out of `research-log.tsx` in Phase 6D, when the research index and
 * the research detail page both needed it. Two copies of this map would
 * disagree the first time a status was reworded.
 */
export const STATUS_LABEL: Record<ResearchStatus, string> = {
  "pending-confirmation": "Venue confirmed · submission state to follow",
  "in-preparation": "In preparation",
  submitted: "Submitted",
  accepted: "Accepted",
  "in-publication": "In publication process",
  presented: "Presented",
  published: "Published",
};

/** Statuses where the paper's outcome is settled, so the marker earns colour. */
export const SETTLED: ReadonlySet<ResearchStatus> = new Set([
  "accepted",
  "presented",
  "published",
]);

/**
 * The status line for one entry: the label, then the platform when the
 * owner has named one, then the year — "Published · IEEE Xplore · 2026",
 * "In publication process · IEEE · 2026". The index row and the detail page
 * both print it, so it is composed once here.
 */
export function statusLine(entry: ResearchEntry): string {
  return [STATUS_LABEL[entry.status], entry.platform, String(entry.year)]
    .filter(Boolean)
    .join(" · ");
}

/**
 * One sentence summarising the log by status, for the index standfirst and
 * the `/research` description: "1 published · 1 in publication process".
 * Counted from the data in log order, lower-cased because it follows a
 * count, and never a label the data does not contain.
 */
export function statusSummary(entries: readonly ResearchEntry[]): string {
  const counts = new Map<ResearchStatus, number>();
  for (const entry of entries) {
    counts.set(entry.status, (counts.get(entry.status) ?? 0) + 1);
  }
  return Array.from(counts, ([status, count]) => `${count} ${STATUS_LABEL[status].toLowerCase()}`).join(" · ");
}
