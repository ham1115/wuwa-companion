"use client";

import { useEffect, useState, type ReactNode } from "react";

/**
 * A button for something that cannot be taken back. The first tap arms it and
 * says so in place; a second tap within four seconds does it. No modal, so a
 * one-handed phone tap never has to find a dialog, and an accidental brush
 * does nothing but change a label.
 */
export default function ConfirmButton({
  onConfirm,
  children,
  confirmLabel = "Tap again to confirm",
  className,
  disabled,
}: {
  onConfirm: () => void;
  children: ReactNode;
  confirmLabel?: string;
  className?: string;
  disabled?: boolean;
}) {
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (!armed) return;
    const t = setTimeout(() => setArmed(false), 4000);
    return () => clearTimeout(t);
  }, [armed]);

  return (
    <button
      className={className}
      data-on={armed || undefined}
      disabled={disabled}
      onClick={() => {
        if (armed) {
          setArmed(false);
          onConfirm();
        } else {
          setArmed(true);
        }
      }}
    >
      {armed ? confirmLabel : children}
    </button>
  );
}
