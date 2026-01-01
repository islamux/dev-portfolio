import "../globals.css";
import { SkipToContent } from "@/components/ui/SkipToContent";
import { Providers } from "../providers";
import { SiteHeader } from "@/components/sections/SiteHeader";
import { isRTL, locales, Locale } from "@/i18n/config";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from 'next-intl/server';

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout(
  { children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  
  // Enable static rendering
  setRequestLocale(locale);

  // load translaiton messages
  let messages: { nav?: Record<string, string> };
  try {
    messages = (await import(`@/messages/${locale}.json`)).default;
  } catch (e) {
    console.error("Messages not found", e);
    messages = {};
  }

  const navDict = messages?.nav || {};

  // Direction
  const direction = isRTL(locale as Locale) ? "rtl" : "ltr";

  // For static export, avoid NextIntlClientProvider to prevent headers() usage
  // The 'static' check is crucial for the build command.
  const isStatic = process.env.DEPLOY_TARGET === 'static';

  return (
    <html lang={locale} dir={direction} suppressHydrationWarning>
      <body className="antialiased flex flex-col min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        {!isStatic ? (
          <NextIntlClientProvider locale={locale} messages={messages}>
            <SkipToContent />
            <Providers>
              <SiteHeader navDict={navDict} locale={locale} />
              <main id="main-content" className="grow">
                {children}
              </main>
            </Providers>
          </NextIntlClientProvider>
        ) : (
          <>
            <SkipToContent />
            <Providers>
              <SiteHeader navDict={navDict} locale={locale} />
              <main id="main-content" className="grow">
                {children}
              </main>
            </Providers>
          </>
        )}
      </body>
    </html>
  );
}
