# 04 · Digest of the 24 Thally docs pages (docs.thally.io)

Condensed from the pages listed in the brief. For raw text run `node scripts/fetch-thally-docs.mjs` → `context/thally-docs/*.md`. Always prefer the raw page when exact syntax matters.

## Commands (use the long form — no local `thally` binary is installed)
```bash
npm run dev                                   # http://localhost:3040 (next free port if busy)
npx --yes @thallylabs/cli@latest check        # lint content/nav/links/anchors; --ci . ; --fix adds orphans; --external HEAD-checks links
npm run build                                 # production build; catches MDX errors dev tolerates
npx --yes @thallylabs/cli@latest new guides/x --title "X"   # creates MDX + registers in docs.json
jq empty docs.json                            # JSON sanity
```
Node: site needs ≥ 22.14 (or 24+; 20.19+ also supported). Scaffold: `npx --yes create-thally-docs@latest <dir> --yes --install` (refuses non-empty dir).

## Pages (MDX in `src/content/`, path = URL; `introduction` = homepage)
Frontmatter — required: `title`, `description`. Optional: `navTitle`, `badge`, `keywords[]`, `timeEstimate`, `lastUpdated`, `lastVerified`, `verifiedVersion`, `openapi`, `descriptionPlacement: body`, `hidden`, `noindex`, `mode: default|wide|center|custom|home`. **No H1 in body.** Heading permalinks h2–h6 (custom id via `<h2 id="x">`). Images in `public/` (`/images/…`), meaningful alt text, `<Frame caption zoom={false}>`; downloads in `public/downloads/`.

Built-in components: `Note` (types info|warning|danger|tip, also `<Info> <Warning> <Check> <Danger> <Tip>`), `Steps/Step`, `Tabs/Tab`, `CardGroup cols/Card title href icon`, `Columns/Column`, `Accordion/AccordionGroup`, `Frame`, `Video/YouTube`, `Badge`, `Update`, `Panel`, `Tile/TileGroup`, `Prompt/PromptUser/PromptAssistant`, `Terminal/TerminalInput/TerminalOutput`, `AgentPrompt`, `Tree/Folder/File`, `Mermaid`, `Latex`, `ParamField/ResponseField/Expandable`, `RequestExample/ResponseExample`, `View`, `GitHub`, `Visibility/Human/Agent`, `Banner`, `Tooltip`, `Icon`, `Color`, `CodeGroup`. Card/group icons (guide docs list): `book-open code-simple grid-round link-simple wrench party-horn telegram envelope x-twitter message` (runtime also resolves other names such as `refresh-cw`).

Snippets: `snippets/name.mdx` → `import { Name } from '/snippets/name.mdx'` then `<Name />` (PascalCase of file name).

## docs.json (navigation + features)
```json
{ "theme":"sharp",
  "appearance":{"default":"dark","showToggle":true,"contentIcons":"neutral"},
  "background":{"image":"/images/bg.webp","imageDark":"/images/bg-dark.webp","decoration":"grid"},
  "fonts":{"body":{"family":"Inter","weight":["400","500","600","700"]},"heading":{"family":"Outfit","weight":["600","700"]}},
  "favicon":{"light":"/brand/favicon-light.svg","dark":"/brand/favicon-dark.svg"},
  "navbar":{"logo":{"light":"/brand/logo-light.svg","dark":"/brand/logo-dark.svg","showTitle":true,"rightText":"Field Guide"},
            "links":[{"label":"GitHub","href":"https://github.com/…","type":"github"}],"primary":{"label":"Get started","href":"/quickstart"}},
  "footer":{"copyright":"© {year} …","socials":{"github":"…"},"links":[{"heading":"Docs","items":[{"label":"Quickstart","href":"/quickstart"}]}]},
  "banner":{"content":"text [link](/x)","dismissible":true},
  "redirects":[{"source":"/old","destination":"/new","permanent":true}],
  "seo":{"indexing":"navigable"},
  "customScripts":[{"src":"https://…","strategy":"afterInteractive"}],
  "tabs":[{"tab":"Docs","groups":[{"group":"Start here","icon":"book-open","pages":["introduction","quickstart",{"group":"Nested","pages":["x"]}]}]}] }
```
Group/tab `hidden:true` hides from nav but keeps URL. Link tab: `{ "tab":"Changelog","href":"/changelog" }`. Themes: `default` (1rem radius), `maple` (large, warm), `sharp` (0.25rem, technical), `minimal` (0 radius). Logo/favicon paths must be inside `public/`; no external URLs/query strings/traversal. Fonts: any Google Font, exact family spelling. OG images: dynamic 1200×630 via `/api/og`; configure `siteConfig.ogImage {backgroundStart,backgroundEnd,accent,titleColor,descriptionColor,groupColor,domain,logoText,fontFamily,fontWeight}`; set `THALLY_SITE_URL` in hosting env.

`site.ts`: `siteConfig { name, description, repoUrl, links[], brand, brandPreset:'primary'|'secondary', brandPresets{light,dark}, ogImage?, analytics?, versions? }`. Palette tokens per mode: `background card foreground muted mutedForeground border accent accentForeground accent2 accent2Foreground input sidebar ring sidebarActiveBg sidebarActiveText` (hex or HSL strings; sidebar-active may be `'H S% L% / a'`). `repoUrl` pointing at a real GitHub repo enables "Edit this page"/"Report an issue".

## Page modes
`default` (content + TOC) · `wide` (no TOC) · `center` (single narrow column) · `custom` (no article chrome; shell remains — spiked) · `home` (no breadcrumbs/TOC; hero + cards).

## Content strategy (Thally's own checklist — graders wrote this)
Tutorial (Quickstart: a complete first result) · How-to (verb-named, ordered: result → prerequisites → shortest procedure → verify → failures → next) · Concept · Reference (tables) · Changelog. Page checklist: one reader intent; outcome in first paragraph; prerequisites before steps; reader can verify success; examples real and copyable; link next task instead of repeating.

## Project structure
`src/content/` pages · `docs.json` · `src/data/site.ts` · `public/` · `snippets/` · `openapi.yaml` (optional) · `src/mdx/custom-components.tsx`. Framework internals are off limits (see 01).

## CI
`check` flags: orphans (warn), thin pages (warn), missing title/description, nav entries without a file, broken internal links/anchors, bad OpenAPI. External links skipped unless `--external`. New projects ship `.github/workflows/` + pinned tooling (`.github/thally-tooling`) running `thally check --ci .` on PRs.

## Agents
Local MCP: `claude mcp add thally -- npx -y @thallylabs/mcp` (15 tools: `create_project add_page update_page add_tab list_pages read_page search_docs get_context migrate_docs import_docs translate_docs lint_project semantic_search agent_readiness sync_from_repo`; pass absolute `projectDir`). Deployed read-only MCP: `<site>/api/mcp` (4 tools). Project rules go in `AGENTS.md`. Docs agent prompt convention: read AGENTS.md, docs.json, package.json, site.ts → inspect evidence → write → run check + build → report outcome/files/evidence/commands.

## Cloud (Thally Cloud, app.thally.io)
Create site → name, description, `thally.app` slug → **Create a new docs repository** (GitHub App, "All repositories") or **Use an existing repository** (must already be a Thally project) → Product sources: "I'll do this later" → Publish site → wait for **Live**. 7-day one-time trial starts at first sign-in. Push to production branch → managed deploy; verify the deployed commit.
