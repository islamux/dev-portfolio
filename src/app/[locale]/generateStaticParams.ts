import { locales } from '@/i18n/config';

export function generateLocaleParams() {
  return locales.map((locale) => ({ locale }));
}
