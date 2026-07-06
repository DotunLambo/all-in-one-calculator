import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

// Factors to grams
const WEIGHT: Record<string, number> = {
  mg: 0.001,
  g: 1,
  kg: 1000,
  t: 1_000_000,
  oz: 28.349523125,
  lb: 453.59237,
  st: 6350.29318,
};

export default defineTool({
  name: "convert_weight",
  title: "Convert weight",
  description: "Convert a weight/mass value between units (mg, g, kg, t, oz, lb, st).",
  inputSchema: {
    value: z.number(),
    from: z.enum(["mg", "g", "kg", "t", "oz", "lb", "st"]),
    to: z.enum(["mg", "g", "kg", "t", "oz", "lb", "st"]),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ value, from, to }) => {
    const result = (value * WEIGHT[from]) / WEIGHT[to];
    return {
      content: [{ type: "text", text: `${value} ${from} = ${result} ${to}` }],
      structuredContent: { result, from, to },
    };
  },
});
