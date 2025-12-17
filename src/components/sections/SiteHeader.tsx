'use client';

import Link from "next/link";
import Container from "../Container";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import Button from "../ui/Button";
import { Icon } from "../ui/Icon";
import { LanguageSwitcher } from "./LanguagesSwitcher";
import { navLinks } from "@/i18n/navigation";
import { useMounted } from "../../hooks/useMounted";

// export function SiteHeader() {
export function SiteHeader({ navDict }: { navDict: Record<string, string> }) {

  // translation
  // const t = useTranslations("nav");
  // uses
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  // Avoid hydration mismatch - standard Next.js pattern for client-only state
  const mounted = useMounted();

  // Close mobile menu when route changes - valid state synchronization
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMenuOpen(false);
  }, [pathname]);


  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/80">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/*Logo*/}
          <Link href="/"
            className="text-xl font-bold text-gray-900 dark:text-white">
            Islamux
          </Link>
          {/*Desktop Navigation*/}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-brand-500 ${pathname === link.href
                  ? "text-brand-500"
                  : "text-gray-700 dark:text-gray-300"
                  }`}
              >
                {navDict[link.label] || link.label}
              </Link>
            ))}
          </nav>
          {/* Right side ; Theme toggle + Language*/}
          <div className="flex items-center space-x-4">
            {/* Dark mode Toggle*/}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle dark mode"
            >
              {mounted ? (
                theme === "dark" ? (
                  <Icon name="sun" size={20} />
                ) : (
                  <Icon name="moon" size={20} />
                )
              ) : (
                <Icon name="moon" size={20} />
              )}
            </Button>
            {/* Language Switcher */}
            {/* <LanguageSwitcher /> */}
            <div className="text-xs">
                 <Link href="/en" className="px-1">EN</Link>|
                 <Link href="/fr" className="px-1">FR</Link>|
                 <Link href="/ar" className="px-1">AR</Link>
            </div>

            {/* Mobile Menue Button*/}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <Icon name={isMenuOpen ? "close" : "menu"} size={24} />
            </Button>
          </div>
        </div>
        {/*Mobile Navigation*/}
        {isMenuOpen && (
          <nav className="md:hidden py-4 space-y-2 border-t border-gray-200 dark:border-gray-800">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-2 rounded-lg transition-colors ${pathname === link.href
                  ? "bg-brand-50 text-brand-500 dark:bg-amber-900/30"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
              >
                {navDict[link.label] || link.label}
              </Link>
            ))}
          </nav>
        )}
      </Container>
    </header>
  );
}
