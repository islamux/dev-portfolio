'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLink {
  href: string;
  label: string;
  key: string;
}

interface DesktopNavigationProps {
  navLinks: NavLink[];
  navDict: Record<string, string>;
}

export function DesktopNavigation({ navLinks, navDict }: DesktopNavigationProps) {
  const pathname = usePathname();

  return (
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
  );
}
