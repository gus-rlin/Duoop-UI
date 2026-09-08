# Chart

[Try Chart](https://duoop-ui.com/?component=builtin-chart) for area, line and grouped bar charts. The component uses React and SVG; it does not require D3, visx or another chart runtime. The catalog includes six examples covering a single series, comparison, bars, negative values, missing values and empty data.

## Use the component

For source integration, copy [Chart.jsx](../src/components/Chart/Chart.jsx) and [Chart.css](../src/components/Chart/Chart.css), preserving their paths, and import [base.css](../src/base.css) once. Chart imports its own CSS. The [source-copy guide](source-installation.md) covers the React setup.

```jsx
import { Chart } from './components/Chart/Chart.jsx';

const data = [
  { label: 'Jan', projects: 24, target: 30 },
  { label: 'Feb', projects: 38, target: 35 },
  { label: 'Mar', projects: null, target: 40 },
  { label: 'Apr', projects: 56, target: 45 },
];

export default function App() {
  return (
    <Chart
      title="Monthly projects"
      description="Completed projects and planned capacity"
      data={data}
      series={[
        { key: 'projects', label: 'Projects', color: '#d6e4c4' },
        { key: 'target', label: 'Planned', color: '#e4d9cd' },
      ]}
      type="line"
      height={300}
    />
  );
}
```

The repository also exports `Chart` from `src/index.js`. For a library archive or npm version containing Chart, use `import { Chart } from 'duoop-ui'` and import `duoop-ui/styles.css` once. Source and catalog updates do not automatically update an installed npm version.

## Data and behavior

| Input | Behavior |
| --- | --- |
| `data`, `series`, `xKey` | Ordered records; unique series keys select numeric fields. `xKey` defaults to `label`. The default series uses `value`, with the label Value. |
| Missing values | `null`, absent fields and non-finite values leave gaps. Numeric strings are not converted. Zero is a valid value. |
| Categories and scale | Categories are equally spaced in input order. This is not a continuous time scale. The vertical domain includes zero, visible series and an optional reference value. Toggling a series can rescale the plot. |
| `type`, `curve` | `area` (default), `line` or `bar`; `smooth` (default) or `linear`. Curves apply to lines and areas. Bars are grouped with a small visual offset from the zero axis for their shadows. |
| `height`, `strokeWidth`, `fillOpacity` | Plot height 200–600 px, default 300; line width 1–8, default 3; area opacity 0–1, default 0.65. These are component ranges; the playground exposes a narrower height range. |
| `showGrid`, `showPoints`, `showLegend`, `showTable` | Default to true. Points apply to lines and areas. Legend buttons toggle series; the expandable table retains every series. |
| `referenceValue`, `referenceLabel` | A finite numeric reference adds a dashed line. Label defaults to Target. |
| `formatValue` | Formats ticks, explored values and table cells. Defaults to compact English number notation. Supply a formatter for your units and locale. |
| `animate` | Defaults to true. Short entrance on mount and type changes; honors reduced motion. |
| `className`, `style` | Customize the root. CSS variables include `--chart-face`, `--chart-ink`, `--chart-edge`, `--chart-soft` and `--chart-accent`. The accent colors the header illustration; `series[].color` colors the data. |

Focus the plot and use Left/Right, Home or End to explore categories. Escape clears the selection. Pointer movement also updates the footer. The data table provides the same values in semantic HTML. With no records, the chart shows an empty state; with all series hidden, it asks you to select a series.

## Our data playground

Open **Our data** below the preview. Edit labels and Studio values; enable **Compare series** to edit Shop too. **Add row** and the remove buttons change the draft, up to 24 rows. Labels are required and limited to 32 characters. Blank numeric cells become missing values; decimals and negative values are accepted, within −1,000,000,000 to 1,000,000,000.

**Apply data** updates the preview and its data table. Closing with Escape, the close button or an outside click keeps the draft while the playground remains mounted. **Reset** restores demo data and all chart controls. Data is local to the mounted playground; it is not uploaded or saved across reloads.

The editor belongs to [ChartDemos.jsx](../src/components/Chart/ChartDemos.jsx), not the `Chart` API. Copying that playground also brings in Button, Checkbox, Slider and Popover and their dependencies. The minimal Chart starter uses only the chart component. Code and downloads contain source examples; they do not serialize your playground edits.

## Verify

With the dev server running on port 5173, run `node tests/chart.browser.mjs`. Set `TEST_URL` to test another server. Coverage includes keyboard exploration, series toggles, bar-shadow spacing, editing and applying data, draft retention, reset, missing and negative values, automated accessibility checks, mobile fit and reduced motion. Screenshots are written to `artifacts/`. This focused script is separate from `npm test` and CI.
