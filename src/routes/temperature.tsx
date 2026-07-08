import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ToolShell } from "@/components/SiteShell";
import { RelatedTools } from "@/components/RelatedTools";

export const Route = createFileRoute("/temperature")({
  head: () => ({
    meta: [
      { title: "Temperature Converter — Utilikit" },
      { name: "description", content: "Convert Celsius, Fahrenheit and Kelvin instantly." },
      { property: "og:title", content: "Temperature Converter — Utilikit" },
      { property: "og:description", content: "Fast, accurate temperature conversions." },
    ],
  }),
  component: TempPage,
});

const UNITS = ["C", "F", "K"] as const;
type U = (typeof UNITS)[number];

function convert(v: number, from: U, to: U) {
  const c = from === "C" ? v : from === "F" ? (v - 32) * 5 / 9 : v - 273.15;
  return to === "C" ? c : to === "F" ? c * 9 / 5 + 32 : c + 273.15;
}

function TempPage() {
  const [from, setFrom] = useState<U>("C");
  const [to, setTo] = useState<U>("F");
  const [value, setValue] = useState(0);
  const result = useMemo(() => convert(value, from, to), [from, to, value]);

  return (
    <ToolShell title="Temperature Converter" subtitle="Convert between Celsius, Fahrenheit and Kelvin.">
      <div className="rounded-3xl border bg-card p-6 shadow-[var(--shadow-soft)]" style={{ background: "var(--gradient-card)" }}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Pair label="From" unit={from} onUnit={(u) => setFrom(u as U)} value={value} onValue={setValue} editable />
          <Pair label="To" unit={to} onUnit={(u) => setTo(u as U)} value={+result.toFixed(4)} onValue={() => {}} />
        </div>
      </div>

      <RelatedTools
        links={[
          { to: "/length", label: "Length converter — meters, feet, miles", desc: "Convert distances between metric and imperial." },
          { to: "/weight", label: "Weight converter — kg to lb", desc: "Great for cooking and shipping conversions." },
          { to: "/calculator", label: "Basic calculator", desc: "Quick arithmetic for weather or cooking math." },
          { to: "/units", label: "All unit converters", desc: "Browse every converter in one place." },
        ]}
      />
    </ToolShell>
  );
}

function Pair({
  label, unit, onUnit, value, onValue, editable,
}: {
  label: string; unit: string; onUnit: (u: string) => void;
  value: number; onValue: (n: number) => void; editable?: boolean;
}) {
  return (
    <div className="rounded-2xl border bg-background p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
        <select value={unit} onChange={(e) => onUnit(e.target.value)} className="rounded-lg border bg-background px-2 py-1 text-sm outline-none">
          {UNITS.map((u) => <option key={u} value={u}>°{u}</option>)}
        </select>
      </div>
      <input type="number" value={Number.isFinite(value) ? value : 0} readOnly={!editable}
        onChange={(e) => onValue(parseFloat(e.target.value) || 0)}
        className="mt-3 w-full bg-transparent text-3xl font-semibold tracking-tight outline-none" />
    </div>
  );
}
