/** @param {string} s */
function normalizeQuery(s) {
  return String(s ?? '')
    .toLowerCase()
    .trim()
}

/**
 * @param {Array<Record<string, unknown>>} jobs
 * @param {string} query
 */
export function filterJobsBySearch(jobs, query) {
  const q = normalizeQuery(query)
  if (!q) return jobs
  return jobs.filter((job) => {
    const title = String(job.title ?? job.jobTitle ?? '').toLowerCase()
    const company = String(job.companyName ?? job.company ?? '').toLowerCase()
    return title.includes(q) || company.includes(q)
  })
}

/**
 * @param {Array<Record<string, unknown>>} users
 * @param {string} query
 */
export function filterUsersBySearch(users, query) {
  const q = normalizeQuery(query)
  if (!q) return users
  return users.filter((u) => {
    const name = String(u.name ?? u.fullName ?? '').toLowerCase()
    const email = String(u.email ?? '').toLowerCase()
    const role = String(u.role ?? '').toLowerCase()
    return name.includes(q) || email.includes(q) || role.includes(q)
  })
}
