#!/bin/sh
# Run the Dec 31, 2025 debitcredit build with its seeded data, as a design
# reference for cash-grab. Open http://localhost:5174/
set -e
cd "$(dirname "$0")/frontend"
[ -d node_modules ] || npm ci
exec npx vite dev --port "${PORT:-5174}" --strictPort
