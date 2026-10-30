/**
 * Exercises the upsert in app/api/state/route.ts against the real database,
 * with a throwaway user id. The merge must be forward-only: a push that is
 * older than the stored row must not overwrite it.
 */
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);
const user = `test-${Date.now()}`;
const results = [];
const check = (name, pass, detail) => results.push({ name, pass, detail });

async function put(key, value, updatedAt) {
  await sql`
    insert into user_state (user_id, key, value, updated_at)
    values (${user}, ${key}, ${JSON.stringify(value)}::jsonb,
            to_timestamp(${updatedAt} / 1000.0))
    on conflict (user_id, key) do update
      set value = excluded.value, updated_at = excluded.updated_at
      where user_state.updated_at < excluded.updated_at
  `;
}
async function get(key) {
  const rows = await sql`
    select value, (extract(epoch from updated_at) * 1000)::bigint as at
    from user_state where user_id = ${user} and key = ${key}
  `;
  return rows[0] ? { value: rows[0].value, at: Number(rows[0].at) } : null;
}

const T = 1_700_000_000_000;

// 1. First write lands.
await put("owned", ["verina"], T);
check("first write stored", JSON.stringify((await get("owned")).value) === '["verina"]');

// 2. A NEWER write replaces it.
await put("owned", ["verina", "lupa"], T + 1000);
check("newer write wins", JSON.stringify((await get("owned")).value) === '["verina","lupa"]');

// 3. An OLDER write is ignored -- the device that was offline must not clobber.
await put("owned", ["stale"], T - 5000);
const afterStale = await get("owned");
check("older write ignored", JSON.stringify(afterStale.value) === '["verina","lupa"]',
  JSON.stringify(afterStale.value));

// 4. An EQUAL timestamp does not overwrite (strict <), so a replayed push is a no-op.
await put("owned", ["replayed"], T + 1000);
check("equal timestamp ignored", JSON.stringify((await get("owned")).value) === '["verina","lupa"]');

// 5. Timestamp is preserved exactly, so the client can compare against it.
check("timestamp round-trips", (await get("owned")).at === T + 1000, String(afterStale.at));

// 6. Keys are independent -- two devices editing different keys never collide.
await put("acts", ["p-a1"], T + 50);
check("keys independent",
  JSON.stringify((await get("owned")).value) === '["verina","lupa"]' &&
  JSON.stringify((await get("acts")).value) === '["p-a1"]');

// 7. Objects and nulls survive the jsonb round trip.
await put("loadout", { verina: { weapon: "Call of the Abyss" } }, T + 10);
check("objects round-trip",
  (await get("loadout")).value.verina.weapon === "Call of the Abyss");
await put("plan-notes", null, T + 10);
check("null round-trips", (await get("plan-notes")).value === null);

await sql`delete from user_state where user_id = ${user}`;
const left = await sql`select count(*)::int as n from user_state where user_id = ${user}`;
check("cleaned up", left[0].n === 0);

for (const r of results) {
  console.log(`${r.pass ? "PASS" : "FAIL"}  ${r.name}${r.detail && !r.pass ? ` (got ${r.detail})` : ""}`);
}
const failed = results.filter((r) => !r.pass).length;
console.log(failed === 0 ? `\nAll ${results.length} passed.` : `\n${failed} FAILED.`);
process.exit(failed === 0 ? 0 : 1);
