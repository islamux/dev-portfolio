import Link from "next/link";
import Container from "@/components/Container";
import type { SocialLink } from "@/types";
import { Icon } from "@/components/ui/Icon";
import { siteConfig } from "@/app/metadata";

interface SiteFooterProps {
  socialLinks: SocialLink[];
};

export function SiteFooter({ socialLinks }: SiteFooterProps) {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
      <Container>
        <div className="py-12 md:py-16">
          {/*Top section Links*/}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/*About*/}
          </div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">About</h3>
          <p className="text-sm text-gray-900 dark:text-gray-400">
            {siteConfig.description}
          </p>
        </div>
        {/*Quick Links*/}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link
                href="/about"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-500">
                About
              </Link>
            </li>
            <li>
              <Link
                href="/projects"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-500">
                Projects
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-500">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        {/*Social */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
            Connect
          </h3>
          <div className="flex space-x-4">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-brand-500 transition-colors"
                aria-label={link.name}
              >
                <Icon name={link.icon} size={20} />
              </a>
            ))}

          </div>
        </div>
        <div>
          {/* Bottom section : Copyright*/}
        </div>
        <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
          <p className="text-sm text-center text-gray-600 dark:text-gray-400">
            © {currentYear} {siteConfig.name}. Built with Next.js and Tailwind CSS.

          </p>
        </div>
      </Container>
    </footer>
  );

}
