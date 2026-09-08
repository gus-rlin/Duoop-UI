import React from "react";
import { createRoot } from "react-dom/client";
import "../../src/base.css";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../src/components/Breadcrumb/Breadcrumb";
import { Separator } from "../../src/components/Separator/Separator";

const longWord = "VeryLongUnbrokenCollectionName".repeat(6);
createRoot(document.getElementById("root")).render(
  <div style={{ padding: 24 }}>
    <h1>Navigation fixtures</h1>
    <Breadcrumb aria-label="Long path">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#destination">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#destination">{longWord}</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{longWord}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
    <button type="button">After breadcrumb</button>
    <Breadcrumb aria-label="Single page">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbPage>Home</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
    <div id="rules" style={{ display: "flex", height: 80 }}>
      <span>Before</span>
      <Separator orientation="vertical" />
      <span>After</span>
    </div>
    <Separator data-testid="fallback" orientation="invalid" />
    <Separator data-testid="decorative" decorative />
    <h2 id="destination">Destination</h2>
  </div>,
);
