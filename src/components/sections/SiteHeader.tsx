'use client';

import Link from "next/link";
import Container from "../ui/Container";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "../ui/Button";
import { Icon } from "../ui/Icon";
import { navLinkKeys, getLocalizedHref } from "@/i18n/navigation";
import { type Locale } from "@/i18n/config";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "../ui/ThemeToggle";
import { MobileNavigation } from "./MobileNavigation";
import { DesktopNavigation } from "./DesktopNavigation";

export function SiteHeader({ navDict, locale }: { navDict: Record<string, string>; locale: string }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = navLinkKeys.map(link => ({
    ...link,
    href: getLocalizedHref(locale as Locale, link.key)
  }));

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/80">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link href={getLocalizedHref(locale as Locale, 'home')}
            className="text-xl font-bold text-gray-900 dark:text-white">
            Islamux
          </Link>

          <DesktopNavigation navLinks={navLinks} navDict={navDict} />

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <LanguageSwitcher locale={locale} />

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

        <MobileNavigation
          navLinks={navLinks}
          navDict={navDict}
          isOpen={isMenuOpen}
        />
      </Container>
    </header>
  );
}
