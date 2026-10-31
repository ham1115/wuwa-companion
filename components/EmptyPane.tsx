"use client";

import type { ReactNode } from "react";
import DataField from "./DataField";

/**
 * What a detail pane shows before anything is picked.
 *
 * The bits behind the words spell the title, which is why the title is also
 * written out in front of them. The field is decoration that happens to be
 * honest, not a second way of saying something.
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
      <DataField message={title} />
      <div className="char-nobody-say">
        <h2>{title}</h2>
        <p>{children}</p>
      </div>
    </div>
  );
}
