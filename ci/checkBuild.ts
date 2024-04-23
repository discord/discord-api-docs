import fs from "node:fs/promises";
import path from "node:path";
import { compile } from "@mdx-js/mdx";

const args = process.argv.slice(2);
const bail = args.includes("--bail");

// TODO(beckwith): this is quite broken for all `md` files, figure out why
const extensions = [".mdx"];
let hasErrors = false;
for (const file of await fs.readdir("docs", { recursive: true })) {
  if (extensions.includes(path.extname(file))) {
    try {
      console.log(`Compiling ${file}...`);
      await compile(await fs.readFile(path.join("docs", file)));
    } catch (error) {
      console.error(`Error compiling ${file}:`);
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
