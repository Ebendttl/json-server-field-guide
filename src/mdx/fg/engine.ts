/**
 * Pure TypeScript simulation of json-server@1.0.0-beta.15 query engine.
 * Zero external dependencies, no DOM requirements.
 * Verified against 91 recorded ground-truth HTTP fixtures.
 */

export interface EngineRequest {
  method: string;
  path: string;
  body?: any;
}

export interface EngineResponse {
  status: number;
  body: any;
}

export interface ServerInstance {
  handle(req: EngineRequest): EngineResponse;
  getState(): Record<string, any>;
}

export interface ClassificationResult {
  verified: boolean;
  reason?: string;
}

const GENERATED_ID_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-';

export function generateId(length = 11): string {
  let res = '';
  for (let i = 0; i < length; i++) {
    res += GENERATED_ID_CHARS[Math.floor(Math.random() * GENERATED_ID_CHARS.length)];
  }
  return res;
}

function parseVal(val: string): any {
  if (val === '') return '';
  const num = Number(val);
  if (!isNaN(num) && val.trim() !== '') return num;
  return val;
}

export function classifyRequest(
  req: EngineRequest,
  db?: Record<string, any>
): ClassificationResult {
  const validMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
  const method = (req.method || 'GET').toUpperCase();
  if (!validMethods.includes(method)) {
    return { verified: false, reason: `HTTP method ${method} is outside the verified set.` };
  }

  const [rawPath, queryStr] = req.path.split('?');
  const segments = rawPath.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean);

  if (segments.length === 0) {
    return { verified: false, reason: 'Root endpoint is not in verified fixtures.' };
  }

  if (queryStr) {
    const params = new URLSearchParams(queryStr);

    // Unmeasured pagination: _page without _per_page on > 5 records
    if (params.has('_page') && !params.has('_per_page')) {
      const pageVal = params.get('_page');
      if (pageVal && !isNaN(Number(pageVal))) {
        const collName = segments[0];
        const recordCount = db && Array.isArray(db[collName]) ? db[collName].length : 5;
        if (recordCount > 5) {
          return {
            verified: false,
            reason: 'Default page size for _page without _per_page on collections >5 items is unmeasured in beta.15.',
          };
        }
      }
    }

    // Check operators
    const allowedOps = new Set([
      'eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'in', 'contains', 'startsWith', 'endsWith'
    ]);
    const controlParams = new Set([
      '_sort', '_page', '_per_page', '_embed', '_limit', '_start', '_end'
    ]);

    for (const [key] of params) {
      if (controlParams.has(key)) continue;
      const colonIdx = key.indexOf(':');
      if (colonIdx !== -1) {
        const op = key.slice(colonIdx + 1);
        if (!allowedOps.has(op)) {
          return { verified: false, reason: `Query operator :${op} is outside the verified set.` };
        }
      }
    }
  }

  return { verified: true };
}

export function createServer(initialDb: Record<string, any>): ServerInstance {
  const db: Record<string, any> = JSON.parse(JSON.stringify(initialDb));

  function handle(req: EngineRequest): EngineResponse {
    const method = (req.method || 'GET').toUpperCase();
    const [rawPath, queryStr] = req.path.split('?');
    const segments = rawPath.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean);

    if (segments.length === 0) {
      return { status: 404, body: { error: 'Not Found' } };
    }

    const name = segments[0];

    // Single collection or singleton route: /name
    if (segments.length === 1) {
      // 1. Top-level array -> collection endpoint
      if (Array.isArray(db[name])) {
        if (method === 'GET') {
          return handleCollectionGet(name, queryStr);
        }
        if (method === 'POST') {
          return handleCollectionPost(name, req.body);
        }
        return { status: 404, body: { error: 'Not Found' } };
      }

      // 2. Top-level object -> singleton endpoint (e.g. /profile)
      if (db[name] !== undefined && typeof db[name] === 'object' && db[name] !== null) {
        if (method === 'GET') {
          return { status: 200, body: JSON.parse(JSON.stringify(db[name])) };
        }
        if (method === 'PATCH') {
          db[name] = { ...db[name], ...req.body };
          db.$schema = './node_modules/json-server/schema.json';
          return { status: 200, body: JSON.parse(JSON.stringify(db[name])) };
        }
        return { status: 404, body: { error: 'Not Found' } };
      }

      // Unknown route
      return { status: 404, body: { error: 'Not Found' } };
    }

    // Item route: /name/:id
    if (segments.length === 2) {
      const id = segments[1];
      if (!Array.isArray(db[name])) {
        return { status: 404, body: { error: 'Not Found' } };
      }

      const items: any[] = db[name];
      const idx = items.findIndex((it) => String(it.id) === String(id));

      if (idx === -1) {
        return { status: 404, body: { error: 'Not Found' } };
      }

      if (method === 'GET') {
        const item = JSON.parse(JSON.stringify(items[idx]));
        if (queryStr) {
          const params = parseQueryParams(queryStr);
          if (params.has('_embed')) {
            applyEmbedding([item], params.get('_embed')!, db);
          }
        }
        return { status: 200, body: item };
      }

      if (method === 'PATCH') {
        const existing = items[idx];
        const updated = { ...existing, ...req.body, id: existing.id };
        items[idx] = updated;
        db.$schema = './node_modules/json-server/schema.json';
        return { status: 200, body: JSON.parse(JSON.stringify(updated)) };
      }

      if (method === 'PUT') {
        const existing = items[idx];
        // json-server beta.15 places body fields first and appends original id last
        const replaced = { ...req.body, id: existing.id };
        items[idx] = replaced;
        db.$schema = './node_modules/json-server/schema.json';
        return { status: 200, body: JSON.parse(JSON.stringify(replaced)) };
      }

      if (method === 'DELETE') {
        const deleted = items.splice(idx, 1)[0];
        // Lowdb/json-server behaviour: nullify foreign keys in child collections
        const singularFk = name.endsWith('s') ? name.slice(0, -1) + 'Id' : name + 'Id';
        for (const otherKey of Object.keys(db)) {
          if (otherKey !== name && Array.isArray(db[otherKey])) {
            for (const otherItem of db[otherKey]) {
              if (String(otherItem[singularFk]) === String(deleted.id)) {
                otherItem[singularFk] = null;
              }
            }
          }
        }
        db.$schema = './node_modules/json-server/schema.json';
        return { status: 200, body: JSON.parse(JSON.stringify(deleted)) };
      }

      return { status: 404, body: { error: 'Not Found' } };
    }

    return { status: 404, body: { error: 'Not Found' } };
  }

  function parseQueryParams(queryStr: string): Map<string, string> {
    const params = new Map<string, string>();
    if (!queryStr) return params;
    for (const part of queryStr.split('&')) {
      if (!part) continue;
      const eqIdx = part.indexOf('=');
      const k = eqIdx === -1 ? decodeURIComponent(part) : decodeURIComponent(part.slice(0, eqIdx));
      const v = eqIdx === -1 ? '' : decodeURIComponent(part.slice(eqIdx + 1));
      // Last value wins for repeated keys
      params.set(k, v);
    }
    return params;
  }

  function handleCollectionGet(name: string, queryStr?: string): EngineResponse {
    let items = JSON.parse(JSON.stringify(db[name])) as any[];
    if (!queryStr) {
      return { status: 200, body: items };
    }

    const params = parseQueryParams(queryStr);

    // Legacy parameters: _limit, _start, _end return [] in beta.15
    if (params.has('_limit') || params.has('_start') || params.has('_end')) {
      return { status: 200, body: [] };
    }

    // Filter items
    const controlParams = new Set(['_sort', '_page', '_per_page', '_embed']);
    for (const [key, val] of params) {
      if (controlParams.has(key)) continue;

      const colonIdx = key.indexOf(':');
      const field = colonIdx === -1 ? key : key.slice(0, colonIdx);
      const op = colonIdx === -1 ? 'eq' : key.slice(colonIdx + 1);
      const targetVal = parseVal(val);

      items = items.filter((item) => {
        const itemVal = item[field];
        switch (op) {
          case 'eq':
            return itemVal === targetVal;
          case 'ne':
            return itemVal !== targetVal;
          case 'gt':
            return typeof itemVal !== 'undefined' && itemVal > targetVal;
          case 'gte':
            return typeof itemVal !== 'undefined' && itemVal >= targetVal;
          case 'lt':
            return typeof itemVal !== 'undefined' && itemVal < targetVal;
          case 'lte':
            return typeof itemVal !== 'undefined' && itemVal <= targetVal;
          case 'in': {
            const list = val.split(',').map(parseVal);
            return list.includes(itemVal);
          }
          case 'contains':
            return String(itemVal ?? '')
              .toLowerCase()
              .includes(String(val).toLowerCase());
          case 'startsWith':
            return String(itemVal ?? '').startsWith(String(val));
          case 'endsWith':
            return String(itemVal ?? '').endsWith(String(val));
          default:
            return false;
        }
      });
    }

    // Sort items (_sort)
    if (params.has('_sort')) {
      const sortFields = params
        .get('_sort')!
        .split(',')
        .filter(Boolean)
        .map((s) => {
          const desc = s.startsWith('-');
          return { field: desc ? s.slice(1) : s, dir: desc ? -1 : 1 };
        });

      items.sort((a, b) => {
        for (const { field, dir } of sortFields) {
          const valA = a[field];
          const valB = b[field];
          if (typeof valA === 'number' && typeof valB === 'number') {
            if (valA !== valB) return (valA - valB) * dir;
          } else {
            const cmp = String(valA ?? '').localeCompare(String(valB ?? ''));
            if (cmp !== 0) return cmp * dir;
          }
        }
        return 0;
      });
    }

    // Embed relations (_embed)
    if (params.has('_embed')) {
      applyEmbedding(items, params.get('_embed')!, db);
    }

    // Pagination (_page, _per_page)
    if (params.has('_page')) {
      const rawPage = params.get('_page')!;
      // If non-numeric, ignore _page and return plain array
      if (isNaN(Number(rawPage))) {
        return { status: 200, body: items };
      }

      const totalItems = items.length;
      const hasPerPage = params.has('_per_page');
      // When _per_page=0, json-server beta.15 clamps to 1
      const perPage = hasPerPage
        ? Math.max(1, parseInt(params.get('_per_page')!, 10) || 1)
        : totalItems;
      const totalPages = Math.ceil(totalItems / perPage) || 1;

      let page = Math.max(1, parseInt(rawPage, 10) || 1);
      if (page > totalPages) {
        page = totalPages;
      }

      const start = (page - 1) * perPage;
      const data = items.slice(start, start + perPage);

      return {
        status: 200,
        body: {
          first: 1,
          prev: page > 1 ? page - 1 : null,
          next: page < totalPages ? page + 1 : null,
          last: totalPages,
          pages: totalPages,
          items: totalItems,
          data,
        },
      };
    }

    return { status: 200, body: items };
  }

  function applyEmbedding(items: any[], target: string, fullDb: Record<string, any>) {
    // 1. Embed parent: target is singular name of a collection in db (e.g. 'project' -> 'projects')
    const parentCollName = target + 's';
    if (Array.isArray(fullDb[parentCollName])) {
      const fk = target + 'Id';
      const parents: any[] = fullDb[parentCollName];
      for (const item of items) {
        const parent = parents.find((p) => p.id === item[fk]);
        if (parent) {
          item[target] = JSON.parse(JSON.stringify(parent));
        }
      }
      return;
    }

    // 2. Embed children: target is plural collection in db (e.g. 'tasks' on a project)
    if (Array.isArray(fullDb[target])) {
      const children: any[] = fullDb[target];
      for (const item of items) {
        // Child's FK to parent
        // Infer FK name from parent collection or existing keys
        // If parent item has projects collection, singular is 'project' + 'Id'
        const candidateKeys = Object.keys(children[0] || {}).filter((k) => k.endsWith('Id'));
        item[target] = children
          .filter((c) => candidateKeys.some((fk) => c[fk] === item.id))
          .map((c) => JSON.parse(JSON.stringify(c)));
      }
      return;
    }

    // Unknown relation target is silently ignored
  }

  function handleCollectionPost(name: string, requestBody: any): EngineResponse {
    const id = generateId();
    // In beta.15, POST ignores any 'id' passed in body and always uses its generated id
    const newRecord = { ...requestBody, id };
    db[name].push(newRecord);
    db.$schema = './node_modules/json-server/schema.json';
    return { status: 201, body: JSON.parse(JSON.stringify(newRecord)) };
  }

  function getState(): Record<string, any> {
    return JSON.parse(JSON.stringify(db));
  }

  return { handle, getState };
}
