/**
 * @param {{ totalJobs: number, applied: number, shortlisted: number }} stats
 * @param {boolean} loading
 */
export default function StudentStatsCards({ stats, loading }) {
  const items = [
    { label: 'Total jobs', value: stats.totalJobs },
    { label: 'Applied', value: stats.applied },
    { label: 'Shortlisted', value: stats.shortlisted },
  ]

  return (
    <div className="mb-8 grid gap-4 sm:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="app-card rounded-xl px-5 py-4 transition-shadow duration-150 hover:shadow-[0_4px_12px_rgba(15,23,42,0.06)]"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-app-muted)]">
            {item.label}
          </p>
          <p className="mt-2 text-2xl font-semibold tabular-nums text-[var(--color-app-text)]">
            {loading ? '—' : item.value}
          </p>
        </div>
      ))}
    </div>
  )
}
