import { Inbox } from 'lucide-react'

export default function EmptyState({
  title = 'No data available',
  description = 'There is nothing to show here yet.',
  icon: Icon = Inbox,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-[var(--color-app-border)] bg-[var(--color-app-card)] px-8 py-16 text-center shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-[var(--color-app-border)] bg-[var(--color-app-bg)]">
        <Icon className="h-6 w-6 text-[var(--color-app-muted)]" strokeWidth={1.5} aria-hidden />
      </div>
      <h3 className="text-base font-semibold text-[var(--color-app-text)]">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-[var(--color-app-muted)]">{description}</p>
    </div>
  )
}
