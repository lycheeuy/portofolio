import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectDetail } from "@/components/projects/project-detail";
import { getProject, projects } from "@/data/projects";

/**
 * Project case study — `/projects/[slug]`.
 *
 * Slugs come from `projects.ts` and nowhere else: `thoraxvision` and
 * `melonvision-ai`. `generateStaticParams` prerenders exactly those two
 * at build time, and `dynamicParams = false` makes any other slug a 404
 * instead of a request-time render of a project that does not exist.
 *
 * `ProjectDetail` owns the rendering. This file resolves the slug and names
 * the page; it holds no project content of its own.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) return {};

  return {
    title: project.title,
    description: project.summary,
  };
}

export default async function ProjectPage({
  params,
}: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) notFound();

  return <ProjectDetail project={project} />;
}
