import React from "react";
import { CatalogShowcase } from "../CatalogShowcase";
import { SeparatorDemo, separatorExamples } from "./SeparatorDemos";
import component from "./Separator.jsx?raw";
import css from "./Separator.css?raw";
import demos from "./SeparatorDemos.jsx?raw";

export function SeparatorShowcase() {
  return (
    <CatalogShowcase
      entry={{
        id: "builtin-separator",
        name: "Separator",
        category: "Display",
        notes: "Give each part its own space.",
      }}
      number="47"
      section="DISPLAY"
      examples={separatorExamples}
      Demo={SeparatorDemo}
      wide={separatorExamples.map(([title]) => title)}
      accessibility="Horizontal and vertical rules, with deliberate accessibility semantics."
      usage="Use a semantic separator for a thematic break or decorative for a visual rule. Vertical separators stretch inside a flex row; give the parent a height when needed. Set --separator-color to adapt the line to its surface."
      api={[
        ["orientation", "horizontal (default) or vertical."],
        [
          "decorative",
          "false by default; true removes the rule from the accessibility tree.",
        ],
        [
          "className / style",
          "Native div props; customize spacing and --separator-color.",
        ],
      ]}
      sources={[
        ["Separator.jsx", component],
        ["Separator.css", css],
        ["SeparatorDemos.jsx", demos],
      ]}
    />
  );
}
