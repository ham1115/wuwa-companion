import Link from "next/link";
import "./prototype.css";

export const metadata = {
  title: "Layout prototypes",
  robots: { index: false, follow: false },
};

/**
 * An index, so /prototype is not a 404 while the two below are being judged.
 * The whole folder is throwaway: deleting app/prototype removes every part of
 * this, and nothing in the app links to it.
 */
export default function Page() {
  return (
    <main className="proto">
      <header className="proto-top">
        <div>
          <h1>Layout prototypes</h1>
          <p className="proto-sub">
            Two ways the Characters tab could use a desktop window, both
            running on the real 61 Resonators and the real build components.
            Open each at a full window and then at phone width.
          </p>
        </div>
        <nav className="proto-switch">
          <Link href="/" className="proto-back">
            Back to the app
          </Link>
        </nav>
      </header>

      <div className="pb-grid">
        <Link className="pb-card" href="/prototype/a">
          <span className="pb-name">A — list beside detail</span>
          <span className="pb-meta">
            Names in a column on the left, the whole build beside them. The
            page never scrolls; each pane scrolls on its own.
            <br />
            <span className="check-detail">
              Always has someone open. Best for reading one character.
            </span>
          </span>
        </Link>

        <Link className="pb-card" href="/prototype/b">
          <span className="pb-name">B — card grid</span>
          <span className="pb-meta">
            The roster as cards, each carrying its top weapon and sonata. The
            build opens in a panel over the grid.
            <br />
            <span className="check-detail">
              Opens on everything at once. Best for browsing what you have.
            </span>
          </span>
        </Link>
      </div>
    </main>
  );
}
