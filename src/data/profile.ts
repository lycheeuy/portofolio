import type { Profile } from "@/types";

/**
 * Owner profile.
 *
 * Every field below traces to `Docs/User Input Session.txt`, `Docs/PRD.txt`,
 * `Docs/DEVELOPMENT_LOG.md`, or the owner's input in `Docs/Detail.txt` as
 * confirmed on 2026-09-19 (final email, city) and in Phase 6F (institution,
 * focus areas, and the `about` copy). Nothing is inferred. Items the owner
 * has not supplied are listed in `pending` rather than filled in.
 *
 * Two places, both correct, not to be conflated: the owner *studied* at
 * Telkom University Purwokerto (`education.institution`) and *lives* in Kota
 * Cirebon (`location`).
 */
export const profile: Profile = {
  displayName: "Alif Reezi",
  fullName: "Nashiruddin Alif Alvareezi",
  status: "Fresh Graduate",
  location: "Kota Cirebon, West Java, Indonesia",
  positioning:
    "AI / Machine Learning Engineer working across computer vision, model experimentation, and research.",
  roles: [
    "AI / Machine Learning Engineer",
    "Fullstack Developer",
    "Graphic Designer",
  ],
  /** Confirmed by the owner in Phase 6F, replacing the Phase 5E list. */
  focusAreas: [
    "Computer Vision",
    "Machine Learning",
    "Deep Learning",
    "Research",
  ],
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
    institution: "Telkom University Purwokerto",
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
      value: "alifalvareezi1@gmail.com",
      href: "mailto:alifalvareezi1@gmail.com",
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

  /**
   * The owner's six answers from `Docs/Detail.txt` ("Data ABOUT ME"),
   * rendered from Indonesian into English as plainly as the original.
   * First person because the original is; nothing added, nothing intensified.
   * Two editorial omissions: the opening "Hai!" and the source's bold
   * markup, neither of which belongs in running body copy.
   */
  about: {
    interests: [
      "Right now I am most interested in going deeper into AI engineering, machine learning, and computer vision. I want to understand better how AI is not just built as a model, but developed into a system that can genuinely be used.",
      "Lately I have also become interested in AI automation — how AI can help simplify work and turn workflows that used to be manual into something more automatic.",
    ],
    background: [
      "What first drew me in was how interesting it is to watch data being turned into something that helps people solve problems.",
      "From there I started learning machine learning and computer vision. My background in Biomedical Engineering made me even more interested in applying AI in the real world — one example being a project that detects disease from X-ray images.",
      "What I like most is the process: starting from data that is still messy, trying to build a model, evaluating the results, and finally turning that model into something usable.",
    ],
    building: [
      "I usually like building projects that combine AI with software development.",
      "To me, a project is interesting when it does not stop at training a model or at a notebook. I would rather take the model further, into an application or a system someone can actually use.",
      "I also like working on projects with a real problem to solve — computer vision, AI automation, or applications that bring AI together with a backend and a frontend.",
    ],
    learning: [
      "At the moment I am learning how to build AI/ML systems end to end.",
      "Alongside going deeper into machine learning and computer vision, I am also learning more about FastAPI, React/Next.js, REST APIs, databases, Docker, and deployment.",
      "I want to understand the whole process: building a model, connecting it to a backend, building an interface for people to use, and finally deploying it so it is ready to use.",
    ],
    direction: [
      "If asked where I want to go, I am most interested in becoming an AI Engineer or ML Engineer with a focus on computer vision.",
      "At the same time, I want to keep the research side in that journey. I like running experiments, comparing approaches, finding out why a model works or does not, and looking for ways to improve it.",
      "So if I had to describe it, I want to sit between research and engineering — understanding the technology deeply, but also being able to turn it into something real.",
    ],
    approach: [
      "What I find most interesting is that I like building things from scratch and finding out how everything works.",
      "I am not that interested in making something just so the project is finished. I usually want to know why something works, what could be improved, and how to make it more useful.",
      "I also like combining several fields in one project — AI as the brain, the backend as the connector, and the frontend as the way you interact with the system.",
      "In the end, an interesting project is not only about the final result. I enjoy the journey more: I have an idea, I try to build it, I run into a problem, I fix it — until it becomes something that can genuinely be used.",
    ],
  },

  pending: [
    "Hero mission statement — five options remain owner-pending (Phase 5D-1).",
    "Graduation year.",
    "Work experience entries — none are documented yet.",
  ],
};
