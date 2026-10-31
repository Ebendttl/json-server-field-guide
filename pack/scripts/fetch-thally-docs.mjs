#!/usr/bin/env node
/**
 * Saves the Thally docs pages used for this project as Markdown into context/thally-docs/.
 * Thally runtimes serve any page as Markdown at "<url>.md" (verified on a local runtime);
 * if that 404s we retry the page URL with an "Accept: text/markdown" header.
 *   node pack/scripts/fetch-thally-docs.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'context', 'thally-docs')
const BASE = 'https://docs.thally.io'
const PAGES = ['quickstart','guides/writing-content','guides/frontmatter-reference','guides/project-structure',
  'guides/content-types','guides/configuring-navigation','guides/branding-and-theming','guides/page-modes',
  'guides/navbar-and-footer','guides/custom-fonts','guides/images-and-files','guides/ci-checks',
  'guides/preview-locally','guides/seo-and-visibility','guides/og-images','guides/custom-404','guides/ai-coding-agents']
mkdirSync(OUT, { recursive: true })
for (const p of PAGES) {
  let res = await fetch(`${BASE}/${p}.md`)
  if (!res.ok || !(res.headers.get('content-type') || '').includes('markdown'))
    res = await fetch(`${BASE}/${p}`, { headers: { Accept: 'text/markdown' } })
  const text = await res.text()
  const ok = res.ok && !text.trimStart().startsWith('<!DOCTYPE')
  if (ok) writeFileSync(join(OUT, `${p.replaceAll('/', '__')}.md`), text)
  console.log(ok ? 'saved  ' : 'FAILED ', p)
}
