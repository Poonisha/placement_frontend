import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar, { SidebarMenuButton } from './Sidebar.jsx'
import TopBar from './TopBar.jsx'
import { USER_STORAGE_KEY } from '../services/api.js'

export default function DashboardLayout({ user, onLogout, sidebarItems, title, children }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    if (!window.confirm('Are you sure you want to logout?')) return
    localStorage.removeItem(USER_STORAGE_KEY)
    onLogout?.()
    navigate('/', { replace: true })
  }

  return (
    <div className="min-h-screen bg-[var(--color-app-bg)]">
      <Sidebar
        items={sidebarItems}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onLogout={handleLogout}
      />
      <div className="flex min-h-screen flex-col lg:pl-56">
        <div className="sticky top-0 z-20 flex flex-col border-b border-[var(--color-app-border)] bg-[var(--color-app-card)]">
          <div className="flex items-center gap-2 px-4 lg:pl-8 lg:pr-0">
            <div className="shrink-0 py-3 lg:hidden">
              <SidebarMenuButton onClick={() => setMobileOpen(true)} />
            </div>
            <div className="min-w-0 flex-1">
              <TopBar title={title} onLogout={handleLogout} />
            </div>
          </div>
        </div>
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
