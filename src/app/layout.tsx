import "./globals.css";
import { Providers } from "./providers";
import { SkipToContent } from "@/components/ui/SkipToContent";
import SiteHeader from "@/components/sections/SiteHeader";
import { SiteFooter } from "@/components/sections/SiteFooter";
import { socialLinks } from "@/data/socialLinks";
import { defaultMetadata } from "./metadata";

export const metadata = defaultMetadata;

interface RootLayoutProps {
  children: React.ReactNode;
}
export default function RootLayout({
  children,
}: RootLayoutProps
) {


  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased flex flex-col min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        <SkipToContent />
        <Providers>
          <SiteHeader />
          <main id="main-content" className="grow">
            {children}
          </main>
          <SiteFooter socialLinks={socialLinks} />
        </Providers>
      </body>
    </html>
  );
}
