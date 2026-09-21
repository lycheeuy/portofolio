import type { Metadata } from "next";
import { ResearchLog } from "@/components/sections/research-log";
import { research } from "@/data/research";
import { getSection } from "@/data/site";
import { routeMetadata } from "@/lib/metadata";

/**
 * Research index — `/research`.
 *
 * `ResearchLog` owns the rendering. The description is composed from
 * `research.ts` the same way the page's standfirst is: a count, the venue
 * acronyms, and the one honest sentence about what is still withheld. Until
 * Phase 6E it said titles and topics were "listed once settled"; with both
 * entries now titled, that sentence would contradict the page it describes.
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
 * each row carries; while any entry is short of that it is a register of
 * venues and says so instead.
 */
const DESCRIPTION = ALL_DETAILED
  ? `${COUNT} conference ${COUNT === 1 ? "paper" : "papers"} — ${ACRONYMS} — with title, topic, and author position for each. Submission state is recorded once it is settled.`
  : `${COUNT} conference ${COUNT === 1 ? "venue" : "venues"} confirmed — ${ACRONYMS}. Paper titles, topics, and submission state are listed once they are settled.`;

export const metadata: Metadata = {
  title: getSection("/research")?.label ?? "Research log",
  description: DESCRIPTION,
  ...routeMetadata("/research"),
};

export default function ResearchPage() {
  return <ResearchLog />;
}
