import type { Project } from "@/types";

/**
 * Selected work.
 *
 * Sources: `Docs/PRD.txt` §1 (project descriptions, technology, workflow),
 * `Docs/User Input Session.txt` (metrics, timeline, link availability), the
 * dataset sizes confirmed for Phase 5E, and the owner decisions confirmed on
 * 2026-09-19 (`Docs/Detail.txt`: display names, slugs, the ThoraxVision live
 * URL).
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
    "Lessons learned / reflection copy for the case study.",
  ],
};

const melonVisionAi: Project = {
  slug: "melonvision-ai",
  index: "02",
  title: "MelonVision AI",
  discipline: "Edge AI / Deployment",
  year: null,
  timeline: "20 – 30 June",
  context: "Client project",
  summary:
    "An AI-based melon plant detection system that runs inference on an ESP32-CAM and reports into a FastAPI service, taking a trained model through to a deployed, working application.",
  problem:
    "A trained detection model is only useful once it runs where the plants are. This project takes the model off the workstation and onto edge hardware, with a backend that records what was detected and a web interface to review it.",
  approach: [
    "Converted the detection model to TensorFlow Lite for on-device inference.",
    "Ran inference on ESP32-CAM hardware at the capture point.",
    "Built a FastAPI service to receive and serve detection results.",
    "Persisted detection history in PostgreSQL.",
    "Containerised the stack with Docker and deployed it to a Linux VPS.",
    "Integrated the detection history into a web interface.",
  ],
  stack: [
    { label: "Model", items: ["TensorFlow Lite", "AI inference"] },
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
    {
      label: "GitHub",
      href: null,
      note: "Repository exists on the owner's GitHub; the specific URL has not been supplied.",
    },
    {
      label: "Live",
      href: null,
      note: "Deployed on the client's VPS; not published as a public URL.",
    },
  ],
  pending: [
    "Project year — the owner gave 20–30 June with no year.",
    "GitHub repository URL.",
    "Whether the client may be named, and if so the client name — the question was asked but not answered.",
    "Model architecture behind the TensorFlow Lite build.",
    "Detection accuracy or any evaluation figures — none are documented.",
    "Whether the live deployment may be linked or shown.",
    "Lessons learned / reflection copy for the case study.",
  ],
};

/** Ordered as they appear in the Selected Work section. */
export const projects: Project[] = [thoraxVision, melonVisionAi];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
