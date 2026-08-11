import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/SiteShell";
import { ToolGrid, CategoryCards } from "@/components/ToolGrid";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Utilikit — Free Everyday Calculators, Converters & Loan Tools" },
      { name: "description", content: "One clean home for a free online calculator, BMI, calorie planner, currency and unit converters, plus Nigeria and US loan calculators — all in your browser." },
      { name: "keywords", content: "free online calculators, BMI calculator, calorie calculator, currency converter, unit converter, loan calculator, mortgage calculator, Utilikit" },
      { property: "og:title", content: "Utilikit — Free Everyday Calculators & Converters" },
      { property: "og:description", content: "Fast, free calculators and converters: BMI, calories, currency, length, weight, temperature and loan payments — no sign-up." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
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
