import { useState } from 'react'
import toast from 'react-hot-toast'
import { ClipboardList } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { api } from '../services/api.js'
import DashboardLayout from '../components/DashboardLayout.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { getDashboardSidebarItems } from '../utils/dashboardSidebar.js'

const MOCK_APPLICATIONS = [
  {
    id: 101,
    studentName: 'Aisha Khan',
    email: 'aisha@campus.edu',
    jobTitle: 'Frontend Intern',
    company: 'Northwind Labs',
    status: 'PENDING',
    appliedAt: '2026-03-28',
  },
  {
    id: 102,
    studentName: 'Diego Martín',
    email: 'diego@campus.edu',
    jobTitle: 'Data Analyst',
    company: 'Summit Analytics',
    status: 'SELECTED',
    appliedAt: '2026-03-30',
  },
  {
    id: 103,
    studentName: 'Mei Chen',
    email: 'mei@campus.edu',
    jobTitle: 'Cloud Engineer',
    company: 'Bluevale Systems',
    status: 'REJECTED',
    appliedAt: '2026-04-01',
  },
]

function statusClass(status) {
  const s = String(status || '').toUpperCase()
  if (s === 'SELECTED') return 'border-[var(--color-app-border)] bg-[#f1f5f9] text-[var(--color-app-text)]'
  if (s === 'REJECTED') return 'border-[var(--color-app-border)] bg-[#f8fafc] text-[var(--color-app-muted)]'
  return 'border-[var(--color-app-border)] bg-[var(--color-app-card)] text-[var(--color-app-muted)]'
}

export default function OfficerDashboard() {
  const { user, logout } = useAuth()
  const [rows] = useState(MOCK_APPLICATIONS)
  const [updatingId, setUpdatingId] = useState(null)

  async function updateStatus(id, status) {
    setUpdatingId(id)
    try {
      await api.put(`/api/applications/update/${id}`, null, {
        params: { status },
      })
      toast.success(`Application marked ${status}.`)
    } catch (err) {
      const msg =
        err.response?.data?.message ??
        err.message ??
        'Update failed (demo rows may not exist on the server).'
      toast.error(String(msg))
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <DashboardLayout
      title="Applications"
      user={user}
      onLogout={logout}
      sidebarItems={getDashboardSidebarItems(user?.role)}
    >
      <div className="app-card mb-6 border-dashed px-4 py-3">
        <p className="text-sm leading-relaxed text-[var(--color-app-muted)]">
          <span className="font-medium text-[var(--color-app-text)]">Sample data.</span>{' '}
          Rows are for layout preview; action buttons call your API when IDs exist on the server.
        </p>
      </div>
      {rows.length === 0 ? (
        <EmptyState
          title="No data available"
          description="Connect a list endpoint here when your backend exposes it."
          icon={ClipboardList}
        />
      ) : (
        <div className="app-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--color-app-border)] bg-[var(--color-app-bg)]">
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--color-app-muted)] sm:px-5">
                    Student
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--color-app-muted)] sm:px-5">
                    Role
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--color-app-muted)] sm:px-5">
                    Company
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--color-app-muted)] sm:px-5">
                    Status
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--color-app-muted)] sm:px-5">
                    Applied
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-[var(--color-app-muted)] sm:px-5">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr
                    key={r.id}
                    className={[
                      'border-b border-[var(--color-app-border)] last:border-0',
                      i % 2 === 0 ? 'bg-[var(--color-app-card)]' : 'bg-[#f8fafc]',
                    ].join(' ')}
                  >
                    <td className="px-4 py-3 sm:px-5">
                      <div className="font-medium text-[var(--color-app-text)]">{r.studentName}</div>
                      <div className="text-xs text-[var(--color-app-muted)]">{r.email}</div>
                    </td>
                    <td className="px-4 py-3 text-[var(--color-app-muted)] sm:px-5">{r.jobTitle}</td>
                    <td className="px-4 py-3 text-[var(--color-app-muted)] sm:px-5">{r.company}</td>
                    <td className="px-4 py-3 sm:px-5">
                      <span
                        className={`inline-block rounded border px-2 py-0.5 text-xs font-medium ${statusClass(r.status)}`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[var(--color-app-muted)] sm:px-5">{r.appliedAt}</td>
                    <td className="px-4 py-3 text-right sm:px-5">
                      <div className="flex flex-wrap justify-end gap-2">
                        <button
                          type="button"
                          disabled={updatingId === r.id}
                          onClick={() => updateStatus(r.id, 'SELECTED')}
                          className="btn-primary py-1.5 text-xs disabled:opacity-50"
                        >
                          Select
                        </button>
                        <button
                          type="button"
                          disabled={updatingId === r.id}
                          onClick={() => updateStatus(r.id, 'REJECTED')}
                          className="btn-secondary py-1.5 text-xs disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
