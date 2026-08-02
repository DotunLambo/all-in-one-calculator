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

export const TOOL_CATEGORIES: { name: ToolCategory; desc: string }[] = [
  { name: "Math & Everyday", desc: "Quick everyday number crunching." },
  { name: "Health & Fitness", desc: "Track your body metrics and energy needs." },
  { name: "Money & Finance", desc: "Loans, repayments and live exchange rates." },
  { name: "Unit Converters", desc: "Switch between metric and imperial in a tap." },
  { name: "Site Pages", desc: "Learn more about Utilikit." },
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
