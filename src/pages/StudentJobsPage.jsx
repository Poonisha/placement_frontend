import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import DashboardLayout from '../components/DashboardLayout.jsx'
import JobCard from '../components/JobCard.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import EmptyState from '../components/EmptyState.jsx'
import SearchBar from '../components/SearchBar.jsx'
import StudentStatsCards from '../components/StudentStatsCards.jsx'
import { getDashboardSidebarItems } from '../utils/dashboardSidebar.js'
import { api } from '../services/api.js'
import { filterJobsBySearch } from '../utils/searchFilters.js'

export default function StudentJobsPage() {
  const { user, logout } = useAuth()
  const [jobs, setJobs] = useState([])
  const [jobsLoading, setJobsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [appliedJobIds, setAppliedJobIds] = useState(new Set())
  const [applyingId, setApplyingId] = useState(null)

  useEffect(() => {
    const fetchJobs = async () => {
      setJobsLoading(true)
      try {
        const { data } = await api.get('/api/jobs')
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
      } catch {
        setJobs([])
      } finally {
        setJobsLoading(false)
      }
    }
    fetchJobs()
  }, [])

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      const studentId = localStorage.getItem('userId') ?? user?.id
      if (!studentId) return
      try {
        const { data } = await api.get(`/api/applications/student/${studentId}`)
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
            ? data.data
            : Array.isArray(data?.applications)
              ? data.applications
              : []
        const ids = new Set(
          list
            .map((app) => app.jobId ?? app.job?.id ?? app.job?.jobId)
            .filter((id) => id != null),
        )
        setAppliedJobIds(ids)
      } catch {
        setAppliedJobIds(new Set())
      }
    }
    fetchAppliedJobs()
  }, [user?.id])

  const filteredJobs = useMemo(() => filterJobsBySearch(jobs, search), [jobs, search])

  const handleApply = async (job) => {
    const studentId = localStorage.getItem('userId')
    const jobId = job?.id ?? job?.jobId
    if (!studentId || !jobId) return
    if (appliedJobIds.has(jobId)) return
    setApplyingId(jobId)
    try {
      await api.post('/api/applications/apply', { studentId, jobId })
      setAppliedJobIds((prev) => new Set(prev).add(jobId))
      alert('Applied successfully')
    } catch {
      alert('Failed to apply')
    } finally {
      setApplyingId(null)
    }
  }

  return (
    <DashboardLayout
      title="Job openings"
      user={user}
      onLogout={logout}
      sidebarItems={getDashboardSidebarItems(user?.role)}
    >
      <StudentStatsCards
        stats={[
          { label: 'Jobs available', value: jobs.length },
          { label: 'Applied jobs', value: appliedJobIds.size },
          { label: 'Open results', value: '-' },
        ]}
        loading={jobsLoading}
      />

      {jobsLoading ? (
        <LoadingSpinner label="Loading jobs…" />
      ) : jobs.length === 0 ? (
        <EmptyState
          title="No jobs found"
          description="There are no job listings available right now. Check back later."
        />
      ) : (
        <>
          <SearchBar
            id="student-job-search"
            value={search}
            onChange={setSearch}
            placeholder="Search jobs…"
          />
          {filteredJobs.length === 0 ? (
            <EmptyState
              title="No jobs found"
              description="No jobs match your search. Try another title or company name."
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filteredJobs.map((job, idx) => {
                const jid = job.id ?? job.jobId ?? idx
                const already = appliedJobIds.has(jid)
                return (
                  <JobCard
                    key={jid ?? idx}
                    job={job}
                    onApply={handleApply}
                    applying={applyingId === jid}
                    alreadyApplied={already}
                  />
                )
              })}
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  )
}
