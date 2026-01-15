import fs from "fs";
import path from "path";
import { parseStringPromise } from "xml2js";
import { fileURLToPath } from "url";

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure paths
const REPO_ROOT = path.resolve(__dirname, "..", "..");
const XML_DIR = path.join(__dirname, "xml_output");
const OUTPUT_JSON = path.join(__dirname, "social-sdk-mappings.json");
const BASE_URL = "https://discord.com/developers/docs/social-sdk";

// Helper function to ensure paths are resolved correctly
const resolvePath = (relativePath, isOutput = false) => {
  // For output files, just return the path relative to current directory
  if (isOutput) {
    return path.resolve(relativePath);
  }

  // For input files, try both locations
  if (fs.existsSync(relativePath)) {
    return relativePath;
  }
  const repoPath = path.join(REPO_ROOT, relativePath);
  if (fs.existsSync(repoPath)) {
    return repoPath;
  }
  throw new Error(`Could not resolve input path: ${relativePath}`);
};

// Function to read and parse XML files
const parseXml = async (filePath) => {
  const data = await fs.promises.readFile(filePath, "utf-8");
  return parseStringPromise(data);
};

const generateMapping = async () => {
  // Check if XML output directory exists
  if (!fs.existsSync(XML_DIR)) {
    // XML output directory not found! Run Doxygen first to generate XML files.
    return;
  }

  const indexPath = resolvePath(path.join(XML_DIR, "index.xml"));
  if (!fs.existsSync(indexPath)) {
    // index.xml not found! Ensure Doxygen XML output exists.
    return;
  }

  const indexData = await parseXml(indexPath);
  const compounds = indexData.doxygenindex.compound;
  const mapping = {};

  for (const compound of compounds) {
    const refid = compound.$.refid;
    const name = compound.name[0];
    const detailedXmlPath = resolvePath(path.join(XML_DIR, `${refid}.xml`));

    if (!fs.existsSync(detailedXmlPath)) {
      continue;
    }

    const detailedData = await parseXml(detailedXmlPath);
    const members = detailedData.doxygen.compounddef[0].sectiondef || [];

    for (const section of members) {
      if (!section.memberdef) continue;

      for (const member of section.memberdef) {
        const memberKind = member.$.kind;
        const memberName = member.name[0];
        let memberId = member.$.id;

        if (["function", "enum", "class", "struct"].includes(memberKind)) {
          memberId = memberId.replace(`${refid}_1`, "");
          const url = `${BASE_URL}/${refid}.html#${memberId}`;
          // Keep the discordpp:: prefix in the symbol name
          const symbol = `${name}::${memberName}`;

          if (!(symbol in mapping)) {
            mapping[symbol] = url;
          }
        }
      }
    }
  }

  // Save JSON mapping
  const outputJsonPath = resolvePath(OUTPUT_JSON, true);
  await fs.promises.writeFile(outputJsonPath, JSON.stringify(mapping, null, 2));

  console.log(`JSON mapping saved to ${outputJsonPath}`);
};

// Run the script

generateMapping().catch(console.error);
