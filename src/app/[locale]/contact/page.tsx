import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Container from '@/components/ui/Container';
import { ContactForm } from '@/components/sections/ContactForm';
import { Icon } from '@/components/ui/Icon';
import { socialLinks } from '@/data/socialLinks';
import { siteConfig } from '@/app/metadata';

interface ContactPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);

  // For static export, use static metadata
  return {
    title: `Contact - ${siteConfig.name}`,
    description: "Get in touch with me"
  };
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className='py-12 md:py-20'>
      <Container>
        <div className='max-w-2xl mx-auto'>

          {/*Header*/}
          <header className='mb-12 text-center'>
            <h1 className='text-4xl md:text-4xl font-semibold text-gray-900 dark:text-white mb-4'>
              Contact
            </h1>
            <p className='text-xl text-gray-600 dark:text-gray-400'>
              Get in touch with me
            </p>
          </header>

          {/*Contact*/}
          <div className='mb-12 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border-gray-200 dark:border-gray-800'>
            <h2 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
              Other Ways to Reach Me
            </h2>
            <div className='space-y-3'>
              <a
                href={`mailto:${siteConfig.email}`}
                className='flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-brand-500 transition-colors'>
                <Icon name='mail' size={20} />
                {siteConfig.email}
              </a>

              {/*Social Links from Data Source*/}
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-brand-500 transition-colors'
                >
                  <Icon name={link.icon} size={20} />
                  {link.name}
                </a>
              ))}
            </div>

            {/* Contact Form*/}
            <ContactForm />
          </div>
        </div>
      </Container>


    </div>
  );
}
