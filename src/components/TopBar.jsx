import { Link } from 'react-router-dom'

export default function TopBar({ title, onLogout, showProfile }) {
  return (
    <div className="flex h-14 w-full items-center justify-between gap-4 py-0 pr-2 sm:pr-4 lg:h-16 lg:pr-6">
      <h1 className="min-w-0 truncate text-base font-semibold text-[var(--color-app-text)] lg:text-lg">
        {title}
      </h1>
      <div className="flex shrink-0 items-center gap-2">
        {showProfile ? (
          <Link
            to="/profile"
            className="rounded-lg border border-[var(--color-app-border)] bg-[var(--color-app-card)] px-3 py-2 text-sm font-medium text-[var(--color-app-text)] transition-colors hover:bg-[var(--color-app-bg)]"
          >
            Profile
          </Link>
        ) : null}
        <button
          type="button"
          onClick={onLogout}
          className="rounded-lg border border-[var(--color-app-border)] bg-[var(--color-app-card)] px-4 py-2 text-sm font-medium text-[var(--color-app-text)] transition-colors hover:bg-[var(--color-app-bg)]"
        >
          Logout
        </button>
      </div>
    </div>
  )
}
