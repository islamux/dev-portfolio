export type Locale = "en" | "fr" | "ar" | "es" | "tr";

export const locales: Locale[] = ["en", "fr", "ar", "es", "tr"];
export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  fr: "Français",
  ar: "العربية",
  es: "Español",
  tr: "Türkçe"
}

export const localeFlag: Record<Locale, string> = {
  en: "US",
  fr: "FR",
  ar: "AR",
  es: "ES",
  tr: "TR"
}

export const rtlLocales: Locale[] = ["ar"];

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function parseLocale(input: string): Locale {
  return isLocale(input) ? input : defaultLocale;
}

export function isRTL(locale: Locale): boolean {
  return rtlLocales.includes(locale);
}
