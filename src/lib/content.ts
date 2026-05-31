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

export function getContentBySlug(
  slug: string,
  locale: string = "en"
): ContentData {
  try {
    const filePath = path.join(process.cwd(), "content", locale, `${slug}.md`);

    // Check if file exists before reading 
    if (!fs.existsSync(filePath)) {
      throw new Error(`Content file not found: content/${locale}/${slug}.md`);
    }
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      frontmatter: data as ContentFrontmatter,
      content,
      slug,
    };
  } catch (error) {
    console.error(`Error loading content for slug "${slug} : "`, error);
    throw error;
  }
}

// GET PROJECT DATA FROM JSON FILE 
export function getProjectData(locale: string = "en"): Project[] {
  try {
    const filePath = path.join(process.cwd(), "content", locale, "projects.json");


    if (!fs.existsSync(filePath)) {
      // fallback to default locale if translation doesn't exist.
      const fallbackPath = path.join(process.cwd(), "content", "en", "projects.json");

      if (!fs.existsSync(fallbackPath)) {
        console.warn("No projects.json file found");
        return [];
      }

      const fallbackData = fs.readFileSync(fallbackPath, "utf8");
      return JSON.parse(fallbackData);
    }

    const fileContents = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileContents);
  } catch (error) {
    console.error("Error loading projects date", error);
    return [];
  }
}

// GET A SINGLE PROJECT BY ID
export function getProjectById(
  id: string,
  locale: string = "en"
): Project | null {
  const projects = getProjectData(locale);

  return projects.find((p) => p.id === id) || null;
}
