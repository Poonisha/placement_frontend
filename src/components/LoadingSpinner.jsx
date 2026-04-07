import { Loader2 } from 'lucide-react'

export default function LoadingSpinner({ label = 'Loading…', className = '' }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 py-16 text-[var(--color-app-muted)] ${className}`}
      role="status"
      aria-live="polite"
    >
      <Loader2 className="h-8 w-8 animate-spin text-[var(--color-app-muted)]" strokeWidth={1.5} aria-hidden />
      <p className="text-sm font-medium">{label}</p>
    </div>
  )
}
