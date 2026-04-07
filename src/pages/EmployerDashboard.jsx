import { useCallback, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext.jsx'
import { api, USER_STORAGE_KEY } from '../services/api.js'
import DashboardLayout from '../components/DashboardLayout.jsx'
import JobCard from '../components/JobCard.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import EmptyState from '../components/EmptyState.jsx'
import SearchBar from '../components/SearchBar.jsx'
import { unwrapList } from '../utils/apiHelpers.js'
import { getDashboardSidebarItems } from '../utils/dashboardSidebar.js'
import { filterJobsBySearch } from '../utils/searchFilters.js'

export default function EmployerDashboard() {
  const { user, logout } = useAuth()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const [jobs, setJobs] = useState([])
  const [jobsLoading, setJobsLoading] = useState(true)
  const [search, setSearch] = useState('')

  const loadJobs = useCallback(async () => {
    setJobsLoading(true)
    try {
      const { data } = await api.get('/api/jobs')
      setJobs(unwrapList(data))
    } catch (err) {
      const msg =
        err.response?.data?.message ?? err.message ?? 'Could not load listings.'
      toast.error(String(msg))
      setJobs([])
    } finally {
      setJobsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadJobs()
  }, [loadJobs])

  const filteredJobs = useMemo(() => filterJobsBySearch(jobs, search), [jobs, search])

  async function handleSubmit(e) {
    e.preventDefault()
    const cleanCompany = companyName.trim()
    const cleanTitle = title.trim()
    const cleanDescription = description.trim()
    if (!cleanCompany || !cleanTitle || !cleanDescription) {
      toast.error('Please fill in company name, title, and description.')
      return
    }
    let storedUser = null
    try {
      storedUser = JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || 'null')
    } catch {
      storedUser = null
    }
    const employerId = user?.id ?? storedUser?.id
    if (employerId == null) {
      toast.error('Employer session not found. Please login again.')
      return
    }

    setSubmitting(true)
    try {
      await api.post(`/api/jobs/add/${employerId}`, {
        title: cleanTitle,
        description: cleanDescription,
        companyName: cleanCompany,
      })
      toast.success('Job posted successfully.')
      setTitle('')
      setDescription('')
      setCompanyName('')
      loadJobs()
    } catch (err) {
      const msg =
        err.response?.data?.message ?? err.message ?? 'Could not post job.'
      toast.error(String(msg))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <DashboardLayout
      title="Post a job"
      user={user}
      onLogout={logout}
      sidebarItems={getDashboardSidebarItems(user?.role)}
    >
      <div className="mx-auto max-w-xl">
        <div className="app-card p-6 sm:p-8">
          <h2 className="text-base font-semibold text-[var(--color-app-text)]">New listing</h2>
          <p className="mt-1 text-sm text-[var(--color-app-muted)]">
            Submitted as JSON to <code className="text-xs">/api/jobs/add/&#123;employerId&#125;</code>.
          </p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="companyName" className="mb-1.5 block text-sm font-medium text-[var(--color-app-text)]">
                Company name
              </label>
              <input
                id="companyName"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="app-input"
                placeholder="Acme Inc."
              />
            </div>
            <div>
              <label htmlFor="jobTitle" className="mb-1.5 block text-sm font-medium text-[var(--color-app-text)]">
                Job title
              </label>
              <input
                id="jobTitle"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="app-input"
                placeholder="Role title"
              />
            </div>
            <div>
              <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-[var(--color-app-text)]">
                Description
              </label>
              <textarea
                id="description"
                required
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="app-input resize-y"
                placeholder="Responsibilities, requirements, and other details."
              />
            </div>
            <button type="submit" disabled={submitting} className="btn-primary w-full py-3">
              {submitting ? 'Posting...' : 'Publish job'}
            </button>
          </form>
        </div>
      </div>

      <section className="mt-10 border-t border-[var(--color-app-border)] pt-10">
        <h2 className="text-base font-semibold text-[var(--color-app-text)]">Published listings</h2>
        <p className="mt-1 text-sm text-[var(--color-app-muted)]">
          Browse and search jobs on the platform (same catalogue as students see).
        </p>
        {jobsLoading ? (
          <LoadingSpinner label="Loading listings…" />
        ) : jobs.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              title="No data available"
              description="No jobs are listed yet. Publish a role above or wait for other employers."
            />
          </div>
        ) : (
          <>
            <div className="mt-6 max-w-xl">
              <SearchBar
                id="employer-job-search"
                value={search}
                onChange={setSearch}
                placeholder="Search jobs…"
              />
            </div>
            {filteredJobs.length === 0 ? (
              <EmptyState
                title="No results found"
                description="No listings match your search. Try another title or company name."
              />
            ) : (
              <div className="mt-2 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filteredJobs.map((job, idx) => (
                  <JobCard
                    key={job.id ?? job.jobId ?? idx}
                    job={job}
                    showApply={false}
                    onApply={() => {}}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </DashboardLayout>
  )
}
