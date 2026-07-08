import { createFileRoute } from "@tanstack/react-router";
import { ToolShell } from "@/components/SiteShell";
import { RelatedTools } from "@/components/RelatedTools";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMemo, useState } from "react";

const LOAN_US_FAQ = [
  {
    q: "How is a US mortgage payment calculated?",
    a: "US mortgage payments use the standard amortisation formula M = P × r × (1+r)ⁿ / ((1+r)ⁿ − 1), where P is the loan principal, r is the monthly interest rate (annual APR ÷ 12) and n is the number of monthly payments (loan term in years × 12).",
  },
  {
    q: "What is the difference between a mortgage and a personal loan?",
    a: "A mortgage is secured by the property you buy, typically has a lower interest rate and a 15-30 year term. A personal loan is unsecured, has a higher rate and usually a 2-7 year term. Use the toggle above to switch between the two with sensible default rates and terms.",
  },
  {
    q: "Does this calculator include taxes, insurance and PMI?",
    a: "No. It shows principal and interest only. A full US mortgage payment (PITI) also includes property taxes, homeowners insurance and often PMI or HOA dues. Add roughly 1-1.5% of the home price per year for taxes and insurance in most states.",
  },
  {
    q: "What is a good interest rate for a US personal loan?",
    a: "Personal loan APRs in the US typically range from about 7% for excellent credit to 30%+ for lower credit scores. Rates depend on your credit score, income, loan term and the lender.",
  },
  {
    q: "How much interest will I pay over the life of my loan?",
    a: "Enter your loan amount, rate and term above — the calculator shows total interest and total repayment instantly, plus a full month-by-month amortisation schedule.",
  },
];

export const Route = createFileRoute("/us-loan")({
  head: () => ({
    meta: [
      { title: "US Loan Calculator - Mortgage & Personal Loan Payment" },
      { name: "description", content: "Calculate monthly payments, total interest and amortization for US mortgages and personal loans in dollars." },
      { property: "og:title", content: "US Loan Calculator - Mortgage & Personal Loan Payment" },
      { property: "og:description", content: "Estimate monthly mortgage or personal loan payments, interest and amortization schedule." },
    ],
    links: [{ rel: "canonical", href: "/us-loan" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: LOAN_US_FAQ.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }),
      },
    ],
  }),
  component: USLoanPage,
});

type LoanType = "mortgage" | "personal";

function USLoanPage() {
  const [type, setType] = useState<LoanType>("mortgage");
  const [amount, setAmount] = useState("300000");
  const [rate, setRate] = useState("6.5");
  const [years, setYears] = useState("30");

  // Switch sensible defaults when toggling type
  const onTypeChange = (t: LoanType) => {
    setType(t);
    if (t === "mortgage") {
      setAmount("300000");
      setRate("6.5");
      setYears("30");
    } else {
      setAmount("15000");
      setRate("11.5");
      setYears("5");
    }
  };

  const parsed = useMemo(() => {
    const p = Math.max(0, parseFloat(amount) || 0);
    const r = Math.max(0, parseFloat(rate) || 0) / 100;
    const y = Math.max(0.1, parseFloat(years) || 1);
    const n = Math.max(1, Math.round(y * 12));
    return { p, r, n };
  }, [amount, rate, years]);

  const result = useMemo(() => {
    const { p, r, n } = parsed;
    if (!p || !n) return null;
    const monthlyRate = r / 12;
    const monthly =
      monthlyRate === 0
        ? p / n
        : (p * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
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
  }, [parsed]);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(n);

  return (
    <ToolShell
      title="US Loan Calculator"
      subtitle="Estimate monthly payments, interest and amortization for US mortgages and personal loans."
    >
      <div className="space-y-6">
        <div className="rounded-3xl border bg-card p-6 shadow-[var(--shadow-soft)]" style={{ background: "var(--gradient-card)" }}>
          <div className="mb-6 inline-flex rounded-full bg-secondary p-1 text-sm">
            {(["mortgage", "personal"] as const).map((m) => (
              <button
                key={m}
                onClick={() => onTypeChange(m)}
                className={`rounded-full px-4 py-1.5 capitalize transition ${
                  type === m ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"
                }`}
              >
                {m === "mortgage" ? "Mortgage" : "Personal loan"}
              </button>
            ))}
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="amount">Loan amount ($)</Label>
              <Input id="amount" type="number" min={0} value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rate">Annual interest rate (%)</Label>
              <Input id="rate" type="number" min={0} step={0.01} value={rate} onChange={(e) => setRate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="years">Loan term (years)</Label>
              <Input id="years" type="number" min={0.1} step={0.5} value={years} onChange={(e) => setYears(e.target.value)} />
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border bg-background p-4 text-center">
              <p className="text-sm text-muted-foreground">Monthly payment</p>
              <p className="mt-1 text-2xl font-semibold">{result ? fmt(result.monthly) : "—"}</p>
            </div>
            <div className="rounded-2xl border bg-background p-4 text-center">
              <p className="text-sm text-muted-foreground">Total interest</p>
              <p className="mt-1 text-2xl font-semibold">{result ? fmt(result.totalInterest) : "—"}</p>
            </div>
            <div className="rounded-2xl border bg-background p-4 text-center">
              <p className="text-sm text-muted-foreground">Total repayment</p>
              <p className="mt-1 text-2xl font-semibold">{result ? fmt(result.totalPayment) : "—"}</p>
            </div>
          </div>
        </div>

        {result && (
          <div className="rounded-3xl border bg-card p-6 shadow-[var(--shadow-soft)]" style={{ background: "var(--gradient-card)" }}>
            <h3 className="mb-4 text-lg font-semibold">Amortization schedule</h3>
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
                      <td className="px-4 py-2.5">{fmt(row.principal)}</td>
                      <td className="px-4 py-2.5">{fmt(row.interest)}</td>
                      <td className="px-4 py-2.5">{fmt(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          Estimates only. Actual payments may include taxes, insurance, PMI, HOA fees, origination fees and other charges depending on your lender and loan terms.
        </p>
      </div>
    </ToolShell>
  );
}
