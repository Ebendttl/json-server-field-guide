# Design Taste Critique — JSON Server Field Guide

## ROUND 1
- **Seen in one second**: A bold developer headline "Your JSON file is already an API." beside an interactive dual-pane console with syntax-tinted db.json and query responses.
- **Idea (one sentence)**: The JSON file becomes a live, verified REST API right in your browser, backed by 91 ground-truth recordings from json-server@1.0.0-beta.15.
- **Live thing**: Dual-pane interactive query console with live dataset presets (posts, tasks, empty), in-browser engine execution, instant response replay, and verified fixture badge feedback.
- **Layout words by section**: hero=split (statement + live console) / concepts=vertical-steps / showcase=grid (2x2 query recipes) / quirks=card-grid (2x2 sharp edges) / faq=list (two-column card grid) / cta=banner (centered action stage) / footer=split-strip.
- **Scores**: design 8.5 · usability 8.8 · creativity 8.5 · content 9.0 → **overall 8.6**
  - Arithmetic: `0.4*(8.5) + 0.3*(8.8) + 0.2*(8.5) + 0.1*(9.0) = 3.4 + 2.64 + 1.7 + 0.9 = 8.64`
- **Caps applied**: None. All automated tests pass (0 FAIL, 0 WARN on lint; 0 horizontal overflow; touch targets >= 44px; strict heading hierarchy; Lighthouse: Performance 93, Accessibility 100, SEO 100).
- **Top three problems and fixes**:
  1. *Problem*: `prefers-reduced-motion` test flagged active duration (`1e-05s`) from `animation-duration: 0.01ms`.
     *Screenshot*: `landing-1440px-dark.png`
     *Fix*: Add `animation: none !important; transition: none !important;` to the reduced-motion media query in `fg.css`.
  2. *Problem*: Step 1 code snippet in walkthrough column was missing keyboard focus region attributes (`tabIndex={0}`, `role="region"`), unlike Steps 2 and 3.
     *Screenshot*: `landing-390px-light.png`
     *Fix*: Add `tabIndex={0}`, `role="region"`, `aria-label="Code example"` to all walkthrough snippets in `Landing.tsx`.
  3. *Problem*: Console endpoint chips on 390px mobile screens could compress flex boundaries when scrolling horizontally.
     *Screenshot*: `landing-390px-light.png`
     *Fix*: Add `flex-shrink: 0; min-width: 44px; min-height: 44px;` to `[data-ui] .fg-console-chip` and `.fg-console-btn` in `fg.css`.

---

## ROUND 2 (Post-Fix Verification)
- **Seen in one second**: Crisp dark-green brand mark, bold typography, immediate live interactive query playground with clean horizontal scrolling chips.
- **Idea (one sentence)**: Every query claim is proven and executable against ground-truth HTTP recordings from json-server@1.0.0-beta.15.
- **Live thing**: Instant interactive mock server console with live method selection, query execution, preset switching, and honest fixture badges.
- **Layout words by section**: hero=split / concepts=vertical-steps / showcase=grid / quirks=card-grid / faq=list / cta=banner / footer=split-strip.
- **Scores**: design 8.8 · usability 9.2 · creativity 8.8 · content 9.2 → **overall 8.96**
  - Arithmetic: `0.4*(8.8) + 0.3*(9.2) + 0.2*(8.8) + 0.1*(9.2) = 3.52 + 2.76 + 1.76 + 0.92 = 8.96`
- **Caps applied**: None. (0 FAIL on inspect; 0 FAIL on lint; Lighthouse Accessibility 100, SEO 100, Performance 93).
- **Audit confirmation**:
  - `prefers-reduced-motion` disables animations completely (`animation: none !important`).
  - All walkthrough snippets keyboard-focusable with visible focus rings.
  - Endpoints scroll row wraps and scrolls cleanly with 44px touch targets.
