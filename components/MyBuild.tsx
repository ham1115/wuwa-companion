"use client";

import { useMemo, useState } from "react";
import type { Character } from "@/data/characters";
import { SONATA_SETS } from "@/data/echoes";
import { TARGETS, targetFloor } from "@/data/targets";
import { WEAPONS, baseWeaponName } from "@/data/weapons";
import { useLoadout } from "@/lib/loadout";

/**
 * What this character is actually running, next to what the guides recommend.
 * Everything here is optional — an untouched character shows two empty pickers
 * and nothing else.
 */
export default function MyBuild({ c }: { c: Character }) {
  const loadout = useLoadout();
  const mine = loadout.get(c.id);
  const [comparing, setComparing] = useState(false);

  const targets = TARGETS[c.id] ?? [];

  // Recommended options first, then everything else that fits the character.
  const weaponChoices = useMemo(() => {
    const ranked = c.weapons.map(baseWeaponName);
    const fits = WEAPONS.filter((w) => w.type === c.weaponType).map((w) => w.name);
    const rest = fits.filter((n) => !ranked.includes(n)).sort();
    return { ranked: ranked.filter((n) => fits.includes(n)), rest };
  }, [c]);

  const setChoices = useMemo(() => {
    const all = SONATA_SETS.map((s) => s.name);
    return { ranked: c.sets.filter((s) => all.includes(s)), rest: all.filter((s) => !c.sets.includes(s)).sort() };
  }, [c]);

  const offMeta = {
    weapon: Boolean(mine.weapon) && !weaponChoices.ranked.includes(mine.weapon!),
    set: Boolean(mine.set) && !setChoices.ranked.includes(mine.set!),
  };

  const filled = Object.keys(mine.stats ?? {}).length;

  return (
    <>
      <h2 className="section">My build</h2>

      <div className="mine-row">
        <label className="mine-field">
          <span className="target-label">Weapon</span>
          <select
            className="picker"
            value={mine.weapon ?? ""}
            onChange={(e) => loadout.setField(c.id, "weapon", e.target.value)}
          >
            <option value="">Not set</option>
            {weaponChoices.ranked.length > 0 && (
              <optgroup label="Recommended">
                {weaponChoices.ranked.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </optgroup>
            )}
            <optgroup label={`Other ${c.weaponType}`}>
              {weaponChoices.rest.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </optgroup>
          </select>
        </label>

        <label className="mine-field">
          <span className="target-label">Sonata set</span>
          <select
            className="picker"
            value={mine.set ?? ""}
            onChange={(e) => loadout.setField(c.id, "set", e.target.value)}
          >
            <option value="">Not set</option>
            {setChoices.ranked.length > 0 && (
              <optgroup label="Recommended">
                {setChoices.ranked.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </optgroup>
            )}
            <optgroup label="Other sets">
              {setChoices.rest.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </optgroup>
          </select>
        </label>
      </div>

      {(offMeta.weapon || offMeta.set) && (
        <p className="check-detail">
          {offMeta.weapon && offMeta.set
            ? "Neither your weapon nor your set is on this character's recommended list."
            : offMeta.weapon
              ? "That weapon is not on this character's recommended list."
              : "That set is not on this character's recommended list."}{" "}
          Fine if it is what you have — a complete off-meta set still beats an
          incomplete recommended one.
        </p>
      )}

      {targets.length > 0 && (
        <>
          <div className="queue-controls">
            <button
              className="mini"
              data-on={comparing || filled > 0}
              onClick={() => setComparing(!comparing)}
            >
              {comparing
                ? "Hide my stats"
                : filled > 0
                  ? `My stats (${filled} of ${targets.length})`
                  : "Compare my stats"}
            </button>
          </div>

          {comparing && (
            <>
              <p className="check-detail">
                Read these off the in-game stat screen with the character active
                in your party. Leave anything you do not care about blank.
              </p>
              <div className="compare">
                {targets.map((t) => {
                  const floor = targetFloor(t.value);
                  const raw = mine.stats?.[t.label] ?? "";
                  const got = parseFloat(raw.replace(/[,%\s]/g, ""));
                  const known = raw !== "" && !Number.isNaN(got) && floor !== null;
                  const met = known && got >= floor.min;

                  return (
                    <div className="compare-row" key={t.label} data-met={known ? met : undefined}>
                      <span className="compare-label">{t.label}</span>
                      <span className="compare-target">{t.value}</span>
                      <input
                        className="compare-input"
                        type="text"
                        inputMode="decimal"
                        placeholder="yours"
                        value={raw}
                        onChange={(e) => loadout.setStat(c.id, t.label, e.target.value)}
                        aria-label={`Your ${t.label}`}
                      />
                      <span className="compare-verdict">
                        {!known
                          ? ""
                          : met
                            ? "✓"
                            : `−${Math.round((floor.min - got) * 10) / 10}${floor.percent ? "%" : ""}`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </>
      )}

      {(mine.weapon || mine.set || filled > 0) && (
        <div className="queue-controls">
          <button className="mini" onClick={() => loadout.clear(c.id)}>
            Clear my build
          </button>
        </div>
      )}
    </>
  );
}
