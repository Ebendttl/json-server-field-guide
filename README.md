# JSON Server Field Guide

An unofficial, example-driven companion for
[`json-server@1.0.0-beta.15`](https://github.com/typicode/json-server).
Every claim is backed by a recorded HTTP fixture.

> **Unofficial guide.** This site is an independent learning resource. It is
> not published by or affiliated with the JSON Server project or its
> maintainers.

## What is this?

JSON Server turns a plain JSON file into a working REST API. This field guide
walks you through installing it, querying data with filters, sort, and
pagination, embedding related records, and resetting state between test runs —
all tested against `json-server@1.0.0-beta.15` on Node.js 22.

The guide is published as a documentation site built with
[Thally](https://github.com/thallylabs/thally). The live version is at
<!-- TODO: add deployed URL here -->.

## Run locally

```bash
npm install
npm run dev
```

Node.js 22.12 or newer is required (matching the json-server engine
requirement). The site starts at [http://localhost:3040](http://localhost:3040).

## Project structure

| Path | Purpose |
| --- | --- |
| `src/content/` | MDX documentation pages |
| `src/data/site.ts` | Site name, links, and brand presets |
| `docs.json` | Navigation, theme, and feature configuration |
| `pack/context/fixtures.json` | 91 recorded HTTP request/response pairs |
| `notes/` | Internal notes (plan, friction log, checklists) |

## Verification

Every behavioral claim in the guide traces to a specific fixture ID in
`pack/context/fixtures.json`. See the
[Verification page](/verification) for the full claim-to-fixture map.

Re-record the fixtures yourself:

```bash
node scripts/fg-record-fixtures.mjs
```

## License

[MIT](LICENSE)
