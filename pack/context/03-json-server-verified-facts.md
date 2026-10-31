# 03 · JSON Server beta.15 — ground truth

All facts below were produced by running the real `json-server@1.0.0-beta.15` (Node 22) and recording responses with `scripts/record-fixtures.mjs` (91 requests across 5 scenarios → `context/fixtures.json`). **Where this file and your memory of json-server disagree, this file wins** (1.x differs a lot from 0.x). Engines: Node `>=22.12.0`. CLI flags: `-p/--port` (3000), `-h/--host` (localhost — NOT help), `-s/--static <dir>`, `--help`, `--version`.

## Shape rules
- Top-level array → collection (`/posts`, `/posts/:id`). Top-level object → singleton (`/profile`; GET and PATCH recorded).
- Ids are normalised to **strings** on load. `POST` **ignores an `id` you send** and generates a random string id (observed 11 chars) (`^[A-Za-z0-9_-]{6,}$`); `GET /tasks/custom-id` afterwards → 404.
- Status codes: GET 200, POST **201**, PATCH 200 (full merged record), PUT 200 (replaced record, `id` appended last), DELETE **200 with the deleted record as body**, missing → **404 `{"error":"Not Found"}`** (also for unknown routes and PATCH/DELETE of unknown ids).
- Writes persist to the JSON file (~immediately). Deleting a parent does **not** cascade.

## Query language
| Request | Result (tasks seed: 5 tasks, ids "1".."5") |
|---|---|
| `?status=open` | ids 1,3,4 (equality is **case-sensitive**: `status=OPEN` → `[]`) |
| `?priority:gte=2` etc. | operators `:eq :ne :lt :lte :gt :gte` work on numbers |
| `?status:in=open,blocked` | 1,3,4,5 |
| `?title:contains=Release` | 4 (**case-insensitive**) · also `:startsWith`, `:endsWith` |
| `?status=open&status=blocked` | **last value wins** → only blocked (id 5) |
| `?_sort=-priority,title` | multi-key, `-` = descending → 2,5,3,1,4 |
| `?_page=2&_per_page=2` | `{first,prev,next,last,pages,items,data:[…]}` — **object, not array**. `_page` beyond last returns the last page. `_per_page` **without** `_page` is ignored → plain array of all. `_page` alone returned all 5 records as one page (default page size not measured above 5). |
| `?_limit=1` · `?_start=0&_end=1` | **`[]`** (0.x params do not work) |
| `?_embed=project` (on `/tasks`, `/tasks/3`) / `/projects/2?_embed=tasks` | embeds children/parent; requires `<singular>Id` FK and **string FK === string id**. Numeric FK `2` ≠ id `"2"` → nothing embedded. `_embed=nothing` is silently ignored. |
| **Quirk:** `?projectId=2` (FK stored as string `"2"`) | **`[]`** — also `:eq=2`, `:in=2`. `?projectId:contains=2` → 3,4,5 (substring semantic); `:gte=2` → 3,4,5; `:ne=1` → **all 5** (string vs number). With a *numeric* FK stored on a record, `?projectId=2` matches it. |

## What the docs must/mustn't claim
- Don't claim "send your own id" (false), `_limit` (0.x), `_embed` works with numeric FKs (false), or that repeated params OR together (false; use `:in`).
- Every claim in prose should be traceable to a fixture. Maintain a table `claim → fixture path` in `docs/verification.md` (a real, linkable page: "How this guide was verified").

## Datasets used (also in fixtures.json)
`quickstart`: posts(3)/authors(2)/profile. `tasks`: projects(2)/tasks(5) — see `seed/tasks.db.seed.json`.

## Fixture format (`fixtures.json`)
```
{ jsonServerVersion, datasets:{quickstart,tasks}, scenarios:[ { id, dataset, steps:[ {method,path,requestBody?,status,body,generatedId?} ], dbFileAfter } ] }
```
Scenarios run in order against ONE fresh server per scenario (state carries across steps *within* a scenario). `body` for generated ids is the literal string `"<generated>"`.
