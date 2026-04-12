export type CssMatch = {
  selectors: string[];
  property: string;
  value: string;
};

export const ROOT_SELECTOR = "#ab-market";

type CssReplacement = {
  value: string;
  replacement: string;
};

const OUR = {
  Primary: "#009399",
  Dark: "#006569",
  Light: "#44aaae",
  Rgb: [0, 147, 153],
};

const CSS_REPLACEMENTS_MAP: Record<string, CssReplacement> = {
  Var: {
    value: "var(--ab-red)",
    replacement: OUR.Primary,
  },
  VarLight: {
    value: "var(--ab-red-hover)",
    replacement: OUR.Light,
  },
  Primary: {
    value: "#f25354",
    replacement: OUR.Primary,
  },
  Dark: {
    value: "#d12c2d",
    replacement: OUR.Dark,
  },
  Light: {
    value: "#ff7778",
    replacement: OUR.Light,
  },
  Grba: {
    value: "242,83,84",
    replacement: OUR.Rgb.join(","),
  },
  GrbaSpaces: {
    value: "242, 83, 84",
    replacement: OUR.Rgb.join(", "),
  },
};

export const CSS_REPLACEMENTS: CssReplacement[] = Object.values(CSS_REPLACEMENTS_MAP).map((r) => ({
  value: r.value.toLowerCase(),
  replacement: r.replacement,
}));
