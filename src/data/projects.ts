import type { Project } from "@/types";

/**
 * Selected work.
 *
 * Sources: `Docs/PRD.txt` §1 (project descriptions, technology, workflow),
 * `Docs/User Input Session.txt` (metrics, timeline, link availability), the
 * dataset sizes confirmed for Phase 5E, and the owner input in
 * `Docs/Detail.txt` as confirmed on 2026-09-19 (display names, slugs, the
 * ThoraxVision live URL) and in Phase 6E (MelonVision repository, year,
 * architecture, purpose, and achievement — the two prose fields are English
 * renderings of the owner's Indonesian answers, approved item by item).
 *
 * Deliberately absent: any metric, link, date, client name, or outcome that
 * is not in those documents. Where something is known to exist but has no
 * documented value, the field is `null` and the gap is listed in `pending`.
 */

const thoraxVision: Project = {
  slug: "thoraxvision",
  index: "01",
  title: "ThoraxVision",
  discipline: "Computer Vision / Research",
  year: null,
  timeline: null,
  context: "Academic research and conference publication material",
  summary:
    "A computer vision research project for early tuberculosis detection from chest X-ray images, built around a DenseNet121 classifier and benchmarked against two other convolutional backbones.",
  problem:
    "Early tuberculosis screening from chest X-rays depends on reader availability and experience. The project studies whether a convolutional classifier trained on a local chest X-ray dataset can support that screening step.",
  approach: [
    "Trained DenseNet121 as the main model on a local chest X-ray dataset.",
    "Benchmarked ResNet50 and VGG19 under the same evaluation protocol.",
    "Applied image preprocessing and augmentation before training.",
    "Ran hyperparameter experimentation across the model variants.",
    "Evaluated with accuracy, per-class precision/recall/F1, ROC-AUC, and confusion matrices.",
    "Used Grad-CAM to inspect which regions drive each prediction.",
  ],
  outcome: null,
  stack: [
    { label: "Model", items: ["PyTorch", "DenseNet121", "ResNet50", "VGG19"] },
    {
      label: "Workflow",
      items: [
        "Image preprocessing",
        "Augmentation",
        "Hyperparameter experimentation",
      ],
    },
    {
      label: "Evaluation",
      items: ["ROC / AUC", "Confusion matrix", "Grad-CAM"],
    },
  ],
  dataset: {
    label: "Local chest X-ray dataset",
    imageCount: 4784,
    classes: ["Non-TB", "Tuberculosis"],
    note: "Binary classification. Class distribution is not documented.",
  },

  /**
   * Figures are reproduced exactly as recorded in
   * `Docs/User Input Session.txt`. Values the owner left blank there —
   * ResNet50 accuracy, specificity for every model — are `null`, not derived.
   *
   * Not displayed for now, by owner decision (2026-09-19): the figures stay
   * here untouched, and `SHOW_MODEL_RESULTS` in
   * `components/projects/project-detail.tsx` keeps the tables off the page.
   */
  models: [
    {
      name: "DenseNet121",
      role: "primary",
      accuracy: 0.7075,
      rocAuc: 0.8286,
      perClass: [
        { label: "Non-TB", precision: 0.5491, recall: 0.8381, f1: 0.6635 },
        {
          label: "Tuberculosis",
          precision: 0.8827,
          recall: 0.6391,
          f1: 0.7414,
        },
      ],
    },
    {
      name: "ResNet50",
      role: "comparison",
      accuracy: null,
      rocAuc: 0.7773,
      perClass: [
        { label: "Non-TB", precision: 0.57, recall: 0.68, f1: 0.62 },
        { label: "Tuberculosis", precision: 0.81, recall: 0.73, f1: 0.77 },
      ],
    },
    {
      name: "VGG19",
      role: "comparison",
      accuracy: 0.6699,
      rocAuc: 0.735,
      perClass: [
        { label: "Non-TB", precision: 0.5161, recall: 0.6478, f1: 0.5745 },
        // Source records the same F1 for both classes; left as recorded rather
        // than corrected. See `pending`.
        { label: "Tuberculosis", precision: 0.7868, recall: 0.6815, f1: null },
      ],
    },
  ],
  links: [{ label: "Live", href: "https://thoraxvision.site/" }],
  pending: [
    "Project start and completion dates.",
    "GitHub repository URL.",
    "Publication / paper link once the research entry is confirmed.",
    "ResNet50 accuracy — left blank in the owner's figures.",
    "Specificity for all three models — left blank in the owner's figures.",
    "VGG19 Tuberculosis F1 — the source lists 0.5745 for both classes, which cannot both be right; awaiting the correct value.",
    "What the owner wants highlighted about this project (Detail.txt item 10 is unanswered).",
    "Lessons learned / reflection copy for the case study.",
  ],
};

const melonVisionAi: Project = {
  slug: "melonvision-ai",
  index: "02",
  title: "MelonVision AI",
  discipline: "Edge AI / Deployment",
  year: 2026,
  timeline: "20 – 30 June",
  context: "Client project",
  summary:
    "An AI-based melon plant detection system that runs inference on an ESP32-CAM and reports into a FastAPI service, taking a trained model through to a deployed, working application.",
  /**
   * The owner's stated purpose (Detail.txt, Melon §8), rendered into English.
   * It replaces the connective paragraph written in Phase 5E.
   */
  problem:
    "MelonVision AI was built to help melon farmers identify the condition of their plants automatically, using an IoT camera and AI in place of manual inspection that needs specialist expertise. The system allows remote monitoring through a web dashboard, so pruning decisions can be made faster and more consistently without having to be in the field.",
  approach: [
    "Converted the detection model to TensorFlow Lite for on-device inference.",
    "Ran inference on ESP32-CAM hardware at the capture point.",
    "Built a FastAPI service to receive and serve detection results.",
    "Persisted detection history in PostgreSQL.",
    "Containerised the stack with Docker and deployed it to a Linux VPS.",
    "Integrated the detection history into a web interface.",
  ],
  /** The owner's own account of the project's main achievement (Detail.txt, Melon §9). */
  outcome:
    "Finding and fixing a critical bug in the FOMO decoder that made a single object produce dozens of bounding boxes at once — in one case, 144 false detections from one image. The fix was to implement Connected Component Analysis from scratch, using a breadth-first search with 8-connectivity. That changed how the system understands \"one object\": from one grid cell = one detection, to a cluster of neighbouring cells = one detection with an accurate bounding rectangle.",
  stack: [
    {
      label: "Model",
      items: ["MobileNetV2 FOMO", "INT8 quantised", "TensorFlow Lite"],
    },
    { label: "Build", items: ["FastAPI", "PostgreSQL", "Web integration"] },
    { label: "Deploy", items: ["ESP32-CAM", "Docker", "Linux VPS"] },
  ],
  dataset: {
    label: "Melon plant image dataset",
    imageCount: 1250,
    classes: null,
    note: "Class breakdown is not documented.",
  },
  models: [],
  links: [
    { label: "GitHub", href: "https://github.com/lycheeuy/MelonVision_AI" },
    {
      label: "Live",
      href: null,
      note: "Deployed on the client's VPS; not published as a public URL.",
    },
  ],
  pending: [
    "Whether the client may be named, and if so the client name — the question was asked but not answered.",
    "Detection accuracy or any evaluation figures — the owner confirms none exist (Detail.txt, Melon §6).",
    "Whether the live deployment may be linked or shown.",
    "Lessons learned / reflection copy for the case study.",
  ],
};

/** Ordered as they appear in the Selected Work section. */
export const projects: Project[] = [thoraxVision, melonVisionAi];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
