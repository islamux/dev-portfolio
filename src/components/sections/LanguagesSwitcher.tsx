'use client';

import { localeFlag, localeNames, locales, type Locale } from "@/i18n/config";
// import { useLocale } from "next-intl"; // Removed
// import { usePathname, useRouter } from "@/i18n/navigation"; // Removed
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function LanguageSwitcher({ locale: localeString }: { locale: string }) {

  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const locale = localeString as Locale;
  const router = useRouter(); // Native Next.js router
  const pathname = usePathname(); // Native path (includes locale)

  // 1
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 2
  const handleLocaleChange = (newLocale: Locale) => {
    setIsOpen(false);
    if (!pathname) return;

    // Manual replacement logic
    // pathname is like "/en/about" or "/en/about.html" or "/" (root)
    let newPath = pathname;

    // Handle root "/" -> "/fr" (redirects to default usually but for static we want /fr)
    if (pathname === '/' && newLocale !== 'en') {
       newPath = `/${newLocale}`;
    } else {
       // Replace segment /en/ with /fr/
       // Regex to replace first segment if it matches a locale
       // We can assume path starts with /<locale>/ or is just /<locale>
       // Or we can rely on current 'locale' prop to know what to replace.
       const currentPrefix = `/${locale}`;
       if (pathname.startsWith(currentPrefix)) {
          newPath = pathname.replace(currentPrefix, `/${newLocale}`);
       } else if (pathname === `/${locale}`) {
          newPath = `/${newLocale}`;
       } else {
          // If path doesn't start with locale (e.g. /), try to prepend?
          // But usually we are already inside a locale based path.
          // Fallback
          newPath = `/${newLocale}${pathname}`;
       }
    }
    
    // For static, check .html? Hosting usually handles it, but let's be safe.
    // If it ends with .html, keep it.
    
    router.push(newPath);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Current Locale Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        aria-label="Change language"
      >
        <span className="text-lg">{localeFlag[locale]}</span>
        <span className="hidden sm:inline">{localeNames[locale]}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 91-7 7-7-7"
          />
        </svg>
      </button>

      {/*Dropdown Menu*/}
      {isOpen && (
        <div className="absolute end-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 py-1 z-50">
          {locales.map((loc) => (
            <button
              key={loc}
              onClick={() => handleLocaleChange(loc)}
              className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${locale === loc
                ? "bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`} >
              <span className="text-lg">{localeFlag[loc]}</span>
              <span>{localeNames[loc]}</span>
              {locale === loc && (
                <svg className="w-4 h-4 ms-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
