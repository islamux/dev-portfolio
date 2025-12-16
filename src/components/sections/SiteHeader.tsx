'use client';

import Link from "next/link";
import Container from "../Container";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import { Icon } from "../ui/Icon";
import { LanguageSwitcher } from "./LanguagesSwitcher";
import { navLinks } from "@/i18n/navigation";
import { useMounted } from "../../hooks/useMounted";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "../ui/sheet";

export function SiteHeader() {

  // translation
  const t = useTranslations("nav");
  // uses
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  // Avoid hydration mismatch - standard Next.js pattern for client-only state
  const mounted = useMounted();


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
                {t(link.label)}
              </Link>
            ))}
          </nav>
          {/* Right side ; Theme toggle + Language*/}
          <div className="flex items-center space-x-4">
            {/* Dark mode Toggle*/}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
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
            <LanguageSwitcher />
            {/* Mobile Menue Button*/}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden h-9 w-9"
                  aria-label="Toggle menu"
                >
                  <Icon name="menu" size={24} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] border-l border-gray-200 dark:border-gray-800">
                <nav className="flex flex-col space-y-4 mt-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`text-lg font-medium transition-colors px-4 py-3 rounded-lg ${pathname === link.href
                        ? "bg-brand-50 text-brand-500 dark:bg-amber-900/30"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                    >
                      {t(link.label)}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </Container>
    </header>
  );
}
