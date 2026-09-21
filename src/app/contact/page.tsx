import type { Metadata } from "next";
import { Contact } from "@/components/sections/contact";
import { profile } from "@/data/profile";
import { getSection } from "@/data/site";
import { routeMetadata } from "@/lib/metadata";

/**
 * Contact — `/contact`.
 *
 * `Contact` owns the rendering, including the decision to publish email,
 * LinkedIn, and GitHub while keeping the phone number out. The description is
 * `profile.availability` verbatim.
 */
export const metadata: Metadata = {
  title: getSection("/contact")?.label ?? "Contact",
  description: `${profile.availability}. Reach ${profile.displayName} by email, LinkedIn, or GitHub.`,
  ...routeMetadata("/contact"),
};

export default function ContactPage() {
  return <Contact />;
}
