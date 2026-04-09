import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { api } from '../services/api.js'
import DashboardLayout from '../components/DashboardLayout.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { getDashboardSidebarItems } from '../utils/dashboardSidebar.js'

export default function StudentApplicationsPage() {
  const { user, logout } = useAuth()
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)

  useEffect(() => {
    const fetchApplications = async () => {
      const studentId = localStorage.getItem('userId') ?? user?.id
      if (studentId == null) {
        setApplications([])
        setLoading(false)
        setLoadError('Not signed in.')
        return
      }
      setLoading(true)
      setLoadError(null)
      try {
        const { data } = await api.get(`/api/applications/student/${studentId}`)
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
            ? data.data
            : Array.isArray(data?.applications)
              ? data.applications
              : []
        setApplications(list)
      } catch (err) {
        const msg =
          err.response?.data?.message ?? err.message ?? 'Could not load applications.'
        setLoadError(String(msg))
        setApplications([])
      } finally {
        setLoading(false)
      }
    }
    fetchApplications()
  }, [user?.id])

  return (
    <DashboardLayout
      title="My applications"
      user={user}
      onLogout={logout}
      sidebarItems={getDashboardSidebarItems(user?.role)}
    >
      {loading ? (
        <LoadingSpinner label="Loading applications…" />
      ) : loadError && applications.length === 0 ? (
        <EmptyState title="Could not load applications" description={loadError} />
      ) : applications.length === 0 ? (
        <EmptyState title="No applications found" description="No applications found" />
      ) : (
        <div className="grid gap-4">
          {applications.map((app, i) => (
            <article
              key={app.id ?? i}
              className="rounded-xl border border-[var(--color-app-border)] bg-[var(--color-app-card)] p-4 shadow-[0_2px_8px_rgba(0,0,0,0.05)]"
            >
              <p className="text-sm text-[var(--color-app-muted)]">
                <span className="font-medium text-[var(--color-app-text)]">Job ID:</span>{' '}
                {app.jobId ?? app.job?.id ?? 'N/A'}
              </p>
              <p className="mt-1 text-sm text-[var(--color-app-muted)]">
                <span className="font-medium text-[var(--color-app-text)]">Status:</span>{' '}
                {app.status ?? 'N/A'}
              </p>
            </article>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
