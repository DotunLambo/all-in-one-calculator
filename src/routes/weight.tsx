import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ToolShell } from "@/components/SiteShell";
import { RelatedTools } from "@/components/RelatedTools";

export const Route = createFileRoute("/weight")({
  head: () => ({
    meta: [
      { title: "Weight Converter — Utilikit" },
      { name: "description", content: "Convert kilograms, grams, pounds, ounces, stones and tonnes." },
      { property: "og:title", content: "Weight Converter — Utilikit" },
      { property: "og:description", content: "Fast, accurate weight and mass conversions." },
    ],
  }),
  component: WeightPage,
});

const UNITS: Record<string, number> = {
  mg: 1e-6, g: 0.001, kg: 1, t: 1000,
  oz: 0.0283495, lb: 0.453592, st: 6.35029,
};

function WeightPage() {
  const list = Object.keys(UNITS);
  const [from, setFrom] = useState("kg");
  const [to, setTo] = useState("lb");
  const [value, setValue] = useState(1);
  const result = useMemo(() => (value * UNITS[from]) / UNITS[to], [from, to, value]);

  return (
    <ToolShell title="Weight Converter" subtitle="Convert between metric and imperial weight units.">
      <div className="rounded-3xl border bg-card p-6 shadow-[var(--shadow-soft)]" style={{ background: "var(--gradient-card)" }}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Pair label="From" unit={from} units={list} onUnit={setFrom} value={value} onValue={setValue} editable />
          <Pair label="To" unit={to} units={list} onUnit={setTo} value={+result.toFixed(6)} onValue={() => {}} />
        </div>
      </div>

      <RelatedTools
        links={[
          { to: "/bmi", label: "BMI calculator — check your Body Mass Index", desc: "Pair weight with height to gauge healthy range." },
          { to: "/calories", label: "How to lose weight — calorie calculator", desc: "Estimate daily calories for weight loss or gain." },
          { to: "/length", label: "Length converter — cm, m, ft, in", desc: "Convert your height alongside your weight." },
          { to: "/units", label: "All unit converters", desc: "Browse every converter in one place." },
        ]}
      />
    </ToolShell>
  );
}

function Pair({
  label, unit, units, onUnit, value, onValue, editable,
}: {
  label: string; unit: string; units: string[]; onUnit: (u: string) => void;
  value: number; onValue: (n: number) => void; editable?: boolean;
}) {
  return (
    <div className="rounded-2xl border bg-background p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
        <select value={unit} onChange={(e) => onUnit(e.target.value)} className="rounded-lg border bg-background px-2 py-1 text-sm outline-none">
          {units.map((u) => <option key={u} value={u}>{u}</option>)}
        </select>
      </div>
      <input type="number" value={Number.isFinite(value) ? value : 0} readOnly={!editable}
        onChange={(e) => onValue(parseFloat(e.target.value) || 0)}
        className="mt-3 w-full bg-transparent text-3xl font-semibold tracking-tight outline-none" />
    </div>
  );
}
