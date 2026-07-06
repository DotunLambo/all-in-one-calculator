import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "calculate_bmi",
  title: "Calculate BMI",
  description: "Compute Body Mass Index from weight (kg) and height (cm), and return the WHO category.",
  inputSchema: {
    weightKg: z.number().positive().describe("Weight in kilograms."),
    heightCm: z.number().positive().describe("Height in centimeters."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ weightKg, heightCm }) => {
    const h = heightCm / 100;
    const bmi = weightKg / (h * h);
    const category =
      bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : bmi < 30 ? "Overweight" : "Obese";
    return {
      content: [{ type: "text", text: `BMI ${bmi.toFixed(1)} — ${category}` }],
      structuredContent: { bmi: Number(bmi.toFixed(2)), category },
    };
  },
});
