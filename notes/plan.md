# Plan — JSON Server Field Guide

**Idea sentence:** On this page, `db.json` becomes a live API console you can edit.

## Reading of the brief

This is an unofficial, tested documentation site for `json-server@1.0.0-beta.15`,
built on the Thally platform. It is a portfolio piece for a Senior Developer
Experience & Documentation Engineer role. The differentiators are:

1. A live in-browser API console whose behaviour matches 91 ground-truth fixtures.
2. A verification page mapping every documented claim to a fixture.
3. Documentation craft: honest edge-case reporting, versioned facts, cross-platform.

The site must be a legitimate Thally project: `thally check` clean, `npm run build`
green, all custom code in user-owned paths, deployable by Thally Cloud.

## Risks

1. **Tailwind doesn't scan `src/mdx/`** — all custom styling must use `.fg-*` CSS.
   Proven by spike (d).
2. **`mode: custom` still shows the shell** — sidebar must be hidden via inline
   `<style>` from the component. Proven by spike (c). Framework selectors are
   fragile; centralise them in `HideShell.tsx` with a smoke check.
3. **Engine fidelity** — must exactly match 91 fixtures. Edge cases like
   `_page` beyond last returning the last page, `_per_page` alone being ignored,
   and string-vs-number FK mismatches are all recorded and must be implemented.
4. **No browser in WSL** — `inspect.mjs`/`scenes.mjs` from the design skill
   require Chrome. Will use `lint.mjs` (no browser) + manual screenshot critique.
5. **Cross-platform** — documentation must include PowerShell equivalents.
   `pwsh` is not in WSL; PowerShell blocks will be marked as not-executed.
6. **`scripts/` has framework-owned files** — our scripts must use unique names
   like `scripts/fg-record-fixtures.mjs`.
7. **Scaffold overwrites LICENSE** — confirmed; must restore after bootstrap.
