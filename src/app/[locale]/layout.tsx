import "../globals.css";
import { SkipToContent } from "@/components/ui/SkipToContent";
import { Providers } from "../providers";
import { SiteHeader } from "@/components/sections/SiteHeader";
import { SiteFooter } from "@/components/sections/SiteFooter";
import { socialLinks } from '@/data/socialLinks';
import { isRTL, locales, parseLocale } from "@/i18n/config";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from 'next-intl/server';
import { loadMessages } from "@/lib/content";
import type { FooterMessages } from "@/types/content";

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout(
  { children, params }: LocaleLayoutProps) {
  const locale = parseLocale((await params).locale);
  setRequestLocale(locale);

  const messages = await loadMessages(locale);
  const navDict = (messages.nav ?? {}) as Record<string, string>;
  const footerMessages = messages.footer as FooterMessages | undefined;

  const direction = isRTL(locale) ? "rtl" : "ltr";
  const isStatic = process.env.DEPLOY_TARGET === 'static';

  const content = (
    <>
      <SkipToContent />
      <Providers>
        <SiteHeader navDict={navDict} locale={locale} />
        <main id="main-content">
          {children}
        </main>
        <SiteFooter
          socialLinks={socialLinks}
          locale={locale}
          navDict={navDict}
          footerMessages={footerMessages}
        />
      </Providers>
    </>
  );

  return (
    <html lang={locale} dir={direction} suppressHydrationWarning>
      <body className="antialiased bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        {isStatic ? (
          // Static export: NextIntlClientProvider pulls headers() at request time, so bypass it.
          content
        ) : (
          <NextIntlClientProvider locale={locale} messages={messages}>
            {content}
          </NextIntlClientProvider>
        )}
      </body>
    </html>
  );
}
