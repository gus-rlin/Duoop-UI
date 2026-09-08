import React, { lazy, Suspense, useEffect, useState } from "react";
import { Button } from "../components/Button/Button";
import { Badge } from "../components/Badge/Badge";
import { Tabs } from "../components/Tabs/Tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/Card/Card";
import { BundleFiles } from "../components/Button/Documentation";
import { collectFiles } from "./source-bundle";
import { Icon } from "./Icon";
import landingSource from "../examples/LandingPage.jsx?raw";
import pageStyles from "../examples/pages.css?raw";

const Landing = lazy(() => import("../examples/LandingPage"));
const pages = {
  landing: {
    name: "The outdoor adventure landing page",
    component: Landing,
    file: "LandingPage",
    source: landingSource,
    description:
      "An outdoor tourism page with excursion options, FAQ and an adventure idea dialog.",
    components:
      "Button · Card · Badge · Text Loop · Cards Carousel · Accordion · Dialog · Input · Radio Group",
  },

};

export function Examples({ selected, mode, onMode }) {
  const page = pages[selected];
  const [bundle, setBundle] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!page) return;
    let active = true;
    setBundle(null);
    setError("");
    const code = page.source
      .replaceAll("'../components/", "'./components/")
      .replace("'./pages.css'", "'./example.css'");
    collectFiles(["src/base.css", "src/App.jsx"], {
      "src/App.jsx": code,
      "src/example.css": pageStyles,
    }).then(
      (value) => {
        if (active) setBundle(value);
      },
      (reason) => {
        if (active) setError(reason.message);
      },
    );
    return () => {
      active = false;
    };
  }, [page]);
  if (!page)
    return (
      <div className="examples-index">
        <span className="eyebrow">BUILT WITH DUOOP</span>
        <h1>
          Good on their own.
          <br />
          Better together.
        </h1>
        <p className="page-intro">
          Complete pages, composed from the same components you see in the
          library. Try them, explore their code, and make them yours.
        </p>
        <div className="page-example-grid">
          {Object.entries(pages).map(([id, item]) => (
            <Card
              key={id}
              className="page-example-card"
              variant="elevated"
              interactive
              href={`?page=examples&example=${id}`}
            >
              <div className={`page-example-art page-example-art--${id}`}>
                <div aria-hidden="true" className="page-example-window">
                  <span>Nature Escape <i>Made with Duoop</i></span>
                  <img className="page-example-landscape" src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=900&q=85" alt="" />
                  <b>Take a breath.<br />Find your wild.</b>
                  <p>From forest trails to mountain lakes.</p>
                  <em>Find your adventure ↗</em>
                </div>
              </div>
              <CardHeader>
                <Badge>LANDING PAGE</Badge>
                <CardTitle>{item.name}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
                <span className="text-link">
                  Explore the page <Icon name="arrow" />
                </span>
              </CardHeader>
            </Card>
          ))}
        </div>
        <p className="source-note">
          Every download includes the page, its styles and all the Duoop
          components it uses.
        </p>
      </div>
    );
  const Page = page.component;
  return (
    <div className="example-detail">
      <a className="back-link" href="?page=examples">
        ← All examples
      </a>
      <header className="detail-heading">
        <div>
          <span className="eyebrow">COMPOSED WITH DUOOP</span>
          <h1>{page.name}</h1>
          <p>{page.description}</p>
        </div>
      </header>
      <Tabs
        keepMounted
        key={selected}
        label="Page example documentation"
        value={mode}
        onValueChange={onMode}
        variant="underline"
        items={[
          {
            value: "preview",
            label: "Preview",
            panel: (
              <div className="full-page-preview">
                <Suspense fallback={<p role="status">Loading page…</p>}>
                  <Page embedded />
                </Suspense>
              </div>
            ),
          },
          {
            value: "code",
            label: "Code",
            panel: bundle ? (
              <BundleFiles bundle={bundle} name={selected} />
            ) : (
              <p role={error ? "alert" : "status"}>
                {error || "Preparing the complete page…"}
              </p>
            ),
          },
          {
            value: "installation",
            label: "Installation",
            panel: (
              <div className="installation-panel">
                <h2>Recreate this page</h2>
                <ol className="installation-steps">
                  <li>
                    <h3>Download or copy the files</h3>
                    <p>
                      The Code tab includes <code>src/App.jsx</code>,{" "}
                      <code>src/example.css</code>, <code>src/base.css</code>{" "}
                      and all component files. Preserve their paths.
                    </p>
                  </li>
                  <li>
                    <h3>Install and run</h3>
                    <p>
                      The downloaded project includes its dependencies. With
                      Node.js 22.18+ in the 22.x line, or 24.11+, run <code>npm install</code>, then{" "}
                      <code>npm run dev</code>. In an existing React app,
                      install any listed additional packages and import{" "}
                      <code>base.css</code> once.
                    </p>
                  </li>
                  <li>
                    <h3>Make the interactions your own</h3>
                    <p>
                      The landing page’s excursion selector, accordion and adventure dialog are functional. Ideas stay local; connect start() to your service and supply your own pricing and content.
                    </p>
                  </li>
                </ol>
                <h3>Components in this composition</h3>
                <p>{page.components}</p>
                <Button href="?page=installation" variant="outline">
                  Full installation guide
                </Button>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
