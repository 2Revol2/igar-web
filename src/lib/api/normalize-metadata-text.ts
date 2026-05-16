import { headlessCms } from "@/src/services/api/headless-cms.service";
import { formatPhoneBY } from "@/src/helpers/shared/contacts";

export const normalizeMetadataText = (text?: string): string => {
  const REPLACEMENTS = headlessCms.data.settings.metadataTextReplacement;
  const phoneNumber = formatPhoneBY(headlessCms.data.contact.phone);
  if (!text) return "";

  let result = text;

  for (const [from, to] of Object.entries(REPLACEMENTS)) {
    result = result.replace(new RegExp(from, "g"), to);
  }

  result = result.replace(/(\+?\d[\d\s\-()]{7,}\d)/g, phoneNumber).replace(/Посетите наши шоурумы.*?!/gi, "");

  return result;
};
