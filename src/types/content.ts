export interface ContentFrontmatter {
  title: string;
  description?: string;
  date?: string;
  tags?: string[];
  image?: string;
  [key: string]: unknown; // Allow additional custom fields
}

export interface ContentData {
  frontmatter: ContentFrontmatter;
  content: string;
  slug: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  tech: string[];
  github?: string;
  gitlab?: string;
  demo?: string;
  apk?: string;
  image?: string;
  featured?: boolean;
  year?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
  honeypot: string; // spam trap
}
