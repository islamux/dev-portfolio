import Container from '@/components/Container';
import { ContactForm } from '@/components/sections/ContactForm';
import { Icon } from '@/components/ui/Icon';
import { socialLinks } from '@/data/socialLinks';
import type { Metadata } from 'next';
import { siteConfig } from '../metadata';

export const metadata: Metadata = {
  title: `Contact - ${siteConfig.name}`,
  description: "Get in touch with me",
};

export default function ContactPage() {

  return (
    <div className='py-12 md:py-20'>
      <Container>
        <div className='max-w-2xl mx-auto'>

          {/*Header*/}
          <header className='mb-12 text-center'>
            <h1 className='text-4xl md:text-4xl font-semibold text-gray-900 dark:text-white mb-4'>
              Get In Touch
            </h1>
            <p className='text-xl text-gray-600 dark:text-gray-400'>
              Have a project in mind? Let&apos;s talk about it.
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
