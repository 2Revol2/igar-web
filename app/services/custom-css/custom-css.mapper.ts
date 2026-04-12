import { promises as fs } from "node:fs";
import path from "node:path";
import { RED_PRIMARY, RED_REPLACEMENT, ROOT_SELECTOR } from "./custom-css.constants";
import type { CssMatch } from "./custom-css.constants";

function replaceColor(value: string, oldColor: string, newColor: string) {
  const escaped = oldColor.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return value.replace(new RegExp(escaped, "gi"), newColor);
}

function prefixSelector(selector: string, rootSelector: string) {
  return `${rootSelector} ${selector}`;
}

function buildCss(matches: CssMatch[]) {
  const now = new Date();
  const header = `/* 
    Generated at: ${now.toISOString()}
  */\n\n`;

  const body = matches
    .map((item) => {
      const selectors = item.selectors.map((selector) => prefixSelector(selector, ROOT_SELECTOR)).join(",\n");
      const value = replaceColor(item.value, RED_PRIMARY, RED_REPLACEMENT);
      const declarations = [
        `${item.property}: ${value};`,
        ...(item.property === "background" ? ["color: white;"] : []),
      ];
      return `${selectors} {\n  ${declarations.join("\n  ")}\n}`;
    })
    .join("\n\n");

  return header + body;
}

export async function applyCssAndSaveOurCssFile(matches: CssMatch[]) {
  const cssText = buildCss(matches);

  const outputPath = path.join(process.cwd(), "public", "ab-market.css");

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, cssText, "utf-8");

  return {
    outputPath,
    cssText,
  };
}
