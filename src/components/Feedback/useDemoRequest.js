import { useCallback, useEffect, useRef, useState } from 'react';

/** A labelled catalogue simulation; abort clears its timer and rejects the request. */
export function simulateRequest({ signal, fail = false, delay = 650 } = {}) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(new DOMException('Cancelled', 'AbortError'));
    const abort = () => { clearTimeout(timer); reject(new DOMException('Cancelled', 'AbortError')); };
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', abort);
      if (fail) reject(new Error('The simulated request failed.'));
      else resolve();
    }, delay);
    signal?.addEventListener('abort', abort, { once:true });
  });
}

export function useDemoRequest() {
  const [status, setStatus] = useState('idle');
  const request = useRef(null);
  useEffect(() => () => request.current?.abort(), []);
  const reset = useCallback(() => { request.current?.abort(); request.current = null; setStatus('idle'); }, []);
  const run = useCallback(async (options = {}) => {
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    setStatus('loading');
    try {
      await simulateRequest({ ...options, signal:controller.signal });
      if (controller.signal.aborted) return false;
      setStatus('success');
      return true;
    } catch (error) {
      if (error.name !== 'AbortError') setStatus('error');
      return false;
    }
  }, []);
  return { status, run, reset };
}
