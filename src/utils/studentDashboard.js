/**
 * Normalize student stats from common Spring / REST shapes.
 * @param {unknown} data
 */
export function normalizeStudentStats(data) {
  if (data == null || typeof data !== 'object') {
    return {
      totalJobs: 0,
      applied: 0,
      shortlisted: 0,
      appliedJobIds: new Set(),
    }
  }
  const d = /** @type {Record<string, unknown>} */ (data)
  const totalJobs = Number(
    d.totalJobs ?? d.totalJobCount ?? d.totalJobsCount ?? d.total ?? 0,
  )
  const applied = Number(
    d.applied ?? d.appliedCount ?? d.applicationsCount ?? d.totalApplied ?? 0,
  )
  const shortlisted = Number(
    d.shortlisted ?? d.shortlistedCount ?? d.selectedCount ?? d.shortlistCount ?? 0,
  )
  return {
    totalJobs: Number.isFinite(totalJobs) ? totalJobs : 0,
    applied: Number.isFinite(applied) ? applied : 0,
    shortlisted: Number.isFinite(shortlisted) ? shortlisted : 0,
    appliedJobIds: extractAppliedJobIdsFromStats(d),
  }
}

/**
 * @param {Record<string, unknown>} d
 * @returns {Set<string>}
 */
function extractAppliedJobIdsFromStats(d) {
  const raw =
    d.appliedJobIds ??
    d.appliedJobsIds ??
    d.appliedJobs ??
    d.jobIdsApplied ??
    d.appliedJobIdList
  const set = new Set()
  if (!Array.isArray(raw)) return set
  for (const item of raw) {
    if (item == null) continue
    if (typeof item === 'number' || typeof item === 'string') {
      set.add(String(item))
      continue
    }
    if (typeof item === 'object') {
      const o = /** @type {Record<string, unknown>} */ (item)
      const id = o.jobId ?? o.job_id ?? o.id
      if (id != null) set.add(String(id))
    }
  }
  return set
}

/**
 * @param {unknown} job
 */
export function jobAppliedFromPayload(job) {
  if (!job || typeof job !== 'object') return false
  const j = /** @type {Record<string, unknown>} */ (job)
  if (j.applied === true || j.hasApplied === true || j.alreadyApplied === true) return true
  const status = String(j.applicationStatus ?? j.status ?? '').toUpperCase()
  if (status && status !== 'NONE' && status !== 'NOT_APPLIED') return true
  return false
}

/**
 * @param {string | number} jobId
 * @param {Set<string>} fromStats
 * @param {unknown[]} jobs
 * @param {Set<string>} optimistic
 */
export function isJobAppliedForStudent(jobId, fromStats, jobs, optimistic) {
  const key = String(jobId)
  if (!key || key === 'undefined') return false
  if (optimistic.has(key)) return true
  if (fromStats.has(key)) return true
  const job = jobs.find((j) => String(j?.id ?? j?.jobId) === key)
  return job ? jobAppliedFromPayload(job) : false
}
