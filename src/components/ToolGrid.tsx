import { Link } from "@tanstack/react-router";
import { Calculator, HeartPulse, Banknote, Ruler } from "lucide-react";

const tools = [
  { to: "/calculator", title: "Calculator", desc: "Quick arithmetic with a clean keypad.", icon: Calculator },
  { to: "/bmi", title: "BMI", desc: "Body Mass Index from height & weight.", icon: HeartPulse },
  { to: "/currency", title: "Currency", desc: "Live exchange rates between currencies.", icon: Banknote },
  { to: "/units", title: "Units", desc: "Convert length, mass, temperature & more.", icon: Ruler },
] as const;

export function ToolGrid() {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {tools.map(({ to, title, desc, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          className="group relative overflow-hidden rounded-2xl border bg-card p-6 shadow-[var(--shadow-soft)] transition-all hover:shadow-[var(--shadow-elegant)] hover:-translate-y-0.5"
          style={{ background: "var(--gradient-card)" }}
        >
          <div className="flex items-start gap-4">
            <div
              className="grid h-12 w-12 place-items-center rounded-xl text-primary-foreground"
              style={{ background: "var(--gradient-hero)" }}
            >
              <Icon className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
            </div>
          </div>
          <span className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 transition-transform group-hover:scale-x-100" style={{ background: "var(--gradient-hero)" }} />
        </Link>
      ))}
    </div>
  );
}
