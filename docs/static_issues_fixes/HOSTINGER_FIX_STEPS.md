# Hostinger Deployment Fix Steps

Follow these steps to resolve the 403 Forbidden error on Hostinger.

## Step 1: Update Next.js Configuration

You need to enable `trailingSlash` to ensure that paths like `/en` are exported as directories (`/en/index.html`) rather than files (`/en.html`). This resolves conflicts where a directory and a file share the same name.

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
2.  Create a new file named `.htaccess` (make sure it starts with a dot).
3.  Paste the following content into it:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Serve 404.html for missing files
  ErrorDocument 404 /404.html
</IfModule>

# Optional: Browser Caching for better performance
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/pdf "access plus 1 month"
  ExpiresByType text/javascript "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType application/x-javascript "access plus 1 month"
  ExpiresByType image/x-icon "access plus 1 year"
  ExpiresDefault "access plus 2 days"
</IfModule>
```

## Step 3: Build and Deploy

1.  Run your build command:

    ```bash
    pnpm run build
    ```

    _(Or your specific static build script)_

2.  Check the `out` directory. You should now see folders like `en/` containing `index.html` instead of just `en.html`.

3.  Upload the contents of the `out` directory to your Hostinger `public_html` (or the appropriate subdirectory).

4.  Visit `https://islamux.me/en` and refresh. The 403 error should be resolved.
