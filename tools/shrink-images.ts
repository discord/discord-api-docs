// @ts-check

import { execSync } from "child_process";
import fs from "fs";
import MagicString from "magic-string";

const allFiles = execSync("git ls-files", { encoding: "utf-8" }).toString().split("\n");

const docExts = ["md", "mdx"];
const docs = allFiles.filter((file: string) => docExts.some((ext) => file.endsWith(`.${ext}`)));

const badImageExts = ["png", "jpeg", "jpg", "gif", "svg"];
const badImages = allFiles.filter((file: string) => badImageExts.some((ext) => file.endsWith(`.${ext}`)));

type ImageReference = [filePath: string, imagePath: string, lineNumber: number];

const imageLookupMap: Record<string, ImageReference[]> = {};
const docContents: Record<string, string> = {};
const promises = docs.map(async (doc) => {
  const contents = await fs.promises.readFile(doc, { encoding: "utf-8" });
  docContents[doc] = contents;

  const lines = contents.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const imageMatch = line.match(/!\[.*\]\((.*)\)/);
    if (imageMatch) {
      const imagePath = imageMatch[1];
      imageLookupMap[imagePath] ??= [];
      imageLookupMap[imagePath].push([doc, imagePath, i + 1]);
    }
  }
});
await Promise.all(promises);

for (const image of badImages) {
  const imageReferences = imageLookupMap[image];
  const alternateImageReferences = imageLookupMap[image.replace("images/", "")];

  if (imageReferences && alternateImageReferences) {
    throw new Error("Ambiguous image references");
  }

  const references = imageReferences ?? alternateImageReferences ?? [];

  if (references.length === 0) {
    console.log(`Remove ${image}`);
    // fs.rmSync(image);
    continue;
  }

  console.log(image, references.length);
  // console.log(`magick ${image} -quality 80 ${webpPath}`);
  // for (const [doc, imagePath, lineNumber] of references) {
  //   // console.log(`  ${doc}:${lineNumber} - ${imagePath}`);

  //   const lines = docContents[doc].split("\n");
  //   const s = new MagicString(lines[lineNumber - 1]);
  //   s.replace(".png)", ".webp)");
  //   // console.log(`Rewrote ${doc}:${lineNumber} - ${imagePath}`);
  //   lines[lineNumber - 1] = s.toString();
  //   docContents[doc] = lines.join("\n");
  // }
}

for (const doc of docs) {
  await fs.promises.writeFile(doc, docContents[doc]);
}
