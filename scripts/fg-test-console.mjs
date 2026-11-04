#!/usr/bin/env node
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { Browser, sleep } from '../.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs';

process.env.CHROME_PATH = '/home/ebendttl/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome';

const screenshotsDir = '/home/ebendttl/.gemini/antigravity-ide/brain/07f0e27b-78ee-438e-8c8d-c499150f59f0/screenshots';
mkdirSync(screenshotsDir, { recursive: true });

const results = [];
function record(name, pass, details = '') {
  results.push({ name, pass, details });
  console.log(`${pass ? 'PASS' : 'FAIL'}: ${name} ${details ? '— ' + details : ''}`);
}

console.log('=== STARTING BROWSER VERIFICATION (PHASE 3b) ===\n');

const browser = await Browser.launch();

try {
  // Test 1: Full interactive session on Desktop (1440x900)
  const page = await browser.newPage({ width: 1440, height: 900 });

  // Collect console messages and errors
  const consoleMessages = [];
  page.browser.on(page.sessionId, 'Runtime.consoleAPICalled', (params) => {
    const text = params.args.map((a) => a.value || a.description || '').join(' ');
    consoleMessages.push({ type: params.type, text });
  });

  await page.goto('http://localhost:3040/', { timeoutMs: 20000, settleMs: 1000 });
  await sleep(500);

  // Check 1: Zero console errors or hydration warnings
  const hydrationWarnings = consoleMessages.filter(
    (m) =>
      m.text.toLowerCase().includes('hydration') ||
      m.text.toLowerCase().includes('react-dom-server') ||
      m.text.toLowerCase().includes('did not match')
  );
  const consoleErrors = [
    ...page.consoleErrors,
    ...consoleMessages.filter((m) => m.type === 'error').map((m) => m.text),
  ];

  record(
    'Zero console errors',
    consoleErrors.length === 0,
    consoleErrors.length === 0 ? '0 errors found' : `Errors: ${consoleErrors.join('; ')}`
  );
  record(
    'Zero hydration warnings',
    hydrationWarnings.length === 0,
    hydrationWarnings.length === 0 ? '0 warnings found' : `Warnings: ${hydrationWarnings.map((w) => w.text).join('; ')}`
  );

  // Check 2: Load /, type a new key into textarea, assert a new endpoint chip appears
  const typeResult = await page.eval(() => {
    const textarea = document.getElementById('fg-db-editor');
    if (!textarea) return { success: false, reason: 'Textarea #fg-db-editor not found' };

    const parsed = JSON.parse(textarea.value);
    parsed.articles = [
      { id: '1', title: 'Interactive Console Built', views: 42 }
    ];

    // Use property setter to ensure React registers the change
    const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
    nativeSetter.call(textarea, JSON.stringify(parsed, null, 2));

    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    textarea.dispatchEvent(new Event('change', { bubbles: true }));

    // Check derived chips
    const chips = Array.from(document.querySelectorAll('.fg-console-chip')).map((c) => c.textContent.trim());
    const hasArticleChip = chips.some((c) => c === '/articles');

    return {
      success: hasArticleChip,
      chips,
    };
  });

  record(
    'Type new key into textarea derives new endpoint chip',
    typeResult.success,
    `Chips: ${typeResult.chips?.join(', ')}`
  );

  // Capture screenshot after typing in editor
  await page.screenshot({
    path: join(screenshotsDir, 'console-after-editor-type.png'),
    format: 'png',
  });

  // Check 3: Send GET /posts?_sort=-views, assert status chip and body
  const sortResult = await page.eval(async () => {
    const pathInput = document.getElementById('fg-req-path');
    const methodSelect = document.getElementById('fg-req-method');
    const sendBtn = document.querySelector('.fg-console-send-btn');

    if (!pathInput || !methodSelect || !sendBtn) {
      return { success: false, reason: 'Controls missing' };
    }

    const nativeInputSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    nativeInputSetter.call(pathInput, '/posts?_sort=-views');
    pathInput.dispatchEvent(new Event('input', { bubbles: true }));

    const nativeSelectSetter = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, 'value').set;
    nativeSelectSetter.call(methodSelect, 'GET');
    methodSelect.dispatchEvent(new Event('change', { bubbles: true }));

    sendBtn.click();
    await new Promise((r) => setTimeout(r, 100));

    const statusBadge = document.querySelector('.fg-badge-status');
    const responseCode = document.querySelector('.fg-response-body-wrap code');
    const parsedBody = responseCode ? JSON.parse(responseCode.textContent) : null;

    const is200 = statusBadge && statusBadge.textContent.includes('200 OK');
    const isSortedDesc =
      Array.isArray(parsedBody) &&
      parsedBody.length === 3 &&
      parsedBody[0].views === 250 &&
      parsedBody[1].views === 100 &&
      parsedBody[2].views === 40;

    return {
      success: is200 && isSortedDesc,
      status: statusBadge?.textContent,
      viewsOrder: parsedBody ? parsedBody.map((p) => p.views) : null,
    };
  });

  record(
    'GET /posts?_sort=-views returns 200 OK and sorted views [250, 100, 40]',
    sortResult.success,
    `Status: ${sortResult.status}, Views: ${JSON.stringify(sortResult.viewsOrder)}`
  );

  // Check 4: Send POST and assert editor changes
  const postResult = await page.eval(async () => {
    const pathInput = document.getElementById('fg-req-path');
    const methodSelect = document.getElementById('fg-req-method');
    const sendBtn = document.querySelector('.fg-console-send-btn');
    const textarea = document.getElementById('fg-db-editor');

    const nativeSelectSetter = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, 'value').set;
    nativeSelectSetter.call(methodSelect, 'POST');
    methodSelect.dispatchEvent(new Event('change', { bubbles: true }));

    const nativeInputSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    nativeInputSetter.call(pathInput, '/posts');
    pathInput.dispatchEvent(new Event('input', { bubbles: true }));

    // Send POST
    sendBtn.click();
    await new Promise((r) => setTimeout(r, 100));

    const statusBadge = document.querySelector('.fg-badge-status');
    const is201 = statusBadge && statusBadge.textContent.includes('201 Created');

    // Check editor content
    const updatedDb = JSON.parse(textarea.value);
    const postCount = updatedDb.posts?.length;
    const hasNewPost = updatedDb.posts && updatedDb.posts.length > 3;

    return {
      success: is201 && hasNewPost,
      status: statusBadge?.textContent,
      postCount,
    };
  });

  record(
    'POST /posts creates new item (201 Created) and mutates editor db',
    postResult.success,
    `Status: ${postResult.status}, Post count: ${postResult.postCount}`
  );

  // Capture screenshot after POST
  await page.screenshot({
    path: join(screenshotsDir, 'console-after-post.png'),
    format: 'png',
  });

  // Check 5: Send /tasks?_limit=1 and assert "[]" result
  const limitResult = await page.eval(async () => {
    // Click Tasks preset button
    const buttons = Array.from(document.querySelectorAll('.fg-console-btn'));
    const tasksBtn = buttons.find((b) => b.textContent.trim() === 'Tasks');
    if (tasksBtn) tasksBtn.click();
    await new Promise((r) => setTimeout(r, 100));

    const pathInput = document.getElementById('fg-req-path');
    const methodSelect = document.getElementById('fg-req-method');
    const sendBtn = document.querySelector('.fg-console-send-btn');

    const nativeSelectSetter = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, 'value').set;
    nativeSelectSetter.call(methodSelect, 'GET');
    methodSelect.dispatchEvent(new Event('change', { bubbles: true }));

    const nativeInputSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    nativeInputSetter.call(pathInput, '/tasks?_limit=1');
    pathInput.dispatchEvent(new Event('input', { bubbles: true }));

    sendBtn.click();
    await new Promise((r) => setTimeout(r, 100));

    const statusBadge = document.querySelector('.fg-badge-status');
    const responseCode = document.querySelector('.fg-response-body-wrap code');
    const is200 = statusBadge && statusBadge.textContent.includes('200 OK');
    const isArrayEmpty = responseCode && responseCode.textContent.trim() === '[]';

    return {
      success: is200 && isArrayEmpty,
      status: statusBadge?.textContent,
      response: responseCode?.textContent.trim(),
    };
  });

  record(
    'GET /tasks?_limit=1 returns 200 OK and "[]" empty array',
    limitResult.success,
    `Status: ${limitResult.status}, Body: ${limitResult.response}`
  );

  // Check 6: Send outside-verified request and assert note shows
  const outsideResult = await page.eval(async () => {
    const pathInput = document.getElementById('fg-req-path');
    const sendBtn = document.querySelector('.fg-console-send-btn');

    const nativeInputSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    nativeInputSetter.call(pathInput, '/tasks?customOp:unknown=123');
    pathInput.dispatchEvent(new Event('input', { bubbles: true }));

    sendBtn.click();
    await new Promise((r) => setTimeout(r, 100));

    const banner = document.querySelector('.fg-outside-verified-banner');
    const hasNote =
      banner &&
      banner.textContent.includes('Outside the 91 verified requests - run it with real json-server to be sure');

    return {
      success: !!hasNote,
      bannerText: banner ? banner.textContent.trim() : null,
    };
  });

  record(
    'Outside-verified query displays visible warning note',
    outsideResult.success,
    `Note: ${outsideResult.bannerText}`
  );

  // Check 7: Tab navigation and focus order
  const focusOrder = await page.eval(() => {
    // Gather all interactive elements in DOM order within the page
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(',');

    const elements = Array.from(document.querySelectorAll(focusableSelectors));
    return elements
      .filter((el) => {
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && style.visibility !== 'hidden' && el.offsetWidth > 0;
      })
      .map((el, i) => {
        const tag = el.tagName.toLowerCase();
        const text = (el.innerText || el.getAttribute('aria-label') || el.id || el.className || '').slice(0, 30).trim();
        return `${i + 1}. <${tag}> ${text}`;
      });
  });

  record(
    'Keyboard focus order mapped across interactive elements',
    focusOrder.length > 0,
    `${focusOrder.length} focusable elements discovered`
  );
  console.log('\n--- TAB FOCUS ORDER ---');
  focusOrder.slice(0, 15).forEach((line) => console.log('  ' + line));
  if (focusOrder.length > 15) console.log(`  ... and ${focusOrder.length - 15} more elements`);
  console.log('-----------------------\n');

  await page.close();

  // Test 8: Full-Page Screenshots & Horizontal Overflow across 390, 768, 1440 in light & dark
  const widths = [
    { width: 390, height: 844, name: '390px' },
    { width: 768, height: 1024, name: '768px' },
    { width: 1440, height: 900, name: '1440px' },
  ];
  const modes = ['light', 'dark'];

  console.log('Capturing full-page screenshots and verifying horizontal overflow...\n');

  for (const w of widths) {
    for (const mode of modes) {
      const p = await browser.newPage({
        width: w.width,
        height: w.height,
        dsf: 1,
        mobile: w.width < 600,
      });

      await p.goto('http://localhost:3040/', { timeoutMs: 20000, settleMs: 500 });
      await sleep(300);

      // Set mode
      await p.eval((m) => {
        if (m === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }, mode);
      await sleep(200);

      const overflow = await p.eval(() => {
        const docW = document.documentElement.scrollWidth;
        const winW = window.innerWidth;
        const bodyW = document.body.scrollWidth;
        const overflowing = docW > winW || bodyW > winW;
        return { overflowing, docW, bodyW, winW };
      });

      const filename = `landing-full-${w.name}-${mode}.png`;
      const filepath = join(screenshotsDir, filename);

      await p.screenshot({ path: filepath, format: 'png', fullPage: true });

      record(
        `Full-page screenshot & zero overflow (${w.name}, ${mode})`,
        !overflow.overflowing,
        `docW=${overflow.docW}, winW=${overflow.winW} -> ${filename}`
      );

      await p.close();
    }
  }

} finally {
  await browser.close();
}

console.log('\n=== ALL BROWSER ASSERTIONS FINISHED ===');
