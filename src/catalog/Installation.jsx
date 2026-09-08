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
import { CodexSetup } from './CodexSetup';

export function Installation() {
  return (
    <div className="guide-page">
      <span className="eyebrow">GET STARTED</span>
      <h1>From preview to your project.</h1>
      <p className="page-intro">
        Install the React component library with npm, or copy the source when you want to
        make the implementation your own.
      </p>
      <div className="guide-facts">
        <Badge>React 19</Badge>
        <Badge>Plain CSS</Badge>
        <Badge>JavaScript / JSX</Badge>
      </div>
      <section className="guide-section">
        <h2>Install the library</h2>
        <p>
          Install Duoop UI from npm in your React 19 project.
        </p>
        <CodeBlock label="In your React 19 project" language="bash" code="npm i duoop-ui" />
        <p>
          Component dependencies are
          installed automatically. Import the shared stylesheet once, then use named imports.
        </p>
        <CodeBlock label="App.jsx" code={"import { Button } from 'duoop-ui';\nimport 'duoop-ui/styles.css';\n\nexport default function App() {\n  return <Button onClick={() => alert('Hello!')}>Press me</Button>;\n}"} />
        <p>
          The stylesheet includes all components and page defaults for font and spacing.
          Load your own CSS afterwards to override them. The package uses ESM and React 19;
          dedicated TypeScript declarations are not yet included.
        </p>
        <p>
          The catalog follows the current repository. If your installed npm version does
          not export a component shown here, use that component’s source download or
          build a local archive with <code>npm pack</code> from the repository.
          A Git push does not publish a new npm release.
        </p>
        <h2>Prefer to copy the source?</h2>
        <p>Follow the steps below to keep the component files directly in your project.</p>
      </section>
      <ol className="installation-steps">
        <li>
          <h2>Start with a React project</h2>
          <p>
            Already have one? Continue to step 2. For a new project, install Node.js 22.18+ in the 22.x line, or
            24.11+, and npm, then run:
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
      <CodexSetup />
      <section className="guide-section">
        <h2>A few useful details.</h2>
        <Accordion type="multiple">
          <AccordionItem value="dependencies">
            <AccordionTrigger>Which dependencies do I need?</AccordionTrigger>
            <AccordionContent>
              The npm library installs its runtime dependencies automatically. When copying source,
              follow the requirements in the component’s Installation tab: motion components
              may use GSAP; Map uses Leaflet; Tooltip, Popover, Slider and Sheet use Radix;
              calendars use React DayPicker; File Upload uses React Dropzone. Local Duoop
              dependencies are included in the source file list.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="next">
            <AccordionTrigger>Can I use Next.js or TypeScript?</AccordionTrigger>
            <AccordionContent>
              These are JavaScript/JSX components. In Next.js, put a <code>'use client';</code>{' '}
              boundary above components using hooks. For the npm library, import{' '}
              <code>duoop-ui/styles.css</code> in the root layout. For copied source, import{' '}
              <code>base.css</code> there and preserve component CSS imports. Map needs a client-only dynamic import with SSR
              disabled. TypeScript projects can include JSX files with{' '}
              <code>allowJs: true</code>; dedicated TypeScript declarations are not supplied.
              Next.js and server rendering have not been separately validated.
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
              for outdoor adventures. It provides its React source, styles, all component
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
