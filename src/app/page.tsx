import { Hero } from "@/components/sections/hero";
import { SiteIndex } from "@/components/sections/site-index";

/**
 * Home — `/`.
 *
 * The identity page: who this is, where they are, what they do, and where to
 * go next. Phase 6D moved Selected Work, the Research log, About, and Contact
 * onto their own routes, so what remains here is the Hero — name, positioning,
 * trajectory, availability, the Cirebon colophon, and the Lanyard — followed
 * by the directory that replaces the scroll those four sections used to be.
 *
 * The header and footer are rendered by the root layout, not here.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <SiteIndex />
    </>
  );
}
