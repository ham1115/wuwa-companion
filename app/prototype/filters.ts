"use client";

import { useMemo, useState } from "react";
import {
  CHARACTERS,
  type Character,
  type Element,
  type Role,
} from "@/data/characters";
import { useOwned } from "@/lib/owned";

/**
 * The Characters tab's filtering, lifted out so both prototypes narrow the
 * list the same way. Same fields and same matching as the shipping tab, so a
 * search here behaves exactly as it does there.
 */
export function useCharacterFilter() {
  const [query, setQuery] = useState("");
  const [el, setEl] = useState<Element | "all">("all");
  const [role, setRole] = useState<Role | "all">("all");
  const [rarity, setRarity] = useState<4 | 5 | "all">("all");
  const [ownedOnly, setOwnedOnly] = useState(false);
  const owned = useOwned();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CHARACTERS.filter((c) => {
      if (el !== "all" && c.element !== el) return false;
      if (role !== "all" && c.role !== role) return false;
      if (rarity !== "all" && c.rarity !== rarity) return false;
      if (ownedOnly && !owned.has(c.id)) return false;
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        c.sets.some((s) => s.toLowerCase().includes(q)) ||
        c.weapons.some((w) => w.toLowerCase().includes(q)) ||
        c.echoes.some((e) => e.toLowerCase().includes(q))
      );
    });
  }, [query, el, role, rarity, ownedOnly, owned.owned]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    query,
    setQuery,
    el,
    setEl,
    role,
    setRole,
    rarity,
    setRarity,
    ownedOnly,
    setOwnedOnly,
    owned,
    results: results as Character[],
  };
}
