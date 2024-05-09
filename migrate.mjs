import { readdir, readFile, writeFile, stat } from "node:fs/promises";
import path from "node:path";

async function processFiles(directory) {
  const files = await readdir(directory);

  for (const file of files) {
    const filePath = path.join(directory, file);
    const stats = await stat(filePath);

    if (stats.isDirectory()) {
      await processFiles(filePath);
    } else if (stats.isFile() && [".md", ".mdx"].includes(path.extname(file))) {
      const content = await readFile(filePath, "utf8");
      const regex = /\[(.*?)\]\((#[^/)]+)(?:\/([^)]+))?\)/g;
      const md = content.replace(regex, (match, title, slug, link) => {
        console.log(match);
        console.log(`- [${title}](${slug}/${link})`);
        const linkParts = slug
          .split("_")
          .slice(1)
          .map((x) => x.toLowerCase())
          .map((x) => x.charAt(0).toUpperCase() + x.slice(1));
        if (linkParts.length > 1) {
          linkParts[0] = linkParts[0].toLowerCase();
        }
        const linkEnd = link ? `#${link}` : "";
        const newLink = `[${title}](/${linkParts[0]}/${linkParts.slice(1).join("_")}${linkEnd})`;
        return newLink;
      });
      await writeFile(filePath, md);
    }
  }
}

const docsDirectory = "./i18n";
processFiles(docsDirectory)
  .then(() => {
    console.log("Files processed successfully!");
  })
  .catch((error) => {
    console.error("Error processing files:", error);
  });
