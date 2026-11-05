# Vercel Fallback Deployment Guide — JSON Server Field Guide

This document describes how to deploy the JSON Server Field Guide to Vercel as a standard Next.js application without modifying any framework-owned files.

---

## 1. Viability Assessment

**Verdict: Fully Compatible with Zero Framework File Modifications.**

The project builds cleanly with standard Next.js tooling (`npm run build`, running `next build` with Turbopack) on Node 22. The Thally runtime already includes native, first-class support for Vercel:

- **Built-in Vercel URL Discovery (`src/lib/site-url.ts`):**
  Lines 55–57 explicitly detect `VERCEL === '1'` and read `VERCEL_PROJECT_PRODUCTION_URL` or `VERCEL_URL` to automatically resolve canonical site links when `THALLY_SITE_URL` is omitted.
- **Preview Domain Isolation:**
  Vercel preview deployments (`VERCEL_ENV === 'preview'`) automatically point canonical links to the production site and suppress host mismatch warnings.
- **Portable Next.js Configuration (`next.config.ts`):**
  The Cloudflare OpenNext integration is strictly isolated to `phase-development-server` if `@opennextjs/cloudflare` is installed. In production build (`phase-production-build`), `next.config.ts` evaluates as a standard Next.js configuration.
- **Edge Middleware (`src/middleware.ts`):**
  The middleware compiles cleanly into `ƒ Proxy (Middleware)` with zero warnings or errors. It runs natively on Vercel's Edge Network for header manipulation, `.md` content routing, and machine-discovery links.

---

## 2. Deployment Steps

### Option A: Via Vercel Dashboard (Recommended)

1. **Import Repository:**
   - Log in to [vercel.com](https://vercel.com) and navigate to **Add New... > Project**.
   - Select the GitHub repository `Ebendttl/json-server-field-guide`.

2. **Configure Project Settings:**
   - **Framework Preset:** `Next.js` (auto-detected).
   - **Root Directory:** `./` (default).
   - **Build Command:** Leave as default (`npm run build`).
     > *Note:* npm automatically executes `prebuild` (`npm run runtime-sources:build && npm run embeddings:build`) before `next build`. This generates `src/generated/runtime-sources.ts` and `src/generated/runtime-docs.ts` in-process.
   - **Output Directory:** Leave as default (`.next`).
   - **Install Command:** Leave as default (`npm install` or `npm ci`).

3. **Node.js Version:**
   - Under **Settings > General > Node.js Version**, select **22.x** (matching `.nvmrc` and `engines.node`).

4. **Set Environment Variables:**
   Add the following under **Environment Variables**:
   - `THALLY_SITE_URL` = `https://<your-project>.vercel.app` (or your custom domain).
     *(Setting this explicitly ensures all absolute links in `/llms.txt`, `/sitemap.xml`, and JSON-LD metadata point directly to your canonical production URL).*

5. **Deploy:**
   - Click **Deploy**. Vercel will clone, run `npm run build`, and deploy the site across its global CDN and Edge network.

---

### Option B: Via Vercel CLI

From your local terminal:

```bash
# Ensure Node 22 is active
source ~/.nvm/nvm.sh && nvm use 22

# Install or run Vercel CLI
npx vercel

# Follow interactive prompts to link project
# Set environment variable for production:
npx vercel env add THALLY_SITE_URL production

# Deploy to production:
npx vercel --prod
```

---

## 3. Environment Variables Reference

| Variable | Required | Default / Fallback | Description |
| :--- | :---: | :--- | :--- |
| `THALLY_SITE_URL` | **Recommended** | `VERCEL_PROJECT_PRODUCTION_URL` | Public canonical origin (e.g. `https://json-server.vercel.app`). Used for `/llms.txt`, `/sitemap.xml`, and OpenGraph metadata. |
| `THALLY_DISABLE_BUILD_CACHE` | Optional | Unset (`0`) | Set to `1` only if you need to bypass Turbopack's file system build cache on Vercel builders. |
| `NODE_VERSION` | Optional | `22` (via `.nvmrc`) | Node engine version. Vercel automatically respects `.nvmrc`. |

---

## 4. Incompatibility & Platform Analysis

### OpenNext and Cloudflare Files
- Files such as `open-next.config.ts`, `wrangler.jsonc`, and `scripts/build-cloudflare.mts` are specific to Cloudflare Workers packaging.
- They are completely ignored by the standard Next.js build pipeline and Vercel build runners.
- `package.json` does not include `@opennextjs/cloudflare` in standard `dependencies` or `devDependencies` (it is an optional manual setup script `setup:cloudflare`), so Vercel will never attempt to build or invoke Cloudflare artifacts.

### Middleware Compatibility
- `src/middleware.ts` runs on the Edge runtime.
- It uses standard `NextRequest`, `NextResponse`, Web Crypto APIs (`createDailyVisitorKey`), and standard headers.
- It does not import Node-only modules at top level (filesystem imports are carefully segregated to Node routes).
- Verified during local build: Next.js reports `ƒ Proxy (Middleware)` with zero build or deprecation warnings.

### Pre-rendering & Dynamic Routes
- Static documentation pages (`/`, `/quickstart`, `/guides/build-a-mock-api`, `/verification`) are statically pre-rendered (`● SSG`).
- Interactive client components (`<Landing />`, `<Console />`, `<TryIt />`, `<Verified />`) hydrate on the client.
- Dynamic route handlers (`/api/brand/favicon`, `/api/docs/[...slug]`, `/api/markdown/[...slug]`) run seamlessly as Vercel serverless functions.

---

## 5. Why `vercel.json` Is Not Created

A `vercel.json` configuration file is **not created** because:

1. **Native Next.js Detection:** Vercel natively detects Next.js repositories and automatically configures optimal build commands, routing rules, header caching, and output directories.
2. **Prevent Configuration Conflicts:** Next.js App Router defines security headers, redirects, and rewrites directly in [next.config.ts](file:///home/ebendttl/portfolio-projects/json-server-field-guide/next.config.ts) and [src/middleware.ts](file:///home/ebendttl/portfolio-projects/json-server-field-guide/src/middleware.ts). Duplicating them in `vercel.json` risks conflicting routing rules or stale headers.
3. **Pristine Scaffold Integrity:** Omitting unneeded configuration files preserves repository cleanliness without cluttering the project root.
