# Screenshot Workflow Kit

Portable prepackage for screenshot-first UI iteration using Playwright.

## Files
- `playwright.config.js`
- `tests/ui-snap.spec.js`
- `bootstrap.sh`

## Install Into Any Project
1. Copy these files into your project root.
2. Run:
   ```bash
   bash bootstrap.sh
   ```

## Basic Capture Command
```bash
UI_URL="http://localhost:3000/" \
UI_OUT="ScreenCaptures/home.png" \
UI_TIMEOUT=60000 \
npx playwright test tests/ui-snap.spec.js --config playwright.config.js --retries=2
```

## Flow Capture Example
```bash
UI_URL="http://localhost:3000/" \
UI_OUT="ScreenCaptures/login.png" \
UI_TIMEOUT=60000 \
UI_WAIT_FOR="text=Sign in" \
UI_STEPS='[{"action":"click","selector":"text=Login"}]' \
npx playwright test tests/ui-snap.spec.js --config playwright.config.js --retries=2
```

## Supported Env Vars
- `UI_URL` required
- `UI_OUT` output png path
- `UI_TIMEOUT` overall timeout ms
- `UI_NAV_ATTEMPTS` navigation retries
- `UI_WAIT_FOR` selector/text to wait for
- `UI_WAIT_FOR_TIMEOUT` wait selector timeout ms
- `UI_STEPS` JSON step list (`goto`, `click`, `fill`, `press`, `waitForSelector`, `waitForTimeout`)
- `UI_VIEWPORT` e.g. `1440x900`
- `UI_WAIT` post-step wait ms
- `UI_FULL_PAGE` `true|false`
