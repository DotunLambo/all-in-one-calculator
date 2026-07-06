import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

// Factors to meters
const LENGTH: Record<string, number> = {
  mm: 0.001,
  cm: 0.01,
  m: 1,
  km: 1000,
  in: 0.0254,
  ft: 0.3048,
  yd: 0.9144,
  mi: 1609.344,
};

export default defineTool({
  name: "convert_length",
  title: "Convert length",
  description: "Convert a length value between units (mm, cm, m, km, in, ft, yd, mi).",
  inputSchema: {
    value: z.number(),
    from: z.enum(["mm", "cm", "m", "km", "in", "ft", "yd", "mi"]),
    to: z.enum(["mm", "cm", "m", "km", "in", "ft", "yd", "mi"]),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ value, from, to }) => {
    const result = (value * LENGTH[from]) / LENGTH[to];
    return {
      content: [{ type: "text", text: `${value} ${from} = ${result} ${to}` }],
      structuredContent: { result, from, to },
    };
  },
});
