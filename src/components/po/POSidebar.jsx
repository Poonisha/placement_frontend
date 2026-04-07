import { NavLink } from 'react-router-dom'
import { LayoutDashboard, ClipboardList, LineChart, Building2 } from 'lucide-react'

const poItems = [
  { to: '/po/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/po/records', label: 'Placement Records', icon: ClipboardList },
  { to: '/po/reports', label: 'Reports', icon: LineChart },
  { to: '/po/companies', label: 'Companies', icon: Building2 },
]

function linkClass({ isActive }) {
  return [
    'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150',
    isActive ? 'bg-gray-800 text-white' : 'text-slate-300 hover:bg-slate-800/80 hover:text-white',
  ].join(' ')
}

export default function POSidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-r border-slate-800 bg-slate-950 lg:flex">
      <div className="border-b border-slate-800 px-6 py-6">
        <p className="text-lg font-semibold tracking-tight text-white">PlaceConnect</p>
        <p className="mt-1 text-xs uppercase tracking-wider text-slate-400">Placement Officer</p>
      </div>
      <nav className="flex-1 space-y-2 p-4">
        {poItems.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
            <item.icon className="h-4.5 w-4.5 shrink-0 opacity-90" strokeWidth={1.8} aria-hidden />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
