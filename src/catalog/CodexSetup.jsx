import React, { useEffect, useRef } from 'react';
import { CodeBlock } from '../components/Button/Documentation';
import { repository } from './catalog';

export function CodexSetup() {
  const section = useRef(null);
  useEffect(() => {
    if (location.hash === '#codex-mcp') section.current?.scrollIntoView();
  }, []);
  return (
    <section className="guide-section" id="codex-mcp" ref={section}>
      <h2>Build with Codex.</h2>
      <p>
        The official Duoop UI MCP connects Codex to our collection. Find a component,
        explore its variants, and bring the complete JSX, CSS and helpers into your project.
        No API key or account required.
      </p>
      <h3>Set up from the repository</h3>
      <p>Use Node.js 22.18+ (22.x), or 24.11+. Run this once in a terminal:</p>
      <CodeBlock label="Prepare the Duoop MCP" language="bash" code={'git clone https://github.com/gus-rlin/Duoop-UI.git\ncd Duoop-UI\nnpm ci --prefix mcp'} />
      <p>
        Register the server with its absolute path. Replace the example path below with
        your clone’s location; keep the quotes if the path contains spaces.
      </p>
      <CodeBlock label="Connect to Codex" language="bash" code={'codex mcp add duoop-ui -- node "/absolute/path/Duoop-UI/mcp/server.mjs"\ncodex mcp list'} />
      <p>
        On Windows, use a path such as <code>C:/Projects/Duoop-UI/mcp/server.mjs</code>.
        Start a new Codex session after connecting. The server then works offline;
        the catalog and its source files are included.
      </p>
      <h3>Ask for what you want to build</h3>
      <blockquote>
        Use Duoop UI to find a button with a loading state. Show me the available variants,
        then get the complete source for the one that best fits my form.
      </blockquote>
      <p>
        Codex uses <code>search_components</code> to find components and variants,
        then <code>get_component_source</code> to retrieve the same files you can download here.
        The MCP is maintained by Duoop UI. Codex is an OpenAI product.
      </p>
      <a href={`${repository}/blob/main/docs/mcp.md`}>Full MCP guide, configuration and release instructions ↗</a>
    </section>
  );
}
