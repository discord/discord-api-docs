#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { exec } from "child_process";

// Configuration
const CONFIG = {
  imagesDir: "static/images",
  docsDir: "docs",
  tempDir: "/tmp/image-optimization-backup",
  reportsDir: "reports",
  dryRun: false, // Set to true to preview changes without executing
  verbose: true,
};

class ImageOptimizer {
  constructor(config) {
    this.config = config;
    this.stats = {
      conversions: { gif: 0, png: 0, jpg: 0, svg: 0 },
      references: { updated: 0, files: 0 },
      sizeBefore: 0,
      sizeAfter: 0,
      errors: [],
      fileDetails: [],
    };

    // Setup report directory
    this.reportDir = null;
    this.reportHtmlPath = null;
    this.setupReportDirectory();
  }

  log(message, level = "info") {
    if (!this.config.verbose && level === "debug") return;
    const prefix = level === "error" ? "❌" : level === "warn" ? "⚠️" : "✅";
    console.log(`${prefix} ${message}`);
  }

  // Setup report directory structure
  setupReportDirectory() {
    if (this.config.dryRun) return;

    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, "").replace("T", "-");
    this.reportDir = path.join(this.config.reportsDir, `optimization-${timestamp}`);

    try {
      fs.mkdirSync(this.reportDir, { recursive: true });
      fs.mkdirSync(path.join(this.reportDir, "before"), { recursive: true });
      fs.mkdirSync(path.join(this.reportDir, "after"), { recursive: true });

      this.reportHtmlPath = path.join(this.reportDir, "comparison.html");
      this.initializeHtmlReport();
      this.log(`Report directory created: ${this.reportDir}`, "debug");
    } catch (error) {
      this.log(`Failed to create report directory: ${error.message}`, "warn");
    }
  }

  // Initialize HTML report with header
  initializeHtmlReport() {
    if (!this.reportHtmlPath || this.config.dryRun) return;

    const htmlHeader = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Discord API Docs - Image Optimization Report</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f5f5f5;
            line-height: 1.6;
        }
        .header {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .comparison-item {
            background: white;
            padding: 20px;
            margin-bottom: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .comparison-title {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 10px;
            color: #333;
        }
        .comparison-stats {
            background: #f8f9fa;
            padding: 10px;
            border-radius: 4px;
            margin-bottom: 15px;
            font-family: monospace;
            font-size: 14px;
        }
        .image-comparison {
            display: flex;
            gap: 20px;
            align-items: flex-start;
        }
        .image-pair {
            flex: 1;
            text-align: center;
        }
        .image-pair h4 {
            margin: 0 0 10px 0;
            color: #666;
            font-size: 14px;
        }
        .image-pair img {
            max-width: 100%;
            height: auto;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }
        .savings-positive {
            color: #28a745;
            font-weight: 600;
        }
        .savings-negative {
            color: #dc3545;
            font-weight: 600;
        }
        @media (max-width: 768px) {
            .image-comparison {
                flex-direction: column;
            }
            body {
                padding: 10px;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>📊 Discord API Docs - Image Optimization Report</h1>
        <p>Generated on ${new Date().toLocaleString()}</p>
        <div id="summary">Loading summary...</div>
    </div>
    <div id="comparisons">
`;

    try {
      fs.writeFileSync(this.reportHtmlPath, htmlHeader);
    } catch (e) {
      this.log(`Failed to initialize HTML report: ${e.message}`, "warn");
    }
  }

  // Copy original file to report directory before optimization
  copyOriginalToReport(originalPath) {
    if (!this.reportDir || this.config.dryRun) return null;

    const filename = path.basename(originalPath);
    const beforePath = path.join(this.reportDir, "before", filename);

    try {
      fs.copyFileSync(originalPath, beforePath);
      this.log(`Copied original ${filename} to report`, "debug");
      return beforePath;
    } catch (error) {
      this.log(`Failed to copy original ${filename}: ${error.message}`, "debug");
      return null;
    }
  }

  // Add comparison to HTML report (collect data, don't write HTML yet)
  addComparisonToReport(originalPath, convertedPath, originalSize, convertedSize, beforeReportPath) {
    if (!this.reportDir || this.config.dryRun || !beforeReportPath) return;

    const filename = path.basename(originalPath);
    const afterPath = path.join(this.reportDir, "after", path.basename(convertedPath));

    try {
      // Copy converted file
      fs.copyFileSync(convertedPath, afterPath);

      // Calculate savings
      const savedBytes = originalSize - convertedSize;
      const savingsPercent = ((savedBytes / originalSize) * 100).toFixed(1);

      // Track details for summary and later HTML generation
      this.stats.fileDetails.push({
        filename,
        originalSize,
        convertedSize,
        savedBytes,
        savingsPercent: parseFloat(savingsPercent),
        originalPath,
        convertedPath: path.basename(convertedPath),
      });

      this.log(`Added ${filename} to report`, "debug");
    } catch (error) {
      this.log(`Failed to add ${filename} to report: ${error.message}`, "debug");
    }
  }

  // Recursively find all files with given extensions
  findFiles(dir, extensions) {
    const files = [];

    const walk = (currentDir) => {
      const items = fs.readdirSync(currentDir);
      for (const item of items) {
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          walk(fullPath);
        } else if (extensions.some((ext) => item.toLowerCase().endsWith(ext))) {
          files.push(fullPath);
        }
      }
    };

    walk(dir);
    return files;
  }

  // Get file size in bytes
  getFileSize(filePath) {
    try {
      return fs.statSync(filePath).size;
    } catch {
      return 0;
    }
  }

  // Convert image using ImageMagick
  async convertImage(inputPath, outputPath, quality = 85) {
    return new Promise((resolve, reject) => {
      const command = `magick "${inputPath}" -quality ${quality} "${outputPath}"`;

      if (this.config.dryRun) {
        this.log(`[DRY RUN] Would convert: ${inputPath} → ${outputPath}`, "debug");
        resolve();
        return;
      }

      exec(command, (error) => {
        if (error) {
          this.log(`Failed to convert ${inputPath}: ${error.message}`, "error");
          this.stats.errors.push(`Convert failed: ${inputPath} - ${error.message}`);
          reject(error);
        } else {
          this.log(`Converted: ${path.basename(inputPath)} → ${path.basename(outputPath)}`, "debug");
          resolve();
        }
      });
    });
  }

  // Optimize SVG using SVGO
  async optimizeSvg(filePath) {
    return new Promise((resolve, reject) => {
      if (this.config.dryRun) {
        this.log(`[DRY RUN] Would optimize SVG: ${filePath}`, "debug");
        resolve();
        return;
      }

      // Get original size before optimization
      const originalSize = this.getFileSize(filePath);
      const backupPath = `${filePath}.backup`;

      try {
        // Create backup
        fs.copyFileSync(filePath, backupPath);

        const command = `pnpm dlx svgo "${filePath}" --output "${filePath}"`;

        exec(command, (error) => {
          if (error) {
            // Restore backup on error
            try {
              fs.copyFileSync(backupPath, filePath);
              fs.unlinkSync(backupPath);
            } catch (restoreError) {
              this.log(`Failed to restore SVG backup: ${restoreError.message}`, "warn");
            }
            this.log(`Failed to optimize SVG ${filePath}: ${error.message}`, "error");
            this.stats.errors.push(`SVG optimization failed: ${filePath} - ${error.message}`);
            reject(error);
            return;
          }

          // Check if optimization reduced file size
          const optimizedSize = this.getFileSize(filePath);

          if (optimizedSize >= originalSize) {
            // Optimization made file larger or same size - revert
            try {
              fs.copyFileSync(backupPath, filePath);
              this.log(
                `Reverted ${path.basename(filePath)} - SVG optimization increased size (${originalSize} → ${optimizedSize} bytes)`,
                "warn",
              );
            } catch (revertError) {
              this.log(`Failed to revert SVG optimization: ${revertError.message}`, "warn");
            }
          } else {
            this.log(`Optimized SVG: ${path.basename(filePath)} (${originalSize} → ${optimizedSize} bytes)`, "debug");
          }

          // Clean up backup
          try {
            fs.unlinkSync(backupPath);
          } catch (cleanupError) {
            this.log(`Failed to cleanup SVG backup: ${cleanupError.message}`, "debug");
          }

          resolve();
        });
      } catch (backupError) {
        this.log(`Failed to create SVG backup: ${backupError.message}`, "warn");
        reject(backupError);
      }
    });
  }

  // Update image references in markdown files
  updateMarkdownReferences(filePath, replacements) {
    let content = fs.readFileSync(filePath, "utf8");
    let updated = false;
    let changeCount = 0;

    for (const [oldRef, newRef] of replacements) {
      const regex = new RegExp(oldRef.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
      const newContent = content.replace(regex, newRef);
      if (newContent !== content) {
        content = newContent;
        updated = true;
        changeCount++;
        this.log(`  Updated reference: ${oldRef} → ${newRef}`, "debug");
      }
    }

    if (updated && !this.config.dryRun) {
      fs.writeFileSync(filePath, content);
      this.stats.references.updated += changeCount;
    }

    return updated;
  }

  // Find all markdown references to images
  findImageReferences() {
    const mdFiles = this.findFiles(this.config.docsDir, [".md", ".mdx"]);
    mdFiles.push(...this.findFiles(".", [".md"]).filter((f) => !f.includes("node_modules")));

    const references = new Map();

    for (const file of mdFiles) {
      const content = fs.readFileSync(file, "utf8");

      // Pattern 1: static/images/path/file.ext
      const staticPattern = /!\[([^\]]*)\]\(static\/images\/([^)]+)\.(gif|png|jpg|jpeg)\)/g;

      // Pattern 2: images/path/file.ext
      const relativePattern = /!\[([^\]]*)\]\(images\/([^)]+)\.(gif|png|jpg|jpeg)\)/g;

      let match;

      // Find static/images references
      while ((match = staticPattern.exec(content)) !== null) {
        const [fullMatch, altText, imagePath, ext] = match;
        const key = `static/images/${imagePath}.${ext}`;
        if (!references.has(key)) references.set(key, []);
        references.get(key).push({
          file,
          oldRef: fullMatch,
          newRef: `![${altText}](static/images/${imagePath}.webp)`,
        });
      }

      // Reset regex
      relativePattern.lastIndex = 0;

      // Find images/ references
      while ((match = relativePattern.exec(content)) !== null) {
        const [fullMatch, altText, imagePath, ext] = match;
        const key = `static/images/${imagePath}.${ext}`;
        if (!references.has(key)) references.set(key, []);
        references.get(key).push({
          file,
          oldRef: fullMatch,
          newRef: `![${altText}](images/${imagePath}.webp)`,
        });
      }
    }

    return references;
  }

  // Main optimization workflow
  async optimize() {
    this.log("🚀 Starting Discord API Docs Image Optimization");
    this.log(`Mode: ${this.config.dryRun ? "DRY RUN" : "LIVE"}`, "warn");

    // Step 1: Analyze current images
    this.log("\n📊 Analyzing current images...");
    const imageFiles = this.findFiles(this.config.imagesDir, [".gif", ".png", ".jpg", ".jpeg"]);
    const svgFiles = this.findFiles(this.config.imagesDir, [".svg"]);

    // Calculate initial size
    for (const file of [...imageFiles, ...svgFiles]) {
      this.stats.sizeBefore += this.getFileSize(file);
    }

    this.log(`Found ${imageFiles.length} raster images and ${svgFiles.length} SVGs`);
    this.log(`Total size before: ${(this.stats.sizeBefore / 1024 / 1024).toFixed(1)}MB`);

    // Step 2: Convert images to WebP
    this.log("\n🔄 Converting images to WebP...");
    const conversions = [];

    for (const imagePath of imageFiles) {
      const ext = path.extname(imagePath).toLowerCase();
      const baseName = path.basename(imagePath, ext);
      const dir = path.dirname(imagePath);
      const webpPath = path.join(dir, `${baseName}.webp`);

      try {
        // Copy original to report directory before conversion
        const originalSize = this.getFileSize(imagePath);
        const beforeReportPath = this.copyOriginalToReport(imagePath);

        // Convert to WebP
        await this.convertImage(imagePath, webpPath);

        // Check if optimization actually reduced file size
        const convertedSize = this.getFileSize(webpPath);

        if (convertedSize >= originalSize) {
          // Optimization made file larger or same size - revert
          try {
            fs.unlinkSync(webpPath);
            this.log(
              `Reverted ${path.basename(imagePath)} - optimization increased size (${originalSize} → ${convertedSize} bytes)`,
              "warn",
            );
            continue;
          } catch (unlinkError) {
            this.log(`Failed to remove larger optimized file ${webpPath}: ${unlinkError.message}`, "warn");
          }
        }

        // Add to report after successful optimization
        this.addComparisonToReport(imagePath, webpPath, originalSize, convertedSize, beforeReportPath);

        conversions.push({ original: imagePath, converted: webpPath, ext });

        if (ext === ".gif") this.stats.conversions.gif++;
        else if (ext === ".png") this.stats.conversions.png++;
        else if (ext.match(/\.jpe?g/)) this.stats.conversions.jpg++;
      } catch {
        this.log(`Skipping ${imagePath} due to conversion error`, "warn");
      }
    }

    // Step 3: Optimize SVGs
    this.log("\n🎨 Optimizing SVG files...");
    for (const svgPath of svgFiles) {
      try {
        await this.optimizeSvg(svgPath);
        this.stats.conversions.svg++;
      } catch {
        this.log(`Skipping ${svgPath} due to optimization error`, "warn");
      }
    }

    // Step 4: Find all image references
    this.log("\n🔍 Finding image references in markdown files...");
    const references = this.findImageReferences();
    this.log(`Found references to ${references.size} unique images`);

    // Step 5: Update markdown references
    this.log("\n📝 Updating markdown references...");
    const fileUpdates = new Map();

    for (const [imagePath, refs] of references) {
      // Check if we converted this image
      const webpPath = imagePath.replace(/\.(gif|png|jpg|jpeg)$/i, ".webp");
      const webpExists = fs.existsSync(webpPath) || this.config.dryRun;

      if (webpExists) {
        for (const ref of refs) {
          if (!fileUpdates.has(ref.file)) fileUpdates.set(ref.file, []);
          fileUpdates.get(ref.file).push([ref.oldRef, ref.newRef]);
        }
      } else {
        this.log(`Warning: WebP not found for ${imagePath}, skipping reference updates`, "warn");
      }
    }

    // Apply updates to files
    for (const [file, replacements] of fileUpdates) {
      if (this.updateMarkdownReferences(file, replacements)) {
        this.stats.references.files++;
        this.log(`Updated references in ${path.relative(".", file)}`, "debug");
      }
    }

    // Step 6: Calculate final sizes and cleanup
    if (!this.config.dryRun) {
      for (const { converted } of conversions) {
        this.stats.sizeAfter += this.getFileSize(converted);
      }

      for (const svgPath of svgFiles) {
        this.stats.sizeAfter += this.getFileSize(svgPath);
      }
    }

    // Step 7: Remove original files (only if everything succeeded)
    if (!this.config.dryRun && this.stats.errors.length === 0) {
      this.log("\n🗑️  Removing original files...");
      for (const { original } of conversions) {
        try {
          fs.unlinkSync(original);
          this.log(`Removed: ${path.basename(original)}`, "debug");
        } catch (error) {
          this.log(`Failed to remove ${original}: ${error.message}`, "warn");
        }
      }
    }

    // Finalize HTML report
    this.finalizeHtmlReport();

    // Final report
    this.printSummary();
  }

  // Finalize HTML report with summary and footer
  finalizeHtmlReport() {
    if (!this.reportHtmlPath || this.config.dryRun) return;

    try {
      // Calculate summary stats
      const totalOriginalSize = this.stats.fileDetails.reduce((sum, file) => sum + file.originalSize, 0);
      const totalConvertedSize = this.stats.fileDetails.reduce((sum, file) => sum + file.convertedSize, 0);
      const totalSaved = totalOriginalSize - totalConvertedSize;
      const totalSavingsPercent = totalOriginalSize > 0 ? ((totalSaved / totalOriginalSize) * 100).toFixed(1) : "0";

      // Format file sizes
      const formatBytes = (bytes) => {
        if (bytes === 0) return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
      };

      // Top 10 biggest savers
      const topSavers = this.stats.fileDetails.sort((a, b) => b.savedBytes - a.savedBytes).slice(0, 10);

      // Generate summary content
      const summaryHtml = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px;">
            <div style="background: #e8f5e8; padding: 15px; border-radius: 4px; text-align: center;">
                <div style="font-size: 24px; font-weight: bold; color: #28a745;">${this.stats.fileDetails.length}</div>
                <div style="font-size: 14px; color: #666;">Files Optimized</div>
            </div>
            <div style="background: #e8f4fd; padding: 15px; border-radius: 4px; text-align: center;">
                <div style="font-size: 24px; font-weight: bold; color: #007bff;">${formatBytes(totalOriginalSize)}</div>
                <div style="font-size: 14px; color: #666;">Original Size</div>
            </div>
            <div style="background: #e8f4fd; padding: 15px; border-radius: 4px; text-align: center;">
                <div style="font-size: 24px; font-weight: bold; color: #007bff;">${formatBytes(totalConvertedSize)}</div>
                <div style="font-size: 14px; color: #666;">Optimized Size</div>
            </div>
            <div style="background: #e8f5e8; padding: 15px; border-radius: 4px; text-align: center;">
                <div style="font-size: 24px; font-weight: bold; color: #28a745;">${formatBytes(totalSaved)}</div>
                <div style="font-size: 14px; color: #666;">Total Saved (${totalSavingsPercent}%)</div>
            </div>
        </div>
        
        <details style="margin-bottom: 20px;">
            <summary style="cursor: pointer; font-weight: 600; padding: 10px 0;">🏆 Top 10 Space Savers</summary>
            <div style="margin-top: 10px;">
                ${topSavers
                  .map(
                    (file, i) =>
                      `<div style="padding: 5px 0; border-bottom: 1px solid #eee;">
                     ${i + 1}. <strong>${file.filename}</strong> - Saved ${formatBytes(file.savedBytes)} (${file.savingsPercent}%)
                   </div>`,
                  )
                  .join("")}
            </div>
        </details>
      `;

      // Sort files by converted size (descending) - largest optimized files first
      const sortedFiles = this.stats.fileDetails.sort((a, b) => b.convertedSize - a.convertedSize);

      // Generate HTML comparisons for all files (sorted)
      const comparisonsHtml = sortedFiles
        .map((file) => {
          const savingsClass = file.savedBytes > 0 ? "savings-positive" : "savings-negative";

          return `
    <div class="comparison-item">
        <div class="comparison-title">${file.filename}</div>
        <div class="comparison-stats">
            Original: ${formatBytes(file.originalSize)} → Optimized: ${formatBytes(file.convertedSize)} 
            | <span class="${savingsClass}">Saved: ${formatBytes(Math.abs(file.savedBytes))} (${Math.abs(file.savingsPercent)}%)</span>
        </div>
        <div class="image-comparison">
            <div class="image-pair">
                <h4>Before</h4>
                <img src="before/${file.filename}" alt="Original ${file.filename}" loading="lazy">
            </div>
            <div class="image-pair">
                <h4>After (WebP)</h4>
                <img src="after/${file.convertedPath}" alt="Optimized ${file.filename}" loading="lazy">
            </div>
        </div>
    </div>`;
        })
        .join("\n");

      // Update summary section and add all comparisons
      const currentContent = fs.readFileSync(this.reportHtmlPath, "utf8");
      const updatedContent = currentContent.replace(
        '<div id="summary">Loading summary...</div>',
        `<div id="summary">${summaryHtml}</div>`,
      );

      // Add footer
      const htmlFooter = `
${comparisonsHtml}
    </div>
    <div class="header" style="margin-top: 40px; text-align: center; color: #666;">
        <p>🎉 Optimization Complete! Generated ${this.stats.fileDetails.length} comparisons.</p>
        <p style="font-size: 12px;">Files are sorted by optimized file size (largest first)</p>
        <p style="font-size: 12px;">Report generated by Discord API Docs Image Optimizer</p>
    </div>
</body>
</html>`;

      fs.writeFileSync(this.reportHtmlPath, updatedContent + htmlFooter);

      this.log(`\n📊 Visual comparison report generated: ${this.reportHtmlPath}`);
      this.log(`   View in browser: file://${path.resolve(this.reportHtmlPath)}`);
    } catch (error) {
      this.log(`Failed to finalize HTML report: ${error.message}`, "warn");
    }
  }

  printSummary() {
    console.log("\n" + "=".repeat(60));
    console.log("📈 OPTIMIZATION SUMMARY");
    console.log("=".repeat(60));

    console.log(`\n🔄 Conversions:`);
    console.log(`   GIFs → WebP: ${this.stats.conversions.gif}`);
    console.log(`   PNGs → WebP: ${this.stats.conversions.png}`);
    console.log(`   JPGs → WebP: ${this.stats.conversions.jpg}`);
    console.log(`   SVG optimized: ${this.stats.conversions.svg}`);

    console.log(`\n📝 Reference Updates:`);
    console.log(`   Files updated: ${this.stats.references.files}`);
    console.log(`   References updated: ${this.stats.references.updated}`);

    if (!this.config.dryRun) {
      const beforeMB = (this.stats.sizeBefore / 1024 / 1024).toFixed(1);
      const afterMB = (this.stats.sizeAfter / 1024 / 1024).toFixed(1);
      const savedMB = (beforeMB - afterMB).toFixed(1);
      const percentage = ((savedMB / beforeMB) * 100).toFixed(1);

      console.log(`\n💾 Size Reduction:`);
      console.log(`   Before: ${beforeMB}MB`);
      console.log(`   After: ${afterMB}MB`);
      console.log(`   Saved: ${savedMB}MB (${percentage}% reduction)`);
    }

    if (this.stats.errors.length > 0) {
      console.log(`\n❌ Errors (${this.stats.errors.length}):`);
      this.stats.errors.forEach((error) => console.log(`   ${error}`));
    }

    console.log("\n✨ Optimization complete!");
  }
}

// CLI handling
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const verbose = !args.includes("--quiet");

  if (args.includes("--help")) {
    console.log(`
Discord API Docs Image Optimizer

Usage: node optimize-images.js [options]

Options:
  --dry-run     Preview changes without executing
  --quiet       Suppress verbose output  
  --help        Show this help message

Examples:
  node optimize-images.js --dry-run    # Preview what would be changed
  node optimize-images.js              # Run full optimization
    `);
    process.exit(0);
  }

  const config = { ...CONFIG, dryRun, verbose };
  const optimizer = new ImageOptimizer(config);

  optimizer.optimize().catch((error) => {
    console.error("❌ Optimization failed:", error);
    process.exit(1);
  });
}

export { ImageOptimizer };
