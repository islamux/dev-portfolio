import type { Metadata } from "next";

export const siteConfig = {
  name: "Islamux",
  title: "Islamux - Full-Stack Developer",
  description:
    "Full-stack developer specializing in Next.js, TypeScript, and Flutter. Building modern web applications.",
  url: "https://islamux.me",
  email: "fathi733@gmail.com",
  social: {
    github: "https://github.com/islamux",
    twitter: "https://twitter.com/islamux",
    linkedin: "https://www.linkedin.com/in/fathi-alqadasi-7893471b/",
  },
};

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "full-stack developer",
    "web developer",
    "Next.js",
    "TypeScript",
    "React",
    "Flutter",
    "open source",
  ],
  authors: [
    {
      name: siteConfig.name,
      url: siteConfig.url,
    },
  ],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
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
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: ["/images/og-image.jpg"],
    creator: "@islamux",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};
