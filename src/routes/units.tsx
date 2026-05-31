import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ToolShell } from "@/components/SiteShell";

export const Route = createFileRoute("/units")({
  head: () => ({
    meta: [
      { title: "Unit Converter — Utilikit" },
      { name: "description", content: "Convert length, mass, temperature, volume and time units." },
    ],
  }),
  component: UnitsPage,
});

type Category = "length" | "mass" | "temperature" | "volume" | "time";

// factor = value in base unit
const UNITS: Record<Category, { base: string; units: Record<string, number> }> = {
  length: { base: "m", units: { mm: 0.001, cm: 0.01, m: 1, km: 1000, in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.344 } },
  mass: { base: "kg", units: { mg: 1e-6, g: 0.001, kg: 1, t: 1000, oz: 0.0283495, lb: 0.453592, st: 6.35029 } },
  volume: { base: "L", units: { ml: 0.001, L: 1, "m³": 1000, tsp: 0.00492892, tbsp: 0.0147868, "cup (US)": 0.24, "pt (US)": 0.473176, "qt (US)": 0.946353, "gal (US)": 3.78541 } },
  time: { base: "s", units: { ms: 0.001, s: 1, min: 60, h: 3600, day: 86400, week: 604800 } },
  temperature: { base: "C", units: { C: 1, F: 1, K: 1 } },
};

function convertTemp(v: number, from: string, to: string) {
  const c = from === "C" ? v : from === "F" ? (v - 32) * 5 / 9 : v - 273.15;
  return to === "C" ? c : to === "F" ? c * 9 / 5 + 32 : c + 273.15;
}

function UnitsPage() {
  const [cat, setCat] = useState<Category>("length");
  const unitList = Object.keys(UNITS[cat].units);
  const [from, setFrom] = useState(unitList[0]);
  const [to, setTo] = useState(unitList[1]);
  const [value, setValue] = useState(1);

  const result = useMemo(() => {
    if (cat === "temperature") return convertTemp(value, from, to);
    const u = UNITS[cat].units;
    return (value * u[from]) / u[to];
  }, [cat, from, to, value]);

  const onCat = (c: Category) => {
    setCat(c);
    const keys = Object.keys(UNITS[c].units);
    setFrom(keys[0]); setTo(keys[1]);
  };

  return (
    <ToolShell title="Unit Converter" subtitle="Length, mass, temperature, volume and time — all in one place.">
      <div className="rounded-3xl border bg-card p-6 shadow-[var(--shadow-soft)]" style={{ background: "var(--gradient-card)" }}>
        <div className="mb-6 flex flex-wrap gap-2">
          {(Object.keys(UNITS) as Category[]).map((c) => (
            <button key={c} onClick={() => onCat(c)}
              className={`rounded-full px-4 py-1.5 text-sm capitalize transition ${
                cat === c ? "text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
              style={cat === c ? { background: "var(--gradient-hero)" } : undefined}>
              {c}
            </button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Pair label="From" unit={from} units={unitList} onUnit={setFrom}
            value={value} onValue={setValue} editable />
          <Pair label="To" unit={to} units={unitList} onUnit={setTo}
            value={+result.toFixed(6)} onValue={() => {}} />
        </div>
      </div>
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
        <select value={unit} onChange={(e) => onUnit(e.target.value)}
          className="rounded-lg border bg-background px-2 py-1 text-sm outline-none">
          {units.map((u) => <option key={u} value={u}>{u}</option>)}
        </select>
      </div>
      <input
        type="number"
        value={Number.isFinite(value) ? value : 0}
        readOnly={!editable}
        onChange={(e) => onValue(parseFloat(e.target.value) || 0)}
        className="mt-3 w-full bg-transparent text-3xl font-semibold tracking-tight outline-none"
      />
    </div>
  );
}
