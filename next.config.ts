import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const isStatic = process.env.DEPLOY_TARGET === "static";

const nextConfig: NextConfig = {
  output: isStatic ? 'export' : undefined,
  trailingSlash: isStatic ? true : undefined,
  images: {
    unoptimized: isStatic,
  },
};

export default withNextIntl(nextConfig);
