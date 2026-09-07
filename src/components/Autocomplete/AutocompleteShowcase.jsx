import React from 'react';
import { CatalogShowcase } from '../CatalogShowcase';
import { AutocompleteDemo, autocompleteExamples } from './AutocompleteDemos';
import componentSource from './Autocomplete.jsx?raw';
import cssSource from './Autocomplete.css?raw';
import demoSource from './AutocompleteDemos.jsx?raw';
import overlaySource from '../useAnchoredOverlay.js?raw';
import formCss from '../Forms/Forms.css?raw';

export const autocompleteEntry = { id:'builtin-autocomplete', name:'Autocomplete', category:'Forms', notes:'Free-form input with tactile suggestions, grouped results, keyboard navigation, and a clear next choice.' };

export function AutocompleteShowcase() {
  return <CatalogShowcase entry={autocompleteEntry} number="27" section="FORMS" examples={autocompleteExamples} Demo={AutocompleteDemo}
    accessibility="Type to filter, use ↑ and ↓ to explore, Enter to choose, and Escape to close. Your text remains editable."
    usage={<>Inspired by the input, popup, list, and empty states in <a href="https://coss.com/ui/docs/components/autocomplete" target="_blank" rel="noreferrer">Coss Autocomplete</a>, adapted to Duoop-UI. Suggestions are optional: any text is accepted. Filtering ignores case and accents; disabled suggestions are skipped by the keyboard.</>}
    usageCode={`import { Autocomplete } from './components/Autocomplete/Autocomplete';\n\nconst items = [\n  { value: 'figma', label: 'Figma' },\n  { value: 'framer', label: 'Framer' },\n];\n\n<Autocomplete\n  items={items}\n  label="Tool"\n  placeholder="Find your tool…"\n  showClear\n  showTrigger\n  onValueChange={text => console.log(text)}\n/>`}
    api={[
      ['items', 'Array of unique value and label pairs; optional group, description, keywords, and disabled.'],
      ['value / defaultValue / onValueChange', 'Controlled or uncontrolled input text. onValueChange receives text on typing, selection, and clear.'],
      ['onSelect', 'Receives the original item when a suggestion is chosen.'],
      ['label / description / error', 'Persistent label, associated help, and an announced validation error.'],
      ['size / startAddon', 'sm · md · lg. Optional leading icon.'],
      ['showClear / showTrigger / autoHighlight', 'Optional clear and disclosure actions; automatic first matching highlight.'],
      ['emptyMessage', 'Text displayed when filtering returns no suggestions.'],
      ['name / required / disabled', 'Native form input attributes. Uncontrolled fields support native form reset.'],
    ]}
    sources={[["Autocomplete.jsx",componentSource],["Autocomplete.css",cssSource],["AutocompleteDemos.jsx",demoSource],["useAnchoredOverlay.js",overlaySource],["Forms.css",formCss]]}
  />;
}
