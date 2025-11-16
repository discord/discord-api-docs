import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { compile } from "@mdx-js/mdx";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);
const exitOnError = args.includes("--bail");

const ROOT_DIR = path.join(__dirname, "..");
const DOCS_DIR = path.join(ROOT_DIR, "discord", "developers", "docs");

const extensions = [".mdx", ".md"];
let hasErrors = false;

async function* walk(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(fullPath);
    } else {
      yield fullPath;
    }
  }
}

for await (const filePath of walk(DOCS_DIR)) {
  if (extensions.includes(path.extname(filePath))) {
    const rootRelPath = path.relative(ROOT_DIR, filePath);

    try {
      console.error(`Compiling ${rootRelPath}`);
      const content = await fs.readFile(filePath, "utf8");
      await compile(content, {
        format: path.extname(filePath) === ".mdx" ? "mdx" : "md",
      });
    } catch (error) {
      console.error(`Error compiling ${rootRelPath}:`);
      console.error(error);
      hasErrors = true;

      if (exitOnError) {
        process.exit(1);
      }
    }
  }
}

if (hasErrors) {
  process.exit(1);
}
