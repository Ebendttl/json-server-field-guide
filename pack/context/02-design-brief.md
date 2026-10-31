# 02 · Design brief — "JSON Server Field Guide"

Goal: a documentation site that makes a hiring panel at a docs-tooling company stop scrolling — while staying a **legitimate, maintainable Thally project** (all custom code in user-owned paths, `thally check` clean, `npm run build` green).

## The idea (taste-skill step 4)
> On this page, **`db.json`** becomes **a live API console you can edit.**

The thing JSON Server *is* — one file turning into endpoints — is the hero. The visitor edits JSON on the left; the endpoint list, a request line and the real response update on the right. This is the skill's "product performs" direction and its "one live thing". Competitor test: swap in any other mock-server tool and the sentence stops working, because no other tool's *file is the API*.

## Direction (pre-decided; confirm with the dealer)
`node <skill>/scripts/draw.mjs --sector dev-tool --brief "Unofficial field guide for JSON Server: the JSON file becomes a live REST API" --sections how-it-works,showcase,list,faq,cta,footer --tone technical --have product-ui --options 3` dealt three: `type-only-statement`, `dense-tiles`, **`product-performs`**. Adopt **`product-performs`** (re-run the dealer with `--direction product-performs`; record its seed in the report). Do not blend it with other layouts.

## The competitive reality
Other applicants to the same role are publishing Thally sites right now (public write-ups: a Cursor guide at cursor.thally.app that swapped the Hero and picked the `sharp` theme; a Mastra rebuild that edited the starter content). Re-theming + a swapped Hero is the *floor*. We win on: (1) a working in-browser console, (2) **claims proven by ground-truth fixtures**, (3) documentation craft (verification page, versioned facts, honest quirks), (4) visual finish.

## What to take from thally.io (screenshots attached) — grammar, not ornament
Take: near-black ink canvas with a warm off-white light mode; **one dominant "system" object in the hero** (their connector graph: tracked repo → Thally → surfaces) — ours is file → endpoints; tight-tracked heavy sans headline, left-aligned; large-radius stage container for the hero; real product-UI fragments as imagery (their mini-UI tiles); a single lime-ish accent used sparingly; confident empty space; a partner/"works with" row (ours: tools that consume REST — curl, fetch, Postman, Bruno, React Query — **text only, no logos we don't own**).
Do NOT take: the glass floating pill nav, the green streak/gradient background, mono micro-caps eyebrows, hairline-grid decorations, their leaf mark/wordmark, their copy.
**Conflict rule:** the taste skill's house rules (no eyebrows, no mono outside code, no gradients/glows, no pill badges, no icon-card rows, no index numbering, no thin-rule decoration, ≤8 moving elements floor, ≥4 real pictures) **win** over copying thally.io. Where the Thally docs shell already uses hairlines (it does, in the sidebar/code blocks), leave the shell alone — the skill's rules apply to *our* surfaces.

## Where the skill applies and where it can't
- **Landing (`/`)**: full skill run (page). `mode: custom`, own H1, own sections, own CSS.
- **Docs pages** (quickstart, guide, verification): rendered by Thally's shell — we do **not** restyle the shell. We improve them through (a) `brandPresets` tokens in `site.ts` (palette + both modes), (b) `docs.json` fonts + `theme`, (c) a small set of custom MDX components, and (d) tasteful overrides of built-ins *by key* (`Note`, `Steps`…) only if a spike proves it safe.
- The skill's inspector (`inspect.mjs`) is for the landing page + any custom full pages. Docs pages are judged by screenshot critique only.
- The skill's **"no fake dashboards / no invented proof"** rules apply: no fake logos, quotes, stars, download numbers. Everything on the page is either real or derived from fixtures.

## Palette & type (decide after the dealer; constraints)
- Dark-first ink ground (near-black, slightly green/blue-neutral) + a warm off-white light mode. One ink, **one accent** (a clean electric lime/acid-green *or* a signal amber — pick by contrast tests, not taste; ≥ 4.5:1 for text, ≥ 3:1 for UI). **No violet/indigo.** Accent only on primary action, the active endpoint and the success status chip.
- Method colours in the console (GET/POST/PATCH/DELETE) must not rely on colour alone — pair with the word.
- Type: one family for text (e.g. a characterful grotesk loaded via `docs.json → fonts`, must be a Google Font) + Thally's built-in code font. Headline 4–6vw per the direction; ≤ 2 lines at every width. Tracking −0.02…−0.04em on display sizes.
- Implement as CSS variables derived from `hsl(var(--thally-*))` where possible so light/dark follows Thally's toggle; put our palette in `brandPresets.primary` so the shell and the landing agree.

## Landing sections (argument → proof; delete anything without a claim)
1. **Hero (H1 ≤ 2 lines, e.g. "Your JSON file is already an API.")** + one sentence + one button ("Open the quickstart") + **the live console at actual size**. Left: editable `db.json` (3 presets: Posts, Tasks, Empty). Right: derived endpoint list + request builder + response (status chip, timing is *not* faked — omit timing).
2. **How the file becomes the API** — a scroll-driven walk: one key becomes a route; arrays vs objects; ids; writes persisting back to the file (animate the file text changing). Scene-style, built from the same engine, not a video.
3. **Query it** — the console in "recipes" mode: filter, sort, paginate, embed — 6 chips that fill the request line and show the *real recorded* response shape; the quirk rows ("`?_limit` returns `[]` in beta.15") appear as honest annotations. This is the section no other candidate has.
4. **The sharp edges (verified)** — a short list of beta.15 behaviours that differ from 0.x, each linking to the exact fixture. Differentiator: honest, tested documentation.
5. **Where to go next** — three large doors (Quickstart · Build a mock API · How this was verified) as a tile board, different composition from section 3.
6. **Footer = designed close**: giant name; links: GitHub repo, JSON Server upstream, `/llms.txt`, `/api/mcp` (real Thally endpoints), "Unofficial — not affiliated with the JSON Server project", credits.

## The live console — engineering requirements
- Pure client-side. **No backend.** Engine is a small, dependency-free TS module (`src/mdx/fg/engine.ts`) implementing exactly the verified behaviour: routing, string-id normalisation, filters/operators, `_sort`, `_page/_per_page` envelope, `_embed`, writes with generated ids, 404 body, 201 on POST, singleton objects.
- **Conformance tests are mandatory:** `src/mdx/fg/engine.test.ts` replays `fixtures.json` (copy to `src/mdx/fg/fixtures.json`) scenario by scenario and asserts status + body equality (generated ids matched by pattern). Run with `npx tsx --test src/mdx/fg/engine.test.ts` (tsx already in devDependencies). Any request *outside* the verified matrix must render a visible "Outside the 91 verified requests — run it with real json-server to be sure" note instead of guessing.
- Accessible: every control keyboard-operable, labelled; the response area is an `aria-live="polite"` region; works with reduced motion; plain `<noscript>` fallback showing the recorded quickstart response in a `<pre>`.
- Works at 390px with a thumb: stack editor over console; endpoint chips scroll horizontally; no hover-only controls.
- Also export two small MDX components for docs pages: `<TryIt request="/tasks?status=open" dataset="tasks" />` (a read-only mini console that prints the recorded response) and `<Verified fixture="tasks-filter-sort#6" />` (a badge linking to the fixture). Use them in the Quickstart and the guide so docs pages *show* real output.

## Imagery
Skill floor: ≥ 4 real pictures. Software shows its own interface: the console, terminal fragments (HTML), and **cropped real fragments** (the terminal banner from `npx json-server`, real `db.json` diff). Draw one original mark (a `{}` made from two offset curly braces forming a plug, SVG) — **original; not Thally's, not JSON Server's**. If the skill's `assets.mjs` is used, credit every found image in the footer.

## Motion budget
≥ 8 moving elements on load/scroll (skill gate), transform/opacity only, staggered section entrances (heading → text → picture, 60–90 ms), feedback on every control, `prefers-reduced-motion` fallbacks. The signature move: the JSON editor keystroke → endpoint list reflow (keep under 100 ms).

## Accessibility & performance gates
Lighthouse (the repo ships `lighthouserc.json`): performance ≥ 90 mobile on the landing page, accessibility 100, SEO 100. Landing JS ≤ ~60 kB gz for our code (no heavy deps: no Monaco/CodeMirror; use a `<textarea>` with syntax tint via a mirrored `<pre>`, or `contenteditable` — decide with a11y in mind; a textarea is the safe default).

## Brand / legal
Unofficial guide disclaimer on the landing page, intro and README. MIT attribution for JSON Server linked. No claims of affiliation. No Thally or JSON Server logos.
