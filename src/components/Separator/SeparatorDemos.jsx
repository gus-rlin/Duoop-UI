import React from "react";
import { Separator } from "./Separator";
import { Button } from "../Button/Button";
import "../Essentials/EssentialsDemos.css";
import "./SeparatorShowcase.css";

export const separatorExamples = [
  ["Between sections", "Horizontal"],
  ["Between actions", "Vertical"],
  ["Decorative rule", "Horizontal"],
];
export function SeparatorDemo({ example = "Between sections" }) {
  if (example === "Between actions")
    return (
      <div className="essential-demo essential-demo--wide">
        <span className="essential-demo__eyebrow">DISTINCT DESTINATIONS</span>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            rowGap: 12,
          }}
        >
          <Button size="sm" variant="outline" href="?page=installation">
            Get started
          </Button>
          <Separator orientation="vertical" />
          <Button size="sm" variant="outline" href="?page=examples">
            Examples
          </Button>
        </div>
      </div>
    );
  const decorative = example === "Decorative rule";
  return (
    <div className="essential-demo essential-demo--wide" style={{ gap: 0 }}>
      <div>
        <span className="essential-demo__eyebrow">THE STUDIO JOURNAL</span>
        <p className="separator-demo__title">A little room between ideas.</p>
        <p>Notes, objects and the people who make them.</p>
      </div>
      <Separator decorative={decorative} />
      <div>
        <p className="separator-demo__title">
          {decorative ? "A quiet visual pause." : "Made for the everyday."}
        </p>
        <p>
          {decorative
            ? "A decorative rule stays out of the accessibility tree."
            : "A semantic separator marks the start of a new section."}
        </p>
      </div>
    </div>
  );
}
export function SeparatorPreview() {
  return (
    <div style={{ width: "75%", color: "#686565", fontSize: 13 }}>
      <span>The studio journal</span>
      <Separator decorative />
      <span>Made for the everyday.</span>
    </div>
  );
}
