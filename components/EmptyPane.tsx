"use client";

import type { ReactNode } from "react";
import Sprite from "./Sprite";

/**
 * What a detail pane shows before anything is picked.
 *
 * The sprite behind the words is decoration and nothing else, which is why
 * it is aria-hidden and why anything worth knowing is written out.
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
      <Sprite />
      <div className="char-nobody-say">
        <h2>{title}</h2>
        <p>{children}</p>
      </div>
    </div>
  );
}
