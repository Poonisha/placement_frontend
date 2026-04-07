import {
  LayoutDashboard,
  Briefcase,
  ClipboardList,
  Users,
} from 'lucide-react'
import { normalizeRole } from '../services/api.js'

/**
 * Role-aware nav for the fixed sidebar.
 * `end: true` → NavLink exact match (used for /student vs /student/jobs).
 */
export function getDashboardSidebarItems(role) {
  const r = normalizeRole(role)
  if (r === 'STUDENT') {
    return [
      { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
      { to: '/jobs', label: 'Jobs', icon: Briefcase },
      { to: '/applications', label: 'Applications', icon: ClipboardList },
    ]
  }
  if (r === 'EMPLOYER') {
    return [
      { to: '/employer/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
      { to: '/employer/jobs', label: 'Jobs', icon: Briefcase },
      { to: '/employer/applications', label: 'Applications', icon: ClipboardList },
    ]
  }
  if (r === 'ADMIN') {
    return [
      { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
      { to: '/admin', label: 'Users', icon: Users },
    ]
  }
  if (r === 'OFFICER') {
    return [
      { to: '/officer', label: 'Dashboard', icon: LayoutDashboard, end: true },
      { to: '/officer', label: 'Applications', icon: ClipboardList },
    ]
  }
  return [{ to: '/', label: 'Dashboard', icon: LayoutDashboard }]
}
