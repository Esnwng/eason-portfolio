#!/usr/bin/env bash
# Build and deploy each world as its own static Vercel project (personal scope, free Hobby plan).
# Usage: scripts/deploy-worlds.sh [cinema|hang|night|sheet ...]   (default: cinema hang night)
set -euo pipefail
cd "$(dirname "$0")/.."
SCOPE=${VERCEL_SCOPE:-ddai-1016s-projects}
name_for() { case "$1" in cinema) echo eason-wang;; hang) echo eason-wang-gallery;; night) echo eason-wang-night;; sheet) echo eason-wang-sheet;; *) echo "unknown world: $1" >&2; exit 1;; esac; }
worlds=("$@"); [ ${#worlds[@]} -eq 0 ] && worlds=(cinema hang night)
for w in "${worlds[@]}"; do
  n=$(name_for "$w")
  echo "▶ $w → https://$n.vercel.app"
  PUBLIC_WORLD=$w PUBLIC_SITE_URL="https://$n.vercel.app" pnpm exec astro build >/dev/null
  rm -rf "deploy/$n" && mkdir -p deploy && cp -R "dist/$w" "deploy/$n"
  printf '{ "cleanUrls": true, "trailingSlash": false }\n' > "deploy/$n/vercel.json"
  (cd "deploy/$n" && vercel deploy --prod --yes --scope "$SCOPE" 2>&1 | grep -E "^https://" | tail -1)
done
