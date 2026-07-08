import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ToolShell } from "@/components/SiteShell";
import { RelatedTools } from "@/components/RelatedTools";

export const Route = createFileRoute("/length")({
  head: () => ({
    meta: [
      { title: "Length Converter — Utilikit" },
      { name: "description", content: "Convert meters, kilometers, miles, feet, inches and more." },
      { property: "og:title", content: "Length Converter — Utilikit" },
      { property: "og:description", content: "Fast, accurate length and distance conversions." },
    ],
  }),
  component: LengthPage,
});

const UNITS: Record<string, number> = {
  mm: 0.001, cm: 0.01, m: 1, km: 1000,
  in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.344,
};

function LengthPage() {
  const list = Object.keys(UNITS);
  const [from, setFrom] = useState("m");
  const [to, setTo] = useState("ft");
  const [value, setValue] = useState(1);
  const result = useMemo(() => (value * UNITS[from]) / UNITS[to], [from, to, value]);

  return (
    <ToolShell title="Length Converter" subtitle="Convert between metric and imperial length units.">
      <div className="rounded-3xl border bg-card p-6 shadow-[var(--shadow-soft)]" style={{ background: "var(--gradient-card)" }}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Pair label="From" unit={from} units={list} onUnit={setFrom} value={value} onValue={setValue} editable />
          <Pair label="To" unit={to} units={list} onUnit={setTo} value={+result.toFixed(6)} onValue={() => {}} />
        </div>
      </div>

      <RelatedTools
        links={[
          { to: "/weight", label: "Weight converter — kg, lb, stones", desc: "Metric and imperial mass conversions." },
          { to: "/temperature", label: "Temperature converter — °C, °F, K", desc: "Convert between common temperature scales." },
          { to: "/bmi", label: "BMI calculator", desc: "Enter your height in metric or imperial." },
          { to: "/units", label: "All unit converters", desc: "Every converter in one place." },
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
