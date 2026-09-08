import React from 'react';
import { CatalogShowcase } from '../CatalogShowcase';
import { PaginationDemo, paginationExamples } from './PaginationDemos';
import component from './Pagination.jsx?raw';
import css from './Pagination.css?raw';
import demos from './PaginationDemos.jsx?raw';

export function PaginationShowcase() {
  return (
    <CatalogShowcase
      entry={{
        id: 'builtin-pagination',
        name: 'Pagination',
        category: 'Navigation',
        notes: 'One page at a time. A clear path through larger collections.',
      }}
      number="40"
      section="NAVIGATION"
      examples={paginationExamples}
      Demo={PaginationDemo}
      wide={paginationExamples.map(([title]) => title)}
      accessibility="Tactile page controls, useful boundaries and a compact mobile layout."
      usage="Pagination is controlled and one-based. Pass pageCount and update page in onPageChange. First/last page controls disable at boundaries. Large sets use ellipses; mobile uses previous, current/total and next with larger targets. Update your visible content when the page changes."
      api={[
        [
          'page / pageCount',
          'One-based current page and total number of pages. Values are clamped for display.',
        ],
        ['onPageChange', 'Receives the requested one-based page.'],
        [
          'disabled / label',
          'Disable navigation and provide a distinct accessible name.',
        ],
      ]}
      sources={[
        ['Pagination.jsx', component],
        ['Pagination.css', css],
        ['PaginationDemos.jsx', demos],
      ]}
    />
  );
}
