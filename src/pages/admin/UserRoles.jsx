import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { Search } from 'lucide-react'
import { api } from '../../services/api.js'
import LoadingSpinner from '../../components/LoadingSpinner.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import { unwrapList } from '../../utils/apiHelpers.js'

function roleBadge(role) {
  const r = String(role ?? '').toUpperCase()
  if (r === 'ADMIN') return 'bg-gray-100 text-gray-700 border-gray-300'
  if (r === 'EMPLOYER') return 'bg-gray-100 text-gray-700 border-gray-300'
  if (r === 'OFFICER') return 'bg-gray-100 text-gray-700 border-gray-300'
  return 'bg-slate-100 text-slate-700 border-slate-200'
}

function statusBadge(active) {
  return active
    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
    : 'bg-slate-100 text-slate-700 border-slate-200'
}

export default function AdminUserRolesPage() {
  const [users, setUsers] = useState([])
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')
  const [deletingUserId, setDeletingUserId] = useState(null)
  const [deletingJobId, setDeletingJobId] = useState(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const [usersRes, jobsRes] = await Promise.all([
          api.get('/api/admin/users'),
          api.get('/api/jobs'),
        ])
        setUsers(unwrapList(usersRes.data))
        setJobs(unwrapList(jobsRes.data))
      } catch (err) {
        const msg = err.response?.data?.message ?? err.message ?? 'Could not load admin data.'
        toast.error(String(msg))
        setUsers([])
        setJobs([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase().trim()
    return users.filter((u) => {
      const role = String(u.role ?? '').toUpperCase()
      if (roleFilter !== 'ALL' && role !== roleFilter) return false
      if (!q) return true
      return (
        String(u.name ?? u.fullName ?? '').toLowerCase().includes(q) ||
        String(u.email ?? '').toLowerCase().includes(q)
      )
    })
  }, [users, search, roleFilter])

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return
    setDeletingUserId(id)
    try {
      await api.delete(`/api/admin/users/${id}`)
      setUsers((prev) => prev.filter((u) => u.id !== id))
      toast.success('User deleted.')
    } catch (err) {
      const msg = err.response?.data?.message ?? err.message ?? 'Could not delete user.'
      toast.error(String(msg))
    } finally {
      setDeletingUserId(null)
    }
  }

  const handleDeleteJob = async (id) => {
    if (!window.confirm('Delete this job listing?')) return
    setDeletingJobId(id)
    try {
      await api.delete(`/api/admin/jobs/${id}`)
      setJobs((prev) => prev.filter((j) => j.id !== id))
      toast.success('Job deleted.')
    } catch (err) {
      const msg = err.response?.data?.message ?? err.message ?? 'Could not delete job.'
      toast.error(String(msg))
    } finally {
      setDeletingJobId(null)
    }
  }

  return (
    <>
      <section className="rounded-xl border border-[var(--color-app-border)] bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 gap-3">
            <div className="relative w-full max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-app-muted)]" />
              <input
                className="app-input pl-9"
                placeholder="Search by name or email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="app-input w-40"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="ALL">All roles</option>
              <option value="STUDENT">Student</option>
              <option value="EMPLOYER">Employer</option>
              <option value="ADMIN">Admin</option>
              <option value="OFFICER">Officer</option>
            </select>
          </div>
          <button className="btn-primary">Add User</button>
        </div>

        {loading ? (
          <LoadingSpinner label="Loading users..." />
        ) : filteredUsers.length === 0 ? (
          <div className="mt-6">
            <EmptyState title="No users found" description="Try changing your search or role filter." />
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--color-app-border)] bg-[var(--color-app-bg)]">
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--color-app-muted)]">Name</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--color-app-muted)]">Email</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--color-app-muted)]">Role</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--color-app-muted)]">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-[var(--color-app-muted)]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u, idx) => (
                  <tr key={u.id ?? idx} className="border-b border-[var(--color-app-border)] last:border-0">
                    <td className="px-4 py-3 font-medium text-[var(--color-app-text)]">{u.name ?? u.fullName ?? '—'}</td>
                    <td className="px-4 py-3 text-[var(--color-app-muted)]">{u.email ?? '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-lg border px-2.5 py-1 text-xs font-semibold ${roleBadge(u.role)}`}>{u.role ?? '—'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-lg border px-2.5 py-1 text-xs font-semibold ${statusBadge((u.active ?? true) === true)}`}>
                        {(u.active ?? true) ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex gap-2">
                        <button className="btn-secondary px-3 py-1.5 text-xs">Edit</button>
                        <button
                          className="btn-danger"
                          disabled={deletingUserId === u.id}
                          onClick={() => handleDeleteUser(u.id)}
                        >
                          {deletingUserId === u.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mt-6 rounded-xl border border-[var(--color-app-border)] bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
        <h2 className="text-base font-semibold text-[var(--color-app-text)]">Job Listings Management</h2>
        {loading ? (
          <LoadingSpinner label="Loading jobs..." />
        ) : jobs.length === 0 ? (
          <div className="mt-4">
            <EmptyState title="No jobs found" description="No active job listings available." />
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--color-app-border)] bg-[var(--color-app-bg)]">
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--color-app-muted)]">Title</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--color-app-muted)]">Company</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-[var(--color-app-muted)]">Action</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job, idx) => (
                  <tr key={job.id ?? idx} className="border-b border-[var(--color-app-border)] last:border-0">
                    <td className="px-4 py-3 text-[var(--color-app-text)]">{job.title ?? job.jobTitle ?? '—'}</td>
                    <td className="px-4 py-3 text-[var(--color-app-muted)]">{job.companyName ?? job.company ?? '—'}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        className="btn-danger"
                        disabled={deletingJobId === job.id}
                        onClick={() => handleDeleteJob(job.id)}
                      >
                        {deletingJobId === job.id ? 'Deleting...' : 'Delete Job'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  )
}
