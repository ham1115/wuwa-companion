"use client";

import type { ReactNode } from "react";
import ResonanceField from "./ResonanceField";

/**
 * What a detail pane shows before anything is picked.
 *
 * The field behind the words is decoration and nothing else, which is why it
 * is aria-hidden and why anything worth knowing is written out rather than
 * left for it to imply.
 */
export default function EmptyPane({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="char-nobody">
      <ResonanceField />
      <div className="char-nobody-say">
        <h2>{title}</h2>
        <p>{children}</p>
      </div>
    </div>
  );
}
