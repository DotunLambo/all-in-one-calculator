import type { ToolCategory } from "./tools";

export type Field = {
  key: string;
  label: string;
  type: "number" | "select" | "date";
  def: string;
  unit?: string;
  options?: { value: string; label: string }[];
  step?: number;
};

export type Result = { label: string; value: string; primary?: boolean };

export type ToolSpec = {
  slug: string;
  category: ToolCategory;
  title: string;
  desc: string;
  intro: string;
  keywords: string[];
  fields: Field[];
  compute: (v: Record<string, string>) => Result[];
};

/* ---------- helpers ---------- */

const n = (v: Record<string, string>, k: string) => {
  const x = parseFloat(v[k] ?? "");
  return Number.isFinite(x) ? x : 0;
};
const s = (v: Record<string, string>, k: string) => v[k] ?? "";
export const f = (x: number, dp = 2) =>
  Number.isFinite(x)
    ? x.toLocaleString(undefined, { maximumFractionDigits: dp })
    : "—";

const num = (key: string, label: string, def: string | number, unit?: string): Field => ({
  key,
  label,
  type: "number",
  def: String(def),
  ...(unit ? { unit } : {}),
});
const sel = (key: string, label: string, options: string[], def?: string): Field => ({
  key,
  label,
  type: "select",
  def: def ?? options[0],
  options: options.map((o) => ({ value: o, label: o })),
});
const dat = (key: string, label: string, def = "today"): Field => ({
  key,
  label,
  type: "date",
  def,
});

const pmt = (P: number, r: number, months: number) =>
  months <= 0 ? 0 : r === 0 ? P / months : (P * r) / (1 - Math.pow(1 + r, -months));

const parseDate = (value: string) => {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? new Date() : d;
};
const DAY = 86400000;

/** Build a unit-conversion tool from a base-unit factor map. */
const conv = (
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
    fields: [
      num("value", "Value", 1),
      sel("from", "From", keys, defFrom ?? keys[0]),
      sel("to", "To", keys, defTo ?? keys[1] ?? keys[0]),
    ],
    compute: (v) => {
      const from = units[s(v, "from")] ?? 1;
      const to = units[s(v, "to")] ?? 1;
      const out = (n(v, "value") * from) / to;
      return [
        { label: "Result", value: `${f(out, 6)} ${s(v, "to")}`, primary: true },
        {
          label: "Rate",
          value: `1 ${s(v, "from")} = ${f(from / to, 6)} ${s(v, "to")}`,
        },
      ];
    },
  };
};

/* ---------- Math & Everyday ---------- */

const math: ToolSpec[] = [
  {
    slug: "average-calculator",
    category: "Math & Everyday",
    title: "Average Calculator",
    desc: "Find the mean of up to five numbers.",
    intro: "Add your numbers and get the mean, total and count instantly.",
    keywords: ["average", "mean", "sum", "numbers"],
    fields: [
      num("a", "Number 1", 10),
      num("b", "Number 2", 20),
      num("c", "Number 3", 30),
      num("d", "Number 4", 0),
      num("e", "Number 5", 0),
    ],
    compute: (v) => {
      const raw = ["a", "b", "c", "d", "e"]
        .map((k) => v[k])
        .filter((x) => x !== "" && x !== undefined)
        .map((x) => parseFloat(x))
        .filter((x) => Number.isFinite(x));
      const total = raw.reduce((t, x) => t + x, 0);
      return [
        { label: "Average", value: f(raw.length ? total / raw.length : 0, 4), primary: true },
        { label: "Total", value: f(total, 4) },
        { label: "Count", value: String(raw.length) },
      ];
    },
  },
  {
    slug: "power-root-calculator",
    category: "Math & Everyday",
    title: "Power & Root Calculator",
    desc: "Exponents, square roots and nth roots.",
    intro: "Raise a number to any power or take its nth root in one step.",
    keywords: ["power", "exponent", "square root", "nth root"],
    fields: [num("base", "Base", 2), num("exp", "Exponent / root", 8)],
    compute: (v) => {
      const b = n(v, "base");
      const e = n(v, "exp");
      return [
        { label: `${f(b)} ^ ${f(e)}`, value: f(Math.pow(b, e), 6), primary: true },
        { label: "Square root", value: f(Math.sqrt(Math.abs(b)), 6) },
        { label: `${f(e)}th root`, value: e ? f(Math.pow(Math.abs(b), 1 / e), 6) : "—" },
      ];
    },
  },
  {
    slug: "ratio-calculator",
    category: "Math & Everyday",
    title: "Ratio Calculator",
    desc: "Simplify and solve A:B = C:D.",
    intro: "Simplify a ratio to its lowest terms and solve for the missing value.",
    keywords: ["ratio", "proportion", "scale", "simplify"],
    fields: [num("a", "A", 4), num("b", "B", 6), num("c", "C", 10)],
    compute: (v) => {
      const a = n(v, "a");
      const b = n(v, "b");
      const c = n(v, "c");
      const gcd = (x: number, y: number): number => (y < 1e-9 ? x : gcd(y, x % y));
      const g = gcd(Math.abs(a), Math.abs(b)) || 1;
      return [
        { label: "Simplified ratio", value: `${f(a / g, 4)} : ${f(b / g, 4)}`, primary: true },
        { label: "D (where A:B = C:D)", value: a ? f((b * c) / a, 4) : "—" },
        { label: "Decimal ratio", value: b ? f(a / b, 4) : "—" },
      ];
    },
  },
  {
    slug: "rounding-calculator",
    category: "Math & Everyday",
    title: "Rounding Calculator",
    desc: "Round to decimals or the nearest step.",
    intro: "Round any number to a set number of decimals, or to the nearest 5, 10 or 100.",
    keywords: ["round", "decimal places", "nearest", "floor", "ceiling"],
    fields: [num("value", "Number", 1234.5678), num("dp", "Decimal places", 2), num("step", "Nearest step", 10)],
    compute: (v) => {
      const x = n(v, "value");
      const dp = Math.max(0, Math.min(10, Math.round(n(v, "dp"))));
      const st = n(v, "step") || 1;
      return [
        { label: `Rounded to ${dp} dp`, value: x.toFixed(dp), primary: true },
        { label: `Nearest ${f(st)}`, value: f(Math.round(x / st) * st, 4) },
        { label: "Floor / Ceiling", value: `${f(Math.floor(x), 4)} / ${f(Math.ceil(x), 4)}` },
      ];
    },
  },
];

/* ---------- Health & Fitness ---------- */

const health: ToolSpec[] = [
  {
    slug: "ideal-weight-calculator",
    category: "Health & Fitness",
    title: "Ideal Weight Calculator",
    desc: "Devine, Robinson and BMI-based targets.",
    intro: "Compare your ideal body weight across the standard clinical formulas.",
    keywords: ["ideal weight", "devine", "robinson", "target weight"],
    fields: [sel("sex", "Sex", ["Male", "Female"]), num("height", "Height", 170, "cm")],
    compute: (v) => {
      const cm = n(v, "height");
      const inchesOver5ft = Math.max(0, cm / 2.54 - 60);
      const male = s(v, "sex") === "Male";
      const devine = (male ? 50 : 45.5) + 2.3 * inchesOver5ft;
      const robinson = (male ? 52 : 49) + (male ? 1.9 : 1.7) * inchesOver5ft;
      const m = cm / 100;
      return [
        { label: "Devine formula", value: `${f(devine, 1)} kg`, primary: true },
        { label: "Robinson formula", value: `${f(robinson, 1)} kg` },
        { label: "Healthy BMI range", value: `${f(18.5 * m * m, 1)} – ${f(24.9 * m * m, 1)} kg` },
      ];
    },
  },
  {
    slug: "body-fat-calculator",
    category: "Health & Fitness",
    title: "Body Fat Calculator",
    desc: "US Navy body fat percentage estimate.",
    intro: "Estimate body fat percentage from simple tape measurements using the US Navy method.",
    keywords: ["body fat", "navy method", "lean mass", "composition"],
    fields: [
      sel("sex", "Sex", ["Male", "Female"]),
      num("height", "Height", 175, "cm"),
      num("neck", "Neck", 38, "cm"),
      num("waist", "Waist", 85, "cm"),
      num("hip", "Hip (female)", 95, "cm"),
      num("weight", "Weight", 75, "kg"),
    ],
    compute: (v) => {
      const male = s(v, "sex") === "Male";
      const h = n(v, "height");
      const bf = male
        ? 495 / (1.0324 - 0.19077 * Math.log10(Math.max(1, n(v, "waist") - n(v, "neck"))) + 0.15456 * Math.log10(Math.max(1, h))) - 450
        : 495 / (1.29579 - 0.35004 * Math.log10(Math.max(1, n(v, "waist") + n(v, "hip") - n(v, "neck"))) + 0.221 * Math.log10(Math.max(1, h))) - 450;
      const pct = Math.max(0, Math.min(70, bf));
      const w = n(v, "weight");
      return [
        { label: "Body fat", value: `${f(pct, 1)} %`, primary: true },
        { label: "Fat mass", value: `${f((pct / 100) * w, 1)} kg` },
        { label: "Lean mass", value: `${f(w - (pct / 100) * w, 1)} kg` },
      ];
    },
  },
  {
    slug: "water-intake-calculator",
    category: "Health & Fitness",
    title: "Water Intake Calculator",
    desc: "Daily hydration target by weight and activity.",
    intro: "Work out how much water to drink each day based on your weight and training time.",
    keywords: ["water", "hydration", "drink", "litres"],
    fields: [num("weight", "Weight", 70, "kg"), num("exercise", "Exercise", 30, "min/day"), sel("climate", "Climate", ["Temperate", "Hot"])],
    compute: (v) => {
      const base = n(v, "weight") * 0.033;
      const extra = (n(v, "exercise") / 30) * 0.35;
      const litres = (base + extra) * (s(v, "climate") === "Hot" ? 1.15 : 1);
      return [
        { label: "Daily water", value: `${f(litres, 2)} litres`, primary: true },
        { label: "In glasses (250 ml)", value: f((litres * 1000) / 250, 0) },
        { label: "In US cups", value: f(litres * 4.227, 1) },
      ];
    },
  },
];

/* ---------- Money & Finance ---------- */

const money: ToolSpec[] = [
  {
    slug: "simple-interest-calculator",
    category: "Money & Finance",
    title: "Simple Interest Calculator",
    desc: "Interest and total on a flat-rate balance.",
    intro: "Work out flat-rate interest on a deposit or loan over any term.",
    keywords: ["simple interest", "flat rate", "principal", "term"],
    fields: [num("p", "Principal", 500000), num("r", "Annual rate", 12, "%"), num("t", "Term", 3, "years")],
    compute: (v) => {
      const i = (n(v, "p") * n(v, "r") * n(v, "t")) / 100;
      return [
        { label: "Total interest", value: f(i), primary: true },
        { label: "Total amount", value: f(n(v, "p") + i) },
        { label: "Interest per year", value: f(n(v, "t") ? i / n(v, "t") : 0) },
      ];
    },
  },
  {
    slug: "tip-calculator",
    category: "Money & Finance",
    title: "Tip Calculator",
    desc: "Split the bill and the tip evenly.",
    intro: "Add a tip to any bill and split the total across your group.",
    keywords: ["tip", "gratuity", "bill", "split"],
    fields: [num("bill", "Bill amount", 12000), num("tip", "Tip", 10, "%"), num("people", "People", 2)],
    compute: (v) => {
      const tip = (n(v, "bill") * n(v, "tip")) / 100;
      const total = n(v, "bill") + tip;
      const people = Math.max(1, Math.round(n(v, "people")));
      return [
        { label: "Total to pay", value: f(total), primary: true },
        { label: "Tip amount", value: f(tip) },
        { label: "Each person pays", value: f(total / people) },
      ];
    },
  },
];

/* ---------- Unit Converters ---------- */

const unitConv: ToolSpec[] = [
  conv(
    "area-converter",
    "Unit Converters",
    "Area Converter",
    "Square metres, feet, acres and hectares.",
    "Convert plot and floor areas between metric and imperial units.",
    ["area", "acre", "hectare", "square metre", "square feet"],
    { "m²": 1, "km²": 1e6, "ft²": 0.092903, "yd²": 0.836127, acre: 4046.86, hectare: 10000 },
    "m²",
    "ft²",
  ),
];

/* ---------- Percentage & Fractions ---------- */

const percentage: ToolSpec[] = [
  {
    slug: "percentage-of-number",
    category: "Percentage & Fractions",
    title: "Percentage of a Number",
    desc: "What is X% of Y?",
    intro: "Find any percentage of a number, plus the remainder left over.",
    keywords: ["percent", "percentage of", "part of"],
    fields: [num("pct", "Percentage", 15, "%"), num("value", "Of number", 2500)],
    compute: (v) => {
      const part = (n(v, "pct") / 100) * n(v, "value");
      return [
        { label: "Result", value: f(part, 4), primary: true },
        { label: "Remainder", value: f(n(v, "value") - part, 4) },
      ];
    },
  },
  {
    slug: "percentage-change-calculator",
    category: "Percentage & Fractions",
    title: "Percentage Change Calculator",
    desc: "Increase or decrease between two values.",
    intro: "Measure the percentage increase or decrease from an old value to a new one.",
    keywords: ["percentage change", "increase", "decrease", "growth"],
    fields: [num("from", "Original value", 200), num("to", "New value", 250)],
    compute: (v) => {
      const a = n(v, "from");
      const b = n(v, "to");
      const change = a ? ((b - a) / a) * 100 : 0;
      return [
        { label: change >= 0 ? "Increase" : "Decrease", value: `${f(Math.abs(change), 2)} %`, primary: true },
        { label: "Absolute difference", value: f(b - a, 4) },
        { label: "New as % of original", value: a ? `${f((b / a) * 100, 2)} %` : "—" },
      ];
    },
  },
  {
    slug: "percentage-difference-calculator",
    category: "Percentage & Fractions",
    title: "Percentage Difference Calculator",
    desc: "Compare two values symmetrically.",
    intro: "Compare two numbers where neither is the baseline, using the average as reference.",
    keywords: ["percentage difference", "compare", "variance"],
    fields: [num("a", "Value A", 40), num("b", "Value B", 60)],
    compute: (v) => {
      const a = n(v, "a");
      const b = n(v, "b");
      const avg = (a + b) / 2;
      return [
        { label: "Percentage difference", value: avg ? `${f((Math.abs(a - b) / avg) * 100, 2)} %` : "—", primary: true },
        { label: "Difference", value: f(Math.abs(a - b), 4) },
        { label: "Average", value: f(avg, 4) },
      ];
    },
  },
  {
    slug: "fraction-to-decimal",
    category: "Percentage & Fractions",
    title: "Fraction to Decimal & Percent",
    desc: "Convert any fraction three ways.",
    intro: "Turn a fraction into its decimal and percentage equivalents, simplified.",
    keywords: ["fraction", "decimal", "percent", "convert"],
    fields: [num("num", "Numerator", 3), num("den", "Denominator", 8)],
    compute: (v) => {
      const a = n(v, "num");
      const b = n(v, "den");
      const gcd = (x: number, y: number): number => (y < 1e-9 ? x : gcd(y, x % y));
      const g = gcd(Math.abs(a), Math.abs(b)) || 1;
      return [
        { label: "Decimal", value: b ? f(a / b, 6) : "—", primary: true },
        { label: "Percentage", value: b ? `${f((a / b) * 100, 4)} %` : "—" },
        { label: "Simplified", value: b ? `${f(a / g, 4)}/${f(b / g, 4)}` : "—" },
      ];
    },
  },
  {
    slug: "reverse-percentage-calculator",
    category: "Percentage & Fractions",
    title: "Reverse Percentage Calculator",
    desc: "Find the original value before a change.",
    intro: "Work backwards from a final amount to the original value before a percentage change.",
    keywords: ["reverse percentage", "original price", "before discount"],
    fields: [num("final", "Final value", 1150), num("pct", "Change applied", 15, "%"), sel("dir", "Direction", ["Increase", "Decrease"])],
    compute: (v) => {
      const factor = s(v, "dir") === "Increase" ? 1 + n(v, "pct") / 100 : 1 - n(v, "pct") / 100;
      const original = factor ? n(v, "final") / factor : 0;
      return [
        { label: "Original value", value: f(original, 2), primary: true },
        { label: "Amount of change", value: f(Math.abs(n(v, "final") - original), 2) },
      ];
    },
  },
];

/* ---------- Date & Time ---------- */

const dateTime: ToolSpec[] = [
  {
    slug: "days-between-dates",
    category: "Date & Time",
    title: "Days Between Dates",
    desc: "Count days, weeks and months apart.",
    intro: "Count the exact number of days between two dates, including weeks and weekdays.",
    keywords: ["days between", "date difference", "duration"],
    fields: [dat("start", "Start date"), dat("end", "End date", "+30")],
    compute: (v) => {
      const a = parseDate(s(v, "start"));
      const b = parseDate(s(v, "end"));
      const days = Math.round((b.getTime() - a.getTime()) / DAY);
      let weekdays = 0;
      const step = days >= 0 ? 1 : -1;
      for (let i = 0; i !== days; i += step) {
        const d = new Date(a.getTime() + i * DAY).getDay();
        if (d !== 0 && d !== 6) weekdays += 1;
      }
      return [
        { label: "Days", value: String(Math.abs(days)), primary: true },
        { label: "Weeks", value: f(Math.abs(days) / 7, 2) },
        { label: "Weekdays", value: String(Math.abs(weekdays)) },
      ];
    },
  },
  {
    slug: "date-add-subtract",
    category: "Date & Time",
    title: "Add or Subtract Days",
    desc: "Find a date in the future or past.",
    intro: "Add or subtract days, weeks or months from any date to find the resulting day.",
    keywords: ["add days", "subtract days", "future date", "deadline"],
    fields: [dat("start", "Start date"), num("amount", "Amount", 30), sel("unit", "Unit", ["Days", "Weeks", "Months"]), sel("dir", "Direction", ["Add", "Subtract"])],
    compute: (v) => {
      const base = parseDate(s(v, "start"));
      const sign = s(v, "dir") === "Subtract" ? -1 : 1;
      const amt = n(v, "amount") * sign;
      const out = new Date(base);
      if (s(v, "unit") === "Months") out.setMonth(out.getMonth() + Math.round(amt));
      else out.setDate(out.getDate() + Math.round(amt * (s(v, "unit") === "Weeks" ? 7 : 1)));
      return [
        { label: "Resulting date", value: out.toDateString(), primary: true },
        { label: "Day of week", value: out.toLocaleDateString(undefined, { weekday: "long" }) },
        { label: "Days from start", value: String(Math.round((out.getTime() - base.getTime()) / DAY)) },
      ];
    },
  },
  {
    slug: "age-calculator",
    category: "Date & Time",
    title: "Age Calculator",
    desc: "Exact age in years, months and days.",
    intro: "Work out an exact age from a date of birth, plus the next birthday countdown.",
    keywords: ["age", "birthday", "date of birth", "how old"],
    fields: [dat("dob", "Date of birth", "-10000")],
    compute: (v) => {
      const dob = parseDate(s(v, "dob"));
      const now = new Date();
      let years = now.getFullYear() - dob.getFullYear();
      let months = now.getMonth() - dob.getMonth();
      let days = now.getDate() - dob.getDate();
      if (days < 0) {
        months -= 1;
        days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
      }
      if (months < 0) {
        years -= 1;
        months += 12;
      }
      const next = new Date(now.getFullYear(), dob.getMonth(), dob.getDate());
      if (next < now) next.setFullYear(next.getFullYear() + 1);
      return [
        { label: "Age", value: `${years} years, ${months} months, ${days} days`, primary: true },
        { label: "Total days lived", value: f(Math.floor((now.getTime() - dob.getTime()) / DAY), 0) },
        { label: "Next birthday in", value: `${Math.ceil((next.getTime() - now.getTime()) / DAY)} days` },
      ];
    },
  },
  conv(
    "time-unit-converter",
    "Date & Time",
    "Time Unit Converter",
    "Seconds, minutes, hours, days and weeks.",
    "Convert between seconds, minutes, hours, days, weeks and years in one step.",
    ["time", "seconds", "hours", "days", "weeks"],
    { seconds: 1, minutes: 60, hours: 3600, days: 86400, weeks: 604800, years: 31557600 },
    "hours",
    "minutes",
  ),
  {
    slug: "hours-to-decimal",
    category: "Date & Time",
    title: "Hours to Decimal Converter",
    desc: "Turn hours and minutes into decimal hours.",
    intro: "Convert timesheet hours and minutes into decimal hours for payroll and invoicing.",
    keywords: ["timesheet", "decimal hours", "payroll", "minutes"],
    fields: [num("hours", "Hours", 7), num("minutes", "Minutes", 45)],
    compute: (v) => {
      const total = n(v, "hours") + n(v, "minutes") / 60;
      return [
        { label: "Decimal hours", value: f(total, 4), primary: true },
        { label: "Total minutes", value: f(total * 60, 0) },
        { label: "Total seconds", value: f(total * 3600, 0) },
      ];
    },
  },
];

/* ---------- Science & Engineering ---------- */

const science: ToolSpec[] = [
  conv(
    "speed-converter",
    "Science & Engineering",
    "Speed Converter",
    "km/h, mph, m/s, knots.",
    "Convert speeds between metric, imperial and nautical units.",
    ["speed", "kmh", "mph", "knots", "velocity"],
    { "km/h": 1, "m/s": 3.6, mph: 1.609344, knots: 1.852, "ft/s": 1.09728 },
    "km/h",
    "mph",
  ),
  conv(
    "pressure-converter",
    "Science & Engineering",
    "Pressure Converter",
    "Pa, bar, psi, atm and mmHg.",
    "Convert pressure readings between pascals, bar, psi, atmospheres and mmHg.",
    ["pressure", "psi", "bar", "pascal", "atm"],
    { Pa: 1, kPa: 1000, bar: 100000, psi: 6894.757, atm: 101325, mmHg: 133.322 },
    "bar",
    "psi",
  ),
  conv(
    "energy-converter",
    "Science & Engineering",
    "Energy Converter",
    "Joules, calories, kWh and BTU.",
    "Convert energy between joules, calories, kilowatt-hours and BTU.",
    ["energy", "joule", "calorie", "kwh", "btu"],
    { J: 1, kJ: 1000, cal: 4.184, kcal: 4184, Wh: 3600, kWh: 3600000, BTU: 1055.06 },
    "kWh",
    "kJ",
  ),
  {
    slug: "density-calculator",
    category: "Science & Engineering",
    title: "Density Calculator",
    desc: "Density from mass and volume.",
    intro: "Calculate density, and check mass or volume from the other two values.",
    keywords: ["density", "mass", "volume", "physics"],
    fields: [num("mass", "Mass", 500, "g"), num("volume", "Volume", 250, "cm³")],
    compute: (v) => {
      const d = n(v, "volume") ? n(v, "mass") / n(v, "volume") : 0;
      return [
        { label: "Density", value: `${f(d, 4)} g/cm³`, primary: true },
        { label: "In kg/m³", value: f(d * 1000, 2) },
        { label: "Relative to water", value: f(d, 3) },
      ];
    },
  },
  {
    slug: "ohms-law-calculator",
    category: "Science & Engineering",
    title: "Ohm's Law Calculator",
    desc: "Voltage, current, resistance and power.",
    intro: "Enter voltage and current to get resistance and power using Ohm's law.",
    keywords: ["ohms law", "voltage", "current", "resistance", "watts"],
    fields: [num("v", "Voltage", 12, "V"), num("i", "Current", 2, "A")],
    compute: (v) => {
      const volt = n(v, "v");
      const amp = n(v, "i");
      return [
        { label: "Resistance", value: amp ? `${f(volt / amp, 4)} Ω` : "—", primary: true },
        { label: "Power", value: `${f(volt * amp, 4)} W` },
        { label: "Energy per hour", value: `${f((volt * amp) / 1000, 4)} kWh` },
      ];
    },
  },
];

/* ---------- Business & Accounting ---------- */

const business: ToolSpec[] = [
  {
    slug: "profit-margin-calculator",
    category: "Business & Accounting",
    title: "Profit Margin Calculator",
    desc: "Gross margin from cost and price.",
    intro: "Work out gross profit and margin percentage from your cost and selling price.",
    keywords: ["profit", "margin", "gross", "pricing"],
    fields: [num("cost", "Cost price", 6000), num("price", "Selling price", 10000)],
    compute: (v) => {
      const profit = n(v, "price") - n(v, "cost");
      return [
        { label: "Gross profit", value: f(profit), primary: true },
        { label: "Margin", value: n(v, "price") ? `${f((profit / n(v, "price")) * 100, 2)} %` : "—" },
        { label: "Markup", value: n(v, "cost") ? `${f((profit / n(v, "cost")) * 100, 2)} %` : "—" },
      ];
    },
  },
  {
    slug: "markup-calculator",
    category: "Business & Accounting",
    title: "Markup Calculator",
    desc: "Set a selling price from cost.",
    intro: "Apply a markup percentage to your cost to find the right selling price.",
    keywords: ["markup", "selling price", "cost plus"],
    fields: [num("cost", "Cost price", 6000), num("markup", "Markup", 40, "%")],
    compute: (v) => {
      const price = n(v, "cost") * (1 + n(v, "markup") / 100);
      const profit = price - n(v, "cost");
      return [
        { label: "Selling price", value: f(price), primary: true },
        { label: "Profit per unit", value: f(profit) },
        { label: "Equivalent margin", value: price ? `${f((profit / price) * 100, 2)} %` : "—" },
      ];
    },
  },
  {
    slug: "break-even-calculator",
    category: "Business & Accounting",
    title: "Break-Even Calculator",
    desc: "Units needed to cover fixed costs.",
    intro: "Find how many units you must sell to cover your fixed costs.",
    keywords: ["break even", "fixed costs", "units", "contribution"],
    fields: [num("fixed", "Fixed costs", 500000), num("price", "Price per unit", 2500), num("variable", "Variable cost per unit", 1500)],
    compute: (v) => {
      const contrib = n(v, "price") - n(v, "variable");
      const units = contrib > 0 ? n(v, "fixed") / contrib : 0;
      return [
        { label: "Break-even units", value: contrib > 0 ? f(Math.ceil(units), 0) : "—", primary: true },
        { label: "Break-even revenue", value: contrib > 0 ? f(units * n(v, "price")) : "—" },
        { label: "Contribution per unit", value: f(contrib) },
      ];
    },
  },
  {
    slug: "depreciation-calculator",
    category: "Business & Accounting",
    title: "Depreciation Calculator",
    desc: "Straight-line asset depreciation.",
    intro: "Spread the cost of an asset across its useful life with straight-line depreciation.",
    keywords: ["depreciation", "asset", "straight line", "book value"],
    fields: [num("cost", "Asset cost", 1200000), num("salvage", "Salvage value", 200000), num("life", "Useful life", 5, "years")],
    compute: (v) => {
      const annual = n(v, "life") ? (n(v, "cost") - n(v, "salvage")) / n(v, "life") : 0;
      return [
        { label: "Annual depreciation", value: f(annual), primary: true },
        { label: "Monthly depreciation", value: f(annual / 12) },
        { label: "Book value after 1 year", value: f(n(v, "cost") - annual) },
      ];
    },
  },
  {
    slug: "roi-calculator",
    category: "Business & Accounting",
    title: "ROI Calculator",
    desc: "Return on investment and annualised ROI.",
    intro: "Measure the return on any investment, in total and per year.",
    keywords: ["roi", "return on investment", "gain", "annualised"],
    fields: [num("invested", "Amount invested", 1000000), num("returned", "Amount returned", 1450000), num("years", "Holding period", 3, "years")],
    compute: (v) => {
      const gain = n(v, "returned") - n(v, "invested");
      const roi = n(v, "invested") ? (gain / n(v, "invested")) * 100 : 0;
      const yrs = n(v, "years") || 1;
      const annual = n(v, "invested") > 0 ? (Math.pow(n(v, "returned") / n(v, "invested"), 1 / yrs) - 1) * 100 : 0;
      return [
        { label: "ROI", value: `${f(roi, 2)} %`, primary: true },
        { label: "Net gain", value: f(gain) },
        { label: "Annualised return", value: `${f(annual, 2)} %` },
      ];
    },
  },
];

/* ---------- Travel & Geography ---------- */

const travel: ToolSpec[] = [
  {
    slug: "trip-fuel-cost",
    category: "Travel & Geography",
    title: "Trip Fuel Cost Calculator",
    desc: "Fuel needed and cost for a journey.",
    intro: "Estimate the fuel your trip will use and what it will cost at the pump.",
    keywords: ["fuel cost", "trip", "petrol", "journey", "road trip"],
    fields: [num("distance", "Distance", 450, "km"), num("consumption", "Consumption", 8.5, "L/100km"), num("price", "Fuel price", 900, "per litre")],
    compute: (v) => {
      const litres = (n(v, "distance") * n(v, "consumption")) / 100;
      return [
        { label: "Fuel cost", value: f(litres * n(v, "price")), primary: true },
        { label: "Fuel needed", value: `${f(litres, 2)} litres` },
        { label: "Cost per km", value: n(v, "distance") ? f((litres * n(v, "price")) / n(v, "distance"), 2) : "—" },
      ];
    },
  },
  {
    slug: "travel-time-calculator",
    category: "Travel & Geography",
    title: "Travel Time Calculator",
    desc: "Journey duration from distance and speed.",
    intro: "Estimate how long a journey takes at a given average speed, including stops.",
    keywords: ["travel time", "eta", "journey", "duration", "speed"],
    fields: [num("distance", "Distance", 450, "km"), num("speed", "Average speed", 80, "km/h"), num("stops", "Break time", 30, "min")],
    compute: (v) => {
      const hours = n(v, "speed") ? n(v, "distance") / n(v, "speed") : 0;
      const total = hours + n(v, "stops") / 60;
      const h = Math.floor(total);
      return [
        { label: "Total travel time", value: `${h}h ${Math.round((total - h) * 60)}m`, primary: true },
        { label: "Driving time", value: `${f(hours, 2)} hours` },
        { label: "Arrival after", value: `${f(total * 60, 0)} minutes` },
      ];
    },
  },
  conv(
    "distance-converter",
    "Travel & Geography",
    "Distance Converter",
    "Kilometres, miles and nautical miles.",
    "Convert travel distances between kilometres, miles and nautical miles.",
    ["distance", "km to miles", "nautical mile", "travel"],
    { km: 1, miles: 1.609344, "nautical miles": 1.852, metres: 0.001 },
    "km",
    "miles",
  ),
  {
    slug: "time-zone-difference",
    category: "Travel & Geography",
    title: "Time Zone Difference",
    desc: "Compare local times across zones.",
    intro: "See the time difference between two UTC offsets and what the local time is now.",
    keywords: ["time zone", "utc", "difference", "world clock"],
    fields: [num("from", "Your UTC offset", 1), num("to", "Their UTC offset", -5)],
    compute: (v) => {
      const diff = n(v, "to") - n(v, "from");
      const nowUtc = Date.now() + new Date().getTimezoneOffset() * 60000;
      const local = new Date(nowUtc + n(v, "to") * 3600000);
      return [
        { label: "Difference", value: `${diff >= 0 ? "+" : ""}${f(diff, 1)} hours`, primary: true },
        { label: "Their local time", value: local.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
        { label: "Their local date", value: local.toDateString() },
      ];
    },
  },
  {
    slug: "fuel-needed-calculator",
    category: "Travel & Geography",
    title: "Fuel Needed Calculator",
    desc: "Litres required and refuel stops.",
    intro: "Work out how much fuel a route needs and how many refuel stops to plan.",
    keywords: ["fuel needed", "tank", "refuel", "range"],
    fields: [num("distance", "Distance", 900, "km"), num("consumption", "Consumption", 9, "L/100km"), num("tank", "Tank size", 50, "litres")],
    compute: (v) => {
      const litres = (n(v, "distance") * n(v, "consumption")) / 100;
      const range = n(v, "consumption") ? (n(v, "tank") * 100) / n(v, "consumption") : 0;
      return [
        { label: "Fuel needed", value: `${f(litres, 2)} litres`, primary: true },
        { label: "Range per tank", value: `${f(range, 0)} km` },
        { label: "Refuel stops", value: range ? String(Math.max(0, Math.ceil(n(v, "distance") / range) - 1)) : "—" },
      ];
    },
  },
];

/* ---------- Cooking & Baking ---------- */

const cooking: ToolSpec[] = [
  {
    slug: "recipe-scaler",
    category: "Cooking & Baking",
    title: "Recipe Scaler",
    desc: "Scale ingredients to new servings.",
    intro: "Scale any recipe up or down and get the new quantity for each ingredient.",
    keywords: ["recipe", "scale", "servings", "portion"],
    fields: [num("original", "Original servings", 4), num("target", "Desired servings", 6), num("amount", "Ingredient amount", 250)],
    compute: (v) => {
      const factor = n(v, "original") ? n(v, "target") / n(v, "original") : 0;
      return [
        { label: "New amount", value: f(n(v, "amount") * factor, 2), primary: true },
        { label: "Scale factor", value: `${f(factor, 3)} ×` },
        { label: "Per serving", value: n(v, "original") ? f(n(v, "amount") / n(v, "original"), 2) : "—" },
      ];
    },
  },
  {
    slug: "cups-to-grams",
    category: "Cooking & Baking",
    title: "Cups to Grams Converter",
    desc: "Common baking ingredients by weight.",
    intro: "Convert cups to grams for flour, sugar, butter, rice and other baking staples.",
    keywords: ["cups", "grams", "baking", "flour", "sugar"],
    fields: [
      num("cups", "Cups", 1),
      sel("ingredient", "Ingredient", ["Flour", "Granulated sugar", "Brown sugar", "Butter", "Rice", "Water", "Milk", "Cocoa"]),
    ],
    compute: (v) => {
      const table: Record<string, number> = {
        Flour: 125,
        "Granulated sugar": 200,
        "Brown sugar": 220,
        Butter: 227,
        Rice: 185,
        Water: 240,
        Milk: 245,
        Cocoa: 100,
      };
      const g = (table[s(v, "ingredient")] ?? 200) * n(v, "cups");
      return [
        { label: "Grams", value: f(g, 1), primary: true },
        { label: "Ounces", value: f(g / 28.3495, 2) },
        { label: "Tablespoons", value: f(n(v, "cups") * 16, 1) },
      ];
    },
  },
  {
    slug: "oven-temperature-converter",
    category: "Cooking & Baking",
    title: "Oven Temperature Converter",
    desc: "Celsius, Fahrenheit and gas mark.",
    intro: "Convert oven temperatures between Celsius, Fahrenheit, fan settings and gas marks.",
    keywords: ["oven", "gas mark", "celsius", "fahrenheit", "fan"],
    fields: [num("temp", "Temperature", 180), sel("unit", "Unit", ["Celsius", "Fahrenheit"])],
    compute: (v) => {
      const t = n(v, "temp");
      const c = s(v, "unit") === "Celsius" ? t : ((t - 32) * 5) / 9;
      const gas = Math.max(1, Math.round((c - 121) / 14) + 1);
      return [
        { label: "Celsius", value: `${f(c, 0)} °C`, primary: true },
        { label: "Fahrenheit", value: `${f((c * 9) / 5 + 32, 0)} °F` },
        { label: "Fan / Gas mark", value: `${f(c - 20, 0)} °C fan · Gas ${gas}` },
      ];
    },
  },
  conv(
    "kitchen-volume-converter",
    "Cooking & Baking",
    "Kitchen Volume Converter",
    "Teaspoons, tablespoons, cups and millilitres.",
    "Convert kitchen volumes between spoons, cups, millilitres and fluid ounces.",
    ["teaspoon", "tablespoon", "cup", "ml", "fluid ounce"],
    { ml: 1, tsp: 4.92892, tbsp: 14.7868, "fl oz": 29.5735, cup: 240, litre: 1000 },
    "cup",
    "ml",
  ),
  conv(
    "cooking-weight-converter",
    "Cooking & Baking",
    "Cooking Weight Converter",
    "Grams, ounces and pounds for recipes.",
    "Convert recipe weights between grams, kilograms, ounces and pounds.",
    ["grams", "ounces", "pounds", "recipe weight"],
    { g: 1, kg: 1000, oz: 28.3495, lb: 453.592 },
    "g",
    "oz",
  ),
];

/* ---------- Construction & DIY ---------- */

const construction: ToolSpec[] = [
  {
    slug: "area-volume-calculator",
    category: "Construction & DIY",
    title: "Area & Volume Calculator",
    desc: "Room area, volume and perimeter.",
    intro: "Measure a room or slab to get its area, perimeter and volume in one go.",
    keywords: ["area", "volume", "room", "perimeter", "square metres"],
    fields: [num("length", "Length", 5, "m"), num("width", "Width", 4, "m"), num("height", "Height", 2.7, "m")],
    compute: (v) => {
      const a = n(v, "length") * n(v, "width");
      return [
        { label: "Floor area", value: `${f(a, 2)} m²`, primary: true },
        { label: "Volume", value: `${f(a * n(v, "height"), 2)} m³` },
        { label: "Perimeter", value: `${f(2 * (n(v, "length") + n(v, "width")), 2)} m` },
      ];
    },
  },
  {
    slug: "paint-calculator",
    category: "Construction & DIY",
    title: "Paint Calculator",
    desc: "Litres of paint for your walls.",
    intro: "Estimate how much paint you need for a room, including multiple coats.",
    keywords: ["paint", "coverage", "litres", "walls", "coats"],
    fields: [num("area", "Wall area", 60, "m²"), num("coats", "Coats", 2), num("coverage", "Coverage", 10, "m²/litre")],
    compute: (v) => {
      const litres = n(v, "coverage") ? (n(v, "area") * n(v, "coats")) / n(v, "coverage") : 0;
      return [
        { label: "Paint needed", value: `${f(litres, 2)} litres`, primary: true },
        { label: "5 litre tins", value: String(Math.ceil(litres / 5)) },
        { label: "Area per coat", value: `${f(n(v, "area"), 2)} m²` },
      ];
    },
  },
  {
    slug: "concrete-calculator",
    category: "Construction & DIY",
    title: "Concrete Calculator",
    desc: "Concrete volume and bag count.",
    intro: "Work out the concrete volume for a slab and how many bags to buy.",
    keywords: ["concrete", "slab", "cubic metres", "cement bags"],
    fields: [num("length", "Length", 4, "m"), num("width", "Width", 3, "m"), num("depth", "Depth", 100, "mm")],
    compute: (v) => {
      const m3 = n(v, "length") * n(v, "width") * (n(v, "depth") / 1000);
      return [
        { label: "Concrete volume", value: `${f(m3, 3)} m³`, primary: true },
        { label: "With 10% waste", value: `${f(m3 * 1.1, 3)} m³` },
        { label: "50 kg cement bags (approx)", value: String(Math.ceil(m3 * 7)) },
      ];
    },
  },
  {
    slug: "tile-calculator",
    category: "Construction & DIY",
    title: "Tile Calculator",
    desc: "Tiles needed for a floor or wall.",
    intro: "Count how many tiles your surface needs, with a wastage allowance included.",
    keywords: ["tiles", "flooring", "wall tiles", "wastage"],
    fields: [num("area", "Area to tile", 20, "m²"), num("tileW", "Tile width", 300, "mm"), num("tileH", "Tile height", 300, "mm"), num("waste", "Wastage", 10, "%")],
    compute: (v) => {
      const tileArea = (n(v, "tileW") / 1000) * (n(v, "tileH") / 1000);
      const count = tileArea ? n(v, "area") / tileArea : 0;
      return [
        { label: "Tiles needed", value: String(Math.ceil(count * (1 + n(v, "waste") / 100))), primary: true },
        { label: "Without wastage", value: String(Math.ceil(count)) },
        { label: "Tile area", value: `${f(tileArea, 3)} m²` },
      ];
    },
  },
  {
    slug: "stud-spacing-calculator",
    category: "Construction & DIY",
    title: "Stud Spacing Calculator",
    desc: "Studs, joists and rafter spacing.",
    intro: "Space studs or joists evenly along a wall and get the exact count.",
    keywords: ["stud", "joist", "rafter", "spacing", "framing"],
    fields: [num("length", "Wall length", 6000, "mm"), num("spacing", "Spacing", 400, "mm")],
    compute: (v) => {
      const count = n(v, "spacing") ? Math.floor(n(v, "length") / n(v, "spacing")) + 1 : 0;
      const actual = count > 1 ? n(v, "length") / (count - 1) : 0;
      return [
        { label: "Studs required", value: String(count), primary: true },
        { label: "Actual even spacing", value: `${f(actual, 1)} mm` },
        { label: "Offcut at end", value: `${f(n(v, "length") % (n(v, "spacing") || 1), 1)} mm` },
      ];
    },
  },
];

/* ---------- Education & Study ---------- */

const education: ToolSpec[] = [
  {
    slug: "gpa-calculator",
    category: "Education & Study",
    title: "GPA Calculator",
    desc: "Weighted GPA across four courses.",
    intro: "Enter grade points and credit units for each course to get your weighted GPA.",
    keywords: ["gpa", "grade point average", "credits", "university"],
    fields: [
      num("g1", "Course 1 grade point", 4),
      num("c1", "Course 1 units", 3),
      num("g2", "Course 2 grade point", 3),
      num("c2", "Course 2 units", 3),
      num("g3", "Course 3 grade point", 5),
      num("c3", "Course 3 units", 2),
      num("g4", "Course 4 grade point", 4),
      num("c4", "Course 4 units", 2),
    ],
    compute: (v) => {
      let pts = 0;
      let units = 0;
      for (const i of [1, 2, 3, 4]) {
        const u = n(v, `c${i}`);
        pts += n(v, `g${i}`) * u;
        units += u;
      }
      return [
        { label: "GPA", value: units ? f(pts / units, 2) : "—", primary: true },
        { label: "Total grade points", value: f(pts, 2) },
        { label: "Total units", value: f(units, 1) },
      ];
    },
  },
  {
    slug: "weighted-grade-calculator",
    category: "Education & Study",
    title: "Weighted Grade Calculator",
    desc: "Combine coursework and exam weights.",
    intro: "Blend assignment, test and exam scores using their weightings to get your grade.",
    keywords: ["weighted grade", "coursework", "exam", "score"],
    fields: [
      num("s1", "Score 1", 75, "%"),
      num("w1", "Weight 1", 30, "%"),
      num("s2", "Score 2", 68, "%"),
      num("w2", "Weight 2", 20, "%"),
      num("s3", "Score 3", 82, "%"),
      num("w3", "Weight 3", 50, "%"),
    ],
    compute: (v) => {
      const wSum = n(v, "w1") + n(v, "w2") + n(v, "w3");
      const total = n(v, "s1") * n(v, "w1") + n(v, "s2") * n(v, "w2") + n(v, "s3") * n(v, "w3");
      const grade = wSum ? total / wSum : 0;
      return [
        { label: "Weighted grade", value: `${f(grade, 2)} %`, primary: true },
        { label: "Weights total", value: `${f(wSum, 1)} %` },
        { label: "Letter grade", value: grade >= 70 ? "A" : grade >= 60 ? "B" : grade >= 50 ? "C" : grade >= 45 ? "D" : "F" },
      ];
    },
  },
  {
    slug: "final-grade-calculator",
    category: "Education & Study",
    title: "Final Grade Calculator",
    desc: "The exam score you still need.",
    intro: "Find the exam mark you need to reach your target overall grade.",
    keywords: ["final grade", "exam needed", "target grade"],
    fields: [num("current", "Current grade", 68, "%"), num("target", "Target grade", 75, "%"), num("weight", "Final exam weight", 40, "%")],
    compute: (v) => {
      const w = n(v, "weight") / 100;
      const needed = w ? (n(v, "target") - n(v, "current") * (1 - w)) / w : 0;
      return [
        { label: "Score needed in final", value: `${f(needed, 2)} %`, primary: true },
        { label: "Achievable?", value: needed <= 100 ? "Yes" : "Not with this exam alone" },
        { label: "If you score 100%", value: `${f(n(v, "current") * (1 - w) + 100 * w, 2)} %` },
      ];
    },
  },
  {
    slug: "grade-percentage-calculator",
    category: "Education & Study",
    title: "Grade Percentage Calculator",
    desc: "Marks to percentage and letter grade.",
    intro: "Convert raw marks into a percentage and the matching letter grade.",
    keywords: ["marks", "percentage", "letter grade", "test score"],
    fields: [num("score", "Marks earned", 43), num("total", "Total marks", 60)],
    compute: (v) => {
      const pct = n(v, "total") ? (n(v, "score") / n(v, "total")) * 100 : 0;
      return [
        { label: "Percentage", value: `${f(pct, 2)} %`, primary: true },
        { label: "Letter grade", value: pct >= 70 ? "A" : pct >= 60 ? "B" : pct >= 50 ? "C" : pct >= 45 ? "D" : "F" },
        { label: "Marks lost", value: f(n(v, "total") - n(v, "score"), 1) },
      ];
    },
  },
  {
    slug: "study-time-planner",
    category: "Education & Study",
    title: "Study Time Planner",
    desc: "Split revision hours before an exam.",
    intro: "Plan how many hours a day to study across your subjects before exam day.",
    keywords: ["study plan", "revision", "hours", "exam prep"],
    fields: [num("days", "Days until exam", 21), num("subjects", "Subjects", 4), num("hours", "Study hours per day", 3)],
    compute: (v) => {
      const total = n(v, "days") * n(v, "hours");
      const subj = Math.max(1, Math.round(n(v, "subjects")));
      return [
        { label: "Total study hours", value: f(total, 1), primary: true },
        { label: "Hours per subject", value: f(total / subj, 1) },
        { label: "Minutes per subject per day", value: f((n(v, "hours") * 60) / subj, 0) },
      ];
    },
  },
];

/* ---------- Tax & VAT ---------- */

const tax: ToolSpec[] = [
  {
    slug: "add-vat-calculator",
    category: "Tax & VAT",
    title: "Add VAT Calculator",
    desc: "Add VAT to a net amount.",
    intro: "Add VAT at any rate to a net price to get the gross amount payable.",
    keywords: ["vat", "add vat", "gross", "net"],
    fields: [num("net", "Net amount", 100000), num("rate", "VAT rate", 7.5, "%")],
    compute: (v) => {
      const vat = (n(v, "net") * n(v, "rate")) / 100;
      return [
        { label: "Gross amount", value: f(n(v, "net") + vat), primary: true },
        { label: "VAT", value: f(vat) },
        { label: "Net amount", value: f(n(v, "net")) },
      ];
    },
  },
  {
    slug: "remove-vat-calculator",
    category: "Tax & VAT",
    title: "Remove VAT Calculator",
    desc: "Strip VAT out of a gross price.",
    intro: "Work backwards from a VAT-inclusive price to the net amount and VAT portion.",
    keywords: ["remove vat", "vat inclusive", "net price", "reverse vat"],
    fields: [num("gross", "Gross amount", 107500), num("rate", "VAT rate", 7.5, "%")],
    compute: (v) => {
      const net = n(v, "gross") / (1 + n(v, "rate") / 100);
      return [
        { label: "Net amount", value: f(net), primary: true },
        { label: "VAT included", value: f(n(v, "gross") - net) },
        { label: "VAT fraction", value: `${f(n(v, "rate") / (100 + n(v, "rate")), 4)} of gross` },
      ];
    },
  },
  {
    slug: "sales-tax-calculator",
    category: "Tax & VAT",
    title: "Sales Tax Calculator",
    desc: "Add state or local sales tax.",
    intro: "Add sales tax to a purchase price and see the tax charged at checkout.",
    keywords: ["sales tax", "state tax", "checkout", "purchase"],
    fields: [num("price", "Pre-tax price", 250), num("rate", "Sales tax rate", 8.25, "%"), num("qty", "Quantity", 1)],
    compute: (v) => {
      const sub = n(v, "price") * Math.max(1, n(v, "qty"));
      const t = (sub * n(v, "rate")) / 100;
      return [
        { label: "Total with tax", value: f(sub + t), primary: true },
        { label: "Sales tax", value: f(t) },
        { label: "Subtotal", value: f(sub) },
      ];
    },
  },
  {
    slug: "income-tax-estimator",
    category: "Tax & VAT",
    title: "Income Tax Estimator",
    desc: "Estimated tax and take-home pay.",
    intro: "Estimate income tax on your salary after allowances, and what you keep.",
    keywords: ["income tax", "take home", "paye", "allowance"],
    fields: [num("income", "Annual income", 6000000), num("allowance", "Tax-free allowance", 800000), num("rate", "Effective tax rate", 18, "%")],
    compute: (v) => {
      const taxable = Math.max(0, n(v, "income") - n(v, "allowance"));
      const t = (taxable * n(v, "rate")) / 100;
      return [
        { label: "Estimated tax", value: f(t), primary: true },
        { label: "Take-home pay", value: f(n(v, "income") - t) },
        { label: "Monthly take-home", value: f((n(v, "income") - t) / 12) },
      ];
    },
  },
  {
    slug: "net-to-gross-calculator",
    category: "Tax & VAT",
    title: "Net to Gross Calculator",
    desc: "Gross pay needed for a target net.",
    intro: "Find the gross amount required to leave a specific net figure after tax.",
    keywords: ["net to gross", "gross up", "target net", "tax"],
    fields: [num("net", "Desired net", 400000), num("rate", "Tax rate", 20, "%")],
    compute: (v) => {
      const factor = 1 - n(v, "rate") / 100;
      const gross = factor > 0 ? n(v, "net") / factor : 0;
      return [
        { label: "Required gross", value: f(gross), primary: true },
        { label: "Tax deducted", value: f(gross - n(v, "net")) },
      ];
    },
  },
];

/* ---------- Savings & Investment ---------- */

const savings: ToolSpec[] = [
  {
    slug: "compound-interest-calculator",
    category: "Savings & Investment",
    title: "Compound Interest Calculator",
    desc: "Growth with monthly contributions.",
    intro: "See how compound interest and regular contributions grow your savings.",
    keywords: ["compound interest", "savings growth", "contributions"],
    fields: [num("principal", "Starting amount", 500000), num("monthly", "Monthly contribution", 50000), num("rate", "Annual rate", 12, "%"), num("years", "Years", 10)],
    compute: (v) => {
      const r = n(v, "rate") / 100 / 12;
      const m = Math.round(n(v, "years") * 12);
      const fv = n(v, "principal") * Math.pow(1 + r, m) + (r ? n(v, "monthly") * ((Math.pow(1 + r, m) - 1) / r) : n(v, "monthly") * m);
      const contributed = n(v, "principal") + n(v, "monthly") * m;
      return [
        { label: "Future value", value: f(fv), primary: true },
        { label: "Total contributed", value: f(contributed) },
        { label: "Interest earned", value: f(fv - contributed) },
      ];
    },
  },
  {
    slug: "savings-goal-calculator",
    category: "Savings & Investment",
    title: "Savings Goal Calculator",
    desc: "Monthly amount to hit a target.",
    intro: "Work out how much to save each month to reach a savings goal on time.",
    keywords: ["savings goal", "target", "monthly saving", "plan"],
    fields: [num("goal", "Savings goal", 5000000), num("current", "Already saved", 500000), num("years", "Years to goal", 4), num("rate", "Annual return", 8, "%")],
    compute: (v) => {
      const r = n(v, "rate") / 100 / 12;
      const m = Math.max(1, Math.round(n(v, "years") * 12));
      const grown = n(v, "current") * Math.pow(1 + r, m);
      const need = Math.max(0, n(v, "goal") - grown);
      const monthly = r ? need / ((Math.pow(1 + r, m) - 1) / r) : need / m;
      return [
        { label: "Save per month", value: f(monthly), primary: true },
        { label: "Current savings grow to", value: f(grown) },
        { label: "Gap to close", value: f(need) },
      ];
    },
  },
  {
    slug: "rule-of-72-calculator",
    category: "Savings & Investment",
    title: "Rule of 72 Calculator",
    desc: "How long money takes to double.",
    intro: "Estimate how many years it takes an investment to double at a given return.",
    keywords: ["rule of 72", "double money", "growth", "years"],
    fields: [num("rate", "Annual return", 12, "%"), num("amount", "Amount invested", 1000000)],
    compute: (v) => {
      const r = n(v, "rate");
      const years = r ? 72 / r : 0;
      return [
        { label: "Years to double", value: f(years, 2), primary: true },
        { label: "Exact (compound)", value: r ? f(Math.log(2) / Math.log(1 + r / 100), 2) : "—" },
        { label: "Value after doubling", value: f(n(v, "amount") * 2) },
      ];
    },
  },
  {
    slug: "inflation-calculator",
    category: "Savings & Investment",
    title: "Inflation Calculator",
    desc: "Future buying power of your money.",
    intro: "See what today's money will be worth after years of inflation.",
    keywords: ["inflation", "buying power", "real value", "purchasing"],
    fields: [num("amount", "Amount today", 1000000), num("rate", "Inflation rate", 20, "%"), num("years", "Years", 5)],
    compute: (v) => {
      const factor = Math.pow(1 + n(v, "rate") / 100, n(v, "years"));
      return [
        { label: "Real value in today's money", value: f(n(v, "amount") / factor), primary: true },
        { label: "Equivalent future cost", value: f(n(v, "amount") * factor) },
        { label: "Value lost", value: f(n(v, "amount") - n(v, "amount") / factor) },
      ];
    },
  },
  {
    slug: "cagr-calculator",
    category: "Savings & Investment",
    title: "CAGR Calculator",
    desc: "Compound annual growth rate.",
    intro: "Measure the annualised growth rate of an investment between two values.",
    keywords: ["cagr", "annual growth", "investment return"],
    fields: [num("start", "Starting value", 1000000), num("end", "Ending value", 2200000), num("years", "Years", 5)],
    compute: (v) => {
      const yrs = n(v, "years") || 1;
      const cagr = n(v, "start") > 0 ? (Math.pow(n(v, "end") / n(v, "start"), 1 / yrs) - 1) * 100 : 0;
      return [
        { label: "CAGR", value: `${f(cagr, 2)} %`, primary: true },
        { label: "Total growth", value: n(v, "start") ? `${f((n(v, "end") / n(v, "start") - 1) * 100, 2)} %` : "—" },
        { label: "Gain", value: f(n(v, "end") - n(v, "start")) },
      ];
    },
  },
];

/* ---------- Retirement & Pension ---------- */

const retirement: ToolSpec[] = [
  {
    slug: "retirement-savings-calculator",
    category: "Retirement & Pension",
    title: "Retirement Savings Calculator",
    desc: "Project your pot at retirement.",
    intro: "Project how big your retirement pot will be based on today's savings rate.",
    keywords: ["retirement", "pot", "projection", "savings"],
    fields: [num("age", "Current age", 32), num("retire", "Retirement age", 60), num("current", "Current savings", 2000000), num("monthly", "Monthly saving", 60000), num("rate", "Annual return", 10, "%")],
    compute: (v) => {
      const m = Math.max(0, Math.round((n(v, "retire") - n(v, "age")) * 12));
      const r = n(v, "rate") / 100 / 12;
      const fv = n(v, "current") * Math.pow(1 + r, m) + (r ? n(v, "monthly") * ((Math.pow(1 + r, m) - 1) / r) : n(v, "monthly") * m);
      return [
        { label: "Projected pot", value: f(fv), primary: true },
        { label: "Years to retirement", value: f(m / 12, 1) },
        { label: "Total contributed", value: f(n(v, "current") + n(v, "monthly") * m) },
      ];
    },
  },
  {
    slug: "pension-contribution-calculator",
    category: "Retirement & Pension",
    title: "Pension Contribution Calculator",
    desc: "Employee and employer contributions.",
    intro: "Work out monthly and annual pension contributions from you and your employer.",
    keywords: ["pension", "contribution", "employer", "employee"],
    fields: [num("salary", "Annual salary", 7200000), num("employee", "Your contribution", 8, "%"), num("employer", "Employer contribution", 10, "%")],
    compute: (v) => {
      const e = (n(v, "salary") * n(v, "employee")) / 100;
      const er = (n(v, "salary") * n(v, "employer")) / 100;
      return [
        { label: "Total annual contribution", value: f(e + er), primary: true },
        { label: "Your share (monthly)", value: f(e / 12) },
        { label: "Employer share (monthly)", value: f(er / 12) },
      ];
    },
  },
  {
    slug: "retirement-drawdown-calculator",
    category: "Retirement & Pension",
    title: "Retirement Drawdown Calculator",
    desc: "How long your savings will last.",
    intro: "See how many years your retirement pot lasts at a chosen withdrawal rate.",
    keywords: ["drawdown", "withdrawal", "pot lasts", "retirement income"],
    fields: [num("pot", "Retirement pot", 50000000), num("withdraw", "Monthly withdrawal", 400000), num("rate", "Annual return", 6, "%")],
    compute: (v) => {
      const r = n(v, "rate") / 100 / 12;
      let bal = n(v, "pot");
      let months = 0;
      while (bal > 0 && months < 1200) {
        bal = bal * (1 + r) - n(v, "withdraw");
        months += 1;
      }
      return [
        { label: "Pot lasts", value: months >= 1200 ? "100+ years" : `${f(months / 12, 1)} years`, primary: true },
        { label: "Months of income", value: months >= 1200 ? "1200+" : String(months) },
        { label: "Annual withdrawal", value: f(n(v, "withdraw") * 12) },
      ];
    },
  },
  {
    slug: "retirement-income-target",
    category: "Retirement & Pension",
    title: "Retirement Income Target",
    desc: "Pot needed for your target income.",
    intro: "Find the pot size needed to support your desired retirement income.",
    keywords: ["retirement income", "4 percent rule", "pot needed"],
    fields: [num("income", "Desired annual income", 6000000), num("rate", "Safe withdrawal rate", 4, "%"), num("pension", "Other pension income", 1200000)],
    compute: (v) => {
      const gap = Math.max(0, n(v, "income") - n(v, "pension"));
      const pot = n(v, "rate") ? (gap * 100) / n(v, "rate") : 0;
      return [
        { label: "Pot needed", value: f(pot), primary: true },
        { label: "Income gap to fund", value: f(gap) },
        { label: "Monthly income target", value: f(n(v, "income") / 12) },
      ];
    },
  },
  {
    slug: "retirement-countdown",
    category: "Retirement & Pension",
    title: "Retirement Countdown",
    desc: "Time left until you retire.",
    intro: "Count the years, months and paydays left until your retirement date.",
    keywords: ["retirement age", "countdown", "years left", "paydays"],
    fields: [num("age", "Current age", 41), num("retire", "Planned retirement age", 60)],
    compute: (v) => {
      const years = Math.max(0, n(v, "retire") - n(v, "age"));
      return [
        { label: "Years to go", value: f(years, 1), primary: true },
        { label: "Months to go", value: f(years * 12, 0) },
        { label: "Paydays remaining", value: f(years * 12, 0) },
      ];
    },
  },
];

/* ---------- Auto & Fuel ---------- */

const auto: ToolSpec[] = [
  {
    slug: "fuel-economy-calculator",
    category: "Auto & Fuel",
    title: "Fuel Economy Calculator",
    desc: "L/100km, km/L and MPG from a tank.",
    intro: "Measure real-world fuel economy from the distance covered on a tank.",
    keywords: ["fuel economy", "mpg", "l/100km", "consumption"],
    fields: [num("distance", "Distance covered", 480, "km"), num("fuel", "Fuel used", 42, "litres")],
    compute: (v) => {
      const d = n(v, "distance");
      const l = n(v, "fuel");
      return [
        { label: "Consumption", value: d ? `${f((l / d) * 100, 2)} L/100km` : "—", primary: true },
        { label: "Km per litre", value: l ? f(d / l, 2) : "—" },
        { label: "MPG (US)", value: l ? f((d / 1.609344) / (l / 3.785412), 2) : "—" },
      ];
    },
  },
  conv(
    "mpg-converter",
    "Auto & Fuel",
    "Fuel Unit Converter",
    "Convert between fuel volume units.",
    "Convert fuel quantities between litres, US gallons and imperial gallons.",
    ["gallon", "litre", "fuel", "imperial"],
    { litres: 1, "US gallons": 3.785412, "imperial gallons": 4.54609 },
    "litres",
    "US gallons",
  ),
  {
    slug: "cost-per-km-calculator",
    category: "Auto & Fuel",
    title: "Cost Per Kilometre Calculator",
    desc: "Running cost per km and per month.",
    intro: "Work out what each kilometre costs you in fuel, and the monthly total.",
    keywords: ["cost per km", "running cost", "commute", "fuel price"],
    fields: [num("consumption", "Consumption", 9, "L/100km"), num("price", "Fuel price", 900, "per litre"), num("monthly", "Monthly distance", 1200, "km")],
    compute: (v) => {
      const perKm = (n(v, "consumption") / 100) * n(v, "price");
      return [
        { label: "Cost per km", value: f(perKm, 2), primary: true },
        { label: "Monthly fuel cost", value: f(perKm * n(v, "monthly")) },
        { label: "Yearly fuel cost", value: f(perKm * n(v, "monthly") * 12) },
      ];
    },
  },
  {
    slug: "car-loan-calculator",
    category: "Auto & Fuel",
    title: "Car Loan Calculator",
    desc: "Monthly payment on a vehicle loan.",
    intro: "Calculate monthly repayments on a car loan after your deposit.",
    keywords: ["car loan", "auto finance", "monthly payment", "vehicle"],
    fields: [num("price", "Vehicle price", 12000000), num("deposit", "Deposit", 2000000), num("rate", "Annual rate", 18, "%"), num("years", "Term", 4, "years")],
    compute: (v) => {
      const P = Math.max(0, n(v, "price") - n(v, "deposit"));
      const months = Math.max(1, Math.round(n(v, "years") * 12));
      const pay = pmt(P, n(v, "rate") / 100 / 12, months);
      return [
        { label: "Monthly payment", value: f(pay), primary: true },
        { label: "Total repaid", value: f(pay * months) },
        { label: "Total interest", value: f(pay * months - P) },
      ];
    },
  },
  {
    slug: "car-running-cost-calculator",
    category: "Auto & Fuel",
    title: "Car Running Cost Calculator",
    desc: "Fuel, service, insurance per year.",
    intro: "Add up fuel, servicing and insurance to see the true annual cost of your car.",
    keywords: ["running cost", "car ownership", "insurance", "servicing"],
    fields: [num("fuel", "Monthly fuel", 90000), num("service", "Annual servicing", 250000), num("insurance", "Annual insurance", 180000), num("other", "Other annual costs", 100000)],
    compute: (v) => {
      const yearly = n(v, "fuel") * 12 + n(v, "service") + n(v, "insurance") + n(v, "other");
      return [
        { label: "Annual running cost", value: f(yearly), primary: true },
        { label: "Monthly average", value: f(yearly / 12) },
        { label: "Fuel share", value: yearly ? `${f(((n(v, "fuel") * 12) / yearly) * 100, 1)} %` : "—" },
      ];
    },
  },
];

/* ---------- Home & Mortgage ---------- */

const home: ToolSpec[] = [
  {
    slug: "mortgage-payment-calculator",
    category: "Home & Mortgage",
    title: "Mortgage Payment Calculator",
    desc: "Monthly repayment and total interest.",
    intro: "Work out the monthly repayment on a mortgage and what it costs overall.",
    keywords: ["mortgage", "repayment", "home loan", "interest"],
    fields: [num("price", "Property price", 45000000), num("deposit", "Deposit", 9000000), num("rate", "Annual rate", 16, "%"), num("years", "Term", 20, "years")],
    compute: (v) => {
      const P = Math.max(0, n(v, "price") - n(v, "deposit"));
      const months = Math.max(1, Math.round(n(v, "years") * 12));
      const pay = pmt(P, n(v, "rate") / 100 / 12, months);
      return [
        { label: "Monthly payment", value: f(pay), primary: true },
        { label: "Total interest", value: f(pay * months - P) },
        { label: "Amount borrowed", value: f(P) },
      ];
    },
  },
  {
    slug: "home-affordability-calculator",
    category: "Home & Mortgage",
    title: "Home Affordability Calculator",
    desc: "How much house you can afford.",
    intro: "Estimate the property price you can afford based on income and deposit.",
    keywords: ["affordability", "how much house", "income", "budget"],
    fields: [num("income", "Annual income", 12000000), num("debts", "Monthly debts", 80000), num("deposit", "Deposit", 6000000), num("rate", "Annual rate", 16, "%"), num("years", "Term", 20, "years")],
    compute: (v) => {
      const budget = Math.max(0, (n(v, "income") / 12) * 0.33 - n(v, "debts"));
      const months = Math.max(1, Math.round(n(v, "years") * 12));
      const r = n(v, "rate") / 100 / 12;
      const loan = r ? (budget * (1 - Math.pow(1 + r, -months))) / r : budget * months;
      return [
        { label: "Affordable property price", value: f(loan + n(v, "deposit")), primary: true },
        { label: "Maximum loan", value: f(loan) },
        { label: "Monthly payment budget", value: f(budget) },
      ];
    },
  },
  {
    slug: "down-payment-calculator",
    category: "Home & Mortgage",
    title: "Down Payment Calculator",
    desc: "Deposit amount and savings timeline.",
    intro: "See what deposit a property needs and how long it takes to save it.",
    keywords: ["down payment", "deposit", "saving", "home buying"],
    fields: [num("price", "Property price", 45000000), num("pct", "Deposit percentage", 20, "%"), num("monthly", "Monthly saving", 300000)],
    compute: (v) => {
      const dep = (n(v, "price") * n(v, "pct")) / 100;
      return [
        { label: "Deposit required", value: f(dep), primary: true },
        { label: "Months to save", value: n(v, "monthly") ? f(dep / n(v, "monthly"), 0) : "—" },
        { label: "Amount to borrow", value: f(n(v, "price") - dep) },
      ];
    },
  },
  {
    slug: "loan-to-value-calculator",
    category: "Home & Mortgage",
    title: "Loan to Value Calculator",
    desc: "LTV ratio and equity share.",
    intro: "Calculate your loan-to-value ratio and the equity you hold in the property.",
    keywords: ["ltv", "loan to value", "equity", "mortgage"],
    fields: [num("value", "Property value", 45000000), num("loan", "Outstanding loan", 30000000)],
    compute: (v) => {
      const ltv = n(v, "value") ? (n(v, "loan") / n(v, "value")) * 100 : 0;
      return [
        { label: "Loan to value", value: `${f(ltv, 2)} %`, primary: true },
        { label: "Equity", value: f(n(v, "value") - n(v, "loan")) },
        { label: "Equity share", value: `${f(100 - ltv, 2)} %` },
      ];
    },
  },
  {
    slug: "mortgage-overpayment-calculator",
    category: "Home & Mortgage",
    title: "Mortgage Overpayment Calculator",
    desc: "Time and interest saved by overpaying.",
    intro: "See how much sooner you clear the mortgage when you overpay each month.",
    keywords: ["overpayment", "pay off early", "interest saved", "mortgage"],
    fields: [num("balance", "Outstanding balance", 30000000), num("rate", "Annual rate", 16, "%"), num("years", "Years remaining", 18), num("extra", "Monthly overpayment", 50000)],
    compute: (v) => {
      const months = Math.max(1, Math.round(n(v, "years") * 12));
      const r = n(v, "rate") / 100 / 12;
      const base = pmt(n(v, "balance"), r, months);
      let bal = n(v, "balance");
      let m = 0;
      while (bal > 0 && m < 1200) {
        bal = bal * (1 + r) - (base + n(v, "extra"));
        m += 1;
      }
      const interestSaved = base * months - (base + n(v, "extra")) * m;
      return [
        { label: "New term", value: `${f(m / 12, 1)} years`, primary: true },
        { label: "Time saved", value: `${f((months - m) / 12, 1)} years` },
        { label: "Interest saved", value: f(Math.max(0, interestSaved)) },
      ];
    },
  },
];

/* ---------- Salary & Paycheck ---------- */

const salary: ToolSpec[] = [
  {
    slug: "hourly-to-annual-salary",
    category: "Salary & Paycheck",
    title: "Hourly to Annual Salary",
    desc: "Turn an hourly rate into yearly pay.",
    intro: "Convert an hourly rate into weekly, monthly and annual earnings.",
    keywords: ["hourly rate", "annual salary", "yearly pay", "wage"],
    fields: [num("rate", "Hourly rate", 5000), num("hours", "Hours per week", 40), num("weeks", "Weeks per year", 52)],
    compute: (v) => {
      const annual = n(v, "rate") * n(v, "hours") * n(v, "weeks");
      return [
        { label: "Annual salary", value: f(annual), primary: true },
        { label: "Monthly", value: f(annual / 12) },
        { label: "Weekly", value: f(n(v, "rate") * n(v, "hours")) },
      ];
    },
  },
  {
    slug: "annual-to-hourly-rate",
    category: "Salary & Paycheck",
    title: "Annual to Hourly Rate",
    desc: "What your salary works out to per hour.",
    intro: "Break an annual salary down into a real hourly, daily and monthly rate.",
    keywords: ["salary to hourly", "hourly equivalent", "pay rate"],
    fields: [num("salary", "Annual salary", 9600000), num("hours", "Hours per week", 40), num("weeks", "Working weeks", 48)],
    compute: (v) => {
      const hours = n(v, "hours") * n(v, "weeks");
      return [
        { label: "Hourly rate", value: hours ? f(n(v, "salary") / hours) : "—", primary: true },
        { label: "Daily rate (8h)", value: hours ? f((n(v, "salary") / hours) * 8) : "—" },
        { label: "Monthly", value: f(n(v, "salary") / 12) },
      ];
    },
  },
  {
    slug: "overtime-pay-calculator",
    category: "Salary & Paycheck",
    title: "Overtime Pay Calculator",
    desc: "Base, overtime and total pay.",
    intro: "Add overtime at any multiplier on top of your base weekly pay.",
    keywords: ["overtime", "time and a half", "extra hours", "pay"],
    fields: [num("rate", "Hourly rate", 5000), num("base", "Standard hours", 40), num("ot", "Overtime hours", 8), num("mult", "Overtime multiplier", 1.5, "×")],
    compute: (v) => {
      const basePay = n(v, "rate") * n(v, "base");
      const otPay = n(v, "rate") * n(v, "ot") * n(v, "mult");
      return [
        { label: "Total weekly pay", value: f(basePay + otPay), primary: true },
        { label: "Overtime pay", value: f(otPay) },
        { label: "Base pay", value: f(basePay) },
      ];
    },
  },
  {
    slug: "take-home-pay-calculator",
    category: "Salary & Paycheck",
    title: "Take-Home Pay Calculator",
    desc: "Net pay after tax and pension.",
    intro: "Estimate your net monthly pay after tax, pension and other deductions.",
    keywords: ["take home", "net pay", "deductions", "paycheck"],
    fields: [num("gross", "Monthly gross", 800000), num("tax", "Tax rate", 18, "%"), num("pension", "Pension", 8, "%"), num("other", "Other deductions", 15000)],
    compute: (v) => {
      const g = n(v, "gross");
      const deductions = (g * (n(v, "tax") + n(v, "pension"))) / 100 + n(v, "other");
      return [
        { label: "Net monthly pay", value: f(g - deductions), primary: true },
        { label: "Total deductions", value: f(deductions) },
        { label: "Annual net pay", value: f((g - deductions) * 12) },
      ];
    },
  },
  {
    slug: "salary-raise-calculator",
    category: "Salary & Paycheck",
    title: "Salary Raise Calculator",
    desc: "New pay after a percentage raise.",
    intro: "See your new salary after a raise, and the extra you take home each month.",
    keywords: ["raise", "pay rise", "increment", "new salary"],
    fields: [num("salary", "Current annual salary", 9600000), num("raise", "Raise", 12, "%")],
    compute: (v) => {
      const inc = (n(v, "salary") * n(v, "raise")) / 100;
      return [
        { label: "New annual salary", value: f(n(v, "salary") + inc), primary: true },
        { label: "Extra per year", value: f(inc) },
        { label: "Extra per month", value: f(inc / 12) },
      ];
    },
  },
];

/* ---------- Data & Digital Storage ---------- */

const data: ToolSpec[] = [
  conv(
    "data-size-converter",
    "Data & Digital Storage",
    "Data Size Converter",
    "Bytes, KB, MB, GB and TB.",
    "Convert file and storage sizes between bytes, kilobytes, megabytes and beyond.",
    ["data", "megabyte", "gigabyte", "file size", "storage"],
    { B: 1, KB: 1024, MB: 1048576, GB: 1073741824, TB: 1099511627776 },
    "GB",
    "MB",
  ),
  conv(
    "transfer-speed-converter",
    "Data & Digital Storage",
    "Transfer Speed Converter",
    "Mbps, MB/s and Gbps.",
    "Convert internet and transfer speeds between bit and byte based units.",
    ["mbps", "mb/s", "bandwidth", "internet speed"],
    { Mbps: 1, Kbps: 0.001, Gbps: 1000, "MB/s": 8, "KB/s": 0.008 },
    "Mbps",
    "MB/s",
  ),
  {
    slug: "download-time-calculator",
    category: "Data & Digital Storage",
    title: "Download Time Calculator",
    desc: "How long a file takes to download.",
    intro: "Estimate download time for any file size at your connection speed.",
    keywords: ["download time", "speed", "file size", "internet"],
    fields: [num("size", "File size", 4.7, "GB"), num("speed", "Connection speed", 50, "Mbps")],
    compute: (v) => {
      const bits = n(v, "size") * 8 * 1024;
      const secs = n(v, "speed") ? bits / n(v, "speed") : 0;
      return [
        { label: "Download time", value: `${Math.floor(secs / 60)}m ${Math.round(secs % 60)}s`, primary: true },
        { label: "In seconds", value: f(secs, 0) },
        { label: "Effective MB/s", value: f(n(v, "speed") / 8, 2) },
      ];
    },
  },
  {
    slug: "data-usage-calculator",
    category: "Data & Digital Storage",
    title: "Monthly Data Usage Calculator",
    desc: "Estimate your monthly data plan needs.",
    intro: "Add up streaming, browsing and calls to size the right monthly data plan.",
    keywords: ["data usage", "data plan", "streaming", "gb per month"],
    fields: [num("stream", "Video streaming", 10, "hours/month"), num("music", "Music streaming", 20, "hours/month"), num("browse", "Browsing", 30, "hours/month")],
    compute: (v) => {
      const gb = n(v, "stream") * 3 + n(v, "music") * 0.07 + n(v, "browse") * 0.15;
      return [
        { label: "Estimated monthly usage", value: `${f(gb, 2)} GB`, primary: true },
        { label: "Daily average", value: `${f(gb / 30, 2)} GB` },
        { label: "Recommended plan", value: `${Math.ceil((gb * 1.2) / 5) * 5} GB` },
      ];
    },
  },
  {
    slug: "video-storage-calculator",
    category: "Data & Digital Storage",
    title: "Video Storage Calculator",
    desc: "Storage needed for recorded video.",
    intro: "Work out how much disk space your video recordings will use.",
    keywords: ["video storage", "bitrate", "recording", "disk space"],
    fields: [num("minutes", "Recording length", 60, "minutes"), num("bitrate", "Bitrate", 8, "Mbps"), num("cameras", "Streams", 1)],
    compute: (v) => {
      const gb = (n(v, "minutes") * 60 * n(v, "bitrate") * Math.max(1, n(v, "cameras"))) / 8 / 1024;
      return [
        { label: "Storage needed", value: `${f(gb, 2)} GB`, primary: true },
        { label: "Per hour", value: `${f((n(v, "bitrate") * 3600) / 8 / 1024, 2)} GB` },
        { label: "Fits on 1 TB", value: gb ? `${f(1024 / gb, 1)} recordings` : "—" },
      ];
    },
  },
];

/* ---------- Sports & Fitness Tracking ---------- */

const sports: ToolSpec[] = [
  {
    slug: "running-pace-calculator",
    category: "Sports & Fitness Tracking",
    title: "Running Pace Calculator",
    desc: "Pace per km and per mile.",
    intro: "Convert a run distance and time into pace per kilometre and per mile.",
    keywords: ["pace", "running", "min/km", "split"],
    fields: [num("distance", "Distance", 10, "km"), num("minutes", "Time", 55, "minutes")],
    compute: (v) => {
      const perKm = n(v, "distance") ? n(v, "minutes") / n(v, "distance") : 0;
      const mm = Math.floor(perKm);
      return [
        { label: "Pace per km", value: `${mm}:${String(Math.round((perKm - mm) * 60)).padStart(2, "0")} min/km`, primary: true },
        { label: "Pace per mile", value: `${f(perKm * 1.609344, 2)} min/mile` },
        { label: "Average speed", value: `${f(perKm ? 60 / perKm : 0, 2)} km/h` },
      ];
    },
  },
  {
    slug: "calories-burned-calculator",
    category: "Sports & Fitness Tracking",
    title: "Calories Burned Calculator",
    desc: "Energy burned by activity and time.",
    intro: "Estimate the calories an activity burns using MET values and your weight.",
    keywords: ["calories burned", "met", "exercise", "workout"],
    fields: [
      num("weight", "Weight", 70, "kg"),
      num("minutes", "Duration", 45, "minutes"),
      sel("activity", "Activity", ["Walking", "Jogging", "Running", "Cycling", "Swimming", "Football", "Gym weights"]),
    ],
    compute: (v) => {
      const met: Record<string, number> = {
        Walking: 3.5,
        Jogging: 7,
        Running: 9.8,
        Cycling: 7.5,
        Swimming: 8,
        Football: 7,
        "Gym weights": 5,
      };
      const m = met[s(v, "activity")] ?? 5;
      const kcal = (m * 3.5 * n(v, "weight") * n(v, "minutes")) / 200;
      return [
        { label: "Calories burned", value: `${f(kcal, 0)} kcal`, primary: true },
        { label: "Per minute", value: f(n(v, "minutes") ? kcal / n(v, "minutes") : 0, 2) },
        { label: "MET value", value: f(m, 1) },
      ];
    },
  },
  {
    slug: "steps-to-distance",
    category: "Sports & Fitness Tracking",
    title: "Steps to Distance Converter",
    desc: "Steps into km, miles and calories.",
    intro: "Turn your daily step count into distance walked and calories burned.",
    keywords: ["steps", "distance", "pedometer", "walking"],
    fields: [num("steps", "Steps", 10000), num("height", "Height", 170, "cm"), num("weight", "Weight", 70, "kg")],
    compute: (v) => {
      const stride = (n(v, "height") * 0.415) / 100;
      const km = (n(v, "steps") * stride) / 1000;
      return [
        { label: "Distance", value: `${f(km, 2)} km`, primary: true },
        { label: "In miles", value: f(km / 1.609344, 2) },
        { label: "Calories burned", value: `${f(km * n(v, "weight") * 0.53, 0)} kcal` },
      ];
    },
  },
  {
    slug: "heart-rate-zones",
    category: "Sports & Fitness Tracking",
    title: "Heart Rate Zone Calculator",
    desc: "Training zones from your max HR.",
    intro: "Find your maximum heart rate and the training zones for fat burn and cardio.",
    keywords: ["heart rate", "zones", "max hr", "cardio", "training"],
    fields: [num("age", "Age", 30), num("resting", "Resting heart rate", 65, "bpm")],
    compute: (v) => {
      const max = 220 - n(v, "age");
      const reserve = max - n(v, "resting");
      const z = (p: number) => Math.round(n(v, "resting") + reserve * p);
      return [
        { label: "Max heart rate", value: `${f(max, 0)} bpm`, primary: true },
        { label: "Fat burn zone (60–70%)", value: `${z(0.6)} – ${z(0.7)} bpm` },
        { label: "Cardio zone (70–85%)", value: `${z(0.7)} – ${z(0.85)} bpm` },
      ];
    },
  },
  {
    slug: "race-time-predictor",
    category: "Sports & Fitness Tracking",
    title: "Race Time Predictor",
    desc: "Predict a race time from a known run.",
    intro: "Use a recent race result to predict your finish time over another distance.",
    keywords: ["race predictor", "marathon", "riegel", "finish time"],
    fields: [num("distance", "Known distance", 10, "km"), num("minutes", "Known time", 55, "minutes"), num("target", "Target distance", 21.1, "km")],
    compute: (v) => {
      const t = n(v, "distance") ? n(v, "minutes") * Math.pow(n(v, "target") / n(v, "distance"), 1.06) : 0;
      const h = Math.floor(t / 60);
      return [
        { label: "Predicted time", value: `${h}h ${Math.round(t % 60)}m`, primary: true },
        { label: "In minutes", value: f(t, 1) },
        { label: "Target pace", value: n(v, "target") ? `${f(t / n(v, "target"), 2)} min/km` : "—" },
      ];
    },
  },
];

/* ---------- Shopping & Discounts ---------- */

const shopping: ToolSpec[] = [
  {
    slug: "discount-calculator",
    category: "Shopping & Discounts",
    title: "Discount Calculator",
    desc: "Sale price and money saved.",
    intro: "Apply a discount to any price and see exactly what you save.",
    keywords: ["discount", "sale price", "percent off", "savings"],
    fields: [num("price", "Original price", 25000), num("discount", "Discount", 30, "%")],
    compute: (v) => {
      const save = (n(v, "price") * n(v, "discount")) / 100;
      return [
        { label: "You pay", value: f(n(v, "price") - save), primary: true },
        { label: "You save", value: f(save) },
        { label: "Discounted by", value: `${f(n(v, "discount"), 1)} %` },
      ];
    },
  },
  {
    slug: "double-discount-calculator",
    category: "Shopping & Discounts",
    title: "Double Discount Calculator",
    desc: "Stacked discounts, applied in order.",
    intro: "Stack two discounts and see the real combined saving — it is not simply added.",
    keywords: ["stacked discount", "extra off", "coupon", "double discount"],
    fields: [num("price", "Original price", 25000), num("d1", "First discount", 30, "%"), num("d2", "Extra discount", 10, "%")],
    compute: (v) => {
      const after1 = n(v, "price") * (1 - n(v, "d1") / 100);
      const final = after1 * (1 - n(v, "d2") / 100);
      return [
        { label: "Final price", value: f(final), primary: true },
        { label: "Total saved", value: f(n(v, "price") - final) },
        { label: "Effective discount", value: n(v, "price") ? `${f((1 - final / n(v, "price")) * 100, 2)} %` : "—" },
      ];
    },
  },
  {
    slug: "price-per-unit-calculator",
    category: "Shopping & Discounts",
    title: "Price Per Unit Calculator",
    desc: "Compare two pack sizes for value.",
    intro: "Compare two pack sizes and see which is genuinely better value per unit.",
    keywords: ["unit price", "value for money", "pack size", "compare"],
    fields: [num("priceA", "Product A price", 3500), num("sizeA", "Product A size", 900, "g"), num("priceB", "Product B price", 1900), num("sizeB", "Product B size", 450, "g")],
    compute: (v) => {
      const a = n(v, "sizeA") ? n(v, "priceA") / n(v, "sizeA") : 0;
      const b = n(v, "sizeB") ? n(v, "priceB") / n(v, "sizeB") : 0;
      return [
        { label: "Better value", value: a === b ? "Equal value" : a < b ? "Product A" : "Product B", primary: true },
        { label: "Product A per unit", value: f(a, 4) },
        { label: "Product B per unit", value: f(b, 4) },
      ];
    },
  },
  {
    slug: "price-after-tax-calculator",
    category: "Shopping & Discounts",
    title: "Price After Tax Calculator",
    desc: "Discount then tax, in the right order.",
    intro: "Apply a discount and then tax to see the true amount you pay at the till.",
    keywords: ["price after tax", "discount and tax", "checkout total"],
    fields: [num("price", "Price", 25000), num("discount", "Discount", 15, "%"), num("tax", "Tax rate", 7.5, "%")],
    compute: (v) => {
      const discounted = n(v, "price") * (1 - n(v, "discount") / 100);
      const t = (discounted * n(v, "tax")) / 100;
      return [
        { label: "Total to pay", value: f(discounted + t), primary: true },
        { label: "After discount", value: f(discounted) },
        { label: "Tax added", value: f(t) },
      ];
    },
  },
  {
    slug: "installment-plan-calculator",
    category: "Shopping & Discounts",
    title: "Installment Plan Calculator",
    desc: "Monthly instalments and true cost.",
    intro: "Break a purchase into instalments and compare the total to paying upfront.",
    keywords: ["installment", "buy now pay later", "monthly plan", "financing"],
    fields: [num("price", "Item price", 250000), num("deposit", "Deposit", 50000), num("months", "Instalments", 6), num("fee", "Interest / fee", 5, "%")],
    compute: (v) => {
      const financed = Math.max(0, n(v, "price") - n(v, "deposit"));
      const total = financed * (1 + n(v, "fee") / 100);
      const months = Math.max(1, Math.round(n(v, "months")));
      return [
        { label: "Monthly instalment", value: f(total / months), primary: true },
        { label: "Total cost", value: f(total + n(v, "deposit")) },
        { label: "Extra vs paying upfront", value: f(total + n(v, "deposit") - n(v, "price")) },
      ];
    },
  },
];

export const TOOL_SPECS: ToolSpec[] = [
  ...math,
  ...health,
  ...money,
  ...unitConv,
  ...percentage,
  ...dateTime,
  ...science,
  ...business,
  ...travel,
  ...cooking,
  ...construction,
  ...education,
  ...tax,
  ...savings,
  ...retirement,
  ...auto,
  ...home,
  ...salary,
  ...data,
  ...sports,
  ...shopping,
];

export const getSpec = (slug: string) => TOOL_SPECS.find((t) => t.slug === slug);

/** Resolve a field's initial value (handles date defaults like "today", "+30", "-10000"). */
export const initialValue = (field: Field) => {
  if (field.type !== "date") return field.def;
  const offset = field.def === "today" ? 0 : parseFloat(field.def) || 0;
  const d = new Date(Date.now() + offset * DAY);
  return d.toISOString().slice(0, 10);
};
