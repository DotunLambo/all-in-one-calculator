import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

const ACTIVITY: Record<string, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

export default defineTool({
  name: "estimate_daily_calories",
  title: "Estimate daily calories",
  description:
    "Estimate daily calorie needs using the Mifflin-St Jeor equation and an activity multiplier.",
  inputSchema: {
    weightKg: z.number().positive(),
    heightCm: z.number().positive(),
    age: z.number().int().positive(),
    gender: z.enum(["male", "female"]),
    activity: z
      .enum(["sedentary", "light", "moderate", "active", "very_active"])
      .default("sedentary"),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ weightKg, heightCm, age, gender, activity }) => {
    const bmr =
      10 * weightKg + 6.25 * heightCm - 5 * age + (gender === "male" ? 5 : -161);
    const tdee = bmr * ACTIVITY[activity];
    return {
      content: [
        { type: "text", text: `BMR ${Math.round(bmr)} kcal · TDEE ${Math.round(tdee)} kcal/day` },
      ],
      structuredContent: { bmr: Math.round(bmr), tdee: Math.round(tdee), activity },
    };
  },
});
