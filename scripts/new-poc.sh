#!/usr/bin/env bash
set -euo pipefail

NAME="${1:-}"
if [[ -z "$NAME" ]]; then
  echo "Usage: $0 <short-name>"
  exit 1
fi

mkdir -p pocs
NEXT_NUM=$(find pocs -maxdepth 1 -type d -name 'poc-*' | wc -l)
NEXT_NUM=$((NEXT_NUM + 1))
ID=$(printf "%03d" "$NEXT_NUM")
DIR="pocs/poc-${ID}-${NAME}"

mkdir -p "$DIR"/{src,tests}
cp docs/templates/poc-template.md "$DIR/README.md"

cat > "$DIR/package.json" <<JSON
{
  "name": "poc-${ID}-${NAME}",
  "private": true,
  "version": "0.0.1",
  "scripts": {
    "test": "echo \"No tests yet\"",
    "lint": "echo \"No lint config yet\"",
    "dev": "echo \"Add dev command for this POC\""
  }
}
JSON

echo "Created $DIR"
