import { $ } from "execa";
import fs from "fs/promises";
import path from "path";

async function renameFilesInDirectory(directory) {
  const files = await fs.readdir(directory, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(directory, file.name);

    if (file.isDirectory()) {
      await renameFilesInDirectory(fullPath);
    } else {
      const newFileName = file.name.toLowerCase().replace(/_/g, "-");

      if (newFileName !== file.name) {
        const newFullPath = path.join(directory, newFileName);
        await $`git mv ${fullPath} ${newFullPath}`;
      }
    }
  }
}

await renameFilesInDirectory("docs");
