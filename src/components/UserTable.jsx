import { Trash2 } from 'lucide-react'
import LoadingSpinner from './LoadingSpinner.jsx'
import EmptyState from './EmptyState.jsx'

export default function UserTable({
  users,
  loading,
  onDelete,
  deletingId,
  emptyTitle = 'No data available',
  emptyDescription = 'There are no registered users to display.',
}) {
  if (loading) {
    return <LoadingSpinner label="Loading users…" />
  }

  if (!users?.length) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />
  }

  return (
    <div className="app-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--color-app-border)] bg-[var(--color-app-bg)]">
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--color-app-muted)] sm:px-5">
                ID
              </th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--color-app-muted)] sm:px-5">
                Email
              </th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--color-app-muted)] sm:px-5">
                Role
              </th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--color-app-muted)] sm:px-5">
                Name
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-[var(--color-app-muted)] sm:px-5">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr
                key={u.id ?? u.email}
                className={[
                  'border-b border-[var(--color-app-border)] last:border-0',
                  i % 2 === 0 ? 'bg-[var(--color-app-card)]' : 'bg-[#f8fafc]',
                ].join(' ')}
              >
                <td className="px-4 py-3 text-[var(--color-app-muted)] sm:px-5">{u.id ?? '—'}</td>
                <td className="px-4 py-3 font-medium text-[var(--color-app-text)] sm:px-5">
                  {u.email ?? '—'}
                </td>
                <td className="px-4 py-3 sm:px-5">
                  <span className="inline-block rounded border border-[var(--color-app-border)] bg-[var(--color-app-bg)] px-2 py-0.5 text-xs font-medium text-[var(--color-app-muted)]">
                    {u.role ?? '—'}
                  </span>
                </td>
                <td className="px-4 py-3 text-[var(--color-app-muted)] sm:px-5">
                  {u.name ?? u.fullName ?? '—'}
                </td>
                <td className="px-4 py-3 text-right sm:px-5">
                  <button
                    type="button"
                    disabled={deletingId === u.id}
                    onClick={() => onDelete(u)}
                    className="btn-danger disabled:opacity-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
