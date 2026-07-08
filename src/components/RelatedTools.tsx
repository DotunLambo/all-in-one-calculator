export type RelatedLink = { to: string; label: string; desc?: string };

export function RelatedTools({ links, heading = "Related calculators & guides" }: { links: RelatedLink[]; heading?: string }) {
  if (!links.length) return null;
  return (
    <section
      className="mt-12 rounded-3xl border bg-card p-6 shadow-[var(--shadow-soft)]"
      style={{ background: "var(--gradient-card)" }}
      aria-labelledby="related-tools-heading"
    >
      <h2 id="related-tools-heading" className="text-lg font-semibold tracking-tight">{heading}</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Explore more free tools on Utilikit — every calculator is fast, ad-light and works right in your browser.
      </p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {links.map((l) => (
          <li key={l.to + l.label}>
            <a
              href={l.to}
              className="group flex flex-col rounded-2xl border bg-background p-4 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]"
            >
              <span className="font-medium text-foreground group-hover:text-primary">{l.label}</span>
              {l.desc && <span className="mt-1 text-xs text-muted-foreground">{l.desc}</span>}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
