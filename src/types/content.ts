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
  span?: number;
}

export interface NavLink {
  href: string;
  label: string;
  key: string;
}

export interface HomeTranslations {
  hero?: { cta?: { projects?: string; contact?: string } };
  featured?: { title?: string; viewAll?: string; viewAllEnd?: string };
  card?: { code?: string; demo?: string };
}

export interface ProjectsTranslations {
  title?: string;
  description?: string;
  card?: { code?: string; demo?: string };
}

export interface ContactFormTranslations {
  name?: string;
  email?: string;
  message?: string;
  submit?: string;
  sending?: string;
  success?: string;
  error?: string;
}

export interface ContactPageTranslations {
  title?: string;
  description?: string;
  form?: ContactFormTranslations;
  other?: { title?: string };
}

export interface ProjectFilterTranslations {
  all?: string;
  noResults?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
  honeypot: string; // spam trap
}
