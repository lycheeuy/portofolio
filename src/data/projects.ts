import type { Project } from "@/types";

/**
 * Selected work.
 *
 * Sources: `Docs/PRD.txt` §1 (project descriptions, technology, workflow),
 * `Docs/User Input Session.txt` (metrics, timeline, link availability), the
 * dataset sizes confirmed for Phase 5E, and the owner input in
 * `Docs/Detail.txt` as confirmed on 2026-09-19 (display names, slugs, the
 * ThoraxVision live URL), in Phase 6E (MelonVision repository, year,
 * architecture, purpose, and achievement — the two prose fields are English
 * renderings of the owner's Indonesian answers, approved item by item), and
 * in the owner data finalisation of 2026-09-21 (ThoraxVision repository and
 * outcome, both projects' lessons learned, the decisions not to display
 * project dates, the model figures, or the dataset-gap notes).
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
  /**
   * Owner-approved direction, 2026-09-21. Screening *research*, not clinical
   * diagnosis or deployment; the application is the web interface the live
   * site provides, nothing more is claimed.
   */
  outcome:
    "Developed an end-to-end chest X-ray classification workflow for tuberculosis screening research, covering image preprocessing, CNN training, model comparison, evaluation, and inference. The project evolved from a research experiment into a working AI application, connecting the trained computer vision model with a web-based interface for practical inference.",
  /**
   * Each paragraph is tied to something the project recorded: the two-class
   * dataset with an undocumented split, the per-class and ROC-AUC evaluation,
   * the preprocessing and augmentation steps, the three-backbone comparison,
   * and the move from experiment to web inference. No figure is quoted.
   */
  lessons: [
    "Accuracy on its own said little about a two-class chest X-ray problem where the classes were not balanced. Per-class precision, recall, and F1, ROC-AUC, and the confusion matrix each showed a different side of the same model, and a decision about which backbone to keep had to rest on all of them together.",
    "Preprocessing and augmentation changed how the models behaved, not just how well they scored. What was done to the images before training had to be treated as part of the experiment and recorded with it.",
    "Comparing DenseNet121, ResNet50, and VGG19 under one evaluation protocol was what made the comparison mean anything. Running the variants systematically, with the same data and the same metrics, mattered more than any single result.",
    "Training a model and serving it are different engineering problems. Connecting the trained classifier to a web interface for inference raised questions — input handling, model loading, response shape — that the training notebooks never had to answer.",
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
  /**
   * The class split is not documented; that gap is recorded in `pending`
   * rather than as a note on the page (owner decision, 2026-09-21).
   */
  dataset: {
    label: "Local chest X-ray dataset",
    imageCount: 4784,
    classes: ["Non-TB", "Tuberculosis"],
    note: "Binary classification.",
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
  /**
   * The repository was confirmed public on 2026-09-21. The owner supplied the
   * clone form (`…/thoraxvision.git`); GitHub redirects it (301) to the page
   * URL stored here, which is the same repository.
   */
  links: [
    { label: "Live", href: "https://thoraxvision.site/" },
    { label: "GitHub", href: "https://github.com/lycheeuy/thoraxvision" },
  ],
  /**
   * Not pending, by decision (2026-09-21): project dates are not displayed,
   * and the model figures stay off the page.
   */
  pending: [
    "Paper / DOI link for the ICWT 2026 paper once it is published (the ICSMech 2026 paper is linked from its research entry).",
    "Dataset class distribution — not documented; kept off the page.",
    "ResNet50 accuracy — left blank in the owner's figures.",
    "Specificity for all three models — left blank in the owner's figures.",
    "VGG19 Tuberculosis F1 — the source lists 0.5745 for both classes, which cannot both be right; awaiting the correct value.",
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
  /**
   * Each paragraph is tied to the documented build: the ESP32-CAM capture
   * path, the FastAPI / PostgreSQL service, the on-device TFLite inference,
   * and the FOMO decoder fix described in `outcome`. No figure is quoted.
   */
  lessons: [
    "A model is one part of a camera workflow. Getting the ESP32-CAM to capture, run the quantised model, and report each detection into the FastAPI service — with PostgreSQL keeping the history the dashboard reads — was as much of the project as the model was.",
    "What a model outputs is not yet a detection. The FOMO grid gave one cell per activation, and turning that into application-level results took post-processing the model itself never provided.",
    "The critical bug lived in that post-processing, not in the model. One plant producing dozens of boxes was the decoder reading every active grid cell as its own object; implementing Connected Component Analysis with a breadth-first search over 8-connected neighbours made a cluster of cells one detection with one bounding rectangle.",
    "Debugging inference on a constrained device meant reasoning about the whole path — capture, quantised model, decoder, API — rather than any one stage, because the wrong output could have come from any of them.",
  ],
  stack: [
    {
      label: "Model",
      items: ["MobileNetV2 FOMO", "INT8 quantised", "TensorFlow Lite"],
    },
    { label: "Build", items: ["FastAPI", "PostgreSQL", "Web integration"] },
    { label: "Deploy", items: ["ESP32-CAM", "Docker", "Linux VPS"] },
  ],
  /**
   * The class breakdown is not documented; that gap is recorded in `pending`
   * rather than as a note on the page (owner decision, 2026-09-21).
   */
  dataset: {
    label: "Melon plant image dataset",
    imageCount: 1250,
    classes: null,
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
  /**
   * Decided 2026-09-21, so not pending: the client is not named, and no live
   * URL is added. The `Live` link stays `href: null` with its note, which is
   * data only — the page renders no row for a link without an address.
   */
  pending: [
    "Detection accuracy or any evaluation figures — the owner confirms none exist (Detail.txt, Melon §6).",
    "Dataset class breakdown — not documented; kept off the page.",
  ],
};

/** Ordered as they appear in the Selected Work section. */
export const projects: Project[] = [thoraxVision, melonVisionAi];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
