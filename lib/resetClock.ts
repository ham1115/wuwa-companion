/**
 * When the daily and weekly checklists start over.
 *
 * The game resets on its server's clock, not the player's, and the three
 * regions are not in one time zone. Midnight UTC, which this app used before,
 * lands mid-afternoon for some players and in the middle of a session for
 * others, so a ticked daily could clear while they were still playing it.
 *
 * The reset hour and the region offsets are the game's published schedule as
 * the maintainer knows it; they are not read from a data source in this repo.
 * "Device time" is there for anyone whose server is not listed, or who would
 * rather the list followed their own morning.
 */

/** Hour of the server day at which daily and weekly lists start over. */
export const RESET_HOUR = 4;

export type ServerId = "local" | "america" | "europe" | "asia";

export const SERVERS: { id: ServerId; label: string; offsetMin: number | null }[] = [
  { id: "local", label: "Device time", offsetMin: null },
  { id: "america", label: "America (UTC-5)", offsetMin: -5 * 60 },
  { id: "europe", label: "Europe (UTC+1)", offsetMin: 1 * 60 },
  { id: "asia", label: "Asia, SEA, TW-HK-MO (UTC+8)", offsetMin: 8 * 60 },
];

/**
 * The day and the Monday-started week that `now` falls in, on that server's
 * clock with the reset hour taken off. Two moments get the same key exactly
 * when no reset separates them, which is all the checklist needs to know.
 */
export function periodKeys(
  server: ServerId,
  now: Date = new Date()
): { day: string; week: string } {
  const entry = SERVERS.find((s) => s.id === server) ?? SERVERS[0];
  const offset = entry.offsetMin ?? -now.getTimezoneOffset();
  // Shifting the instant so its UTC fields read as the server's wall clock,
  // less the reset hour, means the date part is the reset-adjusted date.
  const shifted = new Date(now.getTime() + (offset - RESET_HOUR * 60) * 60_000);
  const day = shifted.toISOString().slice(0, 10);
  const sinceMonday = (shifted.getUTCDay() + 6) % 7;
  const monday = new Date(shifted.getTime() - sinceMonday * 86_400_000);
  return { day, week: monday.toISOString().slice(0, 10) };
}
