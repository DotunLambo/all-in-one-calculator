import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ToolShell } from "@/components/SiteShell";

export const Route = createFileRoute("/calculator")({
  head: () => ({
    meta: [
      { title: "Calculator — Utilikit" },
      { name: "description", content: "A simple, fast online calculator for everyday math." },
    ],
  }),
  component: CalculatorPage,
});

const keys = [
  ["AC", "±", "%", "÷"],
  ["7", "8", "9", "×"],
  ["4", "5", "6", "−"],
  ["1", "2", "3", "+"],
  ["0", ".", "="],
];

function CalculatorPage() {
  const [display, setDisplay] = useState("0");
  const [prev, setPrev] = useState<number | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [waiting, setWaiting] = useState(false);

  const inputDigit = (d: string) => {
    if (waiting) { setDisplay(d); setWaiting(false); }
    else setDisplay(display === "0" ? d : display + d);
  };
  const inputDot = () => {
    if (waiting) { setDisplay("0."); setWaiting(false); return; }
    if (!display.includes(".")) setDisplay(display + ".");
  };
  const compute = (a: number, b: number, o: string) =>
    o === "+" ? a + b : o === "−" ? a - b : o === "×" ? a * b : o === "÷" ? a / b : b;
  const doOp = (next: string) => {
    const val = parseFloat(display);
    if (prev !== null && op && !waiting) {
      const r = compute(prev, val, op);
      setDisplay(String(+r.toFixed(10)));
      setPrev(r);
    } else setPrev(val);
    setOp(next); setWaiting(true);
  };
  const equals = () => {
    if (prev === null || op === null) return;
    const r = compute(prev, parseFloat(display), op);
    setDisplay(String(+r.toFixed(10)));
    setPrev(null); setOp(null); setWaiting(true);
  };
  const clear = () => { setDisplay("0"); setPrev(null); setOp(null); setWaiting(false); };
  const toggleSign = () => setDisplay(String(parseFloat(display) * -1));
  const percent = () => setDisplay(String(parseFloat(display) / 100));

  const press = (k: string) => {
    if (/\d/.test(k)) inputDigit(k);
    else if (k === ".") inputDot();
    else if (k === "AC") clear();
    else if (k === "±") toggleSign();
    else if (k === "%") percent();
    else if (k === "=") equals();
    else doOp(k);
  };

  return (
    <ToolShell title="Calculator" subtitle="Tap or type — basic arithmetic, instantly.">
      <div className="mx-auto max-w-sm rounded-3xl border bg-card p-5 shadow-[var(--shadow-elegant)]" style={{ background: "var(--gradient-card)" }}>
        <div className="mb-4 min-h-[88px] rounded-2xl bg-secondary/60 p-5 text-right">
          <div className="truncate text-4xl font-light tracking-tight">{display}</div>
          {op && <div className="mt-1 text-xs text-muted-foreground">{prev} {op}</div>}
        </div>
        <div className="grid grid-cols-4 gap-2">
          {keys.flat().map((k) => {
            const isOp = ["÷","×","−","+","="].includes(k);
            const isFn = ["AC","±","%"].includes(k);
            return (
              <button
                key={k}
                onClick={() => press(k)}
                className={`h-14 rounded-xl text-lg font-medium transition active:scale-95 ${k === "0" ? "col-span-2" : ""} ${
                  isOp ? "text-primary-foreground" : isFn ? "bg-secondary text-foreground" : "bg-background border text-foreground hover:bg-secondary"
                }`}
                style={isOp ? { background: "var(--gradient-hero)" } : undefined}
              >
                {k}
              </button>
            );
          })}
        </div>
      </div>
    </ToolShell>
  );
}
