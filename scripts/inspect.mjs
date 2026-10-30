/** Read-only: what the sync table actually holds. No values printed. */
import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.DATABASE_URL);
const rows = await sql`
  select key, length(value::text) as bytes,
         to_char(updated_at, 'HH24:MI:SS') as at
  from user_state order by key
`;
const users = await sql`select count(distinct user_id)::int as n from user_state`;
console.log(`distinct users: ${users[0].n}`);
console.table(rows);
