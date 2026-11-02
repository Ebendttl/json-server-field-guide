# Friction log — JSON Server Field Guide

Real obstacles encountered while using the Thally platform.

## 2026-10-31 — Phase 0: Scaffold and spikes

- **LICENSE overwritten by scaffold.** `create-thally-docs` copies its own MIT
  LICENSE (Copyright Thally) over the user's existing LICENSE. Had to restore
  manually. The file is in `userOwnedNeverOverwrite` in `starter-release.json`,
  but the initial scaffold doesn't honour that — it copies everything from the
  template. _Workaround: save LICENSE content before running `bootstrap.mjs`,
  restore after._

- **`npm install` tar errors for `next/dist`.** First `npm install` produced
  ~40 `TAR_ENTRY_ERROR ENOENT` warnings for `node_modules/next/dist` and failed
  to create `node_modules/.bin/next`. The `postinstall` script (`tsx ...`)
  succeeded because `tsx` was installed, but `next` binary was missing. Had to
  `rm -rf node_modules/next && npm install next@16.4.1` to fix. Root cause
  likely a race condition or npm cache issue on WSL. _Workaround: verify
  `node_modules/.bin/next` exists after install; if not, reinstall the `next`
  package alone._

- **nvm PATH not inherited by npm scripts.** When using `nvm use 22` in a
  non-interactive shell, npm's child processes (which run under `sh`) don't
  inherit the nvm PATH additions. `npm run dev` fails with `sh: 1: next: not
  found` or `sh: 1: tsx: not found` even though both are in `node_modules/.bin/`.
  _Workaround: prefix commands with
  `export PATH="/home/user/.nvm/versions/node/v22.23.4/bin:$PATH"`._

- **No differences found from `01-thally-runtime-findings.md`.** All four
  spikes matched the documented behaviour exactly:
  - (a) Client component with `'use client'` and `useState` rendered and
    hydrated via `custom-components.tsx`. ✓
  - (b) CSS imported from `src/mdx/fg/spike.css` (`.fg-spike` class) appeared
    in the served CSS chunk. ✓
  - (c) `mode: custom` removed article chrome but left the shell. Inline
    `<style>` hiding `.thally-docs-sidebar` and `.thally-docs-tabs` worked. ✓
  - (d) Tailwind class `mt-[37px]` used only in `src/mdx/fg/SpikeTest.tsx` was
    present in CSS only because it was also used in `src/content/introduction.mdx`
    (which IS scanned). Confirms Tailwind does not scan `src/mdx/`. ✓
    (This spike was already proven in 01; ran quickly to confirm.)

- **`starter-release.json` ownership lists differ slightly from 01.** The
  actual file also lists `src/cloud/**`, `src/data/api-reference.ts`,
  `src/data/docs.ts`, `src/data/get-doc.ts`, `src/data/manual-api.ts`,
  `src/mdx/rehype.ts`, `src/mdx/remark.ts`, `src/mdx/smart-quotes.ts`,
  `src/mdx/snippet-registry.ts`, `src/test/**`, and several `scripts/*`
  files as framework-sync-eligible. Also, `open-next.config.ts` and
  `wrangler.jsonc` are in `userOwnedNeverOverwrite`. The `scripts/` directory
  is NOT listed as user-owned — framework files live there. Our scripts must
  use unique names (e.g. `scripts/fg-record-fixtures.mjs`) and never edit
  existing framework scripts.

- **`notes/` and `scripts/` are not explicitly user-owned.** Neither appears in
  `userOwnedNeverOverwrite`. `scripts/` has framework-owned files. `notes/` is
  new and unmanaged — safe to use. For `scripts/`, we use `fg-` prefixed names.

## 2026-10-31 — Phase 1: Content and verification

- **`404.mdx` orphan warning in `thally check`.** Creating `src/content/404.mdx`
  triggered an orphan warning because it was not listed in `docs.json` nav.
  Resolved by adding `hidden: true` to frontmatter per CLI logic.

## 2026-10-31 — Phase 2: Engine and verification tooling

- **`package.json` requires manual review during framework updates.**
  `package.json` is neither in `userOwnedNeverOverwrite` nor `frameworkSyncEligible`.
  Adding project scripts (`test:engine`, `verify:fixtures`) requires manual review
  and conflict resolution whenever running `npm run starter:update`.
