import {
  Calculator,
  HeartPulse,
  Banknote,
  Ruler,
  Weight,
  Thermometer,
  Flame,
  Landmark,
  DollarSign,
  type LucideIcon,
} from "lucide-react";

export type ToolCategory =
  | "Math & Everyday"
  | "Health & Fitness"
  | "Money & Finance"
  | "Unit Converters"
  | "Site Pages";

export type CategoryMeta = {
  name: ToolCategory;
  slug: string;
  desc: string;
  intro: string;
  metaTitle: string;
  metaDescription: string;
};

export const TOOL_CATEGORIES: CategoryMeta[] = [
  {
    name: "Math & Everyday",
    slug: "math-everyday",
    desc: "Quick everyday number crunching.",
    intro:
      "Everyday maths without the clutter. Run quick arithmetic, percentages and repeat calculations right in your browser — nothing to install and nothing to sign up for.",
    metaTitle: "Math & Everyday Calculators — Utilikit",
    metaDescription:
      "Free everyday maths tools: a fast online calculator for arithmetic, percentages and quick sums. No sign-up, works on mobile and desktop.",
  },
  {
    name: "Health & Fitness",
    slug: "health-fitness",
    desc: "Track your body metrics and energy needs.",
    intro:
      "Understand your body metrics at a glance. Check your BMI against healthy ranges and estimate the daily calories you need to maintain, lose or gain weight.",
    metaTitle: "Health & Fitness Calculators — BMI & Calories | Utilikit",
    metaDescription:
      "Free health calculators: work out your BMI with category ranges and estimate daily calorie needs (TDEE) using the Mifflin-St Jeor equation.",
  },
  {
    name: "Money & Finance",
    slug: "money-finance",
    desc: "Loans, repayments and live exchange rates.",
    intro:
      "Plan borrowing and spending with confidence. Compare loan repayments in Naira or dollars, see full amortisation schedules, and convert money at live exchange rates.",
    metaTitle: "Money & Finance Calculators — Loans & Currency | Utilikit",
    metaDescription:
      "Free finance tools: Nigeria and US loan calculators with monthly payments and amortisation schedules, plus a live currency converter.",
  },
  {
    name: "Unit Converters",
    slug: "unit-converters",
    desc: "Switch between metric and imperial in a tap.",
    intro:
      "Metric to imperial and back, instantly. Convert length, weight and temperature — or use the all-in-one converter when you need several units at once.",
    metaTitle: "Unit Converters — Length, Weight & Temperature | Utilikit",
    metaDescription:
      "Free unit converters for length, weight and temperature. Switch between metric and imperial units instantly — meters, feet, kg, lbs, °C and °F.",
  },
  {
    name: "Site Pages",
    slug: "site-pages",
    desc: "Learn more about Utilikit.",
    intro:
      "Everything about Utilikit in one place — who built it, how the tools work, how your data is handled, and how to get in touch.",
    metaTitle: "About Utilikit — Site Pages, FAQ & Contact",
    metaDescription:
      "Learn about Utilikit, read the FAQ, review the privacy policy, or contact developer Dotun Lambo about the free calculator and converter tools.",
  },
];


export type Tool = {
  to: string;
  category: ToolCategory;
  title: string;
  desc: string;
  icon: LucideIcon;
  keywords: string[];
};

export const tools: Tool[] = [
  {
    to: "/calculator",
    category: "Math & Everyday",
    title: "Calculator",
    desc: "Quick arithmetic with a clean keypad.",
    icon: Calculator,
    keywords: ["math", "add", "subtract", "multiply", "divide", "arithmetic"],
  },
  {
    to: "/bmi",
    category: "Health & Fitness",
    title: "BMI",
    desc: "Body Mass Index from height & weight.",
    icon: HeartPulse,
    keywords: ["body mass index", "weight", "height", "health", "obesity"],
  },
  {
    to: "/currency",
    category: "Money & Finance",
    title: "Currency",
    desc: "Live exchange rates between currencies.",
    icon: Banknote,
    keywords: ["exchange", "money", "forex", "rate", "conversion"],
  },
  {
    to: "/calories",
    category: "Health & Fitness",
    title: "Calories",
    desc: "Estimate daily calorie needs.",
    icon: Flame,
    keywords: ["calorie", "food", "diet", "energy", "nutrition", "tdee"],
  },
  {
    to: "/length",
    category: "Unit Converters",
    title: "Length",
    desc: "Meters, miles, feet, inches and more.",
    icon: Ruler,
    keywords: ["distance", "meter", "feet", "inch", "kilometer", "mile"],
  },
  {
    to: "/weight",
    category: "Unit Converters",
    title: "Weight",
    desc: "Kilograms, pounds, ounces and tonnes.",
    icon: Weight,
    keywords: ["mass", "kg", "pound", "lb", "ounce", "ton", "gram"],
  },
  {
    to: "/temperature",
    category: "Unit Converters",
    title: "Temperature",
    desc: "Celsius, Fahrenheit and Kelvin.",
    icon: Thermometer,
    keywords: ["celsius", "fahrenheit", "kelvin", "heat", "cold"],
  },
  {
    to: "/loan",
    category: "Money & Finance",
    title: "Nigeria Loan",
    desc: "EMI, interest and repayment schedule in Naira.",
    icon: Landmark,
    keywords: ["naira", "mortgage", "emi", "interest", "nigeria", "repayment"],
  },
  {
    to: "/us-loan",
    category: "Money & Finance",
    title: "US Loan",
    desc: "Mortgage & personal loan payments in dollars.",
    icon: DollarSign,
    keywords: ["dollar", "mortgage", "interest", "payment", "usa", "loan"],
  },
  {
    to: "/units",
    category: "Unit Converters",
    title: "Units",
    desc: "All unit conversions in one place.",
    icon: Ruler,
    keywords: ["convert", "conversion", "measurement", "unit"],
  },
  {
    to: "/about",
    category: "Site Pages",
    title: "About",
    desc: "Learn more about Utilikit.",
    icon: Calculator,
    keywords: ["about", "info", "utilikit"],
  },
  {
    to: "/faq",
    category: "Site Pages",
    title: "FAQ",
    desc: "Frequently asked questions.",
    icon: Calculator,
    keywords: ["faq", "questions", "help"],
  },
  {
    to: "/contact",
    category: "Site Pages",
    title: "Contact",
    desc: "Get in touch with us.",
    icon: Calculator,
    keywords: ["contact", "email", "support"],
  },
  {
    to: "/privacy",
    category: "Site Pages",
    title: "Privacy",
    desc: "Privacy policy and data usage.",
    icon: Calculator,
    keywords: ["privacy", "policy", "data"],
  },
];
