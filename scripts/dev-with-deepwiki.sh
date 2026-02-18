#!/usr/bin/env bash
set -euo pipefail

POC_DIR="${1:-}"
POC_CMD="${2:-npm run dev}"

if [[ -z "$POC_DIR" ]]; then
  echo "Usage: $0 <poc-directory> [poc-command]"
  echo "Example: $0 pocs/poc-001-chat-ui \"npm run dev\""
  exit 1
fi

if [[ ! -d "$POC_DIR" ]]; then
  echo "POC directory not found: $POC_DIR"
  exit 1
fi

cleanup() { jobs -p | xargs -r kill; }
trap cleanup EXIT INT TERM

npm run deepwiki:dev &
(
  cd "$POC_DIR"
  bash -lc "$POC_CMD"
) &
wait
