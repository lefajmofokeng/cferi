"use client";

import "./ConfirmDialog.css";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  id?: string;
};

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  onConfirm,
  onCancel,
  id = "confirm-dialog",
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <section id={id} className="confirm-dialog-wrapper">
      <div className="confirm-dialog__overlay" onClick={onCancel} />
      <div
        className="confirm-dialog__container"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
      >
        <h2 id="confirm-dialog-title" className="confirm-dialog__title">
          {title}
        </h2>
        {description && (
          <p className="confirm-dialog__description">{description}</p>
        )}
        <div className="confirm-dialog__actions">
          <button
            type="button"
            onClick={onCancel}
            className="confirm-dialog__button confirm-dialog__button--cancel"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="confirm-dialog__button confirm-dialog__button--confirm"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </section>
  );
}