# Engine Gaps and Verification Classification Rules

This document defines the boundary between verified behavior and unmeasured edge cases for the json-server query simulation engine (`src/mdx/fg/engine.ts`).

## Verified vs Outside-Verified Classification Rule

A request handled by `classifyRequest(req, db)` is classified as **verified** (`{ verified: true }`) if and only if:

1. **HTTP Method**: Must be one of `GET`, `POST`, `PUT`, `PATCH`, or `DELETE`.
2. **Route Target**: Targets an existing collection endpoint (e.g., `/tasks`, `/posts`, `/projects`), an item endpoint (`/collection/:id`), a singleton resource (`/profile`), or a standard route that triggers a verified 404.
3. **Query Operators**: Any query parameter with an operator suffix must use one of the 10 verified operators:
   - `:eq` (equality)
   - `:ne` (inequality)
   - `:gt` (greater than)
   - `:gte` (greater than or equal)
   - `:lt` (less than)
   - `:lte` (less than or equal)
   - `:in` (comma-separated inclusion)
   - `:contains` (case-insensitive substring)
   - `:startsWith` (prefix match)
   - `:endsWith` (suffix match)
   Control parameters permitted: `_sort`, `_page`, `_per_page`, `_embed`, `_limit`, `_start`, `_end`.
4. **Pagination Constraint**:
   - `_page` combined with `_per_page` is fully verified.
   - `_per_page` without `_page` is verified (consistently ignored across fixtures).
   - **Gap rule**: `_page` without `_per_page` is verified ONLY on datasets with $\le 5$ records (where beta.15 returns all 5 records as a single page). For collections with $> 5$ records, the default page size is unmeasured in the fixtures and is classified as **outside the verified set**.
5. **Relationship Embedding**: `_embed` is verified for parent embedding (singular FK match) and child collection embedding (plural collection match), with foreign keys matching by strict equality.

Any request violating these boundaries returns `{ verified: false, reason: "..." }`. In Phase 3, the interactive console displays:
> "Outside the 91 verified requests - run it with real json-server to be sure"

---

## Resolution of Historical Fixture Discrepancies

During initial testing, two discrepancies were traced to async disk flush latency in the original single-pass recorder run:
1. `quickstart-write[2]` recorded `views: 100` instead of `101` immediately following `PATCH /posts/1`.
2. `tasks-write[7]` omitted the `"Own id"` task created in step 1.

These were resolved by updating `scripts/fg-record-fixtures.mjs` to execute a 3-run stability protocol:
- Every scenario is executed 3 independent times in fresh temporary directories.
- A 250 ms wait is enforced after every write operation (`POST`, `PUT`, `PATCH`, `DELETE`) before issuing the next request.
- Every step is compared across all 3 runs: all 91 steps yielded 100% identical HTTP status and normalized body content (0 unstable steps).
- The resulting ground truth fixtures in `src/mdx/fg/fixtures.json` and client subset `src/mdx/fg/recorded.ts` accurately capture the stable server behavior:
  - `GET /posts` after PATCH returns `views: 101`.
  - `GET /tasks` after parent project deletion retains `"Own id"` with foreign key nullification (`projectId: null`).
  - Zero test skips or special-case normalisations remain in `src/mdx/fg/engine.test.ts`.

