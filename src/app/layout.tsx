import "./globals.css";

interface RootLayoutProps {
  children: React.ReactNode;
}

/**
 * Root layout - wraps entire app
 * Note: html, body, lang, and dir attributes are set in the locale-specific layout
 * This layout only imports global styles
 */
export default function RootLayout({
  children,
}: RootLayoutProps) {
  return children;
}
