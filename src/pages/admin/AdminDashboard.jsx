import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Card from '../../components/Card.jsx'
import { getAdminStats } from '../../services/api.js'

function getStatValue(stats, keys) {
  for (const key of keys) {
    if (stats?.[key] != null) return stats[key]
  }
  return 0
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      setLoading(true)
      try {
        const data = await getAdminStats()
        setStats(data ?? {})
      } catch (error) {
        const message = error.response?.data?.message ?? error.message ?? 'Failed to load admin stats.'
        toast.error(String(message))
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  if (loading) {
    return <div className="rounded-xl bg-white p-6 text-sm text-gray-600 shadow-[0_2px_10px_rgba(0,0,0,0.06)]">Loading stats...</div>
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <Card title="Total Users" value={getStatValue(stats, ['totalUsers', 'users', 'userCount'])} />
      <Card title="Total Jobs" value={getStatValue(stats, ['totalJobs', 'jobs', 'jobCount', 'activeJobListings'])} />
      <Card title="Total Applications" value={getStatValue(stats, ['totalApplications', 'applications', 'applicationCount'])} />
    </div>
  )
}
