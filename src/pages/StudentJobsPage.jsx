import { useAuth } from '../context/AuthContext.jsx'
import DashboardLayout from '../components/DashboardLayout.jsx'
import JobCard from '../components/JobCard.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import EmptyState from '../components/EmptyState.jsx'
import SearchBar from '../components/SearchBar.jsx'
import StudentStatsCards from '../components/StudentStatsCards.jsx'
import { getDashboardSidebarItems } from '../utils/dashboardSidebar.js'
import { useStudentWorkspace } from '../hooks/useStudentWorkspace.js'
import { isJobAppliedForStudent } from '../utils/studentDashboard.js'

export default function StudentJobsPage() {
  const { user, logout } = useAuth()
  const {
    appliedJobIds,
    statsLoading,
    jobs,
    jobsLoading,
    search,
    setSearch,
    filteredJobs,
    statsForCards,
    handleApply,
    applyingId,
    optimisticApplied,
  } = useStudentWorkspace({ fetchJobs: true })

  return (
    <DashboardLayout
      title="Job openings"
      user={user}
      onLogout={logout}
      sidebarItems={getDashboardSidebarItems(user?.role)}
    >
      <StudentStatsCards stats={statsForCards} loading={statsLoading} />

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
                const jid = job.id ?? job.jobId
                const already = isJobAppliedForStudent(
                  jid,
                  appliedJobIds,
                  jobs,
                  optimisticApplied,
                )
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
