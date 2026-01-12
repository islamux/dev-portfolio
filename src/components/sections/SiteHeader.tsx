'use client';

import Link from "next/link";
import Container from "../ui/Container";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "../ui/Button";
import { Icon } from "../ui/Icon";
import { navLinkKeys, getLocalizedHref } from "@/i18n/navigation";
import { type Locale } from "@/i18n/config";
import { LanguageSwitcher } from "./LanguagesSwitcher";
import { ThemeToggle } from "../ui/ThemeToggle";
import { MobileNavigation } from "./MobileNavigation";
import { DesktopNavigation } from "./DesktopNavigation";

export function SiteHeader({ navDict, locale }: { navDict: Record<string, string>; locale: string }) {

  // uses
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // const { theme, setTheme } = useTheme();
  const pathname = usePathname();


  // Generate nav links with locale prefix
  const navLinks = navLinkKeys.map(link => ({
    ...link,
    href: getLocalizedHref(locale as Locale, link.key)
  }));

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
          <DesktopNavigation navLinks={navLinks} navDict={navDict} />

          {/* Right side ; Theme toggle + Language*/}
          <div className="flex items-center space-x-4">
            {/* Dark mode Toggle*/}
            <ThemeToggle />

            {/* Language Switcher */}
            <LanguageSwitcher locale={locale} />

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
        <MobileNavigation
          navLinks={navLinks}
          navDict={navDict}
          isOpen={isMenuOpen}
        />

      </Container>
    </header>
  );
}
