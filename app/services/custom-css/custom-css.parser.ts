import postcss from "postcss";
import valueParser from "postcss-value-parser";
import safeParser from "postcss-safe-parser";
import { RED_PRIMARY } from "./custom-css.constants";

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function containsTargetColor(cssValue: string, targetColor: string) {
  const parsed = valueParser(cssValue);
  let found = false;

  parsed.walk((node) => {
    if (node.type === "word" && normalize(node.value) === targetColor) {
      found = true;
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
      if (containsTargetColor(decl.value, RED_PRIMARY)) {
        matches.push({
          selectors: rule.selectors ?? [],
          property: decl.prop,
          value: decl.value,
        });
      }
    });
  });

  console.log("--------");
  console.log("--", cssUrl);
  console.log(matches);

  return matches;
}
