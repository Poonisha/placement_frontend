import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { createAdminUser, deleteAdminUser, getAdminUsers } from '../../services/api.js'

function normalizeList(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.content)) return data.content
  if (Array.isArray(data?.data)) return data.data
  return []
}

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)
  const [creating, setCreating] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'STUDENT',
  })

  async function loadUsers() {
    setLoading(true)
    try {
      const data = await getAdminUsers()
      setUsers(normalizeList(data))
    } catch (error) {
      const message = error.response?.data?.message ?? error.message ?? 'Failed to load users.'
      toast.error(String(message))
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setCreating(true)
    try {
      await createAdminUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
      })
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'STUDENT',
      })
      toast.success('User added successfully.')
      await loadUsers()
    } catch (error) {
      const message = error.response?.data?.message ?? error.message ?? 'Failed to add user.'
      alert(String(message))
    } finally {
      setCreating(false)
    }
  }

  async function handleDelete(userId) {
    if (!window.confirm('Are you sure you want to delete this user?')) return
    setDeletingId(userId)
    try {
      await deleteAdminUser(userId)
      toast.success('User deleted successfully.')
      await loadUsers()
    } catch (error) {
      const message = error.response?.data?.message ?? error.message ?? 'Failed to delete user.'
      toast.error(String(message))
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
      <h2 className="mb-4 text-lg font-semibold text-gray-800">Users Management</h2>

      <form onSubmit={handleSubmit} className="mb-6 grid gap-3 md:grid-cols-2">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          required
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 outline-none focus:border-gray-500"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 outline-none focus:border-gray-500"
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          required
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 outline-none focus:border-gray-500"
        />
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 outline-none focus:border-gray-500"
        >
          <option value="STUDENT">STUDENT</option>
          <option value="EMPLOYER">EMPLOYER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={creating}
            className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900 disabled:opacity-60"
          >
            {creating ? 'Adding...' : 'Add User'}
          </button>
        </div>
      </form>

      {loading ? (
        <p className="text-sm text-gray-600">Loading users...</p>
      ) : users.length === 0 ? (
        <p className="text-sm text-gray-600">No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-100">
                <th className="px-4 py-3 font-semibold text-gray-700">Name</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Email</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Role</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.id ?? index} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-3 text-gray-800">{user.name ?? user.fullName ?? 'N/A'}</td>
                  <td className="px-4 py-3 text-gray-600">{user.email ?? 'N/A'}</td>
                  <td className="px-4 py-3 text-gray-600">{user.role ?? 'N/A'}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleDelete(user.id)}
                      disabled={deletingId === user.id}
                      className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900 disabled:opacity-60"
                    >
                      {deletingId === user.id ? 'Deleting...' : 'Delete'}
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
