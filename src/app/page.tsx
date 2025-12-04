import type { Metadata } from 'next';
import HomePage from "@/components/HomePage";
import { siteConfig } from './metadata';

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: siteConfig.title,
      },
    ],
  },
};

export default function Page() {
  return (
    <HomePage />
  );
}
