# Hostinger Deployment Fix Steps

Follow these steps to resolve the 403 Forbidden error on Hostinger.

## Step 1: Update Next.js Configuration

You need to enable `trailingSlash` to ensure that paths like `/en` are exported as directories (`/en/index.html`) rather than files (`/en.html`). This resolves conflicts where a directory and a file share the same name.

**For more detailed solutions and alternative approaches, see:** **[Hostinger Static Export Routing Fix Documentation](./RUN_SUCCESSFULY_IN_LOCALE_BUT_NOT_IN_HOSTINGER.md)**

1.  Open the file `next.config.ts` in your project root.
2.  Add `trailingSlash: true` to the configuration object.

**Example `next.config.ts`:**

```typescript
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const isStatic = process.env.DEPLOY_TARGET === "static";

const nextConfig: NextConfig = {
  output: isStatic ? "export" : undefined,
  trailingSlash: isStatic ? true : undefined, // <--- Add this line
  images: {
    unoptimized: isStatic,
  },
};

export default withNextIntl(nextConfig);
```

> **Note:** I added `isStatic ? true : undefined` so it only applies when building for static export, keeping your dev server behavior standard. You can also just set it to `true` globally if you prefer.

## Step 2: Add `.htaccess` for Hostinger

Hostinger uses Apache (LiteSpeed). Adding an `.htaccess` file helps handle 404 errors and ensures clean URLs.

1.  Navigate to your `public` folder: `/media/islamux/Variety/JavaScriptProjects/dev_portfolio/public`
2.  The project already ships an `.htaccess` there — **source of truth: `public/.htaccess`**. Keep it in sync rather than creating a copy.
3.  Its current content:

```apache
# Directory-based routing — trailing slashes + index.html
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Add trailing slash if missing (for directories)
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^(.+[^/])$ $1/ [L,R=301]

  ErrorDocument 404 /404.html
</IfModule>

DirectoryIndex index.html

# Browser Caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType image/x-icon "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType text/javascript "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType application/x-javascript "access plus 1 month"
  ExpiresByType application/pdf "access plus 1 month"
  ExpiresDefault "access plus 2 days"
</IfModule>

# Gzip compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/css application/javascript application/json image/svg+xml
</IfModule>
```

## Step 3: Build and Deploy

1.  Run your build command:

    ```bash
    pnpm build:static:full
    ```

    _(Plain `pnpm run build` is the SSR build for Vercel — it does not produce an `out/` directory.)_

2.  Check the `out` directory. You should now see folders like `en/` containing `index.html` instead of just `en.html`.

3.  **⚠️ CRITICAL: Delete all old files from Hostinger before uploading.**
    
    LiteSpeed (Hostinger's server) auto-adds trailing slashes to existing directories. If old `en/`, `ar/`, `fr/`, `es/`, `tr/` directories remain from a previous deployment, LiteSpeed will treat them as real directories and return **403 Forbidden** even when new files are uploaded alongside them.
    
    Either:
    - Delete everything in `public_html/` via FTP/File Manager, then upload fresh
    - Or at minimum delete the locale directories (`en/`, `ar/`, `fr/`, `es/`, `tr/`)

4.  Upload the contents of the `out` directory to your Hostinger `public_html` (or the appropriate subdirectory).

5.  Visit `https://islamux.me/en/` and refresh. The 403 error should be resolved.

---

> [!NOTE]
> **Update (March 7, 2026):** The project was successfully deployed to Hostinger using the steps outlined in this guide and the [Comprehensive Static Export Guide](./COMPREHENSIVE_STATIC_EXPORT_GUIDE.md). Routing and internationalization are confirmed working.
