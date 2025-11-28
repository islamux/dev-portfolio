import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { SkipToContent } from "@/components/ui/SkipToContent";
import SiteHeader from "@/components/sections/SiteHeader";
import { SiteFooter } from "@/components/sections/SiteFooter";
import { socialLinks } from "@/data/socialLinks";

export const metadata: Metadata = {
  title: "Islamux - Portfolio",
  description: "Full-stack developer portfolio",
};

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
          <main id="main-content" className="flex-grow">
            {children}
          </main>
          <SiteFooter socialLinks={socialLinks} />
        </Providers>
      </body>
    </html>
  );
}
