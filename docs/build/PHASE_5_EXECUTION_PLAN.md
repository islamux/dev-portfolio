# Phase 5 Execution Plan: Dynamic Features & API

> **Timeline:** 2-3 days (16-24 hours)  
> **Difficulty:** Intermediate to Advanced  
> **Prerequisites:** Phase 4 completed, understanding of REST APIs

---

## 📋 Overview

**Phase Goal:** Add dynamic features including email sending, GitHub projects sync, and a /uses page.

**What You'll Build:**

- ✅ Enhanced contact form with email sending (SendGrid/Resend)
- ✅ GitHub projects importer script
- ✅ Rate limiting for API routes
- ✅ /uses page showcasing your tools and setup
- ✅ Advanced spam protection
- ✅ Environment variables management

---

## 🎯 Learning Objectives

By the end of Phase 5, you will understand:

- How to send emails from Next.js API routes
- GitHub API integration and authentication
- Rate limiting to prevent abuse
- Environment variable best practices
- API security patterns
- Automated data fetching and caching

---

## 📅 Daily Timeline

### **Day 1: Email Integration & Contact API** (8-10 hours)

#### Morning (4-5 hours): Email Setup

1. Choose email service (Resend recommended)
2. Get API keys and configure environment
3. Install dependencies
4. Create email sending utility
5. Design email templates

#### Afternoon (4-5 hours): Enhanced Contact API

1. Update contact API route
2. Add email sending integration
3. Implement comprehensive validation
4. Add rate limiting
5. Test email delivery

---

### **Day 2: GitHub Integration & /uses Page** (6-8 hours)

#### Morning (3-4 hours): GitHub Projects Importer

1. Create GitHub personal access token
2. Install Octokit (GitHub API client)
3. Build import script
4. Fetch and process repository data
5. Save to projects.json
6. Add to package.json scripts

#### Afternoon (3-4 hours): /uses Page

1. Create /uses page structure
2. Design tools/hardware sections
3. Add category grouping
4. Link to dotfiles repo
5. Style and polish

---

### **Day 3: Security & Polish** (2-6 hours)

#### Morning (1-3 hours): Security

1. Add advanced spam protection
2. Implement request throttling
3. Add CORS headers
4. Secure environment variables
5. Add error monitoring

#### Afternoon (1-3 hours): Testing & Documentation

1. Test all API endpoints
2. Test GitHub importer
3. Write API documentation
4. Update README
5. Test rate limiting

---

## 📝 Step-by-Step Implementation Guide

---

## **Step 0: Create Feature Branch** ⭐

Before starting Phase 5, create and switch to a feature branch:

```bash
# Create and switch to Phase 5 feature branch (or switch if it exists)
git checkout -b feature/phase-5-api || git checkout feature/phase-5-api
```

**Why?** Keeps `main` stable, isolates changes, enables easy rollback, professional workflow.

---

## **Step 1: Choose and Setup Email Service**

**Estimated Time:** 30 minutes

### Recommended: Resend

**Why Resend?**

- Modern, developer-friendly API
- Generous free tier (100 emails/day)
- Excellent deliverability
- Simple setup
- React Email integration

**Alternative: SendGrid**

- Larger free tier (100 emails/day perpetual)
- More established
- More complex setup

### Sign Up for Resend:

1. Go to [resend.com](https://resend.com)
2. Create account (free)
3. Add and verify your domain (or use `onboarding@resend.dev` for testing)
4. Create API key

### Install Resend:

```bash
pnpm add resend
```

---

## **Step 2: Configure Environment Variables**

**Estimated Time:** 15 minutes

### File: `.env.local`

```env
# Resend API Key
RESEND_API_KEY=re_your_api_key_here

# Contact Form
CONTACT_EMAIL_TO=fathi733@gmail.com
CONTACT_EMAIL_FROM=noreply@yourdomain.com

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Optional: Rate Limiting
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token
```

### File: `.env.example` (commit this to git)

```env
# Copy this to .env.local and fill in your values

# Resend API Key (https://resend.com/api-keys)
RESEND_API_KEY=

# Contact Form Configuration
CONTACT_EMAIL_TO=your@email.com
CONTACT_EMAIL_FROM=noreply@yourdomain.com

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Optional: Rate Limiting (https://upstash.com/)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

### Update `.gitignore`:

```gitignore
# Environment variables
.env
.env.local
.env.*.local
```

### 🎓 Understanding Environment Variables:

**Why use them?**

- Keep secrets out of git
- Different values for dev/staging/production
- Easy to change without code changes

**Naming Convention:**

- `NEXT_PUBLIC_*` - Available in browser (use sparingly!)
- No prefix - Server-only (API keys, secrets)

---

## **Step 3: Create Email Utility**

**Estimated Time:** 30 minutes

### File: `src/lib/email.ts`

```typescript
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailOptions {
  to: string;
  from: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send an email using Resend
 *
 * @param options - Email configuration
 * @returns Promise with send result
 *
 * @example
 * await sendEmail({
 *   to: 'recipient@example.com',
 *   from: 'sender@yourdomain.com',
 *   subject: 'Hello',
 *   html: '<p>Hello world!</p>',
 * });
 */
export async function sendEmail(options: EmailOptions) {
  try {
    const { to, from, subject, html, text } = options;

    const data = await resend.emails.send({
      from,
      to,
      subject,
      html,
      text: text || stripHtml(html), // Fallback to stripped HTML
    });

    return { success: true, data };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error };
  }
}

/**
 * Strip HTML tags for plain text fallback
 */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

/**
 * Generate contact form email HTML
 */
export function generateContactEmailHTML(data: {
  name: string;
  email: string;
  message: string;
}): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
            color: white;
            padding: 30px;
            border-radius: 8px 8px 0 0;
          }
          .content {
            background: #f9fafb;
            padding: 30px;
            border: 1px solid #e5e7eb;
            border-top: none;
            border-radius: 0 0 8px 8px;
          }
          .field {
            margin-bottom: 20px;
          }
          .label {
            font-weight: 600;
            color: #6b7280;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 5px;
          }
          .value {
            color: #111827;
            font-size: 16px;
          }
          .message {
            background: white;
            padding: 20px;
            border-radius: 6px;
            border: 1px solid #e5e7eb;
            white-space: pre-wrap;
          }
          .footer {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 style="margin: 0; font-size: 24px;">New Contact Form Submission</h1>
        </div>
        <div class="content">
          <div class="field">
            <div class="label">From</div>
            <div class="value">${data.name}</div>
          </div>
          
          <div class="field">
            <div class="label">Email</div>
            <div class="value">
              <a href="mailto:${data.email}" style="color: #0ea5e9; text-decoration: none;">
                ${data.email}
              </a>
            </div>
          </div>
          
          <div class="field">
            <div class="label">Message</div>
            <div class="message">${escapeHtml(data.message)}</div>
          </div>
          
          <div class="footer">
            Sent from your portfolio contact form
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}
```

### 🎓 Understanding the Code:

**Key Security Features:**

1. **`escapeHtml()`** - Prevents XSS attacks by sanitizing user input
2. **Server-only** - Email sending only happens on server (API key never exposed)
3. **Error handling** - Catches and logs errors without crashing

**Email Best Practices:**

- Always provide plain text fallback
- Use responsive HTML (inline CSS)
- Escape user input
- Include sender information

---

## **Step 4: Update Contact API Route**

**Estimated Time:** 1 hour

### File: `app/api/contact/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { sendEmail, generateContactEmailHTML } from "@/lib/email";
import { ContactFormData } from "@/types/content";

// Simple in-memory rate limiting (for production, use Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT = 3; // Max requests
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds

/**
 * Check if IP is rate limited
 */
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    // Reset or create new record
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return false;
  }

  if (record.count >= RATE_LIMIT) {
    return true;
  }

  record.count++;
  return false;
}

/**
 * POST /api/contact
 * Handles contact form submissions with email sending
 */
export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip =
      request.ip || request.headers.get("x-forwarded-for") || "unknown";

    // Check rate limit
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const data: ContactFormData = await request.json();

    // Honeypot check (bot trap)
    if (data.honeypot) {
      // Silently reject (don't tell bots they failed)
      return NextResponse.json({ success: true });
    }

    // Validation
    if (!data.name || !data.email || !data.message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Name validation (2-100 characters)
    if (data.name.length < 2 || data.name.length > 100) {
      return NextResponse.json(
        { error: "Name must be between 2 and 100 characters" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Message length validation (10-5000 characters)
    if (data.message.length < 10 || data.message.length > 5000) {
      return NextResponse.json(
        { error: "Message must be between 10 and 5000 characters" },
        { status: 400 }
      );
    }

    // Check for spam patterns
    const spamPatterns = [
      /viagra/i,
      /cialis/i,
      /crypto/i,
      /bitcoin/i,
      /www\./gi,
      /http/gi,
    ];

    const hasSpam = spamPatterns.some(
      (pattern) => pattern.test(data.message) || pattern.test(data.name)
    );

    if (hasSpam) {
      console.log("Spam detected:", { name: data.name, email: data.email });
      // Silently reject
      return NextResponse.json({ success: true });
    }

    // Send email
    const emailResult = await sendEmail({
      to: process.env.CONTACT_EMAIL_TO!,
      from: process.env.CONTACT_EMAIL_FROM!,
      subject: `Portfolio Contact: ${data.name}`,
      html: generateContactEmailHTML({
        name: data.name,
        email: data.email,
        message: data.message,
      }),
    });

    if (!emailResult.success) {
      console.error("Email send failed:", emailResult.error);
      return NextResponse.json(
        { error: "Failed to send message. Please try again." },
        { status: 500 }
      );
    }

    // Log successful submission
    console.log("Contact form submitted:", {
      name: data.name,
      email: data.email,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Message sent successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

### 🎓 Understanding Rate Limiting:

**What is Rate Limiting?**

- Prevents abuse by limiting requests per IP
- Example: Max 3 emails per hour per IP

**Production Approach:**
For production, use Redis (Upstash):

```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 h"),
});

const { success } = await ratelimit.limit(ip);
if (!success) {
  return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
}
```

---

## **Step 5: Create GitHub Projects Importer**

**Estimated Time:** 1.5 hours

### Install Octokit:

```bash
pnpm add @octokit/rest
pnpm add -D @types/node
```

### Create GitHub Token:

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Name: "Portfolio Projects Importer"
4. Scopes: Select `repo` (if private repos) or `public_repo` (if public only)
5. Generate and copy token

### Add to `.env.local`:

```env
GITHUB_TOKEN=ghp_your_token_here
GITHUB_USERNAME=islamux
```

### File: `scripts/import-projects.ts`

```typescript
import { Octokit } from "@octokit/rest";
import fs from "fs";
import path from "path";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const GITHUB_USERNAME = process.env.GITHUB_USERNAME || "islamux";

interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics: string[];
  stargazers_count: number;
  created_at: string;
  updated_at: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  tech: string[];
  github: string;
  demo?: string;
  image?: string;
  featured: boolean;
  year: string;
  stars: number;
}

/**
 * Fetch all public repositories for a user
 */
async function fetchRepositories(): Promise<GitHubRepo[]> {
  console.log(`Fetching repositories for ${GITHUB_USERNAME}...`);

  try {
    const { data } = await octokit.repos.listForUser({
      username: GITHUB_USERNAME,
      type: "owner",
      sort: "updated",
      per_page: 100,
    });

    console.log(`Found ${data.length} repositories`);
    return data as GitHubRepo[];
  } catch (error) {
    console.error("Failed to fetch repositories:", error);
    throw error;
  }
}

/**
 * Convert GitHub repo to Project format
 */
function repoToProject(repo: GitHubRepo): Project {
  // Extract year from created_at
  const year = new Date(repo.created_at).getFullYear().toString();

  // Combine language and topics for tech stack
  const tech: string[] = [];
  if (repo.language) tech.push(repo.language);
  tech.push(...repo.topics);

  return {
    id: repo.name.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
    name: repo.name,
    description: repo.description || "No description provided",
    longDescription: repo.description || undefined,
    tech: tech.slice(0, 5), // Limit to 5 tech items
    github: repo.html_url,
    demo: repo.homepage || undefined,
    image: `/images/projects/${repo.name.toLowerCase()}.jpg`,
    featured: repo.stargazers_count > 5, // Auto-feature if >5 stars
    year,
    stars: repo.stargazers_count,
  };
}

/**
 * Main import function
 */
async function importProjects() {
  try {
    console.log("🚀 Starting GitHub projects import...\n");

    // Fetch repositories
    const repos = await fetchRepositories();

    // Filter out forks and convert to projects
    const projects = repos
      .filter((repo) => !repo.fork) // Exclude forks
      .filter((repo) => repo.description) // Only repos with descriptions
      .map(repoToProject)
      .sort((a, b) => b.stars - a.stars); // Sort by stars

    console.log(`\n📊 Processed ${projects.length} projects`);
    console.log(
      `⭐ Featured projects: ${projects.filter((p) => p.featured).length}`
    );

    // Save to file
    const outputPath = path.join(
      process.cwd(),
      "content",
      "en",
      "projects.json"
    );

    // Ensure directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write file
    fs.writeFileSync(outputPath, JSON.stringify(projects, null, 2), "utf-8");

    console.log(`\n✅ Projects saved to: ${outputPath}`);
    console.log("\n🎉 Import complete!");

    // Show top 5 projects
    console.log("\n📋 Top 5 projects by stars:");
    projects.slice(0, 5).forEach((project, index) => {
      console.log(`   ${index + 1}. ${project.name} (⭐ ${project.stars})`);
    });
  } catch (error) {
    console.error("\n❌ Import failed:", error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  importProjects();
}

export { importProjects };
```

### Add Script to `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "import:projects": "tsx scripts/import-projects.ts"
  }
}
```

### Install tsx (TypeScript executor):

```bash
pnpm add -D tsx
```

### Run the Importer:

```bash
pnpm import:projects
```

### 🎓 Understanding the Script:

**What it does:**

1. Fetches your GitHub repos using Octokit
2. Filters out forks and repos without descriptions
3. Converts to project format
4. Auto-features repos with >5 stars
5. Saves to `content/en/projects.json`

**Customization:**

- Change `featured` logic (stars threshold)
- Filter by specific topics
- Add custom project images
- Manually curate after import

---

## **Step 6: Create /uses Page**

**Estimated Time:** 1 hour

### File: `app/[locale]/uses/page.tsx`

```tsx
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";

export const metadata = {
  title: "Uses - Islamux",
  description: "Tools, hardware, and software I use for development",
};

interface Tool {
  name: string;
  description: string;
  url?: string;
  category: string;
}

const tools: Tool[] = [
  // Development Tools
  {
    name: "VS Code",
    description: "Primary code editor with Vim keybindings",
    url: "https://code.visualstudio.com/",
    category: "Development",
  },
  {
    name: "Warp",
    description: "Modern terminal with AI-powered command suggestions",
    url: "https://www.warp.dev/",
    category: "Development",
  },
  {
    name: "pnpm",
    description: "Fast, disk space efficient package manager",
    url: "https://pnpm.io/",
    category: "Development",
  },

  // Design Tools
  {
    name: "Figma",
    description: "UI/UX design and prototyping",
    url: "https://www.figma.com/",
    category: "Design",
  },
  {
    name: "Excalidraw",
    description: "Whiteboard for sketching diagrams",
    url: "https://excalidraw.com/",
    category: "Design",
  },

  // Productivity
  {
    name: "Notion",
    description: "Notes, docs, and project management",
    url: "https://www.notion.so/",
    category: "Productivity",
  },
  {
    name: "Raycast",
    description: "Productivity launcher for macOS",
    url: "https://www.raycast.com/",
    category: "Productivity",
  },

  // Hardware
  {
    name: 'MacBook Pro 14"',
    description: "M1 Pro, 16GB RAM - main development machine",
    category: "Hardware",
  },
  {
    name: "Dell P2422H",
    description: '24" Full HD external monitor',
    category: "Hardware",
  },
  {
    name: "Keychron K2",
    description: "Mechanical keyboard with Gateron Brown switches",
    url: "https://www.keychron.com/products/keychron-k2-wireless-mechanical-keyboard",
    category: "Hardware",
  },
];

// Group tools by category
const groupedTools = tools.reduce(
  (acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = [];
    }
    acc[tool.category].push(tool);
    return acc;
  },
  {} as Record<string, Tool[]>
);

export default function UsesPage() {
  return (
    <div className="py-12 md:py-20">
      <Container>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Uses
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
              Tools, software, and hardware I use for development and design.
            </p>

            {/* Dotfiles Link */}
            <a
              href="https://github.com/islamux/dotfiles"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-brand-500 hover:text-brand-600 transition-colors"
            >
              <Icon name="github" size={20} />
              View my dotfiles on GitHub
            </a>
          </header>

          {/* Tools by Category */}
          <div className="space-y-12">
            {Object.entries(groupedTools).map(([category, categoryTools]) => (
              <section key={category}>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 pb-2 border-b border-gray-200 dark:border-gray-800">
                  {category}
                </h2>

                <div className="grid gap-6">
                  {categoryTools.map((tool) => (
                    <div
                      key={tool.name}
                      className="p-6 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {tool.url ? (
                          <a
                            href={tool.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-brand-500 transition-colors inline-flex items-center gap-2"
                          >
                            {tool.name}
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </a>
                        ) : (
                          tool.name
                        )}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {tool.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Footer Note */}
          <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Note:</strong> This setup evolves over time. Last updated:{" "}
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
```

### 🎓 Understanding /uses Pages:

**What is a /uses page?**

- Popular among developers to share their setup
- Helps others discover tools
- Builds community transparency

**Inspiration:**

- [uses.tech](https://uses.tech/) - Directory of /uses pages
- [Wes Bos](https://wesbos.com/uses)
- [Kent C. Dodds](https://kentcdodds.com/uses)

---

## **Step 7: Add Advanced Rate Limiting (Optional)**

**Estimated Time:** 30 minutes

### Install Upstash Redis:

```bash
pnpm add @upstash/redis @upstash/ratelimit
```

### Sign up for Upstash:

1. Go to [upstash.com](https://upstash.com)
2. Create free account
3. Create Redis database
4. Copy REST URL and token

### File: `src/lib/rate-limit.ts`

```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Create Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Create rate limiter
// 3 requests per hour
export const contactRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "1 h"),
  analytics: true,
  prefix: "ratelimit:contact",
});

// 10 requests per minute for API endpoints
export const apiRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 m"),
  analytics: true,
  prefix: "ratelimit:api",
});
```

### Update Contact API:

```typescript
import { contactRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const ip = request.ip || "anonymous";

  // Check rate limit
  const { success, limit, remaining, reset } = await contactRateLimit.limit(ip);

  if (!success) {
    return NextResponse.json(
      {
        error: `Rate limit exceeded. Try again in ${Math.ceil((reset - Date.now()) / 1000 / 60)} minutes.`,
        limit,
        remaining,
        reset,
      },
      { status: 429 }
    );
  }

  // ... rest of code
}
```

---

## 🐛 Common Issues & Solutions

### Issue 1: Email Not Sending

**Symptoms:** API returns success but no email received

**Debugging Steps:**

1. **Check Resend dashboard:**
   - Go to resend.com/emails
   - Check "Logs" tab for delivery status

2. **Verify environment variables:**

   ```bash
   echo $RESEND_API_KEY
   ```

3. **Check spam folder**

4. **Test with curl:**
   ```bash
   curl -X POST http://localhost:3000/api/contact \
     -H "Content-Type: application/json" \
     -d '{"name":"Test","email":"test@example.com","message":"Hello world test message"}'
   ```

---

### Issue 2: GitHub API Rate Limit

**Symptoms:** "API rate limit exceeded" error

**Solution:**

1. **Use authentication** (you should be):

   ```typescript
   const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
   ```

2. **Check rate limit status:**

   ```bash
   curl -H "Authorization: token YOUR_TOKEN" \
     https://api.github.com/rate_limit
   ```

3. **Cache results** (don't run importer too often)

---

### Issue 3: TypeScript Errors with Environment Variables

**Symptoms:** "Property does not exist on type 'ProcessEnv'"

**Solution:**

Create type definitions:

**File: `src/types/env.d.ts`**

```typescript
declare namespace NodeJS {
  interface ProcessEnv {
    RESEND_API_KEY: string;
    CONTACT_EMAIL_TO: string;
    CONTACT_EMAIL_FROM: string;
    GITHUB_TOKEN?: string;
    GITHUB_USERNAME?: string;
    UPSTASH_REDIS_REST_URL?: string;
    UPSTASH_REDIS_REST_TOKEN?: string;
    NEXT_PUBLIC_SITE_URL: string;
  }
}
```

---

## 📋 Acceptance Criteria Checklist

### Email Integration

- [ ] Resend API key configured
- [ ] Email sending works from contact form
- [ ] Emails arrive in inbox (not spam)
- [ ] Email template looks good
- [ ] Error handling for failed sends

### Contact API

- [ ] Validation works (all fields required)
- [ ] Rate limiting active (max 3/hour per IP)
- [ ] Honeypot catches bots
- [ ] Spam detection filters obvious spam
- [ ] Returns proper HTTP status codes

### GitHub Importer

- [ ] Script fetches repositories
- [ ] Filters work correctly (no forks, etc.)
- [ ] Projects.json generated
- [ ] Featured projects auto-tagged
- [ ] Script can be run with `pnpm import:projects`

### /uses Page

- [ ] Page renders all tools
- [ ] Grouped by category
- [ ] Links work
- [ ] Responsive design
- [ ] SEO metadata set

### Security

- [ ] No API keys in git
- [ ] Environment variables documented
- [ ] Rate limiting prevents abuse
- [ ] Input validation on all fields
- [ ] XSS prevention (HTML escaping)

---

## 🎓 Key Takeaways for Junior Developers

### What You Learned:

1. **API Development:** Building secure, production-ready endpoints
2. **Email Integration:** Sending transactional emails
3. **External APIs:** Working with GitHub API
4. **Security:** Rate limiting, validation, spam protection
5. **Environment Variables:** Managing secrets safely
6. **Automation:** Creating useful scripts

### Security Principles Applied:

- ✅ **Never commit secrets** (use .env files)
- ✅ **Validate all input** (never trust user data)
- ✅ **Escape output** (prevent XSS)
- ✅ **Rate limit** (prevent abuse)
- ✅ **Fail safely** (don't expose error details to users)

---

## 📚 Additional Resources

### Email Services

- [Resend Docs](https://resend.com/docs)
- [SendGrid Docs](https://docs.sendgrid.com/)
- [React Email](https://react.email/) - Advanced email templates

### GitHub API

- [Octokit Docs](https://octokit.github.io/rest.js/)
- [GitHub API Rate Limits](https://docs.github.com/en/rest/rate-limit)

### Security

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Rate Limiting Patterns](https://blog.logrocket.com/rate-limiting-node-js/)

---

## 🎯 Time Tracking Template

| Task                | Estimated   | Actual | Notes |
| ------------------- | ----------- | ------ | ----- |
| Email service setup | 30min       |        |       |
| Environment config  | 15min       |        |       |
| Email utility       | 30min       |        |       |
| Update contact API  | 1hr         |        |       |
| GitHub importer     | 1.5hr       |        |       |
| /uses page          | 1hr         |        |       |
| Rate limiting       | 30min       |        |       |
| Testing             | 2hr         |        |       |
| Documentation       | 30min       |        |       |
| **Total**           | **16-24hr** |        |       |

---

## 🚀 Ready to Start?

**Before you begin:**

1. ✅ Sign up for Resend (free)
2. ✅ Create GitHub personal access token
3. 📝 Create branch: `git checkout -b feature/phase-5-api`
4. ☕ Get ready for some API magic!

**Testing Checklist:**

- [ ] Send test email through contact form
- [ ] Verify rate limiting (submit 4 times quickly)
- [ ] Run GitHub importer
- [ ] Check /uses page renders
- [ ] Test spam detection

Good luck building powerful backend features! 🚀
