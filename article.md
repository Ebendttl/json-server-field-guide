---
title: Building a Tested, High-Performance Docs Site with Thally (and What It Taught Me About Modern DX)
published: true
description: A practical deep dive into building an empirically verified documentation engine with Thally, custom interactive MDX components, and resilient multi-platform Next.js architecture.
tags: webdev, nextjs, documentation, opensource
canonical_url: https://json-server-field-guide.vercel.app
---

# Building a Tested, High-Performance Docs Site with Thally (and What It Taught Me About Modern DX)

When I set out to build the [**JSON Server Field Guide**](https://json-server-field-guide.vercel.app)—an interactive, companion guide for `json-server@1.0.0-beta.15`—I committed to a foundational principle:

> **Every behavioral statement in the documentation must be backed by ground-truth, recorded HTTP fixtures.**  
> No assumptions, no guessing, and no blindly repeating outdated v0.17 patterns.

To bring this vision to life, I chose [**Thally**](https://github.com/thallylabs/thally), a modern, Next.js 16 (Turbopack)-powered documentation framework purpose-built for speed, clean architectural ownership, and native AI-agent readiness.

In this article, I want to share a transparent, end-to-end walkthrough of building this site from scratch with Thally: from scaffolding and content modeling to authoring client-side interactive MDX consoles, running CI quality gates, and deploying to production.

Along the way, I will also share the real-world engineering hurdles I encountered—and how Thally’s standard Next.js foundation proved to be its greatest superpower.

- **Live Site:** [json-server-field-guide.vercel.app](https://json-server-field-guide.vercel.app)
- **GitHub Repository:** [github.com/Ebendttl/json-server-field-guide](https://github.com/Ebendttl/json-server-field-guide)

---

## Why Thally? The Architecture Behind the Framework

Many documentation engines isolate developers inside proprietary static site generators with custom plugin ecosystems. When you want to embed a custom interactive React widget, hook into stateful browser APIs, or optimize a production bundle, you often find yourself battling the generator's abstractions.

Thally takes a fundamentally different path: **it is a complete, production-grade Next.js App Router application with Turbopack**.

```
┌────────────────────────────────────────────────────────┐
│                   Your Documentation                   │
│                                                        │
│   src/content/ (MDX)   +   docs.json   +   site.ts     │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│                    Thally Framework                    │
│                                                        │
│  • Next.js 16 + Turbopack (sub-second HMR)             │
│  • LLM Readiness (/llms.txt, /.well-known/)            │
│  • Automated CI Verification (thally check)            │
│  • Strict File Ownership (starter-release.json)        │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│                  Universal Deployment                  │
│                                                        │
│     Thally Cloud  │  Vercel  │  Cloudflare  │  Docker   │
└────────────────────────────────────────────────────────┘
```

Out of the box, Thally delivers four standout advantages:

1. **Blazing Fast Developer Experience:** Turbopack compiles pages in sub-second cold starts with near-instant hot module replacement.
2. **First-Class AI Readiness:** Built-in semantic endpoints (`/llms.txt`, `/llms-full.txt`, and markdown content negotiation) mean AI agents can ingest your documentation cleanly without scraping overhead.
3. **Automated Quality Gating:** A dedicated CLI (`thally check`) audits internal links, frontmatter schema validity, and detects orphaned pages before you commit.
4. **Strict File Ownership:** A machine-managed `starter-release.json` draws a clear line between framework internals and authored content, preventing upstream updates from wiping out your customizations.

---

## 1. Scaffolding and Initial Setup

Bootstrapping a new Thally documentation site takes less than a minute via the official CLI:

```bash
npx --yes create-thally-docs@latest my-docs --yes --install
cd my-docs
npm run dev
```

The local development server boots at `http://localhost:3040`.

> **💡 Practical Tip for Existing Git Repositories:**  
> Like many modern CLI scaffolds, `create-thally-docs` expects an empty target directory to prevent accidental file clobbering. If you've already initialized a GitHub repository with a `README.md` or `.git`, simply scaffold into a temporary folder (`npx create-thally-docs tmp-docs`) and move the generated files into your repository root.

---

## 2. The Clean Ownership Model: Never Fear Framework Updates

One of the most persistent headaches in long-term documentation maintenance is upgrading the underlying toolchain without breaking your bespoke styles or custom React components.

Thally solves this elegantly through **explicit file ownership boundaries** defined in `starter-release.json`:

| Territory | Paths | Ownership Rule |
| :--- | :--- | :--- |
| **User-Owned** | `src/content/**`<br>`docs.json`<br>`src/data/site.ts`<br>`src/mdx/custom-components.tsx`<br>`public/**` | **Safe to customize.** Upstream framework updates will never touch these files. |
| **Framework-Owned** | `src/app/**`<br>`src/components/**`<br>`src/lib/**`<br>`src/styles/**` | **Managed by Thally.** Updated automatically via `npm run starter:update`. |

By isolating all custom application logic inside user-owned folders (such as `src/mdx/fg/`), you maintain a clean separation of concerns and can pull upstream framework enhancements with confidence.

---

## 3. Declarative Navigation and Branding

Configuring your documentation structure requires editing just two files:

### `docs.json`
Defines your global layout, active theme preset (`sharp`, `maple`, `minimal`), color modes, and sidebar navigation hierarchy:

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

### `src/data/site.ts`
Holds your site's identity, metadata, and source repository:

```typescript
export const site = {
  name: "JSON Server Field Guide",
  description: "The tested, example-driven companion for json-server v1.0.0-beta.15",
  repoUrl: "https://github.com/Ebendttl/json-server-field-guide"
};
```

Connecting `repoUrl` automatically activates GitHub quick links ("Edit this page", "Report an issue") throughout the docs chrome.

---

## 4. The Philosophy of "Empirical Documentation"

When writing technical documentation—especially for rapid beta releases—assumptions are dangerous. In `json-server@1.0.0-beta.15`, several breaking changes diverged significantly from the older v0.17 releases:

- `?_limit=1` returns `[]` (an empty array) rather than limiting results.
- `POST` requests completely ignore custom `id` values in request payloads and assign an auto-generated alphanumeric string.
- Equality queries are case-sensitive, while substring searches require the explicit `:contains` operator.
- Relationship queries (`?projectId=2`) return `[]` if foreign keys are stored as strings rather than integers.

Rather than trust second-hand tutorials, I created an automated test script (`scripts/fg-record-fixtures.mjs`) that booted a real `json-server` instance on Node 22, fired 91 distinct query combinations across 5 real-world scenarios, and captured ground-truth HTTP request/response pairs into `src/mdx/fg/fixtures.json`:

```
Recorded 91 ground-truth fixtures across 5 scenarios:
✔ qs-paginate-embed:   21 fixtures
✔ tasks-filter-sort:    24 fixtures
✔ tasks-paginate-embed: 21 fixtures
✔ tasks-write:          11 fixtures
✔ quickstart-write:     14 fixtures
```

Every claim made in the documentation is annotated with a badge referencing its exact fixture ID:

```markdown
<Verified id="tasks-filter-sort-01">
  Equality filters in json-server v1 are strictly case-sensitive.
</Verified>
```

Readers don't have to wonder whether an example works; they can inspect the real recorded wire response directly on the page.

---

## 5. Supercharging MDX with Interactive Client Components

Static code blocks only take learners so far. With Thally, hydrating custom React client components inside markdown is seamless via `src/mdx/custom-components.tsx`.

To give developers an immediate sandbox, I built an **In-Browser Interactive Query Console** backed by a client-side TypeScript simulation engine (`src/mdx/fg/engine.ts`).

```
┌────────────────────────────────────────────────────────┐
│               Interactive Query Console                │
│                                                        │
│  [GET /tasks?status=in-progress&_sort=-priority]       │
│                                                        │
│  ┌─────────────────────────┐  ┌─────────────────────┐  │
│  │   db.json (Editable)    │  │   HTTP Response     │  │
│  │   { "tasks": [...] }    │  │   Status: 200 OK    │  │
│  │                         │  │   [Verified Real]   │  │
│  └─────────────────────────┘  └─────────────────────┘  │
└────────────────────────────────────────────────────────┘
```

The simulation engine is verified against all 91 recorded fixtures in CI (`npm run test:engine`), ensuring that live in-browser queries behave identically to a real `json-server` backend.

### Key Implementation Lessons:

1. **CSS Namespacing:** Tailwind’s content scan in the starter template is targeted at markdown pages and primary layout components. When authoring custom MDX widgets in `src/mdx/fg/`, isolate your styling using cleanly namespaced vanilla CSS (`.fg-*`). This prevents style collisions and guarantees your widgets look identical regardless of upstream theme changes.
2. **Mobile Card Resilience:** When displaying HTTP query strings alongside metadata badges, avoid rigid flex containers. Using CSS grid tracks with `minmax(0, 1fr)` and `flex-wrap: wrap` ensures query snippets wrap gracefully on mobile viewports without overflowing cards.

---

## 6. Pre-Flight Verification & Quality Auditing

Before deploying, Thally provides powerful built-in verification tools:

```bash
# 1. Audit link validity, frontmatter, and orphan pages
npx @thallylabs/cli@latest check --ci .

# 2. Strict TypeScript and Turbopack production build
npm run typecheck && npm run build
```

The CLI's automated checks ensure zero dead links and catch broken references before they reach production.

To validate performance and accessibility, I ran an automated Google Lighthouse mobile audit against the production build:

| Metric | Score | Standard |
| :--- | :---: | :--- |
| **Accessibility** | **100** / 100 | WCAG AA / AAA Compliant |
| **Best Practices** | **100** / 100 | Modern Web Standards |
| **SEO** | **100** / 100 | Structured Metadata & Semantic HTML |
| **Performance** | **93** / 100 | Sub-second First Contentful Paint |

Thally’s clean HTML generation and Turbopack optimization provide an exceptional foundation out of the box.

---

## 7. Deployment: The Superpower of Zero Lock-In

Deploying a Thally site is designed to be effortless. With **Thally Cloud**, you link your GitHub repository, designate your production branch, and every push triggers an automated build and deployment.

### A Real-World Test of Portability

During the initial deployment process, I encountered an early-stage platform provisioning check (`managed_runtime_unavailable`). 

I reached out to the Thally team to share the error code and reproduction details. Thally's engineering team was prompt and constructive, identifying that an early pre-provisioning stylesheet validator was conservatively flagging certain CSS rules in authored custom MDX stylesheets. While their team deployed an upstream platform update to relax the validation logic, I modernized the custom stylesheet to hex tokens and modern `clip-path` syntax.

More importantly, this real-world moment highlighted **the single most reassuring design choice in Thally**: **it is a standard, portable Next.js application.**

Because Thally does not lock you into a proprietary hosting container or closed runtime:
- I connected the exact same repository to **Vercel**.
- Vercel auto-detected Next.js 16, executed `npm run build` (which automatically ran Thally's `runtime-sources` pre-build pipeline), and deployed the site in **under 45 seconds**.
- All dynamic routes, canonical links, and AI endpoints (`/llms.txt`) functioned out of the box with zero workarounds.

Whether you host on Thally Cloud, Vercel, Cloudflare Pages (via the included OpenNext configuration), or a private container, **your documentation remains 100% your own**. You get the speed and elegance of a specialized docs platform without the risk of platform lock-in.

---

## Key Takeaways for Docs Engineers

Building the JSON Server Field Guide reinforced several core principles for modern developer experience:

1. **Anchor Docs in Empirical Proof:** If you document beta or rapidly evolving software, capture real network fixtures. It turns documentation from an opinion into a verified specification.
2. **Respect Ownership Boundaries:** Scoping custom widgets into designated user directories ensures your documentation site can evolve alongside upstream framework releases without painful merge conflicts.
3. **Audit Early and Often:** Using automated tools like `thally check` and mobile Lighthouse audits prevents accessibility regressions before your users ever see them.
4. **Demand Open Architecture:** When choosing a documentation platform, always prioritize tools that build on open web standards. Thally's standard Next.js foundation meant our documentation was resilient, fast, and universally deployable from day one.

---

### Resources & Links

- 🌐 **Live Documentation:** [json-server-field-guide.vercel.app](https://json-server-field-guide.vercel.app)
- 💻 **Full Source Code:** [github.com/Ebendttl/json-server-field-guide](https://github.com/Ebendttl/json-server-field-guide)
- ⚡ **Thally Framework:** [github.com/thallylabs/thally](https://github.com/thallylabs/thally)

---

*What strategies does your team use to keep API documentation verified and free of stale examples? Have you tried building docs with Next.js 16 and Turbopack? Let me know your thoughts in the comments below!*
