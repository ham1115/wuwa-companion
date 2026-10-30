import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { MAX_VALUE_BYTES, isSyncedKey } from "@/lib/keys";

/**
 * The whole sync surface: read everything this user has stored, or push a
 * batch of changed keys.
 *
 * Signing in is optional in this app, so both verbs simply refuse anonymous
 * callers rather than redirecting — a signed-out visitor never calls this and
 * keeps working entirely from their own browser.
 */

export const runtime = "nodejs";
/** Never cached: it is per-user mutable state. */
export const dynamic = "force-dynamic";

type Row = { key: string; value: unknown; updated_at: string };

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Not signed in" }, { status: 401 });
  }

  const rows = (await db()`
    select key, value, updated_at
    from user_state
    where user_id = ${userId}
  `) as Row[];

  const entries: Record<string, { value: unknown; updatedAt: number }> = {};
  for (const row of rows) {
    entries[row.key] = {
      value: row.value,
      updatedAt: new Date(row.updated_at).getTime(),
    };
  }
  return Response.json({ entries });
}

type Incoming = { key: string; value: unknown; updatedAt: number };

export async function PUT(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Not signed in" }, { status: 401 });
  }

  let body: { entries?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Body is not JSON" }, { status: 400 });
  }

  if (!Array.isArray(body.entries)) {
    return Response.json({ error: "Expected { entries: [] }" }, { status: 400 });
  }

  const accepted: Incoming[] = [];
  for (const raw of body.entries as Incoming[]) {
    // Unknown keys are dropped rather than stored: the table is for this
    // app's own state, and a client is not allowed to invent new keys in it.
    if (!raw || typeof raw.key !== "string" || !isSyncedKey(raw.key)) continue;
    if (typeof raw.updatedAt !== "number" || !Number.isFinite(raw.updatedAt)) {
      continue;
    }
    if (JSON.stringify(raw.value ?? null).length > MAX_VALUE_BYTES) continue;
    accepted.push({
      key: raw.key,
      value: raw.value ?? null,
      updatedAt: raw.updatedAt,
    });
  }

  if (accepted.length === 0) {
    return Response.json({ written: 0, rejected: body.entries.length });
  }

  const sql = db();
  // Last write wins per key, and only forward: a push that is older than what
  // is already stored leaves the row alone. That is what lets a device come
  // back online and push safely without clobbering newer edits from another.
  for (const entry of accepted) {
    await sql`
      insert into user_state (user_id, key, value, updated_at)
      values (
        ${userId},
        ${entry.key},
        ${JSON.stringify(entry.value)}::jsonb,
        to_timestamp(${entry.updatedAt} / 1000.0)
      )
      on conflict (user_id, key) do update
        set value = excluded.value,
            updated_at = excluded.updated_at
        where user_state.updated_at < excluded.updated_at
    `;
  }

  return Response.json({
    written: accepted.length,
    rejected: body.entries.length - accepted.length,
  });
}
