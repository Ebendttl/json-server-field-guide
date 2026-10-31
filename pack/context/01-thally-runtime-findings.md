# 01 · How Thally actually works (from reading `thallylabs/thally` @ e08396e, MIT)

Everything here was read from source or **proven by a spike** on a scaffolded project. Items marked **[SPIKE]** were tested over HTTP against a running `npm run dev`.

## Stack
- Next.js 16 (App Router, Turbopack), React 19, TypeScript 5.9, **Tailwind CSS 3.4** (+ `@tailwindcss/typography`), `next-mdx-remote` + remark/rehype, **Shiki 4** code highlighting, `mermaid`, `katex`, `cmdk` search, `next-themes` (toggles `.dark` on `<html>`), `lucide-react` icons, `zustand`, `nuqs`.
- Deploys: Thally Cloud managed build, or self-host (Vercel / Cloudflare via OpenNext). Site node engine: Node ≥ 22.
- Monorepo packages: `core`, `cli`, `create-thally-docs`, `mcp`, `migrate`, `agent`.
- Every page is also published as: Markdown (`/page.md` **[SPIKE]**), `/llms.txt` **[SPIKE]**, `/llms-full.txt`, `/skill.md`, `/AGENTS.md`, JSON-LD, search index, and a read-only MCP endpoint `/api/mcp` (tools: `search_docs`, `read_page`, `list_pages`, `agent_readiness`).

## OWNERSHIP — the single most important finding
From `starter-release.json`:
- **User-owned, never overwritten:** `src/content/**`, `docs.json`, `src/data/site.ts`, `src/mdx/custom-components.tsx`, `snippets/**`, `public/**`, `openapi.yaml`, `README.md`, `AGENTS.md`, `LICENSE`, `.env*`, `.github/**`.
- **Framework-owned (replaced on update — NEVER edit):** `src/app/**`, `src/components/**`, `src/config/**`, `src/lib/**`, `src/styles/**`, `src/middleware.ts`, `mdx-components.tsx`, **`tailwind.config.ts`**.
- **Manual review:** `package.json`, `next.config.ts`, `postcss.config.mjs`, `tsconfig.json`, `.gitignore`, `eslint.config.mjs`.

Consequence: **all custom frontend code must live in user-owned paths.** Use a new folder `src/mdx/fg/` (not listed anywhere, so not synced) and export components through `src/mdx/custom-components.tsx`. Never touch `src/components`, `src/styles`, `tailwind.config.ts`, `next.config.ts`.

## Customisation hooks that exist (all user-owned)
| Hook | What it gives you |
|---|---|
| `src/mdx/custom-components.tsx` → `export const customComponents: MDXComponents = {…}` | New MDX components; override built-ins by key (`Hero`, `Card`, `Note`…). Server or client components. **[SPIKE]** `'use client'` component with `useState` rendered and hydrated. |
| `import './x.css'` inside a component under `src/mdx/` | Global CSS reaches the page **[SPIKE: rules present in the served CSS chunk]**. This is how we ship a design system. |
| `docs.json` | `theme` (`default`/`maple`/`sharp`/`minimal`), `appearance`, `background {image,imageDark,decoration}`, `fonts {body,heading}`, `navbar {links,primary,logo}`, `footer {socials,links,copyright}`, `banner`, `redirects`, `seo.indexing`, `customScripts`, `tabs`. |
| `src/data/site.ts` | `name`, `description`, `repoUrl`, `links`, `brandPresets` (light+dark token sets), `ogImage`, `analytics`, `versions`. Our custom palette goes here. |
| `public/` | Images, SVG, video, fonts, downloads, favicons (`/brand/...`). |
| `snippets/*.mdx` | Reusable MDX, imported as `import { Name } from '/snippets/name.mdx'`. |
| Page frontmatter | `mode: default | wide | center | custom | home`, `hidden`, `noindex`, `navTitle`, `keywords`, `timeEstimate`, `lastVerified`, `verifiedVersion`, `descriptionPlacement: body`. |

## Gotchas (each one cost someone time — read them)
1. **Tailwind does NOT scan `src/mdx/**` [SPIKE].** The Tailwind `content` globs are `src/app, src/components, src/content, src/data, src/config, mdx-components.tsx`. Classes written inside `src/mdx/fg/*.tsx` are never generated (`mt-[37px]` was absent from the CSS; the same class inside `src/content/*.mdx` was present). **Therefore: style custom components with your own namespaced CSS file (`.fg-*`) — not Tailwind utilities.** Using the framework's *existing* tokens as CSS variables is encouraged: `hsl(var(--thally-accent))`, `--thally-background|foreground|muted|border|card`, `--docs-bg|ink|ink-2|mute|line|line-2|accent|code-bg|surface`, radii `--theme-radius-*`. Dark mode = `.dark` ancestor.
2. **`mode: custom` removes only the article chrome [SPIKE].** The Thally shell (top bar, tabs, search, left sidebar) is still rendered around it (`.thally-docs-shell/-topbar/-sidebar/-tabs/-search`). For a full-bleed landing page, render an inline `<style>` from the page's own component that hides the sidebar for that route only (React 19 hoists/dedupes `<style>`). Those class names belong to the framework: wrap the dependency in ONE file and add a smoke test that fails loudly if they disappear.
3. **Built-in `<Hero>` caps the title at `max-w-[17ch]`** and is left-aligned small (`text-4xl`). Other candidates already replaced it with a custom component (a public write-up: cursor.thally.app). Do the same — register your own `Hero` or a new name.
4. **Images inside `<Step>`** render narrower because the component reserves space for the number rail. Use a wrapper with a negative margin at `md+`, and prefer `object-contain` for tall screenshots.
5. **No H1 in MDX bodies** (title frontmatter is the H1). One H1 only; use H2+ in the body. In `mode: custom` pages you *do* supply the single H1.
6. **Page IDs** in `docs.json` have no `src/content/` prefix and no `.mdx`. Homepage = page id `introduction`.
7. **`thally check`** (`npx --yes @thallylabs/cli@latest check`) flags orphan pages, missing `title`/`description`, thin pages, broken internal links and anchors. **`npm run build`** catches MDX/JSX errors that dev mode forgives.
8. **Fonts:** `docs.json → fonts` loads Google Fonts at build via `next/font`. In a sandbox without access to fonts.googleapis.com the build fails — that's environmental, not your code.
9. **A "successful" deployment is not proof** the live site has your revision. Compare the deployed commit and curl the live URL.
10. Scaffolder `create-thally-docs` **refuses a non-empty directory** — use `scripts/bootstrap.mjs` (tested).
11. Cloud connect: choose **Use an existing repository** once the repo already contains a Thally project; the GitHub App needs approval.

## Design tokens Thally ships (read, then do better)
`src/styles/brand.css` (HSL triples): light = warm paper `60 45% 98%`, ink `105 14% 11%`, accent `161 100% 24%` (teal-green), accent-2 iris `254 40% 55%`; dark = near-black green-tinted `120 27% 2%`, text `60 20% 92%`, accent lime `75 75% 57%` (#BAE43E-ish). The docs shell is built from hairlines + the page surface; shadows only on overlays. Fonts default Inter + JetBrains Mono (docs.thally.io itself uses Plus Jakarta Sans + Outfit).

## What NOT to reuse
Thally's logo, leaf mark, wordmark, favicon set and og fonts are Thally's brand. The repo is MIT-licensed for *code*; do not ship their marks as ours. Draw our own mark.
