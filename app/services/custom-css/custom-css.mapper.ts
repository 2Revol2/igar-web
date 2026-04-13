import { promises as fs } from "node:fs";
import path from "node:path";
import { CSS_REPLACEMENTS, ROOT_SELECTOR, OUR } from "./custom-css.constants";
import type { CssMatch } from "./custom-css.constants";

function replaceColor(value: string) {
  let result = value;
  for (const { value: from, replacement: to } of CSS_REPLACEMENTS) {
    const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    result = result.replace(new RegExp(escaped, "gi"), to);
  }
  return result;
}

function prefixSelector(selector: string, rootSelector: string) {
  return `${rootSelector} ${selector}`;
}

function getDate() {
  const now = new Date();
  return now.toISOString().replace("T", " ").split(".")[0];
}

function getHeader() {
  const now = getDate();
  return `/* 
\tGenerated at: ${now}
*/\n
${ROOT_SELECTOR} {
\t--red: ${OUR.Primary};
\t--red-hover: ${OUR.Light};
\t--color-red: ${OUR.Primary};
\t--color-red-hover: ${OUR.Light};
}\n\n
${ROOT_SELECTOR} ::selection {
  background-color: rgba(${OUR.Rgb.join(", ")}, .25) !important;
}
`;
}

function getUpdateTitle() {
  const now = getDate();
  return `\n\n/* --- Update ${now} --- */\n\n`;
}

async function readExistingCss(outputPath: string) {
  try {
    return await fs.readFile(outputPath, "utf-8");
  } catch (error: unknown) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === "ENOENT") {
      return "";
    }
    throw error;
  }
}

function buildBlocks(matches: CssMatch[]) {
  return matches.map((item) => {
    const selectors = item.selectors.map((selector) => prefixSelector(selector, ROOT_SELECTOR)).join(",\n");
    const value = replaceColor(item.value);
    const declarations = [`${item.property}: ${value};`, ...(item.property === "background" ? ["color: white;"] : [])];
    return `${selectors} {\n  ${declarations.join("\n  ")}\n}`;
  });
}

export async function applyCssAndSaveOurCssFile(matches: CssMatch[]) {
  const outputPath = path.join(process.cwd(), "public", "ab-market.css");
  const existingCss = await readExistingCss(outputPath);
  const blocks = buildBlocks(matches);
  const newBlocks = blocks.filter((block) => !existingCss.includes(block));
  if (!newBlocks.length) {
    return { cssText: "NO UPDATES" };
  }
  const baseText = existingCss ? existingCss + getUpdateTitle() : getHeader();
  const cssText = baseText + newBlocks.join("\n\n");
  await fs.writeFile(outputPath, cssText, "utf-8");
  return { cssText: "Updated" };
}
