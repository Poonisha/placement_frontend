/**
 * Status badge colors: APPLIED (gray), SHORTLISTED / SELECTED (green), REJECTED (red).
 */
export function getApplicationStatusStyles(status) {
  const s = String(status ?? '')
    .trim()
    .toUpperCase()
    .replace(/^ROLE_/, '')
  if (s === 'REJECTED') {
    return 'border-red-200 bg-red-50 text-red-800'
  }
  if (s === 'SHORTLISTED' || s === 'SELECTED') {
    return 'border-emerald-200 bg-emerald-50 text-emerald-800'
  }
  if (s === 'APPLIED') {
    return 'border-slate-200 bg-slate-100 text-slate-700'
  }
  return 'border-[var(--color-app-border)] bg-[var(--color-app-bg)] text-[var(--color-app-muted)]'
}

function formatAppliedAt(value) {
  if (value == null) return null
  if (typeof value === 'string') {
    const d = new Date(value)
    return Number.isNaN(d.getTime()) ? value : d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
  }
  return String(value)
}

export default function StudentApplicationCard({ row }) {
  const job = row.job
  const title = job?.title ?? row.jobTitle ?? row.title ?? '—'
  const company = job?.companyName ?? row.companyName ?? row.company ?? '—'
  const status = row.status ?? row.applicationStatus ?? '—'
  const applied = formatAppliedAt(row.appliedAt ?? row.applied_at)

  return (
    <article className="app-card flex flex-col gap-3 rounded-xl p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <h3 className="text-base font-semibold text-[var(--color-app-text)]">{title}</h3>
        <p className="mt-1 text-sm text-[var(--color-app-muted)]">{company}</p>
        {applied ? (
          <p className="mt-2 text-xs text-[var(--color-app-muted)]">Applied {applied}</p>
        ) : null}
      </div>
      <div className="flex shrink-0 items-center sm:pl-4">
        <span
          className={`inline-flex rounded-lg border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide ${getApplicationStatusStyles(status)}`}
        >
          {String(status)}
        </span>
      </div>
    </article>
  )
}
