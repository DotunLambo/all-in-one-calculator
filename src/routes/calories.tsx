import { createFileRoute } from "@tanstack/react-router";
import { ToolShell } from "@/components/SiteShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const Route = createFileRoute("/calories")({
  head: () => ({
    meta: [
      { title: "Calorie Calculator — Utilikit" },
      { name: "description", content: "Estimate daily calorie needs with the Mifflin-St Jeor equation." },
      { property: "og:title", content: "Calorie Calculator — Utilikit" },
      { property: "og:description", content: "Calculate your daily maintenance and deficit calories." },
    ],
  }),
  component: CaloriesPage,
});

function CaloriesPage() {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [activity, setActivity] = useState("1.2");
  const [result, setResult] = useState<{ bmr: number; tdee: number } | null>(null);

  const calculate = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);
    const af = parseFloat(activity);
    if (!w || !h || !a || !af) return;

    const bmr =
      gender === "male"
        ? 10 * w + 6.25 * h - 5 * a + 5
        : 10 * w + 6.25 * h - 5 * a - 161;
    const tdee = bmr * af;
    setResult({ bmr: Math.round(bmr), tdee: Math.round(tdee) });
  };

  return (
    <ToolShell
      title="Calorie Calculator"
      subtitle="Estimate your daily calorie needs using the Mifflin-St Jeor formula."
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              placeholder="e.g. 70"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="height">Height (cm)</Label>
            <Input
              id="height"
              type="number"
              placeholder="e.g. 175"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="age">Age (years)</Label>
            <Input
              id="age"
              type="number"
              placeholder="e.g. 30"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="activity">Activity level</Label>
            <select
              id="activity"
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="1.2">Sedentary (little/no exercise)</option>
              <option value="1.375">Lightly active (1-3 days/week)</option>
              <option value="1.55">Moderately active (3-5 days/week)</option>
              <option value="1.725">Very active (6-7 days/week)</option>
              <option value="1.9">Super active (physical job)</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Gender</Label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setGender("male")}
              className={`flex-1 rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
                gender === "male"
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-input bg-background hover:bg-accent"
              }`}
            >
              Male
            </button>
            <button
              type="button"
              onClick={() => setGender("female")}
              className={`flex-1 rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
                gender === "female"
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-input bg-background hover:bg-accent"
              }`}
            >
              Female
            </button>
          </div>
        </div>

        <Button onClick={calculate} className="w-full sm:w-auto">
          Calculate calories
        </Button>

        {result && (
          <div className="rounded-2xl border bg-card p-6 shadow-[var(--shadow-soft)]" style={{ background: "var(--gradient-card)" }}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Basal Metabolic Rate</p>
                <p className="text-2xl font-semibold">{result.bmr.toLocaleString()} kcal</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Daily maintenance (TDEE)</p>
                <p className="text-2xl font-semibold">{result.tdee.toLocaleString()} kcal</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              To lose roughly 0.5 kg per week, aim for around{" "}
              <span className="font-medium text-foreground">{(result.tdee - 500).toLocaleString()} kcal</span>
              ; to gain 0.5 kg per week, aim for around{" "}
              <span className="font-medium text-foreground">{(result.tdee + 500).toLocaleString()} kcal</span>.
            </p>
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          This calculator provides estimates only. Consult a healthcare professional before making significant dietary changes.
        </p>
      </div>
    </ToolShell>
  );
}
