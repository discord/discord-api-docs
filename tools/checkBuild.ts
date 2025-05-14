import fs from "node:fs/promises";
import path from "node:path";
import { compile } from "@mdx-js/mdx";

const args = process.argv.slice(2);
const bail = args.includes("--bail");

const ROOT_DIR = path.join(import.meta.dirname, "..");
const DOCS_DIR = path.join(ROOT_DIR, "docs");

const extensions = [".mdx", ".md"];
let hasErrors = false;

for (const docsRelativePath of await fs.readdir(DOCS_DIR, { recursive: true })) {
  const filePath = path.join(DOCS_DIR, docsRelativePath);
  const rootRelPath = path.relative(ROOT_DIR, filePath);

  if (extensions.includes(path.extname(filePath))) {
    try {
      console.error(`Compiling ${rootRelPath}`);
      await compile(await fs.readFile(filePath), {
        format: path.extname(filePath) === ".mdx" ? "mdx" : "md",
      });
    } catch (error) {
      console.error(`Error compiling ${rootRelPath}:`);
      console.error(error);
      hasErrors = true;
      if (bail) {
        process.exit(1);
      }
    }
  }
}

if (hasErrors) {
  process.exit(1);
}
