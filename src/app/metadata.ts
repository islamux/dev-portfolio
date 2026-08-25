import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";

export const siteConfig = {
  name: "Islamux",
  title: "Islamux - Full-Stack Developer",
  description:
    "Full-stack developer specializing in Next.js, TypeScript, and Flutter. Building modern web applications.",
  url: "https://islamux.me",
  email: "fathi733@gmail.com",
  twitterHandle: "@islamux",
  social: {
    github: "https://github.com/islamux",
    twitter: "https://twitter.com/islamux",
    linkedin: "https://www.linkedin.com/in/fathi-alqadasi-7893471b/",
  },
};

const OPEN_GRAPH_LOCALES: Record<Locale, string> = {
  en: "en_US",
  fr: "fr_FR",
  ar: "ar_SA",
  es: "es_ES",
  tr: "tr_TR",
};

interface PageMetadataInput {
  title: string;
  description: string;
  locale: Locale;
}

export function buildPageMetadata({ title, description, locale }: PageMetadataInput): Metadata {
  return {
    metadataBase: new URL(siteConfig.url),
    title,
    description,
    openGraph: {
      type: "website",
      locale: OPEN_GRAPH_LOCALES[locale],
      url: siteConfig.url,
      title,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: "/images/og-image.svg",
          width: 1200,
          height: 630,
          alt: siteConfig.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/og-image.svg"],
      creator: siteConfig.twitterHandle,
    },
  };
}
