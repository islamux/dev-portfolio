// ------- Step 1 define types
// Supported languages coded
export type Locale = "en" | "fr" | "ar" | "es" | "tr";

// Info about single languag
export interface languageInfo {
  name: string;
  flag: string;
  rtl: boolean;
}

// ------ Step 2  create seperate exports
// List of all Supported languages.
export const locales: Locale[] = ["en", "fr", "ar", "es", "tr"];

// Default locale
export const defaultLocale: Locale = "en";

// Human readable names for each lang
export const localeNames: Record<Locale, string> = {
  en: "English",
  fr: "Français",
  ar: "العربية",
  es: "Español",
  tr: "Türkçe"
}

// Flags codes for each lang 
export const localeFlag: Record<Locale, string> = {
  en: "US",
  fr: "FR",
  ar: "AR",
  es: "ES",
  tr: "TR"
}

// Which locale use RTL 
export const rtlLocales: Locale[] = ["ar"];

// ----- Step 3 : Helper Func

// Check if locale use RTL
export function isRTL(locale: Locale): boolean {
  return rtlLocales.includes(locale);
}

// Get all Info about a locale.
export function getLanguagesInfo(locale: Locale): languageInfo {
  return {
    name: localeNames[locale],
    flag: localeFlag[locale],
    rtl: isRTL(locale),
  };

}
