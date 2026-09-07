import React from 'react';
import { IconButton } from '../../IconButton/IconButton';

export default function Demo() {
  return (
    <IconButton variant="ghost" icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6" /></svg>} label="Close" />
  );
}
