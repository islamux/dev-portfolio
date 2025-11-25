import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

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

      <body className="antialiased">
        <Providers >{children}</Providers>
      </body>
    </html>
  );
}
