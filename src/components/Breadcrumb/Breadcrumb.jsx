// Adapted from shadcn/ui (MIT). See THIRD_PARTY_NOTICES.md.
import React from "react";
import "./Breadcrumb.css";

export function Breadcrumb({ children, className = "", ...props }) {
  return (
    <nav
      aria-label="Breadcrumb"
      {...props}
      className={`duoop-breadcrumb ${className}`}
    >
      {children}
    </nav>
  );
}
export function BreadcrumbList({ className = "", ...props }) {
  return <ol {...props} className={`duoop-breadcrumb__list ${className}`} />;
}
export function BreadcrumbItem({ className = "", ...props }) {
  return <li {...props} className={`duoop-breadcrumb__item ${className}`} />;
}
export function BreadcrumbLink({ className = "", ...props }) {
  return <a {...props} className={`duoop-breadcrumb__link ${className}`} />;
}
export function BreadcrumbPage({ className = "", ...props }) {
  return (
    <span
      {...props}
      aria-current="page"
      className={`duoop-breadcrumb__page ${className}`}
    />
  );
}
export function BreadcrumbSeparator({
  children = "/",
  className = "",
  ...props
}) {
  return (
    <li
      {...props}
      role="presentation"
      aria-hidden="true"
      className={`duoop-breadcrumb__separator ${className}`}
    >
      {children}
    </li>
  );
}
