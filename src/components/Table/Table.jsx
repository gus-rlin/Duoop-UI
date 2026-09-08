import React, { useState } from 'react';
import { Checkbox } from '../Checkbox/Checkbox';
import { Button } from '../Button/Button';
import { Pagination } from '../Pagination/Pagination';
import './Table.css';

/** Semantic parts can also be used with a headless table engine. */
export function Table({ children, className = '', label = 'Data table', ...props }) {
  return (
    <div
      className="duoop-table-scroll"
      role="region"
      aria-label={label}
      tabIndex={0}
    >
      <table {...props} className={`duoop-table ${className}`}>
        {children}
      </table>
    </div>
  );
}
export function TableHeader(props) {
  return <thead {...props} />;
}
export function TableBody(props) {
  return <tbody {...props} />;
}
export function TableRow(props) {
  return <tr {...props} />;
}
export function TableHead(props) {
  return <th scope="col" {...props} />;
}
export function TableCell(props) {
  return <td {...props} />;
}
export function TableCaption(props) {
  return <caption {...props} />;
}

/** Local data only: stable row ids, column accessors and optional render/compare functions. */
export function DataTable({
  rows,
  columns,
  caption = 'Records',
  pageSize = 5,
  selectable = true,
  getRowId = (row) => row.id,
  isRowDisabled = () => false,
  selectedIds,
  onSelectionChange,
  emptyTitle = 'No results',
  emptyDescription = 'Try changing your filters.',
  emptyAction,
}) {
  const [sort, setSort] = useState(null);
  const [page, setPage] = useState(1);
  const [internal, setInternal] = useState([]);
  const selected = selectedIds ?? internal;
  const size = Number.isFinite(pageSize) ? Math.max(1, Math.floor(pageSize)) : 5;
  const column = columns.find((item) => item.key === sort?.key);
  const sorted = column
    ? [...rows].sort((a, b) => {
        const left = a[column.key],
          right = b[column.key];
        const result = column.compare
          ? column.compare(left, right)
          : typeof left === 'number' && typeof right === 'number'
            ? left - right
            : String(left ?? '').localeCompare(String(right ?? ''), undefined, {
                numeric: true,
              });
        return sort.direction === 'ascending' ? result : -result;
      })
    : rows;
  const pageCount = Math.max(1, Math.ceil(rows.length / size));
  const current = Math.min(page, pageCount);
  const visible = sorted.slice((current - 1) * size, current * size);
  const eligible = visible.filter((row) => !isRowDisabled(row)).map(getRowId);
  const checked =
    eligible.length > 0 && eligible.every((id) => selected.includes(id));
  const partial = !checked && eligible.some((id) => selected.includes(id));
  const selectionCount = rows.filter((row) =>
    selected.includes(getRowId(row)),
  ).length;
  function select(ids, enabled) {
    const next = enabled
      ? [...new Set([...selected, ...ids])]
      : selected.filter((id) => !ids.includes(id));
    if (selectedIds === undefined) setInternal(next);
    onSelectionChange?.(next);
  }
  return (
    <div className="duoop-data-table">
      <Table label={caption}>
        <TableCaption>{caption}</TableCaption>
        <TableHeader>
          <TableRow>
            {selectable && (
              <TableHead className="duoop-table__select">
                <Checkbox
                  aria-label="Select this page"
                  checked={checked}
                  indeterminate={partial}
                  disabled={!eligible.length}
                  onChange={(event) => select(eligible, event.target.checked)}
                />
              </TableHead>
            )}
            {columns.map((item) => (
              <TableHead
                key={item.key}
                aria-sort={
                  item.sortable === false
                    ? undefined
                    : sort?.key === item.key
                      ? sort.direction
                      : 'none'
                }
              >
                {item.sortable === false ? (
                  item.header
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setSort({
                        key: item.key,
                        direction:
                          sort?.key === item.key && sort.direction === 'ascending'
                            ? 'descending'
                            : 'ascending',
                      });
                      setPage(1);
                    }}
                    iconPosition="right"
                    icon={
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 20 20"
                        stroke="currentColor"
                        fill="none"
                        strokeWidth="1.5"
                        aria-hidden="true"
                      >
                        <path
                          d={
                            sort?.key === item.key
                              ? sort.direction === 'ascending'
                                ? 'M10 16V4m-4 4 4-4 4 4'
                                : 'M10 4v12m-4-4 4 4 4-4'
                              : 'm6 8 4-4 4 4m-8 4 4 4 4-4'
                          }
                        />
                      </svg>
                    }
                  >
                    {item.header}
                  </Button>
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {visible.map((row) => (
            <TableRow
              key={getRowId(row)}
              data-selected={selected.includes(getRowId(row)) || undefined}
            >
              {selectable && (
                <TableCell>
                  <Checkbox
                    aria-label={`Select ${row.label || row.name || getRowId(row)}`}
                    checked={selected.includes(getRowId(row))}
                    disabled={isRowDisabled(row)}
                    onChange={(event) =>
                      select([getRowId(row)], event.target.checked)
                    }
                  />
                </TableCell>
              )}
              {columns.map((item) => (
                <TableCell key={item.key}>
                  {item.render ? item.render(row[item.key], row) : row[item.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
          {!visible.length && (
            <TableRow>
              <TableCell colSpan={columns.length + (selectable ? 1 : 0)}>
                <div className="duoop-table__empty">
                  <strong>{emptyTitle}</strong>
                  <p>{emptyDescription}</p>
                  {emptyAction}
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="duoop-data-table__footer">
        <span role="status">
          {selectable
            ? `${selectionCount} of ${rows.length} selected`
            : `${rows.length} records`}
        </span>
        <Pagination
          page={current}
          pageCount={pageCount}
          onPageChange={setPage}
          label={`${caption} pages`}
        />
      </div>
    </div>
  );
}
