#!/usr/bin/env bash
set -euo pipefail

# Install runner and browsers
npm install -D @playwright/test
npx playwright install

echo "Installed @playwright/test and Playwright browsers."
echo "Run your first capture with:"
echo 'UI_URL="http://localhost:3000/" UI_OUT="ScreenCaptures/home.png" UI_TIMEOUT=60000 npx playwright test tests/ui-snap.spec.js --config playwright.config.js --retries=2'
