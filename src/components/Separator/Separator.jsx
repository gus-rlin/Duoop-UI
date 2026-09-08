// Adapted from Radix Primitives (MIT). See THIRD_PARTY_NOTICES.md.
import React from "react";
import "./Separator.css";

export function Separator({
  orientation = "horizontal",
  decorative = false,
  className = "",
  ...props
}) {
  const direction = orientation === "vertical" ? "vertical" : "horizontal";
  return (
    <div
      {...props}
      role={decorative ? "none" : "separator"}
      aria-hidden={decorative || undefined}
      aria-orientation={decorative ? undefined : direction}
      data-orientation={direction}
      className={`duoop-separator ${className}`}
    />
  );
}
