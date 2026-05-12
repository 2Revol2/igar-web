export const normalizeMetadataText = (text?: string): string => {
  if (!text) return "";

  const replacements: Record<string, string> = {
    Россия: "Беларусь",
    России: "Беларуси",

    Москва: "Минск",
    Москве: "Минске",
    Москвы: "Минска",
    Москву: "Минск",

    "Вельвет-ПРО": "АБ-Маркет",
    "вельвет-про": "аб-маркет",

    "ул. Котляковская, 3с1": "ул. Тимирязева, дом 97, каб. 22-148",
  };

  let result = text;

  for (const [from, to] of Object.entries(replacements)) {
    result = result.replace(new RegExp(from, "g"), to);
  }

  result = result
    .replace(/(\+?\d[\d\s\-()]{7,}\d)/g, "+375 29 603-80-38")
    .replace(/Посетите наши шоурумы.*?СПб.*?!/gi, "");

  return result;
};
