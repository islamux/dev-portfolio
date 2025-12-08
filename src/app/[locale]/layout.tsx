import { SkipToContent } from "@/components/ui/SkipToContent";
import { NextIntlClientProvider } from "next-intl";
import { Providers } from "../providers";
import SiteHeader from "@/components/sections/SiteHeader";
import { isRTL } from "@/i18n/config";
import { notFound } from "next/navigation";
import { isValidateLocale } from "@/i18n/guards";

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

export default async function LocaleLayout(
  { children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  // Validate locale
  if (!isValidateLocale(locale)) {
    notFound();
  }

  // load translaiton messages
  let messages;
  try {
    messages = (await import(`@/messages/${locale}.json`)).default;
  } catch {
    notFound();
  }

  // Direction
  const direction = isRTL(locale as any) ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={direction} suppressHydrationWarning>
      <body className="antialiased flex flex-col min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100" suppressHydrationWarning>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SkipToContent />
          <Providers>
            <SiteHeader />
            <main id="main-content" className="grow">
              {children}
            </main>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

