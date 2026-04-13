import postcss from "postcss";
import valueParser from "postcss-value-parser";
import safeParser from "postcss-safe-parser";
import { CSS_REPLACEMENTS } from "./custom-css.constants";

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function containsTargetColor(cssValue: string) {
  const parsed = valueParser(cssValue);
  let found = false;

  parsed.walk((node) => {
    if (node.type === "word") {
      const value = normalize(node.value);
      if (CSS_REPLACEMENTS.some((r) => value.includes(r.value))) {
        found = true;
      }
    }
  });

  return found;
}

export async function findRulesByCssUrl(cssUrl: string) {
  const response = await fetch(cssUrl);
  const cssText = await response.text();

  const result = await postcss().process(cssText, {
    parser: safeParser,
    from: undefined,
  });
  const root = result.root;

  const matches: Array<{
    selectors: string[];
    property: string;
    value: string;
  }> = [];

  root.walkRules((rule) => {
    rule.walkDecls((decl) => {
      if (containsTargetColor(decl.value)) {
        matches.push({
          selectors: rule.selectors ?? [],
          property: decl.prop,
          value: decl.value,
        });
      }
    });
  });

  return matches;
}
