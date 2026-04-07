import { api } from './api.js'

function listFrom(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.content)) return data.content
  if (Array.isArray(data?.data)) return data.data
  return []
}

export async function getPOStats() {
  const { data } = await api.get('/api/admin/stats')
  return data ?? {}
}

export async function getPOJobs() {
  const { data } = await api.get('/api/jobs')
  return listFrom(data)
}

export async function getPOApplications() {
  const { data } = await api.get('/api/applications')
  return listFrom(data)
}

export async function getPOUsers() {
  const { data } = await api.get('/api/admin/users')
  return listFrom(data)
}
