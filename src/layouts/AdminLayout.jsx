import { useAuth } from '../context/AuthContext.jsx'
import AdminSidebar from '../components/admin/Sidebar.jsx'
import AdminHeader from '../components/admin/Header.jsx'

export default function AdminLayout({ title, children }) {
  const { logout } = useAuth()

  return (
    <div className="min-h-screen lg:flex" style={{ background: '#eef2f6', minHeight: '100vh' }}>
      <AdminSidebar />
      <div className="min-h-screen flex-1" style={{ background: '#eef2f6', minHeight: '100vh' }}>
        <AdminHeader title={title} onLogout={logout} />
        <main
          className="min-h-[calc(100vh-4rem)] px-4 py-6 sm:px-6 lg:px-8 lg:py-8"
          style={{ background: '#eef2f6', minHeight: 'calc(100vh - 4rem)' }}
        >
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
