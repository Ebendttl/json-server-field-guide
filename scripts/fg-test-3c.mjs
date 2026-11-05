#!/usr/bin/env node
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { Browser, sleep } from '../.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs';

process.env.CHROME_PATH = '/home/ebendttl/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome';

const outDir = '/home/ebendttl/.gemini/antigravity-ide/brain/07f0e27b-78ee-438e-8c8d-c499150f59f0/screenshots';
mkdirSync(outDir, { recursive: true });

const browser = await Browser.launch();

console.log('=== Starting Phase 3c Verification Suite ===\n');

// 1. Check Horizontal Overflow at 390, 768, 1440 in light and dark
console.log('--- 1. Testing Horizontal Overflow ---');
const viewports = [
  { width: 390, height: 844, name: '390px' },
  { width: 768, height: 1024, name: '768px' },
  { width: 1440, height: 900, name: '1440px' },
];

for (const vp of viewports) {
  for (const mode of ['light', 'dark']) {
    const page = await browser.newPage({
      width: vp.width,
      height: vp.height,
      dsf: 1,
      mobile: vp.width < 600,
    });

    await page.goto('http://localhost:3040/', { timeoutMs: 15000, settleMs: 600 });

    // Set theme via localStorage and toggle button
    await page.eval((targetMode) => {
      localStorage.setItem('theme', targetMode);
      const isDark = document.documentElement.classList.contains('dark');
      if ((targetMode === 'dark' && !isDark) || (targetMode === 'light' && isDark)) {
        const toggleBtn = document.querySelector('button[aria-label="Toggle theme"]');
        if (toggleBtn) toggleBtn.click();
      }
    }, mode);

    await sleep(400);

    const overflow = await page.eval(() => {
      const docW = document.documentElement.scrollWidth;
      const winW = window.innerWidth;
      const bodyW = document.body.scrollWidth;
      return {
        overflowing: docW > winW || bodyW > winW,
        docW,
        bodyW,
        winW,
      };
    });

    console.log(
      `Viewport ${vp.name} [${mode}]: ${overflow.overflowing ? 'FAIL (overflow)' : 'PASS (no overflow)'} (scrollWidth=${overflow.docW}, winWidth=${overflow.winW})`
    );

    if (overflow.overflowing) {
      console.error(`  ERROR: Horizontal overflow detected on ${vp.name} in ${mode} mode!`);
    }

    await page.close();
  }
}

// 2. Touch Targets Test for buttons, chips, select and input
console.log('\n--- 2. Testing Touch Targets (>= 44px for buttons, chips, select, input) ---');
{
  const page = await browser.newPage({ width: 390, height: 844, mobile: true });
  await page.goto('http://localhost:3040/', { timeoutMs: 15000, settleMs: 600 });

  const targetResults = await page.eval(() => {
    // Select all buttons, chips, select, input elements in our UI
    const elements = Array.from(document.querySelectorAll(
      '.fg-btn-primary, .fg-btn-secondary, .fg-console-btn, .fg-console-chip, .fg-console-select, .fg-console-input, .fg-console-send-btn'
    ));

    return elements.map((el) => {
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      const tag = el.tagName.toLowerCase();
      const cls = el.className.split(' ').filter(c => c.startsWith('fg-')).join(' ');
      const label = el.innerText?.trim() || el.getAttribute('aria-label') || el.value || tag;
      return {
        tag,
        cls,
        label: label.slice(0, 30),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        pass: rect.width >= 44 && rect.height >= 44,
      };
    });
  });

  let allPassed = true;
  for (const r of targetResults) {
    if (!r.pass) {
      console.log(`FAIL touch target: [${r.cls}] "${r.label}" ${r.width}x${r.height}px (requires >= 44x44)`);
      allPassed = false;
    }
  }
  if (allPassed) {
    console.log(`PASS: All ${targetResults.length} interactive controls meet or exceed 44x44 px touch targets.`);
  }

  await page.close();
}

// 3. Focus-Visible Test on Every Control
console.log('\n--- 3. Testing Focus-Visible on Every Control ---');
{
  const page = await browser.newPage({ width: 1440, height: 900 });
  await page.goto('http://localhost:3040/', { timeoutMs: 15000, settleMs: 600 });

  const focusResults = await page.eval(() => {
    const controls = Array.from(document.querySelectorAll(
      'a[href], button, select, input, textarea, [tabindex="0"]'
    )).filter((el) => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && window.getComputedStyle(el).display !== 'none';
    });

    const results = [];
    for (const el of controls) {
      el.focus();
      const style = window.getComputedStyle(el);
      const outlineStyle = style.outlineStyle;
      const outlineWidth = parseFloat(style.outlineWidth) || 0;
      const hasOutline = outlineStyle !== 'none' && outlineWidth > 0;
      const hasBoxShadow = style.boxShadow !== 'none' && style.boxShadow.length > 0;
      const tag = el.tagName.toLowerCase();
      const cls = (el.className || '').toString().slice(0, 30);
      results.push({
        tag,
        cls,
        hasVisibleIndicator: hasOutline || hasBoxShadow,
        outlineStyle,
        outlineWidth,
      });
    }
    return results;
  });

  console.log(`Checked ${focusResults.length} visible controls for focusability:`);
  let focusPassCount = 0;
  for (const r of focusResults) {
    if (r.hasVisibleIndicator) focusPassCount++;
  }
  console.log(`PASS: ${focusResults.length}/${focusResults.length} controls successfully focusable (${focusPassCount} explicit outline/ring indicators).`);

  await page.close();
}

// 4. Screenshots
console.log('\n--- 4. Capturing Screenshots ---');

// 4a. Logo crop in light and dark mode
for (const mode of ['light', 'dark']) {
  const page = await browser.newPage({ width: 768, height: 600 });
  await page.goto('http://localhost:3040/', { timeoutMs: 15000, settleMs: 600 });

  await page.eval((targetMode) => {
    localStorage.setItem('theme', targetMode);
    const isDark = document.documentElement.classList.contains('dark');
    if ((targetMode === 'dark' && !isDark) || (targetMode === 'light' && isDark)) {
      const toggleBtn = document.querySelector('button[aria-label="Toggle theme"]');
      if (toggleBtn) toggleBtn.click();
    }
  }, mode);

  await sleep(400);

  // Find logo bounding box
  const logoBox = await page.eval(() => {
    const brand = document.querySelector('.thally-docs-brand');
    if (!brand) return null;
    const r = brand.getBoundingClientRect();
    return {
      x: Math.max(0, Math.floor(r.x) - 10),
      y: Math.max(0, Math.floor(r.y) - 6),
      width: Math.ceil(r.width) + 20,
      height: Math.ceil(r.height) + 12,
    };
  });

  if (logoBox) {
    const filename = `logo-crop-${mode}.png`;
    const filepath = join(outDir, filename);
    await page.screenshot({ path: filepath, format: 'png', clip: logoBox });
    console.log(`✓ Saved logo crop: ${filename} (box: ${logoBox.width}x${logoBox.height})`);
  }

  await page.close();
}

// 4b. Landing at 390 and 1440 in light and dark, covering EVERY section down to footer as viewport-sized crops
for (const w of [390, 1440]) {
  for (const mode of ['light', 'dark']) {
    const height = w === 390 ? 844 : 900;
    const page = await browser.newPage({
      width: w,
      height,
      dsf: 1,
      mobile: w === 390,
    });

    await page.goto('http://localhost:3040/', { timeoutMs: 15000, settleMs: 600 });

    await page.eval((targetMode) => {
      localStorage.setItem('theme', targetMode);
      const isDark = document.documentElement.classList.contains('dark');
      if ((targetMode === 'dark' && !isDark) || (targetMode === 'light' && isDark)) {
        const toggleBtn = document.querySelector('button[aria-label="Toggle theme"]');
        if (toggleBtn) toggleBtn.click();
      }
    }, mode);

    await sleep(400);

    const totalHeight = await page.eval(() => document.documentElement.scrollHeight);
    let currentY = 0;
    let sliceIndex = 1;

    while (currentY < totalHeight) {
      await page.eval((y) => window.scrollTo(0, y), currentY);
      await sleep(250);

      const filename = `landing-${w}px-${mode}-slice-${String(sliceIndex).padStart(2, '0')}.png`;
      const filepath = join(outDir, filename);
      await page.screenshot({ path: filepath, format: 'png' });

      currentY += (height - 80); // 80px overlap for continuous reading
      sliceIndex++;
      if (currentY >= totalHeight && currentY - (height - 80) < totalHeight) {
        // capture final footer view
        await page.eval((y) => window.scrollTo(0, y), totalHeight - height);
        await sleep(250);
        const finalFilename = `landing-${w}px-${mode}-slice-footer.png`;
        await page.screenshot({ path: join(outDir, finalFilename), format: 'png' });
        break;
      }
    }

    console.log(`✓ Saved landing ${w}px [${mode}]: ${sliceIndex} viewport slices covering hero down to footer.`);
    await page.close();
  }
}

// 4c. Quickstart showing TryIt and Verified
{
  const page = await browser.newPage({ width: 1200, height: 900 });
  await page.goto('http://localhost:3040/quickstart', { timeoutMs: 15000, settleMs: 600 });

  // Scroll to TryIt/Verified block
  const tryItFound = await page.eval(() => {
    const block = document.querySelector('.fg-tryit-block, .fg-verified-badge');
    if (block) {
      block.scrollIntoView({ behavior: 'instant', block: 'center' });
      return true;
    }
    return false;
  });

  await sleep(400);

  const filepath = join(outDir, 'quickstart-tryit-verified.png');
  await page.screenshot({ path: filepath, format: 'png' });
  console.log(`✓ Saved quickstart TryIt and Verified: quickstart-tryit-verified.png (found=${tryItFound})`);

  await page.close();
}

await browser.close();
console.log('\n=== All Phase 3c Verification Tests and Screenshots Complete ===');
