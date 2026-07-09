"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { IconButton } from "./icon-button";

/**
 * Bottom sheet sobre <dialog> nativo (focus trap, Esc y top layer gratis).
 * Controlado: el padre es dueño de `open`; Esc y click en el backdrop
 * solo llaman `onClose`.
 */
export function Sheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      if (!dialog.open) dialog.showModal();
      document.documentElement.style.overflow = "hidden";
      // Dos frames: el primero pinta el estado cerrado (translateY(100%))
      // para que la transición al abrir corra siempre.
      const raf = requestAnimationFrame(() =>
        requestAnimationFrame(() => dialog.classList.add("open")),
      );
      return () => cancelAnimationFrame(raf);
    }

    dialog.classList.remove("open");
    document.documentElement.style.overflow = "";
    if (!dialog.open) return;

    const close = () => dialog.open && dialog.close();
    const timeout = setTimeout(close, 350);
    const onTransitionEnd = (event: TransitionEvent) => {
      if (event.target === dialog && event.propertyName === "transform") {
        clearTimeout(timeout);
        close();
      }
    };
    dialog.addEventListener("transitionend", onTransitionEnd);
    return () => {
      clearTimeout(timeout);
      dialog.removeEventListener("transitionend", onTransitionEnd);
    };
  }, [open]);

  useEffect(() => {
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="ui-sheet"
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
    >
      <div className="ui-sheet-head">
        <h2 id={titleId} className="text-h2">
          {title}
        </h2>
        <IconButton
          aria-label="Cerrar"
          onClick={onClose}
          className="h-11 w-11 border-0 bg-transparent"
        >
          <X size={20} strokeWidth={1.5} />
        </IconButton>
      </div>
      <div className="ui-sheet-body">{children}</div>
    </dialog>
  );
}

/** Footer sticky para las acciones del sheet; va al final del contenido (dentro del form). */
export function SheetFooter({ children }: { children: ReactNode }) {
  return <div className="ui-sheet-footer">{children}</div>;
}
