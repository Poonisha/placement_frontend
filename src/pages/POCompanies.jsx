import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import POLayout from '../layouts/POLayout.jsx'
import { getPOApplications, getPOJobs } from '../services/poApi.js'

export default function POCompanies() {
  const [loading, setLoading] = useState(true)
  const [jobs, setJobs] = useState([])
  const [applications, setApplications] = useState([])

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const [jobsData, applicationsData] = await Promise.all([getPOJobs(), getPOApplications()])
        setJobs(jobsData)
        setApplications(applicationsData)
      } catch (error) {
        const message = error.response?.data?.message ?? error.message ?? 'Failed to load companies data.'
        toast.error(String(message))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const companyRows = useMemo(() => {
    const map = new Map()

    jobs.forEach((j) => {
      const name = j.companyName ?? j.company
      if (!name) return
      if (!map.has(name)) {
        map.set(name, { companyName: name, sector: j.sector ?? 'General', activeJobs: 0, placements: 0, status: 'Active' })
      }
      map.get(name).activeJobs += 1
    })

    applications.forEach((a) => {
      const company = a.companyName ?? a.job?.companyName ?? a.company
      if (!company) return
      if (!map.has(company)) {
        map.set(company, { companyName: company, sector: 'General', activeJobs: 0, placements: 0, status: 'Active' })
      }
      if (['PLACED', 'CONFIRMED'].includes(String(a.status ?? '').toUpperCase())) {
        map.get(company).placements += 1
      }
    })

    return Array.from(map.values())
  }, [applications, jobs])

  return (
    <POLayout title="Companies">
      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
        <h2 className="text-base font-semibold text-gray-800">Company Overview</h2>
        {loading ? (
          <p className="mt-4 text-sm text-gray-600">Loading companies...</p>
        ) : companyRows.length === 0 ? (
          <p className="mt-4 text-sm text-gray-600">No companies found.</p>
        ) : (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-100">
                  <th className="px-4 py-3 font-semibold text-gray-700">Company Name</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Sector</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Active Jobs</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Placements</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {companyRows.map((row, idx) => (
                  <tr key={`${row.companyName}-${idx}`} className="border-b border-gray-100 last:border-0">
                    <td className="px-4 py-3 text-gray-800">{row.companyName}</td>
                    <td className="px-4 py-3 text-gray-600">{row.sector}</td>
                    <td className="px-4 py-3 text-gray-600">{row.activeJobs}</td>
                    <td className="px-4 py-3 text-gray-600">{row.placements}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-md bg-gray-800 px-2.5 py-1 text-xs font-semibold text-white">
                        Active
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
