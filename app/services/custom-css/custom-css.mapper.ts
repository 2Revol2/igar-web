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

function buildCss(matches: CssMatch[], isCssCollect?: boolean) {
  const now = new Date();
  const header = isCssCollect
    ? `\n\n/* --- Nuxt --- */\n\n`
    : `/* 
\tGenerated at: ${now.toISOString()}
*/\n
:root {
\t--color-red: ${OUR.Primary};
\t--color-red-hover: ${OUR.Light};
}\n\n`;

  const blocks = matches.map((item) => {
    const selectors = item.selectors.map((selector) => prefixSelector(selector, ROOT_SELECTOR)).join(",\n");
    const value = replaceColor(item.value);
    const declarations = [`${item.property}: ${value};`, ...(item.property === "background" ? ["color: white;"] : [])];
    return `${selectors} {\n  ${declarations.join("\n  ")}\n}`;
  });

  const body = [...new Set(blocks)].join("\n\n");

  return header + body;
}

export async function applyCssAndSaveOurCssFile(matches: CssMatch[], isCssCollect?: boolean) {
  console.log("----- ", isCssCollect);
  console.log(matches);
  const cssText = buildCss(matches, isCssCollect);

  const outputPath = path.join(process.cwd(), "public", "ab-market.css");

  if (isCssCollect) {
    await fs.appendFile(outputPath, cssText, "utf-8");
  } else {
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, cssText, "utf-8");
  }

  return {
    outputPath,
    cssText,
  };
}
