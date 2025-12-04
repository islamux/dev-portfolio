import type { Metadata } from 'next';
import { getContentBySlug } from "@/lib/content";
import Container from '@/components/Container';
import { MarkdownContent } from '@/components/ui/MarkdownContent';
import { siteConfig } from '../metadata';

export const metadata: Metadata = {
  title: `About - ${siteConfig.name}`,
  description: "Learn more about my journey as a full-stack developer",
};

export default function AboutPage() {
  const { frontmatter, content } = getContentBySlug("about", "en");
  return (
    <div className='py-12 md:py-20'>
      <Container>
        <div className='max-w-4xl mx-auto'>
          {/*Header*/}
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
          {/*Content*/}
          <MarkdownContent content={content} />
        </div>
      </Container>

    </div>
  );
}
