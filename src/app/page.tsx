import type { Metadata } from 'next';
import HomePage from "@/components/HomePage";

export const metadata: Metadata = {
  title: "Islamux - Full-Stack Developer",
  description:
    "Full-stack developer specializing in Next.js, TypeScript, and Flutter",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://yoursite.com",
    siteName: "Islamux Portfolio",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Islamux Portfolio",
      },
    ],
  },
};

export default function Page() {
  return (
    <HomePage />
  );
}
