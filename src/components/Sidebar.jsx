import { NavLink } from 'react-router-dom'
import { LogOut, Menu, X } from 'lucide-react'

function navClass({ isActive }) {
  return [
    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
    isActive
      ? 'bg-[#f1f5f9] text-[var(--color-app-text)]'
      : 'text-[var(--color-app-muted)] hover:bg-[#f8fafc] hover:text-[var(--color-app-text)]',
  ].join(' ')
}

function SidebarInner({ items, onClose, onLogout, showClose }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-2 border-b border-[var(--color-app-border)] px-4 py-5">
        <div className="min-w-0">
          <span className="text-base font-semibold tracking-tight text-[var(--color-app-text)]">
            PlaceConnect
          </span>
          <p className="mt-0.5 text-xs text-[var(--color-app-muted)]">Placement Management</p>
        </div>
        {showClose ? (
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg p-2 text-[var(--color-app-muted)] hover:bg-[#f1f5f9]"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" strokeWidth={1.75} />
          </button>
        ) : null}
      </div>
      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-4">
        {items.map((item) => (
          <NavLink
            key={`${item.to}-${item.label}`}
            to={item.to}
            end={item.end === true}
            className={navClass}
            onClick={onClose}
          >
            {item.icon && (
              <item.icon className="h-[18px] w-[18px] shrink-0 opacity-80" strokeWidth={1.75} aria-hidden />
            )}
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto border-t border-[var(--color-app-border)] p-3">
        <button
          type="button"
          onClick={() => {
            onClose?.()
            onLogout?.()
          }}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--color-app-muted)] transition-colors hover:bg-[#f8fafc] hover:text-[var(--color-app-text)]"
        >
          <LogOut className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} aria-hidden />
          Logout
        </button>
      </div>
    </div>
  )
}

export default function Sidebar({ items, mobileOpen, onClose, onLogout }) {
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-56 border-r border-[var(--color-app-border)] bg-[var(--color-app-card)] lg:flex lg:flex-col">
        <SidebarInner items={items} onLogout={onLogout} />
      </aside>

      <div
        className={[
          'fixed inset-0 z-40 bg-[#0f172a]/20 transition lg:hidden',
          mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        ].join(' ')}
        aria-hidden={!mobileOpen}
        onClick={onClose}
      />

      <aside
        className={[
          'fixed inset-y-0 left-0 z-50 flex w-64 max-w-[85vw] flex-col border-r border-[var(--color-app-border)] bg-[var(--color-app-card)] shadow-[0_8px_24px_rgba(15,23,42,0.08)] transition-transform duration-200 lg:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        <SidebarInner items={items} onClose={onClose} onLogout={onLogout} showClose />
      </aside>
    </>
  )
}

export function SidebarMenuButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex rounded-lg p-2 text-[var(--color-app-muted)] transition-colors hover:bg-[#f1f5f9] lg:hidden"
      aria-label="Open menu"
    >
      <Menu className="h-5 w-5" strokeWidth={1.75} />
    </button>
  )
}
