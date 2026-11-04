#!/usr/bin/env node
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { Browser, sleep } from '../.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs';

process.env.CHROME_PATH = '/home/ebendttl/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome';

const outDir = '/home/ebendttl/.gemini/antigravity-ide/brain/07f0e27b-78ee-438e-8c8d-c499150f59f0/screenshots';
mkdirSync(outDir, { recursive: true });

const browser = await Browser.launch();

const pages = [
  { path: '/', name: 'landing' },
  { path: '/quickstart', name: 'quickstart' },
];

const widths = [
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
];

const modes = ['light', 'dark'];

console.log('Capturing screenshots and checking horizontal overflow ...\n');

for (const p of pages) {
  for (const w of widths) {
    for (const mode of modes) {
      const page = await browser.newPage({
        width: w.width,
        height: w.height,
        dsf: 1,
        mobile: w.width < 600,
      });

      const url = `http://localhost:3040${p.path}`;
      await page.goto(url, { timeoutMs: 15000, settleMs: 500 });
      await sleep(400);

      // Set mode
      await page.eval((m) => {
        if (m === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }, mode);

      await sleep(300);

      // Check horizontal overflow
      const overflow = await page.eval(() => {
        const docW = document.documentElement.scrollWidth;
        const winW = window.innerWidth;
        const bodyW = document.body.scrollWidth;
        const overflowing = docW > winW || bodyW > winW;
        return { overflowing, docW, bodyW, winW };
      });

      const filename = `${p.name}-${w.width}px-${mode}.png`;
      const filepath = join(outDir, filename);

      await page.screenshot({ path: filepath });

      console.log(
        `✓ ${filename} — overflow: ${overflow.overflowing ? 'YES (FAIL)' : 'NONE (PASS)'} (docW=${overflow.docW}, winW=${overflow.winW})`
      );

      await page.close();
    }
  }
}

await browser.close();
console.log('\nAll screenshots saved to:', outDir);
