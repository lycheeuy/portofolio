import type { ResearchEntry } from "@/types";

/**
 * Research log.
 *
 * Two venues are confirmed for 2026: ICWT and ICSMech. Phase 6E ingested the
 * owner's answers from `Docs/Detail.txt`, item by item: paper titles, full
 * conference names, topics, author positions, repository links, and the
 * project both papers draw on (ThoraxVision). On 2026-09-21 the owner
 * confirmed the publication state of each: the ICSMech paper is published on
 * IEEE Xplore (paper URL confirmed 2026-09-22 and linked); the ICWT paper is
 * in the publication process with IEEE and has no public paper URL yet, so
 * none is linked for it. Co-authors are not displayed, by decision. Host and
 * location are still not documented and stay in `pending`.
 *
 * Conference names are stored without the trailing year — `conference.year`
 * carries it, and the UI composes "acronym · name · year" itself.
 */

const icwt2026: ResearchEntry = {
  slug: "icwt-2026",
  index: "01",
  year: 2026,
  title:
    "The VGG19 and DenseNet121 Model Comparison for the Chest X-Ray Based Tuberculosis Detection on Local Dataset",
  conference: {
    acronym: "ICWT",
    name: "The 12th International Conference on Wireless and Telematics",
    year: 2026,
  },
  topic:
    "Comparing VGG19 and DenseNet121 for tuberculosis classification on a local chest X-ray dataset, with experiments focused on batch size, model generalization, and performance differences between architectures.",
  contribution: "Second author",
  /** Owner, 2026-09-21: in the publication process with IEEE — not accepted, not published. */
  status: "in-publication",
  platform: "IEEE",
  projectSlug: "thoraxvision",
  links: [
    {
      label: "Repository",
      href: "https://github.com/lycheeuy/my_research/tree/main/ICWT2026",
    },
  ],
  pending: [
    "Conference host and location.",
    "Paper or DOI link, once published.",
  ],
};

const icsmech2026: ResearchEntry = {
  slug: "icsmech-2026",
  index: "02",
  year: 2026,
  title:
    "Application of CNN Model for Early Detection of Tuberculosis in Chest X-ray Images",
  conference: {
    acronym: "ICSMech",
    name: "The 2nd International Conference on Smart Mechatronics",
    year: 2026,
  },
  topic:
    "Developing and optimizing a DenseNet121-based model for tuberculosis detection using 4,784 local chest X-ray images, with a focus on generalization, class imbalance, and model interpretability.",
  contribution: "First author",
  /** Owner, 2026-09-21: published on IEEE Xplore. */
  status: "published",
  platform: "IEEE Xplore",
  projectSlug: "thoraxvision",
  /** The paper first, then the repository. Paper URL confirmed by the owner on 2026-09-22. */
  links: [
    {
      label: "Paper",
      href: "https://ieeexplore.ieee.org/document/11647113",
    },
    {
      label: "Repository",
      href: "https://github.com/lycheeuy/my_research/tree/main/ICSMech2026",
    },
  ],
  pending: ["Conference host and location."],
};

export const research: ResearchEntry[] = [icwt2026, icsmech2026];

export function getResearchEntry(slug: string): ResearchEntry | undefined {
  return research.find((entry) => entry.slug === slug);
}

/**
 * Entries that record `slug` as the project they draw on. Both entries name
 * ThoraxVision, so its project page renders a Related-research block; the
 * MelonVision page gets `[]` and renders none.
 */
export function getResearchForProject(slug: string): ResearchEntry[] {
  return research.filter((entry) => entry.projectSlug === slug);
}
