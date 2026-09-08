import React from "react";
import { CatalogShowcase } from "../CatalogShowcase";
import { BreadcrumbDemo, breadcrumbExamples } from "./BreadcrumbDemos";
import component from "./Breadcrumb.jsx?raw";
import css from "./Breadcrumb.css?raw";
import demos from "./BreadcrumbDemos.jsx?raw";

export function BreadcrumbShowcase() {
  return (
    <CatalogShowcase
      entry={{
        id: "builtin-breadcrumb",
        name: "Breadcrumb",
        category: "Navigation",
        notes: "A familiar path, with a little depth.",
      }}
      number="46"
      section="NAVIGATION"
      examples={breadcrumbExamples}
      Demo={BreadcrumbDemo}
      wide={breadcrumbExamples.map(([title]) => title)}
      accessibility="Native links, a clear current page and room for longer paths."
      usage="Compose a nav, ordered list, items and ancestor links. Mark exactly one final item with BreadcrumbPage. Separators are decorative. Native anchors preserve keyboard and new-tab navigation. Long labels wrap without hiding ancestors."
      api={[
        ["Breadcrumb", "Named navigation landmark; accepts native nav props."],
        ["BreadcrumbList / BreadcrumbItem", "Ordered list and list items."],
        [
          "BreadcrumbLink",
          "Native anchor; provide href and optional router click handler.",
        ],
        ["BreadcrumbPage", "Current page, excluded from the tab order."],
        [
          "BreadcrumbSeparator",
          "Decorative slash by default; accepts custom children.",
        ],
      ]}
      sources={[
        ["Breadcrumb.jsx", component],
        ["Breadcrumb.css", css],
        ["BreadcrumbDemos.jsx", demos],
      ]}
    />
  );
}
