export interface ProjectMetadata {
  title: string;
  description: string;
  openGraph?: {
    title: string,
    description: string,
    images: string[],
  };

}
export interface ProjectPageProps {
  params: Promise<{
    id: string;
    locale: string;
  }>;

}
