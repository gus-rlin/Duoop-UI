import React from 'react';
import { CatalogShowcase } from '../CatalogShowcase';
import { ToastDemo, ToastPlayground, toastExamples } from './ToastDemos';
import componentSource from './Toast.jsx?raw';
import cssSource from './Toast.css?raw';
import demoSource from './ToastDemos.jsx?raw';
import anchorSource from '../useAnchoredOverlay.js?raw';
import iconSource from '../Feedback/FeedbackIcon.jsx?raw';
import sharedCss from '../Feedback/Feedback.css?raw';
import progressSource from '../Progress/Progress.jsx?raw';
import progressCss from '../Progress/Progress.css?raw';
import operationSource from '../Progress/useDemoOperation.js?raw';

export const toastEntry = { id:'builtin-toast', name:'Toast', category:'Other', notes:'Timely feedback with tactile surfaces. Eighteen examples of status, actions, timing, stacks and anchored notifications.' };
export function ToastShowcase() {
  return <CatalogShowcase entry={toastEntry} number="15" section="FEEDBACK" examples={toastExamples} Demo={ToastDemo} playground={<ToastPlayground />}
    accessibility="Notifications keep focus where the action started. Tab into a stack to expand it; timers pause during interaction and when the page is hidden."
    usage="Wrap the action owner and one viewport in ToastProvider. useToast adds, updates or dismisses a notification; a stable ID updates it without duplication. duration: 0 persists until explicitly dismissed. Undo restores the demo file's previous location. Anchored examples copy the actual path and report clipboard failures. Error announcements are assertive; other updates are polite. All sources below use the existing Button, Switch and Select components."
    usageCode={'import { Button } from \'./components/Button/Button\';\nimport { ToastProvider, ToastViewport, useToast } from \'./components/Toast/Toast\';\n\nfunction SaveNotice() {\n  const toast = useToast();\n  return <Button onClick={() => toast.add({\n    id: "saved", title: "Changes saved", status: "success"\n  })}>Show confirmation</Button>;\n}\n\nexport function Example() {\n  return <ToastProvider>\n    <SaveNotice />\n    <ToastViewport position="bottom-right" />\n  </ToastProvider>;\n}'}
    api={[
      ['ToastProvider / limit','Scoped queue. Default: 3 visible. At most 50 total; add returns null when full. Queued timers start on visibility.'],
      ['useToast().add(options)','Returns an ID. A repeated ID refreshes the existing notification and timer.'],
      ['update(id, patch) / dismiss(id)','Update a live item without replaying entry, or animate its removal. Dismissed items are never revived by update.'],
      ['promise(task, messages)','task is an async function; messages: id, loading, success, error. Updates the same toast and returns or throws the original result. Callers own cancellation and catch errors.'],
      ['title / description / status','neutral · success · error · warning · info · loading. Text keeps status meaningful without color.'],
      ['action / icon','Optional { label, onClick } action using Button. Set icon to false to omit the icon.'],
      ['appearance / density','neutral · tinted · solid; standard · compact.'],
      ['duration / countdown / progress','Milliseconds, 0 for persistent; optional countdown track; optional measured 0–100 progress.'],
      ['ToastViewport','inline or portaled; six positions; theme light/dark. Use container for a dialog in the top layer.'],
      ['AnchoredToast','anchorRef, placement top/bottom/left/right with alignment, theme and container. Flips and clamps to the viewport.'],
      ['Shared dependencies','Button, Switch, Select, Progress, FeedbackIcon, Feedback.css and useAnchoredOverlay. Demos also use useDemoOperation.'],
    ]}
    sources={[[ 'Toast.jsx',componentSource ],[ 'Toast.css',cssSource ],[ 'ToastDemos.jsx',demoSource ],[ 'useAnchoredOverlay.js',anchorSource ],[ 'FeedbackIcon.jsx',iconSource ],[ 'Feedback.css',sharedCss ],[ 'Progress.jsx',progressSource ],[ 'Progress.css',progressCss ],[ 'useDemoOperation.js',operationSource ]]} />;
}
