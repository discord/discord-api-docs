/**
 * This script will parse the changelog and split it into individual files.
 * It was designed for one time use, but will be helpful if we ever need to
 * go back and do batch processing with ASTs over our markdown.
 */

import fs from "node:fs/promises";
import { fromMarkdown } from "mdast-util-from-markdown";
import { toMarkdown } from "mdast-util-to-markdown";

const doc = await fs.readFile("./old_changelog.md", "utf-8");
const tree = fromMarkdown(doc);

// write this for debugging purposes while parsig
await fs.writeFile("changelog-ast.json", JSON.stringify(tree, null, 2));

const files = [];
let currentFile;
let postElementIndex = 0;

for (const element of tree.children) {
  // each changelog entry starts with an h2
  if (element.type === "heading" && element.depth === 2) {
    postElementIndex = 0;
    currentFile = {
      title: element.children[0].value,
      content: [],
    };
    files.push(currentFile);
  } else if (postElementIndex === 1 && element.type === "heading" && element.depth === 4) {
    const maybeDate = Date.parse(element.children[0].value);
    if (!isNaN(maybeDate)) {
      currentFile.date = new Date(maybeDate);
    }
  } else if (
    postElementIndex === 2 &&
    element.type === "blockquote" &&
    element.children?.length > 0 &&
    element.children[0].type === "paragraph" &&
    element.children[0].children?.length > 0 &&
    element.children[0].children[0].type === "text" &&
    element.children[0].children[0].value === "danger\nThis entry includes breaking changes"
  ) {
    currentFile.breaking = true;
  } else {
    currentFile.content.push(element);
  }
  postElementIndex++;
}

for (const file of files) {
  const frontmatter = `---
title: "${file.title}"
date: "${file.date.toISOString()}"
breaking: ${file.breaking ? "true" : "false"}
---

`;
  const content = frontmatter + toMarkdown({ type: "root", children: file.content });
  const slug =
    file.date.toISOString().split("T")[0] +
    "-" +
    file.title
      .toLowerCase()
      .replace(/[ _:&,/*]/g, "-")
      .replace(/---/g, "-")
      .replace(/--/g, "-");
  // eslint-disable-next-line no-undef
  console.log(slug);
  await fs.writeFile(`./docs/change_log/${slug}.md`, content);
}
