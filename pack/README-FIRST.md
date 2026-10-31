# Launch checklist (Windows 11 · PowerShell)

You only do these steps. Antigravity does the rest.

1. **Create the GitHub repo** — name: `json-server-field-guide`, **Public**, add a README (so it can be cloned), no template. Description: *Unofficial, tested field guide to JSON Server, built with Thally.*
2. **Clone it and enter it**
   ```powershell
   git clone https://github.com/<your-username>/json-server-field-guide.git
   cd json-server-field-guide
   ```
3. **Unzip this pack** so it becomes the folder `pack\` inside the repo (you should see `pack\ANTIGRAVITY-PROMPT.md`).
4. **Install the taste skill** (from the repo root):
   ```powershell
   npx skills add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend"
   ```
   Requirements: Node 22.12+ (`node -v`) and Chrome, Edge or Chromium installed.
5. *(Optional, makes Antigravity more accurate)* save the raw Thally docs locally:
   ```powershell
   node pack\scripts\fetch-thally-docs.mjs
   ```
6. **Open the repo folder in Antigravity**, start a new agent conversation in **Planning** mode, and **paste everything below the line in `pack\ANTIGRAVITY-PROMPT.md`**. Also @-mention these files so they are in context from the first turn:
   `pack/context/01-thally-runtime-findings.md`, `pack/context/02-design-brief.md`, `pack/context/03-json-server-verified-facts.md`, `pack/context/04-thally-docs-digest.md`.
7. Approve the plan. When Antigravity reports done, **review the screenshots it lists yourself**, then follow `notes/handoff.md` it writes (publish in Thally Cloud → *Use an existing repository*).

## What is in the pack
| Path | Purpose |
|---|---|
| `ANTIGRAVITY-PROMPT.md` | The master prompt |
| `context/01…04-*.md` | Thally runtime findings (read from the real repo + spiked), design brief, json-server ground truth, docs digest |
| `context/fixtures.json` | 91 real request/response pairs recorded from `json-server@1.0.0-beta.15` |
| `seed/` | Verified draft pages + datasets |
| `scripts/bootstrap.mjs` | Scaffolds Thally into your non-empty clone (tested) |
| `scripts/record-fixtures.mjs` | Re-records ground truth against the real server |
| `scripts/fetch-thally-docs.mjs` | Downloads the key Thally docs pages as Markdown |

## Docs worth attaching vs. not
Attach/@-mention the four `context` files (they replace reading all 24 pages). Raw pages worth having on disk (step 5 fetches them): quickstart, writing-content, frontmatter-reference, project-structure, content-types, configuring-navigation, branding-and-theming, page-modes, navbar-and-footer, custom-fonts, images-and-files, ci-checks, preview-locally, seo-and-visibility, og-images, custom-404, ai-coding-agents. Skip: multi-language, redirects, site-banner, custom-scripts, reusable-snippets, cli-overview, mcp-overview (not needed for this build).
