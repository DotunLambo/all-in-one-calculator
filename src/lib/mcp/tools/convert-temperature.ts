import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

function toCelsius(value: number, unit: "C" | "F" | "K"): number {
  if (unit === "C") return value;
  if (unit === "F") return (value - 32) * (5 / 9);
  return value - 273.15;
}
function fromCelsius(c: number, unit: "C" | "F" | "K"): number {
  if (unit === "C") return c;
  if (unit === "F") return c * (9 / 5) + 32;
  return c + 273.15;
}

export default defineTool({
  name: "convert_temperature",
  title: "Convert temperature",
  description: "Convert a temperature between Celsius (C), Fahrenheit (F), and Kelvin (K).",
  inputSchema: {
    value: z.number(),
    from: z.enum(["C", "F", "K"]),
    to: z.enum(["C", "F", "K"]),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ value, from, to }) => {
    const result = fromCelsius(toCelsius(value, from), to);
    return {
      content: [{ type: "text", text: `${value}°${from} = ${result}°${to}` }],
      structuredContent: { result, from, to },
    };
  },
});
