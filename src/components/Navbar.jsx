import { Link } from 'react-router-dom'

/** Minimal marketing nav for the public landing page only. */
export default function Navbar() {
  return (
    <header className="border-b border-[var(--color-app-border)] bg-[var(--color-app-card)]">
      <div className="mx-auto flex h-14 max-w-6xl items-center px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="text-base font-semibold tracking-tight text-[var(--color-app-text)]"
        >
          PlaceConnect
        </Link>
      </div>
    </header>
  )
}
