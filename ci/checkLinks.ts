import { readdirSync, statSync, readFileSync } from "node:fs";
import path from "node:path";
import chalk from "chalk";
import * as github from "@actions/core";
const cwd = process.env.GITHUB_ACTIONS ? process.env.GITHUB_WORKSPACE! : process.cwd();

function importDirectory(directory: string, extension: string, subdirectories = true) {
	try {
		const output = new Map<string, string>();
		const files = readdirSync(directory);
		for (const fileOrPath of files) {
			const currentPath = path.join(directory, fileOrPath);
			if (statSync(currentPath).isDirectory()) {
				if (!subdirectories) continue;
				const subdir = importDirectory(currentPath, extension, subdirectories);
				if (!subdir) continue;
				for (const [name, read] of subdir) {
					output.set(`/${fileOrPath}${name}`, read);
				}
				continue;
			}
			if (!fileOrPath.endsWith(extension)) continue;
			const read = readFileSync(currentPath, "utf8");
			output.set(`/${fileOrPath}`, read);
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
				"warning"
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
				}`
			);
		}
		github.endGroup();
	}
	if (total > 0) {
		github.setFailed("One or more links are invalid!");
	}
}

const docFiles = importDirectory(path.join(cwd, "docs"), ".md");

if (!docFiles) {
	console.error("No doc files found!");
	process.exit(1);
}

const validLinks = new Map<string, string[]>([
	["APPLICATIONS", []],
	["SERVERS", []],
	["TEAMS", []],
]);

const extLength = ".md".length;

// Gather valid links
for (const [name, raw] of docFiles) {
	const keyName = `DOCS${name.slice(0, -extLength).replaceAll("/", "_").toUpperCase()}`;
	if (!validLinks.has(keyName)) {
		validLinks.set(keyName, []);
	}
	const validAnchors = validLinks.get(keyName)!;

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
		if (/^#{1,4}(?!#)/.test(line.trim())) {
			parentAnchor = `${anchor}-`;
			validAnchors.push(anchor);
			continue;
		}
		validAnchors.push(`${parentAnchor}${anchor}`);
	}
}

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
		const matches = line.matchAll(/(?<![!`])\[.+?\]\((?!https?|mailto)(.+?)\)(?!`)/g);

		for (const match of matches) {
			const split = match[1].split("#")[1].split("/");
			const page = split[0];
			const anchor = split[1];
			if (!validLinks.has(page)) {
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
