import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import POLayout from '../layouts/POLayout.jsx'
import { getPOApplications, getPOJobs, getPOStats, getPOUsers } from '../services/poApi.js'

function monthLabel(dateLike) {
  const d = new Date(dateLike)
  if (Number.isNaN(d.getTime())) return 'N/A'
  return d.toLocaleString('en-US', { month: 'short' })
}

const PIE_COLORS = ['#374151', '#6b7280', '#9ca3af', '#d1d5db']

export default function PODashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({})
  const [jobs, setJobs] = useState([])
  const [applications, setApplications] = useState([])
  const [users, setUsers] = useState([])

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const [statsData, jobsData, applicationsData, usersData] = await Promise.all([
          getPOStats(),
          getPOJobs(),
          getPOApplications(),
          getPOUsers(),
        ])
        setStats(statsData ?? {})
        setJobs(jobsData)
        setApplications(applicationsData)
        setUsers(usersData)
      } catch (error) {
        const message = error.response?.data?.message ?? error.message ?? 'Failed to load placement officer dashboard.'
        toast.error(String(message))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const derived = useMemo(() => {
    const placements = applications.filter((a) => ['PLACED', 'CONFIRMED'].includes(String(a.status ?? '').toUpperCase()))
    const studentsPlaced = new Set(placements.map((a) => a.studentId ?? a.student?.id ?? a.studentEmail).filter(Boolean)).size
    const companies = new Set(jobs.map((j) => j.companyName ?? j.company).filter(Boolean)).size
    const placementRate = applications.length ? ((placements.length / applications.length) * 100).toFixed(1) : '0.0'
    return {
      totalPlacements: Number(stats.totalPlacements ?? stats.placementRecords ?? placements.length ?? 0),
      activeCompanies: Number(stats.activeCompanies ?? stats.registeredCompanies ?? companies ?? 0),
      studentsPlaced: Number(stats.studentsPlaced ?? studentsPlaced ?? 0),
      placementRate: Number(stats.placementRate ?? placementRate ?? 0),
    }
  }, [applications, jobs, stats])

  const trendData = useMemo(() => {
    const map = new Map()
    applications.forEach((a) => {
      const key = monthLabel(a.createdAt ?? a.appliedAt ?? a.date)
      if (!map.has(key)) map.set(key, 0)
      if (key !== 'N/A') map.set(key, (map.get(key) ?? 0) + 1)
    })
    return Array.from(map.entries()).map(([month, placements]) => ({ month, placements }))
  }, [applications])

  const sectorData = useMemo(() => {
    const map = new Map()
    jobs.forEach((j) => {
      const sector = j.sector ?? 'General'
      map.set(sector, (map.get(sector) ?? 0) + 1)
    })
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }))
  }, [jobs])

  return (
    <POLayout title="Placement Officer Dashboard">
      {loading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-600 shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
          Loading dashboard...
        </div>
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
              <p className="text-sm text-gray-500">Total Placements</p>
              <p className="mt-2 text-3xl font-semibold text-gray-800">{derived.totalPlacements}</p>
            </article>
            <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
              <p className="text-sm text-gray-500">Active Companies</p>
              <p className="mt-2 text-3xl font-semibold text-gray-800">{derived.activeCompanies}</p>
            </article>
            <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
              <p className="text-sm text-gray-500">Students Placed</p>
              <p className="mt-2 text-3xl font-semibold text-gray-800">{derived.studentsPlaced}</p>
            </article>
            <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
              <p className="text-sm text-gray-500">Placement Rate (%)</p>
              <p className="mt-2 text-3xl font-semibold text-gray-800">{derived.placementRate}</p>
            </article>
          </section>

          <section className="mt-6 grid gap-6 lg:grid-cols-2">
            <div>
              <h2 className="mb-3 text-base font-semibold text-gray-800">Placement Trends</h2>
              <div
                style={{
                  width: '100%',
                  height: '350px',
                  minHeight: '300px',
                  background: '#fff',
                  padding: '20px',
                  borderRadius: '10px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trendData}>
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip />
                    <Bar dataKey="placements" fill="#374151" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div>
              <h2 className="mb-3 text-base font-semibold text-gray-800">Sector Distribution</h2>
              <div
                style={{
                  width: '100%',
                  height: '350px',
                  minHeight: '300px',
                  background: '#fff',
                  padding: '20px',
                  borderRadius: '10px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={sectorData} dataKey="value" nameKey="name" innerRadius={65} outerRadius={95} label>
                      {sectorData.map((entry, idx) => (
                        <Cell key={`${entry.name}-${idx}`} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>
        </>
      )}
    </POLayout>
  )
}
