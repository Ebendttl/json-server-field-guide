#!/usr/bin/env node
/**
 * Scaffold a Thally project INTO the current (already-cloned, non-empty) repository.
 * create-thally-docs refuses non-empty folders, so we scaffold to a temp folder and copy.
 * Cross-platform (Windows / macOS / Linux). Run from the repository root:
 *
 *   node scripts/bootstrap.mjs
 *   npm install
 */
import { execFileSync } from 'node:child_process'
import { cpSync, mkdtempSync, existsSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, basename } from 'node:path'

const repo = process.cwd()
if (existsSync(join(repo, 'docs.json'))) {
  console.log('docs.json already exists - this repository is already a Thally project. Nothing to do.')
  process.exit(0)
}
const tmp = mkdtempSync(join(tmpdir(), 'jsfg-scaffold-'))
const site = join(tmp, 'site')
const isWin = process.platform === 'win32'
console.log('Scaffolding the Thally starter into', site)
execFileSync(isWin ? 'npx.cmd' : 'npx', ['--yes', 'create-thally-docs@latest', site, '--yes', '--no-install'], {
  stdio: 'inherit',
  shell: isWin,
})
cpSync(site, repo, { recursive: true, force: true, filter: (src) => basename(src) !== '.git' })
rmSync(tmp, { recursive: true, force: true })
console.log('\nDone. Next: npm install')
