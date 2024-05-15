import { readdir, readFile, writeFile, stat } from "node:fs/promises";
import path from "node:path";
import { compile } from "@mdx-js/mdx";

async function processFiles(directory: string) {
  const files = await readdir(directory);

  for (const file of files) {
    const filePath = path.join(directory, file);
    const stats = await stat(filePath);

    if (stats.isDirectory()) {
      await processFiles(filePath);
    } else if (stats.isFile() && [".md", ".mdx"].includes(path.extname(file))) {
      const content = await readFile(filePath, "utf8");
      const compiledContent = await compile(content);
      await writeFile(outputFilePath, compiledContent);
    }
  }
}

const docsDirectory = "./docs";
processFiles(docsDirectory)
  .then(() => {
    console.log("Files processed successfully!");
  })
  .catch((error) => {
    console.error("Error processing files:", error);
  });
