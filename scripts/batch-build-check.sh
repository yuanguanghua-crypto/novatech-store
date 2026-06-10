#!/bin/bash
# Batch build check - captures ALL TypeScript errors at once
# Usage: bash scripts/batch-build-check.sh

cd "$(dirname "$0")/.."
export PATH="$HOME/.local/node/bin:$PATH"

echo "================================================"
echo "Running full build... (this takes 60-90 seconds)"
echo "All TypeScript errors will be listed below."
echo "================================================"
echo ""

# Run build, capture errors to file
npm run build 2>&1 | tee /tmp/full-build-errors.log

# Extract all TypeScript errors
echo ""
echo "================================================"
echo "ALL TYPE ERRORS (total: $(grep -c 'Type error:' /tmp/full-build-errors.log 2>/dev/null || echo 0))"
echo "================================================"
grep -n "Type error:" /tmp/full-build-errors.log 2>/dev/null || echo "No type errors found!"
echo ""
echo "Error file saved to: /tmp/full-build-errors.log"
