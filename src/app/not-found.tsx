import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { ActionLink } from "@/components/ui/action-link";
import { leadText } from "@/components/ui/styles";

/**
 * 404, reached by `notFound()` from a project or research slug that is not in
 * the data, and by any unmatched URL.
 *
 * Rendered inside the root layout, so it keeps the header, the footer, and the
 * page's own navigation rather than dropping the reader onto a bare error
 * screen. It is the same section opener every other page uses; the index reads
 * `--` because a page that is not in the archive has no archive number.
 */
export default function NotFound() {
  return (
    <Section labelledBy="not-found-heading">
      <SectionHeader
        index="--"
        meta="404"
        heading="Not found"
        headingId="not-found-heading"
        level={1}
      >
        <p className={`mt-6 max-w-[46ch] ${leadText} text-secondary`}>
          That page is not part of this site. The index below leads back to
          everything that is.
        </p>
      </SectionHeader>

      <ul className="flex flex-wrap gap-x-8 gap-y-2">
        <li>
          <ActionLink href="/">Home</ActionLink>
        </li>
        <li>
          <ActionLink href="/projects">Projects</ActionLink>
        </li>
        <li>
          <ActionLink href="/research">Research</ActionLink>
        </li>
        <li>
          <ActionLink href="/contact">Contact</ActionLink>
        </li>
      </ul>
    </Section>
  );
}
