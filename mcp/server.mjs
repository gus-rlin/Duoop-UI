#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { search, getSource } from './catalog.mjs';

const server = new McpServer({ name: 'duoop-ui', version: '1.0.0' }, {
  instructions: 'Official Duoop UI component library MCP, maintained by Duoop UI. Search components, categories, families and gallery variants, then get_component_source using the exact id and optional variant name. Results contain the same complete sources as the public catalog. Search accepts English catalog terms; translate user requests when needed. Follow nextOffset to paginate. No files are written by this server.',
});
const annotations = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false };
const respond = handler => async args => {
  try {
    const result = handler(args);
    return { content: [{ type: 'text', text: JSON.stringify(result) }] };
  } catch (error) {
    return { isError: true, content: [{ type: 'text', text: error.message }] };
  }
};
server.registerTool('search_components', {
  title: 'Search Duoop UI',
  description: 'Find components, component families/categories, and gallery variants by English keywords. Empty query browses the collection. Return component ids and exact variant names for get_component_source. Paginate with nextOffset.',
  inputSchema: { query: z.string().max(200).optional(), family: z.string().max(100).optional(), limit: z.number().int().min(1).max(50).default(20), offset: z.number().int().min(0).default(0) }, annotations,
}, respond(search));
server.registerTool('get_component_source', {
  title: 'Get Duoop UI source',
  description: 'Get complete JSX, CSS, local helpers, runnable App.jsx and dependencies, exactly as supplied by the catalog. Use a component id from search_components; optionally choose an exact variant name. Optional file returns only that manifest path, for smaller responses.',
  inputSchema: { component: z.string().min(1).max(100), variant: z.string().min(1).max(200).optional(), file: z.string().min(1).max(200).optional() }, annotations,
}, respond(getSource));
await server.connect(new StdioServerTransport());
