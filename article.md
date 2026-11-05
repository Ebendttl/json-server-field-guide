---
title: Building a Tested, High-Performance Docs Site with Thally (and What I Learned Along the Way)
published: true
description: A practical guide to building an empirically verified documentation site with Thally, custom interactive MDX components, and resilient multi-platform hosting.
tags: webdev, nextjs, documentation, opensource
canonical_url: https://json-server-field-guide.vercel.app
---

# Building a Tested, High-Performance Docs Site with Thally (and What I Learned Along the Way)

When I set out to build the [**JSON Server Field Guide**](https://json-server-field-guide.vercel.app)—an unofficial, example-driven companion for `json-server@1.0.0-beta.15`—I had a non-negotiable rule: **every behavioral statement had to be backed by ground-truth, recorded HTTP fixtures**. No guessing, and no repeating stale documentation from older v0.17 releases.

To bring this to life, I chose [**Thally**](https://github.com/thallylabs/thally), a modern, Next.js 16 (Turbopack)-powered documentation framework built for high-performance sites and native AI-agent readiness.

In this article, I will walk you through building a tested, production-grade documentation site from scratch with Thally. We will cover scaffolding, content modeling, custom MDX hydration, quality auditing, and deployment—along with the real-world obstacles I navigated and how I solved them.

- **Live Site:** [json-server-field-guide.vercel.app](https://json-server-field-guide.vercel.app)
- **Source Code:** [github.com/Ebendttl/json-server-field-guide](https://github.com/Ebendttl/json-server-field-guide)

---

## What Makes Thally Different?

Unlike static documentation generators that isolate you inside proprietary plugin ecosystems, Thally is built as a complete, customer-ready Next.js App Router application with Turbopack. Out of the box, you get:
- **Sub-second Turbopack builds** and instant hot reloading.
- **Native AI-agent discovery** endpoints (`/llms.txt`, `/llms-full.txt`, `/.well-known/`, and dynamic `.md` content negotiation).
- **Automated quality gating** via `thally check` to prevent broken links and orphaned pages.
- **Strict architectural file ownership** that lets you cleanly upgrade the underlying framework without clobbering custom code.

Here is how to take a Thally site from concept to production.

---

## 1. Scaffolding the Project

Getting started with Thally is straightforward using its official CLI:

```bash
npx --yes create-thally-docs@latest my-docs --yes --install
cd my-docs
npm run dev
```

The local development server spins up instantly at `http://localhost:3040`.

> **💡 Practical Tip (Working in an Existing Git Repo):**  
> Like many modern project generators, `create-thally-docs` requires an empty directory for safety. If you have already cloned a clean GitHub repository containing a `README.md` or `.git`, scaffold into a temporary folder first (`npx create-thally-docs tmp-docs`) and move the generated contents into your repository root.

---

## 2. Respecting the Ownership Model

One of Thally's best architectural decisions is the **explicit separation between framework-owned and user-owned files**, codified in `starter-release.json`:

- **User-Owned (Safe to customize):**  
  `src/content/**` (MDX pages), `docs.json` (navigation and themes), `src/data/site.ts` (metadata), `src/mdx/custom-components.tsx` (MDX components), and `public/**`.
- **Framework-Owned (Maintained by Thally):**  
  `src/app/**`, `src/components/**`, `src/lib/**`, `src/styles/**`, and `tailwind.config.ts`.

Keeping your custom application code scoped inside user-owned boundaries (e.g., in a dedicated folder like `src/mdx/fg/`) ensures you can run upstream updates (`npm run starter:update`) without merge conflicts.

---

## 3. Configuring Navigation and Branding

Site structure is controlled in two declarative files:

1. **`docs.json`:** Defines your sidebar navigation hierarchy, active theme preset (e.g. `sharp`, `maple`, `minimal`), typography, and brand assets. Navigation entries are organized into tabs and groups mapping directly to page slugs in `src/content/`:
   ```json
   {
     "theme": "sharp",
     "appearance": { "default": "dark" },
     "tabs": [
       {
         "tab": "Docs",
         "groups": [
           { "group": "Get started", "pages": ["introduction", "quickstart"] },
           { "group": "Guides", "pages": ["guides/build-a-mock-api"] },
           { "group": "Reference", "pages": ["verification"] }
         ]
       }
     ]
   }
   ```
2. **`src/data/site.ts`:** Holds your site's global metadata (`name`, `description`, `repoUrl`). Providing a repository URL automatically activates GitHub quick links ("Edit this page" and "Report an issue").

---

## 4. Writing Verifiable, Honest Content

In technical documentation, credibility is everything. When writing the guide for `json-server@1.0.0-beta.15`, I noticed that several widespread tutorials were repeating deprecated patterns from older versions.

To ensure total accuracy, I created an automated test script (`scripts/fg-record-fixtures.mjs`) that spawned a sandboxed `json-server` instance on Node 22, fired 91 distinct query combinations across 5 real scenarios, and captured ground-truth HTTP request/response fixtures:

```
Recorded 91 ground-truth fixtures across 5 scenarios:
- qs-paginate-embed: 21 fixtures
- tasks-filter-sort: 24 fixtures
- tasks-paginate-embed: 21 fixtures
- tasks-write: 11 fixtures
- quickstart-write: 14 fixtures
```

The recordings immediately surfaced critical breaking changes:
- `?_limit=1` returns `[]` in `beta.15`, rather than a single record.
- `POST` requests ignore any custom `id` in the request body and assign an auto-generated alphanumeric string.
- Equality queries are strictly case-sensitive, whereas substring filters require the explicit `:contains` modifier.

By anchoring every MDX code example to a verified fixture, readers know that every single snippet works exactly as documented.

---

## 5. Adding Interactive MDX Components

Thally makes it remarkably easy to hydrate interactive React client components inside markdown using `src/mdx/custom-components.tsx`.

For the Field Guide, I built an **in-browser Interactive Query Console** backed by a dependency-free TypeScript simulation engine (`src/mdx/fg/engine.ts`). The console lets readers test live queries against real data schemas with honesty badges (`[Verified Real]`, `[Simulated Query]`, `[Known Beta Gotcha]`).

### Two Important Implementation Lessons:

1. **Scoping Custom Component CSS:**  
   Tailwind's content scan in the starter intentionally prioritizes `src/content/` and core UI components. When building custom components inside `src/mdx/fg/`, avoid relying on ad-hoc Tailwind utilities. Instead, author clean, namespaced vanilla CSS (`.fg-*`) and import the stylesheet directly into your component.
2. **Mobile Card Centering & Responsive Flex:**  
   When displaying query strings alongside metadata badges, avoid rigid inline flex containers. Use responsive grid tracks (`grid-template-columns: minmax(0, 1fr)`) and `flex-wrap: wrap` to prevent code snippets from expanding card containers past the mobile viewport width.

---

## 6. Pre-Flight Verification & Quality Audit

Before shipping, Thally provides robust automated checking:

```bash
# 1. Verify markdown integrity, links, and frontmatter
npx @thallylabs/cli@latest check --ci .

# 2. Typecheck and verify Turbopack production bundle
npm run typecheck && npm run build
```

`thally check` catches missing frontmatter, broken internal anchors, and orphaned markdown files that aren't hooked into `docs.json`.

Running an automated Google Lighthouse mobile audit against the production build demonstrated the performance power of Thally's Turbopack foundation:
- **Performance:** **93** / 100
- **Accessibility:** **100** / 100 (WCAG AA/AAA compliant)
- **Best Practices:** **100** / 100
- **SEO:** **100** / 100

---

## 7. Deployment: The Power of a Portable Architecture

Deploying a Thally documentation site is simple. Through **Thally Cloud**, you link your GitHub repository, specify the production branch (`main`), and every push automatically triggers a managed release.

### Real-World Resilience: Zero-Config Portability

During deployment, we encountered an upstream platform edge case during the initial container provisioning phase (`managed_runtime_unavailable`). 

I reached out to Thally's engineering team, and **Ekene Eze** (`kenny@thally.io`) quickly investigated and traced the issue: Thally Cloud's pre-provisioning stylesheet validator was conservatively rejecting standard `hsl()` and legacy `rect()` functions in custom MDX styles. While their engineering team deployed a fix relaxing the validation rules, I immediately refactored the custom stylesheet to use modern hex tokens and `clip-path: inset(50%)`.

More importantly, this incident highlighted **the greatest architectural strength of Thally**: **it is a standard, portable Next.js application.**

Because Thally doesn't lock you into a proprietary runtime or closed container format, you have full multi-platform resilience:
- I connected the exact same untouched repository to **Vercel**.
- Vercel auto-detected Next.js 16, executed the standard `npm run build` (which automatically triggered Thally's `runtime-sources` pre-build pipeline), and deployed the site in under 45 seconds.
- Canonical links, metadata, and `/llms.txt` resolved seamlessly via `THALLY_SITE_URL`.

Whether hosted on Thally Cloud, Vercel, Cloudflare Workers, or a containerized Node environment, the documentation site runs without a single line of framework code changes.

---

## Key Takeaways

1. **Verify your facts:** If you document beta or rapidly evolving software, record ground-truth HTTP fixtures. Your readers will thank you.
2. **Respect architectural boundaries:** Keeping custom components and styles inside user-owned directories (`src/mdx/**`) guarantees effortless framework updates.
3. **Audit before you ship:** Use `thally check` and automated Lighthouse runs to maintain 100% accessibility and SEO standards.
4. **Choose portable foundations:** Tools like Thally that build on open, standard frameworks give you complete peace of mind and zero platform lock-in.

---

*The [JSON Server Field Guide](https://json-server-field-guide.vercel.app) is open source and available on [GitHub](https://github.com/Ebendttl/json-server-field-guide).*
