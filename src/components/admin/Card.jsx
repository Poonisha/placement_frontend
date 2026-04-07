export default function AdminCard({ title, value, icon: Icon, delta }) {
  return (
    <article className="rounded-xl border border-[var(--color-app-border)] bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.06)] transition-shadow duration-200">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-[var(--color-app-muted)]">{title}</p>
        {Icon ? (
          <span className="rounded-lg border border-[var(--color-app-border)] bg-[var(--color-app-bg)] p-2 text-[var(--color-app-muted)]">
            <Icon className="h-4 w-4" strokeWidth={1.8} />
          </span>
        ) : null}
      </div>
      <p className="mt-4 text-3xl font-semibold tracking-tight text-[var(--color-app-text)]">{value}</p>
      {delta ? <p className="mt-2 text-xs font-medium text-emerald-700">{delta}</p> : null}
    </article>
  )
}
