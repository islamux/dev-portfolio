import "../globals.css";

interface RootLayoutProps {
  children: React.ReactNode;
}

/**
 * Root layout for the index route (redirect)
 */
export default function RootLayout({
  children,
}: RootLayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
