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

  const { category, interpretation } = useMemo(() => {
    if (!bmi) return { category: null, interpretation: "" };
    if (bmi < 18.5)
      return {
        category: { label: "Underweight", color: "oklch(0.7 0.15 230)" },
        interpretation: "Your BMI is below the recommended range. You may need to eat more nutrient-dense foods and speak with a health professional about healthy weight gain.",
      };
    if (bmi < 25)
      return {
        category: { label: "Normal weight", color: "oklch(0.65 0.18 150)" },
        interpretation: "Your BMI falls within the healthy range. Keep up balanced eating and regular activity to maintain it.",
      };
    if (bmi < 30)
      return {
        category: { label: "Overweight", color: "oklch(0.75 0.18 80)" },
        interpretation: "Your BMI is above the healthy range. Small, consistent changes in diet and activity can help move toward a healthier weight.",
      };
    return {
      category: { label: "Obese", color: "oklch(0.6 0.22 25)" },
      interpretation: "Your BMI indicates obesity, which raises the risk of several health conditions. A clinician or dietitian can help plan a safe, sustainable approach.",
    };
  }, [bmi]);

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
          {category && (
            <div className="mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium"
              style={{ background: `${category.color} / 0.15`, color: category.color }}>
              <span className="h-2 w-2 rounded-full" style={{ background: category.color }} />
              {category.label}
            </div>
          )}
        </div>

        <div className="mt-8 rounded-2xl border bg-background p-6">
          <h3 className="text-lg font-semibold tracking-tight">Result interpretation</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {interpretation || "Enter your height and weight above to see your BMI category and what it means."}
          </p>

          <div className="mt-5 space-y-2">
            {[
              { label: "Underweight", max: "< 18.5", color: "oklch(0.7 0.15 230)" },
              { label: "Normal weight", max: "18.5 – 24.9", color: "oklch(0.65 0.18 150)" },
              { label: "Overweight", max: "25.0 – 29.9", color: "oklch(0.75 0.18 80)" },
              { label: "Obese", max: "30.0+", color: "oklch(0.6 0.22 25)" },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between rounded-xl px-3 py-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: row.color }} />
                  <span className="font-medium">{row.label}</span>
                </div>
                <span className="text-muted-foreground">{row.max}</span>
              </div>
            ))}
          </div>
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
