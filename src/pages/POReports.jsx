import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts'
import POLayout from '../layouts/POLayout.jsx'
import { getPOApplications } from '../services/poApi.js'

function monthLabel(dateLike) {
  const d = new Date(dateLike)
  if (Number.isNaN(d.getTime())) return 'N/A'
  return d.toLocaleString('en-US', { month: 'short' })
}

export default function POReports() {
  const [loading, setLoading] = useState(true)
  const [applications, setApplications] = useState([])

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const data = await getPOApplications()
        setApplications(data)
      } catch (error) {
        const message = error.response?.data?.message ?? error.message ?? 'Failed to load reports.'
        toast.error(String(message))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const lineData = useMemo(() => {
    const map = new Map()
    applications.forEach((a) => {
      const month = monthLabel(a.createdAt ?? a.appliedAt ?? a.date)
      if (month === 'N/A') return
      const current = map.get(month) ?? { month, applications: 0, placements: 0 }
      current.applications += 1
      if (['PLACED', 'CONFIRMED'].includes(String(a.status ?? '').toUpperCase())) current.placements += 1
      map.set(month, current)
    })
    return Array.from(map.values())
  }, [applications])

  const monthlyCards = useMemo(() => {
    return lineData.map((m) => ({
      month: m.month,
      applications: m.applications,
      placements: m.placements,
      rate: m.applications ? `${((m.placements / m.applications) * 100).toFixed(1)}%` : '0%',
    }))
  }, [lineData])

  return (
    <POLayout title="Reports">
      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
        <h2 className="text-base font-semibold text-gray-800">Applications vs Placements</h2>
        {loading ? (
          <p className="mt-4 text-sm text-gray-600">Loading report chart...</p>
        ) : (
          <div className="mt-4" style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="applications" stroke="#4b5563" strokeWidth={2} />
                <Line type="monotone" dataKey="placements" stroke="#111827" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {monthlyCards.map((c) => (
          <article
            key={c.month}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.06)]"
          >
            <p className="text-sm font-medium text-gray-500">{c.month}</p>
            <p className="mt-2 text-sm text-gray-700">Applications: {c.applications}</p>
            <p className="mt-1 text-sm text-gray-700">Placements: {c.placements}</p>
            <p className="mt-1 text-sm font-semibold text-gray-800">Rate: {c.rate}</p>
            <button className="mt-4 bg-gray-800 text-white px-3 py-1.5 rounded-md text-sm hover:bg-gray-900">
              Generate Report
            </button>
          </article>
        ))}
      </section>
    </POLayout>
  )
}
