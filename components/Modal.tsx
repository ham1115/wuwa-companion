"use client";

import { useCallback, useEffect, useRef, type ReactNode } from "react";

/**
 * A centred sheet over the page, on the native <dialog>.
 *
 * Using the element rather than a div means Escape, the focus trap, the
 * inert background and the backdrop are all the browser's own, which is a
 * great deal of behaviour not to have to write or get wrong. The click
 * handler is the one part that is not free: a click on the backdrop lands on
 * the dialog element itself, so a target check distinguishes it from a click
 * on the content inside.
 *
 * Children are only mounted while it is open. An Echo body is small, but 187
 * of them mounted behind a closed dialog would not be.
 */
export default function Modal({
  open,
  onClose,
  label,
  children,
}: {
  open: boolean;
  onClose: () => void;
  /** Names the dialog for a screen reader, since the heading is in children. */
  label: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  /* Escape closes the dialog without going through onClose, so the state
   * that opened it has to hear about it from the element. */
  const handleClose = useCallback(() => {
    if (ref.current && !ref.current.open) onClose();
  }, [onClose]);

  return (
    <dialog
      ref={ref}
      className="sheet"
      aria-label={label}
      onClose={handleClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      {open && (
        <div className="sheet-inner">
          <button className="sheet-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
          {children}
        </div>
      )}
    </dialog>
  );
}
