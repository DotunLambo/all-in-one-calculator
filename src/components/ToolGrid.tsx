import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { tools, TOOL_CATEGORIES, type Tool } from "@/lib/tools";

export function ToolCards({ items }: { items: Tool[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {items.map(({ to, title, desc, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          className="group relative overflow-hidden rounded-2xl border bg-card p-6 shadow-[var(--shadow-soft)] transition-all hover:shadow-[var(--shadow-elegant)] hover:-translate-y-0.5"
          style={{ background: "var(--gradient-card)" }}
        >
          <div className="flex items-start gap-4">
            <div
              className="grid h-12 w-12 place-items-center rounded-xl text-primary-foreground"
              style={{ background: "var(--gradient-hero)" }}
            >
              <Icon className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
            </div>
          </div>
          <span
            className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 transition-transform group-hover:scale-x-100"
            style={{ background: "var(--gradient-hero)" }}
          />
        </Link>
      ))}
    </div>
  );
}

export function CategoryCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {TOOL_CATEGORIES.map((category) => {
        const count = tools.filter((t) => t.category === category.name).length;
        return (
          <Link
            key={category.slug}
            to="/category/$slug"
            params={{ slug: category.slug }}
            className="group relative flex flex-col rounded-2xl border bg-card p-5 shadow-[var(--shadow-soft)] transition-all hover:shadow-[var(--shadow-elegant)] hover:-translate-y-0.5"
            style={{ background: "var(--gradient-card)" }}
          >
            <h3 className="text-base font-semibold text-foreground">
              {category.name}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {category.desc}
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary">
              {count > 0 ? `${count} tool${count > 1 ? "s" : ""}` : "Coming soon"}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
            <span
              className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 transition-transform group-hover:scale-x-100"
              style={{ background: "var(--gradient-hero)" }}
            />
          </Link>
        );
      })}
    </div>
  );
}

export function ToolGrid() {
  return (
    <div className="space-y-12">
      {TOOL_CATEGORIES.map((category) => {
        const items = tools.filter((t) => t.category === category.name);
        if (!items.length) return null;
        return (
          <section key={category.slug} aria-labelledby={`cat-${category.slug}`}>
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2
                  id={`cat-${category.slug}`}
                  className="text-xl font-semibold tracking-tight text-foreground"
                >
                  {category.name}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">{category.desc}</p>
              </div>
              <Link
                to="/category/$slug"
                params={{ slug: category.slug }}
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <ToolCards items={items} />
          </section>
        );
      })}
    </div>
  );
}
