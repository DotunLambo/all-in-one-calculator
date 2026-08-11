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
  | "Site Pages"
  | "Percentage & Fractions"
  | "Date & Time"
  | "Science & Engineering"
  | "Business & Accounting"
  | "Travel & Geography"
  | "Cooking & Baking"
  | "Construction & DIY"
  | "Education & Study"
  | "Tax & VAT"
  | "Savings & Investment"
  | "Retirement & Pension"
  | "Auto & Fuel"
  | "Home & Mortgage"
  | "Salary & Paycheck"
  | "Data & Digital Storage"
  | "Sports & Fitness Tracking"
  | "Shopping & Discounts";

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
  {
    name: "Percentage & Fractions",
    slug: "percentage-fractions",
    desc: "Work out percentages, discounts and fractions.",
    intro:
      "Solve everyday percentage problems — find a percentage of a number, work out increases and decreases, and convert between fractions, decimals and percentages.",
    metaTitle: "Percentage & Fraction Calculators — Utilikit",
    metaDescription:
      "Free percentage and fraction calculators: find a percentage of a number, calculate increases and decreases, and convert fractions to decimals and percentages.",
  },
  {
    name: "Date & Time",
    slug: "date-time",
    desc: "Count days, duration and time zones.",
    intro:
      "Plan ahead with date and time tools. Calculate the days between two dates, add or subtract time, and convert between time zones without a spreadsheet.",
    metaTitle: "Date & Time Calculators — Duration & Time Zone | Utilikit",
    metaDescription:
      "Free date and time calculators: count days between dates, add or subtract time spans, and convert between time zones. Quick, accurate and no sign-up.",
  },
  {
    name: "Science & Engineering",
    slug: "science-engineering",
    desc: "Physics, chemistry and engineering helpers.",
    intro:
      "Quick scientific conversions and formulas — speed, density, pressure, energy and more — for students, hobbyists and working engineers.",
    metaTitle: "Science & Engineering Calculators — Utilikit",
    metaDescription:
      "Free science and engineering calculators for speed, density, pressure, energy and common physics formulas. Built for students, hobbyists and engineers.",
  },
  {
    name: "Business & Accounting",
    slug: "business-accounting",
    desc: "Run the numbers for your business.",
    intro:
      "Stay on top of the numbers that move your business — margins, markups, break-even points and depreciation — with simple, reliable calculators.",
    metaTitle: "Business & Accounting Calculators — Margin & Break-Even | Utilikit",
    metaDescription:
      "Free business and accounting calculators: profit margin, markup, break-even point and depreciation. Run quick figures for your small business.",
  },
  {
    name: "Travel & Geography",
    slug: "travel-geography",
    desc: "Distances, fuel costs and time zones for trips.",
    intro:
      "Plan journeys with confidence. Estimate travel distances and fuel costs, convert speed and currency for trips abroad, and compare time zones at a glance.",
    metaTitle: "Travel & Geography Calculators — Distance & Fuel Cost | Utilikit",
    metaDescription:
      "Free travel calculators: estimate trip distance and fuel cost, convert speed and currency for travel, and compare time zones. Plan smarter trips.",
  },
  {
    name: "Cooking & Baking",
    slug: "cooking-baking",
    desc: "Scale recipes and convert kitchen units.",
    intro:
      "Cook and bake with precision. Scale recipes up or down, convert cups to grams and ounces, and switch oven temperatures between Celsius and Fahrenheit.",
    metaTitle: "Cooking & Baking Converters — Recipe & Kitchen Units | Utilikit",
    metaDescription:
      "Free cooking and baking converters: scale recipes, convert cups to grams and ounces, and switch oven temperatures between Celsius and Fahrenheit.",
  },
  {
    name: "Construction & DIY",
    slug: "construction-diy",
    desc: "Materials, area and spacing for builds.",
    intro:
      "Estimate materials and dimensions for any build. Work out area and volume, calculate paint, concrete and tile coverage, and space studs and rafters evenly.",
    metaTitle: "Construction & DIY Calculators — Area, Volume & Materials | Utilikit",
    metaDescription:
      "Free construction and DIY calculators: area, volume, paint, concrete and tile coverage, plus stud and rafter spacing for home builds and renovations.",
  },
  {
    name: "Education & Study",
    slug: "education-study",
    desc: "Grades, GPA and study planning tools.",
    intro:
      "Track your academic progress. Calculate weighted grades and GPA, estimate final exam scores, and plan study time across your subjects.",
    metaTitle: "Education & Study Calculators — GPA & Grade | Utilikit",
    metaDescription:
      "Free education calculators: weighted grades, GPA, final exam score estimates and study time planning. Built for students and teachers.",
  },
  {
    name: "Tax & VAT",
    slug: "tax-vat",
    desc: "Work out VAT, sales tax and income tax.",
    intro:
      "Get tax right every time. Add or remove VAT and sales tax, estimate take-home pay after income tax, and compare rates across regions.",
    metaTitle: "Tax & VAT Calculators — Sales Tax & Income Tax | Utilikit",
    metaDescription:
      "Free tax and VAT calculators: add or remove VAT and sales tax, estimate take-home pay after income tax, and compare tax rates across regions.",
  },
  {
    name: "Savings & Investment",
    slug: "savings-investment",
    desc: "Compound interest and returns.",
    intro:
      "Grow your money with clarity. See how compound interest builds over time, compare savings rates, and project investment returns before you commit.",
    metaTitle: "Savings & Investment Calculators — Compound Interest | Utilikit",
    metaDescription:
      "Free savings and investment calculators: compound interest, savings growth and projected returns. Compare rates and plan your financial goals.",
  },
  {
    name: "Retirement & Pension",
    slug: "retirement-pension",
    desc: "Plan for life after work.",
    intro:
      "Picture your retirement with real numbers. Estimate how much to save, project your pension pot, and see how long your savings could last.",
    metaTitle: "Retirement & Pension Calculators — Plan Your Future | Utilikit",
    metaDescription:
      "Free retirement and pension calculators: estimate retirement savings needs, project your pension pot, and see how long your savings may last.",
  },
  {
    name: "Auto & Fuel",
    slug: "auto-fuel",
    desc: "Fuel economy, mileage and car costs.",
    intro:
      "Understand what your car really costs. Calculate fuel economy and trip fuel costs, track mileage, and compare running costs between vehicles.",
    metaTitle: "Auto & Fuel Calculators — Fuel Economy & Trip Cost | Utilikit",
    metaDescription:
      "Free auto and fuel calculators: fuel economy, trip fuel cost, mileage tracking and vehicle running cost comparisons. Plan cheaper, smarter drives.",
  },
  {
    name: "Home & Mortgage",
    slug: "home-mortgage",
    desc: "Rent, mortgage and home running costs.",
    intro:
      "Make confident housing decisions. Compare mortgage rates, estimate rent affordability, and budget for utilities and home running costs.",
    metaTitle: "Home & Mortgage Calculators — Rent & Affordability | Utilikit",
    metaDescription:
      "Free home and mortgage calculators: compare mortgage rates, estimate rent affordability, and budget for utilities and home running costs.",
  },
  {
    name: "Salary & Paycheck",
    slug: "salary-paycheck",
    desc: "Net pay, hourly rate and raises.",
    intro:
      "Know exactly what you earn. Convert salary to hourly rate, estimate net pay after deductions, and see what a raise really means in your pocket.",
    metaTitle: "Salary & Paycheck Calculators — Net Pay & Hourly Rate | Utilikit",
    metaDescription:
      "Free salary and paycheck calculators: convert salary to hourly rate, estimate net pay after deductions, and calculate the real value of a raise.",
  },
  {
    name: "Data & Digital Storage",
    slug: "data-digital-storage",
    desc: "Bytes, bandwidth and file sizes.",
    intro:
      "Make sense of digital sizes and speeds. Convert between bytes, KB, MB, GB and TB, estimate download times, and compare bandwidth at a glance.",
    metaTitle: "Data & Digital Storage Converters — Bytes & Bandwidth | Utilikit",
    metaDescription:
      "Free digital storage and bandwidth converters: bytes, KB, MB, GB and TB, download time estimates and bandwidth comparisons. Quick and accurate.",
  },
  {
    name: "Sports & Fitness Tracking",
    slug: "sports-fitness-tracking",
    desc: "Pace, reps and training metrics.",
    intro:
      "Track training that adds up. Calculate running pace and splits, estimate calories burned, and set rep and target goals for smarter workouts.",
    metaTitle: "Sports & Fitness Tracking Calculators — Pace & Reps | Utilikit",
    metaDescription:
      "Free sports and fitness tracking calculators: running pace and splits, calories burned and rep targets. Plan smarter training sessions.",
  },
  {
    name: "Shopping & Discounts",
    slug: "shopping-discounts",
    desc: "Sale prices, coupons and bulk savings.",
    intro:
      "Shop smarter in seconds. Work out sale prices and discount percentages, compare bulk-buy and unit pricing, and see what a coupon really saves you.",
    metaTitle: "Shopping & Discount Calculators — Sale Price & Coupons | Utilikit",
    metaDescription:
      "Free shopping and discount calculators: sale prices, discount percentages, bulk-buy and unit price comparisons, and coupon savings. Shop smarter.",
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
