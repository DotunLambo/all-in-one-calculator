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

export type Tool = {
  to: string;
  title: string;
  desc: string;
  icon: LucideIcon;
  keywords: string[];
};

export const tools: Tool[] = [
  {
    to: "/calculator",
    title: "Calculator",
    desc: "Quick arithmetic with a clean keypad.",
    icon: Calculator,
    keywords: ["math", "add", "subtract", "multiply", "divide", "arithmetic"],
  },
  {
    to: "/bmi",
    title: "BMI",
    desc: "Body Mass Index from height & weight.",
    icon: HeartPulse,
    keywords: ["body mass index", "weight", "height", "health", "obesity"],
  },
  {
    to: "/currency",
    title: "Currency",
    desc: "Live exchange rates between currencies.",
    icon: Banknote,
    keywords: ["exchange", "money", "forex", "rate", "conversion"],
  },
  {
    to: "/calories",
    title: "Calories",
    desc: "Estimate daily calorie needs.",
    icon: Flame,
    keywords: ["calorie", "food", "diet", "energy", "nutrition", "tdee"],
  },
  {
    to: "/length",
    title: "Length",
    desc: "Meters, miles, feet, inches and more.",
    icon: Ruler,
    keywords: ["distance", "meter", "feet", "inch", "kilometer", "mile"],
  },
  {
    to: "/weight",
    title: "Weight",
    desc: "Kilograms, pounds, ounces and tonnes.",
    icon: Weight,
    keywords: ["mass", "kg", "pound", "lb", "ounce", "ton", "gram"],
  },
  {
    to: "/temperature",
    title: "Temperature",
    desc: "Celsius, Fahrenheit and Kelvin.",
    icon: Thermometer,
    keywords: ["celsius", "fahrenheit", "kelvin", "heat", "cold"],
  },
  {
    to: "/loan",
    title: "Nigeria Loan",
    desc: "EMI, interest and repayment schedule in Naira.",
    icon: Landmark,
    keywords: ["naira", "mortgage", "emi", "interest", "nigeria", "repayment"],
  },
  {
    to: "/us-loan",
    title: "US Loan",
    desc: "Mortgage & personal loan payments in dollars.",
    icon: DollarSign,
    keywords: ["dollar", "mortgage", "interest", "payment", "usa", "loan"],
  },
  {
    to: "/units",
    title: "Units",
    desc: "All unit conversions in one place.",
    icon: Ruler,
    keywords: ["convert", "conversion", "measurement", "unit"],
  },
  {
    to: "/about",
    title: "About",
    desc: "Learn more about Utilikit.",
    icon: Calculator,
    keywords: ["about", "info", "utilikit"],
  },
  {
    to: "/faq",
    title: "FAQ",
    desc: "Frequently asked questions.",
    icon: Calculator,
    keywords: ["faq", "questions", "help"],
  },
  {
    to: "/contact",
    title: "Contact",
    desc: "Get in touch with us.",
    icon: Calculator,
    keywords: ["contact", "email", "support"],
  },
  {
    to: "/privacy",
    title: "Privacy",
    desc: "Privacy policy and data usage.",
    icon: Calculator,
    keywords: ["privacy", "policy", "data"],
  },
];
