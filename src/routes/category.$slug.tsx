import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/SiteShell";
import { ToolCards } from "@/components/ToolGrid";
import { tools, TOOL_CATEGORIES } from "@/lib/tools";

export const Route = createFileRoute("/category/$slug")({
  loader: ({ params }) => {
    const category = TOOL_CATEGORIES.find((c) => c.slug === params.slug);
    if (!category) throw notFound();
    return { category };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Category not found — Utilikit" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { category } = loaderData;
    const breadcrumbLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "/" },
        { "@type": "ListItem", position: 2, name: category.name, item: `/category/${category.slug}` },
      ],
    };
    return {
      meta: [
        { title: category.metaTitle },
        { name: "description", content: category.metaDescription },
        { property: "og:title", content: category.metaTitle },
        { property: "og:description", content: category.metaDescription },
        { property: "og:type", content: "website" },
        { property: "og:url", content: `/category/${category.slug}` },
      ],
      links: [{ rel: "canonical", href: `/category/${category.slug}` }],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(breadcrumbLd) },
      ],
    };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { category } = Route.useLoaderData();
  const items = tools.filter((t) => t.category === category.name);
  const others = TOOL_CATEGORIES.filter((c) => c.slug !== category.slug);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-6 py-12">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span aria-hidden className="text-muted-foreground/60">/</span>
          <span className="text-foreground">{category.name}</span>
        </nav>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
          {category.name}
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">{category.intro}</p>

        <div className="mt-10">
          {items.length > 0 ? (
            <ToolCards items={items} />
          ) : (
            <div className="rounded-2xl border bg-card p-8 text-center text-muted-foreground">
              <p className="text-sm">
                Tools for {category.name} are on the way. Explore the categories below in the meantime.
              </p>
            </div>
          )}
        </div>

        <section className="mt-14 border-t pt-8">
          <h2 className="text-lg font-semibold tracking-tight">Browse other categories</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {others.map((c) => (
              <Link
                key={c.slug}
                to="/category/$slug"
                params={{ slug: c.slug }}
                className="rounded-full border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
