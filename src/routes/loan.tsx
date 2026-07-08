import { createFileRoute } from "@tanstack/react-router";
import { ToolShell } from "@/components/SiteShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/loan")({
  head: () => ({
    meta: [
      { title: "Loan Calculator Nigeria - Monthly Payment for Naira" },
      { name: "description", content: "Estimate monthly repayments, total interest and total cost for Nigerian loans in Naira." },
      { property: "og:title", content: "Loan Calculator Nigeria - Monthly Payment for Naira" },
      { property: "og:description", content: "Calculate monthly EMI, total interest and repayment schedule for Naira loans." },
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
      </div>
    </ToolShell>
  );
}
