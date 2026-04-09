import { Link } from 'react-router-dom'

/** Minimal marketing nav for the public landing page only. */
export default function Navbar() {
  return (
    <header className="border-b border-[var(--color-app-border)] bg-[var(--color-app-card)]">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="text-base font-semibold tracking-tight text-[var(--color-app-text)]"
        >
          PlaceConnect
        </Link>
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-sm font-medium text-[var(--color-app-muted)] hover:text-[var(--color-app-text)]"
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className="text-sm font-medium text-[var(--color-app-muted)] hover:text-[var(--color-app-text)]"
          >
            Register
          </Link>
        </div>
      </div>
    </header>
  )
}
