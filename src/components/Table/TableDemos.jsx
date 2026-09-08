import React, { useState } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  DataTable,
} from './Table';
import { Input, Field } from '../Forms/Input';
import { Button } from '../Button/Button';
import { Badge } from '../Badge/Badge';
import '../Essentials/EssentialsDemos.css';

export const tableExamples = [
  ['Project activity', 'Data table'],
  ['Simple table', 'Primitive'],
  ['Empty results', 'States'],
];
const rows = [
  {
    id: '01',
    name: 'Studio website',
    owner: 'Maya Chen',
    status: 'In progress',
    budget: 4200,
  },
  {
    id: '02',
    name: 'Brand guidelines',
    owner: 'Oliver Park',
    status: 'Complete',
    budget: 1800,
  },
  {
    id: '03',
    name: 'Autumn campaign',
    owner: 'Nora Blake',
    status: 'In progress',
    budget: 6500,
  },
  {
    id: '04',
    name: 'Product photography',
    owner: 'Leo Martin',
    status: 'Review',
    budget: 2400,
  },
  {
    id: '05',
    name: 'Welcome sequence',
    owner: 'Maya Chen',
    status: 'Complete',
    budget: 950,
  },
  {
    id: '06',
    name: 'Packaging refresh',
    owner: 'Oliver Park',
    status: 'Review',
    budget: 3200,
  },
  {
    id: '07',
    name: 'Editorial system',
    owner: 'Nora Blake',
    status: 'In progress',
    budget: 5600,
  },
];
const columns = [
  {
    key: 'name',
    header: 'Project',
    render: (value, row) => (
      <span className="essential-demo__table-name">
        <strong>{value}</strong>
        <small>{row.owner}</small>
      </span>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    render: (value) => (
      <Badge tone={value === 'Complete' ? 'success' : 'neutral'}>{value}</Badge>
    ),
  },
  {
    key: 'budget',
    header: 'Budget',
    render: (value) =>
      new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0,
      }).format(value),
  },
];
export function TableDemo({ example = 'Project activity' }) {
  const [query, setQuery] = useState(
    example === 'Empty results' ? 'Unlisted project' : '',
  );
  if (example === 'Simple table')
    return (
      <div className="essential-demo essential-demo--wide">
        <Table label="Plan comparison">
          <TableCaption>Choose a workspace</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Plan</TableHead>
              <TableHead>Storage</TableHead>
              <TableHead>Monthly</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              ['Personal', '10 GB', '€12'],
              ['Studio', '100 GB', '€29'],
              ['Team', '1 TB', '€79'],
            ].map((row) => (
              <TableRow key={row[0]}>
                {row.map((cell) => (
                  <TableCell key={cell}>{cell}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  return (
    <div className="essential-demo essential-demo--wide">
      <div>
        <span className="essential-demo__eyebrow">THE WORK, AT A GLANCE</span>
        <h3>Projects in motion.</h3>
        <p>Sort a column, select a few rows, or find something specific.</p>
      </div>
      <Field label="Find a project">
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search projects or owners…"
        />
      </Field>
      <DataTable
        key={query}
        rows={rows.filter((row) =>
          `${row.name} ${row.owner}`.toLowerCase().includes(query.toLowerCase()),
        )}
        columns={columns}
        pageSize={4}
        caption="Studio projects"
        emptyAction={
          <Button variant="outline" onClick={() => setQuery('')}>
            Clear search
          </Button>
        }
      />
    </div>
  );
}
