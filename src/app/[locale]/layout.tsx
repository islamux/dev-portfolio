import { SkipToContent } from "@/components/ui/SkipToContent";
import { Providers } from "../providers";
import { SiteHeader } from "@/components/sections/SiteHeader";
import { isRTL, locales, Locale } from "@/i18n/config";
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

  // Validate locale
  // if (!isValidateLocale(locale)) {
  //   notFound();
  // }

  // load translaiton messages
  let messages;
  try {
    messages = (await import(`@/messages/${locale}.json`)).default;
  } catch (e) {
    console.error("Messages not found", e);
    // notFound();
    messages = {};
  }

  const navDict = (messages as Record<string, any>)?.nav || {};

  // Direction
  const direction = isRTL(locale as Locale) ? "rtl" : "ltr";

  return (
    <div lang={locale} dir={direction} className="antialiased flex flex-col min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {/* <NextIntlClientProvider locale={locale} messages={messages}> */}
        <SkipToContent />
        <Providers>
          <SiteHeader navDict={navDict} />
          <main id="main-content" className="grow">
            {children}
          </main>
        </Providers>
      {/* </NextIntlClientProvider> */}
    </div>
  );
}

