import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { Search } from 'lucide-react'
import POLayout from '../layouts/POLayout.jsx'
import { getPOApplications, getPOJobs, getPOUsers } from '../services/poApi.js'

function statusBadge(status) {
  const s = String(status ?? '').toUpperCase()
  if (s === 'CONFIRMED' || s === 'PLACED') return 'bg-gray-800 text-white'
  return 'bg-gray-200 text-gray-700'
}

export default function PORecords() {
  const [loading, setLoading] = useState(true)
  const [applications, setApplications] = useState([])
  const [jobs, setJobs] = useState([])
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('ALL')

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const [applicationsData, jobsData, usersData] = await Promise.all([
          getPOApplications(),
          getPOJobs(),
          getPOUsers(),
        ])
        setApplications(applicationsData)
        setJobs(jobsData)
        setUsers(usersData)
      } catch (error) {
        const message = error.response?.data?.message ?? error.message ?? 'Failed to load placement records.'
        toast.error(String(message))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const records = useMemo(() => {
    const userMap = new Map(users.map((u) => [u.id, u]))
    const jobMap = new Map(jobs.map((j) => [j.id, j]))
    return applications.map((a) => {
      const user = userMap.get(a.studentId ?? a.userId)
      const job = jobMap.get(a.jobId)
      return {
        id: a.id,
        studentName: a.studentName ?? user?.name ?? a.student?.name ?? 'N/A',
        company: a.companyName ?? job?.companyName ?? job?.company ?? 'N/A',
        position: a.position ?? job?.title ?? job?.jobTitle ?? 'N/A',
        date: a.createdAt ?? a.appliedAt ?? a.date ?? 'N/A',
        salary: a.salary ?? job?.salary ?? 'N/A',
        status: String(a.status ?? 'CONFIRMED').toUpperCase(),
      }
    })
  }, [applications, jobs, users])

  const filteredRecords = useMemo(() => {
    const q = search.toLowerCase().trim()
    return records.filter((r) => {
      if (filter !== 'ALL' && r.status !== filter) return false
      if (!q) return true
      return (
        r.studentName.toLowerCase().includes(q) ||
        r.company.toLowerCase().includes(q) ||
        r.position.toLowerCase().includes(q)
      )
    })
  }, [records, search, filter])

  return (
    <POLayout title="Placement Records">
      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 gap-3">
            <div className="relative w-full max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search records..."
                className="w-full rounded-md border border-gray-300 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-800 outline-none focus:border-gray-500"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-gray-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="APPLIED">Applied</option>
              <option value="SHORTLISTED">Shortlisted</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="PLACED">Placed</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900">Create Record</button>
            <button className="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-800 hover:bg-gray-100">Export Report</button>
          </div>
        </div>

        {loading ? (
          <p className="mt-6 text-sm text-gray-600">Loading records...</p>
        ) : filteredRecords.length === 0 ? (
          <p className="mt-6 text-sm text-gray-600">No placement records found.</p>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[860px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-100">
                  <th className="px-4 py-3 font-semibold text-gray-700">Student Name</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Company</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Position</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Date</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Salary</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((r, idx) => (
                  <tr key={r.id ?? idx} className="border-b border-gray-100 last:border-0">
                    <td className="px-4 py-3 text-gray-800">{r.studentName}</td>
                    <td className="px-4 py-3 text-gray-600">{r.company}</td>
                    <td className="px-4 py-3 text-gray-600">{r.position}</td>
                    <td className="px-4 py-3 text-gray-600">{String(r.date).slice(0, 10)}</td>
                    <td className="px-4 py-3 text-gray-600">{r.salary}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-semibold ${statusBadge(r.status)}`}>
                        {r.status === 'PLACED' ? 'CONFIRMED' : r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </POLayout>
  )
}
