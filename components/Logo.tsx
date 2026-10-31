/**
 * The mark.
 *
 * Two things the app already says everywhere, put together: the cut top-left
 * corner that every card, row and pane carries, and a reading taken off
 * something — four bars rising and falling like a level meter. Resonance is
 * what the game calls its magic and the codex is a record of it, so a tile
 * with a measurement inside it is about as literal as a mark should get.
 *
 * It is drawn in currentColor alone, so it takes the accent from whichever
 * palette is picked and needs no second colour to sit on any background.
 * app/icon.svg is the same shape with the colours fixed, because a favicon
 * cannot ask the page what it is wearing.
 */
export default function Logo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {/* The chamfer: 10,2 across the top, then down the right, along the
        * bottom, up the left to 2,10, and the close cuts the corner. */}
      <path
        d="M10 2.6h15.4a4 4 0 0 1 4 4v18.8a4 4 0 0 1-4 4H6.6a4 4 0 0 1-4-4V10Z"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <g
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        opacity="0.92"
      >
        <path d="M10 19.5v-4" />
        <path d="M14.7 22.3v-9.6" />
        <path d="M19.4 20.6v-6.2" />
        <path d="M24.1 17.8v-1.6" />
      </g>
    </svg>
  );
}
