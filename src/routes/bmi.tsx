import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ToolShell } from "@/components/SiteShell";
import { RelatedTools } from "@/components/RelatedTools";

export const Route = createFileRoute("/bmi")({
  head: () => ({
    meta: [
      { title: "BMI Calculator — Body Mass Index in Metric & Imperial" },
      { name: "description", content: "Free BMI calculator: enter height and weight in cm/kg or ft/lb to see your Body Mass Index, category and healthy range in one tap." },
      { name: "keywords", content: "BMI calculator, body mass index, healthy weight, BMI metric, BMI imperial, weight category, BMI chart" },
      { property: "og:title", content: "BMI Calculator — Metric & Imperial" },
      { property: "og:description", content: "Instant BMI from height and weight, with category and healthy range." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/bmi" },
    ],
    links: [{ rel: "canonical", href: "/bmi" }],
  }),
  component: BMIPage,
});

function BMIPage() {
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(65);

  const bmi = useMemo(() => {
    if (!height || !weight) return 0;
    if (unit === "metric") return weight / Math.pow(height / 100, 2);
    return (703 * weight) / Math.pow(height, 2);
  }, [unit, height, weight]);

  const category =
    bmi < 18.5 ? { label: "Underweight", color: "oklch(0.7 0.15 230)" } :
    bmi < 25 ? { label: "Normal", color: "oklch(0.65 0.18 150)" } :
    bmi < 30 ? { label: "Overweight", color: "oklch(0.75 0.18 80)" } :
    { label: "Obese", color: "oklch(0.6 0.22 25)" };

  return (
    <ToolShell title="BMI Calculator" subtitle="A quick estimate of body mass index from height and weight.">
      <div className="rounded-3xl border bg-card p-6 shadow-[var(--shadow-soft)]" style={{ background: "var(--gradient-card)" }}>
        <div className="mb-6 inline-flex rounded-full bg-secondary p-1 text-sm">
          {(["metric", "imperial"] as const).map((u) => (
            <button key={u} onClick={() => setUnit(u)}
              className={`rounded-full px-4 py-1.5 capitalize transition ${unit === u ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"}`}>
              {u}
            </button>
          ))}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label={`Height (${unit === "metric" ? "cm" : "in"})`} value={height} onChange={setHeight} />
          <Field label={`Weight (${unit === "metric" ? "kg" : "lb"})`} value={weight} onChange={setWeight} />
        </div>

        <div className="mt-8 rounded-2xl border bg-background p-6 text-center">
          <div className="text-sm text-muted-foreground">Your BMI</div>
          <div className="mt-1 text-5xl font-semibold tracking-tight">{bmi ? bmi.toFixed(1) : "—"}</div>
          {bmi > 0 && (
            <div className="mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium"
              style={{ background: `${category.color} / 0.15`, color: category.color }}>
              <span className="h-2 w-2 rounded-full" style={{ background: category.color }} />
              {category.label}
            </div>
          )}
        </div>
      </div>

      <RelatedTools
        links={[
          { to: "/calories", label: "How to lose weight — daily calorie calculator", desc: "Estimate the calories you need to lose or maintain weight." },
          { to: "/weight", label: "Convert weight (kg, lb, stones)", desc: "Switch between metric and imperial weight units." },
          { to: "/length", label: "Convert height (cm, ft, in)", desc: "Handy for entering height in either measurement system." },
          { to: "/calculator", label: "Open the basic calculator", desc: "Quick arithmetic for your BMI targets." },
        ]}
      />
    </ToolShell>
  );
}

function Field({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="mt-2 w-full rounded-xl border bg-background px-4 py-3 text-lg outline-none ring-ring/30 focus:ring-2"
      />
    </label>
  );
}
