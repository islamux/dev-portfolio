# n8n Workflow Ideas for Portfolio

This document outlines automation workflows using n8n to enhance the portfolio project.

---

## 1. Contact Form Automation

**Purpose**: Automate handling of contact form submissions.

**Trigger**: Webhook receives form submission from Next.js API route

**Workflow Steps**:
1. Receive POST request with form data (name, email, message)
2. Validate input data
3. Send email notification to you
4. Send auto-reply confirmation to sender
5. Store submission in Google Sheets/Notion database
6. Send instant notification via Telegram/Slack

**Required Nodes**:
- Webhook
- IF (validation)
- Gmail/SMTP
- Google Sheets/Notion
- Telegram/Slack

---

## 2. GitHub Project Sync

**Purpose**: Automatically update portfolio when GitHub repos change.

**Trigger**: GitHub webhook on push/release/star events

**Workflow Steps**:
1. Receive GitHub webhook event
2. Fetch repository metadata (stars, description, topics)
3. Update `projects.json` file via GitHub API
4. Trigger Vercel/Netlify deployment
5. Send notification on successful sync

**Required Nodes**:
- Webhook
- GitHub
- HTTP Request
- Code (JSON manipulation)

---

## 3. Social Media Auto-Post

**Purpose**: Share new projects automatically on social platforms.

**Trigger**: New project detected (via webhook or schedule)

**Workflow Steps**:
1. Detect new project in portfolio
2. Generate post content (optionally using AI)
3. Create images/thumbnails if needed
4. Post to Twitter/LinkedIn/Mastodon
5. Log posted content

**Required Nodes**:
- Webhook/Schedule
- OpenAI (optional)
- Twitter/LinkedIn
- Google Sheets (logging)

---

## 4. Weekly Analytics Digest

**Purpose**: Receive weekly performance reports.

**Trigger**: Cron schedule (every Monday 9 AM)

**Workflow Steps**:
1. Fetch Vercel Analytics data
2. Fetch Google Analytics metrics
3. Calculate key metrics (views, visitors, top pages)
4. Generate HTML email report
5. Send digest email

**Required Nodes**:
- Schedule Trigger
- HTTP Request (APIs)
- Code (data processing)
- Gmail/SMTP

---

## 5. Uptime Monitoring

**Purpose**: Monitor portfolio availability and alert on downtime.

**Trigger**: Cron schedule (every 5 minutes)

**Workflow Steps**:
1. Send HTTP request to portfolio URL
2. Check response status code
3. If error: send alert notification
4. Log status to database
5. Optional: Create incident in status page

**Required Nodes**:
- Schedule Trigger
- HTTP Request
- IF (status check)
- Telegram/Email
- Google Sheets (logging)

---

## 6. Blog/Content Pipeline

**Purpose**: Automate content distribution when new posts are published.

**Trigger**: GitHub webhook on new markdown file

**Workflow Steps**:
1. Detect new blog post commit
2. Parse markdown frontmatter
3. Generate social media snippets
4. Create newsletter draft in Mailchimp/Buttondown
5. Update XML sitemap
6. Ping search engines

**Required Nodes**:
- Webhook
- GitHub
- Code (markdown parsing)
- Mailchimp/HTTP Request

---

## 7. Lead Qualification

**Purpose**: Score and categorize incoming leads from contact form.

**Trigger**: New contact form submission

**Workflow Steps**:
1. Receive submission data
2. Enrich data (company info, social profiles)
3. Score lead based on criteria
4. Add to CRM (HubSpot/Notion)
5. Send appropriate follow-up template

**Required Nodes**:
- Webhook
- Clearbit/Hunter (enrichment)
- Code (scoring logic)
- HubSpot/Notion
- Gmail

---

## Implementation Priority

| Priority | Workflow | Complexity | Value |
|----------|----------|------------|-------|
| 1 | Contact Form Automation | Low | High |
| 2 | Uptime Monitoring | Low | Medium |
| 3 | Weekly Analytics Digest | Medium | Medium |
| 4 | GitHub Project Sync | Medium | High |
| 5 | Social Media Auto-Post | Medium | Medium |
| 6 | Lead Qualification | High | Medium |
| 7 | Blog/Content Pipeline | High | Low |

---

## Next Steps

1. Set up n8n instance (self-hosted or cloud)
2. Create webhook endpoint in Next.js for contact form
3. Configure required third-party API credentials
4. Build workflows starting with Priority 1
5. Test thoroughly before production use

---

## Resources

- [n8n Documentation](https://docs.n8n.io/)
- [n8n Community Workflows](https://n8n.io/workflows/)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
