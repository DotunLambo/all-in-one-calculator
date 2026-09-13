import type { ToolSpec } from "./tool-specs";
import { n, s, f, num, sel } from "./tool-spec-kit";

/* ---------- Science & Engineering ---------- */
const science: ToolSpec[] = [
  {
    slug: "force-calculator",
    category: "Science & Engineering",
    title: "Force Calculator",
    desc: "Newton's second law, F = ma.",
    intro: "Multiply mass by acceleration to get force in newtons.",
    keywords: ["force", "newton", "mass", "acceleration", "physics"],
    fields: [num("m", "Mass", 10, "kg"), num("a", "Acceleration", 9.81, "m/s²")],
    compute: (v) => {
      const force = n(v, "m") * n(v, "a");
      return [
        { label: "Force", value: `${f(force, 3)} N`, primary: true },
        { label: "In kilonewtons", value: f(force / 1000, 4) },
      ];
    },
  },
  {
    slug: "kinetic-energy-calculator",
    category: "Science & Engineering",
    title: "Kinetic Energy Calculator",
    desc: "Energy of a moving object.",
    intro: "Half mass times velocity squared — the energy carried by motion.",
    keywords: ["kinetic energy", "joules", "velocity", "physics"],
    fields: [num("m", "Mass", 1200, "kg"), num("v", "Speed", 20, "m/s")],
    compute: (v) => {
      const ke = 0.5 * n(v, "m") * n(v, "v") ** 2;
      return [
        { label: "Kinetic energy", value: `${f(ke, 2)} J`, primary: true },
        { label: "In kilojoules", value: f(ke / 1000, 3) },
      ];
    },
  },
  {
    slug: "potential-energy-calculator",
    category: "Science & Engineering",
    title: "Potential Energy Calculator",
    desc: "Energy stored by height.",
    intro: "Gravitational potential energy from mass, gravity and height.",
    keywords: ["potential energy", "gravity", "height", "joules"],
    fields: [num("m", "Mass", 50, "kg"), num("h", "Height", 10, "m"), num("g", "Gravity", 9.81, "m/s²")],
    compute: (v) => {
      const pe = n(v, "m") * n(v, "g") * n(v, "h");
      return [
        { label: "Potential energy", value: `${f(pe, 2)} J`, primary: true },
        { label: "In kilojoules", value: f(pe / 1000, 3) },
      ];
    },
  },
  {
    slug: "speed-distance-time-calculator",
    category: "Science & Engineering",
    title: "Speed Distance Time Calculator",
    desc: "Solve for speed from distance and time.",
    intro: "Enter distance and time to get speed in several common units.",
    keywords: ["speed", "distance", "time", "velocity"],
    fields: [num("d", "Distance", 150, "km"), num("t", "Time", 2, "hrs")],
    compute: (v) => {
      const kmh = n(v, "d") / (n(v, "t") || 1);
      return [
        { label: "Speed", value: `${f(kmh, 2)} km/h`, primary: true },
        { label: "In m/s", value: f(kmh / 3.6, 2) },
        { label: "In mph", value: f(kmh / 1.60934, 2) },
      ];
    },
  },
  {
    slug: "pressure-calculator",
    category: "Science & Engineering",
    title: "Pressure Calculator",
    desc: "Force spread over an area.",
    intro: "Divide force by area to get pressure in pascals, kPa and bar.",
    keywords: ["pressure", "pascal", "force", "area", "bar"],
    fields: [num("force", "Force", 5000, "N"), num("area", "Area", 0.5, "m²")],
    compute: (v) => {
      const p = n(v, "force") / (n(v, "area") || 1);
      return [
        { label: "Pressure", value: `${f(p, 2)} Pa`, primary: true },
        { label: "In kPa", value: f(p / 1000, 3) },
        { label: "In bar", value: f(p / 100000, 5) },
      ];
    },
  },
  {
    slug: "electrical-power-calculator",
    category: "Science & Engineering",
    title: "Electrical Power Calculator",
    desc: "Watts from volts and amps.",
    intro: "Multiply voltage by current to get power, plus daily energy use.",
    keywords: ["power", "watts", "volts", "amps", "electricity"],
    fields: [num("v", "Voltage", 230, "V"), num("i", "Current", 5, "A"), num("hrs", "Hours per day", 4, "hrs")],
    compute: (v) => {
      const w = n(v, "v") * n(v, "i");
      return [
        { label: "Power", value: `${f(w, 2)} W`, primary: true },
        { label: "Daily energy", value: `${f((w * n(v, "hrs")) / 1000, 3)} kWh` },
        { label: "Monthly energy", value: `${f((w * n(v, "hrs") * 30) / 1000, 2)} kWh` },
      ];
    },
  },
  {
    slug: "resistance-calculator",
    category: "Science & Engineering",
    title: "Series and Parallel Resistance Calculator",
    desc: "Combine two resistors.",
    intro: "Get the total resistance of two resistors wired in series and in parallel.",
    keywords: ["resistance", "series", "parallel", "ohms", "resistor"],
    fields: [num("r1", "Resistor 1", 100, "Ω"), num("r2", "Resistor 2", 220, "Ω")],
    compute: (v) => {
      const r1 = n(v, "r1"), r2 = n(v, "r2");
      return [
        { label: "Series", value: `${f(r1 + r2, 3)} Ω`, primary: true },
        { label: "Parallel", value: `${f(r1 + r2 === 0 ? 0 : (r1 * r2) / (r1 + r2), 3)} Ω` },
      ];
    },
  },
  {
    slug: "wavelength-frequency-calculator",
    category: "Science & Engineering",
    title: "Wavelength and Frequency Calculator",
    desc: "Convert between wavelength and frequency.",
    intro: "Enter a frequency to get the wavelength of the wave travelling at light speed.",
    keywords: ["wavelength", "frequency", "wave", "hertz", "physics"],
    fields: [num("freq", "Frequency", 100, "MHz"), num("speed", "Wave speed", 299792458, "m/s")],
    compute: (v) => {
      const hz = n(v, "freq") * 1e6;
      const lambda = n(v, "speed") / (hz || 1);
      return [
        { label: "Wavelength", value: `${f(lambda, 4)} m`, primary: true },
        { label: "In centimetres", value: f(lambda * 100, 2) },
        { label: "Period", value: `${f(1 / (hz || 1), 12)} s` },
      ];
    },
  },
  {
    slug: "momentum-calculator",
    category: "Science & Engineering",
    title: "Momentum Calculator",
    desc: "Mass times velocity.",
    intro: "Calculate linear momentum and the impulse needed to stop the object.",
    keywords: ["momentum", "impulse", "mass", "velocity"],
    fields: [num("m", "Mass", 1500, "kg"), num("v", "Velocity", 25, "m/s"), num("t", "Stopping time", 3, "s")],
    compute: (v) => {
      const p = n(v, "m") * n(v, "v");
      return [
        { label: "Momentum", value: `${f(p, 2)} kg·m/s`, primary: true },
        { label: "Stopping force", value: `${f(p / (n(v, "t") || 1), 2)} N` },
      ];
    },
  },
  {
    slug: "acceleration-calculator",
    category: "Science & Engineering",
    title: "Acceleration Calculator",
    desc: "Change in speed over time.",
    intro: "Work out acceleration from starting speed, final speed and the time taken.",
    keywords: ["acceleration", "speed change", "physics", "m/s2"],
    fields: [num("u", "Start speed", 0, "m/s"), num("vf", "Final speed", 27.8, "m/s"), num("t", "Time", 8, "s")],
    compute: (v) => {
      const a = (n(v, "vf") - n(v, "u")) / (n(v, "t") || 1);
      return [
        { label: "Acceleration", value: `${f(a, 3)} m/s²`, primary: true },
        { label: "In g", value: f(a / 9.81, 3) },
        { label: "Distance covered", value: `${f(n(v, "u") * n(v, "t") + 0.5 * a * n(v, "t") ** 2, 2)} m` },
      ];
    },
  },
];

/* ---------- Business & Accounting ---------- */
const business: ToolSpec[] = [
  {
    slug: "gross-profit-calculator",
    category: "Business & Accounting",
    title: "Gross Profit Calculator",
    desc: "Revenue minus cost of goods.",
    intro: "See gross profit and gross margin from revenue and direct costs.",
    keywords: ["gross profit", "cogs", "margin", "revenue"],
    fields: [num("rev", "Revenue", 5000000), num("cogs", "Cost of goods sold", 3000000)],
    compute: (v) => {
      const gp = n(v, "rev") - n(v, "cogs");
      return [
        { label: "Gross profit", value: f(gp), primary: true },
        { label: "Gross margin", value: `${f(n(v, "rev") ? (gp / n(v, "rev")) * 100 : 0, 2)} %` },
      ];
    },
  },
  {
    slug: "net-profit-margin-calculator",
    category: "Business & Accounting",
    title: "Net Profit Margin Calculator",
    desc: "Profit left after every cost.",
    intro: "Subtract all expenses from revenue to find your true bottom-line margin.",
    keywords: ["net profit", "margin", "bottom line", "expenses"],
    fields: [num("rev", "Revenue", 5000000), num("costs", "Total costs", 4100000), num("tax", "Tax rate", 20, "%")],
    compute: (v) => {
      const pre = n(v, "rev") - n(v, "costs");
      const net = pre - Math.max(0, pre) * (n(v, "tax") / 100);
      return [
        { label: "Net profit", value: f(net), primary: true },
        { label: "Net margin", value: `${f(n(v, "rev") ? (net / n(v, "rev")) * 100 : 0, 2)} %` },
        { label: "Pre-tax profit", value: f(pre) },
      ];
    },
  },
  {
    slug: "sales-commission-calculator",
    category: "Business & Accounting",
    title: "Sales Commission Calculator",
    desc: "Commission earned on sales.",
    intro: "Work out commission on sales, including a base salary if you have one.",
    keywords: ["commission", "sales", "earnings", "bonus"],
    fields: [num("sales", "Sales value", 2000000), num("rate", "Commission rate", 5, "%"), num("base", "Base pay", 150000)],
    compute: (v) => {
      const c = (n(v, "sales") * n(v, "rate")) / 100;
      return [
        { label: "Commission", value: f(c), primary: true },
        { label: "Total earnings", value: f(c + n(v, "base")) },
      ];
    },
  },
  {
    slug: "inventory-turnover-calculator",
    category: "Business & Accounting",
    title: "Inventory Turnover Calculator",
    desc: "How fast stock sells.",
    intro: "Measure how many times you sell through your stock in a year.",
    keywords: ["inventory turnover", "stock", "days of inventory", "retail"],
    fields: [num("cogs", "Annual cost of goods sold", 12000000), num("stock", "Average inventory value", 2000000)],
    compute: (v) => {
      const turns = n(v, "cogs") / (n(v, "stock") || 1);
      return [
        { label: "Turnover", value: `${f(turns, 2)} times a year`, primary: true },
        { label: "Days of inventory", value: f(turns ? 365 / turns : 0, 1) },
      ];
    },
  },
  {
    slug: "customer-acquisition-cost-calculator",
    category: "Business & Accounting",
    title: "Customer Acquisition Cost Calculator",
    desc: "What each new customer costs.",
    intro: "Divide marketing and sales spend by new customers won to get your CAC.",
    keywords: ["cac", "customer acquisition cost", "marketing", "growth"],
    fields: [num("spend", "Marketing and sales spend", 1500000), num("customers", "New customers", 120), num("value", "Average order value", 25000)],
    compute: (v) => {
      const cac = n(v, "spend") / (n(v, "customers") || 1);
      return [
        { label: "Cost per customer", value: f(cac), primary: true },
        { label: "Orders to break even", value: f(n(v, "value") ? cac / n(v, "value") : 0, 2) },
      ];
    },
  },
  {
    slug: "customer-lifetime-value-calculator",
    category: "Business & Accounting",
    title: "Customer Lifetime Value Calculator",
    desc: "Total value of a customer.",
    intro: "Estimate how much a customer is worth across the whole relationship.",
    keywords: ["ltv", "lifetime value", "retention", "revenue"],
    fields: [num("value", "Average order value", 25000), num("freq", "Orders per year", 4), num("years", "Years retained", 3), num("margin", "Gross margin", 40, "%")],
    compute: (v) => {
      const rev = n(v, "value") * n(v, "freq") * n(v, "years");
      return [
        { label: "Lifetime value", value: f((rev * n(v, "margin")) / 100), primary: true },
        { label: "Lifetime revenue", value: f(rev) },
        { label: "Yearly revenue", value: f(n(v, "value") * n(v, "freq")) },
      ];
    },
  },
  {
    slug: "payback-period-calculator",
    category: "Business & Accounting",
    title: "Payback Period Calculator",
    desc: "How long an investment takes to repay itself.",
    intro: "Divide an upfront cost by the cash it brings in each period.",
    keywords: ["payback period", "investment", "cash flow", "roi"],
    fields: [num("cost", "Upfront cost", 3000000), num("cash", "Monthly net cash in", 250000)],
    compute: (v) => {
      const months = n(v, "cost") / (n(v, "cash") || 1);
      return [
        { label: "Payback period", value: `${f(months, 1)} months`, primary: true },
        { label: "In years", value: f(months / 12, 2) },
        { label: "First-year return", value: f(n(v, "cash") * 12 - n(v, "cost")) },
      ];
    },
  },
  {
    slug: "working-capital-calculator",
    category: "Business & Accounting",
    title: "Working Capital Calculator",
    desc: "Short-term financial health.",
    intro: "Current assets minus current liabilities, plus the current ratio.",
    keywords: ["working capital", "current ratio", "liquidity", "accounting"],
    fields: [num("assets", "Current assets", 4000000), num("liabilities", "Current liabilities", 2500000)],
    compute: (v) => {
      const wc = n(v, "assets") - n(v, "liabilities");
      return [
        { label: "Working capital", value: f(wc), primary: true },
        { label: "Current ratio", value: f(n(v, "assets") / (n(v, "liabilities") || 1), 2) },
        { label: "Health", value: wc > 0 ? "Positive" : "Negative" },
      ];
    },
  },
  {
    slug: "invoice-total-calculator",
    category: "Business & Accounting",
    title: "Invoice Total Calculator",
    desc: "Line total with discount and VAT.",
    intro: "Build an invoice line: quantity, rate, discount and tax in one go.",
    keywords: ["invoice", "vat", "discount", "billing"],
    fields: [num("qty", "Quantity", 10), num("rate", "Unit price", 15000), num("disc", "Discount", 5, "%"), num("vat", "VAT", 7.5, "%")],
    compute: (v) => {
      const sub = n(v, "qty") * n(v, "rate");
      const afterDisc = sub * (1 - n(v, "disc") / 100);
      const vat = (afterDisc * n(v, "vat")) / 100;
      return [
        { label: "Invoice total", value: f(afterDisc + vat), primary: true },
        { label: "Subtotal", value: f(sub) },
        { label: "VAT", value: f(vat) },
      ];
    },
  },
  {
    slug: "freelance-hourly-rate-calculator",
    category: "Business & Accounting",
    title: "Freelance Hourly Rate Calculator",
    desc: "The rate you need to charge.",
    intro: "Work back from your income target and billable hours to a fair hourly rate.",
    keywords: ["freelance rate", "hourly rate", "contractor", "pricing"],
    fields: [num("target", "Yearly income target", 12000000), num("expenses", "Yearly business costs", 1500000), num("hours", "Billable hours per week", 25), num("weeks", "Working weeks", 46)],
    compute: (v) => {
      const hours = Math.max(1, n(v, "hours") * n(v, "weeks"));
      const rate = (n(v, "target") + n(v, "expenses")) / hours;
      return [
        { label: "Hourly rate", value: f(rate), primary: true },
        { label: "Day rate (8 h)", value: f(rate * 8) },
        { label: "Billable hours a year", value: f(hours, 0) },
      ];
    },
  },
];

/* ---------- Travel & Geography ---------- */
const travel: ToolSpec[] = [
  {
    slug: "cost-per-person-calculator",
    category: "Travel & Geography",
    title: "Trip Cost Per Person Calculator",
    desc: "Split a trip between travellers.",
    intro: "Add up the trip costs and split them fairly between everyone going.",
    keywords: ["split cost", "trip", "per person", "group travel"],
    fields: [num("transport", "Transport", 180000), num("stay", "Accommodation", 240000), num("food", "Food and extras", 120000), num("people", "Travellers", 4)],
    compute: (v) => {
      const total = n(v, "transport") + n(v, "stay") + n(v, "food");
      const people = Math.max(1, Math.round(n(v, "people")));
      return [
        { label: "Each person pays", value: f(total / people), primary: true },
        { label: "Trip total", value: f(total) },
      ];
    },
  },
  {
    slug: "flight-time-estimator",
    category: "Travel & Geography",
    title: "Flight Time Estimator",
    desc: "Rough flight duration from distance.",
    intro: "Estimate flying time from distance and cruising speed, including taxi time.",
    keywords: ["flight time", "flying duration", "distance", "travel"],
    fields: [num("km", "Distance", 5000, "km"), num("speed", "Cruise speed", 850, "km/h"), num("extra", "Taxi and climb", 45, "min")],
    compute: (v) => {
      const mins = (n(v, "km") / (n(v, "speed") || 1)) * 60 + n(v, "extra");
      return [
        { label: "Estimated flight time", value: `${Math.floor(mins / 60)} h ${Math.round(mins % 60)} min`, primary: true },
        { label: "Airborne time", value: f(n(v, "km") / (n(v, "speed") || 1), 2) },
      ];
    },
  },
  {
    slug: "daily-travel-budget-calculator",
    category: "Travel & Geography",
    title: "Daily Travel Budget Calculator",
    desc: "What you can spend each day.",
    intro: "Turn a total travel budget into a realistic daily spending allowance.",
    keywords: ["travel budget", "daily spend", "holiday", "money"],
    fields: [num("budget", "Total budget", 900000), num("days", "Days away", 10), num("fixed", "Already paid (flights, hotel)", 500000)],
    compute: (v) => {
      const spendable = Math.max(0, n(v, "budget") - n(v, "fixed"));
      const days = Math.max(1, n(v, "days"));
      return [
        { label: "Daily allowance", value: f(spendable / days), primary: true },
        { label: "Spending money", value: f(spendable) },
        { label: "Weekly allowance", value: f((spendable / days) * 7) },
      ];
    },
  },
  {
    slug: "trip-budget-calculator",
    category: "Travel & Geography",
    title: "Trip Budget Planner",
    desc: "Build a full trip budget.",
    intro: "Add every category of trip spending and include a contingency buffer.",
    keywords: ["trip budget", "holiday planner", "travel cost", "contingency"],
    fields: [num("flights", "Flights", 400000), num("hotel", "Hotel per night", 45000), num("nights", "Nights", 7), num("daily", "Daily spend", 25000), num("buffer", "Contingency", 10, "%")],
    compute: (v) => {
      const base = n(v, "flights") + n(v, "hotel") * n(v, "nights") + n(v, "daily") * n(v, "nights");
      return [
        { label: "Total budget", value: f(base * (1 + n(v, "buffer") / 100)), primary: true },
        { label: "Before contingency", value: f(base) },
        { label: "Hotel total", value: f(n(v, "hotel") * n(v, "nights")) },
      ];
    },
  },
  {
    slug: "luggage-weight-checker",
    category: "Travel & Geography",
    title: "Luggage Weight Checker",
    desc: "Stay under the airline limit.",
    intro: "Compare your bag weight with the allowance and see any excess baggage cost.",
    keywords: ["luggage", "baggage allowance", "excess baggage", "airline"],
    fields: [num("weight", "Bag weight", 26, "kg"), num("limit", "Allowance", 23, "kg"), num("fee", "Excess fee per kg", 8000)],
    compute: (v) => {
      const over = Math.max(0, n(v, "weight") - n(v, "limit"));
      return [
        { label: "Over by", value: `${f(over, 1)} kg`, primary: true },
        { label: "Excess charge", value: f(over * n(v, "fee")) },
        { label: "In pounds", value: `${f(n(v, "weight") * 2.20462, 1)} lb` },
      ];
    },
  },
  {
    slug: "jet-lag-recovery-calculator",
    category: "Travel & Geography",
    title: "Jet Lag Recovery Calculator",
    desc: "How long to adjust after a flight.",
    intro: "A rough guide: about one day of recovery for each time zone crossed.",
    keywords: ["jet lag", "time zones", "recovery", "travel health"],
    fields: [num("zones", "Time zones crossed", 6), sel("dir", "Direction", ["Eastward", "Westward"])],
    compute: (v) => {
      const rate = s(v, "dir") === "Eastward" ? 1 : 0.7;
      const days = n(v, "zones") * rate;
      return [
        { label: "Recovery time", value: `${f(days, 1)} days`, primary: true },
        { label: "Direction effect", value: s(v, "dir") === "Eastward" ? "Harder to adjust" : "Easier to adjust" },
      ];
    },
  },
  {
    slug: "road-trip-planner",
    category: "Travel & Geography",
    title: "Road Trip Planner",
    desc: "Driving time with rest stops.",
    intro: "Plan a long drive including breaks and get the realistic arrival time.",
    keywords: ["road trip", "driving time", "rest stops", "journey"],
    fields: [num("km", "Distance", 750, "km"), num("speed", "Average speed", 80, "km/h"), num("stops", "Rest stops", 3), num("stopMin", "Minutes per stop", 20, "min")],
    compute: (v) => {
      const driveMin = (n(v, "km") / (n(v, "speed") || 1)) * 60;
      const total = driveMin + n(v, "stops") * n(v, "stopMin");
      return [
        { label: "Total journey", value: `${Math.floor(total / 60)} h ${Math.round(total % 60)} min`, primary: true },
        { label: "Driving time", value: `${Math.floor(driveMin / 60)} h ${Math.round(driveMin % 60)} min` },
        { label: "Break time", value: `${f(n(v, "stops") * n(v, "stopMin"), 0)} min` },
      ];
    },
  },
  {
    slug: "fuel-split-calculator",
    category: "Travel & Geography",
    title: "Fuel Cost Split Calculator",
    desc: "Share fuel costs between passengers.",
    intro: "Work out the fuel bill for a journey and split it between everyone in the car.",
    keywords: ["fuel split", "carpool", "share petrol", "commute"],
    fields: [num("km", "Distance", 400, "km"), num("consumption", "Consumption", 9, "L/100km"), num("price", "Fuel price", 950, "per L"), num("people", "People in car", 4)],
    compute: (v) => {
      const litres = (n(v, "km") * n(v, "consumption")) / 100;
      const cost = litres * n(v, "price");
      return [
        { label: "Each person pays", value: f(cost / Math.max(1, n(v, "people"))), primary: true },
        { label: "Total fuel cost", value: f(cost) },
        { label: "Litres used", value: f(litres, 2) },
      ];
    },
  },
  {
    slug: "hotel-cost-calculator",
    category: "Travel & Geography",
    title: "Hotel Cost Calculator",
    desc: "Total stay cost with tax.",
    intro: "Add up nightly rates, rooms, taxes and resort fees for the true stay cost.",
    keywords: ["hotel cost", "accommodation", "nightly rate", "tax"],
    fields: [num("rate", "Nightly rate", 60000), num("nights", "Nights", 5), num("rooms", "Rooms", 1), num("tax", "Tax and fees", 12, "%")],
    compute: (v) => {
      const base = n(v, "rate") * n(v, "nights") * Math.max(1, n(v, "rooms"));
      const tax = (base * n(v, "tax")) / 100;
      return [
        { label: "Total stay", value: f(base + tax), primary: true },
        { label: "Room charge", value: f(base) },
        { label: "Tax and fees", value: f(tax) },
      ];
    },
  },
  {
    slug: "mileage-reimbursement-calculator",
    category: "Travel & Geography",
    title: "Mileage Reimbursement Calculator",
    desc: "Claim back business travel.",
    intro: "Multiply business distance by your reimbursement rate to get your claim.",
    keywords: ["mileage claim", "reimbursement", "business travel", "expenses"],
    fields: [num("km", "Distance", 320, "km"), num("rate", "Rate per km", 150), num("trips", "Trips", 4)],
    compute: (v) => {
      const perTrip = n(v, "km") * n(v, "rate");
      return [
        { label: "Total claim", value: f(perTrip * Math.max(1, n(v, "trips"))), primary: true },
        { label: "Per trip", value: f(perTrip) },
        { label: "Total distance", value: `${f(n(v, "km") * n(v, "trips"), 0)} km` },
      ];
    },
  },
];

/* ---------- Cooking & Baking ---------- */
const cooking: ToolSpec[] = [
  {
    slug: "grams-to-cups",
    category: "Cooking & Baking",
    title: "Grams to Cups Converter",
    desc: "Weigh-to-volume for common ingredients.",
    intro: "Turn grams into cups for flour, sugar, butter, rice and more.",
    keywords: ["grams to cups", "baking conversion", "ingredients", "volume"],
    fields: [num("g", "Grams", 250, "g"), sel("ing", "Ingredient", ["Flour", "Sugar", "Butter", "Rice", "Milk", "Water"])],
    compute: (v) => {
      const perCup: Record<string, number> = { Flour: 120, Sugar: 200, Butter: 227, Rice: 185, Milk: 240, Water: 236 };
      const g = perCup[s(v, "ing")] ?? 120;
      return [
        { label: "Cups", value: f(n(v, "g") / g, 3), primary: true },
        { label: "Tablespoons", value: f((n(v, "g") / g) * 16, 1) },
        { label: "Grams per cup", value: f(g, 0) },
      ];
    },
  },
  {
    slug: "baking-pan-converter",
    category: "Cooking & Baking",
    title: "Baking Pan Size Converter",
    desc: "Scale a recipe to a different tin.",
    intro: "Swapping tins? Scale ingredient quantities by the change in pan area.",
    keywords: ["baking pan", "tin size", "scale recipe", "cake"],
    fields: [num("a1", "Original pan length", 20, "cm"), num("b1", "Original pan width", 20, "cm"), num("a2", "New pan length", 23, "cm"), num("b2", "New pan width", 23, "cm")],
    compute: (v) => {
      const ratio = (n(v, "a2") * n(v, "b2")) / (n(v, "a1") * n(v, "b1") || 1);
      return [
        { label: "Multiply ingredients by", value: f(ratio, 3), primary: true },
        { label: "Original area", value: `${f(n(v, "a1") * n(v, "b1"), 0)} cm²` },
        { label: "New area", value: `${f(n(v, "a2") * n(v, "b2"), 0)} cm²` },
      ];
    },
  },
  {
    slug: "yeast-converter",
    category: "Cooking & Baking",
    title: "Yeast Converter",
    desc: "Swap fresh, active dry and instant yeast.",
    intro: "Convert between yeast types so your dough still rises properly.",
    keywords: ["yeast", "fresh yeast", "instant yeast", "bread"],
    fields: [num("amount", "Amount", 10, "g"), sel("from", "From", ["Fresh", "Active dry", "Instant"], "Fresh"), sel("to", "To", ["Fresh", "Active dry", "Instant"], "Instant")],
    compute: (v) => {
      const factor: Record<string, number> = { Fresh: 1, "Active dry": 0.4, Instant: 0.33 };
      const out = (n(v, "amount") / (factor[s(v, "from")] ?? 1)) * (factor[s(v, "to")] ?? 1);
      return [
        { label: "Use", value: `${f(out, 2)} g ${s(v, "to").toLowerCase()} yeast`, primary: true },
        { label: "In teaspoons", value: f(out / 3, 2) },
      ];
    },
  },
  {
    slug: "cost-per-serving-calculator",
    category: "Cooking & Baking",
    title: "Cost Per Serving Calculator",
    desc: "What a home-cooked meal costs.",
    intro: "Add your ingredient costs and divide by servings to price a dish.",
    keywords: ["cost per serving", "meal cost", "recipe price", "food budget"],
    fields: [num("i1", "Ingredient cost 1", 2500), num("i2", "Ingredient cost 2", 1800), num("i3", "Ingredient cost 3", 900), num("servings", "Servings", 4)],
    compute: (v) => {
      const total = n(v, "i1") + n(v, "i2") + n(v, "i3");
      const per = total / Math.max(1, n(v, "servings"));
      return [
        { label: "Cost per serving", value: f(per), primary: true },
        { label: "Recipe total", value: f(total) },
        { label: "Weekly (7 servings)", value: f(per * 7) },
      ];
    },
  },
  {
    slug: "liquid-measure-converter",
    category: "Cooking & Baking",
    title: "Liquid Measure Converter",
    desc: "Millilitres, cups, pints and ounces.",
    intro: "Convert kitchen liquid measures between metric and US units.",
    keywords: ["liquid measure", "ml to cups", "fluid ounce", "pint"],
    fields: [num("value", "Value", 250), sel("from", "From", ["ml", "litre", "cup", "fl oz", "pint", "tbsp", "tsp"], "ml"), sel("to", "To", ["ml", "litre", "cup", "fl oz", "pint", "tbsp", "tsp"], "cup")],
    compute: (v) => {
      const ml: Record<string, number> = { ml: 1, litre: 1000, cup: 236.588, "fl oz": 29.5735, pint: 473.176, tbsp: 14.7868, tsp: 4.92892 };
      const out = (n(v, "value") * (ml[s(v, "from")] ?? 1)) / (ml[s(v, "to")] ?? 1);
      return [
        { label: "Result", value: `${f(out, 4)} ${s(v, "to")}`, primary: true },
        { label: "In millilitres", value: f(n(v, "value") * (ml[s(v, "from")] ?? 1), 2) },
      ];
    },
  },
  {
    slug: "roast-cooking-time-calculator",
    category: "Cooking & Baking",
    title: "Roast Cooking Time Calculator",
    desc: "Timing for meat by weight.",
    intro: "Get roasting times for chicken, beef, pork or lamb based on weight.",
    keywords: ["roast time", "cooking time", "meat", "oven"],
    fields: [num("kg", "Weight", 1.8, "kg"), sel("meat", "Meat", ["Chicken", "Beef (medium)", "Pork", "Lamb"]), num("rest", "Resting time", 15, "min")],
    compute: (v) => {
      const rates: Record<string, [number, number]> = { Chicken: [45, 20], "Beef (medium)": [25, 20], Pork: [35, 30], Lamb: [30, 25] };
      const [perKg, extra] = rates[s(v, "meat")] ?? [40, 20];
      const mins = n(v, "kg") * perKg + extra;
      return [
        { label: "Cooking time", value: `${Math.floor(mins / 60)} h ${Math.round(mins % 60)} min`, primary: true },
        { label: "Plus resting", value: `${f(mins + n(v, "rest"), 0)} min total` },
        { label: "Rate used", value: `${perKg} min per kg + ${extra} min` },
      ];
    },
  },
  {
    slug: "sugar-substitute-calculator",
    category: "Cooking & Baking",
    title: "Sugar Substitute Calculator",
    desc: "Swap sugar for honey, syrup or sweetener.",
    intro: "Replace sugar in a recipe with the right amount of your chosen sweetener.",
    keywords: ["sugar substitute", "honey", "maple syrup", "sweetener"],
    fields: [num("sugar", "Sugar in recipe", 200, "g"), sel("sub", "Substitute", ["Honey", "Maple syrup", "Agave", "Stevia", "Coconut sugar"])],
    compute: (v) => {
      const ratio: Record<string, number> = { Honey: 0.75, "Maple syrup": 0.75, Agave: 0.66, Stevia: 0.008, "Coconut sugar": 1 };
      const r = ratio[s(v, "sub")] ?? 1;
      const liquid = ["Honey", "Maple syrup", "Agave"].includes(s(v, "sub"));
      return [
        { label: "Use", value: `${f(n(v, "sugar") * r, 2)} g ${s(v, "sub").toLowerCase()}`, primary: true },
        { label: "Adjust liquid", value: liquid ? `Reduce other liquid by ${f(n(v, "sugar") * 0.2, 0)} ml` : "No change needed" },
      ];
    },
  },
  {
    slug: "dough-hydration-calculator",
    category: "Cooking & Baking",
    title: "Dough Hydration Calculator",
    desc: "Baker's percentages for bread.",
    intro: "Set your flour weight and hydration to get water, salt and yeast amounts.",
    keywords: ["hydration", "bakers percentage", "bread dough", "sourdough"],
    fields: [num("flour", "Flour", 1000, "g"), num("hydration", "Hydration", 70, "%"), num("salt", "Salt", 2, "%"), num("yeast", "Yeast", 1, "%")],
    compute: (v) => {
      const flour = n(v, "flour");
      const water = (flour * n(v, "hydration")) / 100;
      const salt = (flour * n(v, "salt")) / 100;
      const yeast = (flour * n(v, "yeast")) / 100;
      return [
        { label: "Water", value: `${f(water, 0)} g`, primary: true },
        { label: "Salt", value: `${f(salt, 1)} g` },
        { label: "Yeast", value: `${f(yeast, 1)} g` },
        { label: "Total dough", value: `${f(flour + water + salt + yeast, 0)} g` },
      ];
    },
  },
  {
    slug: "brine-salt-calculator",
    category: "Cooking & Baking",
    title: "Brine Salt Calculator",
    desc: "Salt and water for a perfect brine.",
    intro: "Work out how much salt to dissolve for a wet brine at any strength.",
    keywords: ["brine", "salt water", "curing", "turkey"],
    fields: [num("water", "Water", 4, "L"), num("strength", "Brine strength", 6, "%"), num("sugar", "Sugar", 2, "%")],
    compute: (v) => {
      const g = n(v, "water") * 1000;
      return [
        { label: "Salt needed", value: `${f((g * n(v, "strength")) / 100, 0)} g`, primary: true },
        { label: "Sugar needed", value: `${f((g * n(v, "sugar")) / 100, 0)} g` },
        { label: "Water", value: `${f(g, 0)} g` },
      ];
    },
  },
  {
    slug: "coffee-ratio-calculator",
    category: "Cooking & Baking",
    title: "Coffee Ratio Calculator",
    desc: "Coffee and water for any brew.",
    intro: "Pick a brew ratio and cup size to get the grams of coffee and water.",
    keywords: ["coffee ratio", "brew", "pour over", "grams of coffee"],
    fields: [num("water", "Water", 500, "ml"), num("ratio", "Water : coffee ratio", 16)],
    compute: (v) => {
      const coffee = n(v, "water") / (n(v, "ratio") || 1);
      return [
        { label: "Coffee needed", value: `${f(coffee, 1)} g`, primary: true },
        { label: "Tablespoons", value: f(coffee / 5.3, 1) },
        { label: "Cups (240 ml)", value: f(n(v, "water") / 240, 1) },
      ];
    },
  },
];

/* ---------- Construction & DIY ---------- */
const construction: ToolSpec[] = [
  {
    slug: "brick-calculator",
    category: "Construction & DIY",
    title: "Brick Calculator",
    desc: "Bricks needed for a wall.",
    intro: "Estimate the number of bricks for a wall area, including a waste allowance.",
    keywords: ["brick", "wall", "blocks", "building materials"],
    fields: [num("length", "Wall length", 10, "m"), num("height", "Wall height", 2.4, "m"), num("perM2", "Bricks per m²", 60), num("waste", "Waste", 10, "%")],
    compute: (v) => {
      const area = n(v, "length") * n(v, "height");
      const bricks = area * n(v, "perM2") * (1 + n(v, "waste") / 100);
      return [
        { label: "Bricks needed", value: f(Math.ceil(bricks), 0), primary: true },
        { label: "Wall area", value: `${f(area, 2)} m²` },
      ];
    },
  },
  {
    slug: "roof-pitch-calculator",
    category: "Construction & DIY",
    title: "Roof Pitch Calculator",
    desc: "Angle, slope and rafter length.",
    intro: "From rise and run, get the roof angle, pitch ratio and rafter length.",
    keywords: ["roof pitch", "rafter", "slope", "angle"],
    fields: [num("rise", "Rise", 2.5, "m"), num("run", "Run", 5, "m")],
    compute: (v) => {
      const rise = n(v, "rise"), run = n(v, "run") || 1;
      const angle = (Math.atan(rise / run) * 180) / Math.PI;
      return [
        { label: "Pitch angle", value: `${f(angle, 2)}°`, primary: true },
        { label: "Rafter length", value: `${f(Math.hypot(rise, run), 3)} m` },
        { label: "Slope", value: `${f((rise / run) * 100, 1)} %` },
      ];
    },
  },
  {
    slug: "plywood-sheets-calculator",
    category: "Construction & DIY",
    title: "Plywood Sheets Calculator",
    desc: "Sheets needed to cover an area.",
    intro: "Work out how many standard sheets cover a floor, wall or roof area.",
    keywords: ["plywood", "sheets", "board", "coverage"],
    fields: [num("length", "Area length", 6, "m"), num("width", "Area width", 4, "m"), num("sheetL", "Sheet length", 2.44, "m"), num("sheetW", "Sheet width", 1.22, "m"), num("waste", "Waste", 10, "%")],
    compute: (v) => {
      const area = n(v, "length") * n(v, "width");
      const sheet = n(v, "sheetL") * n(v, "sheetW") || 1;
      return [
        { label: "Sheets needed", value: f(Math.ceil((area / sheet) * (1 + n(v, "waste") / 100)), 0), primary: true },
        { label: "Area to cover", value: `${f(area, 2)} m²` },
        { label: "Sheet area", value: `${f(sheet, 2)} m²` },
      ];
    },
  },
  {
    slug: "fence-post-calculator",
    category: "Construction & DIY",
    title: "Fence Post Calculator",
    desc: "Posts and panels for a fence run.",
    intro: "Enter the fence length and post spacing to get posts, panels and rails.",
    keywords: ["fence", "posts", "panels", "spacing", "garden"],
    fields: [num("length", "Fence length", 30, "m"), num("spacing", "Post spacing", 2.4, "m"), num("rails", "Rails per panel", 2)],
    compute: (v) => {
      const panels = Math.ceil(n(v, "length") / (n(v, "spacing") || 1));
      return [
        { label: "Posts needed", value: f(panels + 1, 0), primary: true },
        { label: "Panels", value: f(panels, 0) },
        { label: "Rails", value: f(panels * n(v, "rails"), 0) },
      ];
    },
  },
  {
    slug: "gravel-calculator",
    category: "Construction & DIY",
    title: "Gravel Calculator",
    desc: "Tonnes of gravel for a driveway.",
    intro: "Estimate gravel volume and weight for a path, driveway or base layer.",
    keywords: ["gravel", "aggregate", "driveway", "tonnes"],
    fields: [num("length", "Length", 10, "m"), num("width", "Width", 3, "m"), num("depth", "Depth", 50, "mm"), num("density", "Density", 1.6, "t/m³")],
    compute: (v) => {
      const vol = n(v, "length") * n(v, "width") * (n(v, "depth") / 1000);
      return [
        { label: "Gravel needed", value: `${f(vol * n(v, "density"), 2)} tonnes`, primary: true },
        { label: "Volume", value: `${f(vol, 3)} m³` },
        { label: "Bulk bags (0.85 t)", value: f(Math.ceil((vol * n(v, "density")) / 0.85), 0) },
      ];
    },
  },
  {
    slug: "mortar-calculator",
    category: "Construction & DIY",
    title: "Mortar Calculator",
    desc: "Cement and sand for bricklaying.",
    intro: "Estimate mortar volume for a brick or block wall and the cement and sand split.",
    keywords: ["mortar", "cement", "sand", "bricklaying", "mix"],
    fields: [num("bricks", "Number of bricks", 1500), num("perBrick", "Mortar per brick", 0.0008, "m³"), num("ratio", "Cement : sand", 5)],
    compute: (v) => {
      const vol = n(v, "bricks") * n(v, "perBrick");
      const parts = 1 + n(v, "ratio");
      return [
        { label: "Mortar volume", value: `${f(vol, 3)} m³`, primary: true },
        { label: "Cement", value: `${f((vol / parts) * 1440, 0)} kg` },
        { label: "Sand", value: `${f((vol * n(v, "ratio")) / parts, 3)} m³` },
      ];
    },
  },
  {
    slug: "drywall-calculator",
    category: "Construction & DIY",
    title: "Drywall Sheet Calculator",
    desc: "Plasterboard sheets and screws.",
    intro: "Count the plasterboard sheets, screws and joint tape a room needs.",
    keywords: ["drywall", "plasterboard", "sheets", "screws"],
    fields: [num("perimeter", "Room perimeter", 20, "m"), num("height", "Wall height", 2.7, "m"), num("sheetArea", "Sheet area", 2.88, "m²"), num("waste", "Waste", 10, "%")],
    compute: (v) => {
      const area = n(v, "perimeter") * n(v, "height");
      const sheets = Math.ceil((area / (n(v, "sheetArea") || 1)) * (1 + n(v, "waste") / 100));
      return [
        { label: "Sheets needed", value: f(sheets, 0), primary: true },
        { label: "Wall area", value: `${f(area, 2)} m²` },
        { label: "Screws (approx)", value: f(sheets * 36, 0) },
      ];
    },
  },
  {
    slug: "stair-calculator",
    category: "Construction & DIY",
    title: "Staircase Calculator",
    desc: "Risers, treads and stair angle.",
    intro: "Work out comfortable riser and tread sizes for a staircase.",
    keywords: ["stairs", "riser", "tread", "staircase", "steps"],
    fields: [num("rise", "Total rise", 2.7, "m"), num("riser", "Target riser", 180, "mm"), num("tread", "Tread depth", 250, "mm")],
    compute: (v) => {
      const steps = Math.max(1, Math.round((n(v, "rise") * 1000) / (n(v, "riser") || 1)));
      const actualRiser = (n(v, "rise") * 1000) / steps;
      const run = (steps - 1) * n(v, "tread");
      return [
        { label: "Number of steps", value: f(steps, 0), primary: true },
        { label: "Actual riser", value: `${f(actualRiser, 1)} mm` },
        { label: "Total going", value: `${f(run / 1000, 2)} m` },
        { label: "Stair angle", value: `${f((Math.atan(actualRiser / n(v, "tread")) * 180) / Math.PI, 1)}°` },
      ];
    },
  },
  {
    slug: "wallpaper-calculator",
    category: "Construction & DIY",
    title: "Wallpaper Calculator",
    desc: "Rolls needed for a room.",
    intro: "Count wallpaper rolls from room perimeter, wall height and roll size.",
    keywords: ["wallpaper", "rolls", "decorating", "room"],
    fields: [num("perimeter", "Room perimeter", 18, "m"), num("height", "Wall height", 2.6, "m"), num("rollLength", "Roll length", 10, "m"), num("rollWidth", "Roll width", 0.53, "m")],
    compute: (v) => {
      const stripsPerRoll = Math.floor(n(v, "rollLength") / (n(v, "height") || 1));
      const strips = Math.ceil(n(v, "perimeter") / (n(v, "rollWidth") || 1));
      return [
        { label: "Rolls needed", value: f(Math.ceil(strips / Math.max(1, stripsPerRoll)), 0), primary: true },
        { label: "Strips required", value: f(strips, 0) },
        { label: "Strips per roll", value: f(stripsPerRoll, 0) },
      ];
    },
  },
  {
    slug: "decking-boards-calculator",
    category: "Construction & DIY",
    title: "Decking Boards Calculator",
    desc: "Boards for a deck area.",
    intro: "Estimate decking boards and fixings for a patio or deck.",
    keywords: ["decking", "boards", "patio", "timber"],
    fields: [num("length", "Deck length", 5, "m"), num("width", "Deck width", 4, "m"), num("boardWidth", "Board width", 0.14, "m"), num("gap", "Gap", 0.005, "m")],
    compute: (v) => {
      const per = n(v, "boardWidth") + n(v, "gap") || 1;
      const rows = Math.ceil(n(v, "width") / per);
      return [
        { label: "Board rows", value: f(rows, 0), primary: true },
        { label: "Total board length", value: `${f(rows * n(v, "length"), 1)} m` },
        { label: "Deck area", value: `${f(n(v, "length") * n(v, "width"), 2)} m²` },
      ];
    },
  },
];

export const EXTRA_SPECS_2: ToolSpec[] = [...science, ...business, ...travel, ...cooking, ...construction];
