import type { ToolSpec, Field, Result } from "./tool-specs";
import { n, s, f, num, sel, dat, pmt, parseDate, DAY, conv } from "./tool-spec-kit";

const T = (
  slug: string,
  category: ToolSpec["category"],
  title: string,
  desc: string,
  intro: string,
  keywords: string[],
  fields: Field[],
  compute: (v: Record<string, string>) => Result[],
): ToolSpec => ({ slug, category, title, desc, intro, keywords, fields, compute });

const money = (x: number, cur = "") => `${cur}${f(x, 2)}`;

/* ---------- Education & Study ---------- */
const education: ToolSpec[] = [
  T("cgpa-to-percentage", "Education & Study", "CGPA to Percentage Converter", "Turn a CGPA into a percentage.",
    "Convert a cumulative grade point average into an approximate percentage using your institution's scale.",
    ["cgpa", "percentage", "grade point", "university"],
    [num("cgpa", "CGPA", 3.6), num("scale", "Scale (max GPA)", 5)],
    (v) => {
      const pct = (n(v, "cgpa") / (n(v, "scale") || 1)) * 100;
      return [
        { label: "Percentage", value: `${f(pct, 2)}%`, primary: true },
        { label: "Fraction of scale", value: `${f(n(v, "cgpa"), 2)} / ${f(n(v, "scale"), 2)}` },
      ];
    }),
  T("percentage-to-cgpa", "Education & Study", "Percentage to CGPA Converter", "Turn a percentage into a CGPA.",
    "Convert an overall percentage score back into a grade point average on your chosen scale.",
    ["percentage", "cgpa", "gpa", "convert"],
    [num("pct", "Percentage", 72, "%"), num("scale", "Scale (max GPA)", 5)],
    (v) => {
      const gpa = (n(v, "pct") / 100) * n(v, "scale");
      return [{ label: "CGPA", value: f(gpa, 2), primary: true }, { label: "Scale", value: f(n(v, "scale"), 2) }];
    }),
  T("exam-score-needed", "Education & Study", "Exam Score Needed Calculator", "Find the exam mark you need.",
    "Work out the score you need in a remaining exam to reach your target overall grade.",
    ["exam", "target grade", "score needed", "final"],
    [num("current", "Current average", 65, "%"), num("weight", "Exam weight", 40, "%"), num("target", "Target overall", 70, "%")],
    (v) => {
      const w = n(v, "weight") / 100;
      const need = w === 0 ? 0 : (n(v, "target") - n(v, "current") * (1 - w)) / w;
      return [
        { label: "Score needed", value: `${f(need, 1)}%`, primary: true },
        { label: "Achievable", value: need <= 100 ? "Yes" : "Not possible" },
      ];
    }),
  T("class-attendance-calculator", "Education & Study", "Class Attendance Calculator", "Check your attendance percentage.",
    "See what percentage of classes you have attended and how many more you must attend to hit a minimum.",
    ["attendance", "classes", "percentage", "minimum"],
    [num("attended", "Classes attended", 34), num("total", "Classes held", 40), num("min", "Required minimum", 75, "%")],
    (v) => {
      const a = n(v, "attended"), t = n(v, "total"), m = n(v, "min") / 100;
      const pct = t ? (a / t) * 100 : 0;
      const extra = m >= 1 ? Infinity : Math.max(0, Math.ceil((m * t - a) / (1 - m)));
      return [
        { label: "Attendance", value: `${f(pct, 1)}%`, primary: true },
        { label: "Status", value: pct >= n(v, "min") ? "Above minimum" : "Below minimum" },
        { label: "Classes to attend in a row", value: Number.isFinite(extra) ? String(extra) : "—" },
      ];
    }),
  T("reading-time-calculator", "Education & Study", "Reading Time Calculator", "Estimate time to read a text.",
    "Estimate how long a chapter, article or textbook will take at your reading speed.",
    ["reading", "words per minute", "study", "time"],
    [num("words", "Word count", 9000), num("wpm", "Reading speed", 220, "wpm")],
    (v) => {
      const mins = n(v, "words") / (n(v, "wpm") || 1);
      return [
        { label: "Reading time", value: `${f(mins, 0)} min`, primary: true },
        { label: "Hours", value: f(mins / 60, 2) },
      ];
    }),
  T("study-break-planner", "Education & Study", "Study Break Planner", "Split study time into focus blocks.",
    "Break a study session into focused blocks with breaks, Pomodoro style, and see how much real study time you get.",
    ["pomodoro", "study", "break", "focus"],
    [num("session", "Session length", 180, "min"), num("focus", "Focus block", 25, "min"), num("brk", "Break", 5, "min")],
    (v) => {
      const cycle = n(v, "focus") + n(v, "brk");
      const blocks = cycle ? Math.floor(n(v, "session") / cycle) : 0;
      return [
        { label: "Focus blocks", value: String(blocks), primary: true },
        { label: "Total focus time", value: `${f(blocks * n(v, "focus"), 0)} min` },
        { label: "Total break time", value: `${f(blocks * n(v, "brk"), 0)} min` },
      ];
    }),
  T("test-grade-calculator", "Education & Study", "Test Grade Calculator", "Marks to percentage and letter grade.",
    "Turn raw marks into a percentage and a letter grade using a standard grading scale.",
    ["test", "grade", "marks", "letter grade"],
    [num("score", "Marks scored", 47), num("total", "Total marks", 60)],
    (v) => {
      const pct = n(v, "total") ? (n(v, "score") / n(v, "total")) * 100 : 0;
      const letter = pct >= 90 ? "A" : pct >= 80 ? "B" : pct >= 70 ? "C" : pct >= 60 ? "D" : pct >= 50 ? "E" : "F";
      return [
        { label: "Percentage", value: `${f(pct, 1)}%`, primary: true },
        { label: "Letter grade", value: letter },
      ];
    }),
  T("semester-gpa-planner", "Education & Study", "Semester GPA Planner", "GPA needed next semester.",
    "Find the GPA you need this semester to reach your target cumulative GPA.",
    ["gpa", "semester", "target", "planner"],
    [num("cgpa", "Current CGPA", 3.2), num("done", "Credits completed", 60), num("new", "Credits this semester", 18), num("target", "Target CGPA", 3.5)],
    (v) => {
      const done = n(v, "done"), nw = n(v, "new");
      const need = nw ? (n(v, "target") * (done + nw) - n(v, "cgpa") * done) / nw : 0;
      return [
        { label: "GPA needed", value: f(need, 2), primary: true },
        { label: "Realistic?", value: need <= 5 ? "Yes" : "Very hard" },
      ];
    }),
  T("essay-word-count-planner", "Education & Study", "Essay Word Count Planner", "Split an essay into sections.",
    "Divide an essay word budget across introduction, body paragraphs and conclusion.",
    ["essay", "word count", "writing", "plan"],
    [num("words", "Total words", 2000), num("body", "Body paragraphs", 4), num("intro", "Intro & conclusion share", 20, "%")],
    (v) => {
      const share = n(v, "intro") / 100;
      const ends = n(v, "words") * share;
      const bodyWords = n(v, "words") - ends;
      const per = n(v, "body") ? bodyWords / n(v, "body") : 0;
      return [
        { label: "Words per body paragraph", value: f(per, 0), primary: true },
        { label: "Intro + conclusion", value: f(ends, 0) },
        { label: "Body total", value: f(bodyWords, 0) },
      ];
    }),
  T("tuition-savings-plan", "Education & Study", "Tuition Savings Plan", "Save up for school fees.",
    "Work out the monthly amount to save so tuition is fully funded by the time it is due.",
    ["tuition", "school fees", "savings", "plan"],
    [num("fees", "Total fees needed", 1200000), num("saved", "Already saved", 200000), num("months", "Months until due", 18), num("rate", "Interest rate", 6, "%/yr")],
    (v) => {
      const r = n(v, "rate") / 100 / 12, m = n(v, "months");
      const future = n(v, "saved") * Math.pow(1 + r, m);
      const gap = Math.max(0, n(v, "fees") - future);
      const monthly = r === 0 ? gap / (m || 1) : (gap * r) / (Math.pow(1 + r, m) - 1);
      return [
        { label: "Save per month", value: money(monthly), primary: true },
        { label: "Shortfall to cover", value: money(gap) },
      ];
    }),
];

/* ---------- Tax & VAT ---------- */
const tax: ToolSpec[] = [
  T("vat-return-calculator", "Tax & VAT", "VAT Return Calculator", "Net VAT payable or reclaimable.",
    "Compare VAT charged on sales with VAT paid on purchases to see what you owe or can reclaim.",
    ["vat return", "input vat", "output vat", "reclaim"],
    [num("sales", "Sales (VAT exclusive)", 500000), num("purchases", "Purchases (VAT exclusive)", 300000), num("rate", "VAT rate", 7.5, "%")],
    (v) => {
      const r = n(v, "rate") / 100;
      const out = n(v, "sales") * r, inp = n(v, "purchases") * r;
      const net = out - inp;
      return [
        { label: net >= 0 ? "VAT payable" : "VAT reclaimable", value: money(Math.abs(net)), primary: true },
        { label: "Output VAT", value: money(out) },
        { label: "Input VAT", value: money(inp) },
      ];
    }),
  T("withholding-tax-calculator", "Tax & VAT", "Withholding Tax Calculator", "Deduct WHT from an invoice.",
    "Apply a withholding tax rate to an invoice and see the amount deducted and the net payment.",
    ["withholding tax", "wht", "invoice", "deduction"],
    [num("amount", "Invoice amount", 250000), num("rate", "WHT rate", 5, "%")],
    (v) => {
      const t = n(v, "amount") * n(v, "rate") / 100;
      return [
        { label: "Net payment", value: money(n(v, "amount") - t), primary: true },
        { label: "Tax withheld", value: money(t) },
      ];
    }),
  T("capital-gains-tax-calculator", "Tax & VAT", "Capital Gains Tax Calculator", "Tax on an asset sale.",
    "Work out the gain on an asset sale after costs and estimate the capital gains tax due.",
    ["capital gains", "cgt", "asset", "sale"],
    [num("sale", "Sale price", 5000000), num("cost", "Purchase price", 3500000), num("expenses", "Selling costs", 150000), num("rate", "CGT rate", 10, "%")],
    (v) => {
      const gain = Math.max(0, n(v, "sale") - n(v, "cost") - n(v, "expenses"));
      const t = gain * n(v, "rate") / 100;
      return [
        { label: "Tax due", value: money(t), primary: true },
        { label: "Chargeable gain", value: money(gain) },
        { label: "Net proceeds", value: money(n(v, "sale") - n(v, "expenses") - t) },
      ];
    }),
  T("self-employed-tax-estimator", "Tax & VAT", "Self-Employed Tax Estimator", "Tax on freelance profit.",
    "Estimate tax on self-employed profit after allowable expenses and a personal allowance.",
    ["self employed", "freelance", "tax", "profit"],
    [num("income", "Gross income", 6000000), num("expenses", "Allowable expenses", 1200000), num("allowance", "Tax-free allowance", 800000), num("rate", "Effective tax rate", 18, "%")],
    (v) => {
      const taxable = Math.max(0, n(v, "income") - n(v, "expenses") - n(v, "allowance"));
      const t = taxable * n(v, "rate") / 100;
      return [
        { label: "Estimated tax", value: money(t), primary: true },
        { label: "Taxable profit", value: money(taxable) },
        { label: "After-tax income", value: money(n(v, "income") - n(v, "expenses") - t) },
      ];
    }),
  T("vat-inclusive-price-builder", "Tax & VAT", "VAT Inclusive Price Builder", "Set a price that includes VAT.",
    "Start from the margin you want to keep and build a shelf price that already includes VAT.",
    ["vat inclusive", "shelf price", "margin", "pricing"],
    [num("cost", "Unit cost", 1200), num("margin", "Target margin", 30, "%"), num("rate", "VAT rate", 7.5, "%")],
    (v) => {
      const m = n(v, "margin") / 100;
      const net = m >= 1 ? 0 : n(v, "cost") / (1 - m);
      const gross = net * (1 + n(v, "rate") / 100);
      return [
        { label: "Price incl. VAT", value: money(gross), primary: true },
        { label: "Price excl. VAT", value: money(net) },
        { label: "VAT amount", value: money(gross - net) },
      ];
    }),
  T("payroll-tax-calculator", "Tax & VAT", "Payroll Tax Calculator", "Employer and employee deductions.",
    "Estimate payroll deductions and the total employment cost from a gross salary.",
    ["payroll", "paye", "employer cost", "deductions"],
    [num("gross", "Gross monthly salary", 450000), num("employee", "Employee rate", 18, "%"), num("employer", "Employer rate", 10, "%")],
    (v) => {
      const e = n(v, "gross") * n(v, "employee") / 100;
      const er = n(v, "gross") * n(v, "employer") / 100;
      return [
        { label: "Employee take-home", value: money(n(v, "gross") - e), primary: true },
        { label: "Employee deduction", value: money(e) },
        { label: "Total employer cost", value: money(n(v, "gross") + er) },
      ];
    }),
  T("customs-duty-calculator", "Tax & VAT", "Customs Duty Calculator", "Import duty and landed cost.",
    "Add duty, levies and VAT to an imported shipment to see the true landed cost.",
    ["customs", "import duty", "landed cost", "shipping"],
    [num("value", "Goods value", 1000000), num("freight", "Freight & insurance", 150000), num("duty", "Duty rate", 20, "%"), num("vat", "VAT rate", 7.5, "%")],
    (v) => {
      const cif = n(v, "value") + n(v, "freight");
      const duty = cif * n(v, "duty") / 100;
      const vat = (cif + duty) * n(v, "vat") / 100;
      return [
        { label: "Landed cost", value: money(cif + duty + vat), primary: true },
        { label: "Duty", value: money(duty) },
        { label: "VAT", value: money(vat) },
      ];
    }),
  T("tax-refund-estimator", "Tax & VAT", "Tax Refund Estimator", "Overpaid tax you may get back.",
    "Compare tax already deducted with the tax actually due to estimate a refund or balance owed.",
    ["tax refund", "overpaid", "rebate", "balance"],
    [num("paid", "Tax already paid", 520000), num("due", "Tax actually due", 445000)],
    (v) => {
      const diff = n(v, "paid") - n(v, "due");
      return [
        { label: diff >= 0 ? "Refund due" : "Extra tax owed", value: money(Math.abs(diff)), primary: true },
        { label: "Tax paid", value: money(n(v, "paid")) },
      ];
    }),
  T("marginal-tax-rate-calculator", "Tax & VAT", "Marginal Tax Rate Calculator", "Tax on your next naira earned.",
    "See your effective rate and how much of an extra amount earned is lost to tax at the margin.",
    ["marginal rate", "effective rate", "bracket", "tax"],
    [num("income", "Annual income", 8000000), num("tax", "Total tax paid", 1400000), num("extra", "Extra income", 500000), num("bracket", "Top bracket rate", 24, "%")],
    (v) => {
      const eff = n(v, "income") ? (n(v, "tax") / n(v, "income")) * 100 : 0;
      const keep = n(v, "extra") * (1 - n(v, "bracket") / 100);
      return [
        { label: "You keep from extra income", value: money(keep), primary: true },
        { label: "Effective tax rate", value: `${f(eff, 1)}%` },
        { label: "Marginal rate", value: `${f(n(v, "bracket"), 1)}%` },
      ];
    }),
  T("quarterly-tax-savings", "Tax & VAT", "Quarterly Tax Savings Calculator", "Set aside tax each quarter.",
    "Work out how much of each payment to set aside so quarterly tax bills never catch you out.",
    ["quarterly tax", "set aside", "estimated tax", "freelancer"],
    [num("revenue", "Quarterly revenue", 2400000), num("expenses", "Quarterly expenses", 600000), num("rate", "Tax rate", 20, "%")],
    (v) => {
      const profit = Math.max(0, n(v, "revenue") - n(v, "expenses"));
      const t = profit * n(v, "rate") / 100;
      return [
        { label: "Set aside this quarter", value: money(t), primary: true },
        { label: "Per month", value: money(t / 3) },
        { label: "Profit after tax", value: money(profit - t) },
      ];
    }),
];

/* ---------- Savings & Investment ---------- */
const savings: ToolSpec[] = [
  T("sip-calculator", "Savings & Investment", "SIP Calculator", "Growth of monthly investments.",
    "See what a fixed monthly investment could grow to, and how much of it is contributions versus returns.",
    ["sip", "monthly investment", "mutual fund", "growth"],
    [num("monthly", "Monthly investment", 50000), num("rate", "Expected return", 12, "%/yr"), num("years", "Years", 10)],
    (v) => {
      const r = n(v, "rate") / 100 / 12, m = n(v, "years") * 12;
      const fv = r === 0 ? n(v, "monthly") * m : n(v, "monthly") * ((Math.pow(1 + r, m) - 1) / r) * (1 + r);
      const invested = n(v, "monthly") * m;
      return [
        { label: "Future value", value: money(fv), primary: true },
        { label: "Total invested", value: money(invested) },
        { label: "Returns earned", value: money(fv - invested) },
      ];
    }),
  T("dividend-yield-calculator", "Savings & Investment", "Dividend Yield Calculator", "Yield and annual dividend income.",
    "Work out dividend yield from a share price and payout, plus the annual income from your holding.",
    ["dividend", "yield", "shares", "income"],
    [num("price", "Share price", 45), num("dividend", "Annual dividend per share", 3.2), num("shares", "Shares held", 1000)],
    (v) => {
      const y = n(v, "price") ? (n(v, "dividend") / n(v, "price")) * 100 : 0;
      return [
        { label: "Dividend yield", value: `${f(y, 2)}%`, primary: true },
        { label: "Annual income", value: money(n(v, "dividend") * n(v, "shares")) },
      ];
    }),
  T("investment-fee-impact", "Savings & Investment", "Investment Fee Impact Calculator", "What fees cost you long term.",
    "Compare a portfolio with and without annual fees to see how much charges eat into your returns.",
    ["fees", "expense ratio", "investment", "cost"],
    [num("amount", "Initial investment", 2000000), num("rate", "Gross return", 10, "%/yr"), num("fee", "Annual fee", 1.5, "%"), num("years", "Years", 20)],
    (v) => {
      const y = n(v, "years");
      const gross = n(v, "amount") * Math.pow(1 + n(v, "rate") / 100, y);
      const net = n(v, "amount") * Math.pow(1 + (n(v, "rate") - n(v, "fee")) / 100, y);
      return [
        { label: "Lost to fees", value: money(gross - net), primary: true },
        { label: "Value without fees", value: money(gross) },
        { label: "Value after fees", value: money(net) },
      ];
    }),
  T("bond-yield-calculator", "Savings & Investment", "Bond Yield Calculator", "Current yield on a bond.",
    "Calculate current yield and annual coupon income from a bond's face value, coupon rate and market price.",
    ["bond", "yield", "coupon", "fixed income"],
    [num("face", "Face value", 100000), num("coupon", "Coupon rate", 13, "%"), num("price", "Market price", 94000)],
    (v) => {
      const c = n(v, "face") * n(v, "coupon") / 100;
      const y = n(v, "price") ? (c / n(v, "price")) * 100 : 0;
      return [
        { label: "Current yield", value: `${f(y, 2)}%`, primary: true },
        { label: "Annual coupon", value: money(c) },
      ];
    }),
  T("dollar-cost-averaging", "Savings & Investment", "Dollar Cost Averaging Calculator", "Average buy price over time.",
    "Buy the same amount at different prices and see your average cost per unit versus the simple average price.",
    ["dollar cost averaging", "dca", "average price", "investing"],
    [num("amount", "Amount per purchase", 100000), num("p1", "Price 1", 50), num("p2", "Price 2", 40), num("p3", "Price 3", 62), num("p4", "Price 4", 55)],
    (v) => {
      const prices = ["p1", "p2", "p3", "p4"].map((k) => n(v, k)).filter((p) => p > 0);
      const units = prices.reduce((a, p) => a + n(v, "amount") / p, 0);
      const spent = n(v, "amount") * prices.length;
      const avgSimple = prices.reduce((a, b) => a + b, 0) / (prices.length || 1);
      return [
        { label: "Average cost per unit", value: f(units ? spent / units : 0, 2), primary: true },
        { label: "Units bought", value: f(units, 4) },
        { label: "Simple average price", value: f(avgSimple, 2) },
      ];
    }),
  T("real-return-calculator", "Savings & Investment", "Real Return Calculator", "Returns after inflation.",
    "Adjust a nominal investment return for inflation to see what you actually gained in buying power.",
    ["real return", "inflation adjusted", "purchasing power", "investment"],
    [num("nominal", "Nominal return", 14, "%"), num("inflation", "Inflation rate", 22, "%")],
    (v) => {
      const real = ((1 + n(v, "nominal") / 100) / (1 + n(v, "inflation") / 100) - 1) * 100;
      return [
        { label: "Real return", value: `${f(real, 2)}%`, primary: true },
        { label: "Verdict", value: real >= 0 ? "Beating inflation" : "Losing buying power" },
      ];
    }),
  T("portfolio-rebalance-calculator", "Savings & Investment", "Portfolio Rebalance Calculator", "Trade amounts to hit targets.",
    "Compare your current split between two assets with your target split and see what to buy or sell.",
    ["rebalance", "portfolio", "allocation", "asset mix"],
    [num("a", "Asset A value", 700000), num("b", "Asset B value", 300000), num("target", "Target for Asset A", 60, "%")],
    (v) => {
      const total = n(v, "a") + n(v, "b");
      const want = total * n(v, "target") / 100;
      const diff = want - n(v, "a");
      return [
        { label: diff >= 0 ? "Buy Asset A" : "Sell Asset A", value: money(Math.abs(diff)), primary: true },
        { label: "Current A weight", value: `${f(total ? (n(v, "a") / total) * 100 : 0, 1)}%` },
        { label: "Portfolio total", value: money(total) },
      ];
    }),
  T("break-even-investment-calculator", "Savings & Investment", "Break-Even Investment Calculator", "Gain needed to recover a loss.",
    "After a loss, see the percentage gain required just to get back to your original investment.",
    ["break even", "recovery", "loss", "investment"],
    [num("start", "Starting value", 1000000), num("now", "Current value", 720000)],
    (v) => {
      const need = n(v, "now") ? (n(v, "start") / n(v, "now") - 1) * 100 : 0;
      const loss = n(v, "start") ? (1 - n(v, "now") / n(v, "start")) * 100 : 0;
      return [
        { label: "Gain needed to break even", value: `${f(need, 2)}%`, primary: true },
        { label: "Current loss", value: `${f(loss, 2)}%` },
      ];
    }),
  T("savings-interest-comparison", "Savings & Investment", "Savings Interest Comparison", "Compare two savings rates.",
    "Put two savings rates side by side and see which account leaves you better off over time.",
    ["savings", "interest rate", "compare", "account"],
    [num("amount", "Deposit", 1000000), num("r1", "Rate A", 8, "%/yr"), num("r2", "Rate B", 11, "%/yr"), num("years", "Years", 5)],
    (v) => {
      const y = n(v, "years");
      const a = n(v, "amount") * Math.pow(1 + n(v, "r1") / 100, y);
      const b = n(v, "amount") * Math.pow(1 + n(v, "r2") / 100, y);
      return [
        { label: "Better option", value: b >= a ? `Rate B by ${money(b - a)}` : `Rate A by ${money(a - b)}`, primary: true },
        { label: "Rate A value", value: money(a) },
        { label: "Rate B value", value: money(b) },
      ];
    }),
  T("millionaire-calculator", "Savings & Investment", "Millionaire Calculator", "Years to reach a big target.",
    "Find out how long steady monthly saving takes to reach a seven-figure target at a given return.",
    ["millionaire", "target", "savings", "goal"],
    [num("start", "Starting amount", 500000), num("monthly", "Monthly saving", 100000), num("rate", "Return", 12, "%/yr"), num("target", "Target", 100000000)],
    (v) => {
      const r = n(v, "rate") / 100 / 12;
      let bal = n(v, "start"), m = 0;
      while (bal < n(v, "target") && m < 1200) { bal = bal * (1 + r) + n(v, "monthly"); m++; }
      return [
        { label: "Time to target", value: m >= 1200 ? "Over 100 years" : `${f(m / 12, 1)} years`, primary: true },
        { label: "Months", value: m >= 1200 ? "—" : String(m) },
      ];
    }),
];

/* ---------- Retirement & Pension ---------- */
const retirement: ToolSpec[] = [
  T("pension-pot-projection", "Retirement & Pension", "Pension Pot Projection", "Project your pot at retirement.",
    "Project the value of your pension pot at retirement from your current balance and monthly contributions.",
    ["pension", "pot", "projection", "retirement"],
    [num("pot", "Current pot", 4000000), num("monthly", "Monthly contribution", 80000), num("rate", "Growth", 10, "%/yr"), num("years", "Years to retirement", 22)],
    (v) => {
      const r = n(v, "rate") / 100 / 12, m = n(v, "years") * 12;
      const fv = n(v, "pot") * Math.pow(1 + r, m) + (r === 0 ? n(v, "monthly") * m : n(v, "monthly") * ((Math.pow(1 + r, m) - 1) / r));
      return [
        { label: "Projected pot", value: money(fv), primary: true },
        { label: "Total contributed", value: money(n(v, "monthly") * m) },
      ];
    }),
  T("retirement-shortfall-calculator", "Retirement & Pension", "Retirement Shortfall Calculator", "Gap between pot and need.",
    "Compare the pot you are on track for with the pot you need and see the shortfall to close.",
    ["shortfall", "retirement gap", "pension", "planning"],
    [num("need", "Pot needed", 90000000), num("projected", "Projected pot", 62000000), num("years", "Years left", 15), num("rate", "Growth", 10, "%/yr")],
    (v) => {
      const gap = Math.max(0, n(v, "need") - n(v, "projected"));
      const r = n(v, "rate") / 100 / 12, m = n(v, "years") * 12;
      const extra = r === 0 ? gap / (m || 1) : (gap * r) / (Math.pow(1 + r, m) - 1);
      return [
        { label: "Shortfall", value: money(gap), primary: true },
        { label: "Extra to save monthly", value: money(extra) },
      ];
    }),
  T("annuity-income-calculator", "Retirement & Pension", "Annuity Income Calculator", "Income from an annuity purchase.",
    "See the yearly and monthly income a pension pot could buy at a given annuity rate.",
    ["annuity", "income", "pension", "rate"],
    [num("pot", "Pension pot", 50000000), num("rate", "Annuity rate", 6.5, "%")],
    (v) => {
      const yearly = n(v, "pot") * n(v, "rate") / 100;
      return [
        { label: "Annual income", value: money(yearly), primary: true },
        { label: "Monthly income", value: money(yearly / 12) },
      ];
    }),
  T("pension-lump-sum-calculator", "Retirement & Pension", "Pension Lump Sum Calculator", "Take cash and keep income.",
    "See what taking a tax-free lump sum leaves behind and the income the remaining pot can support.",
    ["lump sum", "pension", "tax free cash", "income"],
    [num("pot", "Pension pot", 50000000), num("lump", "Lump sum taken", 25, "%"), num("rate", "Annuity rate", 6.5, "%")],
    (v) => {
      const cash = n(v, "pot") * n(v, "lump") / 100;
      const rest = n(v, "pot") - cash;
      return [
        { label: "Lump sum", value: money(cash), primary: true },
        { label: "Remaining pot", value: money(rest) },
        { label: "Annual income from rest", value: money(rest * n(v, "rate") / 100) },
      ];
    }),
  T("retirement-age-calculator", "Retirement & Pension", "Retirement Age Calculator", "When you can afford to stop.",
    "Find the age at which your savings reach the pot you need to retire comfortably.",
    ["retirement age", "fire", "savings", "independence"],
    [num("age", "Current age", 34), num("pot", "Current savings", 6000000), num("monthly", "Monthly saving", 150000), num("rate", "Growth", 10, "%/yr"), num("target", "Pot needed", 90000000)],
    (v) => {
      const r = n(v, "rate") / 100 / 12;
      let bal = n(v, "pot"), m = 0;
      while (bal < n(v, "target") && m < 900) { bal = bal * (1 + r) + n(v, "monthly"); m++; }
      return [
        { label: "Retirement age", value: m >= 900 ? "Not on track" : f(n(v, "age") + m / 12, 1), primary: true },
        { label: "Years to go", value: m >= 900 ? "—" : f(m / 12, 1) },
      ];
    }),
  T("safe-withdrawal-rate-calculator", "Retirement & Pension", "Safe Withdrawal Rate Calculator", "How much you can draw yearly.",
    "Apply a safe withdrawal rate to your pot to see sustainable yearly and monthly retirement spending.",
    ["safe withdrawal", "4 percent rule", "drawdown", "retirement"],
    [num("pot", "Retirement pot", 80000000), num("rate", "Withdrawal rate", 4, "%")],
    (v) => {
      const yearly = n(v, "pot") * n(v, "rate") / 100;
      return [
        { label: "Yearly withdrawal", value: money(yearly), primary: true },
        { label: "Monthly withdrawal", value: money(yearly / 12) },
      ];
    }),
  T("pension-contribution-match", "Retirement & Pension", "Employer Pension Match Calculator", "Value of employer matching.",
    "See how much free money an employer pension match adds to your retirement savings each year.",
    ["employer match", "pension", "contribution", "benefit"],
    [num("salary", "Annual salary", 6000000), num("you", "Your contribution", 8, "%"), num("employer", "Employer match", 10, "%")],
    (v) => {
      const mine = n(v, "salary") * n(v, "you") / 100;
      const theirs = n(v, "salary") * n(v, "employer") / 100;
      return [
        { label: "Total yearly into pension", value: money(mine + theirs), primary: true },
        { label: "Your contribution", value: money(mine) },
        { label: "Employer contribution", value: money(theirs) },
      ];
    }),
  T("inflation-adjusted-pension", "Retirement & Pension", "Inflation Adjusted Pension Calculator", "Pot value in today's money.",
    "Translate a future pension pot into today's buying power so the number actually means something.",
    ["inflation", "pension", "todays money", "real value"],
    [num("pot", "Future pot", 90000000), num("inflation", "Inflation", 15, "%/yr"), num("years", "Years away", 20)],
    (v) => {
      const real = n(v, "pot") / Math.pow(1 + n(v, "inflation") / 100, n(v, "years"));
      return [
        { label: "Value in today's money", value: money(real), primary: true },
        { label: "Buying power lost", value: money(n(v, "pot") - real) },
      ];
    }),
  T("pension-drawdown-longevity", "Retirement & Pension", "Pension Drawdown Longevity Calculator", "How long the pot lasts.",
    "See how many years a pension pot lasts at your chosen withdrawal level and growth rate.",
    ["drawdown", "longevity", "pot", "retirement income"],
    [num("pot", "Pot", 60000000), num("withdraw", "Monthly withdrawal", 400000), num("rate", "Growth", 8, "%/yr")],
    (v) => {
      const r = n(v, "rate") / 100 / 12;
      let bal = n(v, "pot"), m = 0;
      while (bal > 0 && m < 1200) { bal = bal * (1 + r) - n(v, "withdraw"); m++; }
      return [
        { label: "Pot lasts", value: m >= 1200 ? "Over 100 years" : `${f(m / 12, 1)} years`, primary: true },
        { label: "Months", value: m >= 1200 ? "—" : String(m) },
      ];
    }),
  T("state-pension-top-up", "Retirement & Pension", "Pension Top-Up Calculator", "Value of extra contributions.",
    "See what topping up your pension by a small monthly amount adds to your final pot.",
    ["top up", "extra contribution", "pension", "avc"],
    [num("extra", "Extra monthly contribution", 25000), num("rate", "Growth", 10, "%/yr"), num("years", "Years to retirement", 18)],
    (v) => {
      const r = n(v, "rate") / 100 / 12, m = n(v, "years") * 12;
      const fv = r === 0 ? n(v, "extra") * m : n(v, "extra") * ((Math.pow(1 + r, m) - 1) / r);
      return [
        { label: "Added to your pot", value: money(fv), primary: true },
        { label: "Total paid in", value: money(n(v, "extra") * m) },
        { label: "Growth earned", value: money(fv - n(v, "extra") * m) },
      ];
    }),
];

/* ---------- Auto & Fuel ---------- */
const auto: ToolSpec[] = [
  T("litres-per-100km-converter", "Auto & Fuel", "Litres per 100km Converter", "Swap between L/100km and mpg.",
    "Convert fuel economy between litres per 100 km, km per litre and miles per gallon.",
    ["l/100km", "mpg", "km per litre", "fuel economy"],
    [num("value", "Value", 8), sel("unit", "Unit", ["L/100km", "km/L", "mpg (US)", "mpg (UK)"])],
    (v) => {
      const x = n(v, "value");
      const u = s(v, "unit");
      const l100 = u === "L/100km" ? x : u === "km/L" ? 100 / (x || 1) : u === "mpg (US)" ? 235.215 / (x || 1) : 282.481 / (x || 1);
      return [
        { label: "L/100km", value: f(l100, 2), primary: true },
        { label: "km per litre", value: f(100 / (l100 || 1), 2) },
        { label: "mpg (US)", value: f(235.215 / (l100 || 1), 2) },
        { label: "mpg (UK)", value: f(282.481 / (l100 || 1), 2) },
      ];
    }),
  T("ev-charging-cost-calculator", "Auto & Fuel", "EV Charging Cost Calculator", "Cost to charge an electric car.",
    "Work out what a full charge costs and the cost per kilometre for an electric vehicle.",
    ["ev", "electric car", "charging", "kwh"],
    [num("battery", "Battery size", 60, "kWh"), num("price", "Electricity price", 250, "per kWh"), num("range", "Range per charge", 350, "km")],
    (v) => {
      const cost = n(v, "battery") * n(v, "price");
      return [
        { label: "Full charge cost", value: money(cost), primary: true },
        { label: "Cost per km", value: money(cost / (n(v, "range") || 1)) },
      ];
    }),
  T("ev-vs-petrol-cost", "Auto & Fuel", "EV vs Petrol Cost Comparison", "Compare running costs.",
    "Compare the cost per kilometre of an electric car against a petrol car over the same distance.",
    ["ev", "petrol", "comparison", "running cost"],
    [num("distance", "Distance", 1000, "km"), num("evRate", "EV cost per km", 45), num("fuelEcon", "Petrol economy", 9, "L/100km"), num("fuelPrice", "Fuel price", 900, "per litre")],
    (v) => {
      const ev = n(v, "distance") * n(v, "evRate");
      const petrol = (n(v, "distance") / 100) * n(v, "fuelEcon") * n(v, "fuelPrice");
      return [
        { label: "Cheaper option", value: ev <= petrol ? `EV saves ${money(petrol - ev)}` : `Petrol saves ${money(ev - petrol)}`, primary: true },
        { label: "EV cost", value: money(ev) },
        { label: "Petrol cost", value: money(petrol) },
      ];
    }),
  T("tyre-size-calculator", "Auto & Fuel", "Tyre Size Calculator", "Overall diameter from tyre code.",
    "Turn a tyre code like 205/55 R16 into sidewall height, overall diameter and rolling circumference.",
    ["tyre", "tire size", "diameter", "rim"],
    [num("width", "Tread width", 205, "mm"), num("ratio", "Aspect ratio", 55, "%"), num("rim", "Rim diameter", 16, "in")],
    (v) => {
      const sidewall = n(v, "width") * n(v, "ratio") / 100;
      const dia = n(v, "rim") * 25.4 + 2 * sidewall;
      return [
        { label: "Overall diameter", value: `${f(dia, 1)} mm`, primary: true },
        { label: "Sidewall height", value: `${f(sidewall, 1)} mm` },
        { label: "Rolling circumference", value: `${f(dia * Math.PI, 1)} mm` },
      ];
    }),
  T("engine-displacement-calculator", "Auto & Fuel", "Engine Displacement Calculator", "Work out engine capacity.",
    "Calculate engine displacement in cc and litres from bore, stroke and cylinder count.",
    ["engine", "displacement", "bore", "stroke", "cc"],
    [num("bore", "Bore", 86, "mm"), num("stroke", "Stroke", 86, "mm"), num("cyl", "Cylinders", 4)],
    (v) => {
      const cc = (Math.PI / 4) * Math.pow(n(v, "bore") / 10, 2) * (n(v, "stroke") / 10) * n(v, "cyl");
      return [
        { label: "Displacement", value: `${f(cc, 0)} cc`, primary: true },
        { label: "Litres", value: f(cc / 1000, 2) },
      ];
    }),
  T("car-depreciation-calculator", "Auto & Fuel", "Car Depreciation Calculator", "Resale value over time.",
    "Estimate what a car will be worth after a few years at a typical yearly depreciation rate.",
    ["car depreciation", "resale value", "vehicle", "loss"],
    [num("price", "Purchase price", 12000000), num("rate", "Depreciation", 15, "%/yr"), num("years", "Years", 5)],
    (v) => {
      const val = n(v, "price") * Math.pow(1 - n(v, "rate") / 100, n(v, "years"));
      return [
        { label: "Value after period", value: money(val), primary: true },
        { label: "Total depreciation", value: money(n(v, "price") - val) },
        { label: "Per year", value: money((n(v, "price") - val) / (n(v, "years") || 1)) },
      ];
    }),
  T("lease-vs-buy-calculator", "Auto & Fuel", "Lease vs Buy Calculator", "Compare car lease and purchase.",
    "Compare the total cost of leasing a car with buying it and selling later.",
    ["lease", "buy", "car", "comparison"],
    [num("lease", "Monthly lease", 350000), num("months", "Term", 36, "months"), num("price", "Purchase price", 12000000), num("resale", "Resale value", 7500000)],
    (v) => {
      const leaseTotal = n(v, "lease") * n(v, "months");
      const buyTotal = n(v, "price") - n(v, "resale");
      return [
        { label: "Cheaper option", value: leaseTotal <= buyTotal ? `Lease by ${money(buyTotal - leaseTotal)}` : `Buy by ${money(leaseTotal - buyTotal)}`, primary: true },
        { label: "Lease total", value: money(leaseTotal) },
        { label: "Buy net cost", value: money(buyTotal) },
      ];
    }),
  T("oil-change-interval-calculator", "Auto & Fuel", "Oil Change Interval Calculator", "When your next service is due.",
    "Track the distance until your next oil change and how long that is at your usual monthly mileage.",
    ["oil change", "service", "interval", "maintenance"],
    [num("last", "Odometer at last change", 54000, "km"), num("current", "Current odometer", 59500, "km"), num("interval", "Service interval", 8000, "km"), num("monthly", "Monthly distance", 1200, "km")],
    (v) => {
      const left = n(v, "last") + n(v, "interval") - n(v, "current");
      return [
        { label: "Distance until service", value: `${f(left, 0)} km`, primary: true },
        { label: "Time left", value: left <= 0 ? "Overdue" : `${f(left / (n(v, "monthly") || 1), 1)} months` },
      ];
    }),
  T("towing-capacity-checker", "Auto & Fuel", "Towing Capacity Checker", "Check a load against your limit.",
    "Compare the weight of a trailer and its load with your vehicle's towing limit.",
    ["towing", "trailer", "capacity", "load"],
    [num("capacity", "Towing capacity", 2000, "kg"), num("trailer", "Trailer weight", 650, "kg"), num("load", "Cargo weight", 900, "kg")],
    (v) => {
      const total = n(v, "trailer") + n(v, "load");
      return [
        { label: "Total towed weight", value: `${f(total, 0)} kg`, primary: true },
        { label: "Status", value: total <= n(v, "capacity") ? "Within limit" : "Over limit" },
        { label: "Remaining capacity", value: `${f(n(v, "capacity") - total, 0)} kg` },
      ];
    }),
  T("road-tax-insurance-budget", "Auto & Fuel", "Car Ownership Budget Calculator", "Yearly cost of keeping a car.",
    "Add up insurance, tax, servicing and fuel to see the real yearly and monthly cost of running your car.",
    ["car budget", "insurance", "servicing", "ownership"],
    [num("insurance", "Insurance per year", 180000), num("tax", "Road tax per year", 40000), num("service", "Servicing per year", 150000), num("fuel", "Fuel per month", 90000)],
    (v) => {
      const yearly = n(v, "insurance") + n(v, "tax") + n(v, "service") + n(v, "fuel") * 12;
      return [
        { label: "Yearly cost", value: money(yearly), primary: true },
        { label: "Monthly cost", value: money(yearly / 12) },
      ];
    }),
];

/* ---------- Home & Mortgage ---------- */
const home: ToolSpec[] = [
  T("rent-vs-buy-calculator", "Home & Mortgage", "Rent vs Buy Calculator", "Compare renting and owning.",
    "Compare total renting costs with mortgage costs over the same period to see which works out cheaper.",
    ["rent vs buy", "mortgage", "housing", "comparison"],
    [num("rent", "Monthly rent", 350000), num("price", "Home price", 45000000), num("deposit", "Deposit", 9000000), num("rate", "Mortgage rate", 20, "%/yr"), num("years", "Years", 10)],
    (v) => {
      const months = n(v, "years") * 12;
      const p = pmt(n(v, "price") - n(v, "deposit"), n(v, "rate") / 100 / 12, 240);
      return [
        { label: "Monthly mortgage", value: money(p), primary: true },
        { label: "Total rent paid", value: money(n(v, "rent") * months) },
        { label: "Total mortgage paid", value: money(p * months + n(v, "deposit")) },
      ];
    }),
  T("stamp-duty-calculator", "Home & Mortgage", "Property Transaction Cost Calculator", "Fees on buying a home.",
    "Add legal fees, agency fees and transfer charges to a property price to see the full cash needed.",
    ["stamp duty", "legal fees", "property", "closing costs"],
    [num("price", "Property price", 45000000), num("legal", "Legal fees", 5, "%"), num("agency", "Agency fees", 5, "%"), num("other", "Other charges", 250000)],
    (v) => {
      const fees = n(v, "price") * (n(v, "legal") + n(v, "agency")) / 100 + n(v, "other");
      return [
        { label: "Total purchase cost", value: money(n(v, "price") + fees), primary: true },
        { label: "Fees and charges", value: money(fees) },
      ];
    }),
  T("rental-yield-calculator", "Home & Mortgage", "Rental Yield Calculator", "Gross and net rental yield.",
    "Work out the gross and net yield on a rental property after running costs.",
    ["rental yield", "buy to let", "property", "investment"],
    [num("price", "Property value", 45000000), num("rent", "Annual rent", 4200000), num("costs", "Annual costs", 900000)],
    (v) => {
      const gross = n(v, "price") ? (n(v, "rent") / n(v, "price")) * 100 : 0;
      const net = n(v, "price") ? ((n(v, "rent") - n(v, "costs")) / n(v, "price")) * 100 : 0;
      return [
        { label: "Net yield", value: `${f(net, 2)}%`, primary: true },
        { label: "Gross yield", value: `${f(gross, 2)}%` },
        { label: "Net income", value: money(n(v, "rent") - n(v, "costs")) },
      ];
    }),
  T("remortgage-savings-calculator", "Home & Mortgage", "Remortgage Savings Calculator", "Savings from a better rate.",
    "Compare your current mortgage payment with a new rate to see the monthly and total saving.",
    ["remortgage", "refinance", "rate", "saving"],
    [num("balance", "Outstanding balance", 30000000), num("old", "Current rate", 24, "%/yr"), num("new", "New rate", 19, "%/yr"), num("years", "Years remaining", 15)],
    (v) => {
      const m = n(v, "years") * 12;
      const a = pmt(n(v, "balance"), n(v, "old") / 100 / 12, m);
      const b = pmt(n(v, "balance"), n(v, "new") / 100 / 12, m);
      return [
        { label: "Monthly saving", value: money(a - b), primary: true },
        { label: "Total saving", value: money((a - b) * m) },
        { label: "New payment", value: money(b) },
      ];
    }),
  T("home-equity-calculator", "Home & Mortgage", "Home Equity Calculator", "Equity built in your home.",
    "See how much of your home you actually own after the outstanding mortgage balance.",
    ["home equity", "ltv", "mortgage", "ownership"],
    [num("value", "Current home value", 52000000), num("balance", "Mortgage balance", 28000000)],
    (v) => {
      const eq = n(v, "value") - n(v, "balance");
      return [
        { label: "Equity", value: money(eq), primary: true },
        { label: "Equity share", value: `${f(n(v, "value") ? (eq / n(v, "value")) * 100 : 0, 1)}%` },
        { label: "Loan to value", value: `${f(n(v, "value") ? (n(v, "balance") / n(v, "value")) * 100 : 0, 1)}%` },
      ];
    }),
  T("utility-bill-splitter", "Home & Mortgage", "Utility Bill Splitter", "Split household bills fairly.",
    "Divide rent and utility bills between housemates, evenly or weighted by room share.",
    ["bills", "split", "housemates", "utilities"],
    [num("rent", "Rent", 350000), num("power", "Electricity", 40000), num("water", "Water & waste", 15000), num("people", "People", 3)],
    (v) => {
      const total = n(v, "rent") + n(v, "power") + n(v, "water");
      return [
        { label: "Each person pays", value: money(total / (n(v, "people") || 1)), primary: true },
        { label: "Total monthly bills", value: money(total) },
      ];
    }),
  T("home-renovation-budget", "Home & Mortgage", "Home Renovation Budget Calculator", "Budget a renovation with buffer.",
    "Add up materials, labour and a contingency buffer so a renovation doesn't blow the budget.",
    ["renovation", "budget", "contingency", "home improvement"],
    [num("materials", "Materials", 1800000), num("labour", "Labour", 1200000), num("buffer", "Contingency", 15, "%")],
    (v) => {
      const base = n(v, "materials") + n(v, "labour");
      const buffer = base * n(v, "buffer") / 100;
      return [
        { label: "Total budget", value: money(base + buffer), primary: true },
        { label: "Contingency", value: money(buffer) },
      ];
    }),
  T("mortgage-affordability-stress-test", "Home & Mortgage", "Mortgage Stress Test Calculator", "Payment if rates rise.",
    "See what your mortgage payment becomes if interest rates rise, and whether income still covers it.",
    ["stress test", "rate rise", "affordability", "mortgage"],
    [num("balance", "Loan amount", 30000000), num("rate", "Current rate", 20, "%/yr"), num("rise", "Rate rise", 3, "%"), num("years", "Term", 20), num("income", "Monthly income", 900000)],
    (v) => {
      const m = n(v, "years") * 12;
      const now = pmt(n(v, "balance"), n(v, "rate") / 100 / 12, m);
      const after = pmt(n(v, "balance"), (n(v, "rate") + n(v, "rise")) / 100 / 12, m);
      const ratio = n(v, "income") ? (after / n(v, "income")) * 100 : 0;
      return [
        { label: "Stressed payment", value: money(after), primary: true },
        { label: "Increase", value: money(after - now) },
        { label: "Share of income", value: `${f(ratio, 1)}% ${ratio > 40 ? "(tight)" : "(manageable)"}` },
      ];
    }),
  T("property-price-growth", "Home & Mortgage", "Property Price Growth Calculator", "Future value of a home.",
    "Project what a property could be worth after several years of steady price growth.",
    ["property growth", "appreciation", "house price", "forecast"],
    [num("price", "Current value", 45000000), num("rate", "Annual growth", 8, "%"), num("years", "Years", 10)],
    (v) => {
      const fv = n(v, "price") * Math.pow(1 + n(v, "rate") / 100, n(v, "years"));
      return [
        { label: "Projected value", value: money(fv), primary: true },
        { label: "Total growth", value: money(fv - n(v, "price")) },
      ];
    }),
  T("service-charge-calculator", "Home & Mortgage", "Service Charge Calculator", "Your share of estate costs.",
    "Split an estate's annual service charge between units and see your monthly share.",
    ["service charge", "estate", "maintenance", "apartment"],
    [num("total", "Annual estate budget", 12000000), num("units", "Number of units", 24), num("share", "Your share weighting", 1)],
    (v) => {
      const per = n(v, "units") ? (n(v, "total") / n(v, "units")) * n(v, "share") : 0;
      return [
        { label: "Your annual charge", value: money(per), primary: true },
        { label: "Monthly", value: money(per / 12) },
      ];
    }),
];

/* ---------- Salary & Paycheck ---------- */
const salary: ToolSpec[] = [
  T("weekly-pay-calculator", "Salary & Paycheck", "Weekly Pay Calculator", "Weekly, biweekly and monthly pay.",
    "Convert an hourly rate into weekly, fortnightly, monthly and yearly pay.",
    ["weekly pay", "hourly", "biweekly", "monthly"],
    [num("rate", "Hourly rate", 3500), num("hours", "Hours per week", 40)],
    (v) => {
      const w = n(v, "rate") * n(v, "hours");
      return [
        { label: "Weekly pay", value: money(w), primary: true },
        { label: "Fortnightly", value: money(w * 2) },
        { label: "Monthly", value: money((w * 52) / 12) },
        { label: "Yearly", value: money(w * 52) },
      ];
    }),
  T("pro-rata-salary-calculator", "Salary & Paycheck", "Pro Rata Salary Calculator", "Part-time equivalent pay.",
    "Work out the pro rata salary for part-time hours compared with a full-time role.",
    ["pro rata", "part time", "salary", "hours"],
    [num("full", "Full-time salary", 7200000), num("fullHours", "Full-time hours", 40), num("yourHours", "Your hours", 24)],
    (v) => {
      const p = n(v, "fullHours") ? (n(v, "full") * n(v, "yourHours")) / n(v, "fullHours") : 0;
      return [
        { label: "Pro rata salary", value: money(p), primary: true },
        { label: "Monthly", value: money(p / 12) },
      ];
    }),
  T("bonus-tax-calculator", "Salary & Paycheck", "Bonus Take-Home Calculator", "What's left of a bonus.",
    "See how much of a bonus you actually keep after tax and other deductions.",
    ["bonus", "take home", "tax", "deduction"],
    [num("bonus", "Bonus amount", 800000), num("tax", "Tax rate", 24, "%"), num("pension", "Pension deduction", 8, "%")],
    (v) => {
      const ded = n(v, "bonus") * (n(v, "tax") + n(v, "pension")) / 100;
      return [
        { label: "Take-home bonus", value: money(n(v, "bonus") - ded), primary: true },
        { label: "Total deductions", value: money(ded) },
      ];
    }),
  T("severance-pay-calculator", "Salary & Paycheck", "Severance Pay Calculator", "Redundancy pay estimate.",
    "Estimate severance based on years of service and your monthly salary.",
    ["severance", "redundancy", "years of service", "payout"],
    [num("salary", "Monthly salary", 500000), num("years", "Years of service", 6), num("weeks", "Weeks pay per year", 2)],
    (v) => {
      const weekly = (n(v, "salary") * 12) / 52;
      const total = weekly * n(v, "weeks") * n(v, "years");
      return [
        { label: "Severance payout", value: money(total), primary: true },
        { label: "Weeks of pay", value: f(n(v, "weeks") * n(v, "years"), 1) },
      ];
    }),
  T("shift-differential-calculator", "Salary & Paycheck", "Shift Differential Calculator", "Extra pay for night shifts.",
    "Add a night or weekend shift premium to your base rate and see the extra earned.",
    ["shift", "night shift", "differential", "premium"],
    [num("rate", "Base hourly rate", 3000), num("premium", "Shift premium", 20, "%"), num("hours", "Shift hours", 48)],
    (v) => {
      const prem = n(v, "rate") * n(v, "premium") / 100;
      return [
        { label: "Shift pay", value: money((n(v, "rate") + prem) * n(v, "hours")), primary: true },
        { label: "Premium rate", value: money(n(v, "rate") + prem) },
        { label: "Extra earned", value: money(prem * n(v, "hours")) },
      ];
    }),
  T("unpaid-leave-deduction", "Salary & Paycheck", "Unpaid Leave Deduction Calculator", "Pay lost to unpaid days.",
    "Work out the pay deducted for unpaid leave days and what your payslip becomes.",
    ["unpaid leave", "deduction", "absence", "payroll"],
    [num("salary", "Monthly salary", 500000), num("workdays", "Working days in month", 22), num("days", "Unpaid days", 3)],
    (v) => {
      const daily = n(v, "workdays") ? n(v, "salary") / n(v, "workdays") : 0;
      const cut = daily * n(v, "days");
      return [
        { label: "Adjusted pay", value: money(n(v, "salary") - cut), primary: true },
        { label: "Deduction", value: money(cut) },
        { label: "Daily rate", value: money(daily) },
      ];
    }),
  T("contractor-vs-employee-pay", "Salary & Paycheck", "Contractor vs Employee Pay", "Compare the two pay models.",
    "Compare a contract day rate with an employed salary once benefits and unpaid time off are counted.",
    ["contractor", "employee", "day rate", "benefits"],
    [num("dayRate", "Contract day rate", 90000), num("days", "Billable days per year", 200), num("salary", "Employed salary", 9000000), num("benefits", "Benefits value", 1500000)],
    (v) => {
      const contract = n(v, "dayRate") * n(v, "days");
      const employed = n(v, "salary") + n(v, "benefits");
      return [
        { label: "Better paid", value: contract >= employed ? `Contracting by ${money(contract - employed)}` : `Employment by ${money(employed - contract)}`, primary: true },
        { label: "Contract total", value: money(contract) },
        { label: "Employment total", value: money(employed) },
      ];
    }),
  T("13th-month-pay-calculator", "Salary & Paycheck", "13th Month Pay Calculator", "Year-end extra pay.",
    "Work out 13th month pay based on the months you actually worked during the year.",
    ["13th month", "year end", "bonus", "pay"],
    [num("salary", "Monthly salary", 500000), num("months", "Months worked", 9)],
    (v) => {
      const pay = (n(v, "salary") * n(v, "months")) / 12;
      return [
        { label: "13th month pay", value: money(pay), primary: true },
        { label: "Full-year entitlement", value: money(n(v, "salary")) },
      ];
    }),
  T("payslip-breakdown-calculator", "Salary & Paycheck", "Payslip Breakdown Calculator", "Split gross pay into parts.",
    "Break a gross salary into basic, housing and transport allowances plus deductions.",
    ["payslip", "allowance", "basic pay", "breakdown"],
    [num("gross", "Gross monthly pay", 600000), num("basic", "Basic share", 60, "%"), num("housing", "Housing share", 20, "%"), num("deductions", "Deductions", 15, "%")],
    (v) => {
      const g = n(v, "gross");
      const basic = g * n(v, "basic") / 100, housing = g * n(v, "housing") / 100;
      const transport = g - basic - housing;
      const ded = g * n(v, "deductions") / 100;
      return [
        { label: "Net pay", value: money(g - ded), primary: true },
        { label: "Basic", value: money(basic) },
        { label: "Housing", value: money(housing) },
        { label: "Transport / other", value: money(transport) },
      ];
    }),
  T("cost-of-living-salary-adjustment", "Salary & Paycheck", "Cost of Living Salary Adjustment", "Salary needed in a new city.",
    "See the salary you need in a new city to keep the same standard of living.",
    ["cost of living", "relocation", "salary", "adjustment"],
    [num("salary", "Current salary", 6000000), num("index", "Cost index change", 25, "%")],
    (v) => {
      const need = n(v, "salary") * (1 + n(v, "index") / 100);
      return [
        { label: "Equivalent salary", value: money(need), primary: true },
        { label: "Difference", value: money(need - n(v, "salary")) },
      ];
    }),
];

/* ---------- Data & Digital Storage ---------- */
const data: ToolSpec[] = [
  conv("byte-converter", "Data & Digital Storage", "Byte Converter", "Convert bytes, KB, MB, GB and TB.",
    "Convert between bytes, kilobytes, megabytes, gigabytes and terabytes using decimal units.",
    ["bytes", "kb", "mb", "gb", "tb"],
    { B: 1, KB: 1e3, MB: 1e6, GB: 1e9, TB: 1e12, PB: 1e15 }, "MB", "GB"),
  conv("bit-rate-converter", "Data & Digital Storage", "Bit Rate Converter", "Convert bps, Kbps, Mbps and Gbps.",
    "Convert network speeds between bits per second, kilobits, megabits and gigabits.",
    ["bitrate", "mbps", "kbps", "network speed"],
    { bps: 1, Kbps: 1e3, Mbps: 1e6, Gbps: 1e9 }, "Mbps", "Kbps"),
  conv("binary-storage-converter", "Data & Digital Storage", "Binary Storage Converter", "KiB, MiB, GiB and TiB.",
    "Convert between binary storage units — kibibytes, mebibytes, gibibytes and tebibytes.",
    ["kib", "mib", "gib", "binary", "storage"],
    { B: 1, KiB: 1024, MiB: 1024 ** 2, GiB: 1024 ** 3, TiB: 1024 ** 4 }, "MiB", "GiB"),
  T("photo-storage-calculator", "Data & Digital Storage", "Photo Storage Calculator", "How many photos fit.",
    "Estimate how many photos fit on a card or drive from average file size.",
    ["photos", "storage", "sd card", "capacity"],
    [num("capacity", "Storage capacity", 64, "GB"), num("size", "Average photo size", 6, "MB")],
    (v) => {
      const count = (n(v, "capacity") * 1000) / (n(v, "size") || 1);
      return [
        { label: "Photos that fit", value: f(count, 0), primary: true },
        { label: "Space per 1000 photos", value: `${f(n(v, "size"), 1)} GB` },
      ];
    }),
  T("backup-time-calculator", "Data & Digital Storage", "Backup Time Calculator", "Time to back up your data.",
    "Estimate how long a backup or upload takes at a given connection speed.",
    ["backup", "upload", "transfer time", "speed"],
    [num("size", "Data size", 250, "GB"), num("speed", "Upload speed", 20, "Mbps")],
    (v) => {
      const seconds = (n(v, "size") * 8000) / (n(v, "speed") || 1);
      return [
        { label: "Time needed", value: `${f(seconds / 3600, 1)} hours`, primary: true },
        { label: "Days", value: f(seconds / 86400, 2) },
      ];
    }),
  T("bandwidth-requirement-calculator", "Data & Digital Storage", "Bandwidth Requirement Calculator", "Speed needed for your household.",
    "Work out the internet speed a household needs from the number of simultaneous streams and calls.",
    ["bandwidth", "internet speed", "streaming", "household"],
    [num("hd", "HD streams", 2), num("uhd", "4K streams", 1), num("calls", "Video calls", 2), num("browsing", "Browsing devices", 3)],
    (v) => {
      const total = n(v, "hd") * 5 + n(v, "uhd") * 25 + n(v, "calls") * 3 + n(v, "browsing") * 1;
      return [
        { label: "Recommended speed", value: `${f(total * 1.2, 0)} Mbps`, primary: true },
        { label: "Raw requirement", value: `${f(total, 0)} Mbps` },
      ];
    }),
  T("hosting-bandwidth-calculator", "Data & Digital Storage", "Hosting Bandwidth Calculator", "Monthly transfer for a site.",
    "Estimate the monthly bandwidth a website uses from page size and traffic.",
    ["hosting", "bandwidth", "website", "traffic"],
    [num("page", "Average page size", 2.5, "MB"), num("views", "Monthly page views", 50000)],
    (v) => {
      const gb = (n(v, "page") * n(v, "views")) / 1000;
      return [
        { label: "Monthly bandwidth", value: `${f(gb, 1)} GB`, primary: true },
        { label: "With 30% headroom", value: `${f(gb * 1.3, 1)} GB` },
      ];
    }),
  T("audio-file-size-calculator", "Data & Digital Storage", "Audio File Size Calculator", "Size of a recording.",
    "Estimate the file size of an audio recording from its bitrate and length.",
    ["audio", "file size", "bitrate", "mp3"],
    [num("bitrate", "Bitrate", 192, "kbps"), num("minutes", "Length", 45, "min")],
    (v) => {
      const mb = (n(v, "bitrate") * n(v, "minutes") * 60) / 8 / 1000;
      return [
        { label: "File size", value: `${f(mb, 1)} MB`, primary: true },
        { label: "Per hour", value: `${f((n(v, "bitrate") * 3600) / 8 / 1000, 1)} MB` },
      ];
    }),
  T("cloud-storage-cost-calculator", "Data & Digital Storage", "Cloud Storage Cost Calculator", "Monthly cloud bill.",
    "Estimate monthly cloud storage and transfer costs from the amount of data you keep and move.",
    ["cloud", "storage cost", "s3", "hosting"],
    [num("storage", "Stored data", 500, "GB"), num("price", "Price per GB", 25), num("transfer", "Monthly transfer", 200, "GB"), num("tprice", "Transfer price per GB", 15)],
    (v) => {
      const cost = n(v, "storage") * n(v, "price") + n(v, "transfer") * n(v, "tprice");
      return [
        { label: "Monthly cost", value: money(cost), primary: true },
        { label: "Yearly cost", value: money(cost * 12) },
      ];
    }),
  T("data-plan-usage-planner", "Data & Digital Storage", "Data Plan Usage Planner", "Make a data bundle last.",
    "See how much of your data bundle you can use per day for the rest of the billing cycle.",
    ["data plan", "bundle", "mobile data", "usage"],
    [num("plan", "Bundle size", 40, "GB"), num("used", "Used so far", 22, "GB"), num("days", "Days left", 11)],
    (v) => {
      const left = Math.max(0, n(v, "plan") - n(v, "used"));
      return [
        { label: "Daily allowance", value: `${f(left / (n(v, "days") || 1), 2)} GB`, primary: true },
        { label: "Data remaining", value: `${f(left, 2)} GB` },
      ];
    }),
];

/* ---------- Sports & Fitness Tracking ---------- */
const sports: ToolSpec[] = [
  T("swim-pace-calculator", "Sports & Fitness Tracking", "Swim Pace Calculator", "Pace per 100m in the pool.",
    "Turn a swim distance and time into a pace per 100 metres and an average speed.",
    ["swimming", "pace", "100m", "training"],
    [num("distance", "Distance", 1500, "m"), num("minutes", "Time", 28, "min")],
    (v) => {
      const per100 = n(v, "distance") ? (n(v, "minutes") * 100) / n(v, "distance") : 0;
      return [
        { label: "Pace per 100m", value: `${Math.floor(per100)}:${String(Math.round((per100 % 1) * 60)).padStart(2, "0")}`, primary: true },
        { label: "Average speed", value: `${f(n(v, "distance") / 1000 / (n(v, "minutes") / 60 || 1), 2)} km/h` },
      ];
    }),
  T("cycling-power-to-weight", "Sports & Fitness Tracking", "Cycling Power to Weight Calculator", "Watts per kilogram.",
    "Work out your power-to-weight ratio in watts per kilogram and see how it rates.",
    ["cycling", "watts per kg", "ftp", "power"],
    [num("watts", "Power output", 250, "W"), num("weight", "Body weight", 72, "kg")],
    (v) => {
      const wkg = n(v, "weight") ? n(v, "watts") / n(v, "weight") : 0;
      const level = wkg >= 5 ? "Elite" : wkg >= 4 ? "Very strong" : wkg >= 3 ? "Good" : wkg >= 2 ? "Recreational" : "Beginner";
      return [
        { label: "Power to weight", value: `${f(wkg, 2)} W/kg`, primary: true },
        { label: "Level", value: level },
      ];
    }),
  T("one-rep-max-calculator", "Sports & Fitness Tracking", "One Rep Max Calculator", "Estimate your 1RM.",
    "Estimate your one rep max from a set at a lower weight, plus training percentages.",
    ["1rm", "one rep max", "strength", "lifting"],
    [num("weight", "Weight lifted", 80, "kg"), num("reps", "Reps completed", 6)],
    (v) => {
      const orm = n(v, "weight") * (1 + n(v, "reps") / 30);
      return [
        { label: "Estimated 1RM", value: `${f(orm, 1)} kg`, primary: true },
        { label: "85% training weight", value: `${f(orm * 0.85, 1)} kg` },
        { label: "70% training weight", value: `${f(orm * 0.7, 1)} kg` },
      ];
    }),
  T("vo2-max-estimator", "Sports & Fitness Tracking", "VO2 Max Estimator", "Estimate aerobic fitness.",
    "Estimate VO2 max from a 12-minute run distance using the Cooper test formula.",
    ["vo2 max", "cooper test", "aerobic", "fitness"],
    [num("distance", "12-minute distance", 2600, "m")],
    (v) => {
      const vo2 = (n(v, "distance") - 504.9) / 44.73;
      return [
        { label: "VO2 max", value: `${f(vo2, 1)} ml/kg/min`, primary: true },
        { label: "Rating", value: vo2 >= 55 ? "Excellent" : vo2 >= 45 ? "Good" : vo2 >= 35 ? "Average" : "Below average" },
      ];
    }),
  T("marathon-split-calculator", "Sports & Fitness Tracking", "Marathon Split Calculator", "Target splits for race day.",
    "Turn a marathon goal time into per-kilometre pace and halfway split targets.",
    ["marathon", "splits", "race pace", "running"],
    [num("hours", "Goal hours", 4), num("minutes", "Goal minutes", 15), num("distance", "Race distance", 42.195, "km")],
    (v) => {
      const total = n(v, "hours") * 60 + n(v, "minutes");
      const pace = n(v, "distance") ? total / n(v, "distance") : 0;
      const half = total / 2;
      return [
        { label: "Pace per km", value: `${Math.floor(pace)}:${String(Math.round((pace % 1) * 60)).padStart(2, "0")}`, primary: true },
        { label: "Halfway split", value: `${Math.floor(half / 60)}h ${f(half % 60, 0)}m` },
        { label: "Pace per mile", value: f(pace * 1.60934, 2) },
      ];
    }),
  T("training-load-calculator", "Sports & Fitness Tracking", "Training Load Calculator", "Session load from effort.",
    "Multiply session duration by perceived effort to track weekly training load.",
    ["training load", "rpe", "workload", "recovery"],
    [num("minutes", "Session duration", 60, "min"), num("rpe", "Effort (RPE 1-10)", 7), num("sessions", "Sessions per week", 5)],
    (v) => {
      const load = n(v, "minutes") * n(v, "rpe");
      return [
        { label: "Session load", value: f(load, 0), primary: true },
        { label: "Weekly load", value: f(load * n(v, "sessions"), 0) },
      ];
    }),
  T("body-water-calculator", "Sports & Fitness Tracking", "Body Water Calculator", "Estimated total body water.",
    "Estimate the total water in your body from height, weight and age.",
    ["body water", "hydration", "tbw", "composition"],
    [num("weight", "Weight", 72, "kg"), num("height", "Height", 175, "cm"), num("age", "Age", 30), sel("sex", "Sex", ["Male", "Female"])],
    (v) => {
      const tbw = s(v, "sex") === "Male"
        ? 2.447 - 0.09156 * n(v, "age") + 0.1074 * n(v, "height") + 0.3362 * n(v, "weight")
        : -2.097 + 0.1069 * n(v, "height") + 0.2466 * n(v, "weight");
      return [
        { label: "Total body water", value: `${f(tbw, 1)} L`, primary: true },
        { label: "Share of body weight", value: `${f(n(v, "weight") ? (tbw / n(v, "weight")) * 100 : 0, 1)}%` },
      ];
    }),
  T("rest-interval-calculator", "Sports & Fitness Tracking", "Rest Interval Calculator", "Rest time between sets.",
    "Get the rest interval suited to your training goal and see how long the whole workout takes.",
    ["rest", "sets", "interval", "gym"],
    [sel("goal", "Training goal", ["Strength", "Hypertrophy", "Endurance"]), num("sets", "Total sets", 16), num("setTime", "Time per set", 40, "sec")],
    (v) => {
      const rest = s(v, "goal") === "Strength" ? 180 : s(v, "goal") === "Hypertrophy" ? 90 : 45;
      const total = n(v, "sets") * (rest + n(v, "setTime"));
      return [
        { label: "Rest between sets", value: `${rest} sec`, primary: true },
        { label: "Estimated workout time", value: `${f(total / 60, 0)} min` },
      ];
    }),
  T("step-goal-planner", "Sports & Fitness Tracking", "Step Goal Planner", "Hit your daily step target.",
    "See how many more steps you need today and roughly how long that walk takes.",
    ["steps", "walking", "goal", "activity"],
    [num("goal", "Daily step goal", 10000), num("done", "Steps so far", 6200), num("cadence", "Steps per minute", 110)],
    (v) => {
      const left = Math.max(0, n(v, "goal") - n(v, "done"));
      return [
        { label: "Steps remaining", value: f(left, 0), primary: true },
        { label: "Walking time needed", value: `${f(left / (n(v, "cadence") || 1), 0)} min` },
        { label: "Progress", value: `${f(n(v, "goal") ? (n(v, "done") / n(v, "goal")) * 100 : 0, 0)}%` },
      ];
    }),
  T("sweat-rate-calculator", "Sports & Fitness Tracking", "Sweat Rate Calculator", "Fluid lost per hour.",
    "Weigh in before and after training to work out your sweat rate and how much to drink.",
    ["sweat rate", "hydration", "fluid loss", "endurance"],
    [num("before", "Weight before", 72.5, "kg"), num("after", "Weight after", 71.2, "kg"), num("drank", "Fluid drunk", 500, "ml"), num("minutes", "Session length", 75, "min")],
    (v) => {
      const lossMl = (n(v, "before") - n(v, "after")) * 1000 + n(v, "drank");
      const perHour = n(v, "minutes") ? (lossMl / n(v, "minutes")) * 60 : 0;
      return [
        { label: "Sweat rate", value: `${f(perHour, 0)} ml/hour`, primary: true },
        { label: "Total fluid lost", value: `${f(lossMl, 0)} ml` },
        { label: "Drink per 15 min", value: `${f(perHour / 4, 0)} ml` },
      ];
    }),
];

/* ---------- Shopping & Discounts ---------- */
const shopping: ToolSpec[] = [
  T("buy-one-get-one-calculator", "Shopping & Discounts", "BOGO Deal Calculator", "Real saving on buy-one-get-one.",
    "Work out the true effective discount on buy-one-get-one and similar multi-buy deals.",
    ["bogo", "buy one get one", "multibuy", "discount"],
    [num("price", "Price per item", 2500), num("buy", "Items you pay for", 2), num("free", "Items you get free", 1)],
    (v) => {
      const total = n(v, "buy") + n(v, "free");
      const spend = n(v, "price") * n(v, "buy");
      return [
        { label: "Effective discount", value: `${f(total ? (n(v, "free") / total) * 100 : 0, 1)}%`, primary: true },
        { label: "Price per item", value: money(total ? spend / total : 0) },
        { label: "Total spend", value: money(spend) },
      ];
    }),
  T("cashback-calculator", "Shopping & Discounts", "Cashback Calculator", "What a cashback offer is worth.",
    "Apply a cashback percentage with a cap and see your real cost after the rebate.",
    ["cashback", "rebate", "card", "reward"],
    [num("spend", "Purchase amount", 45000), num("rate", "Cashback rate", 5, "%"), num("cap", "Cashback cap", 2000)],
    (v) => {
      const raw = n(v, "spend") * n(v, "rate") / 100;
      const cash = Math.min(raw, n(v, "cap") || raw);
      return [
        { label: "Cashback earned", value: money(cash), primary: true },
        { label: "Effective price", value: money(n(v, "spend") - cash) },
        { label: "Effective discount", value: `${f(n(v, "spend") ? (cash / n(v, "spend")) * 100 : 0, 2)}%` },
      ];
    }),
  T("loyalty-points-value", "Shopping & Discounts", "Loyalty Points Value Calculator", "What your points are worth.",
    "Convert loyalty or reward points into real money and see the value per point.",
    ["loyalty", "points", "rewards", "redeem"],
    [num("points", "Points balance", 24000), num("rate", "Value per point", 0.5)],
    (v) => {
      const val = n(v, "points") * n(v, "rate");
      return [
        { label: "Points value", value: money(val), primary: true },
        { label: "Per 1000 points", value: money(n(v, "rate") * 1000) },
      ];
    }),
  T("clearance-price-calculator", "Shopping & Discounts", "Clearance Price Calculator", "Price after stacked markdowns.",
    "Apply successive clearance markdowns and see the final price and total saving.",
    ["clearance", "markdown", "sale", "stacked discount"],
    [num("price", "Original price", 18000), num("d1", "First markdown", 30, "%"), num("d2", "Second markdown", 20, "%"), num("d3", "Third markdown", 10, "%")],
    (v) => {
      const final = n(v, "price") * (1 - n(v, "d1") / 100) * (1 - n(v, "d2") / 100) * (1 - n(v, "d3") / 100);
      return [
        { label: "Final price", value: money(final), primary: true },
        { label: "Total saving", value: money(n(v, "price") - final) },
        { label: "Overall discount", value: `${f(n(v, "price") ? (1 - final / n(v, "price")) * 100 : 0, 1)}%` },
      ];
    }),
  T("free-shipping-threshold", "Shopping & Discounts", "Free Shipping Threshold Calculator", "Is it worth adding more?",
    "See whether adding items to reach free shipping actually costs less than paying delivery.",
    ["free shipping", "delivery", "threshold", "basket"],
    [num("cart", "Cart total", 32000), num("threshold", "Free shipping from", 40000), num("shipping", "Shipping fee", 3500)],
    (v) => {
      const gap = Math.max(0, n(v, "threshold") - n(v, "cart"));
      return [
        { label: "Add to qualify", value: money(gap), primary: true },
        { label: "Worth it?", value: gap === 0 ? "Already free" : gap < n(v, "shipping") ? "Yes, add items" : "No, pay shipping" },
        { label: "Shipping fee", value: money(n(v, "shipping")) },
      ];
    }),
  T("bulk-buy-savings-calculator", "Shopping & Discounts", "Bulk Buy Savings Calculator", "Compare pack sizes.",
    "Compare a small pack with a bulk pack on unit price to see which is genuinely cheaper.",
    ["bulk", "unit price", "pack size", "compare"],
    [num("p1", "Small pack price", 1200), num("q1", "Small pack quantity", 6), num("p2", "Bulk pack price", 4200), num("q2", "Bulk pack quantity", 24)],
    (v) => {
      const u1 = n(v, "q1") ? n(v, "p1") / n(v, "q1") : 0;
      const u2 = n(v, "q2") ? n(v, "p2") / n(v, "q2") : 0;
      return [
        { label: "Better value", value: u2 <= u1 ? "Bulk pack" : "Small pack", primary: true },
        { label: "Small pack unit price", value: money(u1) },
        { label: "Bulk pack unit price", value: money(u2) },
      ];
    }),
  T("gift-budget-splitter", "Shopping & Discounts", "Gift Budget Splitter", "Split a gift budget fairly.",
    "Divide a gift budget across a list of people, with a bigger share for a few close ones.",
    ["gift", "budget", "christmas", "split"],
    [num("budget", "Total budget", 120000), num("people", "People", 8), num("special", "Special people", 2), num("weight", "Extra share for special", 100, "%")],
    (v) => {
      const w = 1 + n(v, "weight") / 100;
      const units = (n(v, "people") - n(v, "special")) + n(v, "special") * w;
      const base = units ? n(v, "budget") / units : 0;
      return [
        { label: "Standard gift", value: money(base), primary: true },
        { label: "Special gift", value: money(base * w) },
      ];
    }),
  T("price-match-calculator", "Shopping & Discounts", "Price Match Calculator", "Saving from matching a rival.",
    "Compare a store's price with a competitor's, including any extra match discount offered.",
    ["price match", "competitor", "saving", "retail"],
    [num("ours", "Store price", 56000), num("rival", "Competitor price", 51000), num("extra", "Extra match discount", 5, "%")],
    (v) => {
      const matched = n(v, "rival") * (1 - n(v, "extra") / 100);
      return [
        { label: "Matched price", value: money(matched), primary: true },
        { label: "You save", value: money(n(v, "ours") - matched) },
        { label: "Saving", value: `${f(n(v, "ours") ? ((n(v, "ours") - matched) / n(v, "ours")) * 100 : 0, 1)}%` },
      ];
    }),
  T("subscription-cost-calculator", "Shopping & Discounts", "Subscription Cost Calculator", "What subscriptions really cost.",
    "Add up monthly subscriptions to see your yearly spend and what cutting a few would save.",
    ["subscriptions", "monthly cost", "budget", "savings"],
    [num("count", "Number of subscriptions", 6), num("average", "Average monthly cost", 4500), num("cut", "Subscriptions to cancel", 2)],
    (v) => {
      const monthly = n(v, "count") * n(v, "average");
      const saved = n(v, "cut") * n(v, "average");
      return [
        { label: "Yearly spend", value: money(monthly * 12), primary: true },
        { label: "Monthly spend", value: money(monthly) },
        { label: "Yearly saving if cancelled", value: money(saved * 12) },
      ];
    }),
  T("layaway-payment-calculator", "Shopping & Discounts", "Layaway Payment Calculator", "Spread a purchase over weeks.",
    "Split a purchase into a deposit plus weekly payments and see the cost of any plan fee.",
    ["layaway", "instalment", "weekly payment", "deposit"],
    [num("price", "Item price", 180000), num("deposit", "Deposit", 40000), num("weeks", "Weeks to pay", 12), num("fee", "Plan fee", 5, "%")],
    (v) => {
      const fee = n(v, "price") * n(v, "fee") / 100;
      const owed = n(v, "price") + fee - n(v, "deposit");
      return [
        { label: "Weekly payment", value: money(owed / (n(v, "weeks") || 1)), primary: true },
        { label: "Total cost", value: money(n(v, "price") + fee) },
        { label: "Plan fee", value: money(fee) },
      ];
    }),
];

/* ---------- Unit Converters ---------- */
const unitConv: ToolSpec[] = [
  conv("area-converter", "Unit Converters", "Area Converter", "Square metres, acres, hectares and more.",
    "Convert land and floor areas between square metres, square feet, acres, hectares and plots.",
    ["area", "acre", "hectare", "square metre", "plot"],
    { "m²": 1, "ft²": 0.092903, "km²": 1e6, "mi²": 2589988, acre: 4046.86, hectare: 10000, "yd²": 0.836127 }, "m²", "ft²"),
  conv("volume-converter", "Unit Converters", "Volume Converter", "Litres, gallons, cups and cubic metres.",
    "Convert volumes between litres, millilitres, gallons, pints, cups and cubic metres.",
    ["volume", "litre", "gallon", "cup", "pint"],
    { L: 1, mL: 0.001, "m³": 1000, "US gal": 3.78541, "UK gal": 4.54609, "US cup": 0.236588, "US pint": 0.473176 }, "L", "US gal"),
  conv("speed-converter", "Unit Converters", "Speed Converter", "km/h, mph, knots and m/s.",
    "Convert speeds between kilometres per hour, miles per hour, metres per second and knots.",
    ["speed", "kmh", "mph", "knots", "m/s"],
    { "km/h": 1, "m/s": 3.6, mph: 1.60934, knots: 1.852, "ft/s": 1.09728 }, "km/h", "mph"),
  conv("pressure-converter", "Unit Converters", "Pressure Converter", "Bar, psi, kPa and atmospheres.",
    "Convert pressure between bar, psi, kilopascals, atmospheres and millibars.",
    ["pressure", "psi", "bar", "kpa", "atm"],
    { bar: 1, psi: 0.0689476, kPa: 0.01, Pa: 0.00001, atm: 1.01325, mbar: 0.001 }, "bar", "psi"),
  conv("energy-converter", "Unit Converters", "Energy Converter", "Joules, calories, kWh and BTU.",
    "Convert energy between joules, kilojoules, calories, kilowatt-hours and BTU.",
    ["energy", "joule", "calorie", "kwh", "btu"],
    { J: 1, kJ: 1000, cal: 4.184, kcal: 4184, Wh: 3600, kWh: 3600000, BTU: 1055.06 }, "kcal", "kJ"),
  conv("power-converter", "Unit Converters", "Power Converter", "Watts, kilowatts and horsepower.",
    "Convert power between watts, kilowatts, megawatts and horsepower.",
    ["power", "watt", "kilowatt", "horsepower", "hp"],
    { W: 1, kW: 1000, MW: 1e6, hp: 745.7, "PS (metric hp)": 735.5 }, "kW", "hp"),
  conv("angle-converter", "Unit Converters", "Angle Converter", "Degrees, radians and gradians.",
    "Convert angles between degrees, radians, gradians and full turns.",
    ["angle", "degrees", "radians", "gradians"],
    { degrees: 1, radians: 57.2957795, gradians: 0.9, turns: 360 }, "degrees", "radians"),
  conv("fuel-consumption-converter", "Unit Converters", "Fuel Consumption Converter", "Compare fuel economy units.",
    "Convert fuel consumption between litres per 100 km, kilometres per litre and miles per gallon equivalents.",
    ["fuel", "consumption", "l/100km", "mpg"],
    { "km/L": 1, "miles/L": 0.621371, "mpg (US)": 0.264172 * 0.621371 * 1000 / 1000, "mpg (UK)": 0.219969 * 0.621371 }, "km/L", "mpg (UK)"),
  conv("time-unit-converter", "Unit Converters", "Time Unit Converter", "Seconds, hours, days and years.",
    "Convert durations between seconds, minutes, hours, days, weeks and years.",
    ["time", "seconds", "hours", "days", "weeks"],
    { seconds: 1, minutes: 60, hours: 3600, days: 86400, weeks: 604800, years: 31557600 }, "hours", "minutes"),
  conv("cooking-weight-converter", "Unit Converters", "Cooking Weight Converter", "Grams, ounces and pounds.",
    "Convert kitchen weights between grams, kilograms, ounces and pounds for recipes.",
    ["grams", "ounces", "pounds", "kitchen", "recipe"],
    { g: 1, kg: 1000, oz: 28.3495, lb: 453.592 }, "g", "oz"),
];

export const EXTRA3_SPECS: ToolSpec[] = [
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
  ...unitConv,
];
