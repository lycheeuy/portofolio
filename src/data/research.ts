import type { ResearchEntry } from "@/types";

/**
 * Research log.
 *
 * Two venues are confirmed for 2026: ICWT and ICSMech. Phase 6E ingested the
 * owner's answers from `Docs/Detail.txt`, item by item: paper titles, full
 * conference names, topics, author positions, repository links, and the
 * project both papers draw on (ThoraxVision). Everything else — submission
 * state, host/location, co-authors, a paper or DOI link — is still not
 * documented, so those fields stay `null` with the gap listed in `pending`.
 *
 * `status` is `pending-confirmation` for both: the venue is confirmed, but it
 * is not known whether the papers are submitted, accepted, or presented.
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
  status: "pending-confirmation",
  projectSlug: "thoraxvision",
  links: [
    {
      label: "Repository",
      href: "https://github.com/lycheeuy/my_research/tree/main/ICWT2026",
    },
  ],
  pending: [
    "Conference host and location.",
    "Submission state — submitted, accepted, or presented.",
    "Co-authors.",
    "Paper, DOI, or presentation link.",
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
  status: "pending-confirmation",
  projectSlug: "thoraxvision",
  links: [
    {
      label: "Repository",
      href: "https://github.com/lycheeuy/my_research/tree/main/ICSMech2026",
    },
  ],
  pending: [
    "Conference host and location.",
    "Submission state — submitted, accepted, or presented.",
    "Co-authors.",
    "Paper, DOI, or presentation link.",
  ],
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
