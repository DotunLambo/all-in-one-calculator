import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { ToolShell } from "@/components/SiteShell";

export const Route = createFileRoute("/currency")({
  head: () => ({
    meta: [
      { title: "Currency Converter — Utilikit" },
      { name: "description", content: "Convert between world currencies with live exchange rates." },
    ],
  }),
  component: CurrencyPage,
});

const CURRENCIES = ["USD","EUR","GBP","JPY","CNY","INR","CAD","AUD","CHF","BRL","MXN","ZAR","SGD","HKD","NZD","SEK","NOK","KRW","TRY","AED"];

function CurrencyPage() {
  const [amount, setAmount] = useState(100);
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const [rate, setRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true); setError(null);
    fetch(`https://open.er-api.com/v6/latest/${from}`)
      .then((r) => r.json())
      .then((d) => {
        if (!active) return;
        if (d?.rates?.[to]) setRate(d.rates[to]);
        else setError("Rate unavailable");
      })
      .catch(() => active && setError("Failed to fetch rates"))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [from, to]);

  const converted = rate ? amount * rate : 0;
  const swap = () => { setFrom(to); setTo(from); };

  return (
    <ToolShell title="Currency Converter" subtitle="Live mid-market rates between 20+ world currencies.">
      <div className="rounded-3xl border bg-card p-6 shadow-[var(--shadow-soft)]" style={{ background: "var(--gradient-card)" }}>
        <label className="block">
          <span className="text-sm font-medium">Amount</span>
          <input type="number" value={amount} onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
            className="mt-2 w-full rounded-xl border bg-background px-4 py-3 text-2xl font-semibold outline-none ring-ring/30 focus:ring-2" />
        </label>

        <div className="mt-5 grid items-end gap-3 sm:grid-cols-[1fr_auto_1fr]">
          <Select label="From" value={from} onChange={setFrom} />
          <button onClick={swap} className="mx-auto grid h-11 w-11 place-items-center rounded-full border bg-background transition hover:bg-secondary" aria-label="Swap">
            <ArrowLeftRight className="h-4 w-4" />
          </button>
          <Select label="To" value={to} onChange={setTo} />
        </div>

        <div className="mt-8 rounded-2xl border bg-background p-6">
          <div className="text-sm text-muted-foreground">{amount} {from} =</div>
          <div className="mt-1 text-4xl font-semibold tracking-tight">
            {loading ? "…" : error ? "—" : `${converted.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${to}`}
          </div>
          {rate && !loading && !error && (
            <div className="mt-2 text-xs text-muted-foreground">1 {from} = {rate.toFixed(4)} {to}</div>
          )}
          {error && <div className="mt-2 text-xs text-destructive">{error}</div>}
        </div>
      </div>
    </ToolShell>
  );
}

function Select({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-xl border bg-background px-4 py-3 text-base outline-none ring-ring/30 focus:ring-2">
        {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
    </label>
  );
}
