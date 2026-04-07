import { useCallback, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext.jsx'
import { api } from '../services/api.js'
import { unwrapList } from '../utils/apiHelpers.js'
import { filterJobsBySearch } from '../utils/searchFilters.js'
import {
  isJobAppliedForStudent,
  normalizeStudentStats,
} from '../utils/studentDashboard.js'

export function useStudentWorkspace(options = {}) {
  const fetchJobs = options.fetchJobs === true
  const { user } = useAuth()
  const [stats, setStats] = useState(() => normalizeStudentStats(null))
  const [statsLoading, setStatsLoading] = useState(true)
  const [jobs, setJobs] = useState([])
  const [jobsLoading, setJobsLoading] = useState(fetchJobs)
  const [applyingId, setApplyingId] = useState(null)
  const [search, setSearch] = useState('')
  const [optimisticApplied, setOptimisticApplied] = useState(() => new Set())
  const [applications, setApplications] = useState([])
  const [applicationsLoading, setApplicationsLoading] = useState(fetchJobs)

  const loadStats = useCallback(async () => {
    const userId = user?.id
    if (userId == null) {
      setStats(normalizeStudentStats(null))
      setStatsLoading(false)
      return
    }
    setStatsLoading(true)
    try {
      const { data } = await api.get(`/api/student/stats/${userId}`)
      setStats(normalizeStudentStats(data))
    } catch (err) {
      const msg =
        err.response?.data?.message ?? err.message ?? 'Could not load your statistics.'
      toast.error(String(msg))
      setStats(normalizeStudentStats(null))
    } finally {
      setStatsLoading(false)
    }
  }, [user?.id])

  const loadJobs = useCallback(async () => {
    setJobsLoading(true)
    try {
      const { data } = await api.get('/api/jobs')
      setJobs(unwrapList(data))
    } catch (err) {
      const msg =
        err.response?.data?.message ?? err.message ?? 'Could not load jobs.'
      toast.error(String(msg))
      setJobs([])
    } finally {
      setJobsLoading(false)
    }
  }, [])

  const loadApplications = useCallback(async () => {
    const userId = user?.id
    if (userId == null) {
      setApplications([])
      setApplicationsLoading(false)
      return
    }
    setApplicationsLoading(true)
    try {
      const { data } = await api.get(`/api/applications/student/${userId}`)
      setApplications(unwrapList(data))
    } catch (err) {
      const msg =
        err.response?.data?.message ?? err.message ?? 'Could not load your applications.'
      toast.error(String(msg))
      setApplications([])
    } finally {
      setApplicationsLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    loadStats()
  }, [loadStats])

  useEffect(() => {
    if (fetchJobs) loadJobs()
  }, [fetchJobs, loadJobs])

  useEffect(() => {
    if (fetchJobs) loadApplications()
  }, [fetchJobs, loadApplications])

  const filteredJobs = useMemo(() => filterJobsBySearch(jobs, search), [jobs, search])

  const appliedJobIds = useMemo(() => {
    const ids = new Set(stats.appliedJobIds)
    for (const app of applications) {
      const id = app?.job?.id ?? app?.jobId ?? app?.job?.jobId
      if (id != null) ids.add(String(id))
    }
    return ids
  }, [applications, stats.appliedJobIds])

  const statsForCards = useMemo(() => {
    const total =
      !statsLoading && stats.totalJobs === 0 && jobs.length > 0
        ? jobs.length
        : stats.totalJobs
    return {
      totalJobs: total,
      applied: stats.applied,
      shortlisted: stats.shortlisted,
    }
  }, [stats, statsLoading, jobs.length])

  const handleApply = async (job) => {
    const jobId = job.id ?? job.jobId
    if (user?.id == null) {
      toast.error('You must be signed in to apply.')
      return
    }
    if (jobId == null) {
      toast.error('This listing is missing an ID — cannot apply.')
      return
    }
    const key = String(jobId)
    if (isJobAppliedForStudent(jobId, appliedJobIds, jobs, optimisticApplied)) {
      return
    }

    setApplyingId(jobId)
    try {
      await api.post('/api/applications', {
        student: { id: user.id },
        job: { id: jobId },
      })
      toast.success('Application submitted successfully.')
      setOptimisticApplied((prev) => new Set(prev).add(key))
      await Promise.all([loadStats(), loadApplications()])
    } catch (err) {
      const msg =
        err.response?.data?.message ?? err.message ?? 'Application failed.'
      toast.error(String(msg))
    } finally {
      setApplyingId(null)
    }
  }

  return {
    user,
    stats,
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
    appliedJobIds,
    applications,
    applicationsLoading,
    loadStats,
    loadJobs,
    loadApplications,
  }
}
