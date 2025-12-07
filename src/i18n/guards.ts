import { Locale } from "next-intl";
import { locales } from "./config";

export function isValidateLocale(locale: string): locale is Locale {
  return locales.includes(locale as any);
}
