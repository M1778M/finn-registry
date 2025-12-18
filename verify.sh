#!/bin/bash
cd "C:\Users\m1778\Desktop\finn-registry"
echo "=== Running Tests ==="
npm test 2>&1 | tail -5
echo ""
echo "=== Running Lint ==="
npm run lint 2>&1 | grep "✖"
echo ""
echo "=== Running Build ==="
npm run build 2>&1 | tail -3
echo ""
echo "✅ CI Pipeline Complete"
