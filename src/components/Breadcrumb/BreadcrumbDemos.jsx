import React from "react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./Breadcrumb";
import "../Essentials/EssentialsDemos.css";
import "./BreadcrumbShowcase.css";

export const breadcrumbExamples = [
  ["Everyday trail", "Navigation"],
  ["Long labels", "Layout"],
  ["Right to left", "Layout"],
];
export function BreadcrumbDemo({ example = "Everyday trail" }) {
  const rtl = example === "Right to left";
  const long = example === "Long labels";
  return (
    <div className="essential-demo essential-demo--wide">
      <div>
        <span className="essential-demo__eyebrow">A CLEAR WAY BACK</span>
        <p className="breadcrumb-demo__title">
          {long ? "Room for the whole story." : "Know where you are."}
        </p>
      </div>
      <Breadcrumb
        dir={rtl ? "rtl" : undefined}
        lang={rtl ? "ar" : undefined}
        aria-label={
          rtl
            ? "مسار التنقل"
            : long
              ? "Extended collection breadcrumb"
              : "Collection breadcrumb"
        }
      >
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="?page=home">
              {rtl ? "الرئيسية" : "Home"}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="?category=Display">
              {rtl
                ? "المنتجات"
                : long
                  ? "Objects for everyday living"
                  : "Products"}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {rtl
                ? "أحذية"
                : long
                  ? "The carefully considered summer collection"
                  : "Shoes"}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <p>
        Ancestor links open the catalog home and display collection. The current
        location stays out of the tab order.
      </p>
    </div>
  );
}
export function BreadcrumbPreview() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>Home</BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>Products</BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Shoes</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
