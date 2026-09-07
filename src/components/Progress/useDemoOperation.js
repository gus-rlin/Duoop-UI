import { useEffect, useRef, useState } from 'react';

/** Explicitly simulated work, shared by the catalogue's progress and toast demos. */
export function useDemoOperation() {
  const [operation, setOperation] = useState({ state:'waiting', value:0, run:0 });
  const failure = useRef(false);
  useEffect(() => {
    if (operation.state === 'preparing') {
      const timer = setTimeout(() => setOperation(old => ({ ...old, state:'running' })), 900);
      return () => clearTimeout(timer);
    }
    if (operation.state === 'finalizing') {
      const timer = setTimeout(() => setOperation(old => ({ ...old, state:'success' })), 800);
      return () => clearTimeout(timer);
    }
    if (operation.state !== 'running') return undefined;
    const timer = setInterval(() => setOperation(old => {
      const value = Math.min(100, old.value + 10);
      return { ...old, value, state:failure.current && value >= 60 ? 'error' : value === 100 ? 'finalizing' : 'running' };
    }), 320);
    return () => clearInterval(timer);
  }, [operation.state, operation.run]);
  return {
    ...operation,
    start:({ prepare = false, fail = false } = {}) => { failure.current = fail; setOperation(old => ({ state:prepare ? 'preparing' : 'running', value:0, run:old.run + 1 })); },
    pause:() => setOperation(old => old.state === 'running' ? { ...old, state:'paused' } : old),
    resume:() => setOperation(old => old.state === 'paused' ? { ...old, state:'running' } : old),
    cancel:() => setOperation(old => ({ ...old, state:'cancelled' })),
  };
}
