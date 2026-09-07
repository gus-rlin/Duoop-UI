import React from 'react';
import { ResetLimit } from './ResetLimit';

export function ResetLimitDemo({ example }) {
  return <ResetLimit theme={example === 'Dark surface' ? 'dark' : 'light'} disabled={example === 'Disabled'} />;
}
