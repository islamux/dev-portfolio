import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { siteConfig } from "./metadata";

export const dynamic = "force-static";

const staticRoutes = ["", "/about", "/projects", "/contact"] as const;

async function getProjectIds(): Promise<string[]> {
  try {
    const fs = await import("fs");
    const path = await import("path");
    const filePath = path.join(process.cwd(), "content", "en", "projects.json");
    const data = fs.readFileSync(filePath, "utf-8");
    const projects = JSON.parse(data);
    return projects.map((p: { id: string }) => p.id).filter(Boolean);
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projectIds = await getProjectIds();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const route of staticRoutes) {
      const url = route === "" ? `/${locale}` : `/${locale}${route}`;
      entries.push({
        url: `${siteConfig.url}${url}`,
        lastModified: new Date(),
        changeFrequency: route === "" ? "monthly" : "monthly",
        priority: route === "" ? 1 : 0.8,
      });
    }

    for (const projectId of projectIds) {
      entries.push({
        url: `${siteConfig.url}/${locale}/projects/${projectId}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
