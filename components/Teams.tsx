"use client";

import { CHARACTERS } from "@/data/characters";
import { TEAMS, TEAMS_DISCLAIMER, teamsFeaturing, type Team } from "@/data/teams";
import { useOwned } from "@/lib/owned";

const BY_ID = new Map(CHARACTERS.map((c) => [c.id, c]));
const nameOf = (id: string) => BY_ID.get(id)?.name ?? id;

/**
 * The teams this character is recommended in, and the teams other characters
 * want them for. Renders nothing when neither exists, the same way Targets
 * does for a character with no published numbers.
 *
 * Each slot shows its pick first; the guide's substitutes for that same slot
 * follow in its order. Owned characters are marked, so a team you can field
 * today is readable at a glance from a team you cannot.
 */
export default function Teams({ id }: { id: string }) {
  const owned = useOwned();
  const own = TEAMS[id] ?? [];

  // Everyone else's teams that list this character anywhere, including as a
  // substitute — the reverse lookup, in the spirit of the Weapons tab's
  // "Wanted by". Supports like Verina turn up in dozens, so this is a list of
  // who wants them rather than dozens of repeated team layouts.
  const wantedBy = [
    ...new Set(
      teamsFeaturing(id)
        .map((t) => t.owner)
        .filter((owner) => owner !== id)
    ),
  ].sort((a, b) => nameOf(a).localeCompare(nameOf(b)));

  if (own.length === 0 && wantedBy.length === 0) return null;

  return (
    <>
      {own.length > 0 && (
        <>
          <h2 className="section">Recommended teams</h2>
          <div className="team-list">
            {groupByName(own).map((group, i) => (
              <div className="team-group" key={i}>
                <div className="team-comp-head">
                  <span className="team-comp-name">{cleanName(group.name)}</span>
                  {group.element && (
                    <span className="el" data-el={group.element}>
                      {group.element}
                    </span>
                  )}
                  {group.teams.length > 1 && (
                    <span className="side-pill">
                      {group.teams.length} variants
                    </span>
                  )}
                </div>
                {group.teams.map((team, j) => (
                  <TeamRow key={j} team={team} self={id} isOwned={owned.has} />
                ))}
              </div>
            ))}
          </div>
          <p className="check-detail">{TEAMS_DISCLAIMER}</p>
        </>
      )}

      {wantedBy.length > 0 && (
        <>
          <h2 className="section">Wanted in teams for</h2>
          <p className="team-wanted">
            {wantedBy.map((other) => (
              <span
                className="team-member"
                key={other}
                data-owned={owned.has(other)}
              >
                {nameOf(other)}
              </span>
            ))}
          </p>
        </>
      )}
    </>
  );
}

/**
 * The source publishes one named team with several interchangeable line-ups
 * under it, which the data file flattens into one entry each. Putting them
 * back under a single heading stops the same name being printed five times.
 */
function groupByName(teams: Team[]) {
  const groups: { name: string; element: string | null; teams: Team[] }[] = [];
  for (const team of teams) {
    const last = groups[groups.length - 1];
    if (last && last.name === team.name) last.teams.push(team);
    else groups.push({ name: team.name, element: team.element, teams: [team] });
  }
  return groups;
}

/** "Team #1: Best Team" and "Team #1 - Best Team" both just mean "Best Team". */
function cleanName(name: string) {
  const stripped = name.replace(/^team\s*#\d+\s*[:–—-]?\s*/i, "").trim();
  return stripped || "Best team";
}

function TeamRow({
  team,
  self,
  isOwned,
}: {
  team: Team;
  self: string;
  isOwned: (id: string) => boolean;
}) {
  return (
    <div className="team-comp">
      <div className="team-slots">
        {team.slots.map((slot, i) => (
          <div className="team-slot" key={i}>
            <span
              className="team-member"
              data-owned={isOwned(slot.character)}
              data-self={slot.character === self}
            >
              {nameOf(slot.character)}
            </span>
            {(slot.alternates ?? []).map((alt) => (
              <span
                className="team-member"
                data-alt
                data-owned={isOwned(alt)}
                data-self={alt === self}
                key={alt}
              >
                {nameOf(alt)}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
