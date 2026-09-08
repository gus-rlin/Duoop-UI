import React from 'react';
import { CatalogShowcase } from '../CatalogShowcase';
import { TableDemo, tableExamples } from './TableDemos';
import component from './Table.jsx?raw';
import css from './Table.css?raw';
import demos from './TableDemos.jsx?raw';

export function TableShowcase() {
  return (
    <CatalogShowcase
      entry={{
        id: 'builtin-table',
        name: 'Table',
        category: 'Display',
        notes:
          'The work, at a glance. Semantic tables and useful data interactions.',
      }}
      number="39"
      section="DISPLAY"
      examples={tableExamples}
      Demo={TableDemo}
      wide={tableExamples.map(([title]) => title)}
      accessibility="Sort, select, paginate and recover from empty results."
      usage="Table parts render semantic HTML and can wrap TanStack or another table engine. DataTable is a local-data example layer: rows need unique stable ids and columns need key/header. Numeric sorting is numeric, text uses locale comparison. Selection survives pagination; select-all applies only to eligible rows on the current page. Use server-owned state in an external engine for large datasets."
      api={[
        [
          'Table / TableHeader / TableBody',
          'Scrollable semantic table, thead and tbody. Table accepts label for its scroll region.',
        ],
        [
          'TableRow / TableHead / TableCell / TableCaption',
          'Composable tr, scoped th, td and caption.',
        ],
        [
          'DataTable rows / columns',
          'Column {key, header, sortable?, render?, compare?}; row id or getRowId.',
        ],
        [
          'selectedIds / onSelectionChange',
          'Optional controlled selected ids. isRowDisabled excludes rows from bulk selection.',
        ],
        [
          'pageSize / caption / emptyTitle / emptyDescription / emptyAction',
          'Local pagination, accessible caption and actionable empty state.',
        ],
      ]}
      sources={[
        ['Table.jsx', component],
        ['Table.css', css],
        ['TableDemos.jsx', demos],
      ]}
    />
  );
}
