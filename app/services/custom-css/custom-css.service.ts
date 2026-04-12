import { findRulesByCssUrl } from "./custom-css.parser";
import { applyCssAndSaveOurCssFile } from "./custom-css.mapper";
import type { CssMatch } from "./custom-css.constants";
import type { HeadLink } from "../../types";

const readCssAndReplaceColors = async (headLinks: HeadLink[]) => {
  const requests: Array<Promise<CssMatch[]>> = [];
  headLinks.forEach(({ href }) => {
    if (/templates/.test(href)) {
      const request = findRulesByCssUrl(href);
      requests.push(request);
    }
  });
  const result = await Promise.all(requests);
  const cssMatches = result.flat();
  return await applyCssAndSaveOurCssFile(cssMatches);
};

export const customCssService = { readCssAndReplaceColors };
