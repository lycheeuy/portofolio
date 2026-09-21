import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { research } from "@/data/research";
import { site } from "@/data/site";
import { siteUrl } from "@/lib/metadata";

/**
 * `/sitemap.xml`, composed from the same lists the routes are built from:
 * every `SECTIONS` destination plus one entry per project and research slug.
 * A new project or paper in `data/` reaches the sitemap without an edit here.
 *
 * A sitemap entry must be an absolute URL, so while `site.url` is `null` this
 * returns an empty set — the file exists and is well-formed, and fills in the
 * moment a domain is chosen. `lastModified`, `changeFrequency`, and
 * `priority` are omitted: none of the three is recorded anywhere, and a
 * made-up date is worse than no date.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...site.sections.map((section) => section.href),
    ...projects.map((project) => `/projects/${project.slug}`),
    ...research.map((entry) => `/research/${entry.slug}`),
  ];

  return paths.flatMap((path) => {
    const url = siteUrl(path);
    return url ? [{ url }] : [];
  });
}
