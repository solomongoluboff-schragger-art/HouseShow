const fs = require('fs');
const path = require('path');
const { test } = require('@playwright/test');

function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function parseViewport(value) {
  if (!value) return null;
  const [w, h] = value.split('x').map((part) => Number.parseInt(part, 10));
  if (!Number.isFinite(w) || !Number.isFinite(h)) return null;
  return { width: w, height: h };
}

async function gotoWithRetry(page, url, timeoutMs, attempts = 2) {
  let lastError;

  for (let i = 0; i < attempts; i += 1) {
    try {
      await page.goto(url, { waitUntil: 'commit', timeout: timeoutMs });
      await page.waitForLoadState('domcontentloaded', { timeout: 10000 }).catch(() => {});
      await page.waitForTimeout(500);
      return;
    } catch (error) {
      lastError = error;
      const msg = String(error && error.message ? error.message : error);
      const isAborted = msg.includes('net::ERR_ABORTED') || msg.includes('frame was detached');
      if (!isAborted || i === attempts - 1) {
        throw error;
      }
      await page.waitForTimeout(750);
    }
  }

  throw lastError;
}

async function runSteps(page, steps, timeoutMs) {
  for (const step of steps) {
    const action = step.action;
    if (action === 'goto') {
      await gotoWithRetry(page, step.url, timeoutMs, step.attempts || 2);
    } else if (action === 'click') {
      await page.click(step.selector);
    } else if (action === 'fill') {
      await page.fill(step.selector, step.value ?? '');
    } else if (action === 'press') {
      await page.press(step.selector, step.key);
    } else if (action === 'waitForSelector') {
      await page.waitForSelector(step.selector, {
        state: step.state || 'visible',
        timeout: step.timeout || timeoutMs,
      });
    } else if (action === 'waitForTimeout') {
      await page.waitForTimeout(step.ms || 500);
    } else {
      throw new Error(`Unknown action: ${action}`);
    }
  }
}

test('capture ui screenshot', async ({ page }) => {
  const url = process.env.UI_URL;
  if (!url) {
    throw new Error('UI_URL is required, e.g. UI_URL=http://localhost:5173/');
  }

  const testTimeout = Number.parseInt(process.env.UI_TIMEOUT || '30000', 10);
  const navAttempts = Number.parseInt(process.env.UI_NAV_ATTEMPTS || '2', 10);
  const outPath = process.env.UI_OUT || 'Reference/ScreenCaptures/ui.png';
  const fullPage = (process.env.UI_FULL_PAGE || 'true') === 'true';
  const waitMs = Number.parseInt(process.env.UI_WAIT || '0', 10);
  const waitFor = process.env.UI_WAIT_FOR;
  const waitForTimeout = Number.parseInt(process.env.UI_WAIT_FOR_TIMEOUT || '10000', 10);
  const viewport = parseViewport(process.env.UI_VIEWPORT);
  const steps = process.env.UI_STEPS ? JSON.parse(process.env.UI_STEPS) : [];

  test.setTimeout(testTimeout);
  page.setDefaultNavigationTimeout(testTimeout);
  page.setDefaultTimeout(testTimeout);

  if (viewport) {
    await page.setViewportSize(viewport);
  }

  await gotoWithRetry(page, url, testTimeout, navAttempts);
  await page.waitForURL('**', { timeout: 10000 }).catch(() => {});

  if (steps.length) {
    await runSteps(page, steps, testTimeout);
  }

  if (waitFor) {
    await page.waitForSelector(waitFor, { state: 'visible', timeout: waitForTimeout });
  }

  if (waitMs > 0) {
    await page.waitForTimeout(waitMs);
  }

  ensureDir(outPath);
  await page.screenshot({ path: outPath, fullPage });
  // Minimal debug info for quick triage in CI/local logs.
  // eslint-disable-next-line no-console
  console.log(`Captured ${page.url()} -> ${outPath}`);
});
