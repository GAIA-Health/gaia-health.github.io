#!/usr/bin/env bash
# Copy the shared design tokens from the brand repo into css/tokens.css.
# Usage: scripts/sync-brand-tokens.sh [path-to-brand-repo]   (default ../veya-brand next to this repo's parent)
# Public repo: the script refuses to write if the file mentions anything unreleased.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BRAND="${1:-${BRAND_DIR:-$HOME/Desktop/abby/webdev/veya-brand}}"
SRC="$BRAND/tokens.css"
[ -f "$SRC" ] || { echo "missing $SRC" >&2; exit 1; }
SHA="$(git -C "$BRAND" rev-parse --short HEAD)"
if grep -niE "home test|hardware|waitlist|invest|fundrais|github\.com|wove-brand" "$SRC"; then
  echo "refusing: $SRC has terms that must not be published" >&2; exit 1
fi
{
  echo "/* Synced from the brand repo tokens.css at commit $SHA. Do not hand-edit; run scripts/sync-brand-tokens.sh. */"
  cat "$SRC"
} > "$ROOT/css/tokens.css"
echo "wrote css/tokens.css from $SHA"
