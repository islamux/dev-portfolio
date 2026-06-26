#!/bin/bash
set -e

echo "🧹 Cleaning previous builds..."
rm -rf .next out

echo "🔨 Building static version..."
NEXT_PUBLIC_DEPLOY_TARGET=static DEPLOY_TARGET=static pnpm run build

echo "✅ Static build complete!"
echo "📦 Output directory: ./out"
echo ""
echo "To test locally, run:"
echo "  pnpm dlx serve out"
echo ""
echo "To deploy to Hostinger:"
echo "  1. Compress: tar -czf site.tar.gz out/"
echo "  2. Upload to Hostinger"
echo "  3. Extract in public_html/"
