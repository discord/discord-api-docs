#!/usr/bin/env node

import fs from "fs";
import path from "path";

// Configuration
const CONFIG = {
  imagesDir: "static/images",
  docsDir: "docs",
  rootFiles: ["."], // Check root markdown files too
  imageExtensions: [".gif", ".png", ".jpg", ".jpeg", ".webp", ".svg"],
  markupExtensions: [".md", ".mdx", ".js", ".ts", ".tsx", ".jsx"], // Include JS/TS for potential imports
  verbose: false,
};

class UnusedImageFinder {
  constructor(config) {
    this.config = config;
    this.stats = {
      totalImages: 0,
      referencedImages: 0,
      unusedImages: 0,
      totalMarkupFiles: 0,
    };
    this.imageReferences = new Set(); // Track which images are referenced
  }

  log(message, level = "info") {
    if (!this.config.verbose && level === "debug") return;
    const prefix = level === "error" ? "❌" : level === "warn" ? "⚠️" : level === "debug" ? "🔍" : "";
    if (prefix) {
      console.error(`${prefix} ${message}`);
    } else {
      console.error(message); // Use stderr for logging, stdout for results
    }
  }

  // Recursively find all files with given extensions
  findFiles(dir, extensions) {
    const files = [];

    const walk = (currentDir) => {
      try {
        const items = fs.readdirSync(currentDir);
        for (const item of items) {
          const fullPath = path.join(currentDir, item);
          let stat;
          try {
            stat = fs.statSync(fullPath);
          } catch {
            continue; // Skip inaccessible files
          }

          if (stat.isDirectory()) {
            // Skip node_modules and other common ignore patterns
            if (!item.startsWith(".") && item !== "node_modules") {
              walk(fullPath);
            }
          } else if (extensions.some((ext) => item.toLowerCase().endsWith(ext.toLowerCase()))) {
            files.push(fullPath);
          }
        }
      } catch (error) {
        this.log(`Cannot read directory ${currentDir}: ${error.message}`, "warn");
      }
    };

    walk(dir);
    return files;
  }

  // Get all images in the repository
  getAllImages() {
    const imageFiles = this.findFiles(this.config.imagesDir, this.config.imageExtensions);
    this.stats.totalImages = imageFiles.length;
    this.log(`Found ${imageFiles.length} images`, "debug");
    return imageFiles;
  }

  // Get all markup files that could reference images
  getAllMarkupFiles() {
    const markupFiles = [];

    // Check docs directory
    if (fs.existsSync(this.config.docsDir)) {
      markupFiles.push(...this.findFiles(this.config.docsDir, this.config.markupExtensions));
    }

    // Check root files
    const rootMarkupFiles = this.findFiles(".", this.config.markupExtensions).filter(
      (file) => !file.includes("node_modules") && !file.includes(this.config.docsDir),
    );
    markupFiles.push(...rootMarkupFiles);

    this.stats.totalMarkupFiles = markupFiles.length;
    this.log(`Found ${markupFiles.length} markup files`, "debug");
    return markupFiles;
  }

  // Extract image references from a file's content
  extractImageReferences(filePath, content) {
    const references = new Set();

    // Pattern 1: Markdown image syntax ![alt](path)
    const markdownImagePattern = /!\[[^\]]*\]\(([^)]+)\)/g;
    let match;
    while ((match = markdownImagePattern.exec(content)) !== null) {
      references.add(this.normalizeImagePath(match[1], filePath));
    }

    // Pattern 2: HTML img src
    const htmlImagePattern = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
    while ((match = htmlImagePattern.exec(content)) !== null) {
      references.add(this.normalizeImagePath(match[1], filePath));
    }

    // Pattern 3: Import statements (for JS/TS files)
    const importPattern = /import\s+[^'"]*['"]([^'"]*\.(?:png|jpg|jpeg|gif|webp|svg))['"];?/gi;
    while ((match = importPattern.exec(content)) !== null) {
      references.add(this.normalizeImagePath(match[1], filePath));
    }

    // Pattern 4: require() calls for images
    const requirePattern = /require\s*\(\s*['"]([^'"]*\.(?:png|jpg|jpeg|gif|webp|svg))['"]?\s*\)/gi;
    while ((match = requirePattern.exec(content)) !== null) {
      references.add(this.normalizeImagePath(match[1], filePath));
    }

    // Pattern 5: URL() in CSS-like content
    const urlPattern = /url\s*\(\s*['"]?([^'"]*\.(?:png|jpg|jpeg|gif|webp|svg))['"]?\s*\)/gi;
    while ((match = urlPattern.exec(content)) !== null) {
      references.add(this.normalizeImagePath(match[1], filePath));
    }

    return Array.from(references);
  }

  // Normalize image paths to match actual file paths
  normalizeImagePath(imagePath, referencingFile) {
    // Remove query parameters and fragments
    imagePath = imagePath.split("?")[0].split("#")[0];

    // Skip external URLs
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://") || imagePath.startsWith("//")) {
      return null;
    }

    let normalizedPath;

    if (imagePath.startsWith("static/images/")) {
      // Absolute reference from project root
      normalizedPath = imagePath;
    } else if (imagePath.startsWith("images/")) {
      // Relative to static/ directory
      normalizedPath = `static/${imagePath}`;
    } else if (imagePath.startsWith("./images/") || imagePath.startsWith("../")) {
      // Relative path - need to resolve based on referencing file location
      const referencingDir = path.dirname(referencingFile);
      const resolved = path.resolve(referencingDir, imagePath);
      const relative = path.relative(".", resolved);
      normalizedPath = relative.replace(/\\/g, "/"); // Normalize path separators
    } else if (imagePath.startsWith("/")) {
      // Absolute path from web root - assume it's in static/
      normalizedPath = `static${imagePath}`;
    } else {
      // Relative path without explicit prefix
      if (imagePath.includes("/")) {
        // Has directory structure, likely relative to static/images
        normalizedPath = `static/images/${imagePath}`;
      } else {
        // Just a filename, could be in various locations
        normalizedPath = imagePath;
      }
    }

    return normalizedPath;
  }

  // Scan all markup files for image references
  scanForImageReferences() {
    const markupFiles = this.getAllMarkupFiles();

    for (const filePath of markupFiles) {
      try {
        const content = fs.readFileSync(filePath, "utf8");
        const references = this.extractImageReferences(filePath, content);

        for (const ref of references) {
          if (ref) {
            this.imageReferences.add(ref);
            this.log(`${filePath} references: ${ref}`, "debug");
          }
        }
      } catch (error) {
        this.log(`Could not read ${filePath}: ${error.message}`, "warn");
      }
    }

    this.log(`Found ${this.imageReferences.size} unique image references`, "debug");
  }

  // Check if an image file is referenced
  isImageReferenced(imagePath) {
    // Try exact match first
    if (this.imageReferences.has(imagePath)) {
      return true;
    }

    // Try various normalizations
    const relativePath = path.relative(".", imagePath).replace(/\\/g, "/");
    if (this.imageReferences.has(relativePath)) {
      return true;
    }

    // Check if any reference ends with this file's path
    const fileName = path.basename(imagePath);
    for (const ref of this.imageReferences) {
      if (ref.endsWith(imagePath) || ref.endsWith(relativePath) || ref.endsWith(fileName)) {
        return true;
      }
    }

    // Check path variations
    const variations = [
      imagePath.replace("static/images/", "images/"),
      imagePath.replace("static/", ""),
      `/${imagePath}`,
      `/${relativePath}`,
    ];

    for (const variation of variations) {
      if (this.imageReferences.has(variation)) {
        return true;
      }
    }

    return false;
  }

  // Main function to find unused images
  findUnusedImages() {
    this.log("🔍 Finding unused images in Discord API docs...");

    // Get all images and references
    const allImages = this.getAllImages();
    this.scanForImageReferences();

    // Find unused images
    const unusedImages = [];

    for (const imagePath of allImages) {
      if (!this.isImageReferenced(imagePath)) {
        unusedImages.push(imagePath);
        this.stats.unusedImages++;
      } else {
        this.stats.referencedImages++;
      }
    }

    // Output results
    for (const unusedImage of unusedImages) {
      console.log(unusedImage); // Output to stdout for piping
    }

    // Log summary to stderr
    this.log(`\n📊 Summary:`);
    this.log(`   Total images: ${this.stats.totalImages}`);
    this.log(`   Referenced images: ${this.stats.referencedImages}`);
    this.log(`   Unused images: ${this.stats.unusedImages}`);
    this.log(`   Markup files scanned: ${this.stats.totalMarkupFiles}`);

    if (this.stats.unusedImages > 0) {
      this.log(`\n💡 To delete unused images: node find-unused-images.js | xargs rm`);
      this.log(`   Or to see sizes: node find-unused-images.js | xargs ls -lh`);
    }

    return unusedImages;
  }
}

// CLI handling
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const verbose = args.includes("--verbose") || args.includes("-v");

  if (args.includes("--help") || args.includes("-h")) {
    console.log(`
Discord API Docs - Find Unused Images

Usage: node find-unused-images.js [options]

Options:
  -v, --verbose    Show detailed logging
  -h, --help       Show this help message

Output: 
  Prints unused image paths to stdout (one per line)
  Logs summary and progress to stderr

Examples:
  node find-unused-images.js                    # Find unused images
  node find-unused-images.js | wc -l            # Count unused images
  node find-unused-images.js | xargs ls -lh     # Show sizes of unused images
  node find-unused-images.js | xargs rm         # Delete unused images (careful!)
    `);
    process.exit(0);
  }

  const config = { ...CONFIG, verbose };
  const finder = new UnusedImageFinder(config);

  try {
    finder.findUnusedImages();
  } catch (error) {
    console.error("❌ Failed to find unused images:", error.message);
    if (verbose) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

export { UnusedImageFinder };
