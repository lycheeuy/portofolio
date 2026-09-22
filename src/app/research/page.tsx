import type { Metadata } from "next";
import { statusSummary } from "@/components/research/status";
import { ResearchLog } from "@/components/sections/research-log";
import { research } from "@/data/research";
import { getSection } from "@/data/site";
import { routeMetadata } from "@/lib/metadata";

/**
 * Research index — `/research`.
 *
 * `ResearchLog` owns the rendering. The description is composed from
 * `research.ts` the same way the page's standfirst is: a count, the venue
 * acronyms, and the statuses. Until Phase 6E it said titles and topics were
 * "listed once settled"; until 2026-09-21 it said submission state would be
 * recorded once settled. Each time the data caught up the sentence would have
 * contradicted the page, so it now reads the statuses from the entries.
 */

const ACRONYMS = research
  .map((entry) => `${entry.conference.acronym} ${entry.conference.year}`)
  .join(" and ");

/** Every entry carries the three fields the second wording promises. */
const ALL_DETAILED = research.every(
  (entry) => entry.title && entry.topic && entry.contribution,
);

const COUNT = research.length;

/**
 * Two wordings, chosen by the data. Once every entry has a title, topic, and
 * author position the log is a list of papers and the description says what
 * each row carries and where each paper stands; while any entry is short of
 * that it is a register of venues and says so instead.
 */
const DESCRIPTION = ALL_DETAILED
  ? `${COUNT} conference ${COUNT === 1 ? "paper" : "papers"} — ${ACRONYMS} — with title, topic, and author position for each: ${statusSummary(research)}.`
  : `${COUNT} conference ${COUNT === 1 ? "venue" : "venues"} confirmed — ${ACRONYMS}. Paper titles, topics, and publication state are listed once they are settled.`;

export const metadata: Metadata = {
  title: getSection("/research")?.label ?? "Research log",
  description: DESCRIPTION,
  ...routeMetadata("/research"),
};

export default function ResearchPage() {
  return <ResearchLog />;
}
