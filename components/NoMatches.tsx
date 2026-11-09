/**
 * The empty result of a filtered list. It names what is filtering, because a
 * collapsed Filters panel or a lemon chip left on is usually the answer, and
 * it clears them in one tap rather than sending you hunting for each.
 */
export default function NoMatches({
  parts,
  onClear,
}: {
  /** What is narrowing the list right now, e.g. `"hav"`, `5★`, `Havoc`. */
  parts: string[];
  onClear: () => void;
}) {
  return (
    <div className="empty">
      <p>
        {parts.length > 0
          ? `Nothing matches ${parts.join(" + ")}.`
          : "Nothing matches."}
      </p>
      {parts.length > 0 && (
        <button className="mini" onClick={onClear}>
          Clear filters
        </button>
      )}
    </div>
  );
}
