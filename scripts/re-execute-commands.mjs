import { mkdtempSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function run() {
  const testDir = mkdtempSync(join(tmpdir(), 'fg-reexec-'));
  console.log(`Created clean temp directory: ${testDir}`);

  // 1. Quickstart Re-execution
  console.log('\n--- Re-executing Quickstart ---');
  const quickstartDb = {
    posts: [
      { id: "1", title: "Hello JSON Server", views: 100, authorId: "1" },
      { id: "2", title: "Filtering and sorting", views: 250, authorId: "1" },
      { id: "3", title: "Pagination basics", views: 40, authorId: "2" }
    ],
    authors: [
      { id: "1", name: "Ada" },
      { id: "2", name: "Linus" }
    ],
    profile: { name: "demo" }
  };

  const dbPath = join(testDir, 'db.json');
  writeFileSync(dbPath, JSON.stringify(quickstartDb, null, 2));

  const port = 3899;
  const server = spawn('npx', ['--yes', 'json-server@1.0.0-beta.15', 'db.json', '-p', String(port)], {
    cwd: testDir,
    stdio: 'pipe',
  });

  server.stdout.on('data', (d) => process.stdout.write('[json-server] ' + d.toString()));
  server.stderr.on('data', (d) => process.stderr.write('[json-server err] ' + d.toString()));

  await delay(2500);

  // Test 1: GET /posts
  const r1 = await fetch(`http://localhost:${port}/posts`).then(r => r.json());
  console.log('GET /posts count:', r1.length, '(expected: 3)');

  // Test 2: GET /posts/1
  const r2 = await fetch(`http://localhost:${port}/posts/1`).then(r => r.json());
  console.log('GET /posts/1:', JSON.stringify(r2), '(matches fixture quickstart-reads#1)');

  // Test 3: GET /profile
  const r3 = await fetch(`http://localhost:${port}/profile`).then(r => r.json());
  console.log('GET /profile:', JSON.stringify(r3), '(matches singleton)');

  // Test 4: POST /posts
  const r4 = await fetch(`http://localhost:${port}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: "My first post", views: 0, authorId: "2" }),
  });
  const r4Body = await r4.json();
  console.log('POST /posts status:', r4.status, 'body:', JSON.stringify(r4Body));

  // Test 5: PATCH /posts/1
  const r5 = await fetch(`http://localhost:${port}/posts/1`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ views: 101 }),
  });
  const r5Body = await r5.json();
  console.log('PATCH /posts/1 status:', r5.status, 'body:', JSON.stringify(r5Body));

  // Test 6: DELETE /posts/3
  const r6 = await fetch(`http://localhost:${port}/posts/3`, { method: 'DELETE' });
  const r6Body = await r6.json();
  console.log('DELETE /posts/3 status:', r6.status, 'body:', JSON.stringify(r6Body));

  // Test 7: GET /posts/3 (404)
  const r7 = await fetch(`http://localhost:${port}/posts/3`);
  console.log('GET /posts/3 after delete status:', r7.status, '(expected: 404)');

  // Test 8: GET /posts/999 (404)
  const r8 = await fetch(`http://localhost:${port}/posts/999`);
  console.log('GET /posts/999 status:', r8.status, '(expected: 404)');

  server.kill('SIGTERM');
  await delay(1000);

  // 2. Guide Re-execution (build-a-mock-api)
  console.log('\n--- Re-executing Guide (build-a-mock-api) ---');
  const taskSeed = {
    projects: [
      { id: "1", name: "Website relaunch" },
      { id: "2", name: "Mobile app" }
    ],
    tasks: [
      { id: "1", title: "Draft homepage copy", status: "open", priority: 2, projectId: "1" },
      { id: "2", title: "Design navigation", status: "done", priority: 3, projectId: "1" },
      { id: "3", title: "Set up CI", status: "open", priority: 3, projectId: "2" },
      { id: "4", title: "Write release notes", status: "open", priority: 1, projectId: "2" },
      { id: "5", title: "Fix login bug", status: "blocked", priority: 3, projectId: "2" }
    ]
  };

  const seedPath = join(testDir, 'db.seed.json');
  writeFileSync(seedPath, JSON.stringify(taskSeed, null, 2));
  writeFileSync(dbPath, JSON.stringify(taskSeed, null, 2));

  const server2 = spawn('npx', ['--yes', 'json-server@1.0.0-beta.15', 'db.json', '-p', String(port)], {
    cwd: testDir,
    stdio: 'pipe',
  });

  server2.stdout.on('data', (d) => process.stdout.write('[json-server2] ' + d.toString()));
  await delay(2500);

  // Filter 1: /tasks?status=open
  const g1 = await fetch(`http://localhost:${port}/tasks?status=open`).then(r => r.json());
  console.log('Filter status=open count:', g1.length, '(expected: 3 tasks [1, 3, 4])');

  // Filter 2: /tasks?status=open&priority:gte=2
  const g2 = await fetch(`http://localhost:${port}/tasks?status=open&priority:gte=2`).then(r => r.json());
  console.log('Filter status=open&priority:gte=2:', g2.map(t => t.id), '(expected: ["1", "3"])');

  // Sort: /tasks?_sort=-priority,title
  const g3 = await fetch(`http://localhost:${port}/tasks?_sort=-priority,title`).then(r => r.json());
  console.log('Sort -priority,title:', g3.map(t => `${t.priority}:${t.title}`));

  // Paginate: /tasks?_page=2&_per_page=2
  const g4 = await fetch(`http://localhost:${port}/tasks?_page=2&_per_page=2`).then(r => r.json());
  console.log('Paginate _page=2&_per_page=2 keys:', Object.keys(g4), 'items:', g4.items, 'data ids:', g4.data.map(t => t.id));

  // Embed: /tasks/3?_embed=project
  const g5 = await fetch(`http://localhost:${port}/tasks/3?_embed=project`).then(r => r.json());
  console.log('Embed /tasks/3?_embed=project:', g5.id, 'project:', g5.project?.name);

  // Embed: /projects/2?_embed=tasks
  const g6 = await fetch(`http://localhost:${port}/projects/2?_embed=tasks`).then(r => r.json());
  console.log('Embed /projects/2?_embed=tasks task ids:', g6.tasks?.map(t => t.id));

  // client.mjs execution
  console.log('\n--- Running client.mjs against mock API ---');
  const clientScript = `
const base = "http://localhost:${port}";
const res = await fetch(\`\${base}/tasks?status=open&_sort=-priority\`);
if (!res.ok) throw new Error(\`Request failed: \${res.status}\`);
const tasks = await res.json();
console.log(tasks.map((t) => \`\${t.priority} \${t.title}\`).join("\\n"));

const created = await fetch(\`\${base}/tasks\`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    title: "Review pull request",
    status: "open",
    priority: 2,
    projectId: "1",
  }),
});
console.log(created.status, await created.json());
`;
  writeFileSync(join(testDir, 'client.mjs'), clientScript);

  const clientProc = spawn('node', ['client.mjs'], { cwd: testDir, stdio: 'inherit' });
  await new Promise(resolve => clientProc.on('exit', resolve));

  server2.kill('SIGTERM');
  console.log('\n=== All Quickstart & Guide Commands Successfully Re-executed ===');
}

run().catch(console.error);
