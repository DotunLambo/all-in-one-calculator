import type { Field, ToolSpec } from "./tool-specs";
import type { ToolCategory } from "./tools";

export const n = (v: Record<string, string>, k: string) => {
  const x = parseFloat(v[k] ?? "");
  return Number.isFinite(x) ? x : 0;
};
export const s = (v: Record<string, string>, k: string) => v[k] ?? "";
export const f = (x: number, dp = 2) =>
  Number.isFinite(x) ? x.toLocaleString(undefined, { maximumFractionDigits: dp }) : "—";

export const num = (key: string, label: string, def: string | number, unit?: string): Field => ({
  key,
  label,
  type: "number",
  def: String(def),
  ...(unit ? { unit } : {}),
});

export const sel = (key: string, label: string, options: string[], def?: string): Field => ({
  key,
  label,
  type: "select",
  def: def ?? options[0],
  options: options.map((o) => ({ value: o, label: o })),
});

export const dat = (key: string, label: string, def = "today"): Field => ({
  key,
  label,
  type: "date",
  def,
});

export const pmt = (P: number, r: number, months: number) =>
  months <= 0 ? 0 : r === 0 ? P / months : (P * r) / (1 - Math.pow(1 + r, -months));

export const parseDate = (value: string) => {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? new Date() : d;
};

export const DAY = 86400000;

/** Build a unit-conversion tool from a base-unit factor map. */
export const conv = (
  slug: string,
  category: ToolCategory,
  title: string,
  desc: string,
  intro: string,
  keywords: string[],
  units: Record<string, number>,
  defFrom?: string,
  defTo?: string,
): ToolSpec => {
  const keys = Object.keys(units);
  return {
    slug,
    category,
    title,
    desc,
    intro,
    keywords,
    fields: [num("value", "Value", 1), sel("from", "From", keys, defFrom ?? keys[0]), sel("to", "To", keys, defTo ?? keys[1] ?? keys[0])],
    compute: (v) => {
      const from = units[s(v, "from")] ?? 1;
      const to = units[s(v, "to")] ?? 1;
      const out = (n(v, "value") * from) / to;
      return [
        { label: "Result", value: `${f(out, 6)} ${s(v, "to")}`, primary: true },
        { label: "Rate", value: `1 ${s(v, "from")} = ${f(from / to, 6)} ${s(v, "to")}` },
      ];
    },
  };
};
