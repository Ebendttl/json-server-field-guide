#!/usr/bin/env node
/**
 * Generates a token-efficient, client-safe subset of fixtures.json (src/mdx/fg/recorded.ts).
 * Client components import this lightweight module instead of the full 56 KB fixtures.json.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');
const fixturesPath = join(projectRoot, 'src/mdx/fg/fixtures.json');
const outputPath = join(projectRoot, 'src/mdx/fg/recorded.ts');

const fixtures = JSON.parse(readFileSync(fixturesPath, 'utf8'));

// Curated subset of key requests across scenarios for client console presets
const CURATED_KEYS = [
  // Quickstart reads
  { scenario: 'quickstart-reads', stepIndex: 0, label: 'Get all posts' },
  { scenario: 'quickstart-reads', stepIndex: 1, label: 'Get single post' },
  { scenario: 'quickstart-reads', stepIndex: 6, label: 'Filter posts by views' },
  { scenario: 'quickstart-reads', stepIndex: 7, label: 'Sort posts descending' },
  { scenario: 'quickstart-reads', stepIndex: 10, label: 'Embed author on post' },
  // Tasks filtering and sorting
  { scenario: 'tasks-filter-sort', stepIndex: 5, label: 'Filter tasks by status' },
  { scenario: 'tasks-filter-sort', stepIndex: 6, label: 'Combined filter: status and priority' },
  { scenario: 'tasks-filter-sort', stepIndex: 16, label: 'Multi-key sort: priority and title' },
  { scenario: 'tasks-filter-sort', stepIndex: 20, label: 'Quirk: string FK filter returns empty' },
  { scenario: 'tasks-filter-sort', stepIndex: 25, label: 'Workaround: contains operator on FK' },
  // Pagination & Embedding
  { scenario: 'tasks-paginate-embed', stepIndex: 0, label: 'Paginate tasks: page 1' },
  { scenario: 'tasks-paginate-embed', stepIndex: 9, label: 'Legacy _limit returns empty' },
  { scenario: 'tasks-paginate-embed', stepIndex: 15, label: 'Embed parent on task' },
  { scenario: 'tasks-paginate-embed', stepIndex: 16, label: 'Embed children on project' },
  // Writes
  { scenario: 'quickstart-write', stepIndex: 0, label: 'Create post (POST)' },
  { scenario: 'tasks-write', stepIndex: 6, label: 'Delete parent (DELETE)' },
];

const presets = CURATED_KEYS.map(({ scenario, stepIndex, label }) => {
  const sc = fixtures.scenarios.find((s) => s.id === scenario);
  if (!sc) throw new Error(`Scenario not found: ${scenario}`);
  const st = sc.steps[stepIndex];
  if (!st) throw new Error(`Step ${stepIndex} not found in ${scenario}`);

  return {
    label,
    scenario,
    dataset: sc.dataset,
    method: st.method,
    path: st.path,
    requestBody: st.requestBody || null,
    status: st.status,
    responseBody: st.body,
  };
});

// All 91 request signatures across all 5 scenarios for exact fixture matching
const allSignatures = [];
const validFixtureIds = [];
const recordedResponses = {};

for (const scenario of fixtures.scenarios) {
  for (let i = 0; i < scenario.steps.length; i++) {
    const step = scenario.steps[i];
    const fidHash = `${scenario.id}#${i}`;
    const fidBracket = `${scenario.id}[${i}]`;

    validFixtureIds.push(fidHash);
    validFixtureIds.push(fidBracket);

    allSignatures.push({
      dataset: scenario.dataset,
      method: step.method,
      path: step.path,
      requestBody: step.requestBody || null,
    });

    const compositeKey = `${scenario.dataset}:${step.path}`;
    if (!recordedResponses[compositeKey] || step.method === 'GET') {
      recordedResponses[compositeKey] = {
        method: step.method,
        status: step.status,
        body: step.body,
        fixtureId: fidHash,
      };
    }
    // Also index without dataset prefix if not present
    if (!recordedResponses[step.path] || step.method === 'GET') {
      recordedResponses[step.path] = recordedResponses[compositeKey];
    }
  }
}

const content = `/**
 * Generated lightweight subset of fixtures for client-side MDX components.
 * Run \`node scripts/fg-generate-subset.mjs\` to regenerate.
 * DO NOT import full fixtures.json in client components.
 */

export interface RecordedPreset {
  label: string;
  scenario: string;
  dataset: 'quickstart' | 'tasks';
  method: string;
  path: string;
  requestBody: any;
  status: number;
  responseBody: any;
}

export interface RecordedSignature {
  dataset: 'quickstart' | 'tasks';
  method: string;
  path: string;
  requestBody: any;
}

export interface RecordedResponseItem {
  method: string;
  status: number;
  body: any;
  fixtureId: string;
}

export const INITIAL_DATASETS = ${JSON.stringify(fixtures.datasets, null, 2)} as const;

export const RECORDED_PRESETS: RecordedPreset[] = ${JSON.stringify(presets, null, 2)};

export const RECORDED_SIGNATURES: RecordedSignature[] = ${JSON.stringify(allSignatures, null, 2)};

export const VALID_FIXTURE_IDS: string[] = ${JSON.stringify(validFixtureIds, null, 2)};

export const RECORDED_RESPONSES: Record<string, RecordedResponseItem> = ${JSON.stringify(recordedResponses, null, 2)};
`;

writeFileSync(outputPath, content);
console.log(`Generated ${outputPath} (${(Buffer.byteLength(content) / 1024).toFixed(2)} KB)`);
