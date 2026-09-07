import React, { useEffect, useRef, useState } from 'react';
import { Button } from '../Button';

function AsyncDemo({ error = false, motion }) {
  const [status, setStatus] = useState('idle');
  const timer = useRef();
  const locked = useRef(false);
  useEffect(() => () => clearTimeout(timer.current), []);
  function run() {
    if (locked.current) return;
    locked.current = true;
    const retry = status === 'error';
    setStatus('loading');
    timer.current = setTimeout(() => {
      if (error && !retry) { setStatus('error'); locked.current = false; }
      else {
        setStatus('success');
        timer.current = setTimeout(() => { setStatus('idle'); locked.current = false; }, 1600);
      }
    }, 1200);
  }
  return <Button variant={error ? 'outline' : 'solid'} motion={motion} status={status} onClick={run}>{error ? 'Simulate error' : 'Save'}</Button>;
}
export default function Demo() {
  return (
    <AsyncDemo />
  );
}
