import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Section } from "@/components/layout/section";

/**
 * Homepage shell (Phase 5C).
 * Establishes header, navigation, anchor targets, and page rhythm.
 * Section content (Hero, Work, Research, About, Contact) is implemented
 * in later phases - sections are intentionally empty anchor targets here.
 */
export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="top">
        {/* Hero placeholder - built in Phase 5D */}
        <Section label="Introduction" className="min-h-[40vh]" />

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