import { useCallback, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext.jsx'
import { api } from '../services/api.js'
import DashboardLayout from '../components/DashboardLayout.jsx'
import UserTable from '../components/UserTable.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import SearchBar from '../components/SearchBar.jsx'
import { unwrapList } from '../utils/apiHelpers.js'
import { getDashboardSidebarItems } from '../utils/dashboardSidebar.js'
import { filterUsersBySearch } from '../utils/searchFilters.js'

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)
  const [confirmUser, setConfirmUser] = useState(null)
  const [search, setSearch] = useState('')

  const loadUsers = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/api/admin/users')
      setUsers(unwrapList(data))
    } catch (err) {
      const msg =
        err.response?.data?.message ?? err.message ?? 'Could not load users.'
      toast.error(String(msg))
      setUsers([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  const filteredUsers = useMemo(() => filterUsersBySearch(users, search), [users, search])
  const searchActive = search.trim().length > 0

  const performDelete = async (u) => {
    const id = u.id
    if (id == null) {
      toast.error('User has no ID — cannot delete.')
      setConfirmUser(null)
      return
    }
    setDeletingId(id)
    try {
      await api.delete(`/api/admin/delete/${id}`)
      toast.success('User removed.')
      setUsers((prev) => prev.filter((x) => x.id !== id))
    } catch (err) {
      const msg =
        err.response?.data?.message ?? err.message ?? 'Delete failed.'
      toast.error(String(msg))
    } finally {
      setDeletingId(null)
      setConfirmUser(null)
    }
  }

  return (
    <DashboardLayout
      title="Users"
      user={user}
      onLogout={logout}
      sidebarItems={getDashboardSidebarItems(user?.role)}
    >
      {!loading && users.length > 0 ? (
        <SearchBar
          id="admin-user-search"
          value={search}
          onChange={setSearch}
          placeholder="Search users…"
        />
      ) : null}
      <UserTable
        users={filteredUsers}
        loading={loading}
        deletingId={deletingId}
        onDelete={(u) => setConfirmUser(u)}
        emptyTitle={searchActive ? 'No results found' : 'No data available'}
        emptyDescription={
          searchActive
            ? 'No users match your search. Try another name, email, or role.'
            : 'There are no registered users to display.'
        }
      />
      <ConfirmDialog
        open={Boolean(confirmUser)}
        title="Remove user?"
        message={
          confirmUser
            ? `This will remove ${confirmUser.email ?? 'this user'} (ID: ${confirmUser.id ?? '—'}) from the system.`
            : ''
        }
        confirmLabel="Remove"
        cancelLabel="Cancel"
        onCancel={() => setConfirmUser(null)}
        onConfirm={() => confirmUser && performDelete(confirmUser)}
      />
    </DashboardLayout>
  )
}
