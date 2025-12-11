import "./globals.css";

interface RootLayoutProps {
  children: React.ReactNode;
}

/**
 * Root layout - wraps entire app with required html and body tags
 */
export default function RootLayout({
  children,
}: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
