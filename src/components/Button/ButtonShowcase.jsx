import React from 'react';
import iconSource from '../IconButton/IconButton.jsx?raw';
import componentSource from './Button.jsx?raw';
import colorSource from './buttonColor.js?raw';
import cssSource from './Button.css?raw';
import './showcase.css';
import { CodeBlock, SourceFiles } from './Documentation';
import demoSource from './ButtonShowcase.jsx?raw';
import demoStyles from './showcase.css?raw';
import { ComponentGallery } from './IndividualExamples';

export const buttonEntry = { id: 'builtin-relief-button', name: 'Raised button', category: 'Buttons', notes: 'Buttons with configurable styles, sizes, colors, and states.' };
const usage = `import { Button } from './Button';

export default function Example() {
  return <Button onClick={() => console.log('Action')}>Continue</Button>;
}`;
export function ButtonShowcase() {
  return <article className="button-showcase" aria-labelledby="button-name"><div className="documentation-content">
    <header className="showcase-heading"><div><span className="doc-eyebrow">COMPONENTS / BUTTONS</span><h2 id="button-name">Raised button</h2><p>{buttonEntry.notes}</p></div><a className="secondary" href="#button-source">Source code ↗</a></header>
    <ComponentGallery />
    <section className="doc-section" id="button-usage"><h3>Usage</h3><p>Copy Button.jsx, Button.css and buttonColor.js into the same folder, then import Button. The component only depends on React.</p><CodeBlock code={usage} label="Using Button" /></section>
    <section className="doc-section" id="button-documentation"><h3>API and accessibility</h3><p>With href, Button renders a native link. Otherwise, it renders a button. The parent controls status and resets it to idle after success.</p>
    <div className="api-table"><table><thead><tr><th>Prop</th><th>Values</th><th>Default</th></tr></thead><tbody>{[
      ['variant', 'solid · outline · ghost · destructive · destructive-outline · link', 'solid'],
      ['color', 'Hex color (#rgb or #rrggbb); automatic shadow and contrast', 'Variant default'],
      ['size', 'sm · md · lg', 'md'], ['motion', 'discreet · tactile · expressive', 'tactile'],
      ['status', 'idle · loading · success · error', 'idle'], ['icon / iconPosition', 'ReactNode / left · right · only', '— / left'],
      ['iconMotion', 'none · arrow · plus · star', 'none'], ['fullWidth / disabled', 'boolean', 'false'],
      ['selected', 'boolean, exposes aria-pressed', '—'], ['href', 'URL, renders a native link', '—'], ['successLabel', 'Confirmation text', 'Saved'], ['intent', 'standard · destructive', 'standard'],
    ].map(row => <tr key={row[0]}>{row.map((cell, i) => <td key={i}>{cell}</td>)}</tr>)}</tbody></table></div>
    <p>An icon-only button requires an aria-label. Loading and success block clicks and announce the status. Keep the content and successLabel unchanged during transitions to preserve dimensions. Animations respect reduced motion preferences.</p><p>A real destructive action requires confirmation or an undo option in your flow. These demos do not delete any data.</p></section>
    <section className="doc-section" id="button-source"><h3>Source code</h3><p>Copy Button.jsx, Button.css and buttonColor.js. The examples also use showcase.css for layout and the animated favorite. The demo file shows how they work.</p><SourceFiles files={[["Button.jsx", componentSource], ["Button.css", cssSource], ["buttonColor.js", colorSource], ["IconButton.jsx", iconSource], ["showcase.css", demoStyles], ["Demos", demoSource]]} /></section>
    </div>
  </article>;
}


