import React, { useState } from 'react';
import { Alert } from './Alert';
import { Button } from '../Button/Button';
import '../Essentials/EssentialsDemos.css';

export const alertExamples = [
  ['Information', 'Tone'],
  ['Success', 'Tone'],
  ['Warning', 'Tone'],
  ['Error with action', 'Tone'],
  ['Dismissible', 'Interaction'],
];
export function AlertDemo({ example = 'Information' }) {
  const [dismissed, setDismissed] = useState(false);
  const [resolved, setResolved] = useState(false);
  const tone =
    example === 'Success' || resolved
      ? 'success'
      : example === 'Warning'
        ? 'warning'
        : example === 'Error with action'
          ? 'error'
          : 'info';
  const copy = {
    info: [
      'A little room to experiment.',
      'Changes in this workspace stay private until you publish. Take your time.',
    ],
    success: [
      'Your workspace is ready.',
      'Everything is in place. Invite your team whenever you are ready.',
    ],
    warning: [
      'Storage is almost full.',
      'You are using 9.2 GB of your 10 GB plan. Review your files before adding more.',
    ],
    error: [
      'This draft needs your attention.',
      'The sample draft has a missing title. Apply the suggested title to continue.',
    ],
  }[tone];
  return (
    <div className="essential-demo essential-demo--wide">
      {dismissed ? (
        <Button variant="outline" onClick={() => setDismissed(false)}>
          Restore callout
        </Button>
      ) : (
        <Alert
          key={tone}
          tone={tone}
          title={copy[0]}
          onDismiss={
            example === 'Dismissible' ? () => setDismissed(true) : undefined
          }
          action={
            example === 'Error with action' && !resolved ? (
              <Button size="sm" variant="outline" onClick={() => setResolved(true)}>
                Use “Untitled collection”
              </Button>
            ) : undefined
          }
        >
          {resolved
            ? 'The sample draft now has a title. Your correction is saved for this preview.'
            : copy[1]}
        </Alert>
      )}
      {resolved && (
        <Button size="sm" variant="ghost" onClick={() => setResolved(false)}>
          Reset example
        </Button>
      )}
    </div>
  );
}
