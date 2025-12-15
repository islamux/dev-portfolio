import type { Metadata } from 'next';
import HomePage from "@/components/HomePage";
import { siteConfig } from '@/app/metadata';
import { getTranslations } from 'next-intl/server';


interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetaData({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });

  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      type: "website",
      locale: locale === "ar" ? "ar_SA" : locale === "fr" ? "fr_FR" : "en_US",
      url: siteConfig.name,
      images: [
        {
          url: "images/og-image.jpg",
          width: 1200,
          height: 630,
          alt: t("title"),
        }
      ]
    }
  }
};

export default async function Page({ params }: PageProps) {
  return (
    <HomePage params={params} />
  );
}
