# Deployment & Handoff Guide — JSON Server Field Guide

## Overview

The JSON Server Field Guide is an unofficial, fixture-verified interactive companion for `json-server@1.0.0-beta.15`. It is built on top of the Thally documentation template with an in-browser query execution engine, interactive dual-pane console, honest fixture badges, and comprehensive test coverage.

---

## 1. Publish Steps

Before releasing or deploying new updates:

1. **Verify Environment**:
   ```bash
   source ~/.nvm/nvm.sh && nvm use 22
   node -v # Must be >= 22.12
   ```

2. **Run Engine & Fixture Drift Tests**:
   ```bash
   npm run test:engine       # Replays all 91 recorded requests across 5 scenarios
   npm run verify:fixtures   # Spins up clean json-server and re-records 3x with 250ms write delays
   ```

3. **Run Lint and Platform Validation**:
   ```bash
   npm run check -- --ci     # Thally CLI strict check (0 errors, 0 warnings)
   node .agents/skills/design-taste-frontend/scripts/lint.mjs src/mdx/fg  # Taste-skill anti-slop linter
   ```

4. **Production Build**:
   ```bash
   npm run typecheck         # TypeScript strict typechecking
   npm run build             # Next.js 16.4.1 Turbopack production bundle
   ```

5. **Cloudflare Worker / OpenNext Deployment (Alternative Production Path)**:
   ```bash
   npm run build:cloudflare
   npm run deploy:cloudflare # Deploys worker via OpenNext
   ```

---

## 2. Thally Cloud Deployment Incident Report

- **Error Encountered**: `managed_runtime_unavailable`
- **Deployment ID**: `cb101d12-b0e8-4694-90f8-acece6f8ba42`
- **Impact**: Automatic deployment to Thally Cloud control plane was blocked by upstream runtime unavailability.
- **Root Cause & Workaround**:
  - The local production bundle compiles cleanly with 0 TypeScript or build errors.
  - The Thally Cloud edge runtime controller was temporarily offline or rejecting container handoffs for this region.
  - As designed in the architecture guide, customer-hosted sites can deploy directly to Cloudflare Pages/Workers using the pre-configured OpenNext toolchain (`npm run deploy:cloudflare`) or standard Node.js server containerization (`npm run start -p 3040`).

---

## 3. Platform Feedback & Observations (For Partner/Team Email)

### What Worked Exceptionally Well
- **Custom MDX Component System**: Adding `<TryIt />` and `<Verified />` through `src/mdx/custom-components.tsx` allowed direct compilation into MDX documents without manual wrapper boilerplate or hydration glitches.
- **Turbopack Build Performance**: Next.js 16 Turbopack build finishes in ~24–35 seconds cold and optimizes SSG pages in under 40ms.
- **Pure-Function Engine Simulation**: Simulating `json-server@1.0.0-beta.15` query resolution client-side in pure TypeScript proved 100% stable against all 91 recorded fixture requests with zero external runtime dependencies.

### Friction Encountered
- **Theme State Decoupling in Automated Chrome CDP**: The default brand asset route (`/api/brand/logo`) uses `useReaderTheme()` from `next-themes`. In headless browser automation (Playwright/CDP), adding `.dark` or removing `.dark` on `<html>` is insufficient to trigger React re-renders unless the theme toggle button (`button[aria-label="Toggle theme"]`) is clicked or `localStorage.theme` is explicitly synchronized.
- **Orphan Page Rules on Custom Landing**: Because the root page (`/`) uses `mode: custom` and mounts `<Landing />`, navigation tabs and sidebar chrome are manually hidden. Having to hide the shell via inline CSS rather than a declarative `layout: "landing"` in `docs.json` created minor visual coordination overhead.

### Suggested Improvements for Future Releases
- **Built-in `layout: "splash"` or `layout: "landing"`**: Allow docs authors to designate a landing page that renders without sidebar or top-level tabs while keeping the top brand bar intact.
- **Explicit User-Script Ownership in `starter-release.json`**: Formally define a `scripts/fg-*` or `scripts/custom-*` ignore rule so framework sync tools never conflict with custom build or test scripts.
