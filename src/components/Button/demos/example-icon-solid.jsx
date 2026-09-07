import React from 'react';
import { IconButton } from '../../IconButton/IconButton';

export default function Demo() {
  return (
    <IconButton variant="solid" icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>} label="Add" />
  );
}
