import React from 'react';

const paths = {
  star: 'm10 2 2.5 5.1 5.6.8-4 4 .9 5.6-5-2.7-5 2.7.9-5.6-4-4 5.6-.8Z',
  arrow: 'M4 10h12m-5-5 5 5-5 5',
  external: 'M7 4h9v9M16 4 4 16',
  search: 'm14 14 4 4M15 9A6 6 0 1 1 3 9a6 6 0 0 1 12 0',
  grid: 'M3 3h5v5H3zM12 3h5v5h-5zM3 12h5v5H3zM12 12h5v5h-5z',
  code: 'm6 5-5 5 5 5m8-10 5 5-5 5m-3-12-2 14',
  book: 'M3 3h6a3 3 0 0 1 3 3v12a3 3 0 0 0-3-3H3zm14 0h-2M12 6h5v9h-2',
  layers: 'm2 6 8-4 8 4-8 4zm0 4 8 4 8-4M2 14l8 4 8-4',
  close: 'm5 5 10 10M15 5 5 15',
  menu: 'M3 5h14M3 10h14M3 15h14',
  copy: 'M7 7h10v10H7zM13 3H3v10',
  check: 'm4 10 4 4 8-9',
  download: 'M10 2v11m-4-4 4 4 4-4M3 14v4h14v-4',
  settings: 'M3 5h14M3 15h14M7 2v6m6 4v6',
  motion: 'M2 10h3l3-7 4 14 3-7h3',
  github:
    'M7 17c-4 1-4-2-5-2m12 3v-3c0-1-.4-2-1-2 4-.5 5-2 5-5 0-1-.3-2-1-3 0-1 0-2-.2-3-2 0-3 1-3 1a12 12 0 0 0-7 0S5 2 3 2c-.5 1-.3 2-.2 3C2 6 2 7 2 8c0 3 1 4.5 5 5-.7.6-1 1-1 2v3',
};
export function Icon({ name, size = 18, ...props }) {
  return (
    <svg
      {...props}
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name] || paths.grid} />
    </svg>
  );
}
