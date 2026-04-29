import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import DashboardLayout from '../components/DashboardLayout.jsx'
import api, { USER_STORAGE_KEY } from '../services/api.js'
import { getDashboardSidebarItems } from '../utils/dashboardSidebar.js'

const initialJob = {
  title: '',
  companyName: '',
  description: '',
}

export default function EmployerJobs() {
  const { user, logout } = useAuth()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [editingJobId, setEditingJobId] = useState(null)
  const [job, setJob] = useState(initialJob)

  const getEmployerId = () => {
    const rawUserId = localStorage.getItem('userId')
    if (rawUserId != null && String(rawUserId).trim() !== '') return rawUserId
    try {
      const stored = JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || 'null')
      if (stored?.id != null) return stored.id
    } catch {
      // fall through
    }
    return user?.id ?? null
  }

  const fetchJobs = async () => {
    const employerId = getEmployerId()
    if (employerId == null) {
      setJobs([])
      setError('Employer session not found. Please login again.')
      setLoading(false)
      return
    }
    setLoading(true)
    setError('')
    try {
      const { data } = await api.get(`/api/jobs/employer/${employerId}`)
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data?.jobs)
            ? data.jobs
            : Array.isArray(data?.content)
              ? data.content
              : []
      setJobs(list)
    } catch (err) {
      const message =
        err.response?.data?.message ??
        (typeof err.response?.data === 'string' ? err.response.data : null) ??
        err.message ??
        'Failed to load jobs.'
      setError(String(message))
      setJobs([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  const handleChange = (e) => {
    setJob({
      ...job,
      [e.target.name]: e.target.value,
    })
  }

  const resetForm = () => {
    setJob(initialJob)
    setEditingJobId(null)
  }

  const handleEdit = (job) => {
    setEditingJobId(job.id)
    setJob({
      title: job.title ?? '',
      companyName: job.companyName ?? '',
      description: job.description ?? '',
    })
  }

  const handleDelete = async (jobId) => {
    if (!window.confirm('Delete this job?')) return
    try {
      await api.delete(`/api/jobs/${jobId}`)
      setJobs((prev) => prev.filter((job) => job.id !== jobId))
      alert('Job deleted successfully')
      if (editingJobId === jobId) resetForm()
    } catch (err) {
      const message =
        err.response?.data?.message ??
        (typeof err.response?.data === 'string' ? err.response.data : null) ??
        err.message ??
        'Failed to delete job.'
      alert(String(message))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const employerId = getEmployerId()
    if (employerId == null) {
      alert('Employer session not found. Please login again.')
      return
    }

    const payload = {
      title: job.title.trim(),
      companyName: job.companyName.trim(),
      description: job.description.trim(),
    }

    if (!payload.title || !payload.companyName || !payload.description) {
      alert('All fields required')
      return
    }

    setSubmitting(true)
    try {
      if (editingJobId != null) {
        await api.put(`/api/jobs/${editingJobId}`, payload)
        await fetchJobs()
        alert('Job updated successfully')
      } else {
        await api.post(`/api/jobs/add/${employerId}`, payload)
        await fetchJobs()
        alert('Job added successfully')
      }
      resetForm()
    } catch (err) {
      const message =
        err.response?.data?.message ??
        (typeof err.response?.data === 'string' ? err.response.data : null) ??
        err.message ??
        'Failed to save job.'
      alert(String(message))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <DashboardLayout
      title="Manage jobs"
      user={user}
      onLogout={logout}
      sidebarItems={getDashboardSidebarItems(user?.role)}
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
        <section className="rounded-xl border border-[var(--color-app-border)] bg-[var(--color-app-card)] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
          <h2 className="text-lg font-semibold text-[var(--color-app-text)]">
            {editingJobId ? 'Edit job' : 'Add job'}
          </h2>
          <p className="mt-1 text-sm text-[var(--color-app-muted)]">
            {editingJobId ? 'Update the selected job details.' : 'Create a new job listing.'}
          </p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--color-app-text)]">Title</label>
              <input
                name="title"
                value={job.title}
                onChange={handleChange}
                className="app-input"
                placeholder="Frontend Developer"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--color-app-text)]">Company name</label>
              <input
                name="companyName"
                value={job.companyName}
                onChange={handleChange}
                className="app-input"
                placeholder="Acme Inc."
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--color-app-text)]">Description</label>
              <textarea
                name="description"
                rows={5}
                value={job.description}
                onChange={handleChange}
                className="app-input resize-y"
                placeholder="Job responsibilities and requirements"
                required
              />
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={submitting} className="btn-primary flex-1">
                {submitting ? 'Saving...' : editingJobId ? 'Update Job' : 'Add Job'}
              </button>
              {editingJobId ? (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg border border-[var(--color-app-border)] px-4 py-2.5 text-sm font-medium text-[var(--color-app-text)]"
                >
                  Cancel
                </button>
              ) : null}
            </div>
          </form>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--color-app-text)]">Your jobs</h2>
          {loading ? (
            <p className="mt-4 text-sm text-[var(--color-app-muted)]">Loading jobs...</p>
          ) : error ? (
            <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          ) : jobs.length === 0 ? (
            <p className="mt-4 rounded-lg border border-[var(--color-app-border)] bg-[var(--color-app-card)] px-4 py-3 text-sm text-[var(--color-app-muted)]">
              No jobs found.
            </p>
          ) : (
            <div className="mt-4 grid gap-4">
              {jobs.map((job) => (
                <article
                  key={job.id}
                  className="rounded-xl border border-[var(--color-app-border)] bg-[var(--color-app-card)] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.05)]"
                >
                  <h3 className="text-base font-semibold text-[var(--color-app-text)]">{job.title || 'Untitled job'}</h3>
                  <p className="mt-1 text-sm font-medium text-[var(--color-app-muted)]">
                    {job.companyName || 'No company'}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--color-app-muted)]">
                    {job.description || 'No description available.'}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(job)}
                      className="rounded-lg border border-[var(--color-app-border)] px-3 py-2 text-sm font-medium text-[var(--color-app-text)] hover:bg-[var(--color-app-bg)]"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(job.id)}
                      className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  )
}
