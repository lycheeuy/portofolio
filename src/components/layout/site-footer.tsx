import { PageContainer } from "./page-container";

/**
 * Minimal structural footer for page-shell completeness.
 * Final footer content is implemented in a later phase.
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-border)] py-8">
      <PageContainer>
        <p className="font-mono text-[length:var(--text-meta)] tracking-[var(--tracking-mono)] text-muted">
          Alif Reezi
        </p>
      </PageContainer>
    </footer>
  );
}