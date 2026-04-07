import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { getAdminPlacements } from '../../services/api.js'

function normalizeList(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.content)) return data.content
  if (Array.isArray(data?.data)) return data.data
  return []
}

export default function PlacementData() {
  const [placements, setPlacements] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPlacements() {
      setLoading(true)
      try {
        const data = await getAdminPlacements()
        setPlacements(normalizeList(data))
      } catch (err) {
        const message = err.response?.data?.message ?? err.message ?? 'Failed to load placements.'
        toast.error(String(message))
        setPlacements([])
      } finally {
        setLoading(false)
      }
    }
    loadPlacements()
  }, [])

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
      <h2 className="mb-4 text-lg font-semibold text-gray-800">Placement Data</h2>

      {loading ? (
        <p className="text-sm text-gray-600">Loading placements...</p>
      ) : placements.length === 0 ? (
        <p className="text-sm text-gray-600">No placement records found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-100">
                <th className="px-4 py-3 font-semibold text-gray-700">Student Name</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Company</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {placements.map((item, index) => (
                <tr key={item.id ?? index} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-3 text-gray-800">{item.studentName ?? item.student?.name ?? 'N/A'}</td>
                  <td className="px-4 py-3 text-gray-600">{item.companyName ?? item.company ?? item.job?.companyName ?? 'N/A'}</td>
                  <td className="px-4 py-3 text-gray-600">{item.status ?? 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
