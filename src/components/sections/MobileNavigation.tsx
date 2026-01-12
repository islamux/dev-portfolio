'use client';

import Link from "next/link"
import { usePathname } from "next/navigation"

interface NavLink {
  href: string;
  label: string;
  key: string;
}

interface MobileNavigationProps {
  navLinks: NavLink[];
  navDict: Record<string, string>;
  isOpen: boolean;
}

export function MobileNavigation({ navLinks, navDict, isOpen }: MobileNavigationProps) {
  const pathname = usePathname();

  if (!isOpen) return null;
  return (
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
  );
}
