import { Search } from 'lucide-react'

/**
 * Controlled search input with leading icon (minimal corporate style).
 * @param {{ value: string, onChange: (value: string) => void, placeholder?: string, id?: string }} props
 */
export default function SearchBar({ value, onChange, placeholder = 'Search…', id = 'dashboard-search' }) {
  return (
    <div className="relative mb-6 w-full max-w-xl">
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-app-muted)]"
        strokeWidth={1.75}
        aria-hidden
      />
      <input
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        className="w-full rounded-lg border border-[var(--color-app-border)] bg-[var(--color-app-card)] py-2.5 pl-10 pr-3 text-sm text-[var(--color-app-text)] outline-none transition-colors duration-150 placeholder:text-[var(--color-app-muted)] focus:border-[var(--color-app-muted)] focus:ring-1 focus:ring-[var(--color-app-muted)]"
      />
    </div>
  )
}
