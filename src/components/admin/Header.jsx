import { LogOut } from 'lucide-react'
import { USER_STORAGE_KEY } from '../../services/api.js'

export default function AdminHeader({ title, onLogout }) {
  const handleLogout = () => {
    localStorage.removeItem(USER_STORAGE_KEY)
    onLogout?.()
    window.location.href = '/'
  }

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--color-app-border)] bg-white/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-6">
        <h1 className="text-xl font-semibold tracking-tight text-[var(--color-app-text)]">{title}</h1>
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-app-border)] bg-white px-4 py-2 text-sm font-medium text-[var(--color-app-text)] transition-colors hover:bg-[var(--color-app-bg)]"
        >
          <LogOut className="h-4 w-4" strokeWidth={1.8} />
          Logout
        </button>
      </div>
    </header>
  )
}
