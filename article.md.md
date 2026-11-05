# Build a tested documentation site with Thally: what I did, and what broke

I built the [JSON Server Field Guide](https://github.com/Ebendttl/json-server-field-guide), an unofficial guide to `json-server@1.0.0-beta.15`, with Thally. This article walks through how to build a similar site, and includes the obstacles I hit and how I got past them.

What you will end up with: a Thally docs project with a quickstart, a how-to guide, a verification page, and one custom component, all passing `thally check` and `npm run build`.

## Prerequisites

- Node.js 22.14 or newer (check with `node -v`). I used 22.23.4 through nvm. The tool I documented needs 22.12 or newer, so 22.14 covers both.
- Git and a GitHub account.
- A small open-source tool you have actually used. Choose one with a command you can run and check.

## 1. Scaffold the project

```bash
npx --yes create-thally-docs@latest my-docs --yes --install
cd my-docs
npm run dev
```

The dev server runs at `http://localhost:3040`.

**Obstacle: the scaffolder refuses a non-empty directory.** I had already created and cloned a GitHub repo, so `create-thally-docs` would not run inside it. I scaffolded into a temporary folder and copied the result into the repo, excluding `.git`. If you start from the scaffold folder and push it to a new repo, you avoid this.

## 2. Know which files are yours

Thally separates files you own from files the framework owns. `starter-release.json` in the project root lists them. The ones you edit are `src/content/**`, `docs.json`, `src/data/site.ts`, `src/mdx/custom-components.tsx`, `public/**`, `README.md` and `AGENTS.md`. Framework-owned paths such as `src/components`, `src/styles` and `tailwind.config.ts` get replaced on update, so do not edit them. Put custom code in a new folder inside a path you own. I used `src/mdx/fg/`.

## 3. Configure the site

Open `docs.json` and `src/data/site.ts`.

- In `docs.json`, define the navigation as groups of page ids (a page id is the file path under `src/content` without `.mdx`). Mine has "Get started" (introduction, quickstart), "Guides" and "Reference".
- Set the theme, fonts, favicon and navbar links there too.
- In `site.ts`, set `name`, `description` and `repoUrl`. A real `repoUrl` turns on "Edit this page" and "Report an issue".

Delete the starter pages and every starter navigation entry. `thally check` reports nav entries that point at missing files.

## 4. Write content readers can verify

Pages are MDX files with `title` and `description` frontmatter and no H1 in the body. Thally's own guidance, which I followed, is: one reader intent per page, the outcome in the first paragraph, prerequisites before steps, and a way for the reader to confirm each step worked.

The part that mattered most to me was accuracy. For a beta tool, my memory of how it behaves was wrong in several places. So I wrote a script that starts the real server, sends a fixed set of 91 requests, and saves the responses to `fixtures.json`. I recorded each scenario three times and kept a step only if every run matched. Then I corrected the docs to match the recordings. Examples of what the recordings corrected:

- `?_limit=1` returns `[]` in this version, not one record.
- A `POST` that includes an `id` gets a generated id instead.
- Repeating a query parameter keeps only the last value.

A `Verification` page maps each claim to its fixture, so a reader can check it.

## 5. Add a custom component

Export components from `src/mdx/custom-components.tsx` and use them in MDX. Two pitfalls cost me time:

1. **Tailwind does not scan `src/mdx/`.** Its content globs cover `src/content`, `src/components` and a few other folders, so utility classes written inside `src/mdx/` produce no CSS. I wrote plain namespaced CSS (`.fg-*`) in a file imported by the component, and used Thally's CSS variables such as `hsl(var(--thally-accent))` so light and dark mode still work.
2. **`mode: custom` removes the article chrome, but the sidebar and tabs stay.** For a full-width landing page I hid them with a small route-scoped `<style>`. Those class names belong to the framework, so I kept every selector in one file.

I also wrote a dependency-free TypeScript engine that reproduces the recorded responses in the browser, and a test file that replays all 91 recorded requests against it with `node:test`. Writing a test like that is optional, but it is what let me trust the interactive console.

## 6. Check before you publish

```bash
npx --yes @thallylabs/cli@latest check
npm run build
```

`check` finds broken links, missing frontmatter and orphan pages. `build` finds MDX errors the dev server tolerates. Run both every time. I also ran Lighthouse on the production build: 93 performance, 100 accessibility, 100 best practices and 100 SEO on mobile.

## 7. Publish

In Thally Cloud, create a site, choose **Use an existing repository**, install the Thally GitHub App for that one repo, set the production branch to `main` and the docs directory to `/`, then publish. Every push to `main` redeploys.

**Obstacle I did not resolve: publishing failed.** Two deployments, on different commits and about 14 hours apart, stopped before any build ran:

```
Stage: provisioning
Error: managed_runtime_unavailable
```

The dashboard showed "A Thally service stopped this update before it could go live", and "Detailed error information isn't available for this attempt". Locally, `check` reported 0 errors and the build passed, and Thally accepted the repository, so I believe this is on the platform side, though I cannot prove it from my view. I checked my repo for a cause (valid `docs.json`, untouched `starter-release.json`, clean `check` and build) and found none. Redeploying did not change the result. I reported both deployment ids to Thally and am waiting for an answer.

If you hit the same error: confirm `check` and `build` pass locally, confirm the repo, branch and directory under Site settings → Git, retry once, then report it with the deployment id.

## Summary

1. Scaffold, and learn which files you own.
2. Replace the starter content and navigation.
3. Write pages for one reader intent each, and verify claims against the real tool.
4. Keep custom code in owned paths with its own CSS.
5. Run `check` and `build` before every push.
6. Publish with Thally Cloud, and keep the deployment id if something fails.

Source: https://github.com/Ebendttl/json-server-field-guide
