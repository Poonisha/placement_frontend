import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { normalizeRole, ROLE_HOME, USER_STORAGE_KEY } from '../services/api.js'

function readStoredUser() {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth()
  const location = useLocation()
  const effectiveUser = user ?? readStoredUser()
  const role = normalizeRole(effectiveUser?.role)
  const allowed = allowedRoles.map(normalizeRole)

  if (!effectiveUser) {
    return <Navigate to="/" state={{ from: location }} replace />
  }

  if (allowed.length && !allowed.includes(role)) {
    const fallback = ROLE_HOME[role] || '/'
    return <Navigate to={fallback} replace />
  }

  return children
}

export function AuthGate({ children }) {
  const { user } = useAuth()
  const effectiveUser = user ?? readStoredUser()

  if (effectiveUser) {
    const r = normalizeRole(effectiveUser.role)
    const to = ROLE_HOME[r]
    if (to) return <Navigate to={to} replace />
  }

  return children
}
