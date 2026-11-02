#!/usr/bin/env node
/**
 * Records GROUND-TRUTH responses from the real json-server@1.0.0-beta.15.
 *
 *   node scripts/fg-record-fixtures.mjs            -> writes src/mdx/fg/fixtures.json
 *   node scripts/fg-record-fixtures.mjs --out x.json
 *
 * Requires Node >= 22.12 and network access to install json-server into a temp dir.
 * Each scenario is recorded 3 times in fresh temporary directories with a 250 ms wait
 * after every write before the next request. A step is verified only if all 3 runs
 * yield identical status and body. Any step that varies across runs is marked unstable: true.
 */
import { spawn, execFileSync } from 'node:child_process'
import { mkdtempSync, writeFileSync, readFileSync, mkdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'

const VERSION = '1.0.0-beta.15'
const RUNS_COUNT = 3
const WRITE_DELAY_MS = 250

const out = process.argv.includes('--out')
  ? process.argv[process.argv.indexOf('--out') + 1]
  : 'src/mdx/fg/fixtures.json'

const DATASETS = {
  quickstart: {
    posts: [
      { id: '1', title: 'Hello JSON Server', views: 100, authorId: '1' },
      { id: '2', title: 'Filtering and sorting', views: 250, authorId: '1' },
      { id: '3', title: 'Pagination basics', views: 40, authorId: '2' },
    ],
    authors: [
      { id: '1', name: 'Ada' },
      { id: '2', name: 'Linus' },
    ],
    profile: { name: 'demo' },
  },
  tasks: {
    projects: [
      { id: '1', name: 'Website relaunch' },
      { id: '2', name: 'Mobile app' },
    ],
    tasks: [
      { id: '1', title: 'Draft homepage copy', status: 'open', priority: 2, projectId: '1' },
      { id: '2', title: 'Design navigation', status: 'done', priority: 3, projectId: '1' },
      { id: '3', title: 'Set up CI', status: 'open', priority: 3, projectId: '2' },
      { id: '4', title: 'Write release notes', status: 'open', priority: 1, projectId: '2' },
      { id: '5', title: 'Fix login bug', status: 'blocked', priority: 3, projectId: '2' },
    ],
  },
}

const J = { 'Content-Type': 'application/json' }
const reads = (paths) => paths.map((path) => ({ method: 'GET', path }))

const SCENARIOS = [
  {
    id: 'quickstart-reads', dataset: 'quickstart',
    steps: reads([
      '/posts', '/posts/1', '/posts/999', '/authors', '/authors/2', '/profile',
      '/posts?views:gt=100', '/posts?_sort=-views', '/posts?_sort=views',
      '/posts?_page=1&_per_page=2', '/posts/1?_embed=author', '/authors/1?_embed=posts',
      '/posts?title=Hello%20JSON%20Server', '/nope',
    ]),
  },
  {
    id: 'quickstart-write', dataset: 'quickstart',
    steps: [
      { method: 'POST', path: '/posts', body: { title: 'My first post', views: 0, authorId: '2' } },
      { method: 'PATCH', path: '/posts/1', body: { views: 101 } },
      { method: 'GET', path: '/posts' },
      { method: 'DELETE', path: '/posts/3' },
      { method: 'GET', path: '/posts/3' },
      { method: 'PUT', path: '/posts/2', body: { title: 'Replaced', views: 1, authorId: '1' } },
      { method: 'PATCH', path: '/profile', body: { name: 'renamed' } },
      { method: 'GET', path: '/profile' },
      { method: 'PATCH', path: '/posts/999', body: { views: 1 } },
      { method: 'DELETE', path: '/posts/999' },
    ],
  },
  {
    id: 'tasks-filter-sort', dataset: 'tasks',
    steps: reads([
      '/tasks', '/tasks/3', '/tasks/999', '/projects', '/projects/1',
      '/tasks?status=open', '/tasks?status=open&priority:gte=2', '/tasks?status:ne=done',
      '/tasks?priority:gt=1', '/tasks?priority:lt=3', '/tasks?priority:lte=2', '/tasks?priority:eq=3',
      '/tasks?status:in=open,blocked', '/tasks?title:contains=release', '/tasks?title:startsWith=Set',
      '/tasks?status=open&status=blocked',
      '/tasks?_sort=-priority,title', '/tasks?_sort=priority', '/tasks?_sort=-title',
      '/tasks?priority=3', '/tasks?projectId=2', '/tasks?projectId=1', '/tasks?projectId:ne=1',
      '/tasks?projectId:gte=2', '/tasks?projectid=2',
      '/tasks?projectId:contains=2', '/tasks?projectId:startsWith=2', '/tasks?projectId:endsWith=2',
      '/tasks?projectId:in=2', '/tasks?projectId:eq=2', '/tasks?status=OPEN',
      '/tasks?title:contains=Release', '/tasks?priority:gte=2&priority:lte=2',
      '/tasks?_sort=status,-priority', '/tasks?_sort=-id',
    ]),
  },
  {
    id: 'tasks-paginate-embed', dataset: 'tasks',
    steps: reads([
      '/tasks?_page=1&_per_page=2', '/tasks?_page=2&_per_page=2', '/tasks?_page=3&_per_page=2',
      '/tasks?_page=9&_per_page=2', '/tasks?_per_page=1', '/tasks?_page=1',
      '/tasks?status=open&_page=1&_per_page=2',
      '/tasks?status=open&_sort=-priority&_page=1&_per_page=2',
      '/tasks?_sort=-priority&_page=1&_per_page=2',
      '/tasks?_limit=1', '/tasks?_start=0&_end=1', '/tasks?_start=1&_limit=2',
      '/tasks?_page=0&_per_page=2', '/tasks?_page=1&_per_page=0', '/tasks?_page=abc',
      '/tasks/3?_embed=project', '/projects/2?_embed=tasks', '/projects/1?_embed=tasks',
      '/tasks?_embed=project', '/projects?_embed=tasks', '/tasks/3?_embed=nothing',
    ]),
  },
  {
    id: 'tasks-write', dataset: 'tasks',
    steps: [
      { method: 'POST', path: '/tasks', body: { title: 'Review pull request', status: 'open', priority: 2, projectId: '1' } },
      { method: 'POST', path: '/tasks', body: { id: 'custom-id', title: 'Own id', status: 'open', priority: 1, projectId: '1' } },
      { method: 'GET', path: '/tasks/custom-id' },
      { method: 'PATCH', path: '/tasks/1', body: { status: 'done' } },
      { method: 'PUT', path: '/tasks/4', body: { title: 'Replaced', status: 'open', priority: 1, projectId: '2' } },
      { method: 'DELETE', path: '/tasks/5' },
      { method: 'DELETE', path: '/projects/1' },
      { method: 'GET', path: '/tasks' },
      { method: 'GET', path: '/projects' },
      { method: 'POST', path: '/tasks', body: { title: 'Number FK', status: 'open', priority: 1, projectId: 2 } },
      { method: 'GET', path: '/tasks?projectId=2' },
    ],
  },
]

const work = mkdtempSync(join(tmpdir(), 'jsfg-'))
console.log(`Installing json-server@${VERSION} into ${work} ...`)
execFileSync('npm', ['install', '--no-audit', '--no-fund', '--silent', `json-server@${VERSION}`], { cwd: work, stdio: 'inherit' })
const bin = join(work, 'node_modules', '.bin', 'json-server')
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function waitUp(base) {
  for (let i = 0; i < 80; i++) {
    try { await fetch(base + '/'); return } catch { await sleep(150) }
  }
  throw new Error('json-server did not start at ' + base)
}

function normalizeGeneratedIds(obj, generatedIds) {
  if (!obj) return obj
  let str = JSON.stringify(obj)
  for (const id of generatedIds) {
    if (id) {
      str = str.split(`"${id}"`).join('"<generated>"')
    }
  }
  return JSON.parse(str)
}

let port = 3400
const result = {
  jsonServerVersion: VERSION,
  node: process.version,
  recordedAt: new Date().toISOString(),
  stabilityCheck: {
    runsPerScenario: RUNS_COUNT,
    writeDelayMs: WRITE_DELAY_MS,
  },
  datasets: DATASETS,
  scenarios: [],
}

let totalVerifiedSteps = 0
let totalUnstableSteps = 0

for (const sc of SCENARIOS) {
  console.log(`Recording scenario: ${sc.id} (${RUNS_COUNT} runs) ...`)
  const scenarioRuns = []

  for (let runIdx = 0; runIdx < RUNS_COUNT; runIdx++) {
    const runDir = mkdtempSync(join(tmpdir(), `jsfg-${sc.id}-run${runIdx}-`))
    const dbFile = join(runDir, 'db.json')
    writeFileSync(dbFile, JSON.stringify(DATASETS[sc.dataset], null, 2))

    const p = port++
    const base = `http://localhost:${p}`
    const child = spawn(bin, [dbFile, '-p', String(p)], { stdio: 'ignore' })
    const runRecord = { steps: [], generatedIds: [], dbFileAfter: null }

    try {
      await waitUp(base)
      for (const st of sc.steps) {
        const isWrite = st.method !== 'GET'
        const res = await fetch(base + st.path, {
          method: st.method,
          headers: st.body ? J : undefined,
          body: st.body ? JSON.stringify(st.body) : undefined,
        })
        const text = await res.text()
        let body = text
        try { body = text ? JSON.parse(text) : null } catch { /* keep text */ }

        let sampleId = null
        if (st.method === 'POST' && body && typeof body === 'object' && 'id' in body) {
          sampleId = body.id
          runRecord.generatedIds.push(sampleId)
        }

        runRecord.steps.push({
          status: res.status,
          rawBody: body,
          sampleId,
        })

        if (isWrite) {
          await sleep(WRITE_DELAY_MS)
        }
      }

      await sleep(WRITE_DELAY_MS) // wait for final flush
      runRecord.dbFileAfter = JSON.parse(readFileSync(dbFile, 'utf8'))
    } finally {
      child.kill('SIGTERM')
      await sleep(150)
    }

    scenarioRuns.push(runRecord)
  }

  // Cross-run stability comparison
  const consolidatedSteps = []
  for (let stepIdx = 0; stepIdx < sc.steps.length; stepIdx++) {
    const st = sc.steps[stepIdx]
    const run0 = scenarioRuns[0].steps[stepIdx]
    const run1 = scenarioRuns[1].steps[stepIdx]
    const run2 = scenarioRuns[2].steps[stepIdx]

    const statusMatch = run0.status === run1.status && run1.status === run2.status

    const normBody0 = normalizeGeneratedIds(run0.rawBody, scenarioRuns[0].generatedIds)
    const normBody1 = normalizeGeneratedIds(run1.rawBody, scenarioRuns[1].generatedIds)
    const normBody2 = normalizeGeneratedIds(run2.rawBody, scenarioRuns[2].generatedIds)

    const str0 = JSON.stringify(normBody0)
    const str1 = JSON.stringify(normBody1)
    const str2 = JSON.stringify(normBody2)
    const bodyMatch = str0 === str1 && str1 === str2

    const isStable = statusMatch && bodyMatch

    const stepOut = {
      method: st.method,
      path: st.path,
      ...(st.body ? { requestBody: st.body } : {}),
      status: run0.status,
      body: normBody0,
    }

    if (st.method === 'POST' && run0.rawBody && typeof run0.rawBody === 'object' && 'id' in run0.rawBody) {
      stepOut.generatedId = true
      stepOut.generatedIdPattern = '^[A-Za-z0-9_-]{6,}$'
      stepOut.generatedIdSample = run0.sampleId
    }

    if (!isStable) {
      stepOut.unstable = true
      totalUnstableSteps++
      console.warn(`  [UNSTABLE] ${sc.id}[${stepIdx}]: statusMatch=${statusMatch}, bodyMatch=${bodyMatch}`)
    } else {
      totalVerifiedSteps++
    }

    consolidatedSteps.push(stepOut)
  }

  // Normalize dbFileAfter
  const normDb0 = normalizeGeneratedIds(scenarioRuns[0].dbFileAfter, scenarioRuns[0].generatedIds)
  const normDb1 = normalizeGeneratedIds(scenarioRuns[1].dbFileAfter, scenarioRuns[1].generatedIds)
  const normDb2 = normalizeGeneratedIds(scenarioRuns[2].dbFileAfter, scenarioRuns[2].generatedIds)
  if (JSON.stringify(normDb0) !== JSON.stringify(normDb1) || JSON.stringify(normDb1) !== JSON.stringify(normDb2)) {
    console.warn(`  [UNSTABLE DB] ${sc.id} dbFileAfter differed across runs`)
  }

  result.scenarios.push({
    id: sc.id,
    dataset: sc.dataset,
    steps: consolidatedSteps,
    dbFileAfter: normDb0,
  })

  console.log(`  completed ${sc.id}: ${consolidatedSteps.length} steps (stable: ${consolidatedSteps.filter(s => !s.unstable).length})`)
}

mkdirSync(dirname(out), { recursive: true })
writeFileSync(out, JSON.stringify(result, null, 2) + '\n')
console.log(`\nWrote ${out}`)
console.log(`Summary: ${totalVerifiedSteps} verified stable steps, ${totalUnstableSteps} unstable steps.`)
