-- One row per (signed-in user, storage key).
--
-- The app's state is already a set of independent keys in localStorage --
-- "owned", "acts", "plan", "theme" and so on -- so the table mirrors that
-- rather than inventing a schema the client would have to translate into.
-- Syncing stays per key, which means two devices editing different parts of
-- the app do not collide at all.
--
-- `updated_at` is the CLIENT's timestamp, not the server's, because the client
-- is the only place that knows when the person actually made the change: a row
-- pushed late after a spell offline must not look newer than an edit made on
-- another device since. The cost is that two devices with badly wrong clocks
-- could order edits wrongly, which is the usual trade for this kind of sync.
create table if not exists user_state (
  user_id    text        not null,
  key        text        not null,
  value      jsonb       not null,
  updated_at timestamptz not null,
  primary key (user_id, key)
);

-- Every query is "all rows for this user", which the primary key already
-- serves, so no extra index is needed.
