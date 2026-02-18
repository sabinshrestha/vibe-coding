#!/usr/bin/env bash
set -euo pipefail

FOUND=0
for f in pocs/poc-*/package.json; do
  [[ -f "$f" ]] || continue
  FOUND=1
  d="$(dirname "$f")"
  echo "==> linting $d"
  (cd "$d" && npm run lint || true)
done

[[ "$FOUND" -eq 1 ]] || echo "No POCs found."
