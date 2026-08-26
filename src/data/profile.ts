import type { Profile } from "@/types";

/**
 * Owner profile.
 *
 * Every field below traces to `Docs/User Input Session.txt`, `Docs/PRD.txt`,
 * or `Docs/DEVELOPMENT_LOG.md`. Nothing is inferred. Items the owner has not
 * supplied are listed in `pending` rather than filled in.
 */
export const profile: Profile = {
  displayName: "Alif Reezi",
  fullName: "Nashiruddin Alif Alvareezi",
  status: "Fresh Graduate",
  location: "Cirebon, West Java, Indonesia",
  positioning:
    "AI / Machine Learning Engineer working across computer vision, model experimentation, and research.",
  roles: [
    "AI / Machine Learning Engineer",
    "Fullstack Developer",
    "Graphic Designer",
  ],
  focusAreas: ["AI / ML Engineering", "Computer Vision", "Research"],
  trajectory: [
    "AI Engineer",
    "Machine Learning Engineer",
    "Applied AI / Generative AI",
  ],
  availability: "Available for AI / ML Engineer roles",
  education: {
    degree: "Bachelor's degree (S1)",
    field: "Biomedical Engineering",
    status: "Completed",
  },

  /**
   * Grouped by what the owner actually does, per the PRD's explicit rejection
   * of logo walls and percentage bars. Only technologies named in the PRD's
   * project descriptions appear here.
   */
  capabilities: [
    {
      label: "Model",
      items: [
        "PyTorch",
        "TensorFlow Lite",
        "Computer Vision",
        "Deep Learning",
        "Image preprocessing",
        "Augmentation",
      ],
    },
    {
      label: "Build",
      items: ["Python", "FastAPI", "PostgreSQL", "Backend / API development"],
    },
    {
      label: "Deploy",
      items: ["Docker", "Linux VPS", "ESP32-CAM", "Edge AI inference"],
    },
    {
      label: "Research",
      items: [
        "Hyperparameter experimentation",
        "Model evaluation",
        "ROC / AUC",
        "Confusion matrix",
        "Grad-CAM",
        "Scientific documentation",
      ],
    },
  ],

  contact: [
    {
      label: "Email",
      value: "nashiruddinalifalvareezi1@gmail.com",
      href: "mailto:nashiruddinalifalvareezi1@gmail.com",
      primary: true,
    },
    {
      label: "LinkedIn",
      value: "in/nashiruddinalifalvareezi",
      href: "https://www.linkedin.com/in/nashiruddinalifalvareezi/",
      primary: true,
    },
    {
      label: "GitHub",
      value: "lycheeuy",
      href: "https://github.com/lycheeuy",
      primary: true,
    },
    {
      label: "Phone",
      value: "+62 895 2014 1464",
      href: "tel:+6289520141464",
      primary: false,
    },
  ],

  pending: [
    "Hero mission statement — five options remain owner-pending (Phase 5D-1).",
    "Graduation year and institution name.",
    "Personal / 'now' copy: what he likes building, what he is currently learning.",
    "Work experience entries — none are documented yet.",
    "Location conflict: `src/app/layout.tsx` metadata says Purwokerto; the owner's input says Cirebon. Cirebon is used here.",
  ],
};
