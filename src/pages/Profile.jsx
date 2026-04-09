import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import DashboardLayout from '../components/DashboardLayout.jsx'
import AdminLayout from '../layouts/AdminLayout.jsx'
import POLayout from '../layouts/POLayout.jsx'
import { getDashboardSidebarItems } from '../utils/dashboardSidebar.js'
import { normalizeRole, updateUserProfile } from '../services/api.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function ProfileForm() {
  const { user, setUser } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user) {
      setName(user.name ?? '')
      setEmail(user.email ?? '')
      setPassword('')
    }
  }, [user])

  const validate = () => {
    const err = {}
    if (!name.trim()) err.name = 'Name is required'
    if (!email.trim()) err.email = 'Email is required'
    else if (!EMAIL_RE.test(email.trim())) err.email = 'Enter a valid email address'
    setFieldErrors(err)
    return Object.keys(err).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate() || user?.id == null) return
    setSaving(true)
    try {
      const payload = { name: name.trim(), email: email.trim() }
      if (password.trim()) payload.password = password
      const data = await updateUserProfile(user.id, payload)
      setUser({ ...user, ...data })
      setPassword('')
      toast.success('Profile updated.')
    } catch (err) {
      const msg = err.response?.data?.message ?? err.message ?? 'Could not update profile.'
      toast.error(String(msg))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-lg rounded-xl border border-[var(--color-app-border)] bg-[var(--color-app-card)] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
      <h2 className="text-lg font-semibold text-[var(--color-app-text)]">Your details</h2>
      <p className="mt-1 text-sm text-[var(--color-app-muted)]">Update your name, email, or password.</p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--color-app-text)]">Name</label>
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setFieldErrors((p) => ({ ...p, name: '' }))
            }}
            className="app-input"
            autoComplete="name"
          />
          {fieldErrors.name ? <p className="mt-1 text-xs text-red-600">{fieldErrors.name}</p> : null}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--color-app-text)]">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setFieldErrors((p) => ({ ...p, email: '' }))
            }}
            className="app-input"
            autoComplete="email"
          />
          {fieldErrors.email ? <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p> : null}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--color-app-text)]">New password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="app-input"
            autoComplete="new-password"
            placeholder="Leave blank to keep current password"
          />
        </div>
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Saving…
            </>
          ) : (
            'Save changes'
          )}
        </button>
      </form>
    </div>
  )
}

export default function Profile() {
  const { user, logout } = useAuth()
  const role = normalizeRole(user?.role)

  if (role === 'ADMIN') {
    return (
      <AdminLayout title="Profile">
        <ProfileForm />
      </AdminLayout>
    )
  }
  if (role === 'PLACEMENT_OFFICER') {
    return (
      <POLayout title="Profile">
        <ProfileForm />
      </POLayout>
    )
  }
  return (
    <DashboardLayout
      title="Profile"
      user={user}
      onLogout={logout}
      sidebarItems={getDashboardSidebarItems(user?.role)}
    >
      <ProfileForm />
    </DashboardLayout>
  )
}
