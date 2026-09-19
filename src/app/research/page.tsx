import type { Metadata } from "next";
import { ResearchLog } from "@/components/sections/research-log";
import { getSection } from "@/data/site";

/**
 * Research index — `/research`.
 *
 * `ResearchLog` owns the rendering. The description says what the register is
 * and stops there: both entries are venue-only, so any sentence about a paper
 * would be invented.
 */
export const metadata: Metadata = {
  title: getSection("/research")?.label ?? "Research log",
  description:
    "A register of confirmed conference venues. Paper titles, topics, and submission state are listed once they are settled.",
};

export default function ResearchPage() {
  return <ResearchLog />;
}
