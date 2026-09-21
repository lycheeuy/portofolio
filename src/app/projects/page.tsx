import type { Metadata } from "next";
import { SelectedWork } from "@/components/sections/selected-work";
import { getSection } from "@/data/site";
import { routeMetadata } from "@/lib/metadata";

/**
 * Projects index — `/projects`.
 *
 * `SelectedWork` owns the rendering; this file only names the route and its
 * metadata. The description is the section's own purpose stated once, not a
 * claim about either project — those come from `projects.ts` on the detail
 * pages.
 */
export const metadata: Metadata = {
  title: getSection("/projects")?.label ?? "Selected work",
  description:
    "Computer vision and edge AI projects, each carried from a training run through to evaluation or deployment.",
  ...routeMetadata("/projects"),
};

export default function ProjectsPage() {
  return <SelectedWork />;
}
