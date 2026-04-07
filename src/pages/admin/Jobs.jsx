import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { deleteAdminJob, getAdminJobs } from '../../services/api.js'

function normalizeList(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.content)) return data.content
  if (Array.isArray(data?.data)) return data.data
  return []
}

export default function AdminJobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)

  async function loadJobs() {
    setLoading(true)
    try {
      const data = await getAdminJobs()
      setJobs(normalizeList(data))
    } catch (error) {
      const message = error.response?.data?.message ?? error.message ?? 'Failed to load jobs.'
      toast.error(String(message))
      setJobs([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadJobs()
  }, [])

  async function handleDelete(jobId) {
    if (!window.confirm('Are you sure you want to delete this job?')) return
    setDeletingId(jobId)
    try {
      await deleteAdminJob(jobId)
      toast.success('Job deleted successfully.')
      await loadJobs()
    } catch (error) {
      const message = error.response?.data?.message ?? error.message ?? 'Failed to delete job.'
      toast.error(String(message))
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
      <h2 className="mb-4 text-lg font-semibold text-gray-800">Jobs Management</h2>

      {loading ? (
        <p className="text-sm text-gray-600">Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p className="text-sm text-gray-600">No jobs found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-100">
                <th className="px-4 py-3 font-semibold text-gray-700">Job Title</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Company Name</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job, index) => (
                <tr key={job.id ?? index} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-3 text-gray-800">{job.title ?? job.jobTitle ?? 'N/A'}</td>
                  <td className="px-4 py-3 text-gray-600">{job.companyName ?? job.company ?? 'N/A'}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleDelete(job.id)}
                      disabled={deletingId === job.id}
                      className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900 disabled:opacity-60"
                    >
                      {deletingId === job.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
