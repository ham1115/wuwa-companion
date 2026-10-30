"use client";

import { useCallback } from "react";
import { OWNED } from "@/data/characters";
import { usePersistentState } from "./storage";

/**
 * Which characters the viewer owns. Starts empty (OWNED in data/characters.ts
 * is deliberately blank) and lives in the browser, so each player builds their
 * own list in Settings or loads one from a profile.
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

  return { owned, has, toggle, clear, hydrated };
}
