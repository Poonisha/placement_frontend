export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-[#0f172a]/30"
        aria-label="Close dialog"
        onClick={onCancel}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="app-card relative z-10 w-full max-w-md p-6 shadow-[0_12px_40px_rgba(15,23,42,0.12)]"
      >
        <h2 id="confirm-title" className="text-base font-semibold text-[var(--color-app-text)]">
          {title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-app-muted)]">{message}</p>
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <button type="button" onClick={onCancel} className="btn-secondary">
            {cancelLabel}
          </button>
          <button type="button" onClick={onConfirm} className="btn-primary">
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
