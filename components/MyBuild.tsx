"use client";

import { useMemo, useState } from "react";
import type { Character } from "@/data/characters";
import { SONATA_SETS } from "@/data/echoes";
import { TARGETS, targetFloor } from "@/data/targets";
import { WEAPONS, baseWeaponName } from "@/data/weapons";
import { MAX_LEVEL, MAX_SEQUENCE, useLoadout } from "@/lib/loadout";

/**
 * What this character is actually running, next to what the guides recommend.
 * Everything here is optional — an untouched character shows empty fields and
 * nothing else.
 *
 * `onLevelMaxed` fires the moment the level is set to 90, and only on the
 * transition. The build queue uses it to ask whether the character is finished;
 * the Characters tab passes nothing, because a character that is not queued has
 * nothing to be dropped from.
 */
export default function MyBuild({
  c,
  onLevelMaxed,
}: {
  c: Character;
  onLevelMaxed?: (id: string) => void;
}) {
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

  /*
   * Why a shortfall might not mean the build is wrong. The targets are quoted
   * at a finished Lv.90 build, and at a particular Resonance Chain — 5-stars
   * at S0, 4-stars and free characters at S6 — so a figure below them is only
   * readable once you know where this character actually is. Each of these
   * only appears when the player has told us the thing it depends on.
   */
  const caveats: string[] = [];
  if (mine.level !== undefined && mine.level < MAX_LEVEL) {
    caveats.push(
      `every target is a Lv.${MAX_LEVEL} figure and this character is Lv.${mine.level}`
    );
  }
  if (mine.weaponLevel !== undefined && mine.weaponLevel < MAX_LEVEL) {
    caveats.push(
      `the weapon is Lv.${mine.weaponLevel} rather than ${MAX_LEVEL}, which is ATK the targets assume you have`
    );
  }
  if (mine.sequence !== undefined) {
    if (c.rarity === 5 && mine.sequence > 0) {
      caveats.push(
        `the targets are quoted at S0 and this character is S${mine.sequence}, so they are the floor rather than the aim`
      );
    } else if (c.rarity === 4 && mine.sequence < MAX_SEQUENCE) {
      caveats.push(
        `the targets for a 4-star assume S${MAX_SEQUENCE} and this character is S${mine.sequence}`
      );
    }
  }

  return (
    <>
      <h2 className="section">My build</h2>

      <div className="mine-row">
        <label className="mine-field">
          <span className="target-label">Current level</span>
          <input
            className="picker"
            type="number"
            inputMode="numeric"
            min={1}
            max={MAX_LEVEL}
            step={1}
            placeholder={`1–${MAX_LEVEL}`}
            value={mine.level ?? ""}
            onChange={(e) => {
              const before = mine.level;
              loadout.setLevel(c.id, e.target.value);
              const after = Math.floor(Number(e.target.value));
              if (after === MAX_LEVEL && before !== MAX_LEVEL) onLevelMaxed?.(c.id);
            }}
          />
        </label>

        <label className="mine-field">
          <span className="target-label">Sequence</span>
          <input
            className="picker"
            type="number"
            inputMode="numeric"
            min={0}
            max={MAX_SEQUENCE}
            step={1}
            placeholder={`S0–S${MAX_SEQUENCE}`}
            value={mine.sequence ?? ""}
            onChange={(e) => loadout.setNumber(c.id, "sequence", e.target.value)}
          />
        </label>

        <label className="mine-field">
          <span className="target-label">Weapon level</span>
          <input
            className="picker"
            type="number"
            inputMode="numeric"
            min={1}
            max={MAX_LEVEL}
            step={1}
            placeholder={`1–${MAX_LEVEL}`}
            value={mine.weaponLevel ?? ""}
            onChange={(e) => loadout.setNumber(c.id, "weaponLevel", e.target.value)}
          />
        </label>

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
              {caveats.length > 0 && (
                <p className="check-detail">
                  Read the shortfalls as a distance, not a verdict:{" "}
                  {caveats.join("; ")}.
                </p>
              )}
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

      {(mine.weapon ||
        mine.set ||
        mine.level !== undefined ||
        mine.sequence !== undefined ||
        mine.weaponLevel !== undefined ||
        filled > 0) && (
        <div className="queue-controls">
          <button className="mini" onClick={() => loadout.clear(c.id)}>
            Clear my build
          </button>
        </div>
      )}
    </>
  );
}
