import { Card } from '../Card/Card';
import React, { useState } from 'react';
import { Button } from '../Button/Button';
import { Switch } from '../Selection/Selection';
import { Select } from '../Select/Select';
import { FeedbackIcon } from '../Feedback/FeedbackIcon';
import { Progress, progressStates } from './Progress';
import { useDemoOperation } from './useDemoOperation';

export const progressExamples = [
  ['Linear','Linear'], ['With label','Linear'], ['With percentage','Linear'], ['Detailed','Linear'],
  ['Indeterminate','Linear'], ['Indeterminate to determinate','Linear'], ['Buffered','Linear'], ['Segmented','Linear'], ['Page edge','Linear'],
  ['Circular','Circular'], ['Circular percentage','Circular'], ['Central content','Circular'], ['Circular indeterminate','Circular'],
  ['With controls','Operations'], ['File transfer','Operations'], ['Multiple tasks','Operations'],
  ['Linear success','Completion'], ['Circular success','Completion'],
];

export function ProgressDemo({ example }) {
  const op = useDemoOperation();
  const [fail, setFail] = useState(false);
  const [partialResult, setPartialResult] = useState(false);
  const active = ['running','preparing','finalizing','paused'].includes(op.state);
  const started = op.run > 0;
  const circular = ['Circular','Circular percentage','Central content','Circular indeterminate','Circular success'].includes(example);
  const indeterminate = ['Indeterminate','Circular indeterminate'].includes(example);
  const state = started ? op.state : indeterminate ? 'paused' : 'running';
  const indefiniteNow = indeterminate && (!started || ['running','preparing'].includes(op.state));
  const value = indefiniteNow || op.state === 'preparing' ? null : started ? op.value : 40;
  const start = () => op.start({ prepare:example === 'Indeterminate to determinate', fail });
  const showLabel = ['With label','Detailed','Buffered','Segmented','Central content','With controls','File transfer','Multiple tasks','Linear success','Circular success','Indeterminate to determinate'].includes(example);
  const showValue = !['Linear','With label','Circular','Central content','Page edge'].includes(example);
  let description = example === 'Detailed' ? `${Math.round((value || 0) * .8)} of 80 files processed` : example === 'Buffered' ? 'Solid: processed · muted: available' : example === 'Segmented' ? `${Math.floor((value || 0) / 20)} of 5 batches processed` : example === 'Indeterminate to determinate' ? op.state === 'preparing' ? 'Counting files before measuring the transfer.' : 'Prepare the manifest, then transfer the files.' : undefined;
  if (op.state === 'finalizing') description = 'All bytes transferred. Verifying the result…';
  if (op.state === 'error') description = 'Connection interrupted. Retry to restart the transfer.';
  if (op.state === 'success') description = 'The result is verified and ready.';
  if (op.state === 'cancelled') description = 'The simulation stopped. Run again to restart.';
  const meter = <Progress value={value} state={state} shape={circular ? 'circular' : 'linear'} label={example === 'Segmented' ? 'Workspace setup' : example === 'Central content' ? 'Files processed' : example === 'Page edge' ? 'Page loading' : 'Workspace export'} hideLabel={!showLabel} display={showValue ? 'percent' : 'none'} description={description} buffer={example === 'Buffered' ? Math.min(100, (value || 0) + 25) : undefined} segments={example === 'Segmented' ? 5 : 0} size={example === 'Page edge' ? 'sm' : 'md'}>
    {example === 'Central content' && <><FeedbackIcon status="file" /><small>{Math.round((value || 0) * .8)} / 80</small></>}
  </Progress>;
  return <div className="feedback-demo feedback-surface">
    {example === 'Page edge' ? <div className="progress-page-demo">{meter}<div className="progress-page-copy"><strong>Project overview</strong><span>A thin loading track follows the edge of this page preview.</span></div></div> : example === 'File transfer' ? <div className="progress-transfer"><span className="progress-file-icon"><FeedbackIcon status="file" /></span><div><Progress value={value} state={state} label="Brand-assets.zip" description={description || `${Math.round((value || 0) * 2.4)} MB of 240 MB transferred`} /></div></div> : example === 'Multiple tasks' ? <div className="progress-multiple">
      <Progress label="Project files" value={value} state={op.state === 'success' && partialResult ? 'partial' : state} description={op.state === 'success' ? partialResult ? '2 of 3 files succeeded. Video failed validation; retry is available.' : '3 of 3 files verified.' : 'Three files · one overall operation'} />
      {['Design.fig','Notes.pdf','Video.mp4'].map((file, index) => {
        const fileValue = Math.min(100, Math.max(0, (value || 0) * 3 - index * 100));
        const fileState = op.state === 'success' ? partialResult && index === 2 ? 'error' : 'success' : ['paused','cancelled','error'].includes(state) ? state : fileValue === 100 ? 'finalizing' : 'running';
        return <Progress key={file} label={file} value={fileValue} state={fileState} size="sm" description={fileState === 'error' ? 'Validation failed for this file.' : undefined} />;
      })}
    </div> : meter}
    <div className="feedback-demo-actions">
      <Button size="sm" variant="outline" disabled={active} onClick={example === 'Multiple tasks' ? () => { setPartialResult(fail); op.start(); } : start}>{op.state === 'error' || (op.state === 'success' && partialResult && example === 'Multiple tasks') ? 'Retry' : started ? 'Run again' : 'Run simulation'}</Button>
      {example === 'With controls' && <><Button size="sm" variant="outline" disabled={!['running','paused'].includes(op.state)} onClick={op.state === 'paused' ? op.resume : op.pause}>{op.state === 'paused' ? 'Resume' : 'Pause'}</Button><Button size="sm" variant="outline" disabled={!active} onClick={op.cancel}>Cancel</Button></>}
    </div>
    {['With controls','Multiple tasks'].includes(example) && <Switch label={example === 'Multiple tasks' ? 'Simulate one failed file' : 'Simulate a connection error'} checked={fail} disabled={active} onChange={event => setFail(event.target.checked)} />}
    <p className="feedback-demo-note">{indeterminate && !started ? 'Static preview · run to animate. ' : ''}Simulated operation{['Linear success','Circular success'].includes(example) ? ' · fill → verify → confirm.' : ' · no files are uploaded.'}</p>
  </div>;
}

export function ProgressPlayground() {
  const operation = useDemoOperation();
  const [playing, setPlaying] = useState(false);
  const [shape, setShape] = useState('linear');
  const [size, setSize] = useState('md');
  const [state, setState] = useState('running');
  const [value, setValue] = useState(64);
  const [display, setDisplay] = useState('percent');
  const [textPosition, setTextPosition] = useState('above');
  const [dark, setDark] = useState(false);
  const [rounded, setRounded] = useState(true);
  const [long, setLong] = useState(false);
  const previewState = playing ? operation.state : state;
  const previewValue = playing ? operation.value : state === 'waiting' ? 0 : ['success','finalizing','partial'].includes(state) ? 100 : value;
  return <Card variant="elevated" interactive className="feedback-lab playground-card" aria-label="Progress playground">
    <div className="feedback-lab-heading"><h3>A measured response.</h3><p>Compare shape, size and state. The value and outcome are independent: 100% can still be finalizing.</p></div>
    <div className="feedback-lab-layout"><div className="feedback-lab-controls">
      <Select label="Shape" width="full" value={shape} onValueChange={setShape} options={[{ value:'linear', label:'Linear' }, { value:'circular', label:'Circular' }]} />
      <Select label="Size" width="full" value={size} onValueChange={setSize} options={[{ value:'sm', label:'Small / thin' }, { value:'md', label:'Medium / standard' }, { value:'lg', label:'Large / thick' }]} />
      <Select label="State" width="full" value={previewState} onValueChange={next => { operation.cancel(); setPlaying(false); setState(next); }} options={Object.entries(progressStates).map(([value, label]) => ({ value, label }))} />
      <Select label="Visible value" width="full" value={display} onValueChange={setDisplay} options={[{ value:'percent', label:'Percentage' }, { value:'quantity', label:'Quantity / total' }, { value:'none', label:'None' }]} />
      <Select label="Text position" width="full" value={textPosition} onValueChange={setTextPosition} options={['above','beside','below'].map(value => ({ value, label:value }))} />
      <label>Value · {previewValue}%<input aria-label="Progress value" type="range" min="0" max="100" value={previewValue} onChange={event => { operation.cancel(); setPlaying(false); setValue(Number(event.target.value)); }} /></label>
      <Switch label="Rounded ends" checked={rounded} onChange={event => setRounded(event.target.checked)} />
      <Switch label="Dark surface" checked={dark} onChange={event => setDark(event.target.checked)} />
      <Switch label="Long text" checked={long} onChange={event => setLong(event.target.checked)} />
    </div><div className="feedback-lab-stage feedback-surface" data-theme={dark ? 'dark' : 'light'}>
      <Progress shape={shape} textPosition={textPosition} size={size} value={previewValue} state={previewState} display={display} rounded={rounded} label={long ? 'Exporting all research documents and their original attachments for the September workspace archive' : 'Workspace archive'} description={previewState === 'error' ? 'The connection was interrupted. Choose In progress to preview recovery.' : previewState === 'partial' ? '7 files succeeded. 1 file failed validation.' : previewState === 'finalizing' ? 'The transfer is complete. The archive is still being verified.' : playing ? 'Simulated sequence · prepare, transfer, verify, confirm.' : long ? 'The original files remain available while the archive is prepared, transferred and verified. Every stage reports its own outcome.' : 'Controlled preview · change the value and state.'} />
      <div className="feedback-demo-actions"><Button size="sm" onClick={() => { setPlaying(true); operation.start({ prepare:true }); }}>Play sequence</Button><Button size="sm" variant="outline" onClick={() => { operation.cancel(); setPlaying(false); setState('running'); setValue(64); }}>Reset preview</Button></div>
    </div></div>
  </Card>;
}
