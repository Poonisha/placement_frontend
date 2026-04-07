import { LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { USER_STORAGE_KEY } from '../services/api.js'
import POSidebar from '../components/po/POSidebar.jsx'

export default function POLayout({ title, children }) {
  const { logout } = useAuth()

  const handleLogout = () => {
    localStorage.removeItem(USER_STORAGE_KEY)
    logout?.()
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen flex bg-[#eef2f6]">
      <POSidebar />
      <div className="flex-1 bg-[#eef2f6]">
        <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/95 backdrop-blur">
          <div className="flex h-16 items-center justify-between px-6">
            <h1 className="text-xl font-semibold tracking-tight text-gray-800">{title}</h1>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-100"
            >
              <LogOut className="h-4 w-4" strokeWidth={1.8} />
              Logout
            </button>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto min-h-screen">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
