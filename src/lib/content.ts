import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { ContentData, ContentFrontmatter, Project } from "@/types/content";

export async function loadMessages(locale: string): Promise<Record<string, unknown>> {
  try {
    const msgModule = await import(`@/messages/${locale}.json`);
    return msgModule.default as Record<string, unknown>;
  } catch (error) {
    console.warn(`Failed to load messages for locale ${locale}:`, error);
    return {};
  }
}

export function getContentBySlug(slug: string, locale: string = "en"): ContentData {
  const filePath = path.join(process.cwd(), "content", locale, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Content file not found: content/${locale}/${slug}.md`);
  }

  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    frontmatter: data as ContentFrontmatter,
    content,
  };
}

function readProjectsFile(filePath: string): Project[] {
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
}

export function getProjectData(locale: string = "en"): Project[] {
  const filePath = path.join(process.cwd(), "content", locale, "projects.json");
  const projects = readProjectsFile(filePath);

  if (projects.length > 0) return projects;

  const fallbackPath = path.join(process.cwd(), "content", "en", "projects.json");
  const fallback = readProjectsFile(fallbackPath);

  return fallback;
}

export function getProjectById(id: string, locale: string = "en"): Project | null {
  const projects = getProjectData(locale);
  return projects.find((p) => p.id === id) || null;
}
