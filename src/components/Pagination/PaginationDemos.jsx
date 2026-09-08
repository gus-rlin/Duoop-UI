import React, { useState } from 'react';
import { Pagination } from './Pagination';
import '../Essentials/EssentialsDemos.css';

export const paginationExamples = [
  ['Browse the archive', 'Everyday'],
  ['Many pages', 'Navigation'],
  ['One page', 'States'],
];
export function PaginationDemo({ example = 'Browse the archive' }) {
  const [page, setPage] = useState(example === 'Many pages' ? 24 : 1);
  const names = [
    'A quieter workspace',
    'Notes from the studio',
    'The shape of a good idea',
    'Small things, well made',
    'Working with the seasons',
    'A place to begin',
    'Objects with a purpose',
    'The everyday collection',
    'Room to think',
    'On making things last',
    'An afternoon in Paris',
    'A different perspective',
  ];
  const count = example === 'One page' ? 1 : example === 'Many pages' ? 50 : 4;
  return (
    <div className="essential-demo essential-demo--wide">
      <div>
        <span className="essential-demo__eyebrow">FROM THE JOURNAL</span>
        <h3>A few pages worth keeping.</h3>
      </div>
      {example === 'Browse the archive' && (
        <div className="essential-demo__records">
          {names.slice((page - 1) * 3, page * 3).map((name, index) => (
            <div key={name}>
              <span>{name}</span>
              <small>{String((page - 1) * 3 + index + 1).padStart(2, '0')}</small>
            </div>
          ))}
        </div>
      )}
      <Pagination page={page} pageCount={count} onPageChange={setPage} />
      <span className="essential-demo__result" role="status">
        Page {page} of {count}
      </span>
    </div>
  );
}
