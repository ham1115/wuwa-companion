/**
 * The storage keys this app owns.
 *
 * Deliberately not inside lib/storage.ts: that file is a client module, and
 * the sync API route needs this list on the server to reject keys it does not
 * recognise. Both import from here.
 */

export const PREFIX = "wuwa-companion:";

/** Every storage key this app owns, grouped so they can be reset per section. */
export const STORAGE_GROUPS = {
  characters: ["built", "char-notes", "owned", "loadout"],
  plan: ["plan", "build-steps", "plan-notes"],
  glossary: ["learned", "revealed", "notes"],
  story: ["acts", "priority-now"],
  routine: ["routine", "routine-day"],
  display: [
    "tab",
    "theme",
    "palette",
    "accent",
    "ink",
    "bg",
    "lemon",
    "my-palettes",
  ],
} as const;

export type StorageGroup = keyof typeof STORAGE_GROUPS;

export const ALL_KEYS: readonly string[] = Object.values(STORAGE_GROUPS).flat();

/**
 * Which keys travel between devices.
 *
 * Everything except `tab`: which tab you last had open is where you are in
 * this browser right now, not something you want jumping about because you
 * opened the app on your phone. The colours do sync — looking the same on
 * both devices is the point of saving a preset.
 */
export const SYNCED_KEYS: readonly string[] = ALL_KEYS.filter(
  (k) => k !== "tab"
);

const SYNCED = new Set(SYNCED_KEYS);

export const isSyncedKey = (key: string) => SYNCED.has(key);

/**
 * A ceiling on one key's stored JSON. The free-text notes are the only keys
 * that can grow without bound, and this is far above any real use of them
 * while still refusing a payload meant to fill the database.
 */
export const MAX_VALUE_BYTES = 256 * 1024;
