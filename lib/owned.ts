"use client";

import { useCallback } from "react";
import { OWNED } from "@/data/characters";
import { usePersistentState } from "./storage";

/**
 * Which characters the viewer owns. Seeded from OWNED in data/characters.ts the
 * first time, then owned by the browser so each player edits their own list.
 */
export function useOwned() {
  const [owned, setOwned, hydrated] = usePersistentState<string[]>("owned", OWNED);

  const has = useCallback((id: string) => owned.includes(id), [owned]);

  const toggle = useCallback(
    (id: string) =>
      setOwned((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      ),
    [setOwned]
  );

  const clear = useCallback(() => setOwned([]), [setOwned]);
  const reseed = useCallback(() => setOwned(OWNED), [setOwned]);

  return { owned, has, toggle, clear, reseed, hydrated };
}
