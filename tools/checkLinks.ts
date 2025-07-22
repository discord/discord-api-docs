import { readdirSync, statSync, readFileSync } from "node:fs";
import path from "node:path";
import chalk from "chalk";
import * as github from "@actions/core";
import * as yaml from "js-yaml";
const cwd = process.env.GITHUB_ACTIONS ? process.env.GITHUB_WORKSPACE! : process.cwd();

interface Frontmatter {
  title?: string;
  date?: string;
  breaking: boolean;
}

function importDirectory(directory: string, extensions: string[], subdirectories = true) {
  try {
    const output = new Map<string, string>();
    const files = readdirSync(directory);
    for (const fileOrPath of files) {
      const currentPath = path.join(directory, fileOrPath);
      if (statSync(currentPath).isDirectory()) {
        if (!subdirectories) continue;
        const subdir = importDirectory(currentPath, extensions, subdirectories);
        if (!subdir) continue;
        for (const [name, read] of subdir) {
          output.set(`/${fileOrPath}${name}`, read);
        }
        continue;
      }
      const currentPathParts = path.parse(currentPath);
      if (!extensions.some((ex) => ex === currentPathParts.ext)) continue;
      const read = readFileSync(currentPath, "utf8");
      output.set(`/${currentPathParts.name}`, read);
    }
    return output;
  } catch {
    // Directory likely does not exist, we should be able to safely discard this error
    return null;
  }
}

function printResults(resultMap: Map<string, github.AnnotationProperties[]>): void {
  let output = "\n";
  let total = 0;
  for (const [resultFile, resultArr] of resultMap) {
    if (resultArr.length <= 0) continue;
    const filePath = path.join(cwd, resultFile);
    output += `${chalk.underline(filePath)}\n`;
    output += resultArr.reduce<string>((result, props) => {
      total += 1;
      return `${result}  ${props.startLine ?? ""}:${props.startColumn ?? ""}-${props.endColumn ?? ""}  ${chalk.yellow(
        "warning",
      )}  ${props.title ?? ""}\n`;
    }, "");
    output += "\n";
  }
  output += "\n";
  if (total > 0) {
    output += chalk.red.bold(`\u2716 ${total} problem${total === 1 ? "" : "s"}\n`);
  }
  console.log(output);
}

function annotateResults(resultMap: Map<string, github.AnnotationProperties[]>): void {
  let total = 0;
  for (const [resultFile, resultArr] of resultMap) {
    if (resultArr.length <= 0) continue;
    github.startGroup(resultFile);
    for (const result of resultArr) {
      total += 1;
      console.log(
        `::warning file=${resultFile},title=Invalid Link,line=${result.startLine ?? 0},endLine=${
          result.startLine ?? 0
        },col=${result.startColumn ?? 0},endColumn=${result.endColumn ?? result.startColumn ?? 0}::${
          result.title ?? "Invalid Link"
        }`,
      );
    }
    github.endGroup();
  }
  if (total > 0) {
    github.setFailed("One or more links are invalid!");
  }
}

function* concatIterables<IterableType>(...iterables: IterableIterator<IterableType>[]) {
  for (const iterable of iterables) {
    for (const value of iterable) {
      yield value;
    }
  }
}

const docFiles = importDirectory(path.join(cwd, "docs"), [".md", ".mdx"]);

if (!docFiles) {
  console.error("No doc files found!");
  process.exit(1);
}

const validLinks = new Map<string, string[]>([
  ["APPLICATIONS", []],
  ["SERVERS", []],
  ["TEAMS", []],
]);

// Gather valid links
const changelogAnchors = [];
for (const [name, raw] of docFiles) {
  const keyName = `/docs${name}`;
  if (!validLinks.has(keyName)) {
    validLinks.set(keyName, []);
  }
  const validAnchors = validLinks.get(keyName)!;

  // The changelog is unique in that each entry acts as it's own potential page,
  // and each entry can be represented in a single page under it's own H2.
  // This collects all potential change-log pages, and adds them to the list of
  // available anchors under `/change-log`.
  if (name.startsWith("/change-log/")) {
    const frontmatter = raw.split("---")[1];
    const parsedFrontmatter = yaml.load(frontmatter) as Frontmatter;
    const title = parsedFrontmatter?.title;
    if (title) {
      const anchor = title
        .replace(/[^ A-Z0-9]/gi, "")
        .trim()
        .replace(/ +/g, "-")
        .toLowerCase();
      changelogAnchors.push(anchor);
    }
  }

  let parentAnchor = "";
  let multilineCode = false;
  for (const line of raw.split("\n")) {
    if (line.trim().startsWith("```")) {
      multilineCode = !multilineCode;
      if (line.trim().length > 3 && line.trim().endsWith("```")) multilineCode = !multilineCode;
    }
    if (multilineCode || !line.startsWith("#")) continue;
    const anchor = line
      .split("%")[0]
      .replace(/[^ A-Z0-9]/gi, "")
      .trim()
      .replace(/ +/g, "-")
      .toLowerCase();
    if (/^#{1,5}(?!#)/.test(line.trim())) {
      parentAnchor = `${anchor}-`;
      validAnchors.push(anchor);
      continue;
    }
    validAnchors.push(`${parentAnchor}${anchor}`);
  }
}

// Add changelog anchors to the list of valid links
validLinks.get("/docs/change-log")?.push(...changelogAnchors);

const results = new Map<string, github.AnnotationProperties[]>();

// Check Links
for (const [name, raw] of docFiles) {
  const fileName = `docs${name}`;
  const file = raw.split("\n");
  if (!results.has(fileName)) {
    results.set(fileName, []);
  }
  const ownResults = results.get(fileName)!;
  let multilineCode = false;
  file.forEach((line, lineNum) => {
    if (line.trim().startsWith("```")) {
      multilineCode = !multilineCode;
      if (line.trim().length > 3 && line.trim().endsWith("```")) multilineCode = !multilineCode;
    }
    if (multilineCode) return;
    const markdownMatches = line.matchAll(/(?<![!`])\[.+?\]\((?!https?|mailto)(?<link>.+?)\)(?!`)/g);
    const componentMatches = line.matchAll(/(?:link|href)="(?!https?|mailto)(?<link>.+?)"/g);

    for (const match of concatIterables(markdownMatches, componentMatches)) {
      if (!match.groups) continue;
      const [page, anchor] = match.groups?.link.split("#") ?? [];
      if (!validLinks.has(page)) {
        // Automatically ignore links with "image/" as the prefix, since the link checker is not designed to validate images.
        if (page.startsWith("images/")) continue;

        ownResults.push({
          title: `Base url ${chalk.blueBright(page)} does not exist`,
          startLine: lineNum + 1,
          startColumn: match.index,
          endColumn: (match.index ?? 0) + match[0].length,
        });
        continue;
      }

      if (!anchor) continue;
      if (!validLinks.get(page)!.includes(anchor)) {
        const suggestions = validLinks.get(page)!.filter((a) => a.includes(anchor));
        const suggestionText = suggestions.length > 0 ? ` Did you mean one of (${suggestions.join(", ")})?` : "";
        ownResults.push({
          title: `Anchor ${chalk.cyan(anchor)} does not exist on ${chalk.blueBright(page)}${suggestionText}`,
          startLine: lineNum + 1,
          startColumn: match.index,
          endColumn: (match.index ?? 0) + match[0].length,
        });
      }
    }
  });
}

if (results.size > 0) {
  if (process.env.GITHUB_ACTIONS) {
    annotateResults(results);
  } else {
    printResults(results);
  }
}
