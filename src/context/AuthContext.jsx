import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { USER_STORAGE_KEY, normalizeRole } from '../services/api.js'

const AuthContext = createContext(null)

function readStoredUser() {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(readStoredUser)

  const setUser = useCallback((nextUser) => {
    if (nextUser) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser))
      setUserState(nextUser)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(USER_STORAGE_KEY)
    setUserState(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      role: normalizeRole(user?.role),
      setUser,
      logout,
    }),
    [user, setUser, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
