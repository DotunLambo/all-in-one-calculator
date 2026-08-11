import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/SiteShell";
import { ToolCards } from "@/components/ToolGrid";
import { tools, TOOL_CATEGORIES } from "@/lib/tools";
import { getSpec, initialValue, type Field } from "@/lib/tool-specs";

export const Route = createFileRoute("/tool/$slug")({
  loader: ({ params }) => {
    const spec = getSpec(params.slug);
    if (!spec) throw notFound();
    return { slug: spec.slug, title: spec.title, desc: spec.desc, intro: spec.intro, category: spec.category };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Tool not found — Utilikit" }, { name: "robots", content: "noindex" }] };
    }
    const { title, intro, slug, category } = loaderData;
    const metaTitle = `${title} — Free Online Tool | Utilikit`;
    return {
      meta: [
        { title: metaTitle },
        { name: "description", content: intro },
        { name: "keywords", content: `${title}, ${category}, free calculator, online tool` },
        { property: "og:title", content: metaTitle },
        { property: "og:description", content: intro },
        { property: "og:type", content: "website" },
        { property: "og:url", content: `/tool/${slug}` },
        { name: "twitter:card", content: "summary" },
      ],
      links: [{ rel: "canonical", href: `/tool/${slug}` }],
    };
  },
  component: ToolPage,
});

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: string;
  onChange: (v: string) => void;
}) {
  const id = `f-${field.key}`;
  return (
    <label htmlFor={id} className="block">
      <span className="text-sm font-medium text-foreground">
        {field.label}
        {field.unit ? <span className="ml-1 text-muted-foreground">({field.unit})</span> : null}
      </span>
      {field.type === "select" ? (
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1.5 w-full rounded-xl border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
        >
          {field.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          type={field.type === "date" ? "date" : "number"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1.5 w-full rounded-xl border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      )}
    </label>
  );
}

function ToolPage() {
  const { slug } = Route.useLoaderData();
  const spec = getSpec(slug)!;
  const category = TOOL_CATEGORIES.find((c) => c.name === spec.category);
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(spec.fields.map((f) => [f.key, initialValue(f)])),
  );

  const results = useMemo(() => {
    try {
      return spec.compute(values);
    } catch {
      return [{ label: "Result", value: "—" }];
    }
  }, [spec, values]);

  const related = tools.filter((t) => t.category === spec.category && t.to !== `/tool/${slug}`).slice(0, 4);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span aria-hidden className="text-muted-foreground/60">/</span>
          {category ? (
            <Link to="/category/$slug" params={{ slug: category.slug }} className="hover:text-foreground">
              {category.name}
            </Link>
          ) : (
            <span>{spec.category}</span>
          )}
          <span aria-hidden className="text-muted-foreground/60">/</span>
          <span className="text-foreground">{spec.title}</span>
        </nav>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">{spec.title}</h1>
        <p className="mt-3 text-muted-foreground">{spec.intro}</p>

        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          <div className="space-y-4">
            {spec.fields.map((field) => (
              <FieldInput
                key={field.key}
                field={field}
                value={values[field.key] ?? ""}
                onChange={(v) => setValues((prev) => ({ ...prev, [field.key]: v }))}
              />
            ))}
          </div>

          <div
            className="h-fit rounded-2xl border p-6 shadow-[var(--shadow-soft)]"
            style={{ background: "var(--gradient-card)" }}
          >
            <h2 className="text-sm font-medium text-muted-foreground">Results</h2>
            <div className="mt-3 space-y-3">
              {results.map((r) => (
                <div key={r.label}>
                  <p className="text-xs text-muted-foreground">{r.label}</p>
                  <p className={r.primary ? "text-2xl font-semibold text-foreground" : "text-base text-foreground"}>
                    {r.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-14 border-t pt-8">
            <h2 className="mb-5 text-lg font-semibold tracking-tight">More {spec.category} tools</h2>
            <ToolCards items={related} />
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
