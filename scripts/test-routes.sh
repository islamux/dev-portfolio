#!/bin/bash
# Tests static export routing for all locales and page types.
# Usage: ./scripts/test-routes.sh [port]

set -e

PORT="${1:-3099}"
OUT_DIR="out"
PASS=0
FAIL=0

cleanup() {
  kill $SERVER_PID 2>/dev/null || true
  wait $SERVER_PID 2>/dev/null || true
}
trap cleanup EXIT

if [ ! -d "$OUT_DIR" ]; then
  echo "❌ $OUT_DIR/ not found. Run 'pnpm build:static' first."
  exit 1
fi

echo "📡 Starting Python server on port $PORT..."
python3 -m http.server "$PORT" --directory "$OUT_DIR" > /dev/null 2>&1 &
SERVER_PID=$!
sleep 1

kill -0 $SERVER_PID 2>/dev/null || {
  echo "❌ Server failed to start"
  exit 1
}

test_url() {
  local url="$1"
  local expected="${2:-200}"
  local full_url="http://localhost:$PORT$url"
  local http_code
  http_code=$(curl -s -o /dev/null -w "%{http_code}" "$full_url")

  if [ "$http_code" = "$expected" ]; then
    echo "  ✅ $url → $http_code"
    PASS=$((PASS + 1))
  else
    echo "  ❌ $url → $http_code (expected $expected)"
    FAIL=$((FAIL + 1))
  fi
}

echo ""
echo "=== Directory-Based Route Tests ==="
echo ""

# — home pages (all 5 locales) — trailing slash
for loc in en ar fr es tr; do
  test_url "/$loc/"
done

# — about pages —
for loc in en ar fr es tr; do
  test_url "/$loc/about/"
done

# — projects list —
for loc in en ar fr es tr; do
  test_url "/$loc/projects/"
done

# — contact —
for loc in en ar fr es tr; do
  test_url "/$loc/contact/"
done

# — project detail pages —
test_url "/en/projects/athkarix/"
test_url "/ar/projects/athkarix/"
test_url "/fr/projects/athkarix/"
test_url "/es/projects/athkarix/"
test_url "/tr/projects/athkarix/"
test_url "/en/projects/salam-app-flutter/"
test_url "/en/projects/salam-kotlin/"
test_url "/ar/projects/salam-app-flutter/"

# — root pages (no trailing slash → 301 redirect to trailing slash) —
test_url "/"
test_url "/en" 301
test_url "/ar" 301
test_url "/fr" 301
test_url "/es" 301
test_url "/tr" 301

# — static assets —
test_url "/robots.txt"
test_url "/sitemap.xml"
test_url "/404.html"
test_url "/_next/static/chunks/0f5zbsjmlh51c.css"

# — 404 —
test_url "/nonexistent" 404
test_url "/en/typo-page" 404

# — root serves index.html —
test_url "/"

echo ""
echo "=== Summary ==="
echo "  Passed: $PASS"
echo "  Failed: $FAIL"

if [ "$FAIL" -eq 0 ]; then
  echo "  Status: ✅ ALL PASS"
else
  echo "  Status: ❌ SOME FAILED"
fi

exit $FAIL
