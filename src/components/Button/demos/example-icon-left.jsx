import React from 'react';
import { Button } from '../Button';

export default function Demo() {
  return (
    <Button icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>} iconMotion="plus">Add</Button>
  );
}
