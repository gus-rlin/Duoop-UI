import { parse } from "@babel/parser";
import { createServer, build } from "vite";
import fs from "node:fs/promises";
import path from "node:path";
const server = await createServer({ logLevel: "error" });
try {
  const { entries } = await server.ssrLoadModule("/src/catalog/catalog.js");
  const { recipeFor } = await server.ssrLoadModule("/src/catalog/recipes.js");
  const { componentBundle, exampleBundle } = await server.ssrLoadModule(
    "/src/catalog/source-bundle.js",
  );
  const { starterFiles } = await server.ssrLoadModule(
    "/src/catalog/download.js",
  );
  const root = await fs.mkdtemp(path.resolve("artifacts/navigation/export-"));
  let count = 0;
  for (const id of ["breadcrumb", "separator"]) {
    const entry = entries.find((e) => e.id === `builtin-${id}`);
    const source = await fs.readFile(
      `src/components/${entry.folder}/${entry.demo}.jsx`,
      "utf8",
    );
    const declaration = parse(source, {
      sourceType: "module",
      plugins: ["jsx"],
    }).program.body.find(
      (node) =>
        node.type === "ExportNamedDeclaration" &&
        node.declaration?.declarations?.some(
          (item) => item.id.name === `${id}Examples`,
        ),
    );
    const examples = declaration.declaration.declarations[0].init.elements.map(
      (row) => row.elements.map((item) => item.value),
    );
    const bundles = [
      ["component", await componentBundle(entry, recipeFor(entry))],
    ];
    for (const [title] of examples) {
      bundles.push([
        title,
        await exampleBundle(
          entry,
          `<${entry.component}Demo example=${JSON.stringify(title)} />`,
        ),
      ]);
    }
    for (const [name, bundle] of bundles) {
      const directory = path.join(root, id, name.replaceAll(" ", "-"));
      for (const [file, content] of starterFiles(bundle)) {
        const dest = path.join(directory, file);
        await fs.mkdir(path.dirname(dest), { recursive: true });
        await fs.writeFile(dest, content);
      }
      await build({
        configFile: false,
        root: directory,
        logLevel: "error",
        build: { write: false },
      });
      count++;
    }
  }
  console.log(
    `PASS: ${count} standalone exports build (2 components and 6 demos).`,
  );
} finally {
  await server.close();
}
