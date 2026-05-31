import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/SiteShell";
import { ToolGrid } from "@/components/ToolGrid";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Utilikit — Everyday calculators & converters" },
      { name: "description", content: "Free online calculator, BMI, currency converter and unit converter — fast, clean and ad-free." },
      { property: "og:title", content: "Utilikit — Everyday calculators & converters" },
      { property: "og:description", content: "Calculator, BMI, currency and unit conversion in one place." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10 opacity-20"
          style={{ background: "var(--gradient-hero)" }}
        />
        <div className="mx-auto max-w-5xl px-6 pt-16 pb-10 text-center sm:pt-24">
          <span className="inline-flex items-center rounded-full border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            Fast · Free · No sign-up
          </span>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-6xl">
            Everyday tools,{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "var(--gradient-hero)" }}
            >
              beautifully simple
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            A small kit of calculators and converters you'll actually want to use.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <ToolGrid />
      </section>
      <SiteFooter />
    </div>
  );
}
