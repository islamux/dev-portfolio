import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { getContentBySlug } from "@/lib/content";
import { parseLocale } from "@/i18n/config";
import Container from '@/components/ui/Container';
import { MarkdownContent } from '@/components/ui/MarkdownContent';
import { siteConfig, buildPageMetadata } from '@/app/metadata';
import type { ContentFrontmatter } from '@/types/content';

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: AboutPageProps): Promise<Metadata> {
  const locale = parseLocale((await params).locale);
  setRequestLocale(locale);
  return buildPageMetadata({
    title: `About - ${siteConfig.name}`,
    description: "About me - Full-stack developer",
    locale,
  });
}


export default async function AboutPage({ params }: AboutPageProps) {
  const locale = parseLocale((await params).locale);
  setRequestLocale(locale);

  let frontmatter: ContentFrontmatter = { title: "About", description: "About me" };
  let content: string = "About me content";

  try {
    const result = getContentBySlug("about", locale);
    frontmatter = result.frontmatter;
    content = result.content;
  } catch (error) {
    console.error(`Error loading about page for locale ${locale}:`, error);
  }

  return (
    <div className='py-12 md:py-20'>
      <Container>
        <div className='max-w-4xl mx-auto'>
          <header className='mb-12'>
            <h1 className='text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4'>
              {frontmatter.title}
            </h1>
            {frontmatter.description && (
              <p className='text-xl text-gray-600 dark:text-gray-400'>
                {frontmatter.description}
              </p>
            )}
          </header>
          <MarkdownContent content={content} />
        </div>
      </Container>

    </div>
  );
}
