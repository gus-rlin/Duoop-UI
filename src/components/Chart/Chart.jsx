import React, { useEffect, useId, useRef, useState } from "react";
import "./Chart.css";

const defaultFormat = (value) =>
  new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
const finite = (value) => typeof value === "number" && Number.isFinite(value);

// Horizontal Bézier tangents keep each segment inside its endpoint values.
function trace(points, smooth) {
  return points
    .map(([x, y], index) => {
      if (!index) return `M${x},${y}`;
      const [px, py] = points[index - 1];
      const mid = (px + x) / 2;
      return smooth ? `C${mid},${py} ${mid},${y} ${x},${y}` : `L${x},${y}`;
    })
    .join(" ");
}

export function Chart({
  data = [],
  series = [{ key: "value", label: "Value", color: "#d6e4c4" }],
  xKey = "label",
  type = "area",
  title = "The bigger picture",
  description,
  height = 300,
  curve = "smooth",
  strokeWidth = 3,
  fillOpacity = 0.65,
  showGrid = true,
  showPoints = true,
  showLegend = true,
  showTable = true,
  animate = true,
  referenceValue,
  referenceLabel = "Target",
  formatValue = defaultFormat,
  className = "",
  style,
}) {
  const id = useId();
  const plot = useRef(null);
  const [width, setWidth] = useState(640);
  const [active, setActive] = useState(null);
  const [hidden, setHidden] = useState([]);
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) =>
      setWidth(Math.max(240, entry.contentRect.width)),
    );
    observer.observe(plot.current);
    return () => observer.disconnect();
  }, []);
  const visible = series.filter((item) => !hidden.includes(item.key));
  const values = data
    .flatMap((row) => visible.map((item) => row[item.key]))
    .filter(finite);
  const bounds = finite(referenceValue) ? [...values, referenceValue] : values;
  const low = bounds.reduce((result, value) => Math.min(result, value), 0);
  const high = bounds.reduce((result, value) => Math.max(result, value), 0);
  const span = high - low || 1;
  const magnitude = 10 ** Math.floor(Math.log10(span / 4));
  const tickStep = [1, 2, 2.5, 5, 10].find(value => value * magnitude >= span / 4) * magnitude;
  const min = Math.floor(low / tickStep) * tickStep;
  const max = Math.ceil(high / tickStep) * tickStep || tickStep;
  const h = Math.max(200, Math.min(600, Number(height) || 300));
  const left = 64,
    right = width - 24,
    top = 28,
    bottom = h - 38;
  const step = (right - left) / Math.max(1, data.length);
  const x = (index) => left + step * (index + 0.5);
  const y = (value) => bottom - ((value - min) / (max - min)) * (bottom - top);
  const baseline = y(0);
  const selected = active === null ? null : Math.min(active, data.length - 1);
  const row = selected === null ? null : data[selected];
  const ticks = Array.from(
    { length: Math.round((max - min) / tickStep) + 1 },
    (_, index) => min + tickStep * index,
  );
  const labelStride = Math.max(
    1,
    Math.ceil(data.length / Math.max(2, Math.floor((right - left) / 64))),
  );
  const weight = Math.max(1, Math.min(8, Number(strokeWidth) || 3));
  const opacity = Math.max(0, Math.min(1, Number(fillOpacity) || 0));
  function navigate(event) {
    if (
      !data.length ||
      !["ArrowLeft", "ArrowRight", "Home", "End", "Escape"].includes(event.key)
    )
      return;
    event.preventDefault();
    if (event.key === "Escape") return setActive(null);
    if (event.key === "Home") return setActive(0);
    if (event.key === "End") return setActive(data.length - 1);
    setActive((index) =>
      Math.max(
        0,
        Math.min(
          data.length - 1,
          (index ?? -1) + (event.key === "ArrowRight" ? 1 : -1),
        ),
      ),
    );
  }
  return (
    <section
      className={`duoop-chart ${className}`}
      style={style}
      data-animate={animate}
      aria-labelledby={`${id}-title`}
    >
      <header className="duoop-chart__header">
        <div>
          <span className="duoop-chart__eyebrow">
            A LITTLE DATA. A CLEARER PICTURE.
          </span>
          <h2 id={`${id}-title`}>{title}</h2>
          {description && <p>{description}</p>}
        </div>
        <svg
          className="duoop-chart__emblem"
          viewBox="0 0 56 56"
          aria-hidden="true"
        >
          <path d="M7 49h42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <g
            fill="var(--chart-accent, #d6e4c4)"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="9" y="33" width="8" height="11" rx="1.5" />
            <rect x="24" y="27" width="8" height="17" rx="1.5" />
            <rect x="39" y="20" width="8" height="24" rx="1.5" />
          </g>
          <path
            d="m9 24 14-10 10 3L47 7m-8 0h8v8"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </header>
      {showLegend && (
        <div className="duoop-chart__legend" aria-label="Visible series">
          {series.map((item, index) => (
            <button
              type="button"
              key={item.key}
              aria-pressed={!hidden.includes(item.key)}
              onClick={() =>
                setHidden((current) =>
                  current.includes(item.key)
                    ? current.filter((key) => key !== item.key)
                    : [...current, item.key],
                )
              }
            >
              <svg
                width="24"
                height="16"
                viewBox="0 0 24 16"
                aria-hidden="true"
              >
                <path
                  d="M2 8h20"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray={index % 2 ? "3 3" : undefined}
                />
                <rect
                  x="7"
                  y="3"
                  width="10"
                  height="10"
                  rx={index % 2 ? 0 : 5}
                  fill={item.color || "#d6e4c4"}
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
              {item.label || item.key}
            </button>
          ))}
        </div>
      )}
      <div
        ref={plot}
        className="duoop-chart__plot"
        tabIndex={data.length ? 0 : undefined}
        role="group"
        aria-label="Explore chart"
        aria-describedby={`${id}-help`}
        onKeyDown={navigate}
        onFocus={() => data.length && setActive(0)}
        onPointerLeave={() => setActive(null)}
        onPointerMove={(event) => {
          if (!data.length) return;
          const position =
            event.clientX - event.currentTarget.getBoundingClientRect().left;
          setActive(
            Math.max(
              0,
              Math.min(data.length - 1, Math.floor((position - left) / step)),
            ),
          );
        }}
      >
        <svg
          width="100%"
          height={h}
          viewBox={`0 0 ${width} ${h}`}
          role="img"
          aria-label={`${title}. ${data.length} categories, ${visible.length} visible series.`}
        >
          <defs>
            <pattern
              id={`${id}-hatch`}
              width="8"
              height="8"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(35)"
            >
              <path
                d="M0 0v8"
                stroke="currentColor"
                strokeWidth="1"
                opacity=".12"
              />
            </pattern>
          </defs>
          {ticks.map((value, index) => (
            <g key={index}>
              <text
                x={left - 12}
                y={y(value) + 4}
                textAnchor="end"
                className="duoop-chart__tick"
              >
                {formatValue(value)}
              </text>
              {showGrid && (
                <path
                  d={`M${left},${y(value)}H${right}`}
                  className="duoop-chart__grid"
                />
              )}
            </g>
          ))}
          <path
            d={`M${left},${baseline}H${right}`}
            stroke="currentColor"
            strokeWidth="1.5"
          />
          {finite(referenceValue) && (
            <g>
              <path
                d={`M${left},${y(referenceValue)}H${right}`}
                stroke="currentColor"
                strokeDasharray="5 5"
              />
              <text
                x={right}
                y={y(referenceValue) - 8}
                textAnchor="end"
                className="duoop-chart__tick"
              >
                {referenceLabel} · {formatValue(referenceValue)}
              </text>
            </g>
          )}
          <g key={type} className="duoop-chart__marks">
            {visible.map((item, seriesIndex) => {
              const color = item.color || "#d6e4c4";
              const segments = [];
              data.forEach((record, index) => {
                if (!finite(record[item.key])) return;
                if (index === 0 || !finite(data[index - 1][item.key]))
                  segments.push([]);
                segments[segments.length - 1].push([
                  x(index),
                  y(record[item.key]),
                ]);
              });
              if (type === "bar")
                return (
                  <g key={item.key}>
                    {data.map((record, index) => {
                      if (!finite(record[item.key])) return null;
                      const bw = (step * 0.68) / Math.max(1, visible.length);
                      const bx = x(index) - step * 0.34 + seriesIndex * bw;
                      // Offset the whole bar away from zero so even short bars
                      // keep their height while the shadow clears the axis.
                      const lift = record[item.key] < 0 ? 4 : -6;
                      const by = Math.min(y(record[item.key]), baseline) + lift;
                      const bh = Math.abs(y(record[item.key]) - baseline);
                      if (!bh) return null;
                      return (
                        <g
                          key={index}
                          opacity={
                            selected === null || selected === index ? 1 : 0.45
                          }
                        >
                          <rect
                            x={bx + 2}
                            y={by + 3}
                            width={Math.max(1, bw - 4)}
                            height={bh}
                            rx="3"
                            fill="currentColor"
                          />
                          <rect
                            x={bx}
                            y={by}
                            width={Math.max(1, bw - 4)}
                            height={bh}
                            rx="3"
                            fill={color}
                            stroke="currentColor"
                            strokeWidth="1.8"
                          />
                        </g>
                      );
                    })}
                  </g>
                );
              return (
                <g key={item.key}>
                  {segments.map((points, index) => {
                    const line = trace(points, curve === "smooth");
                    const area = `${line}L${points.at(-1)[0]},${baseline}L${points[0][0]},${baseline}Z`;
                    return (
                      <g key={index}>
                        {type === "area" && (
                          <>
                            <path d={area} fill={color} opacity={opacity} />
                            <path d={area} fill={`url(#${id}-hatch)`} />
                          </>
                        )}
                        <path
                          d={line}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={weight + 2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d={line}
                          fill="none"
                          stroke={color}
                          strokeWidth={weight}
                          strokeDasharray={seriesIndex % 2 ? "8 5" : undefined}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                    );
                  })}
                  {data.map(
                    (record, index) =>
                      finite(record[item.key]) &&
                      (showPoints ||
                        selected === index ||
                        data.length === 1) && (
                        <circle
                          key={index}
                          cx={x(index)}
                          cy={y(record[item.key])}
                          r={selected === index ? 6 : 3.5}
                          fill={color}
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      ),
                  )}
                </g>
              );
            })}
          </g>
          {row && (
            <path
              d={`M${x(selected)},${top}V${bottom}`}
              stroke="currentColor"
              strokeDasharray="3 5"
              opacity=".4"
              pointerEvents="none"
            />
          )}
          {data.map(
            (record, index) =>
              index % labelStride === 0 && (
                <text
                  key={index}
                  x={x(index)}
                  y={h - 10}
                  textAnchor="middle"
                  className="duoop-chart__tick"
                >
                  {String(record[xKey] ?? "").slice(0, 12)}
                </text>
              ),
          )}
          {(!values.length || !visible.length) && (
            <text
              x={(left + right) / 2}
              y={h / 2}
              textAnchor="middle"
              className="duoop-chart__empty"
            >
              {!data.length
                ? "No data yet"
                : !visible.length
                  ? "Select a series to explore"
                  : "No numeric values"}
            </text>
          )}
        </svg>
      </div>
      <footer className="duoop-chart__footer">
        <p id={`${id}-help`}>Hover or use ← → to explore.</p>
        <output aria-live="polite" aria-atomic="true">
          {row ? (
            <>
              <strong>{String(row[xKey] ?? "")}</strong>
              {visible.map((item) => (
                <span key={item.key}>
                  {item.label || item.key}:{" "}
                  <b>
                    {finite(row[item.key]) ? formatValue(row[item.key]) : "—"}
                  </b>
                </span>
              ))}
            </>
          ) : (
            "Every point tells a story."
          )}
        </output>
      </footer>
      {showTable && (
        <details className="duoop-chart__data">
          <summary>View data table</summary>
          <div>
            <table>
              <caption>{title}</caption>
              <thead>
                <tr>
                  <th scope="col">{xKey}</th>
                  {series.map((item) => (
                    <th scope="col" key={item.key}>
                      {item.label || item.key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((record, index) => (
                  <tr key={index}>
                    <th scope="row">{record[xKey]}</th>
                    {series.map((item) => (
                      <td key={item.key}>
                        {finite(record[item.key])
                          ? formatValue(record[item.key])
                          : "—"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      )}
    </section>
  );
}
