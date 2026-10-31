const base = "http://localhost:3000";
const res = await fetch(`${base}/tasks?status=open&_sort=-priority`);
if (!res.ok) throw new Error(`Request failed: ${res.status}`);
const tasks = await res.json();
console.log(tasks.map((t) => `${t.priority} ${t.title}`).join("\n"));
const created = await fetch(`${base}/tasks`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ title: "Review pull request", status: "open", priority: 2, projectId: "1" }),
});
console.log(created.status, await created.json());
