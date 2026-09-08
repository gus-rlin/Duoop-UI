# Duoop UI MCP for Codex

The official Duoop UI MCP lets Codex search the collection and retrieve the same complete source bundles that visitors get from the catalog. It is maintained by Duoop UI; Codex is an OpenAI product.

Two tools. No API key, account, HTTP service, browser or network connection at runtime. The server speaks MCP over standard input/output using the official MCP SDK. It reads its bundled catalog and never writes to the caller's project.

## Connect from this repository

Use Node.js 22.18+ in the 22.x line, or 24.11+. Install the MCP's own dependencies; installing the website is unnecessary:

```sh
git clone https://github.com/gus-rlin/Duoop-UI.git
cd Duoop-UI
npm ci --prefix mcp
codex mcp add duoop-ui -- node "/absolute/path/Duoop-UI/mcp/server.mjs"
codex mcp list
```

Replace the absolute path with your clone's location. On Windows, for example:

```powershell
codex mcp add duoop-ui -- node "C:/Projects/Duoop-UI/mcp/server.mjs"
```

Start a new Codex session. In the desktop app you can also add a local MCP in settings with command `node` and the absolute server path as its single argument. No environment variables are needed.

Equivalent `config.toml` entry:

```toml
[mcp_servers.duoop-ui]
command = "node"
args = ["/absolute/path/Duoop-UI/mcp/server.mjs"]
```

The command format is verified against `codex mcp add --help` and the [official Codex MCP documentation](https://developers.openai.com/codex/mcp/).

## Use it naturally

> Use Duoop UI to find a button with a loading state. Show me its variants, then retrieve the complete source for the one that fits my form.

> Find components in the Forms family and get the source for a password input.

> Find Chart variants, choose a bar chart, and integrate its complete example in this React project.

Prompts may be in French or any language Codex understands. Catalog keyword searches use the English names displayed on the website; server instructions tell Codex to translate search terms when needed.

| Tool | Parameters | Result |
| --- | --- | --- |
| `search_components` | Optional `query`, `family`, `limit` (1–50, default 20), `offset` (default 0) | Components and variants with component IDs, exact variant names, category, implementation family, group and catalog URL. Includes total and nextOffset. |
| `get_component_source` | Required `component`; optional `variant`, `file` | Complete JSX, CSS, local helpers, runnable App.jsx, base.css, dependency versions and license notices. Includes a manifest and available variants. |

`family` matches a category such as `Forms`, a component family such as `Button`, a component name, or a variant group such as `States`. Searches combine all query words and ignore case, accents and punctuation. An empty query browses the collection. Follow `nextOffset` until it is null to see all matches.

```json
{ "query": "loading", "family": "Button" }
```

Use the exact returned component ID and variant name for the next call:

```json
{ "component": "builtin-chart" }
```

The optional `file` parameter retrieves one exact path from the returned manifest. It cannot read arbitrary filesystem paths. Unknown components, variants or paths produce an actionable MCP tool error. To retrieve another variant, pass its name from search results or the source response's `variants` list.

Preserve returned paths and relative imports. Adapt `src/App.jsx` to the destination project, import the foundation once, and install the listed dependencies. Sources are formatted by the website's existing source loader. Gallery examples are preset examples; live playground edits are not part of the index. The catalog guide covers [source integration](source-installation.md), including React 19 and client-only Map rendering.

## Updates and troubleshooting

The bundled snapshot follows the repository revision that generated it. Updating the clone updates the snapshot; run `npm ci --prefix mcp` again if dependencies changed, then restart the MCP session. It does not fetch live website changes automatically.

- **Server cannot start:** check `node --version`, the absolute path and `npm ci --prefix mcp`. Run `node mcp/server.mjs` from the repository; no banner is expected because stdout carries only the MCP protocol.
- **Missing data.json:** the snapshot must be included with the MCP. Maintainers can regenerate it with the build steps below.
- **No search results:** try an English component name, a broader term or an empty query; categories are included in every search response.
- **Codex cannot see the tools:** check `codex mcp list`, then start a new session.
- **Remove the connection:** run `codex mcp remove duoop-ui`.

## Build, test and package (maintainers)

The generator uses a temporary local Vite server and Chromium to enumerate the actual public gallery cards and capture their source bundles through the shared `componentBundle` / `exampleBundle` functions. It does not maintain a second handwritten variant registry. External demo media are blocked during indexing. Shared source content is deduplicated by SHA-256 in `mcp/data.json`.

```sh
npm ci
npm ci --prefix mcp
npx playwright install chromium
npm run build:mcp
npm run test:mcp
npm run pack:mcp
```

Keep the generated `mcp/data.json` snapshot in source control whenever components, variants, recipes or bundled sources change. `pack:mcp` regenerates the snapshot and produces `artifacts/duoop-ui-mcp-1.0.0.tgz`, including the licenses. Install/test that archive in isolation before publishing. Browser tooling is a build dependency only; it is excluded from the MCP package.

The website remains a static site. This stdio MCP does not create a hosted `/mcp` endpoint. Building, packing or pushing the repository does not publish the MCP on npm.

CI checks the snapshot fingerprint against the component sources, gallery definitions, recipes, dependencies and notices. An outdated snapshot fails `test:mcp` with the regeneration command. The generator also refuses to save a snapshot if those inputs change while it is running.

After a maintainer publishes `duoop-ui-mcp`, users will be able to register that released version in one command:

```sh
codex mcp add duoop-ui -- npx -y duoop-ui-mcp@1.0.0
```

Until that separate release is published, use the working repository setup above. The MCP package has its own version and dependencies and does not modify the `duoop-ui` React package.

The hero uses the unmodified Codex icon supplied with OpenAI's official Codex extension. See [third-party notices](../THIRD_PARTY_NOTICES.md).
