import React, { lazy, Suspense } from 'react';
import { entries } from './catalog';

const modules = import.meta.glob('../components/**/*Showcase.jsx');
const showcases = new Map(
  entries.map((entry) => [
    entry.id,
    lazy(() =>
      modules[`../components/${entry.folder}/${entry.showcase}.jsx`]().then((module) => ({
        default: module[entry.showcase],
      })),
    ),
  ]),
);

export function Showcase({ entry }) {
  const Component = showcases.get(entry.id);
  return (
    <Suspense
      fallback={
        <div className="page-loading" role="status">
          Loading {entry.name} examples…
        </div>
      }
    >
      <Component kind={entry.kind} />
    </Suspense>
  );
}
