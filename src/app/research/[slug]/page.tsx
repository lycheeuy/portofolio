import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ResearchDetail } from "@/components/research/research-detail";
import { getResearchEntry, research } from "@/data/research";

/**
 * Research entry — `/research/[slug]`.
 *
 * Slugs come from `research.ts` and nowhere else: `icwt-2026` and
 * `icsmech-2026`. `generateStaticParams` prerenders exactly those two, and
 * `dynamicParams = false` makes any other slug a 404.
 *
 * The page title falls back to the venue acronym and year because `title` is
 * `null` on both entries — a browser tab has to say something, and the venue
 * is what is confirmed. `description` is omitted rather than invented: with
 * `topic` null there is nothing factual to put in it, so the site-level
 * description from the root layout stands.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return research.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/research/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const entry = getResearchEntry(slug);

  if (!entry) return {};

  return {
    title: entry.title ?? `${entry.conference.acronym} ${entry.year}`,
    ...(entry.topic ? { description: entry.topic } : {}),
  };
}

export default async function ResearchEntryPage({
  params,
}: PageProps<"/research/[slug]">) {
  const { slug } = await params;
  const entry = getResearchEntry(slug);

  if (!entry) notFound();

  return <ResearchDetail entry={entry} />;
}
