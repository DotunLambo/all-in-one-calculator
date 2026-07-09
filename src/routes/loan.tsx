import { createFileRoute } from "@tanstack/react-router";
import { ToolShell } from "@/components/SiteShell";
import { RelatedTools } from "@/components/RelatedTools";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMemo, useState } from "react";

const LOAN_NG_FAQ = [
  {
    q: "How is loan interest calculated in Nigeria?",
    a: "Nigerian lenders typically use either the reducing-balance (amortised) method, where interest is charged on the outstanding balance each month, or the flat-rate method, where interest is charged on the original principal for the entire term. This calculator supports both methods so you can compare monthly repayments and total interest in Naira.",
  },
  {
    q: "What is the difference between flat rate and reducing balance in Naira loans?",
    a: "With a flat rate, interest is fixed on the original loan amount, so total interest is higher and each repayment is equal. With reducing balance, interest is recalculated each month on the remaining principal, so you pay less interest overall. Most Nigerian banks quote reducing-balance rates for mortgages and salary loans.",
  },
  {
    q: "How do I calculate monthly loan repayment in Naira?",
    a: "Enter the loan amount in Naira, the annual interest rate in %, and the tenure in months. The calculator computes the EMI (Equated Monthly Instalment) using P × r × (1+r)ⁿ / ((1+r)ⁿ − 1), where r is the monthly rate and n is the number of months.",
  },
  {
    q: "Are Nigerian bank loan interest rates fixed or variable?",
    a: "Both exist. Commercial banks in Nigeria offer fixed-rate personal and salary loans as well as variable-rate mortgages tied to the CBN Monetary Policy Rate (MPR). Always confirm the rate type in your loan offer letter before signing.",
  },
  {
    q: "Does this calculator include bank fees and insurance?",
    a: "No. It shows principal and interest only. Nigerian lenders may add management fees, insurance, legal fees or credit-life cover — check the total cost of credit in your loan offer for the final amount.",
  },
];

export const Route = createFileRoute("/loan")({
  head: () => ({
    meta: [
      { title: "Loan Calculator Nigeria - Monthly Payment for Naira" },
      { name: "description", content: "Free Nigerian loan calculator: work out monthly EMI, total interest and full repayment schedule in Naira with reducing-balance or flat-rate methods." },
      { name: "keywords", content: "loan calculator Nigeria, Naira loan calculator, loan interest in Nigeria, EMI calculator Nigeria, reducing balance loan, flat rate loan, mortgage Nigeria" },
      { property: "og:title", content: "Loan Calculator Nigeria — Monthly Naira Payment" },
      { property: "og:description", content: "Calculate monthly EMI, total interest and repayment schedule for Naira loans." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/loan" },
    ],
    links: [{ rel: "canonical", href: "/loan" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: LOAN_NG_FAQ.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }),
      },
    ],
  }),
  component: LoanPage,
});

function LoanPage() {
  const [amount, setAmount] = useState("1000000");
  const [rate, setRate] = useState("18");
  const [months, setMonths] = useState("12");
  const [method, setMethod] = useState<"reducing" | "flat">("reducing");

  const parsed = useMemo(() => {
    const p = Math.max(0, parseFloat(amount) || 0);
    const r = Math.max(0, parseFloat(rate) || 0) / 100;
    const n = Math.max(1, Math.floor(parseFloat(months) || 1));
    return { p, r, n };
  }, [amount, rate, months]);

  const result = useMemo(() => {
    const { p, r, n } = parsed;
    if (!p || !n) return null;

    if (method === "flat") {
      const totalInterest = p * r * (n / 12);
      const totalPayment = p + totalInterest;
      const monthly = totalPayment / n;
      return {
        monthly,
        totalPayment,
        totalInterest,
        schedule: Array.from({ length: n }, (_, i) => ({
          month: i + 1,
          principal: p / n,
          interest: totalInterest / n,
          balance: Math.max(0, p - (p / n) * (i + 1)),
        })),
      };
    }

    // Reducing balance (amortised)
    const monthlyRate = r / 12;
    let monthly = 0;
    if (monthlyRate === 0) {
      monthly = p / n;
    } else {
      monthly = (p * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
    }
    const totalPayment = monthly * n;
    const totalInterest = totalPayment - p;

    const schedule = [] as { month: number; principal: number; interest: number; balance: number }[];
    let balance = p;
    for (let i = 1; i <= n; i++) {
      const interest = balance * monthlyRate;
      const principal = monthly - interest;
      balance = Math.max(0, balance - principal);
      schedule.push({ month: i, principal, interest, balance });
    }
    return { monthly, totalPayment, totalInterest, schedule };
  }, [parsed, method]);

  const formatNaira = (n: number) =>
    new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(n);

  return (
    <ToolShell
      title="Nigeria Loan Calculator"
      subtitle="Estimate monthly repayments, total interest and repayment cost for loans in Naira."
    >
      <div className="space-y-6">
        <div className="rounded-3xl border bg-card p-6 shadow-[var(--shadow-soft)]" style={{ background: "var(--gradient-card)" }}>
          <div className="mb-6 inline-flex rounded-full bg-secondary p-1 text-sm">
            {(["reducing", "flat"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMethod(m)}
                className={`rounded-full px-4 py-1.5 capitalize transition ${
                  method === m ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"
                }`}
              >
                {m === "reducing" ? "Reducing balance" : "Flat rate"}
              </button>
            ))}
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="amount">Loan amount (₦)</Label>
              <Input
                id="amount"
                type="number"
                min={0}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rate">Annual interest rate (%)</Label>
              <Input id="rate" type="number" min={0} step={0.1} value={rate} onChange={(e) => setRate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="months">Loan term (months)</Label>
              <Input id="months" type="number" min={1} value={months} onChange={(e) => setMonths(e.target.value)} />
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border bg-background p-4 text-center">
              <p className="text-sm text-muted-foreground">Monthly payment</p>
              <p className="mt-1 text-2xl font-semibold">{result ? formatNaira(result.monthly) : "—"}</p>
            </div>
            <div className="rounded-2xl border bg-background p-4 text-center">
              <p className="text-sm text-muted-foreground">Total interest</p>
              <p className="mt-1 text-2xl font-semibold">{result ? formatNaira(result.totalInterest) : "—"}</p>
            </div>
            <div className="rounded-2xl border bg-background p-4 text-center">
              <p className="text-sm text-muted-foreground">Total repayment</p>
              <p className="mt-1 text-2xl font-semibold">{result ? formatNaira(result.totalPayment) : "—"}</p>
            </div>
          </div>
        </div>

        {result && (
          <div className="rounded-3xl border bg-card p-6 shadow-[var(--shadow-soft)]" style={{ background: "var(--gradient-card)" }}>
            <h3 className="mb-4 text-lg font-semibold">Repayment schedule</h3>
            <div className="max-h-[420px] overflow-auto rounded-2xl border">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-secondary/80 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Month</th>
                    <th className="px-4 py-3">Principal</th>
                    <th className="px-4 py-3">Interest</th>
                    <th className="px-4 py-3">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {result.schedule.map((row) => (
                    <tr key={row.month} className="bg-background">
                      <td className="px-4 py-2.5">{row.month}</td>
                      <td className="px-4 py-2.5">{formatNaira(row.principal)}</td>
                      <td className="px-4 py-2.5">{formatNaira(row.interest)}</td>
                      <td className="px-4 py-2.5">{formatNaira(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          This is an estimate. Actual repayment amounts may vary based on lender fees, insurance, charges and the specific terms of your loan.
        </p>

        <section className="rounded-3xl border bg-card p-6 shadow-[var(--shadow-soft)]" style={{ background: "var(--gradient-card)" }} aria-labelledby="loan-ng-faq-heading">
          <h2 id="loan-ng-faq-heading" className="text-xl font-semibold tracking-tight">Nigeria loan calculator FAQ</h2>
          <div className="mt-4 divide-y">
            {LOAN_NG_FAQ.map((item) => (
              <details key={item.q} className="group py-3">
                <summary className="cursor-pointer list-none font-medium text-foreground marker:content-none">
                  <span className="mr-2 inline-block transition group-open:rotate-90">›</span>
                  {item.q}
                </summary>
                <p className="mt-2 pl-5 text-sm text-muted-foreground">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <RelatedTools
          links={[
            { to: "/us-loan", label: "US loan calculator — mortgage & personal loan payments", desc: "Same maths in dollars for US mortgages and personal loans." },
            { to: "/currency", label: "Currency converter — Naira to USD, GBP, EUR", desc: "Compare loan amounts across currencies." },
            { to: "/calculator", label: "Basic calculator", desc: "Quick arithmetic for interest, fees and totals." },
            { to: "/calories", label: "Daily calorie calculator", desc: "Explore more free everyday tools." },
          ]}
        />
      </div>
    </ToolShell>
  );
}
