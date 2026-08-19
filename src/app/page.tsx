import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Section } from "@/components/layout/section";
import { Hero } from "@/components/sections/hero";

/**
 * Homepage (Phase 5D-1).
 * Header + Hero + empty anchor targets for future sections.
 */
export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="top">
        <Hero />

        {/* Anchor targets for future sections */}
        <Section id="work" label="Selected work" />
        <Section id="research" label="Research log" />
        <Section id="about" label="About" />
        <Section id="contact" label="Contact" />
      </main>
      <SiteFooter />
    </>
  );
}