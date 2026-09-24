import type { Metadata } from "next";
import { About } from "@/components/sections/about";
import { profile } from "@/data/profile";
import { getSection } from "@/data/site";
import { routeMetadata } from "@/lib/metadata";

/**
 * About: `/about`.
 *
 * `About` owns the rendering. The description is `profile.positioning`
 * verbatim plus the location, both from the data layer, so it cannot drift
 * from what the page itself states.
 */
export const metadata: Metadata = {
  title: getSection("/about")?.label ?? "About",
  description: `${profile.positioning} Based in ${profile.location}.`,
  ...routeMetadata("/about"),
};

export default function AboutPage() {
  return <About />;
}
