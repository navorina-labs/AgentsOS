#!/usr/bin/env bash
# Publish context-os CLI to npm (requires: npm login)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
npm run test:cli
npm run test:scaffold
cd packages/cli
npm publish --access public
echo "Published. Install: npx context-os@latest init --help"
