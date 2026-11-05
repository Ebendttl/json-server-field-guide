import Link from 'next/link';
import { Console } from './Console';
import './fg.css';

/**
 * Landing page component (Server Component) for JSON Server Field Guide.
 * Implements the "product-performs" direction with live interactive console.
 */
export function Landing() {
  return (
    <div className="fg-root">
      {/* 1. Hero Section */}
      <section className="fg-hero">
        <div className="fg-hero-content">
          <h1 className="fg-headline">Your JSON file is already an API.</h1>
          <p className="fg-subhead">
            91 requests recorded from json-server@1.0.0-beta.15, replayed against this engine.
          </p>
          <div className="fg-hero-actions">
            <Link href="/quickstart" className="fg-btn-primary">
              Open the quickstart
            </Link>
            <Link href="/verification" className="fg-btn-secondary">
              View verification matrix
            </Link>
          </div>
          <div className="fg-works-with">
            <span className="fg-works-with-label">Works with standard REST clients:</span>
            <span className="fg-works-with-item">curl</span>
            <span className="fg-works-with-item">fetch</span>
            <span className="fg-works-with-item">Postman</span>
            <span className="fg-works-with-item">Bruno</span>
            <span className="fg-works-with-item">React Query</span>
            <span className="fg-works-with-item">Axios</span>
          </div>
        </div>

        {/* Live Interactive Console with SSR fallback */}
        <Console />
      </section>

      {/* 2. How the file becomes the API */}
      <section className="fg-section">
        <h2 className="fg-section-title">One file becomes endpoints</h2>
        <p className="fg-section-lead">
          json-server inspects the structure of your JSON file and mounts a complete REST interface
          with automatic plural routes, singleton objects, and state persistence.
        </p>

        <div className="fg-steps-column">
          <div className="fg-step-block">
            <h3 className="fg-step-order">Top-level keys become resources</h3>
            <p className="fg-step-desc">
              Arrays like <code>posts: []</code> become full collection endpoints (<code>GET /posts</code>, <code>POST /posts</code>).
              Objects like <code>profile: {}</code> become singleton endpoints with GET and PATCH support.
            </p>
            <pre className="fg-step-snippet" data-ui tabIndex={0} role="region" aria-label="Code example">
              <code>{`// In db.json:\n{ "posts": [...], "authors": [...], "profile": { "name": "demo" } }\n\n// Available routes:\n// GET /posts          -> Array of posts\n// GET /posts/1        -> Single item by id\n// GET /profile        -> Singleton object`}</code>
            </pre>
          </div>

          <div className="fg-step-block">
            <h3 className="fg-step-order">Automatic routing and IDs</h3>
            <p className="fg-step-desc">
              Items are retrieved by their <code>id</code> property. On POST, beta.15 ignores any custom ID in the
              request body and generates a unique string identifier.
            </p>
            <pre className="fg-step-snippet" data-ui tabIndex={0} role="region" aria-label="Code example">
              <code>{`// POST /tasks with body: { "title": "New item", "id": "custom-id" }\n// Response 201 Created:\n{\n  "title": "New item",\n  "id": "W9ZVJeHocW0"\n}`}</code>
            </pre>
          </div>

          <div className="fg-step-block">
            <h3 className="fg-step-order">Writes persist directly to disk</h3>
            <p className="fg-step-desc">
              POST, PUT, PATCH, and DELETE operations update the JSON file on disk immediately.
              Deleting a parent resource nullifies child foreign keys instead of cascading.
            </p>
            <pre className="fg-step-snippet" data-ui tabIndex={0} role="region" aria-label="Code example">
              <code>{`// PATCH /posts/1 with body: { "views": 101 }\n// Response 200 OK:\n{ "id": "1", "title": "Hello JSON Server", "views": 101, "authorId": "1" }`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* 3. Showcase / Query Recipes */}
      <section className="fg-section">
        <h2 className="fg-section-title">Every query pattern, verified</h2>
        <p className="fg-section-lead">
          Explore common query patterns against a real mock schema. Every example is backed by ground-truth
          HTTP recordings from json-server@1.0.0-beta.15.
        </p>

        <div className="fg-recipes-grid">
          <div className="fg-recipe-card">
            <div className="fg-recipe-header">
              <span className="fg-badge-method">GET</span>
              <h3 className="fg-recipe-title">Operator Filters</h3>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <code className="fg-recipe-query">/tasks?status=open&priority:gte=2</code>
              <span className="fg-badge-recorded">recorded fixture</span>
            </div>
            <p className="fg-recipe-desc">
              Filter with comparison operators including <code>:gte</code>, <code>:gt</code>, <code>:lte</code>, <code>:lt</code>, <code>:ne</code>, and <code>:in</code>.
            </p>
            <pre className="fg-step-snippet" data-ui tabIndex={0} role="region" aria-label="Query result">
              <code>{JSON.stringify([
                { id: "1", title: "Draft homepage copy", status: "open", priority: 2, projectId: "1" },
                { id: "3", title: "Set up CI", status: "open", priority: 3, projectId: "2" }
              ], null, 2)}</code>
            </pre>
          </div>

          <div className="fg-recipe-card">
            <div className="fg-recipe-header">
              <span className="fg-badge-method">GET</span>
              <h3 className="fg-recipe-title">Multi-Key Sort</h3>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <code className="fg-recipe-query">/tasks?_sort=-priority,title</code>
              <span className="fg-badge-recorded">recorded fixture</span>
            </div>
            <p className="fg-recipe-desc">
              Order results by multiple properties. Prepend <code>-</code> for descending order and separate keys with commas.
            </p>
            <pre className="fg-step-snippet" data-ui tabIndex={0} role="region" aria-label="Query result">
              <code>{JSON.stringify([
                { id: "2", title: "Design navigation", status: "done", priority: 3, projectId: "1" },
                { id: "5", title: "Fix login bug", status: "blocked", priority: 3, projectId: "2" },
                { id: "3", title: "Set up CI", status: "open", priority: 3, projectId: "2" },
                { id: "1", title: "Draft homepage copy", status: "open", priority: 2, projectId: "1" },
                { id: "4", title: "Write release notes", status: "open", priority: 1, projectId: "2" }
              ], null, 2)}</code>
            </pre>
          </div>

          <div className="fg-recipe-card">
            <div className="fg-recipe-header">
              <span className="fg-badge-method">GET</span>
              <h3 className="fg-recipe-title">Pagination Envelope</h3>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <code className="fg-recipe-query">/tasks?_page=1&_per_page=2</code>
              <span className="fg-badge-recorded">recorded fixture</span>
            </div>
            <p className="fg-recipe-desc">
              Returns structured pagination metadata with total count, page links, and current items slice.
            </p>
            <pre className="fg-step-snippet" data-ui tabIndex={0} role="region" aria-label="Query result">
              <code>{JSON.stringify({
                first: 1,
                prev: null,
                next: 2,
                last: 3,
                pages: 3,
                items: 5,
                data: [
                  { id: "1", title: "Draft homepage copy", status: "open", priority: 2, projectId: "1" },
                  { id: "2", title: "Design navigation", status: "done", priority: 3, projectId: "1" }
                ]
              }, null, 2)}</code>
            </pre>
          </div>

          <div className="fg-recipe-card">
            <div className="fg-recipe-header">
              <span className="fg-badge-method">GET</span>
              <h3 className="fg-recipe-title">Relationship Embedding</h3>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <code className="fg-recipe-query">/tasks/3?_embed=project</code>
              <span className="fg-badge-recorded">recorded fixture</span>
            </div>
            <p className="fg-recipe-desc">
              Embed referenced parent resources directly using foreign-key relationships.
            </p>
            <pre className="fg-step-snippet" data-ui tabIndex={0} role="region" aria-label="Query result">
              <code>{JSON.stringify({
                id: "3",
                title: "Set up CI",
                status: "open",
                priority: 3,
                projectId: "2",
                project: { id: "2", name: "Mobile app" }
              }, null, 2)}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* 4. Sharp Edges / Tested Quirks */}
      <section className="fg-section">
        <h2 className="fg-section-title">Tested quirks and sharp edges</h2>
        <p className="fg-section-lead">
          Version 1.0.0-beta.15 introduces breaking changes from 0.x releases. These four behaviors are verified against live fixtures.
        </p>

        <div className="fg-quirks-grid">
          <div className="fg-quirk-card">
            <h3 className="fg-quirk-title">_limit, _start, and _end return []</h3>
            <p className="fg-quirk-desc">
              The legacy slicing parameters from JSON Server 0.x are no longer supported in beta.15 and silently return an empty array.
              Use <code>_page</code> and <code>_per_page</code> instead.
            </p>
            <Link href="/verification" className="fg-fixture-link">
              Verified in fixture tasks-paginate-embed[9]
            </Link>
          </div>

          <div className="fg-quirk-card">
            <h3 className="fg-quirk-title">String Foreign Key Matching</h3>
            <p className="fg-quirk-desc">
              When foreign keys are stored as strings (e.g. <code>projectId: "2"</code>), a numeric query like <code>?projectId=2</code> returns <code>[]</code>.
              Use string equality or <code>:contains=2</code>.
            </p>
            <Link href="/verification" className="fg-fixture-link">
              Verified in fixture tasks-filter-sort[20]
            </Link>
          </div>

          <div className="fg-quirk-card">
            <h3 className="fg-quirk-title">POST ignores a custom id</h3>
            <p className="fg-quirk-desc">
              Sending an explicit <code>id</code> in a POST request body is ignored by the server. An auto-generated string identifier is always assigned.
            </p>
            <Link href="/verification" className="fg-fixture-link">
              Verified in fixture tasks-write[1]
            </Link>
          </div>

          <div className="fg-quirk-card">
            <h3 className="fg-quirk-title">Parent Deletion Nullifies FKs</h3>
            <p className="fg-quirk-desc">
              Deleting a parent resource does not cascade delete child tasks. Instead, child records retain their place with <code>projectId: null</code>.
            </p>
            <Link href="/verification" className="fg-fixture-link">
              Verified in fixture tasks-write[6]–[8]
            </Link>
          </div>
        </div>
      </section>

      {/* 5. FAQ Section */}
      <section className="fg-section">
        <h2 className="fg-section-title">Frequently answered</h2>
        <p className="fg-section-lead">
          Essential verified behavior questions regarding json-server@1.0.0-beta.15.
        </p>

        <div className="fg-faq-grid">
          <div className="fg-faq-card">
            <h3 className="fg-faq-q">Can I set my own custom record IDs on creation?</h3>
            <p className="fg-faq-a">
              No. In beta.15, POST requests automatically generate random string IDs. Any custom id in the request body is ignored (verified in fixture tasks-write[1]).
            </p>
          </div>

          <div className="fg-faq-card">
            <h3 className="fg-faq-q">How does persistence work during testing?</h3>
            <p className="fg-faq-a">
              All mutating operations (POST, PUT, PATCH, DELETE) write directly back to the database file on disk immediately (verified in quickstart-write and tasks-write).
            </p>
          </div>
        </div>
      </section>

      {/* 6. CTA / Action Stage */}
      <section className="fg-cta-stage">
        <h2 className="fg-cta-headline">Ready to spin up a mock API?</h2>
        <p className="fg-cta-desc">
          Follow the shortest working path to create a database file and query endpoints in about five minutes.
        </p>
        <div className="fg-cta-buttons">
          <Link href="/quickstart" className="fg-btn-primary">
            Start with the quickstart
          </Link>
          <Link href="/guides/build-a-mock-api" className="fg-btn-secondary">
            Read the API guide
          </Link>
        </div>
      </section>

      {/* 7. Footer Strip */}
      <footer className="fg-footer">
        <div className="fg-footer-left">
          <span className="fg-footer-brand">JSON Server Field Guide</span>
          <span className="fg-footer-disclaimer">
            Unofficial, example-driven companion for json-server@1.0.0-beta.15. Not affiliated with or endorsed by typicode or the JSON Server project. MIT licensed.
          </span>
          <span className="fg-footer-disclaimer">
            Created by Ebenezer Akinseinde Akindele. Built on the Thally documentation platform.
          </span>
        </div>

        <div className="fg-footer-links">
          <a
            href="https://github.com/Ebendttl/json-server-field-guide"
            target="_blank"
            rel="noopener noreferrer"
            className="fg-footer-link"
          >
            GitHub
          </a>
          <a
            href="https://github.com/typicode/json-server"
            target="_blank"
            rel="noopener noreferrer"
            className="fg-footer-link"
          >
            Upstream
          </a>
          <Link href="/verification" className="fg-footer-link">
            Verification
          </Link>
          <a href="/llms.txt" className="fg-footer-link">
            llms.txt
          </a>
          <a href="/api/mcp" className="fg-footer-link">
            MCP Endpoint
          </a>
        </div>
      </footer>
    </div>
  );
}
