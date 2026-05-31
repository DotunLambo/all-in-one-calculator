import { createFileRoute, Link } from "@tanstack/react-router";
import { ToolShell } from "@/components/SiteShell";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Utilikit" },
      { name: "description", content: "About Utilikit — a free suite of everyday calculators and converters." },
      { property: "og:title", content: "About — Utilikit" },
      { property: "og:description", content: "Learn more about Utilikit and the tools we offer." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <ToolShell title="About Utilikit" subtitle="Simple, fast, and free tools for everyday calculations.">
      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-4 text-foreground">
        <p>
          Utilikit is a small collection of practical online tools — a calculator,
          a BMI estimator, a live currency converter, and a unit converter — built
          to be fast, clean, and accessible from any device.
        </p>
        <p>
          Our goal is to make everyday calculations effortless. No sign-ups, no
          clutter — just the tools you need when you need them. We support a wide
          range of currencies including the US Dollar, Euro, British Pound,
          Nigerian Naira, and many more, with live exchange rates.
        </p>
        <h2 className="mt-8 text-xl font-semibold">Our tools</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li><Link to="/calculator" className="text-primary hover:underline">Calculator</Link> — arithmetic in a clean keypad.</li>
          <li><Link to="/bmi" className="text-primary hover:underline">BMI</Link> — body mass index from height & weight.</li>
          <li><Link to="/currency" className="text-primary hover:underline">Currency</Link> — live exchange rates worldwide.</li>
          <li><Link to="/units" className="text-primary hover:underline">Units</Link> — length, mass, temperature, volume & time.</li>
        </ul>
        <h2 className="mt-8 text-xl font-semibold">Contact</h2>
        <p>
          Questions or feedback? Reach out via the contact details listed on our
          privacy page. We'd love to hear from you.
        </p>
      </div>
    </ToolShell>
  );
}
