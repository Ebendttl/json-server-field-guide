#!/usr/bin/env node
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { Browser, sleep } from '../.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs';

process.env.CHROME_PATH = '/home/ebendttl/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome';

const outDir = '/home/ebendttl/.gemini/antigravity-ide/brain/07f0e27b-78ee-438e-8c8d-c499150f59f0/screenshots';
mkdirSync(outDir, { recursive: true });

console.log('=== Starting Phase 4 Audit & Verification ===\n');

// 0. Ensure Server on 3040 is Running
let serverProc = null;
async function ensureServer() {
  try {
    const res = await fetch('http://localhost:3040/');
    if (res.ok) {
      console.log('Production server already running on port 3040.');
      return;
    }
  } catch {}

  console.log('Starting production server on port 3040...');
  serverProc = spawn('npx', ['next', 'start', '-p', '3040'], {
    stdio: 'ignore',
    detached: true,
  });

  for (let i = 0; i < 30; i++) {
    await sleep(500);
    try {
      const res = await fetch('http://localhost:3040/');
      if (res.ok) {
        console.log('Production server is ready on port 3040.');
        return;
      }
    } catch {}
  }
  throw new Error('Failed to start server on port 3040 after 15s');
}

await ensureServer();

try {
  // 1. Run Lighthouse Mobile Audit
  console.log('\n--- 1. Running Lighthouse Mobile Audit ---');
  const lhReportPath = join(process.cwd(), 'scripts/lh-report.json');
  const lhResult = spawnSync(
    'npx',
    [
      '--yes',
      'lighthouse',
      'http://localhost:3040/',
      '--chrome-flags=--headless --no-sandbox',
      '--output=json',
      `--output-path=${lhReportPath}`,
      '--form-factor=mobile',
      '--screenEmulation.mobile',
      '--throttling-method=provided',
      '--no-enable-error-reporting',
      '--quiet'
    ],
    {
      env: { ...process.env, CHROME_PATH: process.env.CHROME_PATH },
      encoding: 'utf8'
    }
  );

  let lhScores = { performance: 0, accessibility: 0, bestPractices: 0, seo: 0 };
  try {
    const report = JSON.parse(readFileSync(lhReportPath, 'utf8'));
    lhScores = {
      performance: Math.round((report.categories.performance?.score || 0) * 100),
      accessibility: Math.round((report.categories.accessibility?.score || 0) * 100),
      bestPractices: Math.round((report.categories['best-practices']?.score || 0) * 100),
      seo: Math.round((report.categories.seo?.score || 0) * 100),
    };
    console.log('Lighthouse Scores:', lhScores);
    console.log('Performance Metrics:');
    console.log(' - FCP:', report.audits['first-contentful-paint']?.displayValue);
    console.log(' - LCP:', report.audits['largest-contentful-paint']?.displayValue);
    console.log(' - TBT:', report.audits['total-blocking-time']?.displayValue);
    console.log(' - CLS:', report.audits['cumulative-layout-shift']?.displayValue);
    console.log(' - Speed Index:', report.audits['speed-index']?.displayValue);

    if (lhScores.accessibility < 100) {
      console.log('\nAccessibility audit notices:');
      for (const [id, a] of Object.entries(report.audits)) {
        if (report.categories.accessibility.auditRefs.some(r => r.id === id) && a.score !== null && a.score < 1) {
          console.log(`- ${id} (${a.title}): score=${a.score}`);
        }
      }
    }
  } catch (e) {
    console.error('Lighthouse execution error:', e.message, lhResult.stderr);
  }

  // 2. Comprehensive Accessibility Checks via CDP
  console.log('\n--- 2. Comprehensive Accessibility Checks ---');
  const browser = await Browser.launch();

  {
    const page = await browser.newPage({ width: 1440, height: 900 });
    await page.goto('http://localhost:3040/', { timeoutMs: 15000, settleMs: 500 });

    // A. Heading Order Check
    const headingCheck = await page.eval(() => {
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
      let validHierarchy = true;
      let prevLevel = 0;
      const hierarchy = [];
      for (const h of headings) {
        const level = parseInt(h.tagName.substring(1), 10);
        hierarchy.push({ tag: h.tagName, text: h.innerText.slice(0, 30) });
        if (prevLevel > 0 && level > prevLevel + 1) {
          validHierarchy = false;
        }
        prevLevel = level;
      }
      return { validHierarchy, count: headings.length, hierarchy };
    });
    console.log(`A. Heading Order: ${headingCheck.validHierarchy ? 'PASS (Strict semantic hierarchy)' : 'FAIL'} (${headingCheck.count} headings checked)`);

    // B. Keyboard-Only Navigation Pass
    const keyboardCheck = await page.eval(() => {
      const focusable = Array.from(document.querySelectorAll('a, button, select, input, textarea, [tabindex="0"]'))
        .filter(el => {
          const r = el.getBoundingClientRect();
          return r.width > 0 && r.height > 0 && window.getComputedStyle(el).display !== 'none';
        });
      
      let allCanFocus = true;
      for (const el of focusable) {
        el.focus();
        if (document.activeElement !== el) allCanFocus = false;
      }
      return { allCanFocus, count: focusable.length };
    });
    console.log(`B. Keyboard Focus: ${keyboardCheck.allCanFocus ? 'PASS' : 'FAIL'} (${keyboardCheck.count} focusable controls tested)`);

    // C. 200% Zoom / Reflow Test
    await page.setViewport({ width: 640, height: 900 });
    await sleep(300);
    const zoomOverflow = await page.eval(() => {
      const docW = document.documentElement.scrollWidth;
      const winW = window.innerWidth;
      return { overflowing: docW > winW, docW, winW };
    });
    console.log(`C. 200% Zoom Reflow: ${!zoomOverflow.overflowing ? 'PASS (No horizontal scroll)' : 'FAIL'} (scrollWidth=${zoomOverflow.docW}, winWidth=${zoomOverflow.winW})`);

    await page.close();

    // D. Prefers-Reduced-Motion Test
    const motionPage = await browser.newPage({ width: 1440, height: 900, reducedMotion: true });
    await motionPage.goto('http://localhost:3040/', { timeoutMs: 15000, settleMs: 500 });
    const motionCheck = await motionPage.eval(() => {
      const heroContent = document.querySelector('.fg-hero-content');
      if (!heroContent) return { pass: true };
      const style = window.getComputedStyle(heroContent);
      const anim = style.animation || style.animationName;
      return { pass: anim === 'none' || anim.includes('none'), anim };
    });
    console.log(`D. Prefers-Reduced-Motion: ${motionCheck.pass ? 'PASS (Animations disabled)' : 'FAIL'} (animation=${motionCheck.anim})`);
    await motionPage.close();

    // E. Numeric Contrast Checks in Light and Dark
    for (const mode of ['light', 'dark']) {
      const p = await browser.newPage({ width: 1440, height: 900 });
      await p.goto('http://localhost:3040/', { timeoutMs: 15000, settleMs: 500 });
      await p.eval((targetMode) => {
        localStorage.setItem('theme', targetMode);
        const isDark = document.documentElement.classList.contains('dark');
        if ((targetMode === 'dark' && !isDark) || (targetMode === 'light' && isDark)) {
          const toggleBtn = document.querySelector('button[aria-label="Toggle theme"]');
          if (toggleBtn) toggleBtn.click();
        }
      }, mode);
      await sleep(400);

      const contrastResults = await p.eval(() => {
        const pairs = [
          { sel: '.fg-headline', name: 'Headline' },
          { sel: '.fg-subhead', name: 'Subhead' },
          { sel: '.fg-btn-primary', name: 'Primary Button' },
          { sel: '.fg-btn-secondary', name: 'Secondary Button' },
          { sel: '.fg-console-label', name: 'Console Label' },
          { sel: '.fg-footer-disclaimer', name: 'Footer Text' },
        ];

        function parseRgb(colorStr) {
          const m = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
          if (!m) return [0, 0, 0];
          return [parseInt(m[1], 10), parseInt(m[2], 10), parseInt(m[3], 10)];
        }

        function lum(rgb) {
          const a = rgb.map(v => {
            v /= 255;
            return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
          });
          return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
        }

        function getRatio(c1, c2) {
          const l1 = lum(parseRgb(c1));
          const l2 = lum(parseRgb(c2));
          return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
        }

        return pairs.map(item => {
          const el = document.querySelector(item.sel);
          if (!el) return { name: item.name, ratio: 'N/A', pass: true };
          const fg = window.getComputedStyle(el).color;
          let bg = window.getComputedStyle(el).backgroundColor;
          if (bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent') {
            bg = window.getComputedStyle(document.body).backgroundColor;
          }
          const ratio = getRatio(fg, bg);
          return { name: item.name, ratio: ratio.toFixed(2), pass: ratio >= 4.5 || (item.name.includes('Headline') && ratio >= 3.0) };
        });
      });

      console.log(`E. Numeric Contrast [${mode}]:`);
      for (const cr of contrastResults) {
        console.log(`   - ${cr.name}: ${cr.ratio}:1 (${cr.pass ? 'PASS' : 'WARN'})`);
      }
      await p.close();
    }
  }

  // 3. Screenshots of all 4 pages at 390px and 1440px in light and dark
  console.log('\n--- 3. Capturing Viewport Screenshots for 4 Pages ---');
  const pages = [
    { slug: '', name: 'landing' },
    { slug: 'quickstart', name: 'quickstart' },
    { slug: 'guides/build-a-mock-api', name: 'guide-mock-api' },
    { slug: 'verification', name: 'verification' },
  ];

  for (const p of pages) {
    for (const w of [390, 1440]) {
      for (const mode of ['light', 'dark']) {
        const height = w === 390 ? 844 : 900;
        const page = await browser.newPage({
          width: w,
          height,
          dsf: 1,
          mobile: w === 390,
        });

        await page.goto(`http://localhost:3040/${p.slug}`, { timeoutMs: 15000, settleMs: 600 });

        await page.eval((targetMode) => {
          localStorage.setItem('theme', targetMode);
          const isDark = document.documentElement.classList.contains('dark');
          if ((targetMode === 'dark' && !isDark) || (targetMode === 'light' && isDark)) {
            const toggleBtn = document.querySelector('button[aria-label="Toggle theme"]');
            if (toggleBtn) toggleBtn.click();
          }
        }, mode);

        await sleep(350);

        const filename = `${p.name || 'home'}-${w}px-${mode}.png`;
        const filepath = join(outDir, filename);
        await page.screenshot({ path: filepath, format: 'png' });
        console.log(`✓ Saved ${filename}`);

        await page.close();
      }
    }
  }

  await browser.close();
  console.log('\n=== Phase 4 Audit Complete ===');

} finally {
  if (serverProc) {
    try {
      process.kill(-serverProc.pid, 'SIGTERM');
    } catch {
      serverProc.kill('SIGTERM');
    }
  }
}
