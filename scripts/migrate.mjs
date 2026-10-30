/**
 * Applies db/schema.sql. Run with:
 *   node --env-file=.env.local scripts/migrate.mjs
 *
 * The statements are written to be safe to re-run.
 */
import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set. Run: vercel env pull");
  process.exit(1);
}

const sql = neon(url);
const text = readFileSync(new URL("../db/schema.sql", import.meta.url), "utf8");

// Split on semicolons that end a statement, ignoring the comment blocks.
const statements = text
  .split(/;\s*$/m)
  .map((s) => s.trim())
  .filter((s) => s && !s.split("\n").every((l) => l.trim().startsWith("--")));

for (const statement of statements) {
  await sql.query(statement);
  console.log("ok:", statement.split("\n").find((l) => !l.trim().startsWith("--"))?.slice(0, 60));
}

const [{ count }] = await sql.query(
  "select count(*)::int as count from user_state"
);
console.log(`user_state exists, ${count} row(s)`);
