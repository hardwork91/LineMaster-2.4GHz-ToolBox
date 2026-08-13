#!/usr/bin/env bash
# Stamps a fresh cache-busting ?v=<timestamp> query string onto the shared
# CSS/JS includes (css/variables.css, css/global.css, js/gallery.js,
# js/blog-hidden.js, js/theme.js) across every tracked HTML page, so browsers
# (and GitHub Pages' CDN) fetch the new file instead of serving a stale cached
# copy after a publish.
#
# Safe to run repeatedly: it replaces any existing ?v=... with the new one
# rather than stacking query strings.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../.." && pwd)"
cd "$REPO_ROOT"

VERSION="$(date -u +%Y%m%d%H%M%S)"

FILES=$(git ls-files '*.html')

for f in $FILES; do
  sed -i -E \
    -e "s#(css/variables\.css)(\?v=[A-Za-z0-9]*)?\"#\1?v=${VERSION}\"#g" \
    -e "s#(css/global\.css)(\?v=[A-Za-z0-9]*)?\"#\1?v=${VERSION}\"#g" \
    -e "s#(js/gallery\.js)(\?v=[A-Za-z0-9]*)?\"#\1?v=${VERSION}\"#g" \
    -e "s#(js/blog-hidden\.js)(\?v=[A-Za-z0-9]*)?\"#\1?v=${VERSION}\"#g" \
    -e "s#(js/theme\.js)(\?v=[A-Za-z0-9]*)?\"#\1?v=${VERSION}\"#g" \
    "$f"
done

echo "Cache-busting version set to ${VERSION}"
