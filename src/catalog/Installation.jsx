import React from 'react';
import { Button } from '../components/Button/Button';
import { Badge } from '../components/Badge/Badge';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '../components/Accordion/Accordion';
import { CodeBlock } from '../components/Button/Documentation';
import { recipes } from './recipes';
import { Icon } from './Icon';

export function Installation() {
  return (
    <div className="guide-page">
      <span className="eyebrow">GET STARTED</span>
      <h1>From preview to your project.</h1>
      <p className="page-intro">
        Duoop is a collection of React source components. Copy the pieces you need, keep the
        code, and make it your own.
      </p>
      <div className="guide-facts">
        <Badge>React 19</Badge>
        <Badge>Plain CSS</Badge>
        <Badge>JavaScript / JSX</Badge>
      </div>
      <ol className="installation-steps">
        <li>
          <h2>Start with a React project</h2>
          <p>
            Already have one? Continue to step 2. For a new project, install Node.js 22.12+ or
            24+ and npm, then run:
          </p>
          <CodeBlock
            label="Terminal"
            language="bash"
            code={
              'npm create vite@latest my-duoop-app -- --template react\ncd my-duoop-app\nnpm install'
            }
          />
          <p>
            The components need a JSX build pipeline and support for CSS imports. They do not
            require Tailwind or path aliases.
          </p>
        </li>
        <li>
          <h2>Choose a component</h2>
          <p>
            Open a component, try its preview, then switch to <strong>Code</strong>. Copy the
            listed files with their paths, or choose <strong>Download project</strong> for a
            runnable starter.
          </p>
          <Button
            href="?component=builtin-relief-button&tab=code"
            variant="outline"
            icon={<Icon name="arrow" />}
            iconPosition="right"
          >
            Get the Raised button
          </Button>
        </li>
        <li>
          <h2>Bring the foundation</h2>
          <p>For the first button, your file tree is:</p>
          <CodeBlock
            label="Files to copy"
            language="bash"
            code={
              'src/\n  base.css\n  App.jsx\n  components/\n    Button/\n      Button.jsx\n      Button.css\n      buttonColor.js'
            }
          />
          <p>
            Import <code>./base.css</code> once in your application entry. Components import
            their styles themselves. Avoid copying the catalogue’s <code>styles.css</code> or
            retaining Vite’s starter <code>App.css</code>, which may constrain your page width.
          </p>
          <CodeBlock
            label="src/main.jsx"
            code={
              "import React from 'react';\nimport { createRoot } from 'react-dom/client';\nimport App from './App.jsx';\nimport './base.css';\n\ncreateRoot(document.getElementById('root')).render(<App />);"
            }
          />
        </li>
        <li>
          <h2>Run your first interaction</h2>
          <p>This complete example needs only React. Pressing the button updates its count.</p>
          <CodeBlock label="src/App.jsx" code={recipes['relief-button']} />
          <CodeBlock
            label="Terminal"
            language="bash"
            code={'npm run dev\n# Ready to ship your application?\nnpm run build'}
          />
        </li>
      </ol>
      <section className="guide-section">
        <h2>A few useful details.</h2>
        <Accordion type="multiple">
          <AccordionItem value="dependencies">
            <AccordionTrigger>Which dependencies do I need?</AccordionTrigger>
            <AccordionContent>
              Every component’s Installation tab lists its exact requirements. Some motion
              components use GSAP; Map uses Leaflet. Install only the packages required by your
              chosen component. Shared Duoop dependencies are included in the source file list.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="next">
            <AccordionTrigger>Can I use Next.js or TypeScript?</AccordionTrigger>
            <AccordionContent>
              These are JavaScript/JSX components. In Next.js, put a <code>'use client';</code>{' '}
              boundary above components using hooks, import base.css in the root layout and
              preserve the CSS imports. Map needs a client-only dynamic import with SSR
              disabled. TypeScript projects can include JSX files with{' '}
              <code>allowJs: true</code>; dedicated TypeScript declarations are not supplied.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="font">
            <AccordionTrigger>How do I get the same typography?</AccordionTrigger>
            <AccordionContent>
              The catalogue self-hosts DM Sans using <code>@fontsource-variable/dm-sans</code>.
              Optionally install that package and import{' '}
              <code>'@fontsource-variable/dm-sans'</code> in your app entry. In your CSS, set{' '}
              <code>
                {":root { --duoop-font: 'DM Sans Variable', system-ui, sans-serif; }"}
              </code>
              . Without the font package, base.css provides a system fallback.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="pages">
            <AccordionTrigger>Can I copy a complete page?</AccordionTrigger>
            <AccordionContent>
              Yes. The <a href="?page=examples">Examples section</a> includes a landing page
              and settings page. Each provides its React source, styles, all component
              dependencies and a runnable download.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="local">
            <AccordionTrigger>How do I work on the catalogue itself?</AccordionTrigger>
            <AccordionContent>
              Use Node.js 22.18+ in the 22 release line, or 24.11+, for the catalogue’s
              development and validation tools.{' '}
              Clone the repository, run <code>npm ci</code>, then <code>npm run dev</code>.
              This starts the documentation website. It is separate from copying components
              into your application. Build the catalogue with <code>npm run build</code> and
              serve <code>dist/</code> on a static host.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  );
}
