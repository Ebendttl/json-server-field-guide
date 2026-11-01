import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from './engine.ts';
import fixtures from './fixtures.json' with { type: 'json' };

for (const sc of fixtures.scenarios) {
  test.describe(`Scenario: ${sc.id} (${sc.dataset})`, () => {
    const server = createServer((fixtures.datasets as Record<string, any>)[sc.dataset]);
    const generatedIds = new Set<string>();

    sc.steps.forEach((st: any, i: number) => {
      test(`[${i}] ${st.method} ${st.path} → ${st.status}`, () => {
        const res = server.handle({
          method: st.method,
          path: st.path,
          body: st.requestBody,
        });

        // 1. Status check
        assert.strictEqual(
          res.status,
          st.status,
          `Status mismatch on ${sc.id}[${i}] ${st.method} ${st.path}: expected ${st.status}, got ${res.status}`
        );

        // 2. Handle generated ID
        if (st.generatedId) {
          assert.ok(res.body && typeof res.body === 'object', 'Body must be object with generated ID');
          assert.match(
            res.body.id,
            new RegExp(st.generatedIdPattern || '^[A-Za-z0-9_-]{6,}$'),
            `Generated ID '${res.body.id}' does not match pattern`
          );
          generatedIds.add(res.body.id);
        }

        // 3. Compare body
        if (st.body !== null && typeof st.body !== 'undefined') {
          let actual = JSON.parse(JSON.stringify(res.body));
          const expected = JSON.parse(JSON.stringify(st.body));

          // Normalise any tracked generated IDs in actual response
          let actualStr = JSON.stringify(actual);
          for (const genId of generatedIds) {
            actualStr = actualStr.split(`"${genId}"`).join('"<generated>"');
          }

          assert.deepStrictEqual(JSON.parse(actualStr), expected);
        }
      });
    });

    test(`Verify dbFileAfter for ${sc.id}`, () => {
      const actualDb = server.getState();
      let actualDbStr = JSON.stringify(actualDb);
      for (const genId of generatedIds) {
        actualDbStr = actualDbStr.split(`"${genId}"`).join('"<generated>"');
      }

      assert.deepStrictEqual(JSON.parse(actualDbStr), sc.dbFileAfter);
    });
  });
}
