import { defineMcp } from "@lovable.dev/mcp-js";
import bmiTool from "./tools/calculate-bmi";
import caloriesTool from "./tools/estimate-daily-calories";
import lengthTool from "./tools/convert-length";
import weightTool from "./tools/convert-weight";
import temperatureTool from "./tools/convert-temperature";

export default defineMcp({
  name: "utilikit-mcp",
  title: "Utilikit",
  version: "0.1.0",
  instructions:
    "Utilikit tools by Dotun Lambo — BMI, daily calorie estimate, and length/weight/temperature unit conversion.",
  tools: [bmiTool, caloriesTool, lengthTool, weightTool, temperatureTool],
});
