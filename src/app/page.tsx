import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Hero } from "@/components/sections/hero";
import { SelectedWork } from "@/components/sections/selected-work";
import { ResearchLog } from "@/components/sections/research-log";
import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";

/**
 * Homepage.
 * Header + Hero + Selected Work + Research log + About + Contact + Footer.
 * Every section on the page is now built; none is a bare anchor.
 *
 * `main` is the skip-link target, so it carries tabIndex={-1} to be
 * programmatically focusable without entering the tab order.
 */
export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="top" tabIndex={-1} className="outline-none">
        <Hero />
        <SelectedWork />
        <ResearchLog />
        <About />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}