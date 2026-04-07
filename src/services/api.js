import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

/** localStorage key for the logged-in user (matches backend User JSON). */
export const USER_STORAGE_KEY = 'user'

/** Post-login home route per role. */
export const ROLE_HOME = {
  STUDENT: '/dashboard',
  EMPLOYER: '/employer/dashboard',
  ADMIN: '/admin/dashboard',
  OFFICER: '/officer',
  PLACEMENT_OFFICER: '/po/dashboard',
}

export const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

export async function getAdminStats() {
  const { data } = await api.get('/api/admin/stats')
  return data
}

export async function getAdminUsers() {
  const { data } = await api.get('/api/admin/users')
  return data
}

export async function createAdminUser(payload) {
  const { data } = await api.post('/api/admin/users', payload)
  return data
}

export async function deleteAdminUser(userId) {
  const { data } = await api.delete(`/api/admin/users/${userId}`)
  return data
}

export async function getAdminJobs() {
  const { data } = await api.get('/api/admin/jobs')
  return data
}

export async function deleteAdminJob(jobId) {
  const { data } = await api.delete(`/api/admin/jobs/${jobId}`)
  return data
}

export async function getAdminPlacements() {
  const { data } = await api.get('/api/admin/placements')
  return data
}

export function normalizeRole(role) {
  if (role == null) return ''
  let r = String(role).trim().toUpperCase()
  if (r.startsWith('ROLE_')) r = r.slice(5)
  return r
}
