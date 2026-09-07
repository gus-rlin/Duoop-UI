import React from 'react';
import { Button } from '../Button';

export default function Demo() {
  return (
    <Button variant="outline" fullWidth icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6" /></svg>} iconPosition="right" iconMotion="arrow">Confirm my preferences and continue</Button>
  );
}
