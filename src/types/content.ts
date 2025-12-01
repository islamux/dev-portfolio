export interface ContentFrontmatter {
  title: string;
  description?: string;
  date?: string;
  tags?: string[];
  image?: string;
  [key: string]: any;
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
  image?: string;
  featured?: boolean;
  year?: string;
}

export interface ContactFromData {
  name: string;
  email: string;
  message: string;
  honeypot: string; // spam trap
}
