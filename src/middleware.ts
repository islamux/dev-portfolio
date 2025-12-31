import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "./i18n/config";

export default createMiddleware({
  //List all supported langs
  locales,

  // Default locale
  defaultLocale,

  // Don't use locale prefix for defaut locale
  // e.g. /about instaeda of /en/about 
  localePrefix: "as-needed",

  // Detect locale from Accept-Language HEADER
  localeDetection: true,
});

export const config = {
  // Match all paths except:
  // - API routes (/api/*)
  // - Next.js internal files (/_next/*)
  // - Static files with extensions (*.png, *.jpg, etc.)
  matcher: ["/((?!api|_next|.*\\..*).*)"],
}
