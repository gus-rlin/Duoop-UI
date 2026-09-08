import React from "react";
import { CatalogShowcase } from "../CatalogShowcase";
import { ChartDemo, ChartPlayground, chartExamples } from "./ChartDemos";
import component from "./Chart.jsx?raw";
import css from "./Chart.css?raw";
import demos from "./ChartDemos.jsx?raw";

export const chartEntry = {
  id: "builtin-chart",
  name: "Chart",
  category: "Display",
  notes:
    "Data with a little character. Sculpted curves, tactile bars and a view that is entirely yours.",
};
export function ChartShowcase() {
  return (
    <CatalogShowcase
      entry={chartEntry}
      number="46"
      section="DISPLAY"
      examples={chartExamples}
      Demo={ChartDemo}
      playground={<ChartPlayground />}
      accessibility="Explore with the arrow keys, toggle each series, or open the semantic data table. Missing values stay missing."
      usage="Provide ordered records and unique series keys. Categories use equal spacing; this is not a continuous time scale. Non-finite or missing values create gaps; numeric strings are not converted. The vertical domain includes zero and rescales to visible series. Smooth curves use horizontal Bézier tangents, inspired by D3’s curveBumpX; SVG composition follows the small-primitives approach of visx. No external chart runtime or copied source is included. Use formatValue for units and localization. In the playground, Our data edits up to 24 rows; enable Compare series to edit Shop. Apply data updates the preview, closing keeps the draft, and Reset restores demo data and controls. Blank values create gaps. Edits stay local and are not included in code downloads. The editor belongs to the playground; Chart receives its data through props."
      usageCode={
        '<Chart data={[{ label: "Jan", value: 24 }, { label: "Feb", value: 38 }]} />'
      }
      api={[
        [
          "data / series / xKey",
          "Records, series { key, label, color }, category field (default label). Values must be finite numbers.",
        ],
        [
          "type / curve",
          "area (default), line, bar; smooth (default) or linear interpolation. Bars are grouped and offset slightly from zero to clear their shadows.",
        ],
        [
          "title / description",
          "Accessible chart heading and optional supporting copy.",
        ],
        [
          "height / strokeWidth / fillOpacity",
          "Plot height 200–600 px (300); line width 1–8 (3); area opacity 0–1 (0.65).",
        ],
        [
          "showGrid / showPoints / showLegend / showTable",
          "All true by default. Legend buttons toggle series. The table retains all data.",
        ],
        [
          "referenceValue / referenceLabel",
          "Optional numeric target with a dashed line and label (Target). Included in the vertical domain.",
        ],
        [
          "formatValue",
          "Number formatter shared by ticks, active values and table. Defaults to compact English notation.",
        ],
        [
          "animate",
          "Short entrance on mount and chart-type changes. Defaults true; honors reduced motion.",
        ],
        [
          "className / style",
          "Root customization. CSS variables: --chart-face, --chart-ink, --chart-edge, --chart-soft, --chart-accent. Accent colors the header illustration; series[].color colors the plotted data.",
        ],
        [
          "Keyboard",
          "Focus plot, then Left/Right, Home/End to explore; Escape clears selection. Data is also available in the table.",
        ],
      ]}
      sources={[
        ["Chart.jsx", component],
        ["Chart.css", css],
        ["ChartDemos.jsx", demos],
      ]}
    />
  );
}
