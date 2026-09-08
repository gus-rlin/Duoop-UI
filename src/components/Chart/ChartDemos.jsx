import React, { useState } from "react";
import { Chart } from "./Chart";
import { Button } from "../Button/Button";
import { Checkbox } from "../Checkbox/Checkbox";
import { Slider } from "../Slider/Slider";
import { Popover, PopoverTrigger, PopoverContent, PopoverClose } from "../Popover/Popover";

const data = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"].map(
  (label, index) => ({
    label,
    studio: [24, 38, 31, 56, 48, 72, 64, 92][index],
    shop: [15, 22, 18, 34, 29, 44, 38, 58][index],
  }),
);
const series = [
  { key: "studio", label: "Studio", color: "#d6e4c4" },
  { key: "shop", label: "Shop", color: "#e4d9cd" },
];
export const chartExamples = [
  ["The bigger picture", "Essentials"],
  ["In good company", "Essentials"],
  ["One month at a time", "Essentials"],
  ["Above and below", "Data states"],
  ["A missing chapter", "Data states"],
  ["A blank canvas", "Data states"],
];

function ChartDataEditor({ rows, onApply, compare }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(rows);
  function update(index, key, value) {
    setDraft(current => current.map((row, i) => i === index ? { ...row, [key]: value } : row));
  }
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger><Button size="sm" variant="outline">Our data</Button></PopoverTrigger>
      <PopoverContent label="Our data" align="end" className="chart-data-editor">
        <form onSubmit={event => {
          event.preventDefault();
          onApply(draft.map(row => ({
            label: row.label.trim(),
            studio: row.studio === "" || row.studio === null ? null : Number(row.studio),
            shop: row.shop === "" || row.shop === null ? null : Number(row.shop),
          })));
          setOpen(false);
        }}>
          <div className="chart-data-editor__heading">
            <h3>Our data</h3>
            <PopoverClose><button type="button" aria-label="Close data editor">×</button></PopoverClose>
          </div>
          <p>Edit the labels and values. Leave a value blank for a gap.</p>
          <div className="chart-data-editor__rows">
            <table>
              <thead><tr><th scope="col">Label</th><th scope="col">Studio</th>{compare && <th scope="col">Shop</th>}<th scope="col"><span className="duoop-sr-only">Remove</span></th></tr></thead>
              <tbody>{draft.map((row, index) => (
                <tr key={index}>
                  <td><input aria-label={`Label ${index + 1}`} value={row.label} required pattern=".*\S.*" maxLength={32} onChange={event => update(index, "label", event.target.value)} /></td>
                  {(compare ? ["studio", "shop"] : ["studio"]).map(key => (
                    <td key={key}><input type="number" step="any" min={-1000000000} max={1000000000} aria-label={`${key === "studio" ? "Studio" : "Shop"} ${index + 1}`} value={row[key] ?? ""} onChange={event => update(index, key, event.target.value)} /></td>
                  ))}
                  <td><button type="button" aria-label={`Remove row ${index + 1}`} onClick={() => setDraft(current => current.filter((_, i) => i !== index))}>×</button></td>
                </tr>
              ))}</tbody>
            </table>
            {!draft.length && <p>Add a row to start your chart.</p>}
          </div>
          <div className="chart-data-editor__actions">
            <Button size="sm" variant="outline" disabled={draft.length >= 24} onClick={() => setDraft(current => [...current, { label: "", studio: "", shop: "" }])}>Add row</Button>
            <Button size="sm" type="submit">Apply data</Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}

export function ChartPlayground() {
  const [rows, setRows] = useState(data);
  const [type, setType] = useState("area");
  const [curve, setCurve] = useState("smooth");
  const [color, setColor] = useState("#d6e4c4");
  const [stroke, setStroke] = useState([3]);
  const [opacity, setOpacity] = useState([65]);
  const [height, setHeight] = useState([300]);
  const [grid, setGrid] = useState(true);
  const [points, setPoints] = useState(true);
  const [compare, setCompare] = useState(false);
  const [target, setTarget] = useState(false);
  const [revision, setRevision] = useState(0);
  function reset() {
    setRows(data);
    setRevision(value => value + 1);
    setType("area");
    setCurve("smooth");
    setColor("#d6e4c4");
    setStroke([3]);
    setOpacity([65]);
    setHeight([300]);
    setGrid(true);
    setPoints(true);
    setCompare(false);
    setTarget(false);
  }
  return (
    <section className="chart-playground" aria-label="Chart playground">
      <div className="chart-playground__stage">
        <Chart
          key={revision}
          data={rows}
          series={[{ ...series[0], color }, ...(compare ? [series[1]] : [])]}
          title="Small steps. Real growth."
          description="A studio’s year in the making · Monthly projects · Demo data"
          type={type}
          curve={curve}
          strokeWidth={stroke[0]}
          fillOpacity={opacity[0] / 100}
          height={height[0]}
          showGrid={grid}
          showPoints={points}
          referenceValue={target ? 75 : undefined}
        />
      </div>
      <div className="chart-controls">
        <fieldset>
          <legend>Chart type</legend>
          <div className="chart-controls__choices">
            {["area", "line", "bar"].map((value) => (
              <Button
                size="sm"
                key={value}
                selected={type === value}
                variant={type === value ? "solid" : "outline"}
                onClick={() => setType(value)}
              >
                {value[0].toUpperCase() + value.slice(1)}
              </Button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend>Line shape</legend>
          <div className="chart-controls__choices">
            {["smooth", "linear"].map((value) => (
              <Button
                size="sm"
                key={value}
                selected={curve === value}
                disabled={type === "bar"}
                variant={curve === value ? "solid" : "outline"}
                onClick={() => setCurve(value)}
              >
                {value[0].toUpperCase() + value.slice(1)}
              </Button>
            ))}
          </div>
        </fieldset>
        <label>
          Series color
          <input
            type="color"
            value={color}
            onChange={(event) => setColor(event.target.value)}
          />
        </label>
        <Slider
          label="Stroke width"
          min={1}
          max={8}
          step={1}
          value={stroke}
          onValueChange={setStroke}
          disabled={type === "bar"}
          formatValue={(value) => `${value}px`}
        />
        <Slider
          label="Area opacity"
          min={0}
          max={100}
          step={5}
          value={opacity}
          onValueChange={setOpacity}
          disabled={type !== "area"}
          formatValue={(value) => `${value}%`}
        />
        <Slider
          label="Chart height"
          min={220}
          max={440}
          step={20}
          value={height}
          onValueChange={setHeight}
          formatValue={(value) => `${value}px`}
        />
        <div className="chart-controls__toggles">
          <Checkbox
            label="Grid"
            checked={grid}
            onChange={(event) => setGrid(event.target.checked)}
          />
          <Checkbox
            label="Points"
            checked={points}
            disabled={type === "bar"}
            onChange={(event) => setPoints(event.target.checked)}
          />
          <Checkbox
            label="Compare series"
            checked={compare}
            onChange={(event) => setCompare(event.target.checked)}
          />
          <Checkbox
            label="Target line"
            checked={target}
            onChange={(event) => setTarget(event.target.checked)}
          />
          <Button size="sm" variant="outline" onClick={reset}>
            Reset
          </Button>
          <div className="chart-controls__data">
            <ChartDataEditor key={revision} rows={rows} onApply={setRows} compare={compare} />
          </div>
        </div>
      </div>
    </section>
  );
}
export function ChartDemo({ example = "The bigger picture" }) {
  const negative = example === "Above and below";
  const rows =
    example === "A blank canvas"
      ? []
      : data.map((row, index) => ({
          ...row,
          studio: negative
            ? row.studio - 45
            : example === "A missing chapter" && index === 3
              ? null
              : row.studio,
        }));
  return (
    <Chart
      data={rows}
      title={example}
      description={
        negative
          ? "Monthly balance · Demo data"
          : "Monthly projects · Demo data"
      }
      series={example === "In good company" ? series : [series[0]]}
      type={
        example === "One month at a time" || negative
          ? "bar"
          : example === "In good company" || example === "A missing chapter"
            ? "line"
            : "area"
      }
      height={240}
    />
  );
}
export function ChartPreview() {
  return (
    <svg
      className="chart-mini"
      viewBox="0 0 320 190"
      fill="none"
      aria-hidden="true"
    >
      <rect x="12" y="13" width="296" height="166" rx="10" fill="#1d1b1b" />
      <rect
        x="12"
        y="9"
        width="296"
        height="166"
        rx="10"
        fill="white"
        stroke="#1d1b1b"
        strokeWidth="2"
      />
      <text x="32" y="38" fill="#373434" fontSize="13" fontWeight="800">
        THE BIGGER PICTURE
      </text>
      <path
        d="M32 67h256M32 103h256M32 139h256"
        stroke="#373434"
        strokeOpacity=".18"
        strokeDasharray="3 5"
      />
      <path
        d="M32 135C55 135 55 109 78 109S101 123 124 123S147 75 170 75S193 91 216 91S254 53 288 53V151H32Z"
        fill="#d6e4c4"
      />
      <path
        d="M32 135C55 135 55 109 78 109S101 123 124 123S147 75 170 75S193 91 216 91S254 53 288 53"
        stroke="#1d1b1b"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle
        cx="170"
        cy="75"
        r="5"
        fill="white"
        stroke="#1d1b1b"
        strokeWidth="2"
      />
      <path d="M32 151h256" stroke="#373434" />
    </svg>
  );
}
