import { neon } from "@neondatabase/serverless";

/**
 * One lazily-created Neon client. The serverless driver talks over HTTP, so
 * there is no pool to keep warm and no connection to leak between
 * invocations; DATABASE_URL is the pooled endpoint the integration set.
 */
let client: ReturnType<typeof neon> | null = null;

export function db() {
  if (!client) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not set");
    client = neon(url);
  }
  return client;
}
