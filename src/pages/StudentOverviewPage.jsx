import { useAuth } from '../context/AuthContext.jsx'
import DashboardLayout from '../components/DashboardLayout.jsx'
import StudentStatsCards from '../components/StudentStatsCards.jsx'
import { getDashboardSidebarItems } from '../utils/dashboardSidebar.js'
import { useStudentWorkspace } from '../hooks/useStudentWorkspace.js'

export default function StudentOverviewPage() {
  const { user, logout } = useAuth()
  const { statsForCards, statsLoading } = useStudentWorkspace({ fetchJobs: false })

  return (
    <DashboardLayout
      title="Dashboard"
      user={user}
      onLogout={logout}
      sidebarItems={getDashboardSidebarItems(user?.role)}
    >
      <StudentStatsCards stats={statsForCards} loading={statsLoading} />
      <div className="app-card max-w-2xl rounded-xl p-6">
        <h2 className="text-base font-semibold text-[var(--color-app-text)]">Welcome</h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-app-muted)]">
          Use the sidebar to open <strong className="font-medium text-[var(--color-app-text)]">Jobs</strong>{' '}
          to browse and apply, or <strong className="font-medium text-[var(--color-app-text)]">Applications</strong>{' '}
          to review your submissions.
        </p>
      </div>
    </DashboardLayout>
  )
}
