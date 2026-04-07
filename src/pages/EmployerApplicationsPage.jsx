import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import DashboardLayout from '../components/DashboardLayout.jsx'
import EmptyState from '../components/EmptyState.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import { api, USER_STORAGE_KEY } from '../services/api.js'
import { getDashboardSidebarItems } from '../utils/dashboardSidebar.js'

function getStatusClass(status) {
  const s = String(status ?? '').toUpperCase()
  if (s === 'SHORTLISTED') return 'border-emerald-200 bg-emerald-50 text-emerald-800'
  if (s === 'REJECTED') return 'border-red-200 bg-red-50 text-red-800'
  return 'border-slate-200 bg-slate-100 text-slate-700'
}

export default function EmployerApplicationsPage() {
  const { user, logout } = useAuth()
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadApplications = useCallback(async () => {
    let storedUser = null
    try {
      storedUser = JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || 'null')
    } catch {
      storedUser = null
    }
    const employerId = user?.id ?? storedUser?.id
    if (employerId == null) {
      setApplications([])
      setError('Employer session not found. Please login again.')
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')
    try {
      const { data } = await api.get(`/api/employer/applications/${employerId}`)
      setApplications(Array.isArray(data) ? data : [])
    } catch (err) {
      const msg =
        err.response?.data?.message ?? err.message ?? 'Could not load applications.'
      setApplications([])
      setError(String(msg))
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    loadApplications()
  }, [loadApplications])

  return (
    <DashboardLayout
      title="Applications"
      user={user}
      onLogout={logout}
      sidebarItems={getDashboardSidebarItems(user?.role)}
    >
      {loading ? (
        <LoadingSpinner label="Loading applications..." />
      ) : error ? (
        <EmptyState title="Could not load applications" description={error} />
      ) : applications.length === 0 ? (
        <EmptyState
          title="No applications found"
          description="No candidate applications are available for your jobs yet."
        />
      ) : (
        <div className="app-card overflow-hidden rounded-xl shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--color-app-border)] bg-[var(--color-app-bg)]">
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--color-app-muted)] sm:px-5">
                    Candidate
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--color-app-muted)] sm:px-5">
                    Email
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--color-app-muted)] sm:px-5">
                    Position
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--color-app-muted)] sm:px-5">
                    Company
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-[var(--color-app-muted)] sm:px-5">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {applications.map((application, i) => {
                  const student = application.student ?? {}
                  const job = application.job ?? {}
                  const status = application.status ?? 'APPLIED'
                  return (
                    <tr
                      key={application.id ?? i}
                      className={[
                        'border-b border-[var(--color-app-border)] last:border-0',
                        i % 2 === 0 ? 'bg-[var(--color-app-card)]' : 'bg-[#f8fafc]',
                      ].join(' ')}
                    >
                      <td className="px-4 py-3 font-medium text-[var(--color-app-text)] sm:px-5">
                        {student.name ?? '—'}
                      </td>
                      <td className="px-4 py-3 text-[var(--color-app-muted)] sm:px-5">
                        {student.email ?? '—'}
                      </td>
                      <td className="px-4 py-3 text-[var(--color-app-muted)] sm:px-5">
                        {job.title ?? '—'}
                      </td>
                      <td className="px-4 py-3 text-[var(--color-app-muted)] sm:px-5">
                        {job.companyName ?? '—'}
                      </td>
                      <td className="px-4 py-3 text-right sm:px-5">
                        <span
                          className={`inline-flex rounded-lg border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide ${getStatusClass(status)}`}
                        >
                          {String(status)}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
