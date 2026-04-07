import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { api } from '../services/api.js'
import DashboardLayout from '../components/DashboardLayout.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import EmptyState from '../components/EmptyState.jsx'
import StudentApplicationCard from '../components/StudentApplicationCard.jsx'
import { getDashboardSidebarItems } from '../utils/dashboardSidebar.js'

export default function StudentApplicationsPage() {
  const { user, logout } = useAuth()
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)

  const load = useCallback(async () => {
    const userId = user?.id
    if (userId == null) {
      setApplications([])
      setLoading(false)
      setLoadError('Not signed in.')
      return
    }
    setLoading(true)
    setLoadError(null)
    try {
      const { data } = await api.get(`/api/applications/student/${userId}`)
      setApplications(Array.isArray(data) ? data : [])
    } catch (err) {
      const msg =
        err.response?.data?.message ?? err.message ?? 'Could not load applications.'
      setLoadError(String(msg))
      setApplications([])
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    load()
  }, [load])

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
        <EmptyState
          title="Could not load applications"
          description={loadError}
        />
      ) : applications.length === 0 ? (
        <EmptyState
          title="No applications yet"
          description="You have not submitted any applications. Browse jobs to apply."
        />
      ) : (
        <div className="flex flex-col gap-4">
          {applications.map((row, i) => (
            <StudentApplicationCard key={row.id ?? i} row={row} />
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
