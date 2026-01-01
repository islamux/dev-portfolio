import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import HomePage from "@/components/HomePage";
import { siteConfig } from '@/app/metadata';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetaData({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);

  // For static export, use static metadata to avoid headers() usage
  return {
    title: "Islamux - Software Developer",
    description: "Full-stack developer specializing in modern web applications",
    openGraph: {
      type: "website",
      locale: locale === "ar" ? "ar_SA" : locale === "fr" ? "fr_FR" : "en_US",
      url: siteConfig.name,
      images: [
        {
          url: "images/og-image.jpg",
          width: 1200,
          height: 630,
          alt: "Islamux - Software Developer",
        }
      ]
    }
  }
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <HomePage locale={locale} />
  );
}
