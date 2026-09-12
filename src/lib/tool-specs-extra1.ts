import type { ToolSpec } from "./tool-specs";
import { n, s, f, num, sel, dat, parseDate, DAY } from "./tool-spec-kit";

const list = (v: Record<string, string>) =>
  ["a", "b", "c", "d", "e"].map((k) => parseFloat(v[k] ?? "")).filter((x) => Number.isFinite(x));

const fiveNumbers = [num("a", "Number 1", 4), num("b", "Number 2", 8), num("c", "Number 3", 15), num("d", "Number 4", 16), num("e", "Number 5", 23)];

const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));

/* ---------- Math & Everyday ---------- */
const math: ToolSpec[] = [
  {
    slug: "median-calculator",
    category: "Math & Everyday",
    title: "Median Calculator",
    desc: "Find the middle value of a set of numbers.",
    intro: "Enter up to five numbers and get the median, plus the sorted order and range.",
    keywords: ["median", "middle value", "statistics", "sorted"],
    fields: fiveNumbers,
    compute: (v) => {
      const xs = list(v).sort((x, y) => x - y);
      const mid = Math.floor(xs.length / 2);
      const median = xs.length === 0 ? 0 : xs.length % 2 ? xs[mid] : (xs[mid - 1] + xs[mid]) / 2;
      return [
        { label: "Median", value: f(median, 4), primary: true },
        { label: "Sorted", value: xs.join(", ") || "—" },
        { label: "Range", value: xs.length ? f(xs[xs.length - 1] - xs[0], 4) : "—" },
      ];
    },
  },
  {
    slug: "sum-calculator",
    category: "Math & Everyday",
    title: "Sum Calculator",
    desc: "Add a list of numbers together.",
    intro: "Add up to five numbers and see the total, count and running average.",
    keywords: ["sum", "add", "total", "addition"],
    fields: fiveNumbers,
    compute: (v) => {
      const xs = list(v);
      const total = xs.reduce((a, b) => a + b, 0);
      return [
        { label: "Total", value: f(total, 4), primary: true },
        { label: "Count", value: String(xs.length) },
        { label: "Average", value: xs.length ? f(total / xs.length, 4) : "—" },
      ];
    },
  },
  {
    slug: "lcm-hcf-calculator",
    category: "Math & Everyday",
    title: "LCM and HCF Calculator",
    desc: "Lowest common multiple and highest common factor.",
    intro: "Give two whole numbers and get their HCF (greatest common divisor) and LCM.",
    keywords: ["lcm", "hcf", "gcd", "common factor", "common multiple"],
    fields: [num("a", "First number", 12), num("b", "Second number", 18)],
    compute: (v) => {
      const a = Math.round(Math.abs(n(v, "a")));
      const b = Math.round(Math.abs(n(v, "b")));
      const g = gcd(a, b) || 1;
      return [
        { label: "HCF (GCD)", value: f(g, 0), primary: true },
        { label: "LCM", value: f((a * b) / g, 0) },
      ];
    },
  },
  {
    slug: "prime-number-checker",
    category: "Math & Everyday",
    title: "Prime Number Checker",
    desc: "Check whether a number is prime.",
    intro: "Test any whole number for primality and see its smallest divisor when it is not prime.",
    keywords: ["prime", "divisor", "factor", "number theory"],
    fields: [num("x", "Number", 97)],
    compute: (v) => {
      const x = Math.round(Math.abs(n(v, "x")));
      let divisor = 0;
      if (x < 2) divisor = -1;
      else for (let i = 2; i * i <= x; i++) if (x % i === 0) { divisor = i; break; }
      return [
        { label: "Result", value: x >= 2 && divisor === 0 ? "Prime" : "Not prime", primary: true },
        { label: "Smallest divisor", value: divisor > 0 ? String(divisor) : "—" },
      ];
    },
  },
  {
    slug: "factorial-calculator",
    category: "Math & Everyday",
    title: "Factorial Calculator",
    desc: "Work out n! for small whole numbers.",
    intro: "Multiply every whole number up to n. Useful for probability and combinations homework.",
    keywords: ["factorial", "permutations", "probability", "maths"],
    fields: [num("x", "Number (0–170)", 10)],
    compute: (v) => {
      const x = Math.min(170, Math.max(0, Math.round(n(v, "x"))));
      let out = 1;
      for (let i = 2; i <= x; i++) out *= i;
      return [
        { label: `${x}!`, value: out > 1e15 ? out.toExponential(6) : f(out, 0), primary: true },
      ];
    },
  },
  {
    slug: "quadratic-equation-solver",
    category: "Math & Everyday",
    title: "Quadratic Equation Solver",
    desc: "Solve ax² + bx + c = 0.",
    intro: "Enter the coefficients and get both roots plus the discriminant.",
    keywords: ["quadratic", "roots", "equation", "discriminant"],
    fields: [num("a", "a", 1), num("b", "b", -3), num("c", "c", 2)],
    compute: (v) => {
      const a = n(v, "a"), b = n(v, "b"), c = n(v, "c");
      const d = b * b - 4 * a * c;
      if (a === 0) return [{ label: "Root", value: b === 0 ? "—" : f(-c / b, 4), primary: true }];
      if (d < 0) return [
        { label: "Roots", value: "Complex", primary: true },
        { label: "Discriminant", value: f(d, 4) },
      ];
      return [
        { label: "Root 1", value: f((-b + Math.sqrt(d)) / (2 * a), 4), primary: true },
        { label: "Root 2", value: f((-b - Math.sqrt(d)) / (2 * a), 4) },
        { label: "Discriminant", value: f(d, 4) },
      ];
    },
  },
  {
    slug: "triangle-area-calculator",
    category: "Math & Everyday",
    title: "Triangle Area Calculator",
    desc: "Area from base and height.",
    intro: "Half base times height — plus the area in square centimetres for small shapes.",
    keywords: ["triangle", "area", "geometry", "base height"],
    fields: [num("base", "Base", 10, "m"), num("height", "Height", 6, "m")],
    compute: (v) => {
      const area = (n(v, "base") * n(v, "height")) / 2;
      return [
        { label: "Area", value: `${f(area, 4)} m²`, primary: true },
        { label: "In cm²", value: f(area * 10000, 0) },
      ];
    },
  },
  {
    slug: "circle-calculator",
    category: "Math & Everyday",
    title: "Circle Calculator",
    desc: "Area, circumference and diameter from a radius.",
    intro: "Type a radius and get the circle's diameter, circumference and area at once.",
    keywords: ["circle", "radius", "circumference", "area", "pi"],
    fields: [num("r", "Radius", 5, "m")],
    compute: (v) => {
      const r = n(v, "r");
      return [
        { label: "Area", value: `${f(Math.PI * r * r, 4)} m²`, primary: true },
        { label: "Circumference", value: `${f(2 * Math.PI * r, 4)} m` },
        { label: "Diameter", value: `${f(2 * r, 4)} m` },
      ];
    },
  },
  {
    slug: "standard-deviation-calculator",
    category: "Math & Everyday",
    title: "Standard Deviation Calculator",
    desc: "Spread of a small data set.",
    intro: "Enter up to five values to see the mean, variance and standard deviation.",
    keywords: ["standard deviation", "variance", "spread", "statistics"],
    fields: fiveNumbers,
    compute: (v) => {
      const xs = list(v);
      const mean = xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0;
      const variance = xs.length ? xs.reduce((a, b) => a + (b - mean) ** 2, 0) / xs.length : 0;
      return [
        { label: "Standard deviation", value: f(Math.sqrt(variance), 4), primary: true },
        { label: "Mean", value: f(mean, 4) },
        { label: "Variance", value: f(variance, 4) },
      ];
    },
  },
  {
    slug: "remainder-calculator",
    category: "Math & Everyday",
    title: "Remainder Calculator",
    desc: "Division with quotient and remainder.",
    intro: "Divide one number by another and see the whole-number quotient and what is left over.",
    keywords: ["remainder", "modulo", "division", "quotient"],
    fields: [num("a", "Dividend", 47), num("b", "Divisor", 5)],
    compute: (v) => {
      const a = n(v, "a"), b = n(v, "b") || 1;
      return [
        { label: "Remainder", value: f(a % b, 4), primary: true },
        { label: "Quotient", value: f(Math.trunc(a / b), 0) },
        { label: "Exact division", value: f(a / b, 4) },
      ];
    },
  },
];

/* ---------- Health & Fitness ---------- */
const health: ToolSpec[] = [
  {
    slug: "bmr-calculator",
    category: "Health & Fitness",
    title: "BMR Calculator",
    desc: "Basal metabolic rate with Mifflin-St Jeor.",
    intro: "Estimate the calories your body burns at complete rest each day.",
    keywords: ["bmr", "basal metabolic rate", "metabolism", "calories"],
    fields: [sel("sex", "Sex", ["Male", "Female"]), num("age", "Age", 30, "yrs"), num("kg", "Weight", 70, "kg"), num("cm", "Height", 175, "cm")],
    compute: (v) => {
      const base = 10 * n(v, "kg") + 6.25 * n(v, "cm") - 5 * n(v, "age");
      const bmr = s(v, "sex") === "Male" ? base + 5 : base - 161;
      return [
        { label: "BMR", value: `${f(bmr, 0)} kcal/day`, primary: true },
        { label: "Lightly active need", value: `${f(bmr * 1.375, 0)} kcal/day` },
      ];
    },
  },
  {
    slug: "lean-body-mass-calculator",
    category: "Health & Fitness",
    title: "Lean Body Mass Calculator",
    desc: "Muscle and bone mass estimate.",
    intro: "Estimate how much of your body weight is lean tissue rather than fat.",
    keywords: ["lean body mass", "lbm", "muscle mass", "boer formula"],
    fields: [sel("sex", "Sex", ["Male", "Female"]), num("kg", "Weight", 70, "kg"), num("cm", "Height", 175, "cm")],
    compute: (v) => {
      const kg = n(v, "kg"), cm = n(v, "cm");
      const lbm = s(v, "sex") === "Male" ? 0.407 * kg + 0.267 * cm - 19.2 : 0.252 * kg + 0.473 * cm - 48.3;
      return [
        { label: "Lean body mass", value: `${f(lbm, 1)} kg`, primary: true },
        { label: "Fat mass", value: `${f(kg - lbm, 1)} kg` },
        { label: "Lean share", value: `${f(kg ? (lbm / kg) * 100 : 0, 1)} %` },
      ];
    },
  },
  {
    slug: "waist-to-hip-ratio",
    category: "Health & Fitness",
    title: "Waist to Hip Ratio Calculator",
    desc: "A simple body-shape health marker.",
    intro: "Compare your waist and hip measurements — a widely used indicator of health risk.",
    keywords: ["waist to hip", "whr", "body shape", "health risk"],
    fields: [sel("sex", "Sex", ["Male", "Female"]), num("waist", "Waist", 85, "cm"), num("hip", "Hip", 100, "cm")],
    compute: (v) => {
      const ratio = n(v, "waist") / (n(v, "hip") || 1);
      const male = s(v, "sex") === "Male";
      const risk = ratio < (male ? 0.9 : 0.8) ? "Low" : ratio < (male ? 1.0 : 0.85) ? "Moderate" : "High";
      return [
        { label: "Waist-to-hip ratio", value: f(ratio, 2), primary: true },
        { label: "Risk band", value: risk },
      ];
    },
  },
  {
    slug: "waist-to-height-ratio",
    category: "Health & Fitness",
    title: "Waist to Height Ratio Calculator",
    desc: "Keep your waist under half your height.",
    intro: "A quick screening check: a ratio below 0.5 is usually considered healthy.",
    keywords: ["waist to height", "whtr", "belly fat", "screening"],
    fields: [num("waist", "Waist", 85, "cm"), num("cm", "Height", 175, "cm")],
    compute: (v) => {
      const r = n(v, "waist") / (n(v, "cm") || 1);
      return [
        { label: "Ratio", value: f(r, 3), primary: true },
        { label: "Assessment", value: r < 0.4 ? "Below range" : r < 0.5 ? "Healthy" : r < 0.6 ? "Increased risk" : "High risk" },
        { label: "Target waist", value: `${f(n(v, "cm") * 0.5, 1)} cm or less` },
      ];
    },
  },
  {
    slug: "macro-split-calculator",
    category: "Health & Fitness",
    title: "Macro Split Calculator",
    desc: "Turn daily calories into protein, carbs and fat.",
    intro: "Choose a macro split and see the grams of protein, carbohydrate and fat to aim for.",
    keywords: ["macros", "protein", "carbs", "fat", "diet"],
    fields: [num("kcal", "Daily calories", 2200, "kcal"), num("p", "Protein", 30, "%"), num("c", "Carbs", 40, "%"), num("fat", "Fat", 30, "%")],
    compute: (v) => {
      const kcal = n(v, "kcal");
      return [
        { label: "Protein", value: `${f((kcal * n(v, "p")) / 100 / 4, 0)} g`, primary: true },
        { label: "Carbohydrate", value: `${f((kcal * n(v, "c")) / 100 / 4, 0)} g` },
        { label: "Fat", value: `${f((kcal * n(v, "fat")) / 100 / 9, 0)} g` },
        { label: "Split total", value: `${f(n(v, "p") + n(v, "c") + n(v, "fat"), 0)} %` },
      ];
    },
  },
  {
    slug: "protein-intake-calculator",
    category: "Health & Fitness",
    title: "Protein Intake Calculator",
    desc: "Daily protein target by body weight.",
    intro: "Work out a sensible daily protein target based on your weight and training level.",
    keywords: ["protein", "grams per kg", "muscle", "nutrition"],
    fields: [num("kg", "Weight", 70, "kg"), sel("goal", "Activity", ["Sedentary", "Active", "Strength training", "Athlete"], "Active")],
    compute: (v) => {
      const rate = { Sedentary: 0.8, Active: 1.2, "Strength training": 1.8, Athlete: 2.2 }[s(v, "goal")] ?? 1.2;
      const g = n(v, "kg") * rate;
      return [
        { label: "Daily protein", value: `${f(g, 0)} g`, primary: true },
        { label: "Per meal (3 meals)", value: `${f(g / 3, 0)} g` },
        { label: "Rate used", value: `${rate} g per kg` },
      ];
    },
  },
  {
    slug: "calorie-deficit-calculator",
    category: "Health & Fitness",
    title: "Calorie Deficit Calculator",
    desc: "How long to reach a weight goal.",
    intro: "See the daily deficit needed for your target and roughly how long it will take.",
    keywords: ["calorie deficit", "weight loss", "fat loss", "diet"],
    fields: [num("maintain", "Maintenance calories", 2400, "kcal"), num("lose", "Weight to lose", 5, "kg"), num("weeks", "Weeks available", 10)],
    compute: (v) => {
      const kcalNeeded = n(v, "lose") * 7700;
      const days = Math.max(1, n(v, "weeks") * 7);
      const daily = kcalNeeded / days;
      return [
        { label: "Daily deficit needed", value: `${f(daily, 0)} kcal`, primary: true },
        { label: "Eat per day", value: `${f(n(v, "maintain") - daily, 0)} kcal` },
        { label: "Pace", value: `${f(n(v, "lose") / Math.max(1, n(v, "weeks")), 2)} kg per week` },
      ];
    },
  },
  {
    slug: "healthy-weight-range-calculator",
    category: "Health & Fitness",
    title: "Healthy Weight Range Calculator",
    desc: "Your BMI 18.5–24.9 weight band.",
    intro: "Find the weight range that keeps your BMI in the healthy band for your height.",
    keywords: ["healthy weight", "bmi range", "ideal weight", "target weight"],
    fields: [num("cm", "Height", 175, "cm")],
    compute: (v) => {
      const m = n(v, "cm") / 100;
      return [
        { label: "Healthy range", value: `${f(18.5 * m * m, 1)} – ${f(24.9 * m * m, 1)} kg`, primary: true },
        { label: "Midpoint", value: `${f(21.7 * m * m, 1)} kg` },
      ];
    },
  },
  {
    slug: "bmi-prime-calculator",
    category: "Health & Fitness",
    title: "BMI Prime Calculator",
    desc: "Your BMI as a ratio of the upper healthy limit.",
    intro: "BMI Prime compares your BMI to 25 — under 1.0 sits inside the healthy band.",
    keywords: ["bmi prime", "bmi ratio", "body mass index"],
    fields: [num("kg", "Weight", 70, "kg"), num("cm", "Height", 175, "cm")],
    compute: (v) => {
      const m = n(v, "cm") / 100;
      const bmi = n(v, "kg") / (m * m || 1);
      return [
        { label: "BMI Prime", value: f(bmi / 25, 2), primary: true },
        { label: "BMI", value: f(bmi, 1) },
        { label: "Band", value: bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : bmi < 30 ? "Overweight" : "Obese" },
      ];
    },
  },
  {
    slug: "sleep-cycle-calculator",
    category: "Health & Fitness",
    title: "Sleep Cycle Calculator",
    desc: "Wake up between sleep cycles.",
    intro: "Sleep runs in roughly 90-minute cycles — plan a bedtime that lands between them.",
    keywords: ["sleep", "sleep cycle", "bedtime", "rest"],
    fields: [num("cycles", "Cycles wanted", 5), num("fallAsleep", "Minutes to fall asleep", 15, "min")],
    compute: (v) => {
      const mins = n(v, "cycles") * 90 + n(v, "fallAsleep");
      return [
        { label: "Total time in bed", value: `${Math.floor(mins / 60)} h ${Math.round(mins % 60)} min`, primary: true },
        { label: "Sleep time", value: `${f((n(v, "cycles") * 90) / 60, 1)} hours` },
        { label: "Cycles", value: f(n(v, "cycles"), 0) },
      ];
    },
  },
];

/* ---------- Money & Finance ---------- */
const money: ToolSpec[] = [
  {
    slug: "emi-calculator",
    category: "Money & Finance",
    title: "EMI Calculator",
    desc: "Equated monthly instalment on any loan.",
    intro: "Enter the amount, rate and term to see your monthly instalment and total interest.",
    keywords: ["emi", "monthly instalment", "loan", "repayment"],
    fields: [num("p", "Loan amount", 1000000), num("rate", "Annual rate", 18, "%"), num("years", "Term", 3, "yrs")],
    compute: (v) => {
      const months = Math.max(1, Math.round(n(v, "years") * 12));
      const r = n(v, "rate") / 100 / 12;
      const m = r === 0 ? n(v, "p") / months : (n(v, "p") * r) / (1 - Math.pow(1 + r, -months));
      return [
        { label: "Monthly EMI", value: f(m), primary: true },
        { label: "Total repaid", value: f(m * months) },
        { label: "Total interest", value: f(m * months - n(v, "p")) },
      ];
    },
  },
  {
    slug: "debt-payoff-calculator",
    category: "Money & Finance",
    title: "Debt Payoff Calculator",
    desc: "How long until the debt is clear.",
    intro: "See how many months a fixed monthly payment takes to clear a balance, and the interest cost.",
    keywords: ["debt payoff", "snowball", "months to clear", "interest"],
    fields: [num("balance", "Balance", 500000), num("rate", "Annual rate", 24, "%"), num("pay", "Monthly payment", 30000)],
    compute: (v) => {
      const r = n(v, "rate") / 100 / 12;
      const bal = n(v, "balance"), pay = n(v, "pay");
      if (pay <= bal * r) return [{ label: "Result", value: "Payment too small to clear the debt", primary: true }];
      const months = r === 0 ? bal / pay : Math.log(pay / (pay - bal * r)) / Math.log(1 + r);
      return [
        { label: "Months to clear", value: f(Math.ceil(months), 0), primary: true },
        { label: "Years", value: f(months / 12, 1) },
        { label: "Total interest", value: f(pay * months - bal) },
      ];
    },
  },
  {
    slug: "credit-card-payoff-calculator",
    category: "Money & Finance",
    title: "Credit Card Payoff Calculator",
    desc: "Minimum payments vs paying more.",
    intro: "Compare a minimum payment with a fixed payment and see the interest you avoid.",
    keywords: ["credit card", "minimum payment", "payoff", "interest"],
    fields: [num("balance", "Card balance", 300000), num("apr", "APR", 30, "%"), num("pay", "Monthly payment", 25000)],
    compute: (v) => {
      const r = n(v, "apr") / 100 / 12;
      const bal = n(v, "balance"), pay = n(v, "pay");
      if (pay <= bal * r) return [{ label: "Result", value: "Payment only covers interest", primary: true }];
      const months = Math.log(pay / (pay - bal * r)) / Math.log(1 + r);
      return [
        { label: "Months to clear", value: f(Math.ceil(months), 0), primary: true },
        { label: "Interest paid", value: f(pay * months - bal) },
        { label: "Monthly interest now", value: f(bal * r) },
      ];
    },
  },
  {
    slug: "interest-only-payment-calculator",
    category: "Money & Finance",
    title: "Interest Only Payment Calculator",
    desc: "Monthly interest on a balance.",
    intro: "Work out interest-only payments and what the full repayment would cost instead.",
    keywords: ["interest only", "monthly interest", "loan", "balance"],
    fields: [num("p", "Balance", 2000000), num("rate", "Annual rate", 15, "%"), num("years", "Term", 5, "yrs")],
    compute: (v) => {
      const interest = (n(v, "p") * n(v, "rate")) / 100 / 12;
      const months = Math.max(1, Math.round(n(v, "years") * 12));
      const r = n(v, "rate") / 100 / 12;
      const full = r === 0 ? n(v, "p") / months : (n(v, "p") * r) / (1 - Math.pow(1 + r, -months));
      return [
        { label: "Interest-only payment", value: f(interest), primary: true },
        { label: "Full repayment payment", value: f(full) },
        { label: "Monthly difference", value: f(full - interest) },
      ];
    },
  },
  {
    slug: "loan-affordability-calculator",
    category: "Money & Finance",
    title: "Loan Affordability Calculator",
    desc: "How much you can borrow.",
    intro: "Turn a comfortable monthly payment into the loan amount it can support.",
    keywords: ["affordability", "how much can i borrow", "loan", "budget"],
    fields: [num("pay", "Monthly payment you can afford", 80000), num("rate", "Annual rate", 20, "%"), num("years", "Term", 4, "yrs")],
    compute: (v) => {
      const months = Math.max(1, Math.round(n(v, "years") * 12));
      const r = n(v, "rate") / 100 / 12;
      const principal = r === 0 ? n(v, "pay") * months : (n(v, "pay") * (1 - Math.pow(1 + r, -months))) / r;
      return [
        { label: "You could borrow", value: f(principal), primary: true },
        { label: "Total repaid", value: f(n(v, "pay") * months) },
        { label: "Total interest", value: f(n(v, "pay") * months - principal) },
      ];
    },
  },
  {
    slug: "early-repayment-savings-calculator",
    category: "Money & Finance",
    title: "Early Repayment Savings Calculator",
    desc: "Interest saved by paying extra.",
    intro: "Add an extra amount each month and see how much interest and time you save.",
    keywords: ["early repayment", "overpayment", "save interest", "loan"],
    fields: [num("p", "Loan balance", 1500000), num("rate", "Annual rate", 18, "%"), num("years", "Remaining term", 4, "yrs"), num("extra", "Extra per month", 10000)],
    compute: (v) => {
      const months = Math.max(1, Math.round(n(v, "years") * 12));
      const r = n(v, "rate") / 100 / 12;
      const base = r === 0 ? n(v, "p") / months : (n(v, "p") * r) / (1 - Math.pow(1 + r, -months));
      const pay = base + n(v, "extra");
      const bal = n(v, "p");
      const newMonths = r === 0 ? bal / pay : Math.log(pay / (pay - bal * r)) / Math.log(1 + r);
      return [
        { label: "Interest saved", value: f(base * months - pay * newMonths), primary: true },
        { label: "New term", value: `${f(Math.ceil(newMonths), 0)} months` },
        { label: "Months shorter", value: f(Math.max(0, months - Math.ceil(newMonths)), 0) },
      ];
    },
  },
  {
    slug: "balance-transfer-calculator",
    category: "Money & Finance",
    title: "Balance Transfer Calculator",
    desc: "Is moving the debt worth the fee?",
    intro: "Weigh a transfer fee against the interest you would save on a lower rate.",
    keywords: ["balance transfer", "transfer fee", "credit card", "savings"],
    fields: [num("balance", "Balance", 400000), num("oldApr", "Current APR", 30, "%"), num("newApr", "New APR", 12, "%"), num("fee", "Transfer fee", 3, "%"), num("months", "Months to repay", 12)],
    compute: (v) => {
      const b = n(v, "balance"), m = Math.max(1, n(v, "months"));
      const interest = (apr: number) => (b * (apr / 100) * m) / 12 / 2;
      const fee = (b * n(v, "fee")) / 100;
      const saving = interest(n(v, "oldApr")) - interest(n(v, "newApr")) - fee;
      return [
        { label: "Net saving", value: f(saving), primary: true },
        { label: "Transfer fee", value: f(fee) },
        { label: "Worth it?", value: saving > 0 ? "Yes" : "No" },
      ];
    },
  },
  {
    slug: "net-worth-calculator",
    category: "Money & Finance",
    title: "Net Worth Calculator",
    desc: "Assets minus liabilities.",
    intro: "Add what you own and subtract what you owe to see where you stand today.",
    keywords: ["net worth", "assets", "liabilities", "wealth"],
    fields: [num("cash", "Cash and savings", 500000), num("investments", "Investments", 1000000), num("property", "Property and other assets", 5000000), num("debts", "Total debts", 2000000)],
    compute: (v) => {
      const assets = n(v, "cash") + n(v, "investments") + n(v, "property");
      const worth = assets - n(v, "debts");
      return [
        { label: "Net worth", value: f(worth), primary: true },
        { label: "Total assets", value: f(assets) },
        { label: "Debt ratio", value: `${f(assets ? (n(v, "debts") / assets) * 100 : 0, 1)} %` },
      ];
    },
  },
  {
    slug: "budget-50-30-20-calculator",
    category: "Money & Finance",
    title: "50/30/20 Budget Calculator",
    desc: "Split income into needs, wants and savings.",
    intro: "A simple budgeting rule: half for needs, a third for wants, the rest into savings.",
    keywords: ["budget", "50 30 20", "needs wants savings", "money plan"],
    fields: [num("income", "Monthly take-home pay", 400000)],
    compute: (v) => {
      const i = n(v, "income");
      return [
        { label: "Needs (50%)", value: f(i * 0.5), primary: true },
        { label: "Wants (30%)", value: f(i * 0.3) },
        { label: "Savings (20%)", value: f(i * 0.2) },
        { label: "Yearly savings", value: f(i * 0.2 * 12) },
      ];
    },
  },
  {
    slug: "emergency-fund-calculator",
    category: "Money & Finance",
    title: "Emergency Fund Calculator",
    desc: "How big your safety net should be.",
    intro: "Size your emergency fund from monthly costs and see how long saving will take.",
    keywords: ["emergency fund", "safety net", "savings", "months cover"],
    fields: [num("expenses", "Monthly expenses", 250000), num("months", "Months of cover", 6), num("saved", "Already saved", 300000), num("monthly", "Monthly saving", 50000)],
    compute: (v) => {
      const target = n(v, "expenses") * n(v, "months");
      const gap = Math.max(0, target - n(v, "saved"));
      return [
        { label: "Target fund", value: f(target), primary: true },
        { label: "Still to save", value: f(gap) },
        { label: "Months to get there", value: n(v, "monthly") > 0 ? f(Math.ceil(gap / n(v, "monthly")), 0) : "—" },
      ];
    },
  },
];

/* ---------- Percentage & Fractions ---------- */
const percentage: ToolSpec[] = [
  {
    slug: "percentage-increase-calculator",
    category: "Percentage & Fractions",
    title: "Percentage Increase Calculator",
    desc: "Add a percentage to a number.",
    intro: "Increase any value by a percentage and see the amount added.",
    keywords: ["percentage increase", "add percent", "growth", "raise"],
    fields: [num("value", "Value", 20000), num("pct", "Increase by", 15, "%")],
    compute: (v) => {
      const add = (n(v, "value") * n(v, "pct")) / 100;
      return [
        { label: "New value", value: f(n(v, "value") + add), primary: true },
        { label: "Amount added", value: f(add) },
      ];
    },
  },
  {
    slug: "percentage-decrease-calculator",
    category: "Percentage & Fractions",
    title: "Percentage Decrease Calculator",
    desc: "Subtract a percentage from a number.",
    intro: "Reduce a value by a percentage and see how much comes off.",
    keywords: ["percentage decrease", "subtract percent", "reduction"],
    fields: [num("value", "Value", 20000), num("pct", "Decrease by", 15, "%")],
    compute: (v) => {
      const off = (n(v, "value") * n(v, "pct")) / 100;
      return [
        { label: "New value", value: f(n(v, "value") - off), primary: true },
        { label: "Amount removed", value: f(off) },
      ];
    },
  },
  {
    slug: "percentage-to-fraction",
    category: "Percentage & Fractions",
    title: "Percentage to Fraction Converter",
    desc: "Turn a percentage into a simplified fraction.",
    intro: "Convert any percentage into its simplest fraction and decimal form.",
    keywords: ["percentage to fraction", "convert", "simplify", "decimal"],
    fields: [num("pct", "Percentage", 37.5, "%")],
    compute: (v) => {
      const pct = n(v, "pct");
      let den = 100, numr = pct;
      while (numr % 1 !== 0 && den < 1e7) { numr *= 10; den *= 10; }
      const g = gcd(Math.round(numr), den) || 1;
      return [
        { label: "Fraction", value: `${Math.round(numr) / g} / ${den / g}`, primary: true },
        { label: "Decimal", value: f(pct / 100, 6) },
      ];
    },
  },
  {
    slug: "decimal-to-fraction",
    category: "Percentage & Fractions",
    title: "Decimal to Fraction Converter",
    desc: "Convert a decimal into a simple fraction.",
    intro: "Enter a decimal and get the simplified fraction plus the matching percentage.",
    keywords: ["decimal to fraction", "convert", "simplify"],
    fields: [num("x", "Decimal", 0.625)],
    compute: (v) => {
      const x = n(v, "x");
      let den = 1, numr = x;
      while (numr % 1 !== 0 && den < 1e7) { numr *= 10; den *= 10; }
      const g = gcd(Math.round(numr), den) || 1;
      return [
        { label: "Fraction", value: `${Math.round(numr) / g} / ${den / g}`, primary: true },
        { label: "Percentage", value: `${f(x * 100, 4)} %` },
      ];
    },
  },
  {
    slug: "fraction-simplifier",
    category: "Percentage & Fractions",
    title: "Fraction Simplifier",
    desc: "Reduce a fraction to lowest terms.",
    intro: "Enter the top and bottom numbers and get the fraction in its simplest form.",
    keywords: ["simplify fraction", "lowest terms", "reduce", "fraction"],
    fields: [num("a", "Numerator", 36), num("b", "Denominator", 48)],
    compute: (v) => {
      const a = Math.round(n(v, "a")), b = Math.round(n(v, "b")) || 1;
      const g = gcd(a, b) || 1;
      return [
        { label: "Simplified", value: `${a / g} / ${b / g}`, primary: true },
        { label: "Decimal", value: f(a / b, 6) },
        { label: "Percentage", value: `${f((a / b) * 100, 3)} %` },
      ];
    },
  },
  {
    slug: "fraction-addition-calculator",
    category: "Percentage & Fractions",
    title: "Fraction Addition Calculator",
    desc: "Add or subtract two fractions.",
    intro: "Add two fractions and get the simplified result, plus their difference.",
    keywords: ["add fractions", "subtract fractions", "fraction maths"],
    fields: [num("a", "First numerator", 1), num("b", "First denominator", 2), num("c", "Second numerator", 1), num("d", "Second denominator", 3)],
    compute: (v) => {
      const a = n(v, "a"), b = n(v, "b") || 1, c = n(v, "c"), d = n(v, "d") || 1;
      const sn = a * d + c * b, sd = b * d;
      const g = gcd(Math.round(sn), Math.round(sd)) || 1;
      const dn = a * d - c * b;
      const g2 = gcd(Math.round(dn), Math.round(sd)) || 1;
      return [
        { label: "Sum", value: `${Math.round(sn / g)} / ${Math.round(sd / g)}`, primary: true },
        { label: "Difference", value: `${Math.round(dn / g2)} / ${Math.round(sd / g2)}` },
        { label: "Sum as decimal", value: f(sn / sd, 6) },
      ];
    },
  },
  {
    slug: "fraction-multiplication-calculator",
    category: "Percentage & Fractions",
    title: "Fraction Multiplication Calculator",
    desc: "Multiply and divide two fractions.",
    intro: "Multiply two fractions and see the product and quotient, both simplified.",
    keywords: ["multiply fractions", "divide fractions", "fraction"],
    fields: [num("a", "First numerator", 2), num("b", "First denominator", 3), num("c", "Second numerator", 3), num("d", "Second denominator", 4)],
    compute: (v) => {
      const a = n(v, "a"), b = n(v, "b") || 1, c = n(v, "c"), d = n(v, "d") || 1;
      const pn = a * c, pd = b * d, gp = gcd(Math.round(pn), Math.round(pd)) || 1;
      const qn = a * d, qd = b * c || 1, gq = gcd(Math.round(qn), Math.round(qd)) || 1;
      return [
        { label: "Product", value: `${Math.round(pn / gp)} / ${Math.round(pd / gp)}`, primary: true },
        { label: "Quotient", value: `${Math.round(qn / gq)} / ${Math.round(qd / gq)}` },
        { label: "Product as decimal", value: f(pn / pd, 6) },
      ];
    },
  },
  {
    slug: "percent-error-calculator",
    category: "Percentage & Fractions",
    title: "Percent Error Calculator",
    desc: "Compare a measured value with the true value.",
    intro: "Standard lab calculation: how far a measurement strays from the accepted value.",
    keywords: ["percent error", "accuracy", "measured", "experiment"],
    fields: [num("measured", "Measured value", 9.5), num("actual", "True value", 9.81)],
    compute: (v) => {
      const diff = n(v, "measured") - n(v, "actual");
      return [
        { label: "Percent error", value: `${f(Math.abs(diff / (n(v, "actual") || 1)) * 100, 3)} %`, primary: true },
        { label: "Absolute error", value: f(Math.abs(diff), 4) },
        { label: "Direction", value: diff > 0 ? "Overestimate" : diff < 0 ? "Underestimate" : "Exact" },
      ];
    },
  },
  {
    slug: "percentile-calculator",
    category: "Percentage & Fractions",
    title: "Percentile Calculator",
    desc: "Where a score sits in a group.",
    intro: "Find the percentile rank of a score given how many people scored below it.",
    keywords: ["percentile", "rank", "score", "statistics"],
    fields: [num("below", "People scoring below you", 82), num("total", "Total people", 100)],
    compute: (v) => {
      const pct = (n(v, "below") / (n(v, "total") || 1)) * 100;
      return [
        { label: "Percentile", value: `${f(pct, 1)} th`, primary: true },
        { label: "You beat", value: `${f(pct, 1)} % of the group` },
        { label: "Above you", value: f(Math.max(0, n(v, "total") - n(v, "below")), 0) },
      ];
    },
  },
  {
    slug: "marks-percentage-calculator",
    category: "Percentage & Fractions",
    title: "Marks Percentage Calculator",
    desc: "Turn marks scored into a percentage.",
    intro: "Enter marks scored and total marks to get your percentage and pass status.",
    keywords: ["marks percentage", "exam score", "test result", "school"],
    fields: [num("scored", "Marks scored", 412), num("total", "Total marks", 500), num("pass", "Pass mark", 50, "%")],
    compute: (v) => {
      const pct = (n(v, "scored") / (n(v, "total") || 1)) * 100;
      return [
        { label: "Percentage", value: `${f(pct, 2)} %`, primary: true },
        { label: "Status", value: pct >= n(v, "pass") ? "Pass" : "Below pass mark" },
        { label: "Marks lost", value: f(n(v, "total") - n(v, "scored"), 0) },
      ];
    },
  },
];

/* ---------- Date & Time ---------- */
const dateTime: ToolSpec[] = [
  {
    slug: "workdays-calculator",
    category: "Date & Time",
    title: "Working Days Calculator",
    desc: "Count weekdays between two dates.",
    intro: "Count the business days between two dates, skipping Saturdays and Sundays.",
    keywords: ["working days", "business days", "weekdays", "date range"],
    fields: [dat("start", "Start date"), dat("end", "End date", "30")],
    compute: (v) => {
      const a = parseDate(s(v, "start")), b = parseDate(s(v, "end"));
      const from = a < b ? a : b, to = a < b ? b : a;
      let work = 0, total = 0;
      for (let t = from.getTime(); t <= to.getTime(); t += DAY) {
        total++;
        const d = new Date(t).getDay();
        if (d !== 0 && d !== 6) work++;
      }
      return [
        { label: "Working days", value: f(work, 0), primary: true },
        { label: "Total days", value: f(total, 0) },
        { label: "Weekend days", value: f(total - work, 0) },
      ];
    },
  },
  {
    slug: "weeks-between-dates",
    category: "Date & Time",
    title: "Weeks Between Dates Calculator",
    desc: "How many weeks separate two dates.",
    intro: "Get the gap between two dates expressed in weeks and leftover days.",
    keywords: ["weeks between", "date difference", "weeks", "calendar"],
    fields: [dat("start", "Start date"), dat("end", "End date", "90")],
    compute: (v) => {
      const days = Math.abs(parseDate(s(v, "end")).getTime() - parseDate(s(v, "start")).getTime()) / DAY;
      return [
        { label: "Weeks", value: f(Math.floor(days / 7), 0), primary: true },
        { label: "Extra days", value: f(Math.round(days % 7), 0) },
        { label: "Exact weeks", value: f(days / 7, 2) },
      ];
    },
  },
  {
    slug: "months-between-dates",
    category: "Date & Time",
    title: "Months Between Dates Calculator",
    desc: "Months and days between two dates.",
    intro: "Useful for contracts and rent — the gap between two dates in months.",
    keywords: ["months between", "date difference", "contract", "duration"],
    fields: [dat("start", "Start date"), dat("end", "End date", "365")],
    compute: (v) => {
      const a = parseDate(s(v, "start")), b = parseDate(s(v, "end"));
      const months = (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth());
      const days = Math.abs(b.getTime() - a.getTime()) / DAY;
      return [
        { label: "Whole months", value: f(Math.abs(months), 0), primary: true },
        { label: "Total days", value: f(Math.round(days), 0) },
        { label: "In years", value: f(days / 365.25, 2) },
      ];
    },
  },
  {
    slug: "countdown-to-date",
    category: "Date & Time",
    title: "Countdown to Date Calculator",
    desc: "Days left until an event.",
    intro: "Count the days, weeks and working days remaining until any date you choose.",
    keywords: ["countdown", "days until", "event", "deadline"],
    fields: [dat("target", "Target date", "60")],
    compute: (v) => {
      const days = Math.ceil((parseDate(s(v, "target")).getTime() - Date.now()) / DAY);
      return [
        { label: "Days remaining", value: f(days, 0), primary: true },
        { label: "Weeks remaining", value: f(days / 7, 1) },
        { label: "Approx working days", value: f(Math.round((days * 5) / 7), 0) },
      ];
    },
  },
  {
    slug: "time-duration-calculator",
    category: "Date & Time",
    title: "Time Duration Calculator",
    desc: "Hours between a start and end time.",
    intro: "Enter start and finish times in 24-hour format to get the duration worked.",
    keywords: ["time duration", "hours between", "shift length", "timesheet"],
    fields: [num("sh", "Start hour", 9), num("sm", "Start minute", 0), num("eh", "End hour", 17), num("em", "End minute", 30), num("breakMin", "Break", 30, "min")],
    compute: (v) => {
      let mins = n(v, "eh") * 60 + n(v, "em") - (n(v, "sh") * 60 + n(v, "sm"));
      if (mins < 0) mins += 1440;
      const net = mins - n(v, "breakMin");
      return [
        { label: "Time worked", value: `${Math.floor(net / 60)} h ${Math.round(net % 60)} min`, primary: true },
        { label: "Decimal hours", value: f(net / 60, 2) },
        { label: "Gross duration", value: `${Math.floor(mins / 60)} h ${Math.round(mins % 60)} min` },
      ];
    },
  },
  {
    slug: "add-hours-calculator",
    category: "Date & Time",
    title: "Add Hours to Time Calculator",
    desc: "Add or subtract hours from a clock time.",
    intro: "Shift a time forward or back by any number of hours and minutes.",
    keywords: ["add hours", "time calculator", "clock", "subtract time"],
    fields: [num("h", "Hour", 14), num("m", "Minute", 20), num("addH", "Add hours", 5), num("addM", "Add minutes", 45)],
    compute: (v) => {
      let mins = ((n(v, "h") * 60 + n(v, "m") + n(v, "addH") * 60 + n(v, "addM")) % 1440 + 1440) % 1440;
      const hh = Math.floor(mins / 60), mm = Math.round(mins % 60);
      return [
        { label: "New time", value: `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`, primary: true },
        { label: "Total added", value: `${f(n(v, "addH") + n(v, "addM") / 60, 2)} hours` },
      ];
    },
  },
  {
    slug: "day-of-week-finder",
    category: "Date & Time",
    title: "Day of the Week Finder",
    desc: "What day does a date fall on?",
    intro: "Pick any date and find out which day of the week it is, plus the day of the year.",
    keywords: ["day of week", "what day", "calendar", "date"],
    fields: [dat("date", "Date")],
    compute: (v) => {
      const d = parseDate(s(v, "date"));
      const names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const start = new Date(d.getFullYear(), 0, 0);
      return [
        { label: "Day", value: names[d.getDay()], primary: true },
        { label: "Day of year", value: f(Math.floor((d.getTime() - start.getTime()) / DAY), 0) },
        { label: "Weekend?", value: d.getDay() === 0 || d.getDay() === 6 ? "Yes" : "No" },
      ];
    },
  },
  {
    slug: "leap-year-checker",
    category: "Date & Time",
    title: "Leap Year Checker",
    desc: "Is a given year a leap year?",
    intro: "Check any year for the 29th of February and see the next leap year.",
    keywords: ["leap year", "february 29", "calendar", "year"],
    fields: [num("year", "Year", 2026)],
    compute: (v) => {
      const y = Math.round(n(v, "year"));
      const leap = (x: number) => (x % 4 === 0 && x % 100 !== 0) || x % 400 === 0;
      let next = y + 1;
      while (!leap(next)) next++;
      return [
        { label: "Leap year?", value: leap(y) ? "Yes" : "No", primary: true },
        { label: "Days in year", value: leap(y) ? "366" : "365" },
        { label: "Next leap year", value: String(next) },
      ];
    },
  },
  {
    slug: "week-number-calculator",
    category: "Date & Time",
    title: "Week Number Calculator",
    desc: "ISO week number for any date.",
    intro: "Find the ISO week number of a date — handy for planning and reporting.",
    keywords: ["week number", "iso week", "calendar week", "planning"],
    fields: [dat("date", "Date")],
    compute: (v) => {
      const d = parseDate(s(v, "date"));
      const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
      t.setUTCDate(t.getUTCDate() + 4 - (t.getUTCDay() || 7));
      const yearStart = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
      const week = Math.ceil(((t.getTime() - yearStart.getTime()) / DAY + 1) / 7);
      return [
        { label: "Week number", value: `Week ${week}`, primary: true },
        { label: "ISO year", value: String(t.getUTCFullYear()) },
        { label: "Weeks left in year", value: f(Math.max(0, 52 - week), 0) },
      ];
    },
  },
  {
    slug: "minutes-to-hours-converter",
    category: "Date & Time",
    title: "Minutes to Hours Converter",
    desc: "Minutes into hours, days and seconds.",
    intro: "Convert a number of minutes into hours and minutes, decimal hours and days.",
    keywords: ["minutes to hours", "time conversion", "decimal hours"],
    fields: [num("mins", "Minutes", 500, "min")],
    compute: (v) => {
      const m = n(v, "mins");
      return [
        { label: "Hours and minutes", value: `${Math.floor(m / 60)} h ${Math.round(m % 60)} min`, primary: true },
        { label: "Decimal hours", value: f(m / 60, 3) },
        { label: "Days", value: f(m / 1440, 3) },
      ];
    },
  },
];

export const EXTRA_SPECS_1: ToolSpec[] = [...math, ...health, ...money, ...percentage, ...dateTime];
